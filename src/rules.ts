import type { AttentionIssue, EvaluationContext, HassEntity, UserRule } from "./types";
import { createIssue, parseNumericState, timestampMs } from "./hass";
import { getMatchingEntityIds, getMatchingEntityIdsByLabel, isEntityExcluded } from "./matcher";

const MINUTE_MS = 60 * 1000;

export function evaluateUserRules(context: EvaluationContext): AttentionIssue[] {
  const issues: AttentionIssue[] = [];
  const touchedKeys = new Set<string>();

  for (const compiledRule of context.plan.userRules) {
    const entityIds = new Set<string>();
    if (compiledRule.matcher) {
      for (const entityId of getMatchingEntityIds(context.hass, compiledRule.matcher)) {
        entityIds.add(entityId);
      }
    }
    if (compiledRule.label) {
      for (const entityId of getMatchingEntityIdsByLabel(context.hass, compiledRule.label)) {
        entityIds.add(entityId);
      }
    }

    for (const entityId of entityIds) {
      const memoryKey = ruleMemoryKey(compiledRule.index, entityId);
      touchedKeys.add(memoryKey);

      if (isEntityExcluded(entityId, context.hass, context.plan.exclusions)) {
        resetRuleMemory(context, memoryKey);
        continue;
      }
      const entity = context.hass.states[entityId];
      if (!entity) {
        resetRuleMemory(context, memoryKey);
        continue;
      }
      const result = evaluateRuleForEntity(compiledRule.rule, entity, entityId, context, memoryKey);
      if (!result.matched) {
        continue;
      }
      issues.push(
        createIssue({
          hass: context.hass,
          entityId,
          severity: compiledRule.rule.severity ?? "warning",
          title: compiledRule.rule.title,
          message: result.message,
          activeSinceMs: result.activeSinceMs,
          source: "rule",
          id: `rule:${compiledRule.index}:${entityId}`,
          actions: compiledRule.rule.actions,
        }),
      );
    }
  }

  for (const key of context.ruleDurationMemory.firstMatchedAtMs.keys()) {
    if (!touchedKeys.has(key)) {
      resetRuleMemory(context, key);
    }
  }
  for (const key of context.ruleDurationMemory.activeHysteresisKeys) {
    if (!touchedKeys.has(key)) {
      resetRuleMemory(context, key);
    }
  }

  return issues;
}

export function evaluateRuleForEntity(
  rule: UserRule,
  entity: HassEntity,
  entityId: string,
  context: EvaluationContext,
  memoryKey: string,
): { matched: true; message: string; activeSinceMs: number } | { matched: false } {
  const condition = evaluateRuleCondition(rule, entity, entityId, context, memoryKey);
  if (!condition.matched) {
    resetRuleMemory(context, memoryKey);
    return { matched: false };
  }

  const nowMs = context.now.getTime();
  const firstMatchedAtMs =
    context.ruleDurationMemory.firstMatchedAtMs.get(memoryKey) ??
    initialFirstMatchedAtMs(rule, entity, nowMs);
  context.ruleDurationMemory.firstMatchedAtMs.set(memoryKey, firstMatchedAtMs);

  const requiredMs = (rule.for_minutes ?? 0) * MINUTE_MS;
  const issueActiveSinceMs = firstMatchedAtMs + requiredMs;
  if (requiredMs > 0 && nowMs < issueActiveSinceMs) {
    return { matched: false };
  }

  if (hasHysteresis(rule)) {
    context.ruleDurationMemory.activeHysteresisKeys.add(memoryKey);
  }

  return {
    matched: true,
    message: condition.message,
    activeSinceMs: issueActiveSinceMs,
  };
}

function evaluateRuleCondition(
  rule: UserRule,
  entity: HassEntity,
  entityId: string,
  context: EvaluationContext,
  memoryKey: string,
): { matched: true; message: string } | { matched: false } {
  const rawValue = getRuleValue(rule, entity);
  const messages: string[] = [];

  if (rule.state !== undefined) {
    if (!valuesEqual(rawValue, rule.state)) {
      return { matched: false };
    }
    messages.push(`${describeValue(rule)} is ${String(rule.state)}`);
  }

  if (rule.not_state !== undefined) {
    if (valuesEqual(rawValue, rule.not_state)) {
      return { matched: false };
    }
    messages.push(`${describeValue(rule)} is not ${String(rule.not_state)}`);
  }

  const above = resolveRuleThreshold(rule.above, rule.above_entity, "above", entityId, context);
  const below = resolveRuleThreshold(rule.below, rule.below_entity, "below", entityId, context);
  if (above.invalid || below.invalid) {
    return { matched: false };
  }

  const hasNumericCondition = above.value !== undefined || below.value !== undefined;
  const numeric = hasNumericCondition ? parseNumericState(rawValue) : undefined;
  if (hasNumericCondition && numeric === undefined) {
    return { matched: false };
  }

  const hysteresisActive = context.ruleDurationMemory.activeHysteresisKeys.has(memoryKey);

  if (above.value !== undefined && numeric !== undefined) {
    if (rule.clear_below !== undefined && rule.clear_below >= above.value) {
      addDiagnostic(
        context,
        `invalid-clear-below:${memoryKey}`,
        `Rule for ${entityId} requires clear_below to be lower than its resolved above threshold.`,
      );
      return { matched: false };
    }
    const matches =
      hysteresisActive && rule.clear_below !== undefined
        ? numeric >= rule.clear_below
        : numeric > above.value;
    if (!matches) {
      return { matched: false };
    }
    messages.push(
      hysteresisActive && rule.clear_below !== undefined
        ? `${describeValue(rule)} ${formatNumber(numeric)} has not cleared below ${rule.clear_below}`
        : `${describeValue(rule)} ${formatNumber(numeric)} is above ${above.value}`,
    );
  }

  if (below.value !== undefined && numeric !== undefined) {
    if (rule.clear_above !== undefined && rule.clear_above <= below.value) {
      addDiagnostic(
        context,
        `invalid-clear-above:${memoryKey}`,
        `Rule for ${entityId} requires clear_above to be higher than its resolved below threshold.`,
      );
      return { matched: false };
    }
    const matches =
      hysteresisActive && rule.clear_above !== undefined
        ? numeric <= rule.clear_above
        : numeric < below.value;
    if (!matches) {
      return { matched: false };
    }
    messages.push(
      hysteresisActive && rule.clear_above !== undefined
        ? `${describeValue(rule)} ${formatNumber(numeric)} has not cleared above ${rule.clear_above}`
        : `${describeValue(rule)} ${formatNumber(numeric)} is below ${below.value}`,
    );
  }

  return {
    matched: true,
    message: messages.length > 0 ? messages.join("; ") : "Rule matched",
  };
}

function resolveRuleThreshold(
  fixedValue: number | undefined,
  thresholdEntityId: string | undefined,
  field: "above" | "below",
  entityId: string,
  context: EvaluationContext,
): { value?: number; invalid: boolean } {
  if (!thresholdEntityId) {
    return { value: fixedValue, invalid: false };
  }
  const value = parseNumericState(context.hass.states[thresholdEntityId]?.state);
  if (value === undefined) {
    addDiagnostic(
      context,
      `invalid-rule-threshold:${field}:${entityId}:${thresholdEntityId}`,
      `${field}_entity (${thresholdEntityId}) for ${entityId} must have an available finite numeric state.`,
    );
    return { invalid: true };
  }
  return { value, invalid: false };
}

function getRuleValue(rule: UserRule, entity: HassEntity): unknown {
  if (!rule.attribute) {
    return entity.state;
  }
  return entity.attributes[rule.attribute];
}

function initialFirstMatchedAtMs(rule: UserRule, entity: HassEntity, nowMs: number): number {
  const isDirectStateRule =
    rule.attribute === undefined &&
    rule.above === undefined &&
    rule.above_entity === undefined &&
    rule.below === undefined &&
    rule.below_entity === undefined &&
    (rule.state !== undefined || rule.not_state !== undefined);

  return isDirectStateRule ? (timestampMs(entity.last_changed) ?? nowMs) : nowMs;
}

function hasHysteresis(rule: UserRule): boolean {
  return rule.clear_below !== undefined || rule.clear_above !== undefined;
}

function resetRuleMemory(context: EvaluationContext, memoryKey: string): void {
  context.ruleDurationMemory.firstMatchedAtMs.delete(memoryKey);
  context.ruleDurationMemory.activeHysteresisKeys.delete(memoryKey);
}

function addDiagnostic(context: EvaluationContext, code: string, message: string): void {
  context.diagnostics.set(code, { code, message });
}

function valuesEqual(actual: unknown, expected: string | number | boolean): boolean {
  return String(actual) === String(expected);
}

function describeValue(rule: UserRule): string {
  return rule.attribute ? `Attribute ${rule.attribute}` : "State";
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function ruleMemoryKey(ruleIndex: number, entityId: string): string {
  return `rule:${ruleIndex}:${entityId}`;
}

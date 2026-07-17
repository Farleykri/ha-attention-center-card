import type { AttentionIssue, EvaluationContext, HassEntity, UserRule } from "./types";
import { createIssue, parseNumericState, timestampMs } from "./hass";
import { getMatchingEntityIds, isEntityExcluded } from "./matcher";

const MINUTE_MS = 60 * 1000;

export function evaluateUserRules(context: EvaluationContext): AttentionIssue[] {
  const issues: AttentionIssue[] = [];
  const touchedKeys = new Set<string>();

  for (const compiledRule of context.plan.userRules) {
    const entityIds = getMatchingEntityIds(context.hass, compiledRule.matcher);
    for (const entityId of entityIds) {
      const memoryKey = ruleMemoryKey(compiledRule.index, entityId);
      touchedKeys.add(memoryKey);

      if (isEntityExcluded(entityId, context.hass, context.plan.exclusions)) {
        context.ruleDurationMemory.firstMatchedAtMs.delete(memoryKey);
        continue;
      }
      const entity = context.hass.states[entityId];
      if (!entity) {
        context.ruleDurationMemory.firstMatchedAtMs.delete(memoryKey);
        continue;
      }
      const result = evaluateRuleForEntity(
        compiledRule.rule,
        entity,
        context.now.getTime(),
        context.ruleDurationMemory,
        memoryKey,
      );
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
        }),
      );
    }
  }

  for (const key of context.ruleDurationMemory.firstMatchedAtMs.keys()) {
    if (!touchedKeys.has(key)) {
      context.ruleDurationMemory.firstMatchedAtMs.delete(key);
    }
  }

  return issues;
}

export function evaluateRuleForEntity(
  rule: UserRule,
  entity: HassEntity,
  nowMs: number,
  memory: EvaluationContext["ruleDurationMemory"],
  memoryKey: string,
): { matched: true; message: string; activeSinceMs: number } | { matched: false } {
  const condition = evaluateRuleCondition(rule, entity);
  if (!condition.matched) {
    memory.firstMatchedAtMs.delete(memoryKey);
    return { matched: false };
  }

  const firstMatchedAtMs =
    memory.firstMatchedAtMs.get(memoryKey) ?? initialFirstMatchedAtMs(rule, entity, nowMs);
  memory.firstMatchedAtMs.set(memoryKey, firstMatchedAtMs);

  const requiredMs = (rule.for_minutes ?? 0) * MINUTE_MS;
  const issueActiveSinceMs = firstMatchedAtMs + requiredMs;
  if (requiredMs > 0 && nowMs < issueActiveSinceMs) {
    return { matched: false };
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

  if (rule.above !== undefined) {
    const numeric = parseNumericState(rawValue);
    if (numeric === undefined || numeric <= rule.above) {
      return { matched: false };
    }
    messages.push(`${describeValue(rule)} ${formatNumber(numeric)} is above ${rule.above}`);
  }

  if (rule.below !== undefined) {
    const numeric = parseNumericState(rawValue);
    if (numeric === undefined || numeric >= rule.below) {
      return { matched: false };
    }
    messages.push(`${describeValue(rule)} ${formatNumber(numeric)} is below ${rule.below}`);
  }

  return {
    matched: true,
    message: messages.length > 0 ? messages.join("; ") : "Rule matched",
  };
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
    rule.below === undefined &&
    (rule.state !== undefined || rule.not_state !== undefined);

  return isDirectStateRule ? (timestampMs(entity.last_changed) ?? nowMs) : nowMs;
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

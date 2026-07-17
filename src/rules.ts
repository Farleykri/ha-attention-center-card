import type { AttentionIssue, EvaluationContext, HassEntity, UserRule } from "./types";
import { createIssue, parseNumericState, timestampMs } from "./hass";
import { getMatchingEntityIds, isEntityExcluded } from "./matcher";

const MINUTE_MS = 60 * 1000;

export function evaluateUserRules(context: EvaluationContext): AttentionIssue[] {
  const issues: AttentionIssue[] = [];
  for (const compiledRule of context.plan.userRules) {
    const entityIds = getMatchingEntityIds(context.hass, compiledRule.matcher);
    for (const entityId of entityIds) {
      if (isEntityExcluded(entityId, context.hass, context.plan.exclusions)) {
        continue;
      }
      const entity = context.hass.states[entityId];
      if (!entity) {
        continue;
      }
      const result = evaluateRuleForEntity(compiledRule.rule, entity, context.now.getTime());
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
  return issues;
}

export function evaluateRuleForEntity(
  rule: UserRule,
  entity: HassEntity,
  nowMs: number,
): { matched: true; message: string; activeSinceMs: number } | { matched: false } {
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

  const baseTime = timestampMs(rule.attribute ? entity.last_updated : entity.last_changed) ?? nowMs;
  const requiredMs = (rule.for_minutes ?? 0) * MINUTE_MS;
  if (requiredMs > 0 && nowMs - baseTime < requiredMs) {
    return { matched: false };
  }

  return {
    matched: true,
    message: messages.length > 0 ? messages.join("; ") : "Rule matched",
    activeSinceMs: baseTime + requiredMs,
  };
}

function getRuleValue(rule: UserRule, entity: HassEntity): unknown {
  if (!rule.attribute) {
    return entity.state;
  }
  return entity.attributes[rule.attribute];
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

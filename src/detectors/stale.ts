import type { AttentionIssue, EvaluationContext, StaleRule } from "../types";
import { createIssue, timestampMs } from "../hass";
import { getMatchingEntityIds, isEntityExcluded } from "../matcher";

const HOUR_MS = 60 * 60 * 1000;

export function detectStaleEntities(context: EvaluationContext): AttentionIssue[] {
  const issues: AttentionIssue[] = [];
  const seen = new Set<string>();

  if (context.plan.config.detect_stale) {
    for (const entityId of Object.keys(context.hass.states)) {
      addStaleIssueForRule(
        context,
        entityId,
        {
          entity_id: entityId,
          hours: context.plan.config.stale_hours,
          severity: "warning",
        },
        issues,
        seen,
        "global",
      );
    }
  }

  for (const compiledRule of context.plan.staleRules) {
    const entityIds = getMatchingEntityIds(context.hass, compiledRule.matcher);
    for (const entityId of entityIds) {
      addStaleIssueForRule(
        context,
        entityId,
        compiledRule.rule,
        issues,
        seen,
        `rule:${compiledRule.index}`,
      );
    }
  }

  return issues;
}

function addStaleIssueForRule(
  context: EvaluationContext,
  entityId: string,
  rule: StaleRule,
  issues: AttentionIssue[],
  seen: Set<string>,
  idPrefix: string,
): void {
  if (
    seen.has(`${idPrefix}:${entityId}`) ||
    isEntityExcluded(entityId, context.hass, context.plan.exclusions)
  ) {
    return;
  }

  const entity = context.hass.states[entityId];
  if (!entity) {
    return;
  }

  const lastTouched = timestampMs(entity.last_updated) ?? timestampMs(entity.last_changed);
  if (lastTouched === undefined) {
    return;
  }

  const staleAfterMs = rule.hours * HOUR_MS;
  const staleSinceMs = lastTouched + staleAfterMs;
  if (context.now.getTime() < staleSinceMs) {
    return;
  }

  seen.add(`${idPrefix}:${entityId}`);
  issues.push(
    createIssue({
      hass: context.hass,
      entityId,
      severity: rule.severity ?? "warning",
      title: rule.title,
      message: `No update for ${formatHours(rule.hours)}`,
      activeSinceMs: staleSinceMs,
      source: "stale",
      id: `stale:${idPrefix}:${entityId}`,
    }),
  );
}

function formatHours(hours: number): string {
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

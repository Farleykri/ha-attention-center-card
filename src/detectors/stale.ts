import type { AttentionIssue, EvaluationContext, StaleRule } from "../types";
import { createIssue, timestampMs } from "../hass";
import { getMatchingEntityIds, isEntityExcluded } from "../matcher";

const HOUR_MS = 60 * 60 * 1000;

export function detectStaleEntities(context: EvaluationContext): AttentionIssue[] {
  const issues: AttentionIssue[] = [];
  const seenEntityIds = new Set<string>();
  const explicitEntityIds = new Set<string>();

  for (const compiledRule of context.plan.staleRules) {
    const entityIds = getMatchingEntityIds(context.hass, compiledRule.matcher);
    for (const entityId of entityIds) {
      explicitEntityIds.add(entityId);
      addStaleIssueForRule(context, entityId, compiledRule.rule, issues, seenEntityIds);
    }
  }

  if (context.plan.config.detect_stale) {
    for (const entityId of Object.keys(context.hass.states)) {
      if (explicitEntityIds.has(entityId)) {
        continue;
      }
      addStaleIssueForRule(
        context,
        entityId,
        {
          entity_id: entityId,
          hours: context.plan.config.stale_hours,
          severity: "warning",
        },
        issues,
        seenEntityIds,
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
  seenEntityIds: Set<string>,
): void {
  if (
    seenEntityIds.has(entityId) ||
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

  seenEntityIds.add(entityId);
  issues.push(
    createIssue({
      hass: context.hass,
      entityId,
      severity: rule.severity ?? "warning",
      title: rule.title,
      message: `No update for ${formatHours(rule.hours)}`,
      activeSinceMs: staleSinceMs,
      source: "stale",
      id: `stale:${entityId}`,
    }),
  );
}

function formatHours(hours: number): string {
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

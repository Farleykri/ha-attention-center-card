import type { AttentionIssue, EvaluationContext } from "../types";
import { createIssue, timestampMs } from "../hass";
import { isEntityExcluded, isEntityIncludedByLabels } from "../matcher";

const MINUTE_MS = 60 * 1000;

export function detectUnavailableEntities(context: EvaluationContext): AttentionIssue[] {
  const { availability, include } = context.plan.config;
  const connectedAtMs = context.connectedAtMs ?? context.now.getTime();
  if (
    availability.startup_grace_minutes > 0 &&
    context.now.getTime() < connectedAtMs + availability.startup_grace_minutes * MINUTE_MS
  ) {
    return [];
  }

  const issues: AttentionIssue[] = [];
  for (const [entityId, entity] of Object.entries(context.hass.states)) {
    const isUnknown = entity.state === "unknown";
    const isUnavailable = entity.state === "unavailable";
    if (
      (!isUnknown && !isUnavailable) ||
      (isUnknown && !availability.detect_unknown) ||
      (isUnavailable && !availability.detect_unavailable) ||
      !isEntityIncludedByLabels(entityId, context.hass, include.labels) ||
      isEntityExcluded(entityId, context.hass, context.plan.exclusions)
    ) {
      continue;
    }

    const forMinutes = isUnknown
      ? availability.unknown_for_minutes
      : availability.unavailable_for_minutes;
    const conditionSinceMs = timestampMs(entity.last_changed) ?? context.now.getTime();
    const issueActiveSinceMs = conditionSinceMs + forMinutes * MINUTE_MS;
    if (context.now.getTime() < issueActiveSinceMs) {
      continue;
    }

    const stateLabel = isUnknown ? "unknown" : "unavailable";
    issues.push(
      createIssue({
        hass: context.hass,
        entityId,
        severity: isUnknown ? availability.unknown_severity : availability.unavailable_severity,
        message: `State is ${stateLabel}`,
        activeSinceMs: issueActiveSinceMs,
        source: "unavailable",
        id: `unavailable:${entityId}`,
      }),
    );
  }
  return issues;
}

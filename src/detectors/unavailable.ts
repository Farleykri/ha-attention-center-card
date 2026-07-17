import type { AttentionIssue, EvaluationContext } from "../types";
import { createIssue, isUnavailableState, timestampMs } from "../hass";
import { isEntityExcluded } from "../matcher";

export function detectUnavailableEntities(context: EvaluationContext): AttentionIssue[] {
  const { config, exclusions } = context.plan;
  if (!config.detect_unavailable) {
    return [];
  }

  const issues: AttentionIssue[] = [];
  for (const [entityId, entity] of Object.entries(context.hass.states)) {
    if (!isUnavailableState(entity.state) || isEntityExcluded(entityId, context.hass, exclusions)) {
      continue;
    }
    const stateLabel = entity.state === "unknown" ? "unknown" : "unavailable";
    issues.push(
      createIssue({
        hass: context.hass,
        entityId,
        severity: "warning",
        message: `State is ${stateLabel}`,
        activeSinceMs: timestampMs(entity.last_changed),
        source: "unavailable",
        id: `unavailable:${entityId}`,
      }),
    );
  }
  return issues;
}

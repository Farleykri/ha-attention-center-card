import type {
  AttentionIssue,
  BatteryThresholdOverride,
  EvaluationContext,
  HassEntity,
  Severity,
} from "../types";
import { createIssue, parseNumericState, timestampMs } from "../hass";
import { isEntityExcluded } from "../matcher";

const BATTERY_ID_PATTERNS = [
  /(^|[._-])battery($|[._-])/i,
  /(^|[._-])battery_level($|[._-])/i,
  /(^|[._-])battery_percent(age)?($|[._-])/i,
  /(^|[._-])battery_percentage($|[._-])/i,
  /(^|[._-])low_battery($|[._-])/i,
];

export function detectLowBatteries(context: EvaluationContext): AttentionIssue[] {
  const { config, exclusions } = context.plan;
  if (!config.detect_batteries) {
    return [];
  }

  const issues: AttentionIssue[] = [];
  for (const [entityId, entity] of Object.entries(context.hass.states)) {
    if (
      !isBatteryEntity(entityId, entity) ||
      isEntityExcluded(entityId, context.hass, exclusions)
    ) {
      continue;
    }

    const percentage = parseNumericState(entity.state);
    if (percentage === undefined) {
      continue;
    }

    const thresholds = getBatteryThresholds(context, entityId);
    const severity = getBatterySeverity(percentage, thresholds);
    if (!severity) {
      continue;
    }

    const threshold = severity === "critical" ? thresholds.critical : thresholds.warning;
    issues.push(
      createIssue({
        hass: context.hass,
        entityId,
        severity,
        message: `Battery is ${formatBatteryValue(percentage)}% (${severity} below ${threshold}%)`,
        activeSinceMs: timestampMs(entity.last_changed),
        source: "battery",
        id: `battery:${entityId}`,
      }),
    );
  }
  return issues;
}

export function isBatteryEntity(entityId: string, entity: HassEntity): boolean {
  const deviceClass = entity.attributes.device_class;
  const unit = entity.attributes.unit_of_measurement;
  if (deviceClass === "battery") {
    return true;
  }
  if (
    typeof unit === "string" &&
    unit.trim() === "%" &&
    BATTERY_ID_PATTERNS.some((pattern) => pattern.test(entityId))
  ) {
    return true;
  }
  return BATTERY_ID_PATTERNS.some((pattern) => pattern.test(entityId));
}

function getBatteryThresholds(
  context: EvaluationContext,
  entityId: string,
): { warning: number; critical: number } {
  const override = context.plan.config.battery_thresholds[entityId];
  if (override === undefined) {
    return {
      warning: context.plan.config.battery_warning,
      critical: context.plan.config.battery_critical,
    };
  }

  if (typeof override === "number") {
    return {
      warning: override,
      critical: Math.min(context.plan.config.battery_critical, override),
    };
  }

  return {
    warning: override.warning ?? context.plan.config.battery_warning,
    critical: override.critical ?? context.plan.config.battery_critical,
  };
}

function getBatterySeverity(
  percentage: number,
  thresholds: { warning: number; critical: number },
): Severity | undefined {
  if (percentage < thresholds.critical) {
    return "critical";
  }
  if (percentage < thresholds.warning) {
    return "warning";
  }
  return undefined;
}

function formatBatteryValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export type { BatteryThresholdOverride };

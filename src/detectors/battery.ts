import type {
  AttentionIssue,
  BatteryThresholdOverride,
  EvaluationContext,
  HassEntity,
  Severity,
} from "../types";
import { createIssue, parseNumericState, timestampMs } from "../hass";
import { isEntityExcluded, isEntityIncludedByLabels } from "../matcher";

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

  const globalThresholds = resolveGlobalBatteryThresholds(context);
  if (!globalThresholds) {
    return [];
  }

  const issues: AttentionIssue[] = [];
  for (const [entityId, entity] of Object.entries(context.hass.states)) {
    if (
      entityId === config.battery_warning_entity ||
      entityId === config.battery_critical_entity ||
      !isBatteryEntity(entityId, entity) ||
      !isEntityIncludedByLabels(entityId, context.hass, config.include.labels) ||
      isEntityExcluded(entityId, context.hass, exclusions)
    ) {
      continue;
    }

    const percentage = parseNumericState(entity.state);
    if (percentage === undefined) {
      continue;
    }

    const thresholds = getBatteryThresholds(context, entityId, globalThresholds);
    if (thresholds.critical >= thresholds.warning) {
      addDiagnostic(
        context,
        `battery-threshold-order:${entityId}`,
        `Battery thresholds for ${entityId} are invalid: critical must be lower than warning.`,
      );
      continue;
    }
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
  globalThresholds: { warning: number; critical: number },
): { warning: number; critical: number } {
  const override = context.plan.config.battery_thresholds[entityId];
  if (override === undefined) {
    return {
      warning: globalThresholds.warning,
      critical: globalThresholds.critical,
    };
  }

  if (typeof override === "number") {
    return {
      warning: override,
      critical: globalThresholds.critical,
    };
  }

  return {
    warning: override.warning ?? globalThresholds.warning,
    critical: override.critical ?? globalThresholds.critical,
  };
}

function resolveGlobalBatteryThresholds(
  context: EvaluationContext,
): { warning: number; critical: number } | undefined {
  const { config } = context.plan;
  const warning = resolveThresholdEntity(
    context,
    config.battery_warning_entity,
    config.battery_warning,
    "battery_warning_entity",
  );
  const critical = resolveThresholdEntity(
    context,
    config.battery_critical_entity,
    config.battery_critical,
    "battery_critical_entity",
  );
  if (warning === undefined || critical === undefined) {
    return undefined;
  }
  if (critical >= warning) {
    addDiagnostic(
      context,
      "battery-threshold-order",
      "Resolved battery_critical must be lower than battery_warning.",
    );
    return undefined;
  }
  return { warning, critical };
}

function resolveThresholdEntity(
  context: EvaluationContext,
  entityId: string | undefined,
  fallback: number,
  field: string,
): number | undefined {
  if (!entityId) {
    return fallback;
  }
  const value = parseNumericState(context.hass.states[entityId]?.state);
  if (value === undefined || value <= 0) {
    addDiagnostic(
      context,
      `invalid-threshold:${field}`,
      `${field} (${entityId}) must have an available finite positive numeric state.`,
    );
    return undefined;
  }
  return value;
}

function addDiagnostic(context: EvaluationContext, code: string, message: string): void {
  context.diagnostics.set(code, { code, message });
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

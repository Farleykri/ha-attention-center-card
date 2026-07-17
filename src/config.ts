import type {
  AttentionCenterCardConfig,
  BatteryThresholdOverride,
  DisplayMode,
  EmptyState,
  ExclusionConfig,
  NormalizedAttentionCenterCardConfig,
  Severity,
  StaleRule,
  UserRule,
} from "./types";

export const DEFAULT_TITLE = "Attention Center";
export const DEFAULT_BATTERY_WARNING = 30;
export const DEFAULT_BATTERY_CRITICAL = 15;
export const DEFAULT_STALE_HOURS = 24;

const SEVERITIES = new Set<Severity>(["critical", "warning", "info"]);
const DISPLAY_MODES = new Set<DisplayMode>(["full", "compact", "summary"]);
const EMPTY_STATES = new Set<EmptyState>(["message", "hide"]);

export const DEFAULT_CONFIG: NormalizedAttentionCenterCardConfig = {
  title: DEFAULT_TITLE,
  detect_unavailable: true,
  detect_batteries: true,
  detect_stale: false,
  stale_hours: DEFAULT_STALE_HOURS,
  battery_warning: DEFAULT_BATTERY_WARNING,
  battery_critical: DEFAULT_BATTERY_CRITICAL,
  battery_thresholds: {},
  display_mode: "full",
  empty_state: "message",
  reverse_age_sort: false,
  exclude: {
    domains: [],
    entities: [],
    devices: [],
    areas: [],
    patterns: [],
  },
  stale_rules: [],
  rules: [],
};

export function isSeverity(value: unknown): value is Severity {
  return typeof value === "string" && SEVERITIES.has(value as Severity);
}

export function normalizeConfig(
  config: AttentionCenterCardConfig,
): NormalizedAttentionCenterCardConfig {
  if (!isPlainObject(config)) {
    throw new Error("Attention Center Card configuration must be an object.");
  }

  const title = normalizeOptionalString(config.title, "title") ?? DEFAULT_TITLE;
  const batteryWarning = normalizeOptionalNumber(
    config.battery_warning,
    "battery_warning",
    DEFAULT_BATTERY_WARNING,
  );
  const batteryCritical = normalizeOptionalNumber(
    config.battery_critical,
    "battery_critical",
    DEFAULT_BATTERY_CRITICAL,
  );

  if (batteryCritical >= batteryWarning) {
    throw new Error("battery_critical must be lower than battery_warning.");
  }

  const displayMode = normalizeEnum(
    config.display_mode,
    "display_mode",
    DISPLAY_MODES,
    DEFAULT_CONFIG.display_mode,
  );
  const emptyState = normalizeEnum(
    config.empty_state,
    "empty_state",
    EMPTY_STATES,
    DEFAULT_CONFIG.empty_state,
  );

  return {
    ...config,
    title,
    detect_unavailable: config.detect_unavailable ?? DEFAULT_CONFIG.detect_unavailable,
    detect_batteries: config.detect_batteries ?? DEFAULT_CONFIG.detect_batteries,
    detect_stale: config.detect_stale ?? DEFAULT_CONFIG.detect_stale,
    stale_hours: normalizePositiveNumber(config.stale_hours, "stale_hours", DEFAULT_STALE_HOURS),
    battery_warning: batteryWarning,
    battery_critical: batteryCritical,
    battery_thresholds: normalizeBatteryThresholds(config.battery_thresholds),
    display_mode: displayMode,
    empty_state: emptyState,
    reverse_age_sort: config.reverse_age_sort ?? DEFAULT_CONFIG.reverse_age_sort,
    exclude: normalizeExclusions(config.exclude),
    stale_rules: normalizeStaleRules(config.stale_rules),
    rules: normalizeRules(config.rules),
  };
}

export function configKey(config: NormalizedAttentionCenterCardConfig): string {
  return JSON.stringify(config);
}

function normalizeExclusions(exclude: ExclusionConfig | undefined): Required<ExclusionConfig> {
  return {
    domains: normalizeStringArray(exclude?.domains, "exclude.domains"),
    entities: normalizeStringArray(exclude?.entities, "exclude.entities"),
    devices: normalizeStringArray(exclude?.devices, "exclude.devices"),
    areas: normalizeStringArray(exclude?.areas, "exclude.areas"),
    patterns: normalizeStringArray(exclude?.patterns, "exclude.patterns"),
  };
}

function normalizeRules(rules: UserRule[] | undefined): UserRule[] {
  if (rules === undefined) {
    return [];
  }
  if (!Array.isArray(rules)) {
    throw new Error("rules must be a list.");
  }

  return rules.map((rule, index) => {
    if (!isPlainObject(rule)) {
      throw new Error(`rules[${index}] must be an object.`);
    }
    const entityId = normalizeRequiredString(rule.entity_id, `rules[${index}].entity_id`);
    const severity = normalizeSeverity(rule.severity, `rules[${index}].severity`, "warning");

    if (rule.attribute !== undefined && typeof rule.attribute !== "string") {
      throw new Error(`rules[${index}].attribute must be a string.`);
    }
    if (rule.title !== undefined && typeof rule.title !== "string") {
      throw new Error(`rules[${index}].title must be a string.`);
    }
    if (rule.above !== undefined && !isFiniteNumber(rule.above)) {
      throw new Error(`rules[${index}].above must be a number.`);
    }
    if (rule.below !== undefined && !isFiniteNumber(rule.below)) {
      throw new Error(`rules[${index}].below must be a number.`);
    }
    if (
      rule.for_minutes !== undefined &&
      (!isFiniteNumber(rule.for_minutes) || rule.for_minutes < 0)
    ) {
      throw new Error(`rules[${index}].for_minutes must be zero or greater.`);
    }

    const hasCondition =
      rule.state !== undefined ||
      rule.not_state !== undefined ||
      rule.above !== undefined ||
      rule.below !== undefined;

    if (!hasCondition) {
      throw new Error(`rules[${index}] must define state, not_state, above, or below.`);
    }

    return {
      ...rule,
      entity_id: entityId,
      severity,
    };
  });
}

function normalizeStaleRules(rules: StaleRule[] | undefined): StaleRule[] {
  if (rules === undefined) {
    return [];
  }
  if (!Array.isArray(rules)) {
    throw new Error("stale_rules must be a list.");
  }

  return rules.map((rule, index) => {
    if (!isPlainObject(rule)) {
      throw new Error(`stale_rules[${index}] must be an object.`);
    }
    return {
      ...rule,
      entity_id: normalizeRequiredString(rule.entity_id, `stale_rules[${index}].entity_id`),
      hours: normalizePositiveNumber(rule.hours, `stale_rules[${index}].hours`),
      severity: normalizeSeverity(rule.severity, `stale_rules[${index}].severity`, "warning"),
      title: normalizeOptionalString(rule.title, `stale_rules[${index}].title`),
    };
  });
}

function normalizeBatteryThresholds(
  thresholds: AttentionCenterCardConfig["battery_thresholds"],
): Record<string, number | BatteryThresholdOverride> {
  if (thresholds === undefined) {
    return {};
  }
  if (!isPlainObject(thresholds)) {
    throw new Error("battery_thresholds must be an object.");
  }

  const normalized: Record<string, number | BatteryThresholdOverride> = {};
  for (const [entityId, value] of Object.entries(thresholds)) {
    if (typeof value === "number") {
      if (!isFiniteNumber(value) || value <= 0) {
        throw new Error(`battery_thresholds.${entityId} must be a positive number.`);
      }
      normalized[entityId] = value;
      continue;
    }
    if (!isPlainObject(value)) {
      throw new Error(`battery_thresholds.${entityId} must be a number or object.`);
    }
    const warning = value.warning;
    const critical = value.critical;
    if (warning !== undefined && (!isFiniteNumber(warning) || warning <= 0)) {
      throw new Error(`battery_thresholds.${entityId}.warning must be a positive number.`);
    }
    if (critical !== undefined && (!isFiniteNumber(critical) || critical <= 0)) {
      throw new Error(`battery_thresholds.${entityId}.critical must be a positive number.`);
    }
    if (warning !== undefined && critical !== undefined && critical >= warning) {
      throw new Error(
        `battery_thresholds.${entityId}.critical must be lower than warning when both are set.`,
      );
    }
    normalized[entityId] = { warning, critical };
  }
  return normalized;
}

function normalizeStringArray(value: string[] | undefined, field: string): string[] {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${field} must be a list of strings.`);
  }
  return value.map((item) => item.trim()).filter(Boolean);
}

function normalizeRequiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string.`);
  }
  return value.trim();
}

function normalizeOptionalString(value: unknown, field: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string.`);
  }
  return value.trim();
}

function normalizeOptionalNumber(value: unknown, field: string, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }
  return normalizePositiveNumber(value, field);
}

function normalizePositiveNumber(value: unknown, field: string, fallback?: number): number {
  if (value === undefined && fallback !== undefined) {
    return fallback;
  }
  if (!isFiniteNumber(value) || value <= 0) {
    throw new Error(`${field} must be a positive number.`);
  }
  return value;
}

function normalizeSeverity(value: unknown, field: string, fallback: Severity): Severity {
  if (value === undefined) {
    return fallback;
  }
  if (!isSeverity(value)) {
    throw new Error(`${field} must be one of critical, warning, or info.`);
  }
  return value;
}

function normalizeEnum<T extends string>(
  value: unknown,
  field: string,
  allowed: Set<T>,
  fallback: T,
): T {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value !== "string" || !allowed.has(value as T)) {
    throw new Error(`${field} is not supported.`);
  }
  return value as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

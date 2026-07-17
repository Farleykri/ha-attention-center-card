import type {
  AttentionCenterCardConfig,
  AvailabilityConfig,
  BatteryThresholdOverride,
  DisplayMode,
  EmptyState,
  ExclusionConfig,
  GroupBy,
  InclusionConfig,
  IssueAction,
  IssueSource,
  NormalizedAttentionCenterCardConfig,
  NormalizedAvailabilityConfig,
  Severity,
  StaleRule,
  UserRule,
} from "./types";

export const DEFAULT_TITLE = "Attention Center";
export const DEFAULT_BATTERY_WARNING = 30;
export const DEFAULT_BATTERY_CRITICAL = 15;
export const DEFAULT_STALE_HOURS = 24;

const SEVERITIES = new Set<Severity>(["critical", "warning", "info"]);
const ISSUE_SOURCES = new Set<IssueSource>(["unavailable", "battery", "stale", "rule"]);
const DISPLAY_MODES = new Set<DisplayMode>(["full", "compact", "summary"]);
const EMPTY_STATES = new Set<EmptyState>(["message", "hide"]);
const GROUP_MODES = new Set<GroupBy>(["none", "severity", "area", "source", "device"]);

export const DEFAULT_CONFIG: NormalizedAttentionCenterCardConfig = {
  title: DEFAULT_TITLE,
  detect_unavailable: true,
  detect_batteries: true,
  detect_stale: false,
  stale_hours: DEFAULT_STALE_HOURS,
  battery_warning: DEFAULT_BATTERY_WARNING,
  battery_critical: DEFAULT_BATTERY_CRITICAL,
  battery_thresholds: {},
  availability: {
    detect_unavailable: true,
    detect_unknown: true,
    unavailable_severity: "warning",
    unknown_severity: "warning",
    unavailable_for_minutes: 0,
    unknown_for_minutes: 0,
    startup_grace_minutes: 0,
  },
  display_mode: "full",
  empty_state: "message",
  reverse_age_sort: false,
  group_by: "none",
  show_severities: ["critical", "warning", "info"],
  show_sources: ["unavailable", "battery", "stale", "rule"],
  collapsed_groups: [],
  include: {
    labels: [],
  },
  exclude: {
    domains: [],
    entities: [],
    devices: [],
    areas: [],
    patterns: [],
    labels: [],
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

  const rawConfig = config as AttentionCenterCardConfig;
  const detectUnavailable = normalizeBoolean(
    rawConfig.detect_unavailable,
    "detect_unavailable",
    DEFAULT_CONFIG.detect_unavailable,
  );

  const title = normalizeOptionalString(rawConfig.title, "title") ?? DEFAULT_TITLE;
  const batteryWarning = normalizeOptionalNumber(
    rawConfig.battery_warning,
    "battery_warning",
    DEFAULT_BATTERY_WARNING,
  );
  const batteryCritical = normalizeOptionalNumber(
    rawConfig.battery_critical,
    "battery_critical",
    DEFAULT_BATTERY_CRITICAL,
  );

  if (batteryCritical >= batteryWarning) {
    throw new Error("battery_critical must be lower than battery_warning.");
  }

  const displayMode = normalizeEnum(
    rawConfig.display_mode,
    "display_mode",
    DISPLAY_MODES,
    DEFAULT_CONFIG.display_mode,
  );
  const emptyState = normalizeEnum(
    rawConfig.empty_state,
    "empty_state",
    EMPTY_STATES,
    DEFAULT_CONFIG.empty_state,
  );

  return {
    ...rawConfig,
    title,
    detect_unavailable: detectUnavailable,
    detect_batteries: normalizeBoolean(
      rawConfig.detect_batteries,
      "detect_batteries",
      DEFAULT_CONFIG.detect_batteries,
    ),
    detect_stale: normalizeBoolean(
      rawConfig.detect_stale,
      "detect_stale",
      DEFAULT_CONFIG.detect_stale,
    ),
    stale_hours: normalizePositiveNumber(rawConfig.stale_hours, "stale_hours", DEFAULT_STALE_HOURS),
    battery_warning: batteryWarning,
    battery_critical: batteryCritical,
    battery_thresholds: normalizeBatteryThresholds(
      rawConfig.battery_thresholds,
      batteryWarning,
      batteryCritical,
    ),
    battery_warning_entity: normalizeOptionalNonEmptyString(
      rawConfig.battery_warning_entity,
      "battery_warning_entity",
    ),
    battery_critical_entity: normalizeOptionalNonEmptyString(
      rawConfig.battery_critical_entity,
      "battery_critical_entity",
    ),
    availability: normalizeAvailability(rawConfig.availability, detectUnavailable),
    display_mode: displayMode,
    empty_state: emptyState,
    reverse_age_sort: normalizeBoolean(
      rawConfig.reverse_age_sort,
      "reverse_age_sort",
      DEFAULT_CONFIG.reverse_age_sort,
    ),
    group_by: normalizeEnum(rawConfig.group_by, "group_by", GROUP_MODES, DEFAULT_CONFIG.group_by),
    show_severities: normalizeEnumArray(
      rawConfig.show_severities,
      "show_severities",
      SEVERITIES,
      DEFAULT_CONFIG.show_severities,
    ),
    show_sources: normalizeEnumArray(
      rawConfig.show_sources,
      "show_sources",
      ISSUE_SOURCES,
      DEFAULT_CONFIG.show_sources,
    ),
    max_issues: normalizeOptionalPositiveInteger(rawConfig.max_issues, "max_issues"),
    collapsed_groups: normalizeStringArray(rawConfig.collapsed_groups, "collapsed_groups"),
    include: normalizeInclusions(rawConfig.include),
    exclude: normalizeExclusions(rawConfig.exclude),
    stale_rules: normalizeStaleRules(rawConfig.stale_rules),
    rules: normalizeRules(rawConfig.rules),
  };
}

export function configKey(config: NormalizedAttentionCenterCardConfig): string {
  return JSON.stringify(config);
}

function normalizeInclusions(include: InclusionConfig | undefined): Required<InclusionConfig> {
  if (include !== undefined && !isPlainObject(include)) {
    throw new Error("include must be an object.");
  }
  return {
    labels: normalizeStringArray(include?.labels, "include.labels"),
  };
}

function normalizeExclusions(exclude: ExclusionConfig | undefined): Required<ExclusionConfig> {
  if (exclude !== undefined && !isPlainObject(exclude)) {
    throw new Error("exclude must be an object.");
  }
  return {
    domains: normalizeStringArray(exclude?.domains, "exclude.domains"),
    entities: normalizeStringArray(exclude?.entities, "exclude.entities"),
    devices: normalizeStringArray(exclude?.devices, "exclude.devices"),
    areas: normalizeStringArray(exclude?.areas, "exclude.areas"),
    patterns: normalizeStringArray(exclude?.patterns, "exclude.patterns"),
    labels: normalizeStringArray(exclude?.labels, "exclude.labels"),
  };
}

function normalizeAvailability(
  availability: AvailabilityConfig | undefined,
  legacyDetectUnavailable: boolean,
): NormalizedAvailabilityConfig {
  if (availability !== undefined && !isPlainObject(availability)) {
    throw new Error("availability must be an object.");
  }
  return {
    detect_unavailable: normalizeBoolean(
      availability?.detect_unavailable,
      "availability.detect_unavailable",
      legacyDetectUnavailable,
    ),
    detect_unknown: normalizeBoolean(
      availability?.detect_unknown,
      "availability.detect_unknown",
      legacyDetectUnavailable,
    ),
    unavailable_severity: normalizeSeverity(
      availability?.unavailable_severity,
      "availability.unavailable_severity",
      "warning",
    ),
    unknown_severity: normalizeSeverity(
      availability?.unknown_severity,
      "availability.unknown_severity",
      "warning",
    ),
    unavailable_for_minutes: normalizeNonNegativeNumber(
      availability?.unavailable_for_minutes,
      "availability.unavailable_for_minutes",
      0,
    ),
    unknown_for_minutes: normalizeNonNegativeNumber(
      availability?.unknown_for_minutes,
      "availability.unknown_for_minutes",
      0,
    ),
    startup_grace_minutes: normalizeNonNegativeNumber(
      availability?.startup_grace_minutes,
      "availability.startup_grace_minutes",
      0,
    ),
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
    const entityId = normalizeOptionalNonEmptyString(rule.entity_id, `rules[${index}].entity_id`);
    const label = normalizeOptionalNonEmptyString(rule.label, `rules[${index}].label`);
    if ((entityId === undefined) === (label === undefined)) {
      throw new Error(`rules[${index}] must define exactly one of entity_id or label.`);
    }
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
    const aboveEntity = normalizeOptionalNonEmptyString(
      rule.above_entity,
      `rules[${index}].above_entity`,
    );
    const belowEntity = normalizeOptionalNonEmptyString(
      rule.below_entity,
      `rules[${index}].below_entity`,
    );
    if (rule.above !== undefined && aboveEntity !== undefined) {
      throw new Error(`rules[${index}] cannot define both above and above_entity.`);
    }
    if (rule.below !== undefined && belowEntity !== undefined) {
      throw new Error(`rules[${index}] cannot define both below and below_entity.`);
    }
    if (rule.clear_below !== undefined && !isFiniteNumber(rule.clear_below)) {
      throw new Error(`rules[${index}].clear_below must be a number.`);
    }
    if (rule.clear_above !== undefined && !isFiniteNumber(rule.clear_above)) {
      throw new Error(`rules[${index}].clear_above must be a number.`);
    }
    if (rule.clear_below !== undefined && rule.above === undefined && aboveEntity === undefined) {
      throw new Error(`rules[${index}].clear_below requires above or above_entity.`);
    }
    if (rule.clear_above !== undefined && rule.below === undefined && belowEntity === undefined) {
      throw new Error(`rules[${index}].clear_above requires below or below_entity.`);
    }
    if (
      rule.above !== undefined &&
      rule.clear_below !== undefined &&
      rule.clear_below >= rule.above
    ) {
      throw new Error(`rules[${index}].clear_below must be lower than above.`);
    }
    if (
      rule.below !== undefined &&
      rule.clear_above !== undefined &&
      rule.clear_above <= rule.below
    ) {
      throw new Error(`rules[${index}].clear_above must be higher than below.`);
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
      aboveEntity !== undefined ||
      rule.below !== undefined ||
      belowEntity !== undefined;

    if (!hasCondition) {
      throw new Error(
        `rules[${index}] must define state, not_state, above, above_entity, below, or below_entity.`,
      );
    }

    return {
      ...rule,
      entity_id: entityId,
      label,
      above_entity: aboveEntity,
      below_entity: belowEntity,
      severity,
      actions: normalizeActions(rule.actions, index),
    };
  });
}

function normalizeActions(actions: unknown, ruleIndex: number): IssueAction[] {
  if (actions === undefined) {
    return [];
  }
  if (!Array.isArray(actions)) {
    throw new Error(`rules[${ruleIndex}].actions must be a list.`);
  }

  return (actions as IssueAction[]).map((action, actionIndex) => {
    const field = `rules[${ruleIndex}].actions[${actionIndex}]`;
    if (!isPlainObject(action)) {
      throw new Error(`${field} must be an object.`);
    }
    if (action.action !== undefined && action.action !== "more-info") {
      throw new Error(`${field}.action must be more-info.`);
    }
    const navigationPath = normalizeOptionalNonEmptyString(
      action.navigation_path,
      `${field}.navigation_path`,
    );
    const urlPath = normalizeOptionalNonEmptyString(action.url_path, `${field}.url_path`);
    const service = normalizeOptionalNonEmptyString(action.service, `${field}.service`);
    const actionTypeCount = [
      action.action === "more-info",
      navigationPath !== undefined,
      urlPath !== undefined,
      service !== undefined,
    ].filter(Boolean).length;
    if (actionTypeCount !== 1) {
      throw new Error(
        `${field} must define exactly one of action: more-info, navigation_path, url_path, or service.`,
      );
    }
    if (navigationPath !== undefined && !navigationPath.startsWith("/")) {
      throw new Error(`${field}.navigation_path must start with /.`);
    }
    if (
      urlPath !== undefined &&
      /^[a-z][a-z0-9+.-]*:/i.test(urlPath) &&
      !/^https?:/i.test(urlPath)
    ) {
      throw new Error(`${field}.url_path must use http, https, or a relative URL.`);
    }
    if (service !== undefined && !/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(service)) {
      throw new Error(`${field}.service must use domain.service format.`);
    }
    if (action.target !== undefined && !isPlainObject(action.target)) {
      throw new Error(`${field}.target must be an object.`);
    }
    if (action.data !== undefined && !isPlainObject(action.data)) {
      throw new Error(`${field}.data must be an object.`);
    }
    if (action.confirmation !== undefined && typeof action.confirmation !== "boolean") {
      throw new Error(`${field}.confirmation must be a boolean.`);
    }

    return {
      ...action,
      name: normalizeOptionalNonEmptyString(action.name, `${field}.name`),
      icon: normalizeOptionalNonEmptyString(action.icon, `${field}.icon`),
      navigation_path: navigationPath,
      url_path: urlPath,
      service,
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
  globalWarning: number,
  globalCritical: number,
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
      validateBatteryThresholdRelationship(value, globalCritical, `battery_thresholds.${entityId}`);
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
    validateBatteryThresholdRelationship(
      warning ?? globalWarning,
      critical ?? globalCritical,
      `battery_thresholds.${entityId}`,
    );
    normalized[entityId] = { warning, critical };
  }
  return normalized;
}

function normalizeStringArray(value: unknown, field: string): string[] {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${field} must be a list of strings.`);
  }
  return (value as string[]).map((item) => item.trim()).filter(Boolean);
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

function normalizeOptionalNonEmptyString(value: unknown, field: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return normalizeRequiredString(value, field);
}

function normalizeOptionalNumber(value: unknown, field: string, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }
  return normalizePositiveNumber(value, field);
}

function normalizeBoolean(value: unknown, field: string, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value !== "boolean") {
    throw new Error(`${field} must be a boolean.`);
  }
  return value;
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

function normalizeNonNegativeNumber(value: unknown, field: string, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }
  if (!isFiniteNumber(value) || value < 0) {
    throw new Error(`${field} must be zero or greater.`);
  }
  return value;
}

function normalizeOptionalPositiveInteger(value: unknown, field: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!isFiniteNumber(value) || !Number.isInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive integer.`);
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

function normalizeEnumArray<T extends string>(
  value: unknown,
  field: string,
  allowed: Set<T>,
  fallback: T[],
): T[] {
  if (value === undefined) {
    return [...fallback];
  }
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || !allowed.has(item as T))
  ) {
    throw new Error(`${field} contains an unsupported value.`);
  }
  return [...new Set(value as T[])];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validateBatteryThresholdRelationship(
  warning: number,
  critical: number,
  field: string,
): void {
  if (critical >= warning) {
    throw new Error(`${field}.critical must resolve lower than warning.`);
  }
}

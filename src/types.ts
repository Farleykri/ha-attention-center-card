export type Severity = "critical" | "warning" | "info";
export type DisplayMode = "full" | "compact" | "summary";
export type EmptyState = "message" | "hide";
export type IssueSource = "unavailable" | "battery" | "stale" | "rule";
export type GroupBy = "none" | "severity" | "area" | "source" | "device";

export interface InclusionConfig {
  labels?: string[];
}

export interface ExclusionConfig {
  domains?: string[];
  entities?: string[];
  devices?: string[];
  areas?: string[];
  patterns?: string[];
  labels?: string[];
}

export interface AvailabilityConfig {
  detect_unavailable?: boolean;
  detect_unknown?: boolean;
  unavailable_severity?: Severity;
  unknown_severity?: Severity;
  unavailable_for_minutes?: number;
  unknown_for_minutes?: number;
  startup_grace_minutes?: number;
}

export interface NormalizedAvailabilityConfig extends AvailabilityConfig {
  detect_unavailable: boolean;
  detect_unknown: boolean;
  unavailable_severity: Severity;
  unknown_severity: Severity;
  unavailable_for_minutes: number;
  unknown_for_minutes: number;
  startup_grace_minutes: number;
}

export interface IssueAction {
  name?: string;
  icon?: string;
  action?: "more-info";
  navigation_path?: string;
  url_path?: string;
  service?: string;
  target?: Record<string, unknown>;
  data?: Record<string, unknown>;
  confirmation?: boolean;
}

export interface BatteryThresholdOverride {
  warning?: number;
  critical?: number;
}

export interface StaleRule {
  entity_id: string;
  hours: number;
  severity?: Severity;
  title?: string;
}

export interface UserRule {
  entity_id?: string;
  label?: string;
  attribute?: string;
  state?: string | number | boolean;
  not_state?: string | number | boolean;
  above?: number;
  above_entity?: string;
  below?: number;
  below_entity?: string;
  clear_below?: number;
  clear_above?: number;
  for_minutes?: number;
  severity?: Severity;
  title?: string;
  actions?: IssueAction[];
}

export interface AttentionCenterCardConfig {
  type?: string;
  title?: string;
  detect_unavailable?: boolean;
  detect_batteries?: boolean;
  detect_stale?: boolean;
  stale_hours?: number;
  battery_warning?: number;
  battery_critical?: number;
  battery_warning_entity?: string;
  battery_critical_entity?: string;
  battery_thresholds?: Record<string, number | BatteryThresholdOverride>;
  availability?: AvailabilityConfig;
  display_mode?: DisplayMode;
  empty_state?: EmptyState;
  reverse_age_sort?: boolean;
  group_by?: GroupBy;
  show_severities?: Severity[];
  show_sources?: IssueSource[];
  max_issues?: number;
  collapsed_groups?: string[];
  include?: InclusionConfig;
  exclude?: ExclusionConfig;
  stale_rules?: StaleRule[];
  rules?: UserRule[];
}

export interface NormalizedAttentionCenterCardConfig extends AttentionCenterCardConfig {
  title: string;
  detect_unavailable: boolean;
  detect_batteries: boolean;
  detect_stale: boolean;
  stale_hours: number;
  battery_warning: number;
  battery_critical: number;
  battery_thresholds: Record<string, number | BatteryThresholdOverride>;
  availability: NormalizedAvailabilityConfig;
  display_mode: DisplayMode;
  empty_state: EmptyState;
  reverse_age_sort: boolean;
  group_by: GroupBy;
  show_severities: Severity[];
  show_sources: IssueSource[];
  max_issues?: number;
  collapsed_groups: string[];
  include: Required<InclusionConfig>;
  exclude: Required<ExclusionConfig>;
  stale_rules: StaleRule[];
  rules: UserRule[];
}

export interface HassEntityAttributes extends Record<string, unknown> {
  friendly_name?: string;
  icon?: string;
  device_class?: string;
  unit_of_measurement?: string;
}

export interface HassEntity {
  entity_id?: string;
  state: string;
  attributes: HassEntityAttributes;
  last_changed: string;
  last_updated: string;
}

export interface HassEntityRegistryEntry {
  entity_id?: string;
  device_id?: string;
  area_id?: string;
  name?: string;
  original_name?: string;
  icon?: string;
  platform?: string;
  labels?: string[];
}

export interface HassDevice {
  id?: string;
  area_id?: string;
  name?: string;
  name_by_user?: string;
  labels?: string[];
}

export interface HassArea {
  area_id?: string;
  id?: string;
  name?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityRegistryEntry>;
  devices?: Record<string, HassDevice>;
  areas?: Record<string, HassArea>;
  localize?: (key: string, ...args: unknown[]) => string;
  callService?: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | unknown;
}

export interface AttentionIssue {
  id: string;
  entity_id: string;
  severity: Severity;
  title: string;
  message: string;
  state: string;
  activeSinceMs: number;
  area?: string;
  deviceId?: string;
  deviceName?: string;
  icon: string;
  source: IssueSource;
  actions?: IssueAction[];
}

export interface DetectionResult {
  issues: AttentionIssue[];
}

export interface EntityPatternMatcher {
  pattern: string;
  wildcard: boolean;
  regex?: RegExp;
}

export interface CompiledExclusions {
  domains: Set<string>;
  entities: Set<string>;
  devices: Set<string>;
  areas: Set<string>;
  areaNames: Set<string>;
  labels: Set<string>;
  patterns: EntityPatternMatcher[];
}

export interface CompiledUserRule {
  rule: UserRule;
  matcher?: EntityPatternMatcher;
  label?: string;
  index: number;
}

export interface CompiledStaleRule {
  rule: StaleRule;
  matcher: EntityPatternMatcher;
  index: number;
}

export interface EvaluationPlan {
  config: NormalizedAttentionCenterCardConfig;
  exclusions: CompiledExclusions;
  userRules: CompiledUserRule[];
  staleRules: CompiledStaleRule[];
}

export interface RuleDurationMemory {
  firstMatchedAtMs: Map<string, number>;
  activeHysteresisKeys: Set<string>;
}

export interface AttentionDiagnostic {
  code: string;
  message: string;
}

export interface EvaluationContext {
  hass: HomeAssistant;
  plan: EvaluationPlan;
  now: Date;
  connectedAtMs?: number;
  ruleDurationMemory: RuleDurationMemory;
  diagnostics: Map<string, AttentionDiagnostic>;
}

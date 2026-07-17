import { normalizeConfig } from "./config";
import { detectLowBatteries } from "./detectors/battery";
import { detectStaleEntities } from "./detectors/stale";
import { detectUnavailableEntities } from "./detectors/unavailable";
import { compileEntityPattern, compileExclusions } from "./matcher";
import { evaluateUserRules } from "./rules";
import { sortIssues } from "./severity";
import type {
  AttentionCenterCardConfig,
  AttentionIssue,
  AttentionDiagnostic,
  EvaluationContext,
  EvaluationPlan,
  HomeAssistant,
  NormalizedAttentionCenterCardConfig,
  RuleDurationMemory,
} from "./types";

export interface EvaluationOptions {
  ruleDurationMemory?: RuleDurationMemory;
  connectedAtMs?: number;
}

export interface EvaluationResult {
  issues: AttentionIssue[];
  diagnostics: AttentionDiagnostic[];
}

export function createEvaluationPlan(config: NormalizedAttentionCenterCardConfig): EvaluationPlan {
  return {
    config,
    exclusions: compileExclusions(config.exclude),
    userRules: config.rules.map((rule, index) => ({
      rule,
      matcher: rule.entity_id ? compileEntityPattern(rule.entity_id) : undefined,
      label: rule.label,
      index,
    })),
    staleRules: config.stale_rules.map((rule, index) => ({
      rule,
      matcher: compileEntityPattern(rule.entity_id),
      index,
    })),
  };
}

export function createRuleDurationMemory(): RuleDurationMemory {
  return {
    firstMatchedAtMs: new Map<string, number>(),
    activeHysteresisKeys: new Set<string>(),
  };
}

export function evaluateAttentionIssues(
  hass: HomeAssistant,
  plan: EvaluationPlan,
  now = new Date(),
  options: EvaluationOptions = {},
): AttentionIssue[] {
  return evaluateAttentionResult(hass, plan, now, options).issues;
}

export function evaluateAttentionResult(
  hass: HomeAssistant,
  plan: EvaluationPlan,
  now = new Date(),
  options: EvaluationOptions = {},
): EvaluationResult {
  const context: EvaluationContext = {
    hass,
    plan,
    now,
    connectedAtMs: options.connectedAtMs,
    ruleDurationMemory: options.ruleDurationMemory ?? createRuleDurationMemory(),
    diagnostics: new Map(),
  };
  const issues = [
    ...detectUnavailableEntities(context),
    ...detectLowBatteries(context),
    ...detectStaleEntities(context),
    ...evaluateUserRules(context),
  ];
  return {
    issues: sortIssues(dedupeIssues(issues), plan.config.reverse_age_sort),
    diagnostics: [...context.diagnostics.values()],
  };
}

export function evaluateAttentionIssuesForConfig(
  hass: HomeAssistant,
  config: AttentionCenterCardConfig,
  now = new Date(),
  options: EvaluationOptions = {},
): AttentionIssue[] {
  const normalized = normalizeConfig(config);
  return evaluateAttentionIssues(hass, createEvaluationPlan(normalized), now, options);
}

export function evaluateAttentionResultForConfig(
  hass: HomeAssistant,
  config: AttentionCenterCardConfig,
  now = new Date(),
  options: EvaluationOptions = {},
): EvaluationResult {
  const normalized = normalizeConfig(config);
  return evaluateAttentionResult(hass, createEvaluationPlan(normalized), now, options);
}

function dedupeIssues(issues: AttentionIssue[]): AttentionIssue[] {
  const byId = new Map<string, AttentionIssue>();
  for (const issue of issues) {
    byId.set(issue.id, issue);
  }
  return [...byId.values()];
}

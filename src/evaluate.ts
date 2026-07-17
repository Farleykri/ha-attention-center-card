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
  EvaluationContext,
  EvaluationPlan,
  HomeAssistant,
  NormalizedAttentionCenterCardConfig,
  RuleDurationMemory,
} from "./types";

export interface EvaluationOptions {
  ruleDurationMemory?: RuleDurationMemory;
}

export function createEvaluationPlan(config: NormalizedAttentionCenterCardConfig): EvaluationPlan {
  return {
    config,
    exclusions: compileExclusions(config.exclude),
    userRules: config.rules.map((rule, index) => ({
      rule,
      matcher: compileEntityPattern(rule.entity_id),
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
  };
}

export function evaluateAttentionIssues(
  hass: HomeAssistant,
  plan: EvaluationPlan,
  now = new Date(),
  options: EvaluationOptions = {},
): AttentionIssue[] {
  const context: EvaluationContext = {
    hass,
    plan,
    now,
    ruleDurationMemory: options.ruleDurationMemory ?? createRuleDurationMemory(),
  };
  const issues = [
    ...detectUnavailableEntities(context),
    ...detectLowBatteries(context),
    ...detectStaleEntities(context),
    ...evaluateUserRules(context),
  ];
  return sortIssues(dedupeIssues(issues), plan.config.reverse_age_sort);
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

function dedupeIssues(issues: AttentionIssue[]): AttentionIssue[] {
  const byId = new Map<string, AttentionIssue>();
  for (const issue of issues) {
    byId.set(issue.id, issue);
  }
  return [...byId.values()];
}

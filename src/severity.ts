import type { AttentionIssue, Severity } from "./types";

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

export function severityRank(severity: Severity): number {
  return SEVERITY_RANK[severity];
}

export function sortIssues(issues: AttentionIssue[], reverseAgeSort = false): AttentionIssue[] {
  return [...issues].sort((left, right) => {
    const severityDelta = severityRank(left.severity) - severityRank(right.severity);
    if (severityDelta !== 0) {
      return severityDelta;
    }

    const ageDelta = left.activeSinceMs - right.activeSinceMs;
    if (ageDelta !== 0) {
      return reverseAgeSort ? -ageDelta : ageDelta;
    }

    return left.id.localeCompare(right.id);
  });
}

export function countBySeverity(issues: AttentionIssue[]): Record<Severity, number> {
  return {
    critical: issues.filter((issue) => issue.severity === "critical").length,
    warning: issues.filter((issue) => issue.severity === "warning").length,
    info: issues.filter((issue) => issue.severity === "info").length,
  };
}

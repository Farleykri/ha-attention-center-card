import { severityRank, sortIssues } from "./severity";
import type {
  AttentionIssue,
  GroupBy,
  IssueSource,
  NormalizedAttentionCenterCardConfig,
} from "./types";

export interface IssueGroup {
  key: string;
  label: string;
  total: number;
  issues: AttentionIssue[];
}

export interface IssuePresentation {
  matchingIssues: AttentionIssue[];
  visibleIssues: AttentionIssue[];
  groups: IssueGroup[];
  hiddenCount: number;
}

const SOURCE_ORDER: IssueSource[] = ["unavailable", "battery", "stale", "rule"];

export function prepareIssuePresentation(
  issues: AttentionIssue[],
  config: NormalizedAttentionCenterCardConfig,
): IssuePresentation {
  const severityFilter = new Set(config.show_severities);
  const sourceFilter = new Set(config.show_sources);
  const matchingIssues = sortIssues(
    issues.filter((issue) => severityFilter.has(issue.severity) && sourceFilter.has(issue.source)),
    config.reverse_age_sort,
  );
  const allGroups = groupIssues(matchingIssues, config.group_by, config.reverse_age_sort);
  let remaining = config.max_issues ?? Number.POSITIVE_INFINITY;
  const groups: IssueGroup[] = [];
  const visibleIssues: AttentionIssue[] = [];

  for (const group of allGroups) {
    const visible = group.issues.slice(0, remaining);
    remaining -= visible.length;
    if (visible.length === 0) {
      continue;
    }
    groups.push({ ...group, issues: visible });
    visibleIssues.push(...visible);
  }

  return {
    matchingIssues,
    visibleIssues,
    groups,
    hiddenCount: matchingIssues.length - visibleIssues.length,
  };
}

function groupIssues(
  issues: AttentionIssue[],
  groupBy: GroupBy,
  reverseAgeSort: boolean,
): IssueGroup[] {
  if (groupBy === "none") {
    return [{ key: "none", label: "", total: issues.length, issues }];
  }

  const groups = new Map<string, { label: string; issues: AttentionIssue[] }>();
  for (const issue of issues) {
    const descriptor = groupDescriptor(issue, groupBy);
    const group = groups.get(descriptor.key) ?? { label: descriptor.label, issues: [] };
    group.issues.push(issue);
    groups.set(descriptor.key, group);
  }

  return [...groups.entries()]
    .map(([key, group]) => ({
      key,
      label: group.label,
      total: group.issues.length,
      issues: sortIssues(group.issues, reverseAgeSort),
    }))
    .sort((left, right) => compareGroups(left, right, groupBy));
}

function groupDescriptor(issue: AttentionIssue, groupBy: GroupBy): { key: string; label: string } {
  switch (groupBy) {
    case "severity":
      return { key: issue.severity, label: titleCase(issue.severity) };
    case "area":
      return { key: issue.area ?? "no-area", label: issue.area ?? "No area" };
    case "source":
      return { key: issue.source, label: titleCase(issue.source) };
    case "device":
      return { key: issue.deviceId ?? "no-device", label: issue.deviceName ?? "No device" };
    default:
      return { key: "none", label: "" };
  }
}

function compareGroups(left: IssueGroup, right: IssueGroup, groupBy: GroupBy): number {
  if (groupBy === "severity") {
    return (
      severityRank(left.key as AttentionIssue["severity"]) -
      severityRank(right.key as AttentionIssue["severity"])
    );
  }
  if (groupBy === "source") {
    return (
      SOURCE_ORDER.indexOf(left.key as IssueSource) - SOURCE_ORDER.indexOf(right.key as IssueSource)
    );
  }
  return left.label.localeCompare(right.label, undefined, { sensitivity: "base" });
}

function titleCase(value: string): string {
  return value[0].toUpperCase() + value.slice(1);
}

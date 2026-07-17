import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../src/config";
import { prepareIssuePresentation } from "../src/presentation";
import type { AttentionIssue } from "../src/types";

describe("issue presentation", () => {
  it("filters before grouping and sorts issues within each group", () => {
    const config = normalizeConfig({
      group_by: "area",
      show_severities: ["critical", "warning"],
      show_sources: ["rule", "battery"],
    });
    const presentation = prepareIssuePresentation(
      [
        issue("warning-old", "warning", "rule", 1000, "Kitchen"),
        issue("critical-new", "critical", "battery", 4000, "Kitchen"),
        issue("info-filtered", "info", "rule", 500, "Kitchen"),
        issue("source-filtered", "critical", "stale", 100, "Garage"),
      ],
      config,
    );

    expect(presentation.matchingIssues.map((item) => item.id)).toEqual([
      "critical-new",
      "warning-old",
    ]);
    expect(presentation.groups.map((group) => [group.label, group.total])).toEqual([
      ["Kitchen", 2],
    ]);
    expect(presentation.groups[0]?.issues.map((item) => item.id)).toEqual([
      "critical-new",
      "warning-old",
    ]);
  });

  it("supports every grouping mode with stable keys", () => {
    const sample = [
      {
        ...issue("sample", "warning", "battery", 1000, "Kitchen"),
        deviceId: "device-1",
        deviceName: "Kitchen Sensor",
      },
    ];

    expect(
      prepareIssuePresentation(sample, normalizeConfig({ group_by: "none" })).groups[0]?.key,
    ).toBe("none");
    expect(
      prepareIssuePresentation(sample, normalizeConfig({ group_by: "severity" })).groups[0]?.key,
    ).toBe("warning");
    expect(
      prepareIssuePresentation(sample, normalizeConfig({ group_by: "area" })).groups[0]?.key,
    ).toBe("Kitchen");
    expect(
      prepareIssuePresentation(sample, normalizeConfig({ group_by: "source" })).groups[0]?.key,
    ).toBe("battery");
    expect(
      prepareIssuePresentation(sample, normalizeConfig({ group_by: "device" })).groups[0]?.key,
    ).toBe("device-1");
  });

  it("limits grouped issues while retaining full counts and hidden totals", () => {
    const config = normalizeConfig({ group_by: "severity", max_issues: 2 });
    const presentation = prepareIssuePresentation(
      [
        issue("critical", "critical", "rule", 1000),
        issue("warning-old", "warning", "rule", 1000),
        issue("warning-new", "warning", "rule", 2000),
        issue("info", "info", "rule", 500),
      ],
      config,
    );

    expect(presentation.matchingIssues).toHaveLength(4);
    expect(presentation.visibleIssues.map((item) => item.id)).toEqual(["critical", "warning-old"]);
    expect(presentation.hiddenCount).toBe(2);
    expect(
      presentation.groups.map((group) => [group.key, group.total, group.issues.length]),
    ).toEqual([
      ["critical", 1, 1],
      ["warning", 2, 1],
    ]);
  });

  it("respects reverse age sorting within a group", () => {
    const config = normalizeConfig({ group_by: "source", reverse_age_sort: true });
    const presentation = prepareIssuePresentation(
      [issue("old", "warning", "rule", 1000), issue("new", "warning", "rule", 3000)],
      config,
    );

    expect(presentation.groups[0]?.issues.map((item) => item.id)).toEqual(["new", "old"]);
  });
});

function issue(
  id: string,
  severity: AttentionIssue["severity"],
  source: AttentionIssue["source"],
  activeSinceMs: number,
  area?: string,
): AttentionIssue {
  return {
    id,
    entity_id: `sensor.${id}`,
    severity,
    title: id,
    message: id,
    state: "on",
    activeSinceMs,
    area,
    icon: "mdi:alert",
    source,
  };
}

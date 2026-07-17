import { describe, expect, it } from "vitest";
import { sortIssues } from "../src/severity";
import type { AttentionIssue } from "../src/types";

describe("severity sorting", () => {
  it("sorts by critical, warning, info and oldest issue first", () => {
    const issues = [
      issue("info-new", "info", 3000),
      issue("warning-new", "warning", 2000),
      issue("critical-new", "critical", 4000),
      issue("critical-old", "critical", 1000),
    ];

    expect(sortIssues(issues).map((item) => item.id)).toEqual([
      "critical-old",
      "critical-new",
      "warning-new",
      "info-new",
    ]);
  });

  it("can reverse age ordering within a severity", () => {
    const issues = [issue("warning-old", "warning", 1000), issue("warning-new", "warning", 3000)];

    expect(sortIssues(issues, true).map((item) => item.id)).toEqual(["warning-new", "warning-old"]);
  });
});

function issue(
  id: string,
  severity: AttentionIssue["severity"],
  activeSinceMs: number,
): AttentionIssue {
  return {
    id,
    entity_id: `sensor.${id}`,
    severity,
    title: id,
    message: id,
    state: "on",
    activeSinceMs,
    icon: "mdi:alert",
    source: "rule",
  };
}

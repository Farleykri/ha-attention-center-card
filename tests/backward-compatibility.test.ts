import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../src/config";
import { evaluateAttentionIssuesForConfig } from "../src/evaluate";
import type { AttentionCenterCardConfig } from "../src/types";
import { entity, makeHass } from "./mock-hass";

const VERSION_01_README_CONFIG: AttentionCenterCardConfig = {
  type: "custom:attention-center-card",
  title: "House Attention Center",
  detect_unavailable: true,
  detect_batteries: true,
  battery_warning: 30,
  battery_critical: 15,
  display_mode: "full",
  empty_state: "message",
  exclude: {
    domains: ["button", "update"],
    entities: ["sensor.time", "sensor.date"],
    patterns: ["sensor.*_last_seen"],
  },
};

describe("Version 0.1 compatibility", () => {
  it("normalizes and evaluates the README Version 0.1 example unchanged", () => {
    const normalized = normalizeConfig(VERSION_01_README_CONFIG);
    const hass = makeHass({
      states: {
        "sensor.offline": entity("unknown"),
        "sensor.door_battery": entity("10", { device_class: "battery" }),
        "sensor.time": entity("unavailable"),
        "button.reset": entity("unavailable"),
      },
    });
    const issues = evaluateAttentionIssuesForConfig(
      hass,
      VERSION_01_README_CONFIG,
      new Date("2026-07-17T12:00:00.000Z"),
    );

    expect(normalized.availability).toMatchObject({
      detect_unavailable: true,
      detect_unknown: true,
      unavailable_severity: "warning",
      unknown_severity: "warning",
      startup_grace_minutes: 0,
    });
    expect(normalized.group_by).toBe("none");
    expect(issues.map((issue) => [issue.entity_id, issue.source])).toEqual([
      ["sensor.door_battery", "battery"],
      ["sensor.offline", "unavailable"],
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { evaluateAttentionIssuesForConfig } from "../src/evaluate";
import { entity, makeHass } from "./mock-hass";

const NOW = new Date("2026-07-17T12:00:00.000Z");

describe("label targeting", () => {
  it("includes automatic issues from entity and device labels", () => {
    const hass = makeHass({
      states: {
        "sensor.direct": entity("unavailable"),
        "sensor.inherited_battery": entity("10", {
          device_class: "battery",
          unit_of_measurement: "%",
        }),
        "sensor.unlabeled": entity("unavailable"),
      },
      entities: {
        "sensor.direct": { labels: ["monitor"] },
        "sensor.inherited_battery": { device_id: "device-1" },
      },
      devices: {
        "device-1": { id: "device-1", labels: ["monitor"] },
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      { include: { labels: ["monitor"] } },
      NOW,
    );

    expect(issues.map((issue) => [issue.entity_id, issue.source])).toEqual([
      ["sensor.inherited_battery", "battery"],
      ["sensor.direct", "unavailable"],
    ]);
  });

  it("allows explicit rules to bypass label inclusion", () => {
    const hass = makeHass({
      states: {
        "sensor.unlabeled": entity("unavailable"),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        include: { labels: ["monitor"] },
        detect_batteries: false,
        rules: [{ entity_id: "sensor.unlabeled", state: "unavailable" }],
      },
      NOW,
    );

    expect(issues.map((issue) => issue.source)).toEqual(["rule"]);
  });

  it("targets entity and inherited device labels without duplicate issues", () => {
    const hass = makeHass({
      states: {
        "binary_sensor.direct_and_device": entity("on"),
        "binary_sensor.device_only": entity("on"),
      },
      entities: {
        "binary_sensor.direct_and_device": {
          device_id: "device-1",
          labels: ["critical_sensor"],
        },
        "binary_sensor.device_only": { device_id: "device-2" },
      },
      devices: {
        "device-1": { id: "device-1", labels: ["critical_sensor"] },
        "device-2": { id: "device-2", labels: ["critical_sensor"] },
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        detect_unavailable: false,
        detect_batteries: false,
        rules: [{ label: "critical_sensor", state: "on", severity: "critical" }],
      },
      NOW,
    );

    expect(issues.map((issue) => issue.entity_id).sort()).toEqual([
      "binary_sensor.device_only",
      "binary_sensor.direct_and_device",
    ]);
  });

  it("applies label exclusions to explicit rules", () => {
    const hass = makeHass({
      states: { "binary_sensor.ignored": entity("on") },
      entities: { "binary_sensor.ignored": { labels: ["ignore_attention_center"] } },
    });

    expect(
      evaluateAttentionIssuesForConfig(
        hass,
        {
          detect_unavailable: false,
          detect_batteries: false,
          exclude: { labels: ["ignore_attention_center"] },
          rules: [{ entity_id: "binary_sensor.ignored", state: "on" }],
        },
        NOW,
      ),
    ).toHaveLength(0);
  });
});

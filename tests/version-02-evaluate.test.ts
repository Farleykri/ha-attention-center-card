import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../src/config";
import {
  createRuleDurationMemory,
  evaluateAttentionIssuesForConfig,
  evaluateAttentionResultForConfig,
} from "../src/evaluate";
import { entity, makeHass } from "./mock-hass";

const NOW = new Date("2026-07-17T12:00:00.000Z");

describe("dynamic thresholds", () => {
  it("uses numeric entities for global battery thresholds", () => {
    const hass = makeHass({
      states: {
        "input_number.battery_warning_threshold": entity("40"),
        "input_number.battery_critical_threshold": entity("20"),
        "sensor.warning_battery": entity("30", { device_class: "battery" }),
        "sensor.critical_battery": entity("10", { device_class: "battery" }),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        detect_unavailable: false,
        battery_warning_entity: "input_number.battery_warning_threshold",
        battery_critical_entity: "input_number.battery_critical_threshold",
      },
      NOW,
    );

    expect(issues.map((issue) => [issue.entity_id, issue.severity])).toEqual([
      ["sensor.critical_battery", "critical"],
      ["sensor.warning_battery", "warning"],
    ]);
  });

  it.each([undefined, "unknown", "unavailable", "not-a-number"])(
    "skips battery detection for an invalid dynamic threshold state: %s",
    (thresholdState) => {
      const states = {
        "sensor.example_battery": entity("10", { device_class: "battery" }),
        ...(thresholdState === undefined
          ? {}
          : { "input_number.warning_threshold": entity(thresholdState) }),
      };
      const result = evaluateAttentionResultForConfig(
        makeHass({ states }),
        {
          detect_unavailable: false,
          battery_warning_entity: "input_number.warning_threshold",
        },
        NOW,
      );

      expect(result.issues).toHaveLength(0);
      expect(result.diagnostics[0]?.message).toMatch(/finite positive numeric state/);
    },
  );

  it("uses above_entity and below_entity thresholds", () => {
    const hass = makeHass({
      states: {
        "sensor.humidity": entity("70"),
        "input_number.humidity_warning": entity("65"),
        "sensor.fuel": entity("20"),
        "input_number.fuel_warning": entity("25"),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        detect_unavailable: false,
        detect_batteries: false,
        rules: [
          { entity_id: "sensor.humidity", above_entity: "input_number.humidity_warning" },
          { entity_id: "sensor.fuel", below_entity: "input_number.fuel_warning" },
        ],
      },
      NOW,
    );

    expect(issues.map((issue) => issue.entity_id).sort()).toEqual([
      "sensor.fuel",
      "sensor.humidity",
    ]);
  });

  it.each([undefined, "unknown", "unavailable", "not-a-number"])(
    "does not match a rule with an invalid threshold entity state: %s",
    (thresholdState) => {
      const states = {
        "sensor.humidity": entity("70"),
        ...(thresholdState === undefined
          ? {}
          : { "input_number.humidity_warning": entity(thresholdState) }),
      };
      const result = evaluateAttentionResultForConfig(
        makeHass({ states }),
        {
          detect_unavailable: false,
          detect_batteries: false,
          rules: [{ entity_id: "sensor.humidity", above_entity: "input_number.humidity_warning" }],
        },
        NOW,
      );

      expect(result.issues).toHaveLength(0);
      expect(result.diagnostics[0]?.message).toMatch(/finite numeric state/);
    },
  );

  it("rejects fixed and entity thresholds on the same side", () => {
    expect(() =>
      normalizeConfig({
        rules: [{ entity_id: "sensor.humidity", above: 65, above_entity: "input_number.limit" }],
      }),
    ).toThrow(/both above and above_entity/);
    expect(() =>
      normalizeConfig({
        rules: [{ entity_id: "sensor.fuel", below: 25, below_entity: "input_number.limit" }],
      }),
    ).toThrow(/both below and below_entity/);
  });
});

describe("numeric hysteresis", () => {
  it("keeps an above issue active until clear_below is crossed", () => {
    const memory = createRuleDurationMemory();
    const config = {
      detect_unavailable: false,
      detect_batteries: false,
      rules: [{ entity_id: "sensor.humidity", above: 65, clear_below: 60 }],
    };

    expect(evaluateAt("70", config, memory, "12:00")).toHaveLength(1);
    expect(evaluateAt("63", config, memory, "12:01")).toHaveLength(1);
    expect(evaluateAt("59", config, memory, "12:02")).toHaveLength(0);
    expect(evaluateAt("62", config, memory, "12:03")).toHaveLength(0);
  });

  it("keeps a below issue active until clear_above is crossed", () => {
    const memory = createRuleDurationMemory();
    const config = {
      detect_unavailable: false,
      detect_batteries: false,
      rules: [{ entity_id: "sensor.humidity", below: 25, clear_above: 30 }],
    };

    expect(evaluateAt("20", config, memory, "12:00")).toHaveLength(1);
    expect(evaluateAt("27", config, memory, "12:01")).toHaveLength(1);
    expect(evaluateAt("31", config, memory, "12:02")).toHaveLength(0);
    expect(evaluateAt("28", config, memory, "12:03")).toHaveLength(0);
  });

  it("clears hysteresis memory when a rule disappears", () => {
    const memory = createRuleDurationMemory();
    evaluateAt(
      "70",
      {
        detect_unavailable: false,
        detect_batteries: false,
        rules: [{ entity_id: "sensor.humidity", above: 65, clear_below: 60 }],
      },
      memory,
      "12:00",
    );
    expect(memory.activeHysteresisKeys.size).toBe(1);

    evaluateAttentionIssuesForConfig(
      makeHass({ states: { "sensor.humidity": entity("70") } }),
      { detect_unavailable: false, detect_batteries: false, rules: [] },
      NOW,
      { ruleDurationMemory: memory },
    );

    expect(memory.activeHysteresisKeys.size).toBe(0);
    expect(memory.firstMatchedAtMs.size).toBe(0);
  });

  it("validates clear threshold relationships", () => {
    expect(() =>
      normalizeConfig({
        rules: [{ entity_id: "sensor.humidity", above: 65, clear_below: 65 }],
      }),
    ).toThrow(/clear_below/);
    expect(() =>
      normalizeConfig({
        rules: [{ entity_id: "sensor.fuel", below: 25, clear_above: 25 }],
      }),
    ).toThrow(/clear_above/);
  });
});

describe("availability settings", () => {
  it("treats unknown and unavailable separately with duration thresholds", () => {
    const hass = makeHass({
      states: {
        "sensor.unknown": entity("unknown", {}, "2026-07-17T11:56:00.000Z"),
        "sensor.unavailable": entity("unavailable", {}, "2026-07-17T11:49:00.000Z"),
      },
    });
    const config = {
      detect_batteries: false,
      availability: {
        detect_unknown: true,
        detect_unavailable: true,
        unknown_severity: "info" as const,
        unavailable_severity: "critical" as const,
        unknown_for_minutes: 5,
        unavailable_for_minutes: 10,
      },
    };

    const first = evaluateAttentionIssuesForConfig(hass, config, NOW);
    const later = evaluateAttentionIssuesForConfig(
      hass,
      config,
      new Date("2026-07-17T12:01:00.000Z"),
    );

    expect(first.map((issue) => [issue.entity_id, issue.severity])).toEqual([
      ["sensor.unavailable", "critical"],
    ]);
    expect(later.map((issue) => [issue.entity_id, issue.severity])).toEqual([
      ["sensor.unavailable", "critical"],
      ["sensor.unknown", "info"],
    ]);
  });

  it("suppresses automatic availability during startup grace without suppressing rules", () => {
    const hass = makeHass({
      states: {
        "sensor.offline": entity("unavailable", {}, "2026-07-17T11:00:00.000Z"),
      },
    });
    const config = {
      detect_batteries: false,
      availability: { startup_grace_minutes: 5 },
      rules: [{ entity_id: "sensor.offline", state: "unavailable", severity: "critical" as const }],
    };

    const duringGrace = evaluateAttentionIssuesForConfig(hass, config, NOW, {
      connectedAtMs: Date.parse("2026-07-17T11:58:00.000Z"),
    });
    const afterGrace = evaluateAttentionIssuesForConfig(
      hass,
      config,
      new Date("2026-07-17T12:03:00.000Z"),
      { connectedAtMs: Date.parse("2026-07-17T11:58:00.000Z") },
    );

    expect(duringGrace.map((issue) => issue.source)).toEqual(["rule"]);
    expect(afterGrace.map((issue) => issue.source)).toEqual(["rule", "unavailable"]);
  });
});

function evaluateAt(
  value: string,
  config: Parameters<typeof evaluateAttentionIssuesForConfig>[1],
  memory: ReturnType<typeof createRuleDurationMemory>,
  time: string,
) {
  return evaluateAttentionIssuesForConfig(
    makeHass({ states: { "sensor.humidity": entity(value) } }),
    config,
    new Date(`2026-07-17T${time}:00.000Z`),
    { ruleDurationMemory: memory },
  );
}

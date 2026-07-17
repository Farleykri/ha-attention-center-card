import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../src/config";
import { createRuleDurationMemory, evaluateAttentionIssuesForConfig } from "../src/evaluate";
import { entity, makeHass } from "./mock-hass";

const NOW = new Date("2026-07-17T12:00:00.000Z");

describe("automatic detectors", () => {
  it("detects unknown and unavailable entities safely", () => {
    const hass = makeHass({
      states: {
        "sensor.router": entity("unavailable", { friendly_name: "Router" }),
        "sensor.mystery": entity("unknown"),
        "sensor.normal": entity("ok"),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      { detect_batteries: false, detect_unavailable: true },
      NOW,
    );

    expect(issues.map((issue) => issue.entity_id)).toEqual(["sensor.mystery", "sensor.router"]);
    expect(issues.every((issue) => issue.severity === "warning")).toBe(true);
  });

  it("honors domain, entity, and wildcard exclusions", () => {
    const hass = makeHass({
      states: {
        "button.restart": entity("unavailable"),
        "sensor.date": entity("unavailable"),
        "sensor.motion_last_seen": entity("unavailable"),
        "sensor.keep": entity("unavailable"),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        detect_batteries: false,
        exclude: {
          domains: ["button"],
          entities: ["sensor.date"],
          patterns: ["sensor.*_last_seen"],
        },
      },
      NOW,
    );

    expect(issues.map((issue) => issue.entity_id)).toEqual(["sensor.keep"]);
  });

  it("detects low batteries with global and per-entity thresholds", () => {
    const hass = makeHass({
      states: {
        "sensor.door_battery": entity("14", { device_class: "battery", unit_of_measurement: "%" }),
        "sensor.remote_battery": entity("24", { unit_of_measurement: "%" }),
        "sensor.special_battery": entity("30", { device_class: "battery" }),
        "sensor.ok_battery": entity("55", { device_class: "battery" }),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        detect_unavailable: false,
        battery_warning: 30,
        battery_critical: 15,
        battery_thresholds: {
          "sensor.special_battery": { warning: 50, critical: 25 },
        },
      },
      NOW,
    );

    expect(issues.map((issue) => [issue.entity_id, issue.severity])).toEqual([
      ["sensor.door_battery", "critical"],
      ["sensor.remote_battery", "warning"],
      ["sensor.special_battery", "warning"],
    ]);
  });

  it("skips nonnumeric battery values", () => {
    const hass = makeHass({
      states: {
        "sensor.remote_battery": entity("unavailable", { device_class: "battery" }),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      { detect_unavailable: false, detect_batteries: true },
      NOW,
    );

    expect(issues).toHaveLength(0);
  });
});

describe("stale detection", () => {
  it("keeps stale detection disabled globally by default", () => {
    const hass = makeHass({
      states: {
        "sensor.temperature": entity(
          "71",
          {},
          "2026-07-15T12:00:00.000Z",
          "2026-07-15T12:00:00.000Z",
        ),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      { detect_unavailable: false, detect_batteries: false },
      NOW,
    );

    expect(issues).toHaveLength(0);
  });

  it("detects selected stale entities and patterns", () => {
    const hass = makeHass({
      states: {
        "sensor.basement_temperature": entity(
          "70",
          {},
          "2026-07-17T02:00:00.000Z",
          "2026-07-17T02:00:00.000Z",
        ),
        "sensor.office_humidity": entity(
          "40",
          {},
          "2026-07-16T22:00:00.000Z",
          "2026-07-16T22:00:00.000Z",
        ),
        "sensor.recent_humidity": entity(
          "42",
          {},
          "2026-07-17T08:00:00.000Z",
          "2026-07-17T08:00:00.000Z",
        ),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        detect_unavailable: false,
        detect_batteries: false,
        stale_rules: [
          { entity_id: "sensor.basement_temperature", hours: 6 },
          { entity_id: "sensor.*_humidity", hours: 12 },
        ],
      },
      NOW,
    );

    expect(issues.map((issue) => issue.entity_id)).toEqual([
      "sensor.basement_temperature",
      "sensor.office_humidity",
    ]);
    expect(issues[0]?.message).toBe("No update for 6h");
  });

  it("lets explicit stale rules override global stale detection", () => {
    const hass = makeHass({
      states: {
        "sensor.temperature": entity(
          "70",
          {},
          "2026-07-16T00:00:00.000Z",
          "2026-07-16T00:00:00.000Z",
        ),
        "sensor.pressure": entity("30", {}, "2026-07-16T00:00:00.000Z", "2026-07-16T00:00:00.000Z"),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        detect_unavailable: false,
        detect_batteries: false,
        detect_stale: true,
        stale_hours: 12,
        stale_rules: [{ entity_id: "sensor.temperature", hours: 48 }],
      },
      NOW,
    );

    expect(issues.map((issue) => issue.entity_id)).toEqual(["sensor.pressure"]);
  });

  it("emits only one stale issue when explicit stale rules overlap", () => {
    const hass = makeHass({
      states: {
        "sensor.basement_temperature": entity(
          "70",
          {},
          "2026-07-17T00:00:00.000Z",
          "2026-07-17T00:00:00.000Z",
        ),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        detect_unavailable: false,
        detect_batteries: false,
        stale_rules: [
          { entity_id: "sensor.basement_temperature", hours: 6, title: "Exact stale" },
          { entity_id: "sensor.*_temperature", hours: 6, title: "Pattern stale" },
        ],
      },
      NOW,
    );

    expect(issues).toHaveLength(1);
    expect(issues[0]?.title).toBe("Exact stale");
    expect(issues[0]?.id).toBe("stale:sensor.basement_temperature");
  });
});

describe("user rules", () => {
  it("evaluates state and attribute rules", () => {
    const hass = makeHass({
      states: {
        "binary_sensor.water_leak": entity("on"),
        "climate.first_floor": entity("heat", { hvac_action: "cooling" }),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        detect_unavailable: false,
        detect_batteries: false,
        rules: [
          {
            entity_id: "binary_sensor.water_leak",
            state: "on",
            severity: "critical",
            title: "Water detected",
          },
          {
            entity_id: "climate.first_floor",
            attribute: "hvac_action",
            state: "cooling",
            severity: "info",
          },
        ],
      },
      NOW,
    );

    expect(issues.map((issue) => [issue.entity_id, issue.severity, issue.title])).toEqual([
      ["binary_sensor.water_leak", "critical", "Water detected"],
      ["climate.first_floor", "info", "climate.first_floor"],
    ]);
  });

  it("evaluates numeric above and below rules", () => {
    const hass = makeHass({
      states: {
        "sensor.generator_fuel_percent": entity("20"),
        "sensor.basement_humidity": entity("70"),
        "sensor.invalid": entity("unknown"),
      },
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        detect_unavailable: false,
        detect_batteries: false,
        rules: [
          { entity_id: "sensor.generator_fuel_percent", below: 25 },
          { entity_id: "sensor.basement_humidity", above: 65 },
          { entity_id: "sensor.invalid", above: 1 },
        ],
      },
      NOW,
    );

    expect(issues.map((issue) => issue.entity_id)).toEqual([
      "sensor.generator_fuel_percent",
      "sensor.basement_humidity",
    ]);
  });

  it("requires duration rules to be active from the in-memory first match", () => {
    const memory = createRuleDurationMemory();
    const hass = makeHass({
      states: {
        "binary_sensor.old_open": entity("on", {}, "2026-07-17T11:00:00.000Z"),
      },
    });
    const config = {
      detect_unavailable: false,
      detect_batteries: false,
      rules: [{ entity_id: "binary_sensor.old_open", state: "on", for_minutes: 15 }],
    };

    const firstIssues = evaluateAttentionIssuesForConfig(hass, config, NOW, {
      ruleDurationMemory: memory,
    });
    const laterIssues = evaluateAttentionIssuesForConfig(
      hass,
      config,
      new Date("2026-07-17T12:16:00.000Z"),
      { ruleDurationMemory: memory },
    );

    expect(firstIssues).toHaveLength(0);
    expect(laterIssues.map((issue) => issue.entity_id)).toEqual(["binary_sensor.old_open"]);
    expect(laterIssues[0]?.activeSinceMs).toBe(Date.parse("2026-07-17T12:15:00.000Z"));
  });

  it("uses in-memory duration tracking for numeric rules", () => {
    const memory = createRuleDurationMemory();
    const config = {
      detect_unavailable: false,
      detect_batteries: false,
      rules: [{ entity_id: "sensor.basement_humidity", above: 65, for_minutes: 15 }],
    };
    const hass = makeHass({
      states: {
        "sensor.basement_humidity": entity("70", {}, "2026-07-17T08:00:00.000Z"),
      },
    });

    expect(
      evaluateAttentionIssuesForConfig(hass, config, NOW, { ruleDurationMemory: memory }),
    ).toHaveLength(0);

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      config,
      new Date("2026-07-17T12:16:00.000Z"),
      { ruleDurationMemory: memory },
    );

    expect(issues.map((issue) => issue.entity_id)).toEqual(["sensor.basement_humidity"]);
    expect(issues[0]?.activeSinceMs).toBe(Date.parse("2026-07-17T12:15:00.000Z"));
  });

  it("resets duration tracking when an attribute condition stops matching", () => {
    const memory = createRuleDurationMemory();
    const config = {
      detect_unavailable: false,
      detect_batteries: false,
      rules: [
        {
          entity_id: "climate.first_floor",
          attribute: "hvac_action",
          state: "cooling",
          for_minutes: 15,
        },
      ],
    };

    const cooling = makeHass({
      states: {
        "climate.first_floor": entity("cool", { hvac_action: "cooling" }),
      },
    });
    const idle = makeHass({
      states: {
        "climate.first_floor": entity("cool", { hvac_action: "idle" }),
      },
    });

    expect(
      evaluateAttentionIssuesForConfig(cooling, config, NOW, { ruleDurationMemory: memory }),
    ).toHaveLength(0);
    expect(
      evaluateAttentionIssuesForConfig(idle, config, new Date("2026-07-17T12:10:00.000Z"), {
        ruleDurationMemory: memory,
      }),
    ).toHaveLength(0);
    expect(
      evaluateAttentionIssuesForConfig(cooling, config, new Date("2026-07-17T12:10:00.000Z"), {
        ruleDurationMemory: memory,
      }),
    ).toHaveLength(0);
    expect(
      evaluateAttentionIssuesForConfig(cooling, config, new Date("2026-07-17T12:24:00.000Z"), {
        ruleDurationMemory: memory,
      }),
    ).toHaveLength(0);

    const issues = evaluateAttentionIssuesForConfig(
      cooling,
      config,
      new Date("2026-07-17T12:26:00.000Z"),
      { ruleDurationMemory: memory },
    );

    expect(issues.map((issue) => issue.entity_id)).toEqual(["climate.first_floor"]);
    expect(issues[0]?.activeSinceMs).toBe(Date.parse("2026-07-17T12:25:00.000Z"));
  });

  it("ignores missing entities", () => {
    const hass = makeHass({
      states: {},
    });

    const issues = evaluateAttentionIssuesForConfig(
      hass,
      {
        rules: [{ entity_id: "sensor.missing", state: "on" }],
      },
      NOW,
    );

    expect(issues).toHaveLength(0);
  });
});

describe("configuration validation", () => {
  it("rejects invalid battery thresholds", () => {
    expect(() => normalizeConfig({ battery_warning: 20, battery_critical: 20 })).toThrow(
      /battery_critical/,
    );
  });

  it("rejects invalid resolved battery threshold overrides", () => {
    expect(() =>
      normalizeConfig({
        battery_warning: 30,
        battery_critical: 15,
        battery_thresholds: {
          "sensor.too_low_battery": 10,
        },
      }),
    ).toThrow(/critical must resolve lower than warning/);

    expect(() =>
      normalizeConfig({
        battery_warning: 30,
        battery_critical: 15,
        battery_thresholds: {
          "sensor.too_critical_battery": { critical: 40 },
        },
      }),
    ).toThrow(/critical must resolve lower than warning/);
  });

  it("rejects non-boolean boolean options", () => {
    expect(() => normalizeConfig({ detect_batteries: "true" as unknown as boolean })).toThrow(
      /detect_batteries/,
    );
  });

  it("rejects rules with no condition", () => {
    expect(() => normalizeConfig({ rules: [{ entity_id: "sensor.problem" }] })).toThrow(
      /must define/,
    );
  });

  it("rejects unsupported display modes", () => {
    expect(() => normalizeConfig({ display_mode: "table" as unknown as "full" })).toThrow(
      /display_mode/,
    );
  });
});

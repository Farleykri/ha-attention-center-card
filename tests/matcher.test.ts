import { describe, expect, it } from "vitest";
import {
  compileEntityPattern,
  compileExclusions,
  entityMatchesPattern,
  isEntityExcluded,
} from "../src/matcher";
import { entity, makeHass } from "./mock-hass";

describe("wildcard matching", () => {
  it("matches Home Assistant entity ids with star and question wildcards", () => {
    const matcher = compileEntityPattern("sensor.*_temperature");

    expect(entityMatchesPattern("sensor.basement_temperature", matcher)).toBe(true);
    expect(entityMatchesPattern("sensor.basement_humidity", matcher)).toBe(false);
    expect(entityMatchesPattern("binary_sensor.basement_temperature", matcher)).toBe(false);
  });
});

describe("entity exclusions", () => {
  it("excludes by exact entity, domain, pattern, device, and area", () => {
    const hass = makeHass({
      states: {
        "sensor.ignore_me": entity("unavailable"),
        "button.reset": entity("unavailable"),
        "sensor.motion_last_seen": entity("unavailable"),
        "sensor.device_owned": entity("unavailable"),
        "sensor.area_owned": entity("unavailable"),
        "sensor.keep": entity("unavailable"),
      },
      entities: {
        "sensor.device_owned": { device_id: "device-1" },
        "sensor.area_owned": { area_id: "kitchen" },
      },
      areas: {
        kitchen: { area_id: "kitchen", name: "Kitchen" },
      },
    });
    const exclusions = compileExclusions({
      domains: ["button"],
      entities: ["sensor.ignore_me"],
      patterns: ["sensor.*_last_seen"],
      devices: ["device-1"],
      areas: ["Kitchen"],
      labels: [],
    });

    expect(isEntityExcluded("sensor.ignore_me", hass, exclusions)).toBe(true);
    expect(isEntityExcluded("button.reset", hass, exclusions)).toBe(true);
    expect(isEntityExcluded("sensor.motion_last_seen", hass, exclusions)).toBe(true);
    expect(isEntityExcluded("sensor.device_owned", hass, exclusions)).toBe(true);
    expect(isEntityExcluded("sensor.area_owned", hass, exclusions)).toBe(true);
    expect(isEntityExcluded("sensor.keep", hass, exclusions)).toBe(false);
  });

  it("excludes labels assigned to entities or inherited from devices", () => {
    const hass = makeHass({
      states: {
        "sensor.entity_labeled": entity("unavailable"),
        "sensor.device_labeled": entity("unavailable"),
        "sensor.keep": entity("unavailable"),
      },
      entities: {
        "sensor.entity_labeled": { labels: ["ignore_attention_center"] },
        "sensor.device_labeled": { device_id: "device-1" },
      },
      devices: {
        "device-1": { id: "device-1", labels: ["ignore_attention_center"] },
      },
    });
    const exclusions = compileExclusions({
      domains: [],
      entities: [],
      patterns: [],
      devices: [],
      areas: [],
      labels: ["ignore_attention_center"],
    });

    expect(isEntityExcluded("sensor.entity_labeled", hass, exclusions)).toBe(true);
    expect(isEntityExcluded("sensor.device_labeled", hass, exclusions)).toBe(true);
    expect(isEntityExcluded("sensor.keep", hass, exclusions)).toBe(false);
  });
});

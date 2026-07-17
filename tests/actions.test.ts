import { describe, expect, it, vi } from "vitest";
import { executeIssueAction } from "../src/actions";
import { normalizeConfig } from "../src/config";
import type { ActionExecutionDependencies } from "../src/actions";
import { makeHass } from "./mock-hass";

describe("issue actions", () => {
  it("dispatches service calls with data and targets", async () => {
    const callService = vi.fn();
    const hass = {
      ...makeHass({ states: {} }),
      callService,
    };

    await executeIssueAction(
      hass,
      "binary_sensor.garage",
      {
        name: "Run garage script",
        service: "script.turn_on",
        target: { entity_id: "script.close_garage" },
        data: { source: "attention-center" },
      },
      dependencies(),
    );

    expect(callService).toHaveBeenCalledWith(
      "script",
      "turn_on",
      { source: "attention-center" },
      { entity_id: "script.close_garage" },
    );
  });

  it("honors confirmation before dispatching", async () => {
    const navigate = vi.fn();
    const confirm = vi.fn().mockReturnValue(false);

    await executeIssueAction(
      makeHass({ states: {} }),
      "sensor.example",
      { name: "View garage", navigation_path: "/dashboard/garage", confirmation: true },
      dependencies({ confirm, navigate }),
    );

    expect(confirm).toHaveBeenCalledOnce();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("dispatches More Info, navigation, and URL actions", async () => {
    const showMoreInfo = vi.fn();
    const navigate = vi.fn();
    const openUrl = vi.fn();
    const deps = dependencies({ showMoreInfo, navigate, openUrl });
    const hass = makeHass({ states: {} });

    await executeIssueAction(hass, "sensor.example", { action: "more-info" }, deps);
    await executeIssueAction(hass, "sensor.example", { navigation_path: "/dashboard/test" }, deps);
    await executeIssueAction(hass, "sensor.example", { url_path: "https://example.com" }, deps);

    expect(showMoreInfo).toHaveBeenCalledWith("sensor.example");
    expect(navigate).toHaveBeenCalledWith("/dashboard/test");
    expect(openUrl).toHaveBeenCalledWith("https://example.com");
  });

  it("rejects malformed or unsafe action configurations", () => {
    const baseRule = { entity_id: "sensor.example", state: "on" };

    expect(() =>
      normalizeConfig({
        rules: [{ ...baseRule, actions: [{ service: "invalid" }] }],
      }),
    ).toThrow(/domain\.service/);
    expect(() =>
      normalizeConfig({
        rules: [
          {
            ...baseRule,
            actions: [{ service: "script.turn_on", navigation_path: "/dashboard" }],
          },
        ],
      }),
    ).toThrow(/exactly one/);
    expect(() =>
      normalizeConfig({
        rules: [{ ...baseRule, actions: [{ url_path: "javascript:alert(1)" }] }],
      }),
    ).toThrow(/http/);
  });
});

function dependencies(
  overrides: Partial<ActionExecutionDependencies> = {},
): ActionExecutionDependencies {
  return {
    confirm: vi.fn().mockReturnValue(true),
    navigate: vi.fn(),
    openUrl: vi.fn(),
    showMoreInfo: vi.fn(),
    ...overrides,
  };
}

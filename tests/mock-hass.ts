import type {
  HassArea,
  HassDevice,
  HassEntity,
  HassEntityAttributes,
  HassEntityRegistryEntry,
  HomeAssistant,
} from "../src/types";

export function entity(
  state: string,
  attributes: HassEntityAttributes = {},
  lastChanged = "2026-07-17T11:00:00.000Z",
  lastUpdated = lastChanged,
): HassEntity {
  return {
    state,
    attributes,
    last_changed: lastChanged,
    last_updated: lastUpdated,
  };
}

export function makeHass(params: {
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityRegistryEntry>;
  devices?: Record<string, HassDevice>;
  areas?: Record<string, HassArea>;
}): HomeAssistant {
  return {
    states: params.states,
    entities: params.entities,
    devices: params.devices,
    areas: params.areas,
  };
}

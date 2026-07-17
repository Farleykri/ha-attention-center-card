import type {
  AttentionIssue,
  HassArea,
  HassDevice,
  HassEntity,
  HassEntityRegistryEntry,
  HomeAssistant,
  IssueAction,
  IssueSource,
  Severity,
} from "./types";

const DOMAIN_ICONS: Record<string, string> = {
  alarm_control_panel: "mdi:shield-alert",
  binary_sensor: "mdi:checkbox-marked-circle-outline",
  climate: "mdi:thermostat",
  cover: "mdi:window-shutter-alert",
  device_tracker: "mdi:map-marker-alert",
  fan: "mdi:fan-alert",
  light: "mdi:lightbulb-alert",
  lock: "mdi:lock-alert",
  sensor: "mdi:alert-circle-outline",
  switch: "mdi:toggle-switch-variant-off",
};

export function getDomain(entityId: string): string {
  return entityId.split(".", 1)[0]?.toLowerCase() ?? "";
}

export function isUnavailableState(state: string): boolean {
  return state === "unavailable" || state === "unknown";
}

export function parseNumericState(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed === "unknown" || trimmed === "unavailable") {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function timestampMs(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getFriendlyName(hass: HomeAssistant, entityId: string): string {
  const entity = hass.states[entityId];
  const registry = hass.entities?.[entityId];
  return (
    normalizeName(entity?.attributes.friendly_name) ??
    normalizeName(registry?.name) ??
    normalizeName(registry?.original_name) ??
    entityId
  );
}

export function getEntityIcon(
  hass: HomeAssistant,
  entityId: string,
  severity?: Severity,
  source?: IssueSource,
): string {
  const entity = hass.states[entityId];
  const registry = hass.entities?.[entityId];
  const explicitIcon = normalizeName(entity?.attributes.icon) ?? normalizeName(registry?.icon);
  if (explicitIcon) {
    return explicitIcon;
  }
  if (source === "battery") {
    return severity === "critical" ? "mdi:battery-alert" : "mdi:battery-low";
  }
  if (severity === "critical") {
    return "mdi:alert-octagon";
  }
  if (severity === "warning") {
    return "mdi:alert";
  }
  return DOMAIN_ICONS[getDomain(entityId)] ?? "mdi:information-outline";
}

export function getAreaName(hass: HomeAssistant, entityId: string): string | undefined {
  const areaIds = getEntityAreaIdentifiers(hass, entityId);
  for (const areaId of areaIds) {
    const area = getAreaByIdentifier(hass, areaId);
    if (area?.name) {
      return area.name;
    }
  }
  return areaIds[0];
}

export function getEntityAreaIdentifiers(hass: HomeAssistant, entityId: string): string[] {
  const identifiers = new Set<string>();
  const entityRegistry = hass.entities?.[entityId];
  addIfPresent(identifiers, entityRegistry?.area_id);

  const deviceId = getEntityDeviceId(hass, entityId);
  const device = deviceId ? getDeviceByIdentifier(hass, deviceId) : undefined;
  addIfPresent(identifiers, device?.area_id);

  const entity = hass.states[entityId];
  const areaAttribute = entity?.attributes.area;
  if (typeof areaAttribute === "string") {
    addIfPresent(identifiers, areaAttribute);
  }

  for (const identifier of [...identifiers]) {
    const area = getAreaByIdentifier(hass, identifier);
    addIfPresent(identifiers, area?.name);
  }

  return [...identifiers];
}

export function getEntityDeviceId(hass: HomeAssistant, entityId: string): string | undefined {
  const registry = hass.entities?.[entityId];
  if (registry?.device_id) {
    return registry.device_id;
  }
  const attributeDeviceId = hass.states[entityId]?.attributes.device_id;
  return typeof attributeDeviceId === "string" ? attributeDeviceId : undefined;
}

export function getEntityLabels(hass: HomeAssistant, entityId: string): string[] {
  const labels = new Set(hass.entities?.[entityId]?.labels ?? []);
  const deviceId = getEntityDeviceId(hass, entityId);
  const device = deviceId ? getDeviceByIdentifier(hass, deviceId) : undefined;
  for (const label of device?.labels ?? []) {
    labels.add(label);
  }
  return [...labels];
}

export function getEntityDeviceName(hass: HomeAssistant, entityId: string): string | undefined {
  const deviceId = getEntityDeviceId(hass, entityId);
  if (!deviceId) {
    return undefined;
  }
  const device = getDeviceByIdentifier(hass, deviceId);
  return normalizeName(device?.name_by_user) ?? normalizeName(device?.name) ?? deviceId;
}

export function createIssue(params: {
  hass: HomeAssistant;
  entityId: string;
  severity: Severity;
  title?: string;
  message: string;
  activeSinceMs?: number;
  source: IssueSource;
  id: string;
  actions?: IssueAction[];
}): AttentionIssue {
  const entity = params.hass.states[params.entityId];
  const deviceId = getEntityDeviceId(params.hass, params.entityId);
  const activeSinceMs =
    params.activeSinceMs ??
    timestampMs(entity?.last_changed) ??
    timestampMs(entity?.last_updated) ??
    Date.now();
  return {
    id: params.id,
    entity_id: params.entityId,
    severity: params.severity,
    title: params.title ?? getFriendlyName(params.hass, params.entityId),
    message: params.message,
    state: entity?.state ?? "missing",
    activeSinceMs,
    area: getAreaName(params.hass, params.entityId),
    deviceId,
    deviceName: getEntityDeviceName(params.hass, params.entityId),
    icon: getEntityIcon(params.hass, params.entityId, params.severity, params.source),
    source: params.source,
    actions: params.actions,
  };
}

function getAreaByIdentifier(hass: HomeAssistant, identifier: string): HassArea | undefined {
  const direct = hass.areas?.[identifier];
  if (direct) {
    return direct;
  }
  return Object.values(hass.areas ?? {}).find(
    (area) => area.area_id === identifier || area.id === identifier || area.name === identifier,
  );
}

export function getDeviceByIdentifier(
  hass: HomeAssistant,
  identifier: string,
): HassDevice | undefined {
  const direct = hass.devices?.[identifier];
  if (direct) {
    return direct;
  }
  return Object.values(hass.devices ?? {}).find(
    (device) =>
      device.id === identifier || device.name === identifier || device.name_by_user === identifier,
  );
}

function normalizeName(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function addIfPresent(values: Set<string>, value: string | undefined): void {
  if (value && value.trim().length > 0) {
    values.add(value);
  }
}

export type { HassEntity, HassEntityRegistryEntry };

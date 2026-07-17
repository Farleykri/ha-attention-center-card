import type {
  CompiledExclusions,
  EntityPatternMatcher,
  ExclusionConfig,
  HomeAssistant,
} from "./types";
import { getDomain, getEntityAreaIdentifiers, getEntityDeviceId, getEntityLabels } from "./hass";

export function compileEntityPattern(pattern: string): EntityPatternMatcher {
  const trimmed = pattern.trim();
  const wildcard = trimmed.includes("*") || trimmed.includes("?");
  return {
    pattern: trimmed,
    wildcard,
    regex: wildcard ? wildcardToRegExp(trimmed) : undefined,
  };
}

export function entityMatchesPattern(entityId: string, matcher: EntityPatternMatcher): boolean {
  if (matcher.wildcard) {
    return matcher.regex?.test(entityId) ?? false;
  }
  return entityId === matcher.pattern;
}

export function getMatchingEntityIds(hass: HomeAssistant, matcher: EntityPatternMatcher): string[] {
  if (!matcher.wildcard) {
    return hass.states[matcher.pattern] ? [matcher.pattern] : [];
  }
  return Object.keys(hass.states).filter((entityId) => entityMatchesPattern(entityId, matcher));
}

export function compileExclusions(exclude: Required<ExclusionConfig>): CompiledExclusions {
  return {
    domains: new Set(exclude.domains.map((domain) => domain.toLowerCase())),
    entities: new Set(exclude.entities),
    devices: new Set(exclude.devices),
    areas: new Set(exclude.areas),
    areaNames: new Set(exclude.areas.map((area) => area.toLowerCase())),
    labels: new Set(exclude.labels),
    patterns: exclude.patterns.map(compileEntityPattern),
  };
}

export function isEntityExcluded(
  entityId: string,
  hass: HomeAssistant,
  exclusions: CompiledExclusions,
): boolean {
  if (exclusions.entities.has(entityId)) {
    return true;
  }
  if (exclusions.domains.has(getDomain(entityId))) {
    return true;
  }
  if (exclusions.patterns.some((matcher) => entityMatchesPattern(entityId, matcher))) {
    return true;
  }
  if (getEntityLabels(hass, entityId).some((label) => exclusions.labels.has(label))) {
    return true;
  }

  const deviceId = getEntityDeviceId(hass, entityId);
  if (deviceId && exclusions.devices.has(deviceId)) {
    return true;
  }

  const areaIdentifiers = getEntityAreaIdentifiers(hass, entityId);
  return areaIdentifiers.some(
    (area) => exclusions.areas.has(area) || exclusions.areaNames.has(area.toLowerCase()),
  );
}

export function isEntityIncludedByLabels(
  entityId: string,
  hass: HomeAssistant,
  labels: string[],
): boolean {
  if (labels.length === 0) {
    return true;
  }
  const includedLabels = new Set(labels);
  return getEntityLabels(hass, entityId).some((label) => includedLabels.has(label));
}

export function getMatchingEntityIdsByLabel(hass: HomeAssistant, label: string): string[] {
  return Object.keys(hass.states).filter((entityId) =>
    getEntityLabels(hass, entityId).includes(label),
  );
}

function wildcardToRegExp(pattern: string): RegExp {
  let source = "^";
  for (const character of pattern) {
    if (character === "*") {
      source += ".*";
    } else if (character === "?") {
      source += ".";
    } else {
      source += escapeRegExp(character);
    }
  }
  source += "$";
  return new RegExp(source, "i");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

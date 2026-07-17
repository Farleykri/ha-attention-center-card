import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DEFAULT_CONFIG, normalizeConfig } from "./config";
import { editorStyles } from "./styles";
import type {
  AttentionCenterCardConfig,
  AvailabilityConfig,
  DisplayMode,
  EmptyState,
  ExclusionConfig,
  GroupBy,
  HomeAssistant,
  IssueSource,
  Severity,
  StaleRule,
  UserRule,
} from "./types";

@customElement("attention-center-card-editor")
export class AttentionCenterCardEditor extends LitElement {
  public static override styles = editorStyles;

  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private _config: AttentionCenterCardConfig = DEFAULT_CONFIG;

  @state()
  private _rulesText = "[]";

  @state()
  private _staleRulesText = "[]";

  @state()
  private _rulesError?: string;

  @state()
  private _staleRulesError?: string;

  @state()
  private _configError?: string;

  public setConfig(config: AttentionCenterCardConfig): void {
    const legacyAvailabilityDefault =
      config.detect_unavailable ?? DEFAULT_CONFIG.detect_unavailable;
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      exclude: {
        ...DEFAULT_CONFIG.exclude,
        ...config.exclude,
      },
      include: {
        ...DEFAULT_CONFIG.include,
        ...config.include,
      },
      availability: {
        ...DEFAULT_CONFIG.availability,
        detect_unavailable: legacyAvailabilityDefault,
        detect_unknown: legacyAvailabilityDefault,
        ...config.availability,
      },
    };
    this._rulesText = stringifyJson(this._config.rules ?? []);
    this._staleRulesText = stringifyJson(this._config.stale_rules ?? []);
    this._rulesError = undefined;
    this._staleRulesError = undefined;
    this._configError = undefined;
  }

  protected override render(): TemplateResult {
    const exclude = {
      ...DEFAULT_CONFIG.exclude,
      ...this._config.exclude,
    };
    const include = {
      ...DEFAULT_CONFIG.include,
      ...this._config.include,
    };
    const availability = {
      ...DEFAULT_CONFIG.availability,
      ...this._config.availability,
    };

    return html`
      <div class="editor">
        ${this._renderJsonError(this._configError)}
        <div class="section">
          <label for="title">Card title</label>
          <input
            id="title"
            .value=${this._config.title ?? DEFAULT_CONFIG.title}
            @input=${(event: InputEvent) => this._setConfigValue("title", inputValue(event))}
          />
        </div>

        <div class="section toggles">
          ${this._renderCheckbox(
            "detect_batteries",
            "Battery detection",
            this._config.detect_batteries ?? DEFAULT_CONFIG.detect_batteries,
          )}
          ${this._renderCheckbox(
            "detect_stale",
            "Global stale detection",
            this._config.detect_stale ?? DEFAULT_CONFIG.detect_stale,
          )}
          ${this._renderCheckbox(
            "reverse_age_sort",
            "Newest first within severity",
            this._config.reverse_age_sort ?? DEFAULT_CONFIG.reverse_age_sort,
          )}
        </div>

        <div class="section">
          <h3>Availability</h3>
          <div class="toggles">
            ${this._renderAvailabilityCheckbox(
              "detect_unavailable",
              "Unavailable detection",
              availability.detect_unavailable,
            )}
            ${this._renderAvailabilityCheckbox(
              "detect_unknown",
              "Unknown detection",
              availability.detect_unknown,
            )}
          </div>
          <div class="row">
            ${this._renderSeveritySelect(
              "unavailable_severity",
              "Unavailable severity",
              availability.unavailable_severity,
            )}
            ${this._renderSeveritySelect(
              "unknown_severity",
              "Unknown severity",
              availability.unknown_severity,
            )}
          </div>
          <div class="row">
            ${this._renderAvailabilityNumber(
              "unavailable_for_minutes",
              "Unavailable duration (minutes)",
              availability.unavailable_for_minutes,
            )}
            ${this._renderAvailabilityNumber(
              "unknown_for_minutes",
              "Unknown duration (minutes)",
              availability.unknown_for_minutes,
            )}
          </div>
          ${this._renderAvailabilityNumber(
            "startup_grace_minutes",
            "Startup grace (minutes)",
            availability.startup_grace_minutes,
          )}
        </div>

        <div class="section row">
          <div>
            <label for="battery-warning">Battery warning threshold</label>
            <input
              id="battery-warning"
              type="number"
              min="1"
              max="100"
              .value=${String(this._config.battery_warning ?? DEFAULT_CONFIG.battery_warning)}
              @change=${(event: InputEvent) =>
                this._setConfigValue("battery_warning", numericValue(event))}
            />
          </div>
          <div>
            <label for="battery-critical">Battery critical threshold</label>
            <input
              id="battery-critical"
              type="number"
              min="1"
              max="100"
              .value=${String(this._config.battery_critical ?? DEFAULT_CONFIG.battery_critical)}
              @change=${(event: InputEvent) =>
                this._setConfigValue("battery_critical", numericValue(event))}
            />
          </div>
        </div>

        <div class="section row">
          ${this._renderEntitySelector(
            "battery_warning_entity",
            "Dynamic battery warning entity",
            this._config.battery_warning_entity,
          )}
          ${this._renderEntitySelector(
            "battery_critical_entity",
            "Dynamic battery critical entity",
            this._config.battery_critical_entity,
          )}
        </div>

        <div class="section row">
          <div>
            <label for="display-mode">Display mode</label>
            <select
              id="display-mode"
              .value=${this._config.display_mode ?? DEFAULT_CONFIG.display_mode}
              @change=${(event: InputEvent) =>
                this._setConfigValue("display_mode", inputValue(event) as DisplayMode)}
            >
              <option value="full">Full issue list</option>
              <option value="compact">Compact issue list</option>
              <option value="summary">Summary only</option>
            </select>
          </div>
          <div>
            <label for="empty-state">Empty state</label>
            <select
              id="empty-state"
              .value=${this._config.empty_state ?? DEFAULT_CONFIG.empty_state}
              @change=${(event: InputEvent) =>
                this._setConfigValue("empty_state", inputValue(event) as EmptyState)}
            >
              <option value="message">Show normal message</option>
              <option value="hide">Hide card</option>
            </select>
          </div>
        </div>

        <div class="section row">
          <div>
            <label for="group-by">Group by</label>
            <select
              id="group-by"
              .value=${this._config.group_by ?? DEFAULT_CONFIG.group_by}
              @change=${(event: InputEvent) =>
                this._setConfigValue("group_by", inputValue(event) as GroupBy)}
            >
              <option value="none">No grouping</option>
              <option value="severity">Severity</option>
              <option value="area">Area</option>
              <option value="source">Source</option>
              <option value="device">Device</option>
            </select>
          </div>
          <div>
            <label for="max-issues">Maximum issues</label>
            <input
              id="max-issues"
              type="number"
              min="1"
              .value=${this._config.max_issues === undefined ? "" : String(this._config.max_issues)}
              @change=${(event: InputEvent) =>
                this._setConfigValue("max_issues", optionalNumericValue(event))}
            />
          </div>
        </div>

        <div class="section row">
          <fieldset>
            <legend>Show severities</legend>
            ${(["critical", "warning", "info"] as Severity[]).map((severity) =>
              this._renderArrayCheckbox(
                "show_severities",
                severity,
                (this._config.show_severities ?? DEFAULT_CONFIG.show_severities).includes(severity),
              ),
            )}
          </fieldset>
          <fieldset>
            <legend>Show sources</legend>
            ${(["unavailable", "battery", "stale", "rule"] as IssueSource[]).map((source) =>
              this._renderArrayCheckbox(
                "show_sources",
                source,
                (this._config.show_sources ?? DEFAULT_CONFIG.show_sources).includes(source),
              ),
            )}
          </fieldset>
        </div>

        <div class="section">
          <label for="collapsed-groups">Initially collapsed groups</label>
          <textarea
            id="collapsed-groups"
            .value=${linesToText(this._config.collapsed_groups)}
            @change=${(event: InputEvent) =>
              this._setConfigValue("collapsed_groups", textToLines(inputValue(event)))}
          ></textarea>
        </div>

        <div class="section">
          <label for="include-labels">Included labels</label>
          <ha-selector
            id="include-labels"
            .hass=${this.hass}
            .selector=${{ label: { multiple: true } }}
            .value=${include.labels}
            @value-changed=${(event: CustomEvent<{ value?: string | string[] }>) =>
              this._setIncludeLabels(labelValues(event))}
          ></ha-selector>
        </div>

        <div class="section">
          <label for="exclude-domains">Excluded domains</label>
          <textarea
            id="exclude-domains"
            .value=${linesToText(exclude.domains)}
            @change=${(event: InputEvent) => this._setExcludeLines("domains", inputValue(event))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-entities">Excluded entities</label>
          <textarea
            id="exclude-entities"
            .value=${linesToText(exclude.entities)}
            @change=${(event: InputEvent) => this._setExcludeLines("entities", inputValue(event))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-patterns">Excluded entity patterns</label>
          <textarea
            id="exclude-patterns"
            .value=${linesToText(exclude.patterns)}
            @change=${(event: InputEvent) => this._setExcludeLines("patterns", inputValue(event))}
          ></textarea>
        </div>

        <div class="section">
          <label for="exclude-labels">Excluded labels</label>
          <ha-selector
            id="exclude-labels"
            .hass=${this.hass}
            .selector=${{ label: { multiple: true } }}
            .value=${exclude.labels}
            @value-changed=${(event: CustomEvent<{ value?: string | string[] }>) =>
              this._setExcludeLabels(labelValues(event))}
          ></ha-selector>
        </div>

        <div class="section">
          <label for="stale-rules">Stale rules JSON</label>
          <textarea
            id="stale-rules"
            .value=${this._staleRulesText}
            @input=${(event: InputEvent) => {
              this._setJsonText("stale_rules", inputValue(event));
            }}
            @change=${() => this._setJsonRules("stale_rules", this._staleRulesText)}
          ></textarea>
          ${this._renderJsonError(this._staleRulesError)}
        </div>

        <div class="section">
          <label for="rules">User rules JSON</label>
          <textarea
            id="rules"
            .value=${this._rulesText}
            @input=${(event: InputEvent) => {
              this._setJsonText("rules", inputValue(event));
            }}
            @change=${() => this._setJsonRules("rules", this._rulesText)}
          ></textarea>
          ${this._renderJsonError(this._rulesError)}
        </div>
      </div>
    `;
  }

  private _renderCheckbox(
    key: "detect_unavailable" | "detect_batteries" | "detect_stale" | "reverse_age_sort",
    label: string,
    checked: boolean,
  ): TemplateResult {
    return html`
      <label class="switch-row">
        <span>${label}</span>
        <input
          type="checkbox"
          .checked=${checked}
          @change=${(event: InputEvent) => this._setConfigValue(key, checkedValue(event))}
        />
      </label>
    `;
  }

  private _renderAvailabilityCheckbox(
    key: "detect_unavailable" | "detect_unknown",
    label: string,
    checked: boolean,
  ): TemplateResult {
    return html`
      <label class="switch-row">
        <span>${label}</span>
        <input
          type="checkbox"
          .checked=${checked}
          @change=${(event: InputEvent) => this._setAvailabilityValue(key, checkedValue(event))}
        />
      </label>
    `;
  }

  private _renderSeveritySelect(
    key: "unavailable_severity" | "unknown_severity",
    label: string,
    value: Severity,
  ): TemplateResult {
    return html`
      <div>
        <label>${label}</label>
        <select
          .value=${value}
          @change=${(event: InputEvent) =>
            this._setAvailabilityValue(key, inputValue(event) as Severity)}
        >
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>
    `;
  }

  private _renderAvailabilityNumber(
    key: "unavailable_for_minutes" | "unknown_for_minutes" | "startup_grace_minutes",
    label: string,
    value: number,
  ): TemplateResult {
    return html`
      <div>
        <label>${label}</label>
        <input
          type="number"
          min="0"
          .value=${String(value)}
          @change=${(event: InputEvent) => this._setAvailabilityValue(key, numericValue(event))}
        />
      </div>
    `;
  }

  private _renderEntitySelector(
    key: "battery_warning_entity" | "battery_critical_entity",
    label: string,
    value: string | undefined,
  ): TemplateResult {
    return html`
      <div>
        <label>${label}</label>
        <ha-selector
          .hass=${this.hass}
          .selector=${{ entity: {} }}
          .value=${value}
          @value-changed=${(event: CustomEvent<{ value?: string }>) =>
            this._setConfigValue(key, event.detail.value || undefined)}
        ></ha-selector>
      </div>
    `;
  }

  private _renderArrayCheckbox(
    key: "show_severities" | "show_sources",
    value: Severity | IssueSource,
    checked: boolean,
  ): TemplateResult {
    return html`
      <label class="filter-option">
        <input
          type="checkbox"
          .checked=${checked}
          @change=${(event: InputEvent) => this._toggleArrayValue(key, value, checkedValue(event))}
        />
        <span>${value}</span>
      </label>
    `;
  }

  private _renderJsonError(error: string | undefined): TemplateResult | string {
    if (!error) {
      return "";
    }
    return html`<div class="error" role="alert" aria-live="polite">${error}</div>`;
  }

  private _setConfigValue<Key extends keyof AttentionCenterCardConfig>(
    key: Key,
    value: AttentionCenterCardConfig[Key],
  ): void {
    this._emitConfig({
      ...this._config,
      [key]: value,
    });
  }

  private _setExcludeLines(key: keyof ExclusionConfig, value: string): void {
    this._emitConfig({
      ...this._config,
      exclude: {
        ...DEFAULT_CONFIG.exclude,
        ...this._config.exclude,
        [key]: textToLines(value),
      },
    });
  }

  private _setIncludeLabels(labels: string[]): void {
    this._emitConfig({
      ...this._config,
      include: {
        ...DEFAULT_CONFIG.include,
        ...this._config.include,
        labels,
      },
    });
  }

  private _setExcludeLabels(labels: string[]): void {
    this._emitConfig({
      ...this._config,
      exclude: {
        ...DEFAULT_CONFIG.exclude,
        ...this._config.exclude,
        labels,
      },
    });
  }

  private _setAvailabilityValue<Key extends keyof AvailabilityConfig>(
    key: Key,
    value: AvailabilityConfig[Key],
  ): void {
    this._emitConfig({
      ...this._config,
      availability: {
        ...DEFAULT_CONFIG.availability,
        ...this._config.availability,
        [key]: value,
      },
    });
  }

  private _toggleArrayValue(
    key: "show_severities" | "show_sources",
    value: Severity | IssueSource,
    checked: boolean,
  ): void {
    const current = new Set(this._config[key] ?? DEFAULT_CONFIG[key]);
    if (checked) {
      current.add(value as never);
    } else {
      current.delete(value as never);
    }
    this._setConfigValue(key, [...current] as AttentionCenterCardConfig[typeof key]);
  }

  private _setJsonText(key: "rules" | "stale_rules", text: string): void {
    if (key === "rules") {
      this._rulesText = text;
      this._rulesError = parseJsonArray(text).error;
    } else {
      this._staleRulesText = text;
      this._staleRulesError = parseJsonArray(text).error;
    }
  }

  private _setJsonRules(key: "rules" | "stale_rules", text: string): void {
    const parsed = parseJsonArray(text);
    if (key === "rules") {
      this._rulesError = parsed.error;
    } else {
      this._staleRulesError = parsed.error;
    }
    if (parsed.error) {
      return;
    }
    this._emitConfig({
      ...this._config,
      [key]: parsed.value,
    });
  }

  private _emitConfig(config: AttentionCenterCardConfig): void {
    try {
      normalizeConfig(config);
    } catch (error) {
      this._configError = error instanceof Error ? error.message : "Invalid configuration.";
      return;
    }
    this._configError = undefined;
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: { config },
      }),
    );
  }
}

function inputValue(event: InputEvent): string {
  const target = event.currentTarget;
  return target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
    ? target.value
    : "";
}

function labelValues(event: CustomEvent<{ value?: string | string[] }>): string[] {
  const value = event.detail.value;
  return Array.isArray(value) ? value : value ? [value] : [];
}

function checkedValue(event: InputEvent): boolean {
  const target = event.currentTarget;
  return target instanceof HTMLInputElement ? target.checked : false;
}

function numericValue(event: InputEvent): number {
  const value = Number(inputValue(event));
  return Number.isFinite(value) ? value : 0;
}

function optionalNumericValue(event: InputEvent): number | undefined {
  const value = inputValue(event).trim();
  return value === "" ? undefined : Number(value);
}

function linesToText(lines: string[] | undefined): string {
  return (lines ?? []).join("\n");
}

function textToLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function stringifyJson(value: UserRule[] | StaleRule[]): string {
  return JSON.stringify(value, null, 2);
}

function parseJsonArray(text: string): {
  value?: UserRule[] | StaleRule[];
  error?: string;
} {
  try {
    const parsed: unknown = JSON.parse(text.trim() || "[]");
    if (!Array.isArray(parsed)) {
      return { error: "Value must be a JSON array." };
    }
    return { value: parsed as UserRule[] | StaleRule[] };
  } catch (error) {
    return {
      error: `Invalid JSON: ${error instanceof Error ? error.message : "Unable to parse value."}`,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "attention-center-card-editor": AttentionCenterCardEditor;
  }
}

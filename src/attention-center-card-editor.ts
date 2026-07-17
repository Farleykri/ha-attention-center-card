import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DEFAULT_CONFIG } from "./config";
import { editorStyles } from "./styles";
import type {
  AttentionCenterCardConfig,
  DisplayMode,
  EmptyState,
  ExclusionConfig,
  HomeAssistant,
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

  public setConfig(config: AttentionCenterCardConfig): void {
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      exclude: {
        ...DEFAULT_CONFIG.exclude,
        ...config.exclude,
      },
    };
    this._rulesText = stringifyJson(this._config.rules ?? []);
    this._staleRulesText = stringifyJson(this._config.stale_rules ?? []);
  }

  protected override render(): TemplateResult {
    const exclude = {
      ...DEFAULT_CONFIG.exclude,
      ...this._config.exclude,
    };

    return html`
      <div class="editor">
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
            "detect_unavailable",
            "Unavailable detection",
            this._config.detect_unavailable ?? DEFAULT_CONFIG.detect_unavailable,
          )}
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
          <label for="stale-rules">Stale rules JSON</label>
          <textarea
            id="stale-rules"
            .value=${this._staleRulesText}
            @input=${(event: InputEvent) => {
              this._staleRulesText = inputValue(event);
            }}
            @change=${() => this._setJsonRules("stale_rules", this._staleRulesText)}
          ></textarea>
        </div>

        <div class="section">
          <label for="rules">User rules JSON</label>
          <textarea
            id="rules"
            .value=${this._rulesText}
            @input=${(event: InputEvent) => {
              this._rulesText = inputValue(event);
            }}
            @change=${() => this._setJsonRules("rules", this._rulesText)}
          ></textarea>
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

  private _setJsonRules(key: "rules" | "stale_rules", text: string): void {
    const parsed = parseJsonArray(text);
    if (!parsed) {
      return;
    }
    this._emitConfig({
      ...this._config,
      [key]: parsed,
    });
  }

  private _emitConfig(config: AttentionCenterCardConfig): void {
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

function checkedValue(event: InputEvent): boolean {
  const target = event.currentTarget;
  return target instanceof HTMLInputElement ? target.checked : false;
}

function numericValue(event: InputEvent): number {
  const value = Number(inputValue(event));
  return Number.isFinite(value) ? value : 0;
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

function parseJsonArray(text: string): UserRule[] | StaleRule[] | undefined {
  try {
    const parsed: unknown = JSON.parse(text.trim() || "[]");
    return Array.isArray(parsed) ? (parsed as UserRule[] | StaleRule[]) : undefined;
  } catch {
    return undefined;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "attention-center-card-editor": AttentionCenterCardEditor;
  }
}

import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { DEFAULT_CONFIG, configKey, normalizeConfig } from "./config";
import { createEvaluationPlan, evaluateAttentionIssues } from "./evaluate";
import { formatDurationSince } from "./duration";
import { countBySeverity } from "./severity";
import { cardStyles } from "./styles";
import type {
  AttentionCenterCardConfig,
  AttentionIssue,
  EvaluationPlan,
  HomeAssistant,
  NormalizedAttentionCenterCardConfig,
  Severity,
} from "./types";

const CARD_TAG = "attention-center-card";
const EDITOR_TAG = "attention-center-card-editor";

@customElement(CARD_TAG)
export class AttentionCenterCard extends LitElement {
  public static override styles = cardStyles;

  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private _issues: AttentionIssue[] = [];

  private _config?: NormalizedAttentionCenterCardConfig;
  private _plan?: EvaluationPlan;
  private _configKey = "";
  private _lastConfigKey = "";
  private _lastStatesRef?: HomeAssistant["states"];

  public setConfig(config: AttentionCenterCardConfig): void {
    const normalized = normalizeConfig(config);
    this._config = normalized;
    this._plan = createEvaluationPlan(normalized);
    this._configKey = configKey(normalized);
    this._lastConfigKey = "";
    this._lastStatesRef = undefined;
    this._recalculateIssues();
  }

  public static getStubConfig(): AttentionCenterCardConfig {
    return {
      title: DEFAULT_CONFIG.title,
      detect_unavailable: true,
      detect_batteries: true,
      battery_warning: DEFAULT_CONFIG.battery_warning,
      battery_critical: DEFAULT_CONFIG.battery_critical,
      display_mode: "full",
      empty_state: "message",
    };
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./attention-center-card-editor");
    return document.createElement(EDITOR_TAG);
  }

  public getCardSize(): number {
    if (!this._config || this._config.empty_state === "hide") {
      return 1;
    }
    if (this._config.display_mode === "summary") {
      return 2;
    }
    return Math.min(6, Math.max(2, this._issues.length + 1));
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("hass")) {
      this._recalculateIssues();
    }
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this._config) {
      return html``;
    }

    if (this._issues.length === 0 && this._config.empty_state === "hide") {
      return nothing;
    }

    const counts = countBySeverity(this._issues);
    const total = this._issues.length;

    return html`
      <ha-card>
        <div class="header">
          <div class="title-row">
            <h2>${this._config.title}</h2>
            <span class="total" aria-label="${total} active issues">${total}</span>
          </div>
          <div class="counts" aria-label="Issue counts by severity">
            ${this._renderCountChip("critical", counts.critical)}
            ${this._renderCountChip("warning", counts.warning)}
            ${this._renderCountChip("info", counts.info)}
          </div>
        </div>
        ${this._renderBody()}
      </ha-card>
    `;
  }

  private _renderBody(): TemplateResult {
    if (!this._config) {
      return html``;
    }

    const counts = countBySeverity(this._issues);
    if (this._config.display_mode === "summary") {
      return html`
        <div class="summary" role="list" aria-label="Issue summary">
          ${this._renderSummaryCell("critical", counts.critical)}
          ${this._renderSummaryCell("warning", counts.warning)}
          ${this._renderSummaryCell("info", counts.info)}
        </div>
        ${this._issues.length === 0 ? this._renderEmptyState() : nothing}
      `;
    }

    if (this._issues.length === 0) {
      return this._renderEmptyState();
    }

    return html`
      <div class="list ${this._config.display_mode === "compact" ? "compact" : ""}" role="list">
        ${repeat(
          this._issues,
          (issue) => issue.id,
          (issue) => this._renderIssue(issue),
        )}
      </div>
    `;
  }

  private _renderIssue(issue: AttentionIssue): TemplateResult {
    const duration = formatDurationSince(issue.activeSinceMs);
    return html`
      <button
        class="issue"
        role="listitem"
        type="button"
        aria-label="${issue.title}, ${issue.severity}, ${issue.message}, active for ${duration}"
        @click=${() => this._openMoreInfo(issue.entity_id)}
        @keydown=${(event: KeyboardEvent) => this._handleIssueKeydown(event, issue.entity_id)}
      >
        <span class="entity-icon" aria-hidden="true"><ha-icon .icon=${issue.icon}></ha-icon></span>
        <span class="main">
          <span class="issue-title">${issue.title}</span>
          <span class="message">${issue.message}</span>
          <span class="meta">
            <span>${duration}</span>
            <span>${issue.state}</span>
            ${issue.area ? html`<span>${issue.area}</span>` : nothing}
          </span>
        </span>
        ${this._renderSeverityChip(issue.severity)}
      </button>
    `;
  }

  private _renderEmptyState(): TemplateResult {
    return html`<div class="empty">Everything looks normal</div>`;
  }

  private _renderCountChip(severity: Severity, count: number): TemplateResult {
    return html`
      <span class="count-chip" data-severity=${severity}>
        <ha-icon .icon=${severityIcon(severity)}></ha-icon>
        <span>${severityLabel(severity)} ${count}</span>
      </span>
    `;
  }

  private _renderSeverityChip(severity: Severity): TemplateResult {
    return html`
      <span class="severity-chip" data-severity=${severity}>
        <ha-icon .icon=${severityIcon(severity)}></ha-icon>
        <span>${severityLabel(severity)}</span>
      </span>
    `;
  }

  private _renderSummaryCell(severity: Severity, count: number): TemplateResult {
    return html`
      <div class="summary-cell" role="listitem">
        <span class="summary-value">${count}</span>
        <span class="summary-label">${severityLabel(severity)}</span>
      </div>
    `;
  }

  private _recalculateIssues(): void {
    if (!this.hass || !this._plan) {
      return;
    }

    if (this.hass.states === this._lastStatesRef && this._configKey === this._lastConfigKey) {
      return;
    }

    // Keep the full Home Assistant state scan outside render so Lit updates only paint prepared rows.
    this._issues = evaluateAttentionIssues(this.hass, this._plan);
    this._lastStatesRef = this.hass.states;
    this._lastConfigKey = this._configKey;
  }

  private _openMoreInfo(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId },
      }),
    );
  }

  private _handleIssueKeydown(event: KeyboardEvent, entityId: string): void {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    this._openMoreInfo(entityId);
  }
}

function severityIcon(severity: Severity): string {
  if (severity === "critical") {
    return "mdi:alert-octagon";
  }
  if (severity === "warning") {
    return "mdi:alert";
  }
  return "mdi:information";
}

function severityLabel(severity: Severity): string {
  return severity[0].toUpperCase() + severity.slice(1);
}

interface LovelaceCustomCardInfo {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
  documentationURL?: string;
}

declare global {
  interface Window {
    customCards?: LovelaceCustomCardInfo[];
  }

  interface HTMLElementTagNameMap {
    [CARD_TAG]: AttentionCenterCard;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: CARD_TAG,
  name: "Attention Center",
  description: "Automatically surfaces unavailable, low-battery, stale, and rule-matched entities.",
  preview: true,
  documentationURL: "https://github.com/Farleykri/ha-attention-center-card",
});

import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    overflow: hidden;
  }

  .header {
    display: grid;
    gap: 6px;
    padding: 16px 16px 12px;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-width: 0;
  }

  h2 {
    margin: 0;
    min-width: 0;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--primary-text-color);
    overflow-wrap: anywhere;
  }

  .total {
    flex: 0 0 auto;
    min-width: 34px;
    padding: 3px 9px;
    border-radius: 999px;
    color: var(--text-primary-color, #fff);
    background: var(--primary-color);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
    text-align: center;
  }

  .counts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .count-chip,
  .severity-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 24px;
    padding: 2px 8px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 999px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
    line-height: 1.4;
    text-transform: uppercase;
  }

  .count-chip ha-icon,
  .severity-chip ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
  }

  .count-chip[data-severity="critical"],
  .severity-chip[data-severity="critical"] {
    color: var(--error-color, #db4437);
    border-color: color-mix(in srgb, var(--error-color, #db4437), transparent 55%);
  }

  .count-chip[data-severity="warning"],
  .severity-chip[data-severity="warning"] {
    color: var(--warning-color, #f4a000);
    border-color: color-mix(in srgb, var(--warning-color, #f4a000), transparent 45%);
  }

  .count-chip[data-severity="info"],
  .severity-chip[data-severity="info"] {
    color: var(--info-color, var(--primary-color));
    border-color: color-mix(in srgb, var(--info-color, var(--primary-color)), transparent 45%);
  }

  .summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    background: var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .summary-cell {
    display: grid;
    gap: 2px;
    min-width: 0;
    padding: 13px 12px;
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }

  .summary-value {
    color: var(--primary-text-color);
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  .summary-label {
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .empty {
    padding: 18px 16px;
    color: var(--secondary-text-color);
  }

  .diagnostics {
    display: grid;
    gap: 4px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    color: var(--warning-color, #b26a00);
    background: color-mix(in srgb, var(--warning-color, #f4a000), transparent 92%);
    font-size: 12px;
    line-height: 1.4;
  }

  .hidden-count {
    padding: 10px 16px;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 600;
  }

  .groups {
    display: grid;
  }

  .issue-group {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .issue-group:first-child {
    border-top: 0;
  }

  .issue-group summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 42px;
    padding: 8px 16px;
    color: var(--primary-text-color);
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.025));
    cursor: pointer;
    box-sizing: border-box;
  }

  .group-heading {
    min-width: 0;
    font-size: 13px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  .group-count {
    flex: 0 0 auto;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
  }

  .list {
    display: grid;
  }

  .issue {
    display: grid;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .issue:first-child {
    border-top: 0;
  }

  .issue-main {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 12px;
    width: 100%;
    min-height: 58px;
    padding: 12px 16px;
    border: 0;
    color: var(--primary-text-color);
    background: transparent;
    text-align: left;
    cursor: pointer;
    box-sizing: border-box;
  }

  .issue-main:focus-visible,
  .issue-action:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }

  .issue-main:hover,
  .issue-action:hover {
    background: var(--state-hover-color, rgba(0, 0, 0, 0.04));
  }

  .issue-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 0 16px 10px 52px;
  }

  .issue-action {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 30px;
    padding: 4px 8px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.18));
    border-radius: 6px;
    color: var(--primary-text-color);
    background: transparent;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }

  .issue-action ha-icon {
    --mdc-icon-size: 17px;
    width: 17px;
    height: 17px;
  }

  .entity-icon {
    align-self: start;
    margin-top: 2px;
    color: var(--secondary-text-color);
  }

  .entity-icon ha-icon {
    --mdc-icon-size: 24px;
  }

  .main {
    display: grid;
    gap: 4px;
    min-width: 0;
  }

  .issue-title {
    min-width: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .message,
  .meta {
    min-width: 0;
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
  }

  .compact .issue-main {
    min-height: 46px;
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding-block: 9px;
  }

  .compact .message {
    display: none;
  }

  @media (max-width: 420px) {
    .issue {
      display: grid;
    }

    .issue-main {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .severity-chip {
      grid-column: 2;
      justify-self: start;
    }

    .issue-actions {
      padding-left: 16px;
    }

    .summary {
      grid-template-columns: 1fr;
    }
  }
`;

export const editorStyles = css`
  :host {
    display: block;
  }

  .editor {
    display: grid;
    gap: 16px;
  }

  .section {
    display: grid;
    gap: 10px;
  }

  h3 {
    margin: 0;
    color: var(--primary-text-color);
    font-size: 15px;
    font-weight: 600;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .toggles {
    display: grid;
    gap: 8px;
  }

  fieldset {
    display: grid;
    gap: 7px;
    min-width: 0;
    margin: 0;
    padding: 10px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.18));
    border-radius: 6px;
  }

  legend {
    padding: 0 4px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--primary-text-color);
    font-size: 13px;
    font-weight: 400;
    text-transform: none;
  }

  .filter-option input {
    width: auto;
  }

  label {
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  textarea,
  select,
  input {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.18));
    border-radius: 6px;
    padding: 9px 10px;
    color: var(--primary-text-color);
    background: var(--secondary-background-color, transparent);
    font: inherit;
  }

  textarea {
    min-height: 86px;
    resize: vertical;
    font-family: var(--code-font-family, monospace);
    font-size: 13px;
  }

  .switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .error {
    color: var(--error-color, #db4437);
    font-size: 12px;
    line-height: 1.35;
  }

  @media (max-width: 520px) {
    .row {
      grid-template-columns: 1fr;
    }
  }
`;

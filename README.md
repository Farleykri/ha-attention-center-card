# Attention Center Card

Attention Center is a frontend-only Home Assistant custom Lovelace card that finds entities needing attention and presents them as a prioritized, filterable issue list.

Version 0.2 adds label targeting, accessible issue groups, filters and limits, dynamic thresholds, numeric hysteresis, inline actions, and separate unknown/unavailable policies. It does not require a custom integration, backend service, cloud API, Node-RED, card-mod, browser_mod, Mushroom, or auto-entities.

## Installation With HACS

1. In HACS, open the three-dot menu and choose **Custom repositories**.
2. Add `https://github.com/Farleykri/ha-attention-center-card`.
3. Select category **Dashboard**.
4. Install **Attention Center Card**.
5. Reload the browser, or clear the frontend cache if Home Assistant serves an old resource.
6. Add `custom:attention-center-card` to a dashboard.

HACS registers this resource:

```text
/hacsfiles/ha-attention-center-card/ha-attention-center-card.js
```

## Manual Installation

1. Run `npm install` and `npm run build`.
2. Copy `ha-attention-center-card.js` to `config/www/community/ha-attention-center-card/`.
3. Register the following Lovelace resource:

```yaml
url: /local/community/ha-attention-center-card/ha-attention-center-card.js
type: module
```

## Version 0.1 Compatible Example

Existing Version 0.1 configuration remains valid without changes:

```yaml
type: custom:attention-center-card
title: House Attention Center

detect_unavailable: true
detect_batteries: true
battery_warning: 30
battery_critical: 15

display_mode: full
empty_state: message

exclude:
  domains:
    - button
    - update
  entities:
    - sensor.time
    - sensor.date
  patterns:
    - sensor.*_last_seen
```

The same configuration is available at [`examples/version-0.1.yaml`](examples/version-0.1.yaml).

## Version 0.2 Example

A complete beta configuration is available at [`examples/version-0.2.yaml`](examples/version-0.2.yaml).

### Label-Based Monitoring

Label values are Home Assistant label IDs. Labels assigned to an entity or its associated device are both considered.

```yaml
include:
  labels:
    - monitor

exclude:
  labels:
    - ignore_attention_center

rules:
  - label: critical_sensor
    state: unavailable
    severity: critical
    title: Critical sensor unavailable
```

`include.labels` limits automatic unavailable, unknown, and battery detection. Explicit rules are not limited by inclusion labels, but all exclusions still apply. Entity ID rules continue to support exact IDs and `*`/`?` wildcards.

### Grouping, Filters, and Limits

```yaml
group_by: area
collapsed_groups:
  - Garage

show_severities:
  - critical
  - warning

show_sources:
  - unavailable
  - battery
  - stale
  - rule

max_issues: 20
```

Supported grouping modes are `none`, `severity`, `area`, `source`, and `device`. Groups have accessible headings and active counts. `collapsed_groups` accepts the displayed area name, severity/source key, or device ID. Filtering occurs before grouping. Summary counts include every filtered issue before `max_issues` is applied, and the card reports how many issues the limit hides.

### Dynamic Thresholds

```yaml
battery_warning_entity: input_number.battery_warning_threshold
battery_critical_entity: input_number.battery_critical_threshold

rules:
  - entity_id: sensor.basement_humidity
    above_entity: input_number.basement_humidity_warning
    severity: warning

  - entity_id: sensor.generator_fuel_percent
    below_entity: input_number.generator_fuel_warning
    severity: warning
```

Threshold entities must have finite numeric states. Missing, `unknown`, `unavailable`, and nonnumeric values suppress the affected detector or rule and produce a visible diagnostic instead of a false issue. Fixed `above`, `below`, `battery_warning`, and `battery_critical` values remain supported.

### Hysteresis

```yaml
rules:
  - entity_id: sensor.basement_humidity
    above: 65
    clear_below: 60
    for_minutes: 15
    severity: warning

  - entity_id: sensor.generator_fuel_percent
    below: 25
    clear_above: 30
    severity: warning
```

After a numeric issue becomes active, `clear_below` or `clear_above` keeps it active through small value fluctuations. Hysteresis state is held only in frontend memory and resets when the rule/entity disappears or the browser reloads.

### Inline Actions

```yaml
rules:
  - entity_id: binary_sensor.garage_entry_door
    state: "on"
    for_minutes: 15
    severity: warning
    title: Garage entry door left open
    actions:
      - name: View garage
        icon: mdi:cctv
        navigation_path: /dashboard-cameras/garage

      - name: Run garage script
        icon: mdi:garage
        service: script.turn_on
        target:
          entity_id: script.close_garage
        data:
          source: attention_center
        confirmation: true

      - name: More info
        action: more-info
```

Actions support More Info, Home Assistant navigation, HTTP/HTTPS URLs, and `domain.service` calls with optional `target` and `data`. Action buttons do not trigger the issue row. Confirmation uses the browser's native confirmation dialog because Home Assistant's styled confirmation helper is not a public custom-card API. JavaScript URLs, templates, and arbitrary code are rejected.

### Availability Policies

```yaml
availability:
  detect_unavailable: true
  detect_unknown: true
  unavailable_severity: warning
  unknown_severity: info
  unavailable_for_minutes: 10
  unknown_for_minutes: 5
  startup_grace_minutes: 5
```

Startup grace begins when the card instance first connects. It suppresses automatic unknown/unavailable issues only; explicit user rules still evaluate. Without an `availability` block, legacy `detect_unavailable` continues to enable or disable both states, both use warning severity, and all duration/grace values default to zero.

## Configuration Reference

| Option                                               | Default            | Description                                                                  |
| ---------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------- |
| `title`                                              | `Attention Center` | Card heading.                                                                |
| `detect_unavailable`                                 | `true`             | Version 0.1 compatibility switch for unknown and unavailable detection.      |
| `detect_batteries`                                   | `true`             | Enable automatic low-battery detection.                                      |
| `battery_warning` / `battery_critical`               | `30` / `15`        | Fixed global battery thresholds.                                             |
| `battery_warning_entity` / `battery_critical_entity` | unset              | Numeric entities that replace global fixed thresholds at runtime.            |
| `battery_thresholds`                                 | `{}`               | Per-entity fixed battery threshold overrides.                                |
| `availability`                                       | legacy-compatible  | Separate detection, severity, duration, and startup grace settings.          |
| `detect_stale` / `stale_hours`                       | `false` / `24`     | Global stale detection and threshold.                                        |
| `stale_rules`                                        | `[]`               | Exact or wildcard stale checks.                                              |
| `rules`                                              | `[]`               | Entity/wildcard/label rules, thresholds, hysteresis, durations, and actions. |
| `include.labels`                                     | `[]`               | Limit automatic availability and battery scans to these label IDs.           |
| `exclude.domains`                                    | `[]`               | Domains to ignore.                                                           |
| `exclude.entities`                                   | `[]`               | Exact entity IDs to ignore.                                                  |
| `exclude.devices`                                    | `[]`               | Device IDs to ignore.                                                        |
| `exclude.areas`                                      | `[]`               | Area IDs or names to ignore.                                                 |
| `exclude.patterns`                                   | `[]`               | Wildcard entity IDs to ignore.                                               |
| `exclude.labels`                                     | `[]`               | Entity or inherited device label IDs to ignore.                              |
| `display_mode`                                       | `full`             | `full`, `compact`, or `summary`.                                             |
| `empty_state`                                        | `message`          | `message` or `hide`.                                                         |
| `reverse_age_sort`                                   | `false`            | Newest first within a severity.                                              |
| `group_by`                                           | `none`             | `none`, `severity`, `area`, `source`, or `device`.                           |
| `collapsed_groups`                                   | `[]`               | Group keys or labels initially rendered closed.                              |
| `show_severities`                                    | all                | Included severities.                                                         |
| `show_sources`                                       | all                | Included sources.                                                            |
| `max_issues`                                         | unlimited          | Positive maximum number of rendered issue rows.                              |

## Rule Reference

Each rule defines exactly one target: `entity_id` (exact or wildcard) or `label`. Supported conditions are `state`, `not_state`, `above`, `above_entity`, `below`, and `below_entity`. `attribute` applies a condition to an attribute. `for_minutes` delays activation.

`above` cannot be combined with `above_entity`, and `below` cannot be combined with `below_entity`. `clear_below` is valid only with an above condition and must resolve below its trigger. `clear_above` is valid only with a below condition and must resolve above its trigger.

Direct entity-state `state` and `not_state` durations initialize from `last_changed`. Numeric and attribute durations start when the frontend first observes the matching condition.

## Visual Editor

The visual editor supports grouping, maximum issue count, severity/source filters, availability settings, dynamic battery threshold entities, label inclusion/exclusion, and initially collapsed groups. Home Assistant entity selectors are used for dynamic battery references. Advanced rules, hysteresis, and actions remain in the JSON rule editor. Unknown or advanced configuration keys are preserved when common controls are edited, and validation errors are shown instead of silently dropping invalid values.

## Registry and Frontend Limitations

- Label targeting depends on `hass.entities` and `hass.devices` registry snapshots exposed to the Lovelace card. If those registries are unavailable in a frontend context, label matching cannot be performed.
- Configured labels use stable label IDs because label display-name registry data is not guaranteed on the card's `hass` object.
- Device and area grouping/exclusion also depend on frontend registry data. Unregistered entities fall into `No device` or `No area` groups.
- Startup grace and hysteresis are per-card-instance frontend memory and do not survive a browser reload.
- Dynamic threshold diagnostics are local to the card and are not Home Assistant Repairs issues.

## Development

```bash
npm install
npm run format
npm run format:check
npm run typecheck
npm run lint
npm run test
npm run build
```

The production build writes `dist/ha-attention-center-card.js` and copies the HACS bundle plus source map to the repository root.

## Roadmap

Persistent acknowledgements and snoozing are intentionally deferred to a future backend-enabled release. That release may also explore notifications, issue history, maintenance records, and deeper Home Assistant integration. Version 0.2 remains frontend-only and does not implement any of those features.

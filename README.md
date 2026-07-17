# Attention Center Card

Attention Center is a Home Assistant custom Lovelace card that automatically finds entities needing attention and presents them as a prioritized exception list.

Instead of hand-building many conditional cards, you configure broad detection rules once:

- unavailable or unknown entities
- low-battery entities
- stale entities
- user-defined state, attribute, numeric, duration, and wildcard rules

Version 1 is frontend-only. It uses only Home Assistant state data available to Lovelace cards and does not require a custom integration, backend service, cloud API, Node-RED, card-mod, browser_mod, Mushroom, or auto-entities.

## Screenshots

Screenshots will be added after the first packaged release is installed in a live Home Assistant dashboard.

Placeholder views:

- Full issue list
- Compact issue list
- Summary-only mode
- Empty state
- Visual configuration editor

## Installation With HACS

1. In HACS, open the three-dot menu and choose **Custom repositories**.
2. Add `https://github.com/Farleykri/ha-attention-center-card`.
3. Select category **Dashboard**.
4. Install **Attention Center Card**.
5. Reload your browser, or clear frontend cache if Home Assistant still serves the old resource.
6. Add the card to a dashboard.

HACS should register this resource:

```text
/hacsfiles/ha-attention-center-card/ha-attention-center-card.js
```

## Manual Installation

1. Build the card:

```bash
npm install
npm run build
```

2. Copy `ha-attention-center-card.js` to:

```text
config/www/community/ha-attention-center-card/ha-attention-center-card.js
```

3. Add a Lovelace resource:

```yaml
url: /local/community/ha-attention-center-card/ha-attention-center-card.js
type: module
```

4. Add a manual card:

```yaml
type: custom:attention-center-card
```

## Basic Configuration

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

## Full Example

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

stale_rules:
  - entity_id: sensor.basement_temperature
    hours: 6
  - entity_id: sensor.*_humidity
    hours: 12

rules:
  - entity_id: binary_sensor.basement_water_leak
    state: "on"
    severity: critical
    title: Basement water detected

  - entity_id: binary_sensor.garage_entry_door
    state: "on"
    for_minutes: 15
    severity: warning
    title: Garage entry door left open

  - entity_id: sensor.generator_fuel_percent
    below: 25
    severity: warning
    title: Generator fuel is low

  - entity_id: sensor.basement_humidity
    above: 65
    severity: warning
    title: Basement humidity is high

  - entity_id: climate.first_floor
    attribute: hvac_action
    state: cooling
    severity: info
    title: First floor is cooling
```

## Configuration Reference

| Option               | Type                         | Default            | Description                                                            |
| -------------------- | ---------------------------- | ------------------ | ---------------------------------------------------------------------- |
| `title`              | string                       | `Attention Center` | Header title.                                                          |
| `detect_unavailable` | boolean                      | `true`             | Detect entities with `unavailable` or `unknown` state.                 |
| `detect_batteries`   | boolean                      | `true`             | Detect low battery entities.                                           |
| `battery_warning`    | number                       | `30`               | Warning threshold, matched when battery is below this value.           |
| `battery_critical`   | number                       | `15`               | Critical threshold, matched when battery is below this value.          |
| `battery_thresholds` | object                       | `{}`               | Per-entity battery threshold overrides.                                |
| `detect_stale`       | boolean                      | `false`            | Enable global stale detection for all non-excluded entities.           |
| `stale_hours`        | number                       | `24`               | Global stale threshold when `detect_stale` is enabled.                 |
| `stale_rules`        | list                         | `[]`               | Selected stale checks by exact entity ID or wildcard pattern.          |
| `rules`              | list                         | `[]`               | User-defined state, attribute, numeric, and duration rules.            |
| `exclude.domains`    | list                         | `[]`               | Domains to ignore, such as `button`.                                   |
| `exclude.entities`   | list                         | `[]`               | Exact entity IDs to ignore.                                            |
| `exclude.devices`    | list                         | `[]`               | Device IDs to ignore when available from the frontend registry.        |
| `exclude.areas`      | list                         | `[]`               | Area IDs or names to ignore when available from the frontend registry. |
| `exclude.patterns`   | list                         | `[]`               | Wildcard entity patterns to ignore.                                    |
| `display_mode`       | `full`, `compact`, `summary` | `full`             | Layout mode.                                                           |
| `empty_state`        | `message`, `hide`            | `message`          | Show `Everything looks normal` or hide the card.                       |
| `reverse_age_sort`   | boolean                      | `false`            | Reverse age sorting within each severity group.                        |

## Battery Detection

Battery entities are detected using common Home Assistant conventions:

- `device_class: battery`
- percentage entities with battery-style entity IDs
- entity IDs containing battery naming patterns when device class metadata is missing

Per-entity threshold overrides:

```yaml
battery_thresholds:
  sensor.front_door_lock_battery:
    warning: 40
    critical: 20
  sensor.garage_keypad_battery: 50
```

When the override is a number, it overrides the warning threshold and keeps the global critical threshold.

## Stale Detection

Global stale detection is disabled by default because many valid Home Assistant entities update rarely. Prefer selected stale rules:

```yaml
stale_rules:
  - entity_id: sensor.basement_temperature
    hours: 6
  - entity_id: sensor.*_humidity
    hours: 12
    severity: info
```

The card uses `last_updated` first and falls back to `last_changed`.

## User Rules

Rules support exact entity IDs and wildcard patterns.

Supported operators:

- `state`
- `not_state`
- `above`
- `below`
- `attribute` plus `state`
- `for_minutes`

Examples:

```yaml
rules:
  - entity_id: binary_sensor.garage_entry_door
    state: "on"
    for_minutes: 15
    severity: warning
    title: Garage entry door left open

  - entity_id: sensor.generator_fuel_percent
    below: 25
    severity: warning

  - entity_id: sensor.*_humidity
    above: 65
    severity: warning

  - entity_id: climate.first_floor
    attribute: hvac_action
    state: cooling
    severity: info
```

Invalid, missing, nonnumeric, `unknown`, and `unavailable` values are ignored for numeric comparisons.

## Visual Editor

The card includes a Lovelace visual editor for common options:

- title
- unavailable, battery, and stale detection toggles
- warning and critical battery thresholds
- display mode
- empty-state behavior
- domain, entity, and wildcard exclusions

Advanced stale rules and user rules can be edited as JSON arrays in the visual editor. Full YAML configuration is supported in Home Assistant's manual editor.

## Development

```bash
npm install
npm run format
npm run typecheck
npm run lint
npm run test
npm run build
```

During development, add this resource in Home Assistant after building:

```yaml
url: /local/community/ha-attention-center-card/ha-attention-center-card.js
type: module
```

## Performance Notes

Attention Center recalculates issues when Home Assistant state or card configuration changes, not during Lit rendering. Wildcard matchers and exclusions are compiled from configuration before evaluation. The card still performs frontend state scans because Version 1 has no backend index, but the scan is kept outside rendering and all expensive configuration parsing is reused.

## Known Limitations

- Version 1 cannot persist acknowledgements or snoozes because it has no backend storage.
- Attribute duration rules use the entity's `last_updated` timestamp, which may change for reasons unrelated to the specific attribute.
- Device and area exclusions depend on frontend registry data exposed to the card.
- The visual editor uses JSON text areas for advanced rules instead of a full rule-builder UI.

## Roadmap

- Persistent acknowledgement
- Snoozing issues
- Home Assistant backend integration
- Notification support
- Repair integration support
- Device and area-level rules
- Dashboard actions
- Issue history
- Rule-builder UI
- Importable rule packs

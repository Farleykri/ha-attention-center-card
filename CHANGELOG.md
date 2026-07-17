# Changelog

## 0.2.0-beta.1

- Added entity and inherited device label inclusion, exclusion, and rule targeting.
- Added accessible grouping by severity, area, source, or device with filters, limits, collapsed groups, and hidden issue counts.
- Applied `max_issues` after global priority sorting while retaining complete group and summary counts.
- Added dynamic battery and numeric rule thresholds backed by Home Assistant entities with visible diagnostics.
- Added in-memory numeric hysteresis using `clear_below` and `clear_above`.
- Added validated inline More Info, navigation, URL, and service-call actions.
- Added separate unknown/unavailable policies, duration thresholds, severities, and startup grace.
- Expanded the visual editor with Home Assistant label selectors while preserving advanced configuration values.
- Added Version 0.1 regression coverage and Version 0.2 behavior tests and examples.

## 0.1.0

- Initial Version 1 release.
- Added unavailable and unknown entity detection.
- Added low-battery detection with global and per-entity thresholds.
- Added stale entity detection using global and selected rule-based checks.
- Added user-defined state, attribute, numeric, duration, and wildcard rules.
- Added full, compact, and summary display modes.
- Added visual Lovelace configuration editor.
- Added HACS metadata, documentation, tests, and CI.

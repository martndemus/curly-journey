#!/usr/bin/env bash
set -euo pipefail

tests=$(grep -oP '(?<=<!-- tests )\d+' test-results.xml)
pass=$(grep -oP '(?<=<!-- pass )\d+' test-results.xml)
fail=$(grep -oP '(?<=<!-- fail )\d+' test-results.xml)
skipped=$(grep -oP '(?<=<!-- skipped )\d+' test-results.xml)

annotations=$(node "$(dirname "$0")/build-test-annotations.mjs" test-results.xml)

jq -n \
  --arg title "$pass passed, $fail failed, $skipped skipped" \
  --arg summary "**$tests tests** — $pass passed, $fail failed, $skipped skipped." \
  --argjson annotations "$annotations" \
  '{ output: { title: $title, summary: $summary, annotations: $annotations } }' \
  | "$(dirname "$0")/patch-check-run.sh"

#!/usr/bin/env bash
set -euo pipefail

json_path="$1"

errors=$(jq '[.diagnostics[] | select(.severity == "error")] | length' "$json_path")
warnings=$(jq '[.diagnostics[] | select(.severity == "warning")] | length' "$json_path")

annotations=$(node "$(dirname "$0")/build-oxlint-annotations.mjs" "$json_path")

jq -n \
  --arg title "$errors errors, $warnings warnings" \
  --arg summary "oxlint found **$errors errors** and **$warnings warnings**." \
  --argjson annotations "$annotations" \
  '{ output: { title: $title, summary: $summary, annotations: $annotations } }' \
  | "$(dirname "$0")/patch-check-run.sh"

#!/usr/bin/env bash
set -euo pipefail

list_path="$1"

unformatted=$(grep -c . "$list_path" || true)

annotations=$(node "$(dirname "$0")/build-oxfmt-annotations.mjs" "$list_path")

jq -n \
  --arg title "$unformatted files need formatting" \
  --arg summary "oxfmt found **$unformatted files** that need formatting." \
  --argjson annotations "$annotations" \
  '{ output: { title: $title, summary: $summary, annotations: $annotations } }' \
  | "$(dirname "$0")/patch-check-run.sh"

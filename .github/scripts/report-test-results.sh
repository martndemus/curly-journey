#!/usr/bin/env bash
set -euo pipefail

tests=$(grep -oP '(?<=<!-- tests )\d+' test-results.xml)
pass=$(grep -oP '(?<=<!-- pass )\d+' test-results.xml)
fail=$(grep -oP '(?<=<!-- fail )\d+' test-results.xml)
skipped=$(grep -oP '(?<=<!-- skipped )\d+' test-results.xml)

annotations=$(node "$(dirname "$0")/build-test-annotations.mjs" test-results.xml)

# The job's own check run shares its ID with the job itself, so patching it
# (rather than creating a new check run) keeps the counts grouped under this
# workflow instead of an unrelated one.
check_run_id=$(gh api "repos/$GITHUB_REPOSITORY/actions/runs/$RUN_ID/jobs" \
  --jq ".jobs[] | select(.name == \"$JOB_NAME\") | .id")

jq -n \
  --arg title "$pass passed, $fail failed, $skipped skipped" \
  --arg summary "**$tests tests** — $pass passed, $fail failed, $skipped skipped." \
  --argjson annotations "$annotations" \
  '{ output: { title: $title, summary: $summary, annotations: $annotations } }' \
  | gh api "repos/$GITHUB_REPOSITORY/check-runs/$check_run_id" --method PATCH --input -

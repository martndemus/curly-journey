#!/usr/bin/env bash
set -euo pipefail

# Patches the calling job's own check run with the `{ output: {...} }` body
# piped in on stdin. Patching the job's own check run, rather than creating
# a new one, keeps annotations grouped under this workflow instead of an
# unrelated one.
check_run_id=$(gh api "repos/$GITHUB_REPOSITORY/actions/runs/$RUN_ID/jobs" \
  --jq ".jobs[] | select(.name == \"$JOB_NAME\") | .id")

gh api "repos/$GITHUB_REPOSITORY/check-runs/$check_run_id" --method PATCH --input -

#!/usr/bin/env bash
set -euo pipefail

artifact=$(gh api "repos/$GITHUB_REPOSITORY/actions/artifacts?name=github-pages&per_page=30" \
  --jq '[.artifacts[] | select(.expired == false)] | sort_by(.created_at) | last')
if [ -n "$artifact" ] && [ "$artifact" != "null" ]; then
  echo "artifact_id=$(jq -r '.id' <<<"$artifact")" >>"$GITHUB_OUTPUT"
  echo "run_id=$(jq -r '.workflow_run.id' <<<"$artifact")" >>"$GITHUB_OUTPUT"
fi

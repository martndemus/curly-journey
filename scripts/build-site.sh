#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

rm -rf _site
mkdir -p _site
cp index.html _site/
mkdir -p _site/tasks/new
cp tasks/new/index.html _site/tasks/new/

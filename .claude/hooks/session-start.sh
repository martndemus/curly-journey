#!/bin/bash
set -euo pipefail

# Only needed in Claude Code on the web; local dev machines manage their own Node.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

export NVM_DIR="${NVM_DIR:-/opt/nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# CI/repo target Node 24+ (see .github/workflows/test.yml); the base image
# only ships up to Node 22, so install/select 24 for this session.
nvm install 24 >/dev/null

NODE24_BIN="$(dirname "$(nvm which 24)")"
export PATH="$NODE24_BIN:$PATH"

# Shim pnpm (pinned via packageManager in package.json) into Node 24's bin dir.
corepack enable >/dev/null 2>&1

echo "export PATH=\"$NODE24_BIN:\$PATH\"" >> "$CLAUDE_ENV_FILE"

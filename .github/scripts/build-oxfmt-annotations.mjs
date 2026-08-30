#!/usr/bin/env node
// Turns oxfmt's `--list-different` file list into GitHub check-run
// annotations. oxfmt doesn't report line-level diffs, so each annotation
// points at line 1 of the whole file.

import { readFileSync } from "node:fs";

const [, , listPath] = process.argv;
const files = readFileSync(listPath, "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const annotations = files.map((path) => ({
  path,
  start_line: 1,
  end_line: 1,
  annotation_level: "failure",
  title: "Not formatted",
  message: "This file is not formatted. Run `pnpm run format` to fix it.",
}));

process.stdout.write(JSON.stringify(annotations));

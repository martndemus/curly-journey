#!/usr/bin/env node
// Turns oxlint's `-f json` diagnostics into GitHub check-run annotations.

import { readFileSync } from "node:fs";

const [, , jsonPath] = process.argv;
const { diagnostics } = JSON.parse(readFileSync(jsonPath, "utf8"));

const annotations = diagnostics.map((diagnostic) => {
  // The primary span (where the violation actually is) is always the first
  // label; any further labels just add context (e.g. a related declaration).
  const line = diagnostic.labels[0]?.span.line ?? 1;
  return {
    path: diagnostic.filename,
    start_line: line,
    end_line: line,
    annotation_level: diagnostic.severity === "error" ? "failure" : "warning",
    title: diagnostic.code,
    message: [diagnostic.message, diagnostic.help].filter(Boolean).join("\n"),
  };
});

process.stdout.write(JSON.stringify(annotations));

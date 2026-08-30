#!/usr/bin/env node
// Turns failing <testcase> entries in a node --test JUnit report into
// GitHub check-run annotations, so failures show up inline on the diff.

import { readFileSync } from "node:fs";
import { relative } from "node:path";

const [, , xmlPath] = process.argv;
const xml = readFileSync(xmlPath, "utf8");

function decodeXmlEntities(str) {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

const annotations = [];
// A passing testcase is self-closing (<testcase .../>) and has no body to
// search for a <failure>; only the second alternative captures one.
const testcaseRe = /<testcase\b[^>]*\/>|<testcase\b[^>]*\bname="([^"]*)"[^>]*>([\s\S]*?)<\/testcase>/g;

for (const [, name, body] of xml.matchAll(testcaseRe)) {
  if (body === undefined) continue; // self-closing: passed, nothing to report

  const failureMatch = /<failure\b[^>]*\bmessage="([^"]*)"[^>]*>([\s\S]*?)<\/failure>/.exec(body);
  if (!failureMatch) continue;
  const [, message, rawDetails] = failureMatch;
  const details = decodeXmlEntities(rawDetails);

  const locationMatch = /at TestContext\.<anonymous> \(([^:]+):(\d+):\d+\)/.exec(details);
  const line = locationMatch ? Number(locationMatch[2]) : 1;
  const path = locationMatch ? relative(process.cwd(), locationMatch[1]) : xmlPath;

  annotations.push({
    path,
    start_line: line,
    end_line: line,
    annotation_level: "failure",
    title: decodeXmlEntities(name),
    message: decodeXmlEntities(message),
  });
}

process.stdout.write(JSON.stringify(annotations));

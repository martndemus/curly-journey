const { test } = require("node:test");
const assert = require("node:assert/strict");

// Temporary: exercises the CI failure/annotation reporting path. Remove
// once confirmed.
test("temporary failing test for CI annotation verification", () => {
  assert.equal(1, 2, "intentional failure to verify CI annotations");
});

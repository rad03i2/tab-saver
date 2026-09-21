"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../src/core.js");

test("sanitizeTabs keeps safe unique HTTP(S) tabs", () => {
  const tabs = core.sanitizeTabs([
    { url: "https://Example.com/a#one", title: " A  page ", pinned: true },
    { url: "https://example.com/a#two", title: "duplicate" },
    { url: "chrome://settings", title: "internal" },
    { url: "javascript:alert(1)", title: "unsafe" }
  ]);
  assert.equal(tabs.length, 1);
  assert.equal(tabs[0].url, "https://example.com/a");
  assert.equal(tabs[0].title, "A page");
  assert.equal(tabs[0].pinned, true);
});

test("makeSession rejects windows without savable tabs", () => {
  assert.throws(() => core.makeSession([{ url: "about:blank" }]), /No savable/);
});

test("search covers session names, titles and URLs", () => {
  const session = { name: "Research", tabs: [{ title: "Open standards", url: "https://example.org/spec" }] };
  assert.equal(core.matchesSession(session, "research"), true);
  assert.equal(core.matchesSession(session, "STANDARDS"), true);
  assert.equal(core.matchesSession(session, "example.org"), true);
  assert.equal(core.matchesSession(session, "missing"), false);
});

test("backup round-trip sanitizes imported content", () => {
  const payload = core.exportPayload([{ id: "1", name: "Work", createdAt: "2026-09-21T00:00:00Z", tabs: [{ url: "https://example.com/#x", title: "Example" }] }], "2026-09-21T00:00:00Z");
  const restored = core.parseImport(JSON.stringify(payload));
  assert.equal(restored.length, 1);
  assert.equal(restored[0].tabs[0].url, "https://example.com/");
});

test("invalid and oversized backups are rejected", () => {
  assert.throws(() => core.parseImport("not json"), /valid JSON/);
  assert.throws(() => core.parseImport(JSON.stringify({ schemaVersion: 99, sessions: [] })), /Unsupported/);
});

test("mergeSessions preserves both sessions on id collision", () => {
  const a = { id: "same", name: "A", createdAt: "2026-01-01", tabs: [{url:"https://a.test/",title:"A",pinned:false}] };
  const b = { id: "same", name: "B", createdAt: "2026-01-02", tabs: [{url:"https://b.test/",title:"B",pinned:false}] };
  const merged = core.mergeSessions([a], [b]);
  assert.equal(merged.length, 2);
  assert.notEqual(merged[0].id, merged[1].id);
});

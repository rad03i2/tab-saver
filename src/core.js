(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TabSaverCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = 1;
  const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

  function normalizeUrl(value) {
    try {
      const url = new URL(String(value || ""));
      if (!["http:", "https:"].includes(url.protocol)) return null;
      url.hash = "";
      return url.toString();
    } catch { return null; }
  }

  function cleanTitle(value, fallback) {
    const title = String(value || "").replace(/\s+/g, " ").trim();
    return (title || fallback || "Untitled").slice(0, 300);
  }

  function sanitizeTabs(tabs) {
    const seen = new Set();
    const result = [];
    for (const tab of Array.isArray(tabs) ? tabs : []) {
      const url = normalizeUrl(tab && tab.url);
      if (!url || seen.has(url)) continue;
      seen.add(url);
      result.push({ url, title: cleanTitle(tab.title, url), pinned: Boolean(tab.pinned) });
    }
    return result;
  }

  function makeSession(tabs, name, now) {
    const safeTabs = sanitizeTabs(tabs);
    if (!safeTabs.length) throw new Error("No savable HTTP(S) tabs were found.");
    const createdAt = now || new Date().toISOString();
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    return { id, name: cleanTitle(name, `Session ${createdAt.slice(0, 10)}`), createdAt, tabs: safeTabs };
  }

  function matchesSession(session, query) {
    const q = String(query || "").trim().toLocaleLowerCase();
    if (!q) return true;
    return [session.name, ...session.tabs.flatMap(t => [t.title, t.url])]
      .some(v => String(v).toLocaleLowerCase().includes(q));
  }

  function exportPayload(sessions, exportedAt) {
    return {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: exportedAt || new Date().toISOString(),
      sessions: (Array.isArray(sessions) ? sessions : []).map(s => ({
        id: String(s.id), name: cleanTitle(s.name), createdAt: String(s.createdAt), tabs: sanitizeTabs(s.tabs)
      })).filter(s => s.tabs.length)
    };
  }

  function parseImport(text) {
    if (typeof text !== "string" || new TextEncoder().encode(text).length > MAX_IMPORT_BYTES)
      throw new Error("Import must be a JSON file no larger than 5 MB.");
    let data;
    try { data = JSON.parse(text); } catch { throw new Error("The selected file is not valid JSON."); }
    if (!data || data.schemaVersion !== SCHEMA_VERSION || !Array.isArray(data.sessions))
      throw new Error("Unsupported or invalid Tab Saver backup.");
    return exportPayload(data.sessions).sessions;
  }

  function mergeSessions(existing, incoming) {
    const byId = new Map((Array.isArray(existing) ? existing : []).map(s => [String(s.id), s]));
    for (const s of incoming) {
      let id = String(s.id);
      if (byId.has(id)) id = `${id}-import-${Math.random().toString(36).slice(2, 7)}`;
      byId.set(id, { ...s, id });
    }
    return [...byId.values()].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  return { SCHEMA_VERSION, MAX_IMPORT_BYTES, normalizeUrl, sanitizeTabs, makeSession, matchesSession, exportPayload, parseImport, mergeSessions };
});

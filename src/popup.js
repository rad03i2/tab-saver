"use strict";

const KEY = "sessions";
const $ = id => document.getElementById(id);
let sessions = [];

async function persist() { await chrome.storage.local.set({ [KEY]: sessions }); }
function announce(message) { $("status").textContent = message; }

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "Unknown date" : date.toLocaleString();
}

function render() {
  const host = $("sessions"); host.replaceChildren();
  const filtered = sessions.filter(s => TabSaverCore.matchesSession(s, $("query").value));
  $("empty").hidden = filtered.length !== 0;
  for (const session of filtered) {
    const node = $("session-template").content.cloneNode(true);
    node.querySelector("h2").textContent = session.name;
    node.querySelector("small").textContent = formatDate(session.createdAt);
    node.querySelector(".count").textContent = `${session.tabs.length} tab${session.tabs.length === 1 ? "" : "s"}`;
    const list = node.querySelector("ul");
    session.tabs.slice(0, 12).forEach(tab => {
      const li = document.createElement("li"), a = document.createElement("a");
      a.href = tab.url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = tab.title; a.title = tab.url;
      li.append(a); list.append(li);
    });
    if (session.tabs.length > 12) { const li = document.createElement("li"); li.textContent = `+ ${session.tabs.length - 12} more`; list.append(li); }
    node.querySelector(".card").dataset.id = session.id;
    host.append(node);
  }
}

async function saveWindow() {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const session = TabSaverCore.makeSession(tabs);
    sessions.unshift(session); await persist(); render(); announce(`Saved ${session.tabs.length} tabs.`);
  } catch (error) { announce(error.message); }
}

async function restore(session) {
  const created = await chrome.windows.create({ url: session.tabs.map(t => t.url) });
  if (created && created.id != null) {
    const tabs = await chrome.tabs.query({ windowId: created.id });
    await Promise.all(session.tabs.map((saved, i) => saved.pinned && tabs[i] ? chrome.tabs.update(tabs[i].id, { pinned: true }) : null));
  }
  announce(`Restored ${session.tabs.length} tabs.`);
}

async function onAction(event) {
  const button = event.target.closest("button[data-action]"); if (!button) return;
  const card = button.closest(".card"), index = sessions.findIndex(s => s.id === card.dataset.id); if (index < 0) return;
  const session = sessions[index];
  if (button.dataset.action === "restore") return restore(session);
  if (button.dataset.action === "rename") {
    const value = prompt("Session name", session.name); if (value === null) return;
    const name = String(value).replace(/\s+/g, " ").trim().slice(0, 300); if (!name) return announce("Name cannot be empty.");
    sessions[index] = { ...session, name }; await persist(); render(); return announce("Session renamed.");
  }
  if (button.dataset.action === "delete" && confirm(`Delete “${session.name}”?`)) {
    sessions.splice(index, 1); await persist(); render(); announce("Session deleted.");
  }
}

function exportData() {
  const payload = JSON.stringify(TabSaverCore.exportPayload(sessions), null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
  const a = document.createElement("a"); a.href = url; a.download = `tab-saver-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
  announce("Backup exported.");
}

async function importData(file) {
  try {
    if (!file || file.size > TabSaverCore.MAX_IMPORT_BYTES) throw new Error("Import must be no larger than 5 MB.");
    const incoming = TabSaverCore.parseImport(await file.text());
    sessions = TabSaverCore.mergeSessions(sessions, incoming); await persist(); render(); announce(`Imported ${incoming.length} sessions.`);
  } catch (error) { announce(error.message); }
}

(async function init() {
  const stored = await chrome.storage.local.get(KEY); sessions = Array.isArray(stored[KEY]) ? stored[KEY] : []; render();
  $("save").addEventListener("click", saveWindow); $("query").addEventListener("input", render); $("sessions").addEventListener("click", onAction);
  $("export").addEventListener("click", exportData); $("import").addEventListener("click", () => $("file").click());
  $("file").addEventListener("change", e => { importData(e.target.files[0]); e.target.value = ""; });
})().catch(error => announce(error.message));

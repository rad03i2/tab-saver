"use strict";

importScripts("core.js");

const STORAGE_KEY = "sessions";

async function saveCurrentWindow() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const session = TabSaverCore.makeSession(tabs);
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const sessions = Array.isArray(stored[STORAGE_KEY]) ? stored[STORAGE_KEY] : [];
  await chrome.storage.local.set({ [STORAGE_KEY]: [session, ...sessions] });
  await chrome.action.setBadgeText({ text: "✓" });
  setTimeout(() => chrome.action.setBadgeText({ text: "" }), 1500);
}

chrome.commands.onCommand.addListener(command => {
  if (command === "save-current-window") saveCurrentWindow().catch(console.error);
});

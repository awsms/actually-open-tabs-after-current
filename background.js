"use strict";

async function moveTabAfterOpener(tab) {
  if (!tab || !Number.isInteger(tab.id) || !Number.isInteger(tab.openerTabId)) {
    return;
  }

  if (tab.pinned) {
    return;
  }

  let opener;
  try {
    opener = await browser.tabs.get(tab.openerTabId);
  } catch {
    return;
  }

  if (!opener || opener.windowId !== tab.windowId || opener.pinned) {
    return;
  }

  const targetIndex = opener.index + 1;
  if (tab.index === targetIndex) {
    return;
  }

  try {
    await browser.tabs.move(tab.id, {
      windowId: tab.windowId,
      index: targetIndex,
    });
  } catch {
    // Ignore races where the tab closes or moves before we can reposition it.
  }
}

browser.tabs.onCreated.addListener((tab) => {
  void moveTabAfterOpener(tab);
});

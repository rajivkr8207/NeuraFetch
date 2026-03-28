
let activePopupPort = null;
let activeTabId = null;
let API_URL = 'http://localhost:8000'

async function saveImageToBackend(imageData) {
  try {
    const response = await fetch(`${API_URL}/api/items/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imageData)
    });

    if (!response.ok) throw new Error('Backend error');

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Image Saved',
      message: 'Image saved to knowledge base'
    });

    return await response.json();
  } catch (error) {
    console.error('Backend error:', error);
    throw error;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'NeuraFetch-ai-extractor',
    title: 'NeuraFetch-save-image',
    contexts: ['image']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'NeuraFetch-ai-extractor') {
    const imageData = {
      url: info.srcUrl,
      pageUrl: info.pageUrl,
      pageTitle: tab.title,
      type: 'image',
      source: 'context-menu',
      savedAt: new Date().toISOString()
    };

    saveImageToBackend(imageData);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TEXT_SELECTED") {
    chrome.storage.local.set({
      selectedText: message.payload
    });
  }
});
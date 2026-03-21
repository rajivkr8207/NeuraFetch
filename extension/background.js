
let activePopupPort = null;
let activeTabId = null;


chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup-connection') {
    activePopupPort = port;

    port.onMessage.addListener((message) => {

      if (message.action === 'imageModeStarted') {
        activeTabId = message.tabId;
      }
    });

    port.onDisconnect.addListener(() => {

      if (activeTabId) {
        chrome.tabs.sendMessage(activeTabId, { action: 'stopImageMode' })
          .catch(() => { });
      }

      activePopupPort = null;
      activeTabId = null;
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📨 From content:", message.action);

  if (message.action === 'imageClicked' && activePopupPort) {
    activePopupPort.postMessage({
      action: 'imageClicked',
      imageData: message.imageData
    });
    sendResponse({ received: true });
  }

  if (message.action === 'saveImage') {
    saveImageToBackend(message.data)
      .then(result => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false }));
    return true;
  }

  return true;
});

async function saveImageToBackend(imageData) {
  try {
    const response = await fetch('http://localhost:8000/api/items/save', {
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
    id: 'save-image-to-ai-extractor',
    title: 'save-image-to-ai-extractor',
    contexts: ['image']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-image-to-ai-extractor') {
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
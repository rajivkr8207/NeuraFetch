// background.js - Message broker

let activePopupPort = null;
let activeTabId = null;

console.log("✅ Background script loaded");

// Handle popup connection
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup-connection') {
    console.log("📞 Popup connected");
    activePopupPort = port;
    
    port.onMessage.addListener((message) => {
      console.log("📨 From popup:", message);
      
      if (message.action === 'imageModeStarted') {
        activeTabId = message.tabId;
      }
    });
    
    port.onDisconnect.addListener(() => {
      console.log("📞 Popup disconnected");
      
      // Tell content script to stop image mode
      if (activeTabId) {
        chrome.tabs.sendMessage(activeTabId, { action: 'stopImageMode' })
          .catch(() => {});
      }
      
      activePopupPort = null;
      activeTabId = null;
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📨 From content:", message.action);
  
  // Image clicked in mode - forward to popup
  if (message.action === 'imageClicked' && activePopupPort) {
    activePopupPort.postMessage({
      action: 'imageClicked',
      imageData: message.imageData
    });
    sendResponse({ received: true });
  }
  
  // Save image from hover button
  if (message.action === 'saveImage') {
    saveImageToBackend(message.data)
      .then(result => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false }));
    return true;
  }
  
  return true;
});

// Save image to backend
async function saveImageToBackend(imageData) {
  try {
    const response = await fetch('http://localhost:8000/api/items/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imageData)
    });
    
    if (!response.ok) throw new Error('Backend error');
    
    // Optional notification
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

// Context menu for right-click save
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-image-knowledge',
    title: 'Save Image to Knowledge Base',
    contexts: ['image']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-image-knowledge') {
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
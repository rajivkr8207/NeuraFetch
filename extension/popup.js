// ==================== GLOBAL VARIABLES ====================
let currentPageData = {};
let pageTags = [];
let imageTags = [];
let currentImageData = null;
let port = null;
let API_URL = 'https://neurafetch.onrender.com'
let FRONTEND_URL = 'https://neurafetch.onrender.com'

let isLoggedIn = false;

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Popup opened");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  document.getElementById('pageTitle').textContent = tab.title;
  document.getElementById('pageUrl').textContent = tab.url;

  currentPageData = {
    url: tab.url,
    title: tab.title,
    type: detectPageType(tab.url)
  };
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "TEXT_SELECTED") {
      chrome.storage.local.set({
        selectedText: message.payload
      });
    }
  });
  document.getElementById('saveBtn').addEventListener('click', savePageItem);

  connectToBackground();
});

function detectPageType(url) {
  if (url.includes('youtube.com/watch') || url.includes('youtu.be')) return 'video';
  if (url.includes('youtube.com/shorts') || url.includes('youtu.be')) return 'video';
  else if (url.includes('twitter.com') || url.includes('x.com')) return 'tweet';
  else if (url.includes('medium.com') || url.includes('substack.com')) return 'article';
  else if (url.match(/\.(pdf)$/i)) return 'pdf';
  else return 'webpage';
}


// ==================== PAGE SAVE ====================
async function savePageItem() {
  const saveBtn = document.getElementById('saveBtn');

  saveBtn.disabled = true;
  hideMessages();

  const itemData = {
    ...currentPageData,
    notes: document.getElementById('notes').value,
    tags: pageTags,
    collection: document.getElementById('collection').value,
    savedAt: new Date().toISOString()
  };

  try {
    const response = await fetch(`${API_URL}/api/items/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });

    if (response.ok) {
      showSuccess('✓ Page saved successfully!');
      setTimeout(() => window.close(), 1500);
    } else {
      showError();
    }
  } catch (error) {
    console.error('Error:', error);
    showError();
  } finally {
    saveBtn.disabled = false;
  }
}



function connectToBackground() {
  try {
    port = chrome.runtime.connect({ name: 'popup-connection' });
    console.log("✅ Connected to background");

    port.onMessage.addListener((message) => {
      console.log("Message from background:", message);
    });

    port.onDisconnect.addListener(() => {
      console.log("Disconnected from background");
      port = null;
    });

  } catch (error) {
    console.error("Connection error:", error);
  }
}

function showSuccess(message) {
  const msg = document.getElementById('successMessage');
  msg.textContent = message || '✓ Saved successfully!';
  msg.style.display = 'block';
  setTimeout(hideMessages, 2000);
}

function showError() {
  document.getElementById('errorMessage').style.display = 'block';
  setTimeout(hideMessages, 2000);
}

function hideMessages() {
  document.getElementById('successMessage').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'none';
}




// popup.js

async function checkLoginStatus() {
  try {
    const res = await fetch(`${API_URL}/api/auth/get-me`);
    const authdata = await res.json()
    const auth = authdata.data
    console.log(auth);

    const isLoggedIn = authdata?.success || false;

    if (isLoggedIn && auth?.user) {
      console.log(isLoggedIn, auth);
      showLoggedInUI(auth.user);
      // loadPageInfo();
    } else {
      showLoggedOutUI();
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    showLoggedOutUI();
  }
}

// Show UI for logged in user
function showLoggedInUI(user) {
  document.getElementById('authRequiredSection').classList.add('hidden');
  document.getElementById('mainContent').classList.remove('hidden');
  document.getElementById('userProfileSection').classList.remove('hidden');

  // Set user info
  const avatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');

  const displayName = user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  avatar.textContent = initial;
  userName.textContent = displayName;
  userEmail.textContent = user.email || `${displayName.toLowerCase()}@example.com`;
}

function showLoggedOutUI() {
  document.getElementById('authRequiredSection').classList.remove('hidden');
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('userProfileSection').classList.add('hidden');
}


function showError(message) {
  const errorMsg = document.getElementById('errorMessage');
  errorMsg.textContent = message || '✗ Error saving. Please try again.';
  errorMsg.style.display = 'block';
  setTimeout(() => {
    errorMsg.style.display = 'none';
  }, 3000);
}

function hideMessages() {
  document.getElementById('successMessage').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'none';
}
async function loadSelectedText() {
  const result = await chrome.storage.local.get("selectedText");
  if (result.selectedText) {
    document.getElementById("notes").value = result.selectedText;
  }
}

function clearSelectedText() {
  chrome.storage.local.remove("selectedText");
}


document.addEventListener('DOMContentLoaded', async () => {
  await checkLoginStatus();
  await loadSelectedText(); //

  if (isLoggedIn) {
    document.getElementById('saveBtn').addEventListener('click', saveItem);
  }

  document.getElementById('loginBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: `${FRONTEND_URL}/login` });
    window.close();
  });
});
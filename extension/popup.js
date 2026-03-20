// ==================== GLOBAL VARIABLES ====================
let currentPageData = {};
let pageTags = [];
let imageTags = [];
let currentImageData = null;
let isImageModeActive = false;
let port = null;

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

  setupTagInput('tagInput', 'tagsContainer', (tags) => { pageTags = tags; });
  setupTagInput('imageTagInput', 'imageTagsContainer', (tags) => { imageTags = tags; });

  document.getElementById('saveBtn').addEventListener('click', savePageItem);
  document.getElementById('startImageModeBtn').addEventListener('click', startImageMode);
  document.getElementById('cancelImageModeBtn').addEventListener('click', cancelImageMode);

  connectToBackground();
});

window.switchTab = function (tab) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');

  // Update sections
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  document.getElementById(`${tab}Section`).classList.add('active');

  // Update badge
  document.getElementById('modeBadge').textContent = tab === 'page' ? '📄 Page Mode' : '🖼️ Image Mode';

  // If switching to page mode, cancel image mode
  if (tab === 'page' && isImageModeActive) {
    cancelImageMode();
  }
};

// ==================== PAGE DETECTION ====================
function detectPageType(url) {
  if (url.includes('youtube.com/watch') || url.includes('youtu.be')) return 'video';
  else if (url.includes('twitter.com') || url.includes('x.com')) return 'tweet';
  else if (url.includes('medium.com') || url.includes('substack.com')) return 'article';
  else if (url.match(/\.(pdf)$/i)) return 'pdf';
  else return 'webpage';
}

// ==================== TAG INPUT HANDLING ====================
function setupTagInput(inputId, containerId, onTagsChange) {
  const tagInput = document.getElementById(inputId);
  const tagsContainer = document.getElementById(containerId);
  let tags = [];

  tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && tagInput.value.trim()) {
      e.preventDefault();
      const tagText = tagInput.value.trim();
      if (!tags.includes(tagText)) {
        tags.push(tagText);
        renderTags(tagsContainer, tags, tagInput);
        onTagsChange(tags);
      }
      tagInput.value = '';
    }
  });

  // Store tags for removal
  window[`removeTag_${containerId}`] = function (tagToRemove) {
    tags = tags.filter(t => t !== tagToRemove);
    renderTags(tagsContainer, tags, tagInput);
    onTagsChange(tags);
  };
}

function renderTags(container, tags, inputElement) {
  container.innerHTML = '';

  tags.forEach(tag => {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.innerHTML = `
      ${tag}
      <span class="tag-remove" onclick="removeTag_${container.id}('${tag}')">×</span>
    `;
    container.appendChild(tagEl);
  });
  container.appendChild(inputElement);
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
    const response = await fetch('http://localhost:8000/api/items/save', {
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

// ==================== IMAGE MODE ====================
function startImageMode() {
  isImageModeActive = true;

  // Update UI
  document.getElementById('startImageModeBtn').style.display = 'none';
  document.getElementById('cancelImageModeBtn').style.display = 'block';
  document.getElementById('imageModeIndicator').classList.add('show');

  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'startImageMode',
      popupActive: true
    });
  });

  // Notify background
  if (port) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      port.postMessage({
        action: 'imageModeStarted',
        tabId: tabs[0].id
      });
    });
  }
}

function cancelImageMode() {
  isImageModeActive = false;
  currentImageData = null;

  // Update UI
  document.getElementById('startImageModeBtn').style.display = 'block';
  document.getElementById('cancelImageModeBtn').style.display = 'none';
  document.getElementById('imageModeIndicator').classList.remove('show');
  document.getElementById('imagePreview').classList.remove('show');

  // Clear preview
  document.getElementById('previewImg').src = '';
  document.getElementById('previewUrl').textContent = '';
  document.getElementById('imageAlt').value = '';
  document.getElementById('imageNotes').value = '';

  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'stopImageMode' });
  });

  if (port) {
    port.postMessage({ action: 'imageModeStopped' });
  }
}

// Handle image click from content script
function handleImageClick(imageData) {
  console.log("📸 Image clicked:", imageData);
  currentImageData = imageData;

  // Show preview
  const preview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  const previewUrl = document.getElementById('previewUrl');
  const imageAlt = document.getElementById('imageAlt');
  const imageStats = document.getElementById('imageStats');

  previewImg.src = imageData.url;
  previewUrl.textContent = imageData.url.substring(0, 60) + (imageData.url.length > 60 ? '...' : '');
  imageAlt.value = imageData.alt || 'No alt text';

  // Show image stats
  imageStats.innerHTML = `
    <span>📏 ${imageData.width || '?'}x${imageData.height || '?'}</span>
    <span>📁 ${formatFileSize(imageData.fileSize)}</span>
  `;

  preview.classList.add('show');

  // Auto-save the image
  saveImageData(imageData);
}

// Save image data to backend
async function saveImageData(imageData) {
  const itemData = {
    ...imageData,
    notes: document.getElementById('imageNotes').value,
    tags: imageTags,
    collection: document.getElementById('imageCollection').value,
    savedAt: new Date().toISOString(),
    type: 'image'
  };

  try {
    const response = await fetch('http://localhost:8000/api/items/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });

    if (response.ok) {
      showSuccess('✅ Image saved!');

      // Update preview to show success
      document.getElementById('imagePreview').style.borderColor = '#10b981';
      setTimeout(() => {
        document.getElementById('imagePreview').style.borderColor = '#d1d5db';
      }, 2000);
    } else {
      showError();
    }
  } catch (error) {
    console.error('Backend error:', error);
    showError();
  }
}

// Helper: Format file size
function formatFileSize(bytes) {
  if (!bytes) return '?';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

// ==================== BACKGROUND CONNECTION ====================
function connectToBackground() {
  try {
    port = chrome.runtime.connect({ name: 'popup-connection' });
    console.log("✅ Connected to background");

    port.onMessage.addListener((message) => {
      console.log("Message from background:", message);

      if (message.action === 'imageClicked' && isImageModeActive) {
        handleImageClick(message.imageData);
      }
    });

    port.onDisconnect.addListener(() => {
      console.log("Disconnected from background");
      port = null;
    });

  } catch (error) {
    console.error("Connection error:", error);
  }
}

// ==================== UI HELPERS ====================
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
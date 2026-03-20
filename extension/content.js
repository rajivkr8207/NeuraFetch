// content.js - Hover button + Image click mode

let currentImage = null;
let saveButton = null;
let isImageModeActive = false;

// ==================== INITIALIZE ====================
function initImageSaver() {
  console.log("✅ Content script loaded");
  
  // Create hover save button
  saveButton = document.createElement('button');
  saveButton.className = 'kb-save-image-btn';
  saveButton.innerHTML = '📥';
  saveButton.title = 'Save this image';
  document.body.appendChild(saveButton);
  
  // Hover listeners for button
  document.addEventListener('mouseover', handleMouseOver);
  document.addEventListener('mouseout', handleMouseOut);
  
  // Hover button click
  saveButton.addEventListener('click', saveImageFromHover);
}

// ==================== HOVER BUTTON FEATURE ====================
function handleMouseOver(e) {
  const target = e.target;
  
  if (target.tagName === 'IMG' && isValidImage(target) && !isImageModeActive) {
    currentImage = target;
    showSaveButton(target);
  }
}

function handleMouseOut(e) {
  const target = e.target;
  
  if (target.tagName === 'IMG') {
    setTimeout(() => {
      if (!saveButton.matches(':hover') && currentImage) {
        hideSaveButton();
      }
    }, 100);
  }
}

function isValidImage(img) {
  if (!img.src) return false;
  if (img.width < 50 || img.height < 50) return false; // Skip icons
  if (img.src.startsWith('data:') && img.src.length > 5000) return false; // Skip huge data URLs
  return true;
}

function showSaveButton(img) {
  const rect = img.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
  saveButton.style.top = `${rect.top + scrollTop + 10}px`;
  saveButton.style.left = `${rect.left + scrollLeft + rect.width - 46}px`;
  saveButton.classList.add('show');
}

function hideSaveButton() {
  saveButton.classList.remove('show');
  currentImage = null;
}

// Save image from hover button
async function saveImageFromHover() {
  if (!currentImage) return;
  
  const imageData = getImageData(currentImage);
  imageData.source = 'hover-button';
  
  showToast('Saving image...');
  
  chrome.runtime.sendMessage({
    action: 'saveImage',
    data: imageData
  }, (response) => {
    if (response && response.success) {
      showToast('✅ Image saved!', 'success');
      hideSaveButton();
    } else {
      showToast('❌ Failed to save', 'error');
    }
  });
}

// ==================== IMAGE MODE FEATURE (from popup) ====================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  
  if (message.action === 'startImageMode') {
    startImageMode();
    sendResponse({ status: 'started' });
  }
  
  if (message.action === 'stopImageMode') {
    stopImageMode();
    sendResponse({ status: 'stopped' });
  }
  
  return true;
});

function startImageMode() {
  if (isImageModeActive) return;
  
  console.log("🎯 Image mode started - Click any image");
  isImageModeActive = true;
  
  // Hide hover button
  hideSaveButton();
  
  // Add click listener
  document.addEventListener('click', handleImageClick, true);
  
  // Show indicator
  showModeIndicator(true);
}

function stopImageMode() {
  if (!isImageModeActive) return;
  
  console.log("⏹️ Image mode stopped");
  isImageModeActive = false;
  
  document.removeEventListener('click', handleImageClick, true);
  showModeIndicator(false);
}

// Handle image clicks in mode
function handleImageClick(e) {
  const target = e.target;
  
  if (target.tagName === 'IMG') {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("🖼️ Image clicked in mode:", target.src);
    
    const imageData = getImageData(target);
    imageData.source = 'click-mode';
    
    // Visual feedback
    showClickFeedback(target);
    
    // Send to background (for popup)
    chrome.runtime.sendMessage({
      action: 'imageClicked',
      imageData: imageData
    });
  }
}

// ==================== COMMON FUNCTIONS ====================
function getImageData(img) {
  return {
    url: img.src,
    alt: img.alt || '',
    title: img.title || '',
    width: img.naturalWidth,
    height: img.naturalHeight,
    fileSize: estimateFileSize(img.src),
    pageUrl: window.location.href,
    pageTitle: document.title,
    pageDomain: window.location.hostname,
    type: 'image',
    savedAt: new Date().toISOString()
  };
}

// Estimate file size from URL or data
function estimateFileSize(src) {
  if (src.startsWith('data:')) {
    return Math.round(src.length * 0.75); // Rough estimate for base64
  }
  return null; // Unknown
}

function showClickFeedback(img) {
  const originalOutline = img.style.outline;
  img.style.outline = '3px solid #10b981';
  img.style.transition = 'outline 0.2s';
  
  setTimeout(() => {
    img.style.outline = originalOutline;
  }, 500);
}

// ==================== INDICATORS ====================
function showModeIndicator(show) {
  let indicator = document.getElementById('kb-mode-indicator');
  
  if (show && !indicator) {
    indicator = document.createElement('div');
    indicator.id = 'kb-mode-indicator';
    indicator.innerHTML = '🖼️ Image Mode Active - Click any image';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #2563eb;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      animation: slideIn 0.3s;
      pointer-events: none;
    `;
    document.body.appendChild(indicator);
    
    // Add animation
    if (!document.getElementById('kb-animation')) {
      const style = document.createElement('style');
      style.id = 'kb-animation';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  } else if (!show && indicator) {
    indicator.remove();
  }
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'kb-toast';
  toast.textContent = message;
  
  if (type === 'success') toast.style.background = '#10b981';
  if (type === 'error') toast.style.background = '#ef4444';
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// ==================== START ====================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImageSaver);
} else {
  initImageSaver();
}
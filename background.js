/**
 * Background Service Worker cho ChatGPT Smart Follow-up Extension
 * Minimal background script - chỉ handle extension lifecycle events
 */

// Extension install/update events
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[ChatGPT Followup] Extension installed/updated:', details.reason);
  
  // Set default settings
  if (details.reason === 'install') {
    chrome.storage.local.set({
      enabled: true,
      language: 'auto',
      maxSuggestions: 4,
      autoSend: true
    });
    
    console.log('[ChatGPT Followup] Default settings đã được set');
  }
});

// Handle extension icon click (optional future feature)
chrome.action.onClicked.addListener((tab) => {
  // Có thể implement toggle functionality sau
  console.log('[ChatGPT Followup] Extension icon clicked on tab:', tab.id);
});

// Message handling từ content script hoặc popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[ChatGPT Followup] Message received:', request);
  
  switch (request.action) {
    case 'getSettings':
      handleGetSettings(sendResponse);
      return true; // Keep channel open for async response
      
    case 'updateSettings':
      handleUpdateSettings(request.settings, sendResponse);
      return true;
      
    case 'logActivity':
      // Log activity cho debugging (không lưu external data)
      console.log('[ChatGPT Followup] Activity:', request.data);
      sendResponse({ success: true });
      break;
      
    default:
      console.warn('[ChatGPT Followup] Unknown action:', request.action);
      sendResponse({ error: 'Unknown action' });
  }
});

async function handleGetSettings(sendResponse) {
  try {
    const settings = await chrome.storage.local.get([
      'enabled', 
      'language', 
      'maxSuggestions',
      'autoSend'
    ]);
    
    // Set defaults nếu chưa có
    const defaultSettings = {
      enabled: true,
      language: 'auto',
      maxSuggestions: 4,
      autoSend: true,
      ...settings
    };
    
    sendResponse({ success: true, settings: defaultSettings });
  } catch (error) {
    console.error('[ChatGPT Followup] Error getting settings:', error);
    sendResponse({ error: error.message });
  }
}

async function handleUpdateSettings(newSettings, sendResponse) {
  try {
    await chrome.storage.local.set(newSettings);
    console.log('[ChatGPT Followup] Settings updated:', newSettings);
    sendResponse({ success: true });
  } catch (error) {
    console.error('[ChatGPT Followup] Error updating settings:', error);
    sendResponse({ error: error.message });
  }
}

// Cleanup on extension suspend (Manifest V3)
self.addEventListener('beforeunload', () => {
  console.log('[ChatGPT Followup] Background script suspending');
});
/**
 * Popup Script cho ChatGPT Smart Follow-up Extension
 * Quản lý settings UI và communication với background script
 */

class PopupManager {
  constructor() {
    this.elements = {};
    this.init();
  }

  async init() {
    // Get DOM elements
    this.elements = {
      enabledToggle: document.getElementById('enabledToggle'),
      languageSelect: document.getElementById('languageSelect'),
      maxSuggestionsSelect: document.getElementById('maxSuggestionsSelect'),
      autoSendToggle: document.getElementById('autoSendToggle'),
      status: document.getElementById('status'),
      resetBtn: document.getElementById('resetBtn')
    };

    // Load current settings
    await this.loadSettings();

    // Setup event listeners
    this.setupEventListeners();

    console.log('[ChatGPT Followup] Popup initialized');
  }

  async loadSettings() {
    try {
      const response = await this.sendMessage({ action: 'getSettings' });
      
      if (response.success) {
        const settings = response.settings;
        
        // Update UI với current settings
        this.elements.enabledToggle.checked = settings.enabled;
        this.elements.languageSelect.value = settings.language || 'auto';
        this.elements.maxSuggestionsSelect.value = settings.maxSuggestions || 4;
        this.elements.autoSendToggle.checked = settings.autoSend !== false;
        
        console.log('[ChatGPT Followup] Settings loaded:', settings);
      } else {
        this.showStatus('Lỗi tải settings: ' + response.error, 'error');
      }
    } catch (error) {
      console.error('[ChatGPT Followup] Error loading settings:', error);
      this.showStatus('Không thể tải settings', 'error');
    }
  }

  setupEventListeners() {
    // Toggle enabled/disabled
    this.elements.enabledToggle.addEventListener('change', (e) => {
      this.updateSetting('enabled', e.target.checked);
    });

    // Language selection
    this.elements.languageSelect.addEventListener('change', (e) => {
      this.updateSetting('language', e.target.value);
    });

    // Max suggestions
    this.elements.maxSuggestionsSelect.addEventListener('change', (e) => {
      this.updateSetting('maxSuggestions', parseInt(e.target.value));
    });

    // Auto-send toggle
    this.elements.autoSendToggle.addEventListener('change', (e) => {
      this.updateSetting('autoSend', e.target.checked);
    });

    // Reset button
    this.elements.resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.resetSettings();
    });
  }

  async updateSetting(key, value) {
    try {
      const settings = { [key]: value };
      const response = await this.sendMessage({ 
        action: 'updateSettings', 
        settings 
      });

      if (response.success) {
        console.log('[ChatGPT Followup] Setting updated:', key, value);
        this.showStatus('✅ Đã lưu', 'success');
        
        // Hide status sau 2 giây
        setTimeout(() => {
          this.hideStatus();
        }, 2000);
      } else {
        this.showStatus('Lỗi lưu setting: ' + response.error, 'error');
      }
    } catch (error) {
      console.error('[ChatGPT Followup] Error updating setting:', error);
      this.showStatus('Không thể lưu thay đổi', 'error');
    }
  }

  async resetSettings() {
    if (!confirm('Bạn có chắc muốn reset tất cả settings về mặc định?')) {
      return;
    }

    try {
      const defaultSettings = {
        enabled: true,
        language: 'auto',
        maxSuggestions: 4,
        autoSend: true
      };

      const response = await this.sendMessage({
        action: 'updateSettings',
        settings: defaultSettings
      });

      if (response.success) {
        // Update UI
        this.elements.enabledToggle.checked = true;
        this.elements.languageSelect.value = 'auto';
        this.elements.maxSuggestionsSelect.value = '4';
        this.elements.autoSendToggle.checked = true;
        
        this.showStatus('✅ Đã reset về mặc định', 'success');
        
        setTimeout(() => {
          this.hideStatus();
        }, 2000);
      } else {
        this.showStatus('Lỗi reset settings: ' + response.error, 'error');
      }
    } catch (error) {
      console.error('[ChatGPT Followup] Error resetting settings:', error);
      this.showStatus('Không thể reset settings', 'error');
    }
  }

  showStatus(message, type = 'success') {
    this.elements.status.textContent = message;
    this.elements.status.className = `status ${type}`;
    this.elements.status.style.display = 'block';
  }

  hideStatus() {
    this.elements.status.style.display = 'none';
  }

  sendMessage(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response || { error: 'No response' });
      });
    });
  }
}

// Initialize popup khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});

// Handle extension context invalidation
chrome.runtime.onConnect.addListener(() => {
  // Connection established - popup is active
});

window.addEventListener('beforeunload', () => {
  // Cleanup nếu cần
});
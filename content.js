/**
 * ChatGPT Smart Follow-up Content Script
 * Inject vào ChatGPT interface để detect responses và tạo follow-up suggestions
 */

class ChatGPTFollowupExtension {
  constructor() {
    this.isEnabled = true;
    this.followupContainer = null;
    this.observer = null;
    this.lastProcessedMessage = null;
    
    this.init();
  }

  async init() {
    console.log('[ChatGPT Followup] Extension đang khởi tạo...');
    
    // Load settings từ storage
    await this.loadSettings();
    
    // Setup observer để detect ChatGPT responses
    this.setupResponseObserver();
    
    // Inject UI components
    this.injectFollowupUI();
    
    console.log('[ChatGPT Followup] Extension sẵn sàng');
    
    // Debug: Expose manual test function
    window.testFollowup = () => {
      const mockFollowups = ['Cho tôi biết thêm chi tiết', 'Giải thích rõ hơn', 'Có ví dụ cụ thể không?', 'Còn gì khác?'];
      this.displayFollowups(mockFollowups);
    };
    
    // Auto-test sau 3 giây nếu có assistant messages
    setTimeout(() => {
      const assistantMessages = document.querySelectorAll('[data-message-author-role="assistant"]');
      if (assistantMessages.length > 0) {
        console.log('[ChatGPT Followup] Found', assistantMessages.length, 'assistant messages, testing...');
        const lastMessage = assistantMessages[assistantMessages.length - 1];
        this.processNewResponse(lastMessage);
      }
    }, 3000);
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get(['enabled', 'autoSend']);
      this.isEnabled = result.enabled !== false; // Default true
      this.autoSend = result.autoSend !== false; // Default true
    } catch (error) {
      console.error('[ChatGPT Followup] Lỗi load settings:', error);
      this.autoSend = true; // Fallback default
    }
  }

  setupResponseObserver() {
    // Tìm conversation container
    const conversationContainer = this.findConversationContainer();
    
    if (!conversationContainer) {
      console.warn('[ChatGPT Followup] Không tìm thấy conversation container');
      // Retry sau 2 giây
      setTimeout(() => this.setupResponseObserver(), 2000);
      return;
    }

    // Setup MutationObserver để detect new messages
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          this.handleNewNodes(mutation.addedNodes);
        }
      });
    });

    this.observer.observe(conversationContainer, {
      childList: true,
      subtree: true
    });

    console.log('[ChatGPT Followup] Response observer đã setup');
  }

  findConversationContainer() {
    // Updated selectors cho ChatGPT interface hiện tại
    const selectors = [
      '[data-testid*="conversation"]',
      '[role="main"]',
      'main',
      '[class*="thread"]',
      '.flex-1'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[ChatGPT Followup] Tìm thấy container với selector: ${selector}`);
        return element;
      }
    }

    console.warn('[ChatGPT Followup] Không tìm thấy conversation container, sử dụng body');
    return document.body; // Fallback
  }

  handleNewNodes(nodes) {
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Check nếu đây là ChatGPT response message
        const isAssistantMessage = this.isAssistantMessage(node);
        
        if (isAssistantMessage && this.isEnabled) {
          console.log('[ChatGPT Followup] Detect ChatGPT response mới');
          
          // Delay một chút để đảm bảo message đã render xong
          setTimeout(() => {
            this.processNewResponse(node);
          }, 1000);
        }
      }
    });
  }

  isAssistantMessage(element) {
    // Check nếu chính element này có data-message-author-role="assistant"
    if (element.getAttribute && element.getAttribute('data-message-author-role') === 'assistant') {
      console.log('[ChatGPT Followup] Detected assistant message (direct):', element);
      return true;
    }
    
    // Hoặc check children
    const assistantElement = element.querySelector('[data-message-author-role="assistant"]');
    if (assistantElement) {
      console.log('[ChatGPT Followup] Detected assistant message (child):', assistantElement);
      return true;
    }

    return false;
  }

  async processNewResponse(messageElement) {
    if (this.lastProcessedMessage === messageElement) {
      return; // Đã process rồi
    }

    this.lastProcessedMessage = messageElement;
    
    // Extract message content
    const messageContent = this.extractMessageContent(messageElement);
    
    if (!messageContent || messageContent.length < 10) {
      console.log('[ChatGPT Followup] Message too short, skipping:', messageContent);
      return; // Message quá ngắn
    }

    console.log('[ChatGPT Followup] Processing response:', messageContent.substring(0, 100) + '...');
    
    // Generate follow-up suggestions
    await this.generateFollowups(messageContent);
  }

  extractMessageContent(element) {
    // Try to get clean text content
    const contentElement = element.querySelector('.markdown') || 
                          element.querySelector('[class*="message"]') ||
                          element;
    
    return contentElement.textContent.trim();
  }

  async generateFollowups(messageContent) {
    try {
      // Placeholder cho actual follow-up generation
      // Sẽ implement logic gọi ChatGPT API ở sprint tiếp theo
      
      const mockFollowups = this.generateMockFollowups(messageContent);
      
      // Display follow-ups
      this.displayFollowups(mockFollowups);
      
    } catch (error) {
      console.error('[ChatGPT Followup] Lỗi generate followups:', error);
    }
  }

  generateMockFollowups(content) {
    // Mock follow-ups cho testing
    const defaultFollowups = [
      'Giải thích thêm về điều này',
      'Cho tôi một ví dụ cụ thể',
      'Tiếp tục với phần tiếp theo',
      'Có cách nào khác không?'
    ];

    // Simple logic để customize based on content
    if (content.includes('code') || content.includes('function')) {
      return [
        'Giải thích code này chi tiết hơn',
        'Có thể optimize code này không?',
        'Cho ví dụ sử dụng thực tế',
        'Xử lý error cases như thế nào?'
      ];
    }

    if (content.includes('?')) {
      return [
        'Trả lời chi tiết hơn',
        'Cho thêm context',
        'Ví dụ thực tế là gì?',
        'Có phương án khác không?'
      ];
    }

    return defaultFollowups;
  }

  displayFollowups(followups) {
    // Remove existing followups nếu có
    this.removeExistingFollowups();

    // Create followup container
    this.followupContainer = document.createElement('div');
    this.followupContainer.className = 'chatgpt-followup-container';
    this.followupContainer.innerHTML = `
      <div class="chatgpt-followup-header">
        <span>💡 Gợi ý tiếp tục:</span>
      </div>
      <div class="chatgpt-followup-buttons">
        ${followups.map((text, index) => 
          `<button class="chatgpt-followup-btn" data-followup="${index}">${text}</button>`
        ).join('')}
      </div>
    `;

    // Add event listeners
    this.followupContainer.querySelectorAll('.chatgpt-followup-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const followupText = e.target.textContent;
        this.handleFollowupClick(followupText);
      });
    });

    // Insert vào DOM - tìm input container
    const inputArea = this.findInputArea();
    if (inputArea) {
      // Tìm container tốt để inject
      const container = inputArea.closest('form') || 
                       inputArea.closest('[class*="composer"]') ||
                       inputArea.closest('div[class*="grid"]') ||
                       inputArea.parentElement;
      
      if (container) {
        container.insertBefore(this.followupContainer, container.firstChild);
        console.log('[ChatGPT Followup] Injected followup container');
      } else {
        console.warn('[ChatGPT Followup] Không tìm thấy container để inject');
      }
    } else {
      console.warn('[ChatGPT Followup] Không tìm thấy input area để inject');
    }
  }

  findInputArea() {
    const selectors = [
      '#prompt-textarea',
      '.ProseMirror[contenteditable="true"]',
      'div[contenteditable="true"]#prompt-textarea',
      'textarea[name="prompt-textarea"]',
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="message"]',
      'textarea[data-testid*="prompt"]',
      '[data-id*="root"] textarea',
      'form textarea'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[ChatGPT Followup] Found input area với selector: ${selector}`);
        return element.closest('form') || element.parentElement;
      }
    }

    console.warn('[ChatGPT Followup] Không tìm thấy input area');
    return null;
  }

  handleFollowupClick(followupText) {
    console.log('[ChatGPT Followup] Click followup:', followupText);
    
    // Updated selectors for current ChatGPT interface
    const selectors = [
      '#prompt-textarea',
      '.ProseMirror[contenteditable="true"]',
      'div[contenteditable="true"]#prompt-textarea',
      'textarea[name="prompt-textarea"]',
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="message"]',
      'textarea[data-testid*="prompt"]',
      'textarea[class*="prompt"]',
      'form textarea'
    ];
    
    let inputElement = null;
    for (const selector of selectors) {
      inputElement = document.querySelector(selector);
      if (inputElement) {
        console.log(`[ChatGPT Followup] Found input element với selector: ${selector}`);
        break;
      }
    }
    
    if (inputElement) {
      console.log('[ChatGPT Followup] Attempting to set input value to:', followupText);
      
      // Check if it's contenteditable div or textarea
      if (inputElement.contentEditable === 'true') {
        // For contenteditable div (ProseMirror)
        this.setContentEditableValue(inputElement, followupText);
      } else {
        // For traditional textarea
        // Method 1: Clipboard paste approach (most reliable)
        this.pasteTextIntoTextarea(inputElement, followupText);
        
        // Method 2: React controlled component approach
        setTimeout(() => {
          this.setReactTextareaValue(inputElement, followupText);
        }, 50);
        
        // Method 3: Direct manipulation với backup
        setTimeout(() => {
          inputElement.value = followupText;
          inputElement.focus();
          
          // Trigger React synthetic events
          this.triggerReactEvents(inputElement, followupText);
          
          console.log('[ChatGPT Followup] Textarea value after set:', inputElement.value);
        }, 100);
      }
      
      // Auto-send after successful input (nếu enabled)
      if (this.autoSend) {
        setTimeout(() => {
          this.autoSendMessageWithValidation(0); // Keep retry limit
        }, 1000);
      } else {
        console.log('[ChatGPT Followup] Auto-send disabled, chỉ populate text');
      }
      
      // Hide followups after click
      this.removeExistingFollowups();
    } else {
      console.warn('[ChatGPT Followup] Không tìm thấy textarea với các selectors:', selectors);
    }
  }

  gentleTextInput(textarea, text) {
    console.log('[ChatGPT Followup] Using gentle input method');
    
    // Simple approach: focus + clear + set value + single input event
    textarea.focus();
    textarea.click();
    
    // Clear and set value
    textarea.value = '';
    textarea.value = text;
    
    // Single comprehensive input event
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      inputType: 'insertText',
      data: text
    });
    
    textarea.dispatchEvent(inputEvent);
    
    // Set cursor to end
    textarea.setSelectionRange(text.length, text.length);
    
    console.log('[ChatGPT Followup] Gentle input completed:', textarea.value);
  }

  async pasteTextIntoTextarea(textarea, text) {
    try {
      // Focus textarea first
      textarea.focus();
      textarea.click();
      
      console.log('[ChatGPT Followup] Attempting clipboard paste method');
      
      // Method A: Use execCommand if supported
      if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
        textarea.value = '';
        textarea.focus();
        document.execCommand('insertText', false, text);
        console.log('[ChatGPT Followup] Used execCommand insertText');
        return;
      }
      
      // Method B: Clipboard API (newer browsers)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        
        // Clear existing content
        textarea.select();
        
        // Simulate Ctrl+V
        const pasteEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'v',
          code: 'KeyV',
          ctrlKey: true,
          metaKey: false
        });
        
        textarea.dispatchEvent(pasteEvent);
        
        // Also try paste event
        const clipboardEvent = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: new DataTransfer()
        });
        
        clipboardEvent.clipboardData.setData('text/plain', text);
        textarea.dispatchEvent(clipboardEvent);
        
        console.log('[ChatGPT Followup] Used clipboard API method');
        return;
      }
      
      // Method C: Character-by-character typing simulation
      this.simulateTyping(textarea, text);
      
    } catch (error) {
      console.warn('[ChatGPT Followup] Clipboard paste failed:', error);
      this.simulateTyping(textarea, text);
    }
  }

  simulateTyping(textarea, text) {
    console.log('[ChatGPT Followup] Simulating character typing');
    
    // Clear existing content
    textarea.value = '';
    textarea.focus();
    
    // Type each character with delay
    let index = 0;
    const typeChar = () => {
      if (index < text.length) {
        const char = text[index];
        
        // Add character
        textarea.value = textarea.value + char;
        
        // Create input event for this character
        const inputEvent = new InputEvent('input', {
          bubbles: true,
          inputType: 'insertText',
          data: char
        });
        
        textarea.dispatchEvent(inputEvent);
        
        index++;
        setTimeout(typeChar, 10); // 10ms delay between characters
      } else {
        // Finished typing
        console.log('[ChatGPT Followup] Typing simulation complete');
        textarea.focus();
        
        // Final events
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };
    
    typeChar();
  }

  autoSendMessageWithValidation(retryCount = 0) {
    const maxRetries = 5; // Maximum 5 retries to prevent infinite loop
    
    console.log(`[ChatGPT Followup] Validating before auto-send (attempt ${retryCount + 1}/${maxRetries})`);
    
    if (retryCount >= maxRetries) {
      console.error('[ChatGPT Followup] Max retries reached, giving up auto-send');
      return;
    }
    
    // Check if textarea still has content
    const textarea = document.querySelector('textarea[name="prompt-textarea"]');
    if (!textarea || !textarea.value.trim()) {
      console.warn('[ChatGPT Followup] Textarea empty, skipping auto-send');
      return;
    }
    
    // Check if send button is ready
    const sendButton = document.querySelector('#composer-submit-button');
    if (!sendButton) {
      console.warn('[ChatGPT Followup] Send button not found, giving up');
      return;
    }
    
    // Debug send button state
    const isDisabled = sendButton.disabled;
    const isVisible = sendButton.offsetParent !== null;
    const buttonClasses = sendButton.className;
    
    console.log(`[ChatGPT Followup] Send button state - disabled: ${isDisabled}, visible: ${isVisible}, classes: ${buttonClasses}`);
    
    if (isDisabled || !isVisible) {
      console.warn(`[ChatGPT Followup] Send button not ready (retry ${retryCount + 1}/${maxRetries}), retrying in 500ms`);
      setTimeout(() => this.autoSendMessageWithValidation(retryCount + 1), 500);
      return;
    }
    
    console.log('[ChatGPT Followup] Validation passed, proceeding with send');
    this.autoSendMessage();
  }

  autoSendMessage() {
    console.log('[ChatGPT Followup] Attempting to auto-send message');
    
    // Multiple selectors cho send button
    const sendSelectors = [
      '#composer-submit-button',
      'button[data-testid="send-button"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="send"]', 
      'button[type="submit"]',
      'button:has(svg) + button',  // Backup nếu có multiple buttons
      'form button[type="submit"]',
      '.composer-submit-btn'
    ];

    let sendButton = null;
    for (const selector of sendSelectors) {
      try {
        sendButton = document.querySelector(selector);
        if (sendButton && sendButton.offsetParent !== null) { // Check visible
          console.log(`[ChatGPT Followup] Found send button với selector: ${selector}`);
          break;
        }
      } catch (error) {
        // Skip invalid selectors
        continue;
      }
    }

    if (sendButton) {
      try {
        // Check if button is enabled
        if (sendButton.disabled) {
          console.warn('[ChatGPT Followup] Send button is disabled');
          return;
        }

        console.log('[ChatGPT Followup] Clicking send button');
        
        // Multiple click methods để đảm bảo
        sendButton.focus();
        sendButton.click();
        
        // Also trigger mousedown/mouseup events
        sendButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        sendButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        sendButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        
        // Keyboard event backup (Enter key)
        sendButton.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          key: 'Enter',
          code: 'Enter'
        }));

        console.log('[ChatGPT Followup] Message sent successfully');
        
      } catch (error) {
        console.error('[ChatGPT Followup] Error clicking send button:', error);
      }
    } else {
      console.warn('[ChatGPT Followup] Send button not found with selectors:', sendSelectors);
      
      // Fallback: Try Enter key on textarea
      this.fallbackSendWithEnter();
    }
  }

  setContentEditableValue(element, text) {
    console.log('[ChatGPT Followup] Setting contenteditable value');
    
    // Focus element
    element.focus();
    
    // Clear existing content
    element.innerHTML = '';
    
    // Create paragraph with text
    const p = document.createElement('p');
    p.textContent = text;
    element.appendChild(p);
    
    // Trigger input events
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Set cursor to end
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(p, p.childNodes.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  fallbackSendWithEnter() {
    console.log('[ChatGPT Followup] Fallback: Using Enter key to send');
    
    const inputElement = document.querySelector('#prompt-textarea') || 
                        document.querySelector('textarea[name="prompt-textarea"]');
    if (inputElement) {
      inputElement.focus();
      
      // Send Enter key event
      const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      
      inputElement.dispatchEvent(enterEvent);
      
      // Also try keyup
      inputElement.dispatchEvent(new KeyboardEvent('keyup', {
        bubbles: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      }));
      
      console.log('[ChatGPT Followup] Enter key sent to textarea');
    }
  }

  setReactTextareaValue(textarea, value) {
    try {
      // Get React fiber node
      const reactKey = Object.keys(textarea).find(key => key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$'));
      
      if (reactKey) {
        const reactInstance = textarea[reactKey];
        
        // Try to access React props and update value
        if (reactInstance && reactInstance.memoizedProps) {
          console.log('[ChatGPT Followup] Found React instance, updating props');
          
          // Create synthetic event
          const syntheticEvent = new Event('input', { bubbles: true });
          syntheticEvent.target = textarea;
          syntheticEvent.target.value = value;
          
          // Set the value directly
          textarea.value = value;
          
          // Trigger onChange if exists
          if (reactInstance.memoizedProps.onChange) {
            reactInstance.memoizedProps.onChange(syntheticEvent);
          }
          
          // Trigger onInput if exists  
          if (reactInstance.memoizedProps.onInput) {
            reactInstance.memoizedProps.onInput(syntheticEvent);
          }
        }
      }
    } catch (error) {
      console.warn('[ChatGPT Followup] React method failed:', error);
    }
  }

  triggerReactEvents(textarea, value) {
    // Comprehensive event triggering cho React components
    const events = [
      { type: 'focus', bubbles: true },
      { type: 'input', bubbles: true, data: value },
      { type: 'change', bubbles: true },
      { type: 'keydown', bubbles: true, key: 'Enter' },
      { type: 'keyup', bubbles: true, key: 'Enter' }
    ];

    events.forEach(eventConfig => {
      let event;
      
      if (eventConfig.type === 'input' && typeof InputEvent !== 'undefined') {
        event = new InputEvent(eventConfig.type, {
          bubbles: eventConfig.bubbles,
          inputType: 'insertText',
          data: eventConfig.data
        });
      } else if (eventConfig.key) {
        event = new KeyboardEvent(eventConfig.type, {
          bubbles: eventConfig.bubbles,
          key: eventConfig.key,
          code: eventConfig.key === 'Enter' ? 'Enter' : eventConfig.key
        });
      } else {
        event = new Event(eventConfig.type, { bubbles: eventConfig.bubbles });
      }
      
      // Set target value for events
      Object.defineProperty(event, 'target', {
        value: textarea,
        writable: false
      });
      
      textarea.dispatchEvent(event);
    });
    
    // Final focus và selection
    textarea.focus();
    textarea.setSelectionRange(value.length, value.length);
  }

  removeExistingFollowups() {
    if (this.followupContainer) {
      this.followupContainer.remove();
      this.followupContainer = null;
    }
  }

  injectFollowupUI() {
    // Inject CSS styles nếu chưa có
    if (!document.querySelector('#chatgpt-followup-styles')) {
      const style = document.createElement('style');
      style.id = 'chatgpt-followup-styles';
      style.textContent = `
        .chatgpt-followup-container {
          margin: 12px 0;
          padding: 12px;
          background: #f7f7f8;
          border: 1px solid #e5e5e7;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }

        .chatgpt-followup-header {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .chatgpt-followup-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chatgpt-followup-btn {
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chatgpt-followup-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .chatgpt-followup-btn:active {
          background: #e5e7eb;
        }

        @media (prefers-color-scheme: dark) {
          .chatgpt-followup-container {
            background: #2d2d30;
            border-color: #444654;
          }
          
          .chatgpt-followup-header {
            color: #d1d5db;
          }
          
          .chatgpt-followup-btn {
            background: #40414f;
            border-color: #565869;
            color: #d1d5db;
          }
          
          .chatgpt-followup-btn:hover {
            background: #565869;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize extension khi DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ChatGPTFollowupExtension();
  });
} else {
  new ChatGPTFollowupExtension();
}
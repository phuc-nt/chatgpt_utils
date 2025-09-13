# ChatGPT Smart Follow-up Extension

Chrome extension tự động tạo gợi ý follow-up thông minh cho ChatGPT conversations.

## 🚀 Installation & Testing

### Manual Testing (Developer Mode)

1. **Build Extension**:
   ```bash
   # Không cần build step - extension đã ready
   ```

2. **Load vào Chrome**:
   - Mở Chrome và vào `chrome://extensions/`
   - Bật "Developer mode" (toggle ở góc trên bên phải)
   - Click "Load unpacked"
   - Chọn folder này (`/Users/phucnt/Workspace/chatgpt_utils`)

3. **Test Extension**:
   - Vào https://chat.openai.com hoặc https://chatgpt.com
   - Bắt đầu conversation với ChatGPT
   - Sau mỗi response của ChatGPT, sẽ có gợi ý follow-up xuất hiện
   - Click vào popup icon để xem/thay đổi settings

### Debug & Development

1. **Console Logs**:
   - F12 → Console để xem logs từ content script
   - Background script logs: `chrome://extensions/` → "Inspect views: service worker"

2. **Reload Extension**:
   - Sau khi thay đổi code: vào `chrome://extensions/` → click reload button
   - Refresh ChatGPT page để apply changes

## 📁 File Structure

```
/
├── manifest.json          # Extension configuration (Manifest V3)
├── content.js            # Main logic inject vào ChatGPT
├── content.css           # Styles cho follow-up UI  
├── background.js         # Background service worker
├── popup.html           # Settings popup interface
├── popup.js             # Popup logic & settings management
├── icons/               # Extension icons (placeholder)
└── README.md           # This file
```

## 🔧 Current Features (MVP)

- ✅ **Extension Infrastructure**: Manifest V3, content script injection
- ✅ **ChatGPT Detection**: Detect response completion events  
- ✅ **Mock Follow-ups**: Generate contextual suggestions (mock data)
- ✅ **UI Integration**: Display buttons above input area
- ✅ **Settings Popup**: Enable/disable, language, suggestions count
- ✅ **Privacy Compliant**: No external data transmission

## 🎯 Next Steps (Sprint 02)

- [ ] **Real Follow-up Generation**: Integrate với ChatGPT API
- [ ] **Advanced Context Analysis**: Improve suggestion relevance
- [ ] **Language Detection**: Auto-detect conversation language
- [ ] **Performance Optimization**: Reduce memory usage
- [ ] **Error Handling**: Robust fallbacks for edge cases

## 🐛 Known Issues

- Icons chưa có (đang dùng placeholder)
- Follow-ups hiện tại là mock data
- Cần test trên multiple ChatGPT layouts

## 📝 Development Notes

- Extension tuân thủ Chrome Manifest V3
- Không sử dụng external APIs (privacy-first)
- Mock follow-ups cho MVP testing
- Ready cho integration với real ChatGPT API calls
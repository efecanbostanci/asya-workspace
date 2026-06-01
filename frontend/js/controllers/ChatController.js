import { ChatService } from '../services/ChatService.js';
import { ChatView } from '../views/ChatView.js';

export class ChatController {
    constructor() {
        this.view = new ChatView();
        this.init();
    }
    init() {
        this.view.bindEvents({
            onSendMessage: (text) => this.processMessage(text)
        });
    }
    async processMessage(text) {
        this.view.appendMessage('user', text);
        try {
            const response = await ChatService.sendMessage(text);
            const responseData = await response.json();
            const aiReply = responseData.reply || responseData.message || 'Cevap alınamadı.';
            this.view.appendMessage('ai', aiReply);
        } catch (error) {
            this.view.appendMessage('ai', 'Üzgünüm, bir hata oluştu.');
        }
    }
}
export class ChatView {
    constructor() {
        this.chatBox = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatForm = document.getElementById('chatInputForm');
    }

    bindEvents(handlers) {
        if (this.chatForm) {
            this.chatForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                const text = this.chatInput.value.trim();
                if (!text) return;
                this.chatInput.value = ''; 
                handlers.onSendMessage(text); 
            });
        }
    }

    appendMessage(sender, text) {
        if (!this.chatBox) return;
        const msgEl = document.createElement('div');
        msgEl.className = `chat-message ${sender === 'user' ? 'user-message' : 'ai-message'}`;
        msgEl.style.cssText = sender === 'user' 
            ? 'background: var(--primary); color: white; padding: 12px 16px; border-radius: 16px 16px 0 16px; margin-bottom: 12px; align-self: flex-end; max-width: 80%;'
            : 'background: #f1f5f9; color: var(--text-dark); padding: 12px 16px; border-radius: 16px 16px 16px 0; margin-bottom: 12px; align-self: flex-start; max-width: 80%;';
        msgEl.innerText = text;
        if(this.chatBox.style.display !== 'flex') {
            this.chatBox.style.display = 'flex';
            this.chatBox.style.flexDirection = 'column';
        }
        this.chatBox.appendChild(msgEl);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }
}
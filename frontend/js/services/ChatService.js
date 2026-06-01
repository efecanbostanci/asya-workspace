import { ApiClient } from '../core/ApiClient.js';
export class ChatService {
    static async sendMessage(messageText) {
        return await ApiClient.post('/chat', { message: messageText });
    }
}
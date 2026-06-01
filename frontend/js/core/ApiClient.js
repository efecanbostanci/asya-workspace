import { AuthManager } from './AuthManager.js';

export class ApiClient {
    static BASE_URL = 'http://127.0.0.1:5000';

    static async request(endpoint, options = {}) {
        const url = `${this.BASE_URL}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (AuthManager.isAuthenticated()) {
            headers['Authorization'] = `Bearer ${AuthManager.getToken()}`;
        }

        const config = {
            ...options,
            headers
        };

        const response = await fetch(url, config);
        
        if (response.status === 401) {
            AuthManager.logout();
            throw new Error("Oturum süresi doldu veya yetkisiz erişim.");
        }
        
        return response;
    }

    static async get(endpoint) {
        const response = await this.request(endpoint, { method: 'GET' });
        return response.json();
    }

    static async post(endpoint, data) {
        const response = await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response; 
    }

    static async put(endpoint, data) {
        const response = await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async delete(endpoint) {
        const response = await this.request(endpoint, { method: 'DELETE' });
        return response.json();
    }
}
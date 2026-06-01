export class AuthManager {
    static login(token, username) {
        localStorage.setItem('asya_token', token);
        localStorage.setItem('asya_user', username);
    }

    static logout() {
        localStorage.removeItem('asya_token');
        localStorage.removeItem('asya_user');
        window.location.href = 'login.html';
    }

    static isAuthenticated() {
        return !!localStorage.getItem('asya_token'); 
    }

    static getUsername() {
        return localStorage.getItem('asya_user');
    }
    
    static getToken() {
        return localStorage.getItem('asya_token');
    }
}
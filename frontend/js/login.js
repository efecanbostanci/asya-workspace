import { AuthManager } from './core/AuthManager.js';
import { ApiClient } from './core/ApiClient.js';

document.addEventListener('DOMContentLoaded', () => {
    if (AuthManager.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authMessage = document.getElementById('authMessage');

    const showMessage = (msg, isError = false) => {
        if (authMessage) {
            authMessage.innerText = msg;
            authMessage.style.color = isError ? 'var(--danger, #e74c3c)' : 'var(--success, #2ecc71)';
        }
    };

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            tabLogin.className = 'btn-primary';
            tabRegister.className = 'btn-secondary';
            if(authMessage) authMessage.innerText = '';
        });

        tabRegister.addEventListener('click', () => {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            tabRegister.className = 'btn-primary';
            tabLogin.className = 'btn-secondary';
            if(authMessage) authMessage.innerText = '';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUser').value.trim();
            const password = document.getElementById('loginPass').value.trim();
            showMessage("Giriş yapılıyor...", false);

            try {
                const response = await ApiClient.post('/login', { username, password });
                const data = await response.json();

                if (response.ok) {
                    showMessage("Giriş başarılı! Yönlendiriliyorsunuz...", false);
                    AuthManager.login(data.token, data.username);
                    setTimeout(() => window.location.href = 'index.html', 500);
                } else {
                    showMessage(data.message || "Giriş başarısız!", true);
                }
            } catch (error) {
                showMessage("Sunucuya bağlanılamadı. Backend çalışıyor mu?", true);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('regUser').value.trim();
            const password = document.getElementById('regPass').value.trim();
            showMessage("Kayıt olunuyor...", false);

            try {
                const response = await ApiClient.post('/register', { username, password });
                const data = await response.json();

                if (response.ok) {
                    showMessage("Kayıt başarılı! Giriş yapabilirsiniz.", false);
                    document.getElementById('regPass').value = ''; 
                    setTimeout(() => {
                        tabLogin.click();
                        document.getElementById('loginUser').value = username; 
                    }, 1500);
                } else {
                    showMessage(data.message || "Kayıt başarısız!", true);
                }
            } catch (error) {
                showMessage("Sunucuya bağlanılamadı. Backend çalışıyor mu?", true);
            }
        });
    }
});
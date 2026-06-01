import { AuthManager } from './core/AuthManager.js';
import { TaskController } from './controllers/TaskController.js';
import { ChatController } from './controllers/ChatController.js';
import { InvestmentController } from './controllers/InvestmentController.js';
import { HealthController } from './controllers/HealthController.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!AuthManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const userNameEl = document.getElementById('userNameDisplay');
    if (userNameEl) {
        userNameEl.innerText = AuthManager.getUsername() || 'Kullanıcı';
    }

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const pages = document.querySelectorAll('.page'); 

    if (sidebarItems.length > 0) {
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (item.id === 'logoutBtn') return;

                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const targetId = item.dataset.target;
                if (targetId) {
                    pages.forEach(page => page.style.display = 'none');
                    const targetPage = document.getElementById(targetId);
                    if (targetPage) targetPage.style.display = 'block';
                }
            });
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AuthManager.logout();
        });
    }

    try { new TaskController(); } catch(e){ console.log(e) }
try { new ChatController(); } catch(e){ console.log(e) }
try { new InvestmentController(); } catch(e){ console.log(e) }
try { new HealthController(); } catch(e){ console.log(e) }
});
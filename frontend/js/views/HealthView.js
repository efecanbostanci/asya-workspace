export class HealthView {
    constructor() {
        this.chatBox = document.getElementById('healthChatMessages'); 
        this.chatInput = document.getElementById('healthChatInput');  
        this.chatForm = document.getElementById('healthChatForm');
        
        this.foodSearchInput = document.getElementById('foodSearchInput');
        this.foodSearchResults = document.getElementById('foodSearchResults');
        this.consumedFoodsList = document.getElementById('consumedFoodsList');
        this.totalCaloriesDisplay = document.getElementById('totalCaloriesDisplay');
        this.calorieProgressBar = document.getElementById('calorieProgressBar');
    }

    bindEvents(handlers) {
        this.handlers = handlers;

        if (this.chatForm) {
            this.chatForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                const text = this.chatInput.value.trim();
                if (text.length < 3) return;
                this.chatInput.value = ''; 
                handlers.onAnalyze(text); 
            });
        }

        if (this.foodSearchInput) {
            this.foodSearchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                handlers.onSearchFood(query);
            });
        }
    }

    appendMessage(sender, text) {
        if (!this.chatBox) return;
        const msgEl = document.createElement('div');
        msgEl.style.cssText = sender === 'user' 
            ? 'background: var(--text-dark); color: white; padding: 12px 16px; border-radius: 16px 16px 0 16px; margin-bottom: 12px; align-self: flex-end; max-width: 80%;'
            : 'background: #fff5f5; color: var(--danger); border: 1px solid #feb2b2; padding: 12px 16px; border-radius: 16px 16px 16px 0; margin-bottom: 12px; align-self: flex-start; max-width: 80%; line-height:1.5;';
        msgEl.innerHTML = text.replace(/\n/g, '<br>');
        if(this.chatBox.style.display !== 'flex') {
            this.chatBox.style.display = 'flex';
            this.chatBox.style.flexDirection = 'column';
        }
        this.chatBox.appendChild(msgEl);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    renderFoodResults(foods) {
        if (!this.foodSearchResults) return;
        this.foodSearchResults.innerHTML = '';
        
        if (foods.length === 0) {
            this.foodSearchResults.innerHTML = '<div style="padding:15px; color:var(--text-muted); font-size:12px; text-align:center;">Aradığınız ürün bulunamadı.</div>';
            return;
        }
        
        foods.forEach(food => {
            const div = document.createElement('div');
            div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:12px 15px; border-bottom:1px solid #f1f5f9; cursor:pointer; transition:0.2s;';
            div.innerHTML = `
                <div>
                    <div style="font-weight:600; font-size:13px; color:var(--text-dark);">${food.name}</div>
                    <div style="font-size:11px; color:var(--text-muted);">${food.unit}</div>
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <span style="font-size:13px; font-weight:700; color:var(--primary);">${food.calories} kcal</span>
                    <button class="btn-primary-icon" style="width:26px; height:26px; font-size:12px;"><i class="fa-solid fa-plus"></i></button>
                </div>
            `;
            div.onmouseover = () => div.style.background = '#f8fafc';
            div.onmouseout = () => div.style.background = 'white';
            
            // Ürüne tıklanınca Listeye Ekle
            div.addEventListener('click', () => this.handlers.onAddFood(food));
            this.foodSearchResults.appendChild(div);
        });
    }

    
    renderConsumedFoods(consumedFoods) {
        if (!this.consumedFoodsList) return;
        this.consumedFoodsList.innerHTML = '';
        let totalCalories = 0;
        
        if (consumedFoods.length === 0) {
            this.consumedFoodsList.innerHTML = '<div style="color:var(--text-muted); font-size:12px; text-align:center; margin-top:20px;">Henüz bir şey eklemediniz.</div>';
        } else {
            consumedFoods.forEach((food, index) => {
                totalCalories += food.calories;
                const div = document.createElement('div');
                div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed #e2e8f0;';
                div.innerHTML = `
                    <div style="font-size:13px;">
                        <span style="font-weight:600; color:var(--text-dark);">${food.name}</span> 
                        <span style="color:var(--text-muted); font-size:11px; margin-left:5px;">(${food.unit})</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-size:13px; font-weight:700; color:var(--text-dark);">${food.calories} kcal</span>
                        <i class="fa-solid fa-trash" style="color:var(--danger); cursor:pointer; font-size:12px;" title="Sil"></i>
                    </div>
                `;
              
                div.querySelector('.fa-trash').addEventListener('click', () => this.handlers.onRemoveFood(index));
                this.consumedFoodsList.appendChild(div);
            });
        }
        
        this.updateCalorieProgress(totalCalories);
    }

   
    updateCalorieProgress(total) {
        if (this.totalCaloriesDisplay) this.totalCaloriesDisplay.innerText = `${total} kcal`;
        if (this.calorieProgressBar) {
            const target = 2000;
            let percent = (total / target) * 100;
            if (percent > 100) percent = 100;
            
            this.calorieProgressBar.style.width = `${percent}%`;
            
            if (total > target) {
                this.calorieProgressBar.style.background = 'var(--danger)';
                this.totalCaloriesDisplay.style.color = 'var(--danger)';
            } else {
                this.calorieProgressBar.style.background = 'var(--success)';
                this.totalCaloriesDisplay.style.color = 'var(--primary)';
            }
        }
    }
}
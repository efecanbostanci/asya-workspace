import { HealthService } from '../services/HealthService.js';
import { HealthView } from '../views/HealthView.js';

export class HealthController {
    constructor() {
        this.view = new HealthView();
        

        this.consumedFoods = JSON.parse(localStorage.getItem('asya_consumed_foods')) || [];
        this.init();
    }
    
    init() {
        this.view.bindEvents({ 
            onAnalyze: (text) => this.processHealthAnalysis(text),
            onSearchFood: (query) => this.searchFood(query),
            onAddFood: (food) => this.addFood(food),
            onRemoveFood: (index) => this.removeFood(index)
        });
        
        
        const dateEl = document.getElementById('currentDateDisplay');
        if (dateEl) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.innerText = new Date().toLocaleDateString('tr-TR', options);
        }
        
        
        this.view.renderConsumedFoods(this.consumedFoods);
        this.searchFood(''); 
    }
    
    async processHealthAnalysis(text) {
        this.view.appendMessage('user', text);
        try {
            const response = await HealthService.analyzeSymptoms(text);
            const responseData = await response.json();
            const analysisResult = responseData.reply || "Analiz tamamlandı.";
            this.view.appendMessage('ai', analysisResult);
        } catch (error) {
            this.view.appendMessage('ai', "Sunucuya bağlanılamadı.");
        }
    }

    async searchFood(query) {
        try {
            
            const foods = await HealthService.searchFoods(query);
            
            
            this.view.renderFoodResults(foods);
        } catch (error) {
            console.error("Yemek arama hatası:", error);
        }
    }
    
    addFood(food) {
        this.consumedFoods.push(food);
        this.saveConsumedFoods();
        this.view.renderConsumedFoods(this.consumedFoods);
    }
    
    removeFood(index) {
        this.consumedFoods.splice(index, 1);
        this.saveConsumedFoods();
        this.view.renderConsumedFoods(this.consumedFoods);
    }
    
    saveConsumedFoods() {
        localStorage.setItem('asya_consumed_foods', JSON.stringify(this.consumedFoods));
    }
}
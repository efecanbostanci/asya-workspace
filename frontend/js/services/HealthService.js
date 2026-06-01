import { ApiClient } from '../core/ApiClient.js';
export class HealthService {
    static async analyzeSymptoms(symptomsText) {
        return await ApiClient.post('/api/health/chat', { message: symptomsText });
    }
    static async searchFoods(query) {
        return await ApiClient.get(`/api/health/foods?q=${query}`);
    }
}
import { ApiClient } from '../core/ApiClient.js';
export class InvestmentService {
    static async getPortfolio() { return await ApiClient.get('/investments'); }
    static async addInvestment(data) { return await ApiClient.post('/investments', data); }
    static async sellInvestment(id) { return await ApiClient.delete(`/investments/${id}`); }
}
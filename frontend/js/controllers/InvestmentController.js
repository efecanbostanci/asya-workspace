import { InvestmentService } from '../services/InvestmentService.js';
import { InvestmentView } from '../views/InvestmentView.js';

export class InvestmentController {
    constructor() {
        this.view = new InvestmentView();
        this.init();
    }
    init() {
        this.view.bindEvents({
            onAddInvestment: (data) => this.addInvestment(data),
            onSellInvestment: (id) => this.sellInvestment(id)
        });
        this.loadPortfolio();
    }
    async loadPortfolio() {
        try {
            const portfolio = await InvestmentService.getPortfolio();
            this.view.renderPortfolio(portfolio);
        } catch (error) { console.error("Portföy yüklenemedi:", error); }
    }
    async addInvestment(data) {
        try {
            await InvestmentService.addInvestment(data);
            this.view.closeModal();
            this.loadPortfolio();
        } catch (error) { console.error("Yatırım eklenemedi:", error); }
    }
    async sellInvestment(id) {
        try {
            await InvestmentService.sellInvestment(id);
            this.loadPortfolio();
        } catch (error) { console.error("Satış hatası:", error); }
    }
}
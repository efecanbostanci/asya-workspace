export class InvestmentView {
    constructor() {
        this.listEl = document.getElementById('investmentList');
        this.totalInvestedEl = document.getElementById('total-invested');
        this.totalCurrentEl = document.getElementById('total-current');
        this.totalProfitEl = document.getElementById('total-profit');
    }

    bindEvents(handlers) {
        this.handlers = handlers;
        const addBtn = document.getElementById('openInvestmentModalBtn');
        const saveBtn = document.getElementById('saveInvBtn');
        const modal = document.getElementById('investmentModal');

        if (addBtn) addBtn.addEventListener('click', () => { if(modal) modal.style.display = 'flex'; });
        document.getElementById('closeInvModalBtn')?.addEventListener('click', () => { if(modal) modal.style.display = 'none'; });

        if (saveBtn) saveBtn.addEventListener('click', () => {
            const data = {
                type: document.getElementById('invType').value,
                symbol: document.getElementById('invSymbol').value.trim(),
                amount: parseFloat(document.getElementById('invAmount').value),
                buy_price: parseFloat(document.getElementById('invPrice').value)
            };
            if(data.symbol && data.amount && data.buy_price) handlers.onAddInvestment(data);
        });
    }

    renderPortfolio(portfolioData) {
        if (!this.listEl) return;
        this.listEl.innerHTML = '';
        let totalInvested = 0; let totalCurrent = 0;

        portfolioData.forEach(item => {
            totalInvested += (item.amount * item.buy_price);
            totalCurrent += (item.amount * item.current_price);

            const tr = document.createElement('tr');
            const pnl = (item.amount * item.current_price) - (item.amount * item.buy_price);
            const pnlColor = pnl >= 0 ? 'var(--success)' : 'var(--danger)';

            tr.innerHTML = `
                <td>${item.type}</td>
                <td><strong>${item.symbol.toUpperCase()}</strong></td>
                <td>${item.amount}</td>
                <td>₺${item.buy_price.toFixed(2)}</td>
                <td>₺${item.current_price.toFixed(2)}</td>
                <td style="color:${pnlColor}; font-weight:bold;">₺${pnl.toFixed(2)}</td>
                <td><button class="btn-danger sell-btn" data-id="${item.id}" style="padding:5px 10px; font-size:11px;">Sat</button></td>
            `;

            tr.querySelector('.sell-btn').addEventListener('click', (e) => {
                this.handlers.onSellInvestment(e.target.dataset.id);
            });
            this.listEl.appendChild(tr);
        });

        if (this.totalInvestedEl) this.totalInvestedEl.innerText = `₺${totalInvested.toFixed(2)}`;
        if (this.totalCurrentEl) this.totalCurrentEl.innerText = `₺${totalCurrent.toFixed(2)}`;
        if (this.totalProfitEl) {
            const netProfit = totalCurrent - totalInvested;
            this.totalProfitEl.innerText = `₺${netProfit.toFixed(2)}`;
            this.totalProfitEl.style.color = netProfit >= 0 ? 'var(--success)' : 'var(--danger)';
        }
    }

    closeModal() {
        const modal = document.getElementById('investmentModal');
        if (modal) modal.style.display = 'none';
    }
}
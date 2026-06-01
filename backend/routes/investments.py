import yfinance as yf
from flask import Blueprint, request, jsonify
from models import db, Investment
from core.security import token_required

investments_bp = Blueprint('investments_bp', __name__)

def get_live_price(symbol, inv_type):
    try:
        yf_symbol = symbol.upper().strip()
        if inv_type == 'crypto':
            if not yf_symbol.endswith('-TRY') and not yf_symbol.endswith('-USD'): yf_symbol = f"{yf_symbol}-TRY"
        elif inv_type == 'stock':
            if not yf_symbol.endswith('.IS') and not yf_symbol.endswith('.US'): yf_symbol = f"{yf_symbol}.IS"
        elif inv_type == 'fiat':
            if yf_symbol == 'USD': yf_symbol = 'TRY=X'
            elif yf_symbol == 'EUR': yf_symbol = 'EURTRY=X'
        elif inv_type == 'gold':
            if 'GRAM' in yf_symbol or 'ALTIN' in yf_symbol or yf_symbol == 'GLD': 
                ticker = yf.Ticker('XAUTRY=X')
                price = ticker.history(period='1d')['Close'].iloc[-1]
                return float(price) / 31.1034

        ticker = yf.Ticker(yf_symbol)
        todays_data = ticker.history(period='1d')
        if not todays_data.empty: return float(todays_data['Close'].iloc[-1])
    except Exception as e: 
        print(f"Fiyat çekilemedi: {e}")
    return None

@investments_bp.route('/investments', methods=['GET'])
@token_required
def get_investments(current_user):
    investments = Investment.query.filter_by(user_id=current_user.id).all()
    result = []
    for i in investments:
        live_price = get_live_price(i.symbol, i.type)
        if live_price is not None:
            i.current_price = round(live_price, 2)
            db.session.commit()
        result.append({
            'id': i.id, 'type': i.type, 'symbol': i.symbol,
            'amount': i.amount, 'buy_price': i.buy_price, 'current_price': i.current_price
        })
    return jsonify(result)

@investments_bp.route('/investments', methods=['POST'])
@token_required
def add_investment(current_user):
    data = request.json
    new_inv = Investment(
        user_id=current_user.id, type=data['type'], symbol=data['symbol'],
        amount=float(data['amount']), buy_price=float(data['buy_price']), current_price=float(data['buy_price'])
    )
    db.session.add(new_inv)
    db.session.commit()
    return jsonify({'message': 'Yatırım eklendi!', 'id': new_inv.id}), 201

@investments_bp.route('/investments/<int:inv_id>', methods=['DELETE'])
@token_required
def delete_investment(current_user, inv_id):
    inv = Investment.query.filter_by(id=inv_id, user_id=current_user.id).first_or_404()
    db.session.delete(inv)
    db.session.commit()
    return jsonify({'message': 'Yatırım silindi!'})
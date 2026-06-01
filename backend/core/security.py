import jwt
from functools import wraps
from flask import request, jsonify
from models import User  

SECRET_KEY = "asdf3152_s3cr3t_123"

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Lütfen giriş yapın (Token eksik)!'}), 401
            
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                raise Exception("Kullanıcı bulunamadı")
        except:
            return jsonify({'message': 'Oturumunuzun süresi doldu, tekrar giriş yapın!'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated
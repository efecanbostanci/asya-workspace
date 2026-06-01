from flask import Flask
from flask_cors import CORS
from models import db

from routes.auth import auth_bp
from routes.tasks import tasks_bp
from routes.investments import investments_bp
from routes.ai_chat import ai_chat_bp

app = Flask(__name__)
CORS(app) 


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///asya.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


app.register_blueprint(auth_bp)
app.register_blueprint(tasks_bp)
app.register_blueprint(investments_bp)
app.register_blueprint(ai_chat_bp)


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
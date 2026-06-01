from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    
    tasks = db.relationship('Task', backref='owner', lazy=True)
    investments = db.relationship('Investment', backref='owner', lazy=True)
    

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # KİME AİT?
    title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default='todo')
    order = db.Column(db.Integer, default=0)
    description = db.Column(db.Text, default='')
    deadline = db.Column(db.String(50), default='')
    tags = db.Column(db.String(200), default='')
    checklist = db.Column(db.Text, default='[]')
    priority = db.Column(db.String(20), default='none')
    subtasks = db.Column(db.Text, default='[]') 

class Investment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # KİME AİT?
    type = db.Column(db.String(50), nullable=False)
    symbol = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, default=0.0)
    buy_price = db.Column(db.Float, default=0.0)
    current_price = db.Column(db.Float, default=0.0)
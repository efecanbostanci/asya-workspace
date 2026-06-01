from flask import Blueprint, request, jsonify
from models import db, Task
from core.security import token_required 

tasks_bp = Blueprint('tasks_bp', __name__)

@tasks_bp.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = Task.query.filter_by(user_id=current_user.id).order_by(Task.order).all()
    return jsonify([{
        'id': t.id, 'title': t.title, 'status': t.status,
        'order': t.order, 'description': t.description,
        'deadline': t.deadline, 'tags': t.tags, 
        'checklist': t.checklist, 'priority': t.priority
    } for t in tasks])

@tasks_bp.route('/tasks', methods=['POST'])
@token_required
def add_task(current_user):
    data = request.json
    new_task = Task(
        user_id=current_user.id, title=data['title'], status=data.get('status', 'todo'),
        order=data.get('order', 0), description=data.get('description', ''),
        deadline=data.get('deadline', ''), tags=data.get('tags', ''),
        checklist=data.get('checklist', '[]'), priority=data.get('priority', 'none')
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Görev eklendi!', 'id': new_task.id}), 201

@tasks_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@token_required
def update_task(current_user, task_id):
    task = Task.query.filter_by(id=task_id, user_id=current_user.id).first_or_404()
    data = request.json
    for key in ['title', 'status', 'order', 'description', 'deadline', 'tags', 'checklist', 'priority']:
        if key in data: 
            setattr(task, key, data[key])
    db.session.commit()
    return jsonify({'message': 'Görev güncellendi!'})

@tasks_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user, task_id):
    task = Task.query.filter_by(id=task_id, user_id=current_user.id).first_or_404()
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Görev silindi!'})
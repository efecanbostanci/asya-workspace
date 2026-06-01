export class TaskView {
    constructor() {
        this.todoCol = document.getElementById('todo');
        this.doingCol = document.getElementById('doing');
        this.doneCol = document.getElementById('done');
    }

    bindEvents(handlers) {
        this.handlers = handlers;

        
        document.getElementById('searchInput')?.addEventListener('input', (e) => handlers.onSearch(e.target.value));
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                handlers.onFilter(e.target.dataset.filter);
            });
        });

        
        document.getElementById('openNewTaskModalBtn')?.addEventListener('click', () => {
            this.clearModal();
            document.getElementById('editTaskModal').style.display = 'flex';
        });
        document.getElementById('closeEditModalBtn')?.addEventListener('click', () => this.closeModal('editTaskModal'));
        document.getElementById('saveEditBtn')?.addEventListener('click', () => {
            const data = this.getFormData();
            if (data) handlers.onSaveTask(data);
        });

        
        document.getElementById('confirmCancelBtn')?.addEventListener('click', () => this.closeModal('confirmModal'));
        document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => handlers.onConfirmDelete());

        
        document.getElementById('closeBoardModalBtn')?.addEventListener('click', () => this.closeModal('subtaskBoardModal'));
        
        
        document.getElementById('addMiniTaskBtn')?.addEventListener('click', () => {
            const title = document.getElementById('newMiniTaskTitle').value;
            const priority = document.getElementById('newMiniTaskPriority').value;
            if (title.trim()) {
                this.renderMiniTask({
                    id: 'sub_' + Date.now(),
                    title: title.trim(),
                    priority: priority,
                    status: 'todo'
                });
                document.getElementById('newMiniTaskTitle').value = '';
            }
        });

        document.getElementById('saveSubtaskBoardBtn')?.addEventListener('click', () => {
            const data = this.getDetailedFormData();
            if (data) handlers.onSaveDetailedTask(data);
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) e.target.style.display = 'none';
        });
    }

   
    initSortable() {
        
        ['todo', 'doing', 'done'].forEach(col => {
            const el = document.getElementById(col);
            if (el && typeof Sortable !== 'undefined') {
                new Sortable(el, {
                    group: 'main-tasks',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    onEnd: (evt) => this.handlers.onStatusChange(evt.item.dataset.id, evt.to.id)
                });
            }
        });

        
        ['mini-todo', 'mini-doing', 'mini-done'].forEach(col => {
            const el = document.getElementById(col);
            if (el && typeof Sortable !== 'undefined') {
                new Sortable(el, {
                    group: 'mini-tasks',
                    animation: 150,
                    ghostClass: 'sortable-ghost'
                });
            }
        });
    }

    renderTasks(tasksToRender) {
        if(!this.todoCol || !this.doingCol || !this.doneCol) return;
        this.todoCol.innerHTML = ''; this.doingCol.innerHTML = ''; this.doneCol.innerHTML = '';

        tasksToRender.forEach(task => {
            const column = document.getElementById(task.status || 'todo');
            if (!column) return;

            const taskEl = document.createElement('div');
            taskEl.className = 'task-card';
            taskEl.dataset.id = task.id;
            
            
            let isOverdue = false;
            if(task.deadline) {
                const today = new Date().toISOString().split('T')[0];
                if(task.deadline < today && task.status !== 'done') isOverdue = true;
            }

            taskEl.style.cssText = `padding:15px; background:#fff; border:1px solid ${isOverdue ? 'var(--danger)' : 'var(--border-color)'}; border-radius:8px; margin-bottom:10px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.02); transition: 0.2s;`;
            
            
            taskEl.onmouseover = () => taskEl.style.transform = 'translateY(-2px)';
            taskEl.onmouseout = () => taskEl.style.transform = 'translateY(0)';

            taskEl.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <div style="font-weight:600; font-size:14px; color:var(--text-dark);">${task.title}</div>
                    <div style="display:flex; gap:10px;" class="action-buttons">
                        <i class="fa-solid fa-trash delete-btn" style="color:var(--text-muted); font-size:13px; transition:0.2s;"></i>
                    </div>
                </div>
                ${task.deadline ? `<div style="font-size:11px; margin-top:8px; color: ${isOverdue ? 'var(--danger)' : 'var(--text-muted)'};"><i class="fa-regular fa-calendar"></i> ${task.deadline}</div>` : ''}
            `;

            
            taskEl.addEventListener('click', (e) => {
                if (!e.target.closest('.action-buttons')) this.handlers.onTaskClick(task);
            });

            
            const delBtn = taskEl.querySelector('.delete-btn');
            delBtn.onmouseover = () => delBtn.style.color = 'var(--danger)';
            delBtn.onmouseout = () => delBtn.style.color = 'var(--text-muted)';
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handlers.onDeleteRequest(task.id);
                document.getElementById('confirmModal').style.display = 'flex';
            });

            column.appendChild(taskEl);
        });
    }

    openDetailedTaskModal(task, subtasks) {
        document.getElementById('currentBoardTaskId').value = task.id;
        document.getElementById('boardModalTitleInput').value = task.title || '';
        document.getElementById('boardModalDate').value = task.deadline || '';
        document.getElementById('boardModalPriority').value = task.priority || 'medium';
        document.getElementById('boardModalDescription').value = task.description || '';

        document.getElementById('mini-todo').innerHTML = '';
        document.getElementById('mini-doing').innerHTML = '';
        document.getElementById('mini-done').innerHTML = '';

        subtasks.forEach(st => this.renderMiniTask(st));

        document.getElementById('subtaskBoardModal').style.display = 'flex';
    }

   
    renderMiniTask(subtask) {
        const colId = `mini-${subtask.status || 'todo'}`;
        const column = document.getElementById(colId);
        if (!column) return;

        const div = document.createElement('div');
        div.className = 'mini-task-card';
        div.dataset.id = subtask.id;
        div.dataset.title = subtask.title;
        div.dataset.priority = subtask.priority;
        
        // Önceliğe göre sol kenar çizgisi rengi
        let borderColor = 'var(--border-color)';
        if(subtask.priority === 'high') borderColor = 'var(--danger)';
        else if(subtask.priority === 'medium') borderColor = 'var(--warning)';

        div.style.cssText = `background: white; padding: 10px; margin-bottom: 8px; border-radius: 6px; border-left: 3px solid ${borderColor}; box-shadow: 0 1px 3px rgba(0,0,0,0.05); font-size: 13px; display: flex; justify-content: space-between; align-items: center; cursor: grab;`;
        
        div.innerHTML = `
            <span style="color: var(--text-dark); font-weight: 500;">${subtask.title}</span>
            <i class="fa-solid fa-xmark mini-del-btn" style="color: var(--text-muted); cursor: pointer; padding: 5px;"></i>
        `;

        div.querySelector('.mini-del-btn').addEventListener('click', () => div.remove());
        column.appendChild(div);
    }

    
    getDetailedFormData() {
        const id = document.getElementById('currentBoardTaskId').value;
        const title = document.getElementById('boardModalTitleInput').value.trim();
        const deadline = document.getElementById('boardModalDate').value;
        const priority = document.getElementById('boardModalPriority').value;
        const description = document.getElementById('boardModalDescription').value.trim();

        if(!title) { alert("Görev başlığı boş olamaz!"); return null; }

       
        const checklist = [];
        ['todo', 'doing', 'done'].forEach(status => {
            document.querySelectorAll(`#mini-${status} .mini-task-card`).forEach(card => {
                checklist.push({
                    id: card.dataset.id,
                    title: card.dataset.title,
                    priority: card.dataset.priority,
                    status: status
                });
            });
        });

        return {
            id, title, deadline, priority, description, checklist: JSON.stringify(checklist)
        };
    }

    
    getFormData() {
        const title = document.getElementById('modalTaskTitleInput').value.trim();
        if (!title) { alert("Lütfen bir görev adı girin!"); return null; }
        return {
            id: document.getElementById('currentEditingTaskId').value,
            title: title,
            priority: document.getElementById('taskPriority').value,
            deadline: document.getElementById('taskDeadline').value,
            tags: document.getElementById('taskTags').value,
            description: document.getElementById('taskDescription').value
        };
    }

    clearModal() {
        ['currentEditingTaskId', 'modalTaskTitleInput', 'taskDeadline', 'taskTags', 'taskDescription'].forEach(id => {
            if(document.getElementById(id)) document.getElementById(id).value = '';
        });
        if(document.getElementById('taskPriority')) document.getElementById('taskPriority').value = 'none';
    }

    closeModal(modalId) {
        if(document.getElementById(modalId)) document.getElementById(modalId).style.display = 'none';
    }
}
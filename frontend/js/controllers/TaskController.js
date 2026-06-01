import { TaskService } from '../services/TaskService.js';
import { TaskView } from '../views/TaskView.js';

export class TaskController {
    constructor() {
        this.view = new TaskView(); 
        this.tasks = []; 
        this.searchTerm = '';
        this.currentFilter = 'all';
        this.taskToDelete = null;
        this.init();
    }

    init() {
        this.view.bindEvents({
            onSearch: (term) => { this.searchTerm = term.toLowerCase(); this.filterTasks(); },
            onFilter: (filter) => { this.currentFilter = filter; this.filterTasks(); },
            
           
            onSaveTask: (data) => this.saveTask(data),
            
           
            onDeleteRequest: (id) => { this.taskToDelete = id; },
            onConfirmDelete: () => this.deleteTask(),
            
            onStatusChange: (id, newStatus) => this.updateTaskStatus(id, newStatus),
            
            
            onTaskClick: (task) => this.openTaskDetail(task),
            
            
            onSaveDetailedTask: (data) => this.saveTask(data)
        });
        
        this.view.initSortable(); 
        this.loadTasks();
    }

    async loadTasks() {
        try {
            this.tasks = await TaskService.getAllTasks();
            this.filterTasks();
        } catch (error) { console.error("Görevler çekilemedi:", error); }
    }

    filterTasks() {
        const filteredTasks = this.tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(this.searchTerm);
            let matchesFilter = true;
            
            if (this.currentFilter === 'high') {
                matchesFilter = task.priority === 'high';
            } else if (this.currentFilter === 'overdue') {
                const today = new Date().toISOString().split('T')[0];
                matchesFilter = task.deadline && task.deadline < today && task.status !== 'done';
            }
            
            return matchesSearch && matchesFilter;
        });
        this.view.renderTasks(filteredTasks);
    }

   
    openTaskDetail(task) {
        let subtasks = [];
        try { 
            if (task.checklist) {
                subtasks = JSON.parse(task.checklist); 
            }
        } catch(e) { console.error("Checklist okuma hatası", e); }
        
        this.view.openDetailedTaskModal(task, subtasks);
    }

    async saveTask(data) {
        try {
            await TaskService.saveTask(data, data.id);
            this.view.closeModal('editTaskModal');
            this.view.closeModal('subtaskBoardModal'); 
            this.loadTasks(); 
        } catch (error) { console.error("Kaydetme hatası:", error); }
    }

    async updateTaskStatus(id, newStatus) {
        try { await TaskService.updateStatus(id, newStatus); } 
        catch (error) { console.error("Durum hatası:", error); }
    }

    async deleteTask() {
        if(!this.taskToDelete) return;
        try {
            await TaskService.deleteTask(this.taskToDelete);
            this.view.closeModal('confirmModal');
            this.taskToDelete = null;
            this.loadTasks();
        } catch (error) { console.error("Silme hatası:", error); }
    }
}
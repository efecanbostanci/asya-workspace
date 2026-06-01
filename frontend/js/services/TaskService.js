import { ApiClient } from '../core/ApiClient.js';

export class TaskService {
    static ENDPOINT = '/tasks';

    static async getAllTasks() {
        return await ApiClient.get(this.ENDPOINT);
    }

    static async saveTask(taskData, id = null) {
        if (id) {
            return await ApiClient.put(`${this.ENDPOINT}/${id}`, taskData);
        }
        return await ApiClient.post(this.ENDPOINT, taskData);
    }

    static async updateStatus(id, status) {
        return await ApiClient.put(`${this.ENDPOINT}/${id}`, { status });
    }

    static async deleteTask(id) {
        return await ApiClient.delete(`${this.ENDPOINT}/${id}`);
    }

    static async saveSubtasks(taskId, subtasksArray) {
        return await ApiClient.put(`${this.ENDPOINT}/${taskId}`, { 
            checklist: JSON.stringify(subtasksArray) 
        });
    }
}
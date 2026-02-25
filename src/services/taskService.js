import api from './api';

export const taskAPI = {
  getTasks: (params = {}) =>
    api.get('/tasks', { params }),
  
  getTaskById: (id) =>
    api.get(`/tasks/${id}`),
  
  createTask: (data) =>
    api.post('/tasks', data),
  
  updateTask: (id, data) =>
    api.put(`/tasks/${id}`, data),
  
  deleteTask: (id) =>
    api.delete(`/tasks/${id}`),
};

export default taskAPI;

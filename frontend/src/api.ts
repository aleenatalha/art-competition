import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const competitionsAPI = {
  getAll: (params?: { category?: string; status?: string }) =>
    api.get('/competitions', { params }),
  getById: (id: number) => api.get(`/competitions/${id}`),
  create: (data: any) => api.post('/competitions', data),
  update: (id: number, data: any) => api.put(`/competitions/${id}`, data),
  delete: (id: number) => api.delete(`/competitions/${id}`),
};

export const bookingsAPI = {
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getAll: () => api.get('/bookings'),
  create: (data: any) => api.post('/bookings', data),
  cancel: (id: number) => api.delete(`/bookings/${id}`),
};

export default api;

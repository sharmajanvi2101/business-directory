import api from './api';

const metaService = {
    getCategories: async (search) => {
        const response = await api.get('/categories', { params: { search } });
        return response.data;
    },
    createCategory: async (data) => {
        const response = await api.post('/categories', data);
        return response.data;
    },
    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
    getCities: async (search) => {
        const response = await api.get('/cities', { params: { search } });
        return response.data;
    },
    createCity: async (data) => {
        const response = await api.post('/cities', data);
        return response.data;
    },
    deleteCity: async (id) => {
        const response = await api.delete(`/cities/${id}`);
        return response.data;
    },
    getStats: async (params) => {
        const response = await api.get('/stats', { params });
        return response.data;
    }
};

export default metaService;

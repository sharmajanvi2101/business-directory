import api from './api';

const userService = {
    getUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
    getFavorites: async () => {
        const response = await api.get('/users/favorites');
        return response.data;
    },
    toggleFavorite: async (businessId) => {
        const response = await api.post(`/users/favorites/${businessId}`);
        return response.data;
    }
};

export default userService;

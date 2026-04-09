import api from './api';

const businessService = {
    getBusinesses: async (params) => {
        const response = await api.get('/businesses', { params });
        return response.data;
    },
    getNearbyBusinesses: async (lat, lng, distance = 10) => {
        const response = await api.get('/businesses/near', {
            params: { lat, lng, distance }
        });
        return response.data;
    },
    getBusinessById: async (id) => {
        const response = await api.get(`/businesses/${id}`);
        return response.data;
    },
    getBusinessBySlug: async (slug) => {
        const response = await api.get(`/businesses/slug/${slug}`);
        return response.data;
    },
    createBusiness: async (businessData) => {
        const response = await api.post('/businesses', businessData);
        return response.data;
    },
    updateBusiness: async (id, businessData) => {
        const response = await api.put(`/businesses/${id}`, businessData);
        return response.data;
    },
    verifyBusiness: async (id, status) => {
        const response = await api.put(`/businesses/${id}/verify`, { isVerified: status });
        return response.data;
    },
    deleteBusiness: async (id) => {
        const response = await api.delete(`/businesses/${id}`);
        return response.data;
    },
    trackView: async (id) => {
        const response = await api.post(`/businesses/${id}/view`);
        return response.data;
    }
};

export default businessService;

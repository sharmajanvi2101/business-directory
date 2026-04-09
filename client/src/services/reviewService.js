import api from './api';

const reviewService = {
    getBusinessReviews: async (businessId) => {
        const response = await api.get(`/reviews/business/${businessId}`);
        return response.data;
    },

    addReview: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    }
};

export default reviewService;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    isAuthenticated: !!localStorage.getItem('user'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
        },
        updateFavorites(state, action) {
            if (state.user) {
                state.user.favorites = action.payload;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
    },
});

export const { setCredentials, logout, updateFavorites } = authSlice.actions;
export default authSlice.reducer;

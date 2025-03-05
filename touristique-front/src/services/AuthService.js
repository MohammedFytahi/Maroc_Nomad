// src/services/authService.js
import axios from 'axios';

const API_URL = '/api/auth'; // Relatif au proxy

export const login = async (credentials) => {
    try {
        console.log('Sending login request with:', credentials);
        const response = await axios.post(`${API_URL}/login`, credentials);
        console.log('Login API response:', response);
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            console.log('Role saved in localStorage:', response.data.role);
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const addService = async (serviceData) => {
    try {
        const response = await axios.post('/api/provider/add-service', serviceData);
        return response.data;
    } catch (error) {
        console.error('Add Service error:', error.response?.status, error.response?.data);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axios.get('/api/auth/me');
        return response.data;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
};

export const getToken = () => localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');
export const isAuthenticated = () => !!getToken();
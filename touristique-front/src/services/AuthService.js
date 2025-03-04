import axios from 'axios';

const API_URL = '/api/auth';

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const login = async (credentials) => {
    try {
        console.log('Sending login request with:', credentials);
        const response = await axios.post(`${API_URL}/login`, credentials);

        console.log('Login API response:', response);

        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);

            // Make sure role exists before setting it
            if (response.data.role) {
                localStorage.setItem('role', response.data.role);
                console.log('Role saved in localStorage:', response.data.role);
            } else {
                console.error('Role not found in API response:', response.data);
            }
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getRole = () => {
    const role = localStorage.getItem('role');
    console.log('Retrieved role from localStorage:', role);
    return role;
};

export const isAuthenticated = () => {
    return !!getToken();
};
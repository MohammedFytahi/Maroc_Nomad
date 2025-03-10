import axios from 'axios';

const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
        config => {
            console.log('API Request:', {
                url: config.url,
                method: config.method,
                data: config.data
            });
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            console.error('API Request Error:', error);
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        response => {
            console.log('API Response:', {
                status: response.status,
                data: response.data
            });
            return response;
        },
        error => {
            console.error('API Response Error:', error.response || error);
            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors;
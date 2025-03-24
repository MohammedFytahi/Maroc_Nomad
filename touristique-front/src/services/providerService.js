import axios from "axios";

// Utiliser un chemin relatif grâce au proxy configuré dans Vite
const API_URL = "/api/services";

export const getProviderStats = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/stats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch stats");
    }
};
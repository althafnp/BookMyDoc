import axios from "axios";
import { clearAccessToken, getAccessToken } from "./authToken";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});


//Attach access token
api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    };

    return config
});



let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const processQueue = (token: string) => {
    refreshQueue.forEach((cb) => cb(token))
    refreshQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config;

        const hasAuthHeader = originalRequest.headers?.Authorization || originalRequest.headers?.authorization;

        if(error.response?.status === 401 && hasAuthHeader && !originalRequest._retry) {
            originalRequest._retry = true;

            if(isRefreshing) {
                return new Promise((resolve) => {
                    refreshQueue.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest))
                    });
                });
            }

            isRefreshing = true

            try {
                // const newAccessToken = await refreshSession();

                // if(!newAccessToken) {
                //     clearAccessToken();
                //     return Promise.reject(error);
                // }

                // processQueue(newAccessToken);

                // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error)
    }
)


export default api;
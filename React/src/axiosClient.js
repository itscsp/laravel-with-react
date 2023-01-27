import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
})

//Add request intercepter

axios.interceptors.request.use(function (config) {
    const token = localStorage.get('ACCESS_TOKEN')
    config.headers.Authorization = `Bearer ${token}`

    return config
})

// Add Response to interceptors
axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const {response} = error;

    if(response.status == 404) {
        localStorage.removeItem('ACCESS_TOKEN')
    } 

    throw error;
})

export default axiosClient
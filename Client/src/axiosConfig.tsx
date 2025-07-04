import axios from 'axios'
const instance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  // baseURL: 'https://blog-e0l8.onrender.com/api/v1',
})
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
export default instance

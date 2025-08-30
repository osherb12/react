import axios from 'axios';
import { getAuth } from 'firebase/auth';
import app from '../firebase';

const apiClient = axios.create({
  baseURL: '/api',
});

// Request interceptor to add the Firebase ID token to headers
apiClient.interceptors.request.use(async (config) => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;

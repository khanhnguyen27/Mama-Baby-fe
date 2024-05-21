import axios from 'axios';

const axiosJWT = axios.create({
  baseURL: 'http://localhost:8080/mamababy',
});

// Add a request interceptor
axiosJWT.interceptors.request.use(
  request => {
    if (!request.headers['Authorization']) {
      const storedAccessToken = localStorage.getItem('accessToken') || ""
      request.headers['Authorization'] = `Bearer ${storedAccessToken}`;
    }
    return request
  }, (error) => Promise.reject(error)
)

// Add a request interceptor
// axiosJWT.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error status is 401 and there is no originalRequest._retry flag,
//     // it means the token has expired and we need to refresh it
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshTokenLocal = localStorage.getItem('refreshToken');
//         const response = await axios.post('https://kietpt.vn/api/authen/token', { refreshToken: refreshTokenLocal });
//         const { accessToken, refreshToken } = response.data;

//         localStorage.setItem('accessToken', accessToken);
//         localStorage.setItem('refreshToken', refreshToken);

//         // Retry the original request with the new token
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         return axios(originalRequest);
//       } catch (error) {
//         // Handle refresh token error or redirect to login
//         window.location.href = '/signin';
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         console.log('error: ', error);
//       }
//     }

//     if (error.response.status === 403 && !originalRequest._retry) {
//       window.location.href = '/';
//       console.log('error: ', error);
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosJWT

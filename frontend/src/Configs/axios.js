import axios from 'axios';
import Swal from 'sweetalert2';
// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'http://localhost:3033'
});

instance.defaults.withCredentials = true;

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
  
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    switch(error.status){
        case 400: 
            console.log(error.response.data.message);
            alert(error.response.data.message);
            // window.location.href = '/login';
            // localStorage.clear(process.env.REACT_APP_LOGIN_LOCAL_STORAGE);
            break;
        case 401:
            var { isConfirmed } = await Swal.fire({
                title: "Thông Báo :v",
                text: "Hết Phiên Đăng Nhập, Vui Lòng Đăng Nhập Lại.",
                icon: "question",
                buttonsStyling: "blue",
                confirmButtonColor: "#007bff",
                cancelButtonColor: "#dc3545",
                grow: 'row'
            });
            if (isConfirmed) {
                window.location.href = '/login';
                localStorage.clear(process.env.REACT_APP_LOGIN_LOCAL_STORAGE);
            }
            return Promise.resolve(error.response.data);
        case 403: 
            var { isConfirmed } = await Swal.fire({
                title: "Thông Báo :v",
                text: "Bạn không có quyền truy cập vào trang này",
                icon: "question",
                buttonsStyling: "blue",
                confirmButtonColor: "#007bff",
                cancelButtonColor: "#dc3545",
                grow: 'row'
            });
            if(isConfirmed){
                window.location.href = '/';
                return Promise.resolve(error.response.data);
            }
        case 404: 
            return Promise.resolve(error.response.data);
        default: 
            alert(error);
    }

});

export default instance;
import React, { useEffect, useState } from "react";
import { signUp } from "../../API/UserAPI";
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterStyle.scss';

const Register = () => {
    const [credentials, setCredentials] = useState( {
        name: '',
        email: '',
        phone:'',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'name') {
            if (!value) {
                setErrors((preErrors) => ({
                    ...preErrors,
                    name: 'Tên đăng nhập không được để trống!',
                }));
            } else {
                setErrors((preErrors) => ({ ...preErrors, name: undefined}));
            }
        }

        if (name === 'email') {
            if (!value) {
                setErrors((preErrors) => ({ ...preErrors, email: 'Email không được để trống!' }));
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(value)) {
                    setErrors((preErrors) => ({
                        ...preErrors,
                        email: 'Email không hợp lệ!',
                    }));
                } else {
                    setErrors((preErrors) => ({ ...preErrors, email: undefined }));
                }
            }
        }

        if (name === 'phone') {
            if (!value) {
                setErrors((preErrors) => ({ ...preErrors, phone: 'Số điện thoại không được để trống!' }));
            } else {
                const phoneNumberRegex = /^0\d{9}$/;

                if (!phoneNumberRegex.test(value)) {
                    setErrors((preErrors) => ({
                        ...preErrors,
                        phone: 'Số điện thoại phải bắt đầu bằng số 0 và đủ 10 chữ số',
                    }));
                } else {
                    setErrors((preErrors) => ({ ...preErrors, phone: undefined }));
                }
            }
        }

        if (name === 'password') {
            if (!value) {
                setErrors((preErrors) => ({ ...preErrors, password: 'Mật khẩu không được để trống!' }));
            } else {
                const passwordRegex = 
                    /^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,}$/;
                
                if (!passwordRegex.test(value)) {
                    setErrors((preErrors) => ({
                        ...preErrors,
                        password: 
                            'Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số hoặc ký tự đặc biệt!',
                    }));
                } else {
                    setErrors((preErrors) => ({ ...preErrors, password: undefined }));
                }
            }
        }

        if (name === 'confirmPassword') {
            if (!value) {
                setErrors((preErrors) => ({
                    ...preErrors,
                    confirmPassword: 'Xác nhận mật khẩu không được để trống!',
                }));
            } else {
                setErrors((preErrors) => ({ ...preErrors, confirmPassword: undefined }));
            }
        }

        setCredentials({
            ...credentials,
            [name]: value,
        });
        setErrorMessage('');
    };
    
    const handleRegister = async (event) => {
        event.preventDefault();

        const newErrors = { ...errors };

        if (!credentials.name) {
            newErrors.name = 'Tên đăng nhập không được để trống!';
        }

        if (!credentials.email) {
            newErrors.email = 'Email không được để trống!';
        }

        if (!credentials.phone) {
            newErrors.phone = 'Số điện thoại không được để trống!';
        }

        if (!credentials.password) {
            newErrors.password = 'Mật khẩu không được để trống!';
        }

        if (!credentials.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống!';
        }

        setErrors(newErrors);
        if (Object.values(newErrors).some((error) => error)) {
            return;
        };
        
        if (credentials.password !== credentials.confirmPassword) {
            setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp!');
        }

        const { confirmPassword, ...newCredentials } = credentials;
        const response = await signUp(newCredentials);
        if (response.status === 200) {
            Swal.fire({
                title: 'Đăng ký thành công!',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 3000,
            });
            navigate('/login');
        }  else {
            Swal.fire({
                title: response.message,
                icon: 'error',
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };
    useEffect(() => {
        localStorage.clear(process.env.REACT_APP_LOGIN_LOCAL_STORAGE);
    }, []);
    return (
        <div className="Register container-fluid py-5">
            <div className="container py-5">
                <form onSubmit={handleRegister}>
                    <div className="row g-5">
                        <div className="col-md-12 col-lg-6 col-xl-6 offset-lg-3 offset-xl-3">
                            <div className="border border-1 rounded p-5">
                                <div className="form-item">
                                    <label htmlFor="name" className="form-label mb-3">
                                        Tên đăng nhập<sup>*</sup>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        onChange={handleInputChange}
                                    />
                                    {errors.name && <div className="text-danger">{errors.name}</div>}
                                </div>
                                <div className="form-item">
                                    <label htmlFor="email" className="form-label my-3">
                                        Email<sup>*</sup>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        onChange={handleInputChange}
                                    />
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>
                                <div className="form-item">
                                    <label htmlFor="phone" className="form-label my-3">
                                        Số điện thoại<sup>*</sup>
                                    </label>
                                    <input
                                        type="phone"
                                        name="phone"
                                        id="phone"
                                        className="form-control"
                                        onChange={handleInputChange}
                                    />
                                    {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                </div>
                                <div className="form-item">
                                    <label htmlFor="password" className="form-label my-3">
                                        Mật khẩu<sup>*</sup>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        onChange={handleInputChange}
                                    />
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>
                                <div className="form-item">
                                    <label htmlFor="confirm-password" className="form-label my-3">
                                        Nhập lại Mật khẩu<sup>*</sup>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirm-password"
                                        className="form-control"
                                        onChange={handleInputChange}
                                    />
                                    {errors.confirmPassword && (
                                        <div className="text-danger">{errors.confirmPassword}</div>
                                    )}
                                </div>
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="d-flex justify-content-center mt-3">
                                    <div className="form-check text-start">
                                        <input
                                            type="checkbox"
                                            id="show-password"
                                            className="form-check-input"
                                            onChange={() => setShowPassword(!showPassword)}
                                        />
                                        <label htmlFor="show-password" className="form-check-label">
                                            Hiện mật khẩu
                                        </label>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <button
                                        type="submit"
                                        className="btn border border-secondary px-4 py-3 rounded-pill text-primary text-uppercase w-75"
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <span className="mx-2">Đã có tài khoản?</span>
                                    <Link to="/login">Đăng nhập</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;

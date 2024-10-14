import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Avatar from '../Avatar';
import { setAll } from "../../Redux/userSlice";
import axios from "axios";
import { getDetails } from "../../API/UserAPI";

export default function Account() {
    const user = useSelector((state) => state.user);
    

    const [userData, setUserData] = useState({
        name: user.name,
        userName: '',
        email: user.email,
        phone: user.phone,
        //address: '',
        avatar: user.avatar,
    });

    const [avatarPreview, setAvatarPreview] = useState(null);

    const [errors, setErrors] = useState({});

    const fetchApi = async (userId) => {
        let res = await getDetails(userId);
        if(res.status === 200){
            setUserData({
                name: res.data.name,
                userName: '',
                email: res.data.email,
                phone: res.data.phone,
                //address: '',
                avatar: res.data.avatar,
            })
            return ;
        }

        alert(res.message);
    }
    useEffect( () => {
        fetchApi(user.id)
        setAvatarPreview(user.avatar);
    }, [user.id]);


    const handleInputChange = (event) => {
        const { name, value } = event.target; 

        if (name === 'userName') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, name: 'Họ tên không được để trống!' }));
            } else {
                const vietnameseCharacterRegex =
                    /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\s]+$/;

                if (!vietnameseCharacterRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: 'Họ tên không được chứa số và ký tự đặc biệt!',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                }
            }
        }

        if (name === 'email') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, email: 'Email không được để trống!' }));
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

                if (!emailRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: 'Email không hợp lệ!',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
                }
            } 
        }

        if (name === 'phone') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, phone: 'Số điện thoại không được để trống!' }));
            } else {
                const phoneNumberRegex = /^0\d{9}$/;

                if (!phoneNumberRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        phone: 'Số điện thoại phải bắt đầu bằng số 0 và đủ 10 chữ số!',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, phone: undefined }));
                }
            }
        }

        setUserData({ ...userData, [name]: value, });
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];

        const IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
        const MAX_SIZE = 1 * 1024 * 1024;

        if (file) {
            if (!IMAGE_TYPES.includes(file.type)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    avatar: 'Chỉ tải lên được các tệp hình ảnh!',
                }));
                return;
            }

            if (file.size > MAX_SIZE) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    avatar: 'Dung lượng ảnh phải nhỏ hơn 1MB!',
                }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setUserData({
                    ...userData,
                    avatar: file,
                });
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    avatar: undefined,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = { ...errors };

        if (!userData.userName) {
            newErrors.userName = 'Họ tên không được để trống!';
        }

        if (!userData.email) {
            newErrors.email = 'Email không được để trống!';
        }

        if (!userData.phone) {
            newErrors.phone = 'Số điện thoại không được để trống!';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        const formDataUpdate = new FormData();
        formDataUpdate.append('name', userData.name);
        formDataUpdate.append('userName', userData.userName || '');
        formDataUpdate.append('email', userData.email);
        formDataUpdate.append('phone', userData.phone);
        //formDataUpdate.append('address', userData.address || '');
        if (userData.avatar) {
            formDataUpdate.append('avatar', userData.avatar);
        }

        try {
            const response = await axios.put(``, formDataUpdate, {
                headers: {
                    //Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                localStorage.setItem('usertoken', response.data.token);

                Swal.fire({
                    title: 'Cập nhật thông tin tài khoản thành công!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000,
                });
            } 
        } catch (error) {
            console.error('Lỗi: ', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    const apiErrors = error.response.data.messages;
                    const newApiErrors = {};

                    apiErrors.forEach((errMessage) => {
                        if (errMessage.includes('PhoneNumber')) {
                            newApiErrors.phone = 'Số điện thoại đã tồn tại!';
                        } else if (errMessage.includes('Email')) {
                            newApiErrors.email = 'Email đã tồn tại'
                        }
                    });

                    setErrors(newApiErrors);
                }
            } else {
                Swal.fire({
                    title: 'Cập nhật thông tin tài khoản thất bại! Vui lòng thử lại!',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        }

    };

    console.log(userData);
    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                        <div className="col-md-12 col-lg-8 col-xl-8 offset-lg-2 offset-xl-2">
                            <div className="border border-1 rounded p-5">
                                <div className="row">
                                    <div className="col-md-12 col-lg-4 col-xl-4">
                                        <div className="text-center">
                                            <div className="row">
                                                <div className="col-12">
                                                <Avatar link={avatarPreview} size="bigger" />
                                                    {errors.avatar && (
                                                        <div className="text-danger">{errors.avatar}</div>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <input
                                                        type="file"
                                                        name="avatar"
                                                        id="avatar"
                                                        className="d-none"
                                                        onChange={handleAvatarChange}
                                                    />
                                                    <label htmlFor="avatar" className="btn btn-secondary my-4">
                                                        Chọn ảnh
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-8 col-xl-8">
                                        <div className="form-item">
                                            <label className="form-label mb-3">Tên đăng nhập</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={userData.name}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-item">
                                            <label htmlFor="userName" className="form-label my-3">
                                                Họ tên
                                            </label>
                                            <input
                                                type="userName"
                                                name="userName"
                                                id="userName"
                                                className="form-control"
                                                value={userData.userName}
                                                onChange={handleInputChange}
                                            />
                                            {errors.userName && <div className="text-danger">{errors.userName}</div>}
                                        </div>
                                        <div className="form-item">
                                            <label htmlFor="email" className="form-label my-3">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="form-control"
                                                value={userData.email}
                                                onChange={handleInputChange}
                                            />
                                            {errors.email && <div className="text-danger">{errors.email}</div>}
                                        </div>
                                        <div className="form-item">
                                            <label htmlFor="phone" className="form-label my-3">
                                                Điện thoại
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                className="form-control"
                                                value={userData.phone}
                                                onChange={handleInputChange}
                                            />
                                            {errors.phone && (
                                                <div className="text-danger">{errors.phone}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary mt-3">
                                    <i className="fas fa-check-circle"></i> Cập nhật
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
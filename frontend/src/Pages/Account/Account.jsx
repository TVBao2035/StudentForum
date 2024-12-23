import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Avatar from '../../Components/Avatar';
import { getDetails, updateUser } from "../../API/UserAPI";
import apiUploadImage from "../../Hooks/apiUploadImage";
import { useNavigate } from "react-router-dom";
import { setDataMain } from "../../Redux/userSlice";
import { Input, Loading } from "../../Components";
import handleColorApp from "../../Helpers/handleColorApp";
import swalApp from "../../Helpers/swalApp";
import timeOut from "../../Helpers/timeOut";

var formData = new FormData();
export default function Account() {
    const user = useSelector((state) => state.user);
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const [checkUpLoadImage, setCheckUpLoadImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [typeSelect, setTypeSelect] = useState(0);
    const [userData, setUserData] = useState({
        name: user.name,
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
                email: res.data.email,
                phone: res.data.phone,
                //address: '',
                avatar: res.data.avatar,
            })
            return ;
        }

        swalApp("error", res.message);
    }
    useEffect( () => {
        fetchApi(user.id)
        setAvatarPreview(user.avatar);
    }, [user.id]);


    const handleInputChange = (event) => {
        const { name, value } = event.target; 


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
            formData = new FormData();
            formData.append("file", event.target.files[0]);
            formData.append("upload_preset", process.env.REACT_APP_UPDATE_ACCESS_NAME);
            formData.append("asset_folder", "StudentForum");
            const imageUrl = URL.createObjectURL(file);
            setAvatarPreview(imageUrl);
            setCheckUpLoadImage(!checkUpLoadImage);
            setUserData({
                ...userData,
                avatar: imageUrl,
            });
            setErrors((prevErrors) => ({
                ...prevErrors,
                avatar: undefined,
            }));
   
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        await timeOut(300);
        setIsLoading(true);
        const newErrors = { ...errors };

       

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
        if(Number(typeSelect) === 1){
            try {
                let res = await apiUploadImage(formData);
                userData.avatar = res.data.url;
            } catch (error) {
                swalApp("error", "Lỗi upload ảnh");
                return;
            }
        }
        try {
            const response = await updateUser({
                id: user.id,
                name: userData.name,
                phone: userData.phone,
                email: userData.email,
                avatar: userData.avatar
            })

            if (response.status === 200) {
                navigator('/');
                await timeOut(300);
                setIsLoading(false);
                dispatch(setDataMain({
                    id: user.id,
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    avatar: userData.avatar
                }))
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

    };


    if(isLoading){
        return <Loading/>
    }
    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-12 col-lg-8 col-xl-8 offset-lg-2 offset-xl-2">
                            <div className="border border-1 rounded p-5">
                                <div className="row">
                                    <div className="col-md-12 col-lg-4 col-xl-4">
                                        <div className="text-center">
                                            <div className="row">
                                                <div className="col-12 d-flex justify-content-center">
                                                <Avatar link={userData.avatar} biggest />
                                                    {errors.avatar && (
                                                        <div className="text-danger">{errors.avatar}</div>
                                                    )}
                                                </div>
                                                <div className="col-12 mt-2">
                                                    <div className='d-flex gap-2 mb-3'>
                                                        <select className='form-control col text-dark border-1 px-2 py-1' onChange={e => setTypeSelect(e.target.value)} value={typeSelect}>
                                                            <option value="0">Link</option>
                                                            <option value="1">File</option>
                                                        </select>
                                                    </div>
                                                    {
                                                        Number(typeSelect) === 0 ?
                                                            <div className="d-flex gap-2 align-items-center">
                                                                <label htmlFor="">Enter:</label>
                                                                <input
                                                                    type="text"
                                                                    name="avatar"
                                                                    id="avatar"
                                                                    style={{width: "100%"}}
                                                                    className="border-1 px-2 py-1 form-control"
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        :
                                                        <div>
                                                            <input
                                                                type="file"
                                                                name="avatar"
                                                                id="avatar"
                                                                className="d-none"
                                                                onChange={handleAvatarChange}
                                                            />
                                                            <label htmlFor="avatar" className="btn btn-primary">Chọn ảnh</label>
                                                        </div>
                                                    }
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-8 col-xl-8">
                                        <div className="form-item">
                                            <label className="form-label mb-3">Tên đăng nhập</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                value={userData.name}
                                                onChange={handleInputChange}
                                            />
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
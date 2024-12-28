import { useEffect, useState } from 'react';
import Input from '../../Input';
import './ModalCreateGroupStyle.scss';
import { TiDeleteOutline } from "react-icons/ti";
import { createGroup } from '../../../API/GroupAPI';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalCreateGroup } from '../../../Redux/modalGroupSlice';
import apiUploadImage from '../../../Hooks/apiUploadImage';
import Avatar from '../../Avatar';
import swalApp from '../../../Helpers/swalApp';

const initMessageList = {
    name: "",
    description: "",
    image: "",
}
const initData = {
    name: "",
    description: "",
    image: "",
    userId: "",
}
var formData = new FormData();

const ModalCreateGroup = () => {
    const dispatch = useDispatch();
    const [messageList, setMessageList] = useState(initMessageList);
    const [data, setData] = useState(initData);
    const user = useSelector(state => state.user);
    const [typeSelect, setTypeSelect] = useState(0);
 

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    const handleClose = (e) => {
        if(e.currentTarget === e.target) dispatch(closeModalCreateGroup());
    }


    const handleUpload =  (e) => {
        formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("upload_preset", process.env.REACT_APP_UPDATE_ACCESS_NAME);
        formData.append("asset_folder", "StudentForum");
        setData({...data, image: URL.createObjectURL(e.target.files[0])})
    }

    const handleSubmit = async () => {
        if (Number(typeSelect) === 1){ // user is using file for image
            try {
                let res =  await apiUploadImage(formData);
                data.image = res.data.url;
            } catch (error) {
                swalApp("error", "Lỗi upload ảnh");
                return;
            }
        }


        data.userId = user.id;
  
        let res = await createGroup(data);
        if(res.status !== 200){
            swalApp("error", res.message);
            return ;
        }
        swalApp("success", res.message);
        setData(initData);
        setMessageList(initMessageList);
        dispatch(closeModalCreateGroup());
    }

  return (
      <div className='ModalCreateGroup position-absolute w-100 h-100 top-0 text-dark' onClick={(e) => handleClose(e)} >
          <div className='modal_container p-4 rounded-3' >
            <header className='d-flex justify-content-between'>
                <div className='fw-bolder fs-4'>Tạo Nhóm</div>
                <div onClick={()=> dispatch(closeModalCreateGroup())}>
                    <TiDeleteOutline className='fs-3 text-danger' />
                </div>
            </header>
            <main className='d-flex flex-column gap-3 my-5'>
                <Input 
                    label='Tên Nhóm' 
                    name={'name'} 
                    setMessage={setMessageList} 
                    handleChange={handleChange}
                    message={messageList['name']}
                    value={data['name']}
                />
                <Input 
                    label='Miêu tả'
                    name={'description'}
                    setMessage={setMessageList}
                    handleChange={handleChange}
                    message={messageList['description']}
                    value={data['description']}
                />

                <div className='d-flex gap-2'>
                    <label className='col-2'>Chọn từ</label>
                    <select className='col' onChange={e => setTypeSelect(e.target.value)} value={typeSelect}>
                        <option value="0">Link</option>
                        <option value="1">File</option>
                    </select>
                </div>
                
                <div className='d-flex justify-content-center w-100'>
                {
                    data.image ?
                    <div className='d-flex flex-column gap-2'>
                        <Avatar big link={data.image} />
                        <button onClick={() => setData({...data, image: ""})} className='btn btn-outline-warning'>Thay đổi</button>
                    </div>
                    :
                    typeSelect==1 ?
                    <Input
                        type='file'
                        label='Link ảnh'
                        name={'image'}
                        message={messageList['image']}
                        value={""}
                        handleChange={handleUpload}
                        setMessage={setMessageList} />  :
                    <Input
                        type='text'
                        label='Link ảnh'
                        name={'image'}
                        message={messageList['image']}
                        value={data.image}
                        handleChange={handleChange}
                        setMessage={setMessageList} />  

                }
                </div>
            </main>
              <footer className='d-flex justify-content-center'>
                <div>
                    <button className='btn btn-primary' onClick={handleSubmit}>Gửi</button>
                </div>
            </footer>
          </div>
      </div>
  )
}

export default ModalCreateGroup
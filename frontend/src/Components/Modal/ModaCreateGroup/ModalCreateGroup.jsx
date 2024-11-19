import { useState } from 'react';
import Input from '../../Input';
import './ModalCreateGroupStyle.scss';
import { TiDeleteOutline } from "react-icons/ti";
import { createGroup } from '../../../API/GroupAPI';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalCreateGroup } from '../../../Redux/modalGroupSlice';

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

const ModalCreateGroup = () => {
    const dispatch = useDispatch();
    const [messageList, setMessageList] = useState(initMessageList);
    const [data, setData] = useState(initData);
    const user = useSelector(state => state.user);

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    const handleClose = (e) => {
        if(e.currentTarget === e.target) dispatch(closeModalCreateGroup());
    }
    const handleSubmit = async () => {
        data.userId = user.id;
        let res = await createGroup(data);
        if(res.status !== 200){
            alert("Error");
            return ;
        }
        setData(initData);
        setMessageList(initMessageList);
        dispatch(closeModalCreateGroup());
    }
  return (
      <div className='ModalCreateGroup position-absolute w-100 h-100 top-0 ' onClick={(e) => handleClose(e)} >
          <div className='modal_container p-3'>
            <header className='d-flex justify-content-between'>
                <div>Tạo Nhóm</div>
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
                <Input 
                    label='Link ảnh' 
                    name={'image'} 
                    message={messageList['image']}
                    value={data['image']}
                    handleChange={handleChange}
                    setMessage={setMessageList} />
            </main>
              <footer className='d-flex justify-content-center'>
                <div>
                    <button className='btn btn-primary' onClick={handleSubmit}>
                        <p>Tạo nhóm</p>
                    </button>
                </div>
            </footer>
        </div>
      </div>
  )
}

export default ModalCreateGroup
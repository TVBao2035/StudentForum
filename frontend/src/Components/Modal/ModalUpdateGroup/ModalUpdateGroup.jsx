import { useEffect, useState } from 'react';
import './ModalUpdateGroupStyle.scss';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../Input';
import { TiDeleteOutline } from 'react-icons/ti';
import { closeModalUpdateGroup } from '../../../Redux/modalGroupSlice';
import { updateGroup } from '../../../API/GroupAPI';


const initMessageList = {
  name: "",
  description: "",
  image: "",
}
const initData = {
  id: "null",
  name: "",
  description: "",
  image: "",
}



const ModalUpdateGroup = () => {
  const dispatch = useDispatch();
  const [messageList, setMessageList] = useState(initMessageList);
  const [data, setData] = useState(initData);
  const user = useSelector(state => state.user);
  const modalGroup = useSelector(state => state.modal.modalGroup);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleClose = (e) => {
    if(e.currentTarget === e.target){
      dispatch(closeModalUpdateGroup())
    }
  }

  const handleSubmit = async  () => {
    let res = await updateGroup(data);
    if(res.status !== 200){
      alert("Error");
      return;
    }

    setData(initData);
    setMessageList(initMessageList);
    dispatch(closeModalUpdateGroup());
  }

  useEffect(() => {

    setData({
      id: modalGroup.modalUpdate.id,
      name: modalGroup.modalUpdate.name,
      description: modalGroup.modalUpdate.description,
      image: modalGroup.modalUpdate.image,
    })
  }, [])
  return (
    <div className='ModalUpdateGroup position-absolute w-100 h-100 top-0' onClick={(e) => handleClose(e)}>
        <div className='modal_container p-3'>
          <header className='d-flex justify-content-between'>
            <div>
              <p>Chỉnh sửa</p>
            </div>
            <div onClick={() => dispatch(closeModalUpdateGroup())}>
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
          <footer className='d-flex justify-content-center '>
            <button className='btn btn-primary' onClick={handleSubmit}>
                Chỉnh sửa
            </button>
          </footer>
        </div>
    </div>
  )
}

export default ModalUpdateGroup
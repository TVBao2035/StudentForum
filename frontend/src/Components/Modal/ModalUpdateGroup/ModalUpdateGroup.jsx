import { useEffect, useState } from 'react';
import './ModalUpdateGroupStyle.scss';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../Input';
import { TiDeleteOutline } from 'react-icons/ti';
import { closeModalUpdateGroup } from '../../../Redux/modalGroupSlice';
import { updateGroup } from '../../../API/GroupAPI';
import Avatar from '../../Avatar';
import apiUploadImage from '../../../Hooks/apiUploadImage';
import swalApp from '../../../Helpers/swalApp';


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

var formData = new FormData();

const ModalUpdateGroup = () => {

  const [data, setData] = useState(initData);
  const [messageList, setMessageList] = useState(initMessageList);
  const [typeSelect, setTypeSelect] = useState("0");

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const modalGroup = useSelector(state => state.modal.modalGroup);
  


  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleUpload = async (e) => {
    formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", process.env.REACT_APP_UPDATE_ACCESS_NAME);
    formData.append("asset_folder", "StudentForum");
    setData({ ...data, image: URL.createObjectURL(e.target.files[0]) })
  }


  const handleClose = (e) => {
    if(e.currentTarget === e.target){
      dispatch(closeModalUpdateGroup())
    }
  }

  const handleSubmit = async  () => {

    if (Number(typeSelect) === 1) { // user is using file for image
      try {
        let res = await apiUploadImage(formData);
        data.image = res.data.url;
      } catch (error) {
        swalApp('error',"Lỗi upload ảnh");
        return;
      }
    }


    let res = await updateGroup(data);
    if(res.status !== 200){
      swalApp('error', res.message);
      return;
    }
    swalApp("success", res.message);
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
    <div className='ModalUpdateGroup position-fixed w-100 h-100 top-0 text-dark' onClick={(e) => handleClose(e)}>
        <div className='modal_container p-4 rounded-3'>
          <header className='d-flex justify-content-between'>
            <div className='fw-bolder fs-4'>
              <p>Chỉnh sửa nhóm</p>
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
                  <Avatar bigger link={data.image} />
                  <button onClick={() => setData({ ...data, image: "" })} className='btn btn-outline-warning'>Thay đổi</button>
                </div>
              :
                typeSelect === "1" ?
                <Input 
                    label='Link ảnh'
                    type='file'
                    name={'image'}
                    message={messageList['image']}
                    value={""}
                    handleChange={handleUpload}
                    setMessage={setMessageList} />
              :
                <Input
                  label='Link ảnh'
                  name={'image'}
                  message={messageList['image']}
                  value={data['image']}
                  handleChange={handleChange}
                  setMessage={setMessageList} />

            }
          </div>
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
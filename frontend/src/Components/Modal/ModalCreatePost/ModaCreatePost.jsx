import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import Swal from "sweetalert2";
import {  getAllCategories } from '../../../API/CategoryAPI';
import { createPost } from '../../../API/PostAPI';
import { useSelector } from 'react-redux';
import apiUploadImage from '../../../Hooks/apiUploadImage';
import swalApp from '../../../Helpers/swalApp';
import { useLocation } from 'react-router-dom';


var formData = new FormData();

const ModalCreatePost = ({ show, handleClose }) => {
  const user = useSelector(state => state.user);
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  //const [images, setImages] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddImg, setIsAddImg] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.split('@')[0] === '/group/G') {
     setGroupId(location?.pathname?.split("/")[2].split("@")[1]);
    }
    const fetchCategories = async () => {
      if (categories.length === 0) {
        try {
          const response = await getAllCategories();
  
          setCategories(response.data);
        } catch (error) {
          console.error('Error fetching categories', error);
        }
      }
    };
    
    if (show) {
    
      fetchCategories();
    }
  }, [show]);
  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("upload_preset", process.env.REACT_APP_UPDATE_ACCESS_NAME);
      formData.append("asset_folder", "StudentForum");
      setIsAddImg(true);
    }
  };

  const handleCloseModal = () => {
    setImagePreview("");
    setContent("");
    setSelectedCategory("");
    setError("");
    setGroupId(null);
    formData = new FormData();
    setIsAddImg(false);
    setSuccessMessage("");
    handleClose();
  }
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
    if (!selectedCategory) {
      setError("Vui lòng chọn thể loại bài đăng!");
      return;
    }

    if (!content) {
      setError("Vui lòng nhập nội dung!")
      return;
    }
    const postData = {
      userId: user?.id,
      groupId: groupId,
      categoryId: selectedCategory,
      content: content,
      image: imagePreview,
    };
  
    if(isAddImg){
      try {
        let res = await apiUploadImage(formData);
        postData.image = res.data.url;
        setIsAddImg(false);
      } catch (error) {
        swalApp("error", "Lỗi upload ảnh");
        return;
      }
    }
    try {
      const response = await createPost(postData);
      if (response.status === 200) {
        //setSuccessMessage('Post created successfully!');
        Swal.fire("Success", "Tạo bài đăng thành công", "success");
        handleClose();
        setImagePreview("");
        setContent("");
        setSelectedCategory("");
        setError("");
        setGroupId(null);
        formData = new FormData();
        setIsAddImg(false);
        setSuccessMessage("");
      }
      else {
        setError(response.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error("Error creating post", error);
      setError("An error occurred while creating the post!");
    }
  };

  
  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "black" }}>Tạo bài đăng mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {error && <Alert variant='danger'>{error}</Alert>}
        {successMessage && <Alert variant='success'>{successMessage}</Alert>}

        <Editor
          apiKey='c71zurgnk0wg3iv3upi49j8zotrzy0chhq2evkxb69yca39g'
          value={content}
          init={{
            plugins: ['table powerpaste',
              'lists media',
              'paste'],
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Author name',
            mergetags_list: [
              { value: 'First.Name', title: 'First Name' },
              { value: 'Email', title: 'Email' },
            ],
            ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
          }}
          initialValue="Chào bạn, bạn đang nghĩ gì!"
          onEditorChange={handleEditorChange}
        />

        
        {/* Categories */}
        <Form.Group className="mt-3">
          <Form.Label>Danh mục</Form.Label>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
          {/* End Categories */}

        <div className="image-uploader mt-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button className="btn btn-primary" onClick={() => fileInputRef.current.click()}>
            Chọn Ảnh
          </button>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" style={{ marginTop: '10px', width: '100%', height: 'auto' }} />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handlePostSubmit}>
          Đăng bài
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreatePost;

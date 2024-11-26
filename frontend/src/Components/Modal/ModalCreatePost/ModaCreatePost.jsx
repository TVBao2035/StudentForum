import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import { getAllPost } from '../../../API/PostAPI';

const ModalCreatePost = ({ show, handleClose }) => {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllPost();
        console.log("get categories");
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
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
    }
  };

  const handleCloseModal = () => {
    setImagePreview("");
    setContent("");
    handleClose();
  }
  const handlePostSubmit = () => {
    handleClose();
    setImagePreview("");
    setContent("");
  };

  
  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo bài đăng mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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

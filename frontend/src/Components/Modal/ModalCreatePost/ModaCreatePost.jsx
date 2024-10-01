import React, { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';

const ModalCreatePost = ({ show, handleClose }) => {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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

  // check main
  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo bài đăng mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Editor
          apiKey={`${process.env.API_KEY}`}
          value={content}
          init={{
            height: 200,
            menubar: false,
            // plugins: 'image',
            // toolbar: 'undo redo | bold italic | image | alignleft aligncenter alignright | removeformat',
            // file_picker_callback: (callback, value, meta) => {
            //   const input = document.createElement('input');
            //   input.setAttribute('type', 'file');
            //   input.setAttribute('accept', 'image/*');
            //   input.onchange = function () {
            //     const file = this.files[0];
            //     const reader = new FileReader();
            //     reader.onload = () => {
            //       const id = 'blobid' + new Date().getTime();
            //       const blobCache = Editor.blobCache;
            //       const base64 = reader.result.split(',')[1];
            //       const blobInfo = blobCache.create(id, file, base64);
            //       blobCache.add(blobInfo);
            //       callback(blobInfo.blobUri(), { title: file.name });
            //     };
            //     reader.readAsDataURL(file);
            //   };
            //   input.click();
            // }
          }}
          onEditorChange={handleEditorChange}
        />
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

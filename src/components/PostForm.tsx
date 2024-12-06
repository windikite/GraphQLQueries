import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface PostFormProps {
  show: boolean;
  handleClose: () => void;
  postData: Post | null;
  isEditing: boolean;
  handleCreate: (data: { title: string; body: string }) => void;
  handleUpdate: (id: string, data: { title: string; body: string }) => void;
}

interface Post {
  id: string;
  title: string;
  body: string;
}

const PostForm: React.FC<PostFormProps> = ({
  show,
  handleClose,
  postData,
  isEditing,
  handleCreate,
  handleUpdate,
}) => {
  const [title, setTitle] = useState(postData?.title || '');
  const [body, setBody] = useState(postData?.body || '');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isEditing && postData?.id) {
      handleUpdate(postData.id, { title, body });
    } else {
      handleCreate({ title, body });
    }
    handleClose(); // Close the modal after submission
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Post' : 'Create Post'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formPostTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
          </Form.Group>

          <Form.Group controlId="formPostBody">
            <Form.Label>Body</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter post body"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-2">
            {isEditing ? 'Update Post' : 'Create Post'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PostForm;

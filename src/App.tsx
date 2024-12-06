import React, { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation } from "@apollo/client";
import { Spinner, Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CREATE_POST, UPDATE_POST, DELETE_POST, GET_POSTS } from './components/Queries';
import PostForm from './components/PostForm';

interface Post {
  id: string;
  title: string;
  body: string;
}

interface PostsData {
  posts: {
    data: Post[];
  };
}

interface PostsVars {}

function CreatePostForm() {
  const [showModal, setShowModal] = useState(false);
  const [modalPostData, setModalPostData] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterId, setFilterId] = useState<string>('');

  const [createPost, { loading: createLoading, error: createError }] = useMutation(CREATE_POST, {
    onCompleted: () => createModalWithMessage('Post Created Successfully'),
  });

  const [updatePost, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_POST, {
    onCompleted: () => createModalWithMessage('Post Updated Successfully'),
  });

  const [deletePost, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_POST, {
    onCompleted: () => createModalWithMessage('Post Deleted Successfully'),
  });

  const { data: postsData, loading: postsLoading, error: postsError } = useQuery<PostsData, PostsVars>(GET_POSTS);

  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Function to show success modal
  const createModalWithMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  const handleCreate = ({ title, body }: { title: string, body: string }) => {
    createPost({ variables: { title, body } });
  };

  const handleUpdate = (id: string, { title, body }: { title: string, body: string }) => {
    updatePost({ variables: { id, input: { title, body } } });
  };

  const handleDelete = (id: string) => {
    deletePost({ variables: { id } });
  };

  const openModalForCreate = () => {
    setIsEditing(false);
    setModalPostData(null);
    setShowModal(true);
  };

  const openModalForEdit = (post: Post) => {
    setIsEditing(true);
    setModalPostData(post);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterId(e.target.value);
  };

  const filteredPosts = postsData?.posts?.data.filter(post => 
    filterId ? post.id === filterId : true
  );

  if (postsLoading || createLoading || updateLoading || deleteLoading) return <Spinner animation="border" />;
  if (postsError || createError || updateError || deleteError) return <p>Error: {postsError?.message || createError?.message || updateError?.message || deleteError?.message}</p>;

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={openModalForCreate}>Create New Post</Button>

      <Form.Group controlId="formPostFilter" className="mt-3">
        <Form.Label>Filter Posts by ID</Form.Label>
        <Form.Control
          type="text"
          value={filterId}
          onChange={handleFilterChange}
          placeholder="Enter Post ID"
        />
      </Form.Group>

      {filteredPosts?.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        filteredPosts?.map((post) => (
          <div key={post.id} className="mb-3">
            <h5>{post.title}</h5>
            <p>{post.body}</p>
            <Button variant="warning" onClick={() => openModalForEdit(post)}>Edit</Button>{' '}
            <Button variant="danger" onClick={() => handleDelete(post.id)}>Delete</Button>
          </div>
        ))
      )}

      <PostForm 
        show={showModal} 
        handleClose={handleCloseModal} 
        postData={modalPostData} 
        isEditing={isEditing} 
        handleCreate={handleCreate} 
        handleUpdate={handleUpdate} 
      />

      {showSuccessModal && (
        <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>{successMessage}</Modal.Body>
        </Modal>
      )}
    </div>
  );
}

const client = new ApolloClient({
  uri: "https://graphqlzero.almansi.me/api",
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <CreatePostForm />
    </ApolloProvider>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdatePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [, setCurrentUser] = useState('');

  useEffect(() => {
    fetchPost();
    fetchCurrentUser();
  // eslint-disable-next-line
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    }
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8080/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCurrentUser(response.data.userid);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8080/api/posts/${id}`, { title, content }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  return (
    <div>
      <h2>Update Post</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdatePost;

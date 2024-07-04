import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';

interface Post {
  id: number;
  title: string;
  content: string;
  user: {
    userId: string;
    nickname: string;
  };
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const [userResponse, postResponse] = await Promise.all([
            axios.get('http://localhost:8080/api/user/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }),
            axios.get(`http://localhost:8080/api/posts/${id}`)
          ]);
          setCurrentUser(userResponse.data.userId);
          setPost(postResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`http://localhost:8080/api/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>작성자: {post.user.nickname}</p>
      {currentUser === post.user.userId && (
        <div>
          <button onClick={() => navigate(`/posts/update/${id}`)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
      <hr />
      <Comment />
    </div>
  );
};

export default PostDetail;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Comments from './Comment';

interface User {
  userid: string;
  nickname: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
  viewCount: number;
  likes: { id: number; user: User }[];
  likeCount: number;
  imageUrls?: string[];
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await axios.get(`http://localhost:8080/api/posts/${id}`);
        setPost(postResponse.data);

        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:8080/api/posts/${id}/increment-views`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (token) {
          const userResponse = await axios.get('http://localhost:8080/api/user/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setCurrentUser(userResponse.data.userid);

          const likedResponse = await axios.get(`http://localhost:8080/api/posts/${id}/like-status`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setLiked(likedResponse.data.liked);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchPostData();
  }, [id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && post) {
        if (liked) {
          await axios.delete(`http://localhost:8080/api/posts/${id}/like`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setPost({ ...post, likeCount: post.likeCount - 1 });
        } else {
          await axios.post(`http://localhost:8080/api/posts/${id}/like`, {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setPost({ ...post, likeCount: post.likeCount + 1 });
        }
        setLiked(!liked);
      }
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

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
      <h1>제목: {post.title}</h1>
      <p>내용: {post.content}</p>
      <p>작성자: {post.user.nickname}</p>
      <p>조회수: {post.viewCount}</p>
      <p>좋아요: {post.likeCount}</p>
      {post.imageUrls && post.imageUrls.map((url, index) => (
        <img key={index} src={`http://localhost:8080${url}`} alt={`게시글 이미지 ${post.title} - ${index + 1}`} />
      ))}
      <button onClick={handleLike}>{liked ? '좋아요 취소' : '좋아요'}</button>
      {currentUser === post.user.userid && (
        <div>
          <button onClick={() => navigate(`/posts/update/${id}`)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
      <hr />
      <Comments postId={post.id} currentUser={currentUser} />
    </div>
  );
};

export default PostDetail;

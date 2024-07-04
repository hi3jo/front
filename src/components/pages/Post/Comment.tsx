import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Comment {
  id: number;
  content: string;
  user: {
    userId: string;
    nickname: string;
  };
}

const Comments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        
        const response = await axios.get(`http://localhost:8080/api/posts/${id}/comments`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
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
          setCurrentUser(response.data.userId);
        } catch (error) {
          console.error('Failed to fetch current user:', error);
        }
      }
    };

    fetchComments();
    fetchCurrentUser();
  }, [id]);

  const handleCreateComment = async () => {
    const token = localStorage.getItem('token');
    try {
      if (!token) throw new Error('No token found');

      const response = await axios.post(`http://localhost:8080/api/posts/${id}/comments`, {
        content: newComment
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const token = localStorage.getItem('token');
    try {
      if (!token) throw new Error('No token found');

      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: number, updatedContent: string) => {
    const token = localStorage.getItem('token');
    try {
      if (!token) throw new Error('No token found');

      const response = await axios.put(`http://localhost:8080/api/comments/${commentId}`, {
        content: updatedContent
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setComments(comments.map(comment => 
        comment.id === commentId ? { ...comment, content: response.data.content } : comment
      ));
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      {comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <p>작성자: {comment.user.nickname}</p>
          {currentUser === comment.user.userId && (
            <div>
              <button onClick={() => handleUpdateComment(comment.id, 'Updated content')}>수정</button>
              <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
            </div>
          )}
        </div>
      ))}
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="댓글을 작성하세요..."
      />
      <button onClick={handleCreateComment}>댓글 작성</button>
    </div>
  );
};

export default Comments;

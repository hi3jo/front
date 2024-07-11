import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CommentProps {
  postId: number;
  currentUser: string | null;
}

interface User {
  userid: string;
  nickname: string;
}

interface Comment {
  id: number;
  content: string;
  user: User;
}

const Comments: React.FC<CommentProps> = ({ postId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/comments/posts/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCreateComment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/comments/posts/${postId}`, 
        { content: newComment }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/comments/${commentId}`, 
        { content: editCommentContent }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setComments(comments.map(comment => 
        comment.id === commentId ? { ...comment, content: response.data.content } : comment
      ));
      setEditCommentId(null);
      setEditCommentContent('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  return (
    <div>
      <h2>댓글</h2>
      {comments.map(comment => (
        <div key={comment.id}>
          {editCommentId === comment.id ? (
            <div>
              <textarea
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
              />
              <button onClick={() => handleUpdateComment(comment.id)}>저장</button>
              <button onClick={() => setEditCommentId(null)}>취소</button>
            </div>
          ) : (
            <div>
              <p>{comment.content}</p>
              <p>작성자: {comment.user?.nickname || 'Unknown'}</p>
              {currentUser === comment.user?.userid && (
                <div>
                  <button onClick={() => { setEditCommentId(comment.id); setEditCommentContent(comment.content); }}>수정</button>
                  <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {currentUser && (
        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
          />
          <button onClick={handleCreateComment}>댓글 작성</button>
        </div>
      )}
    </div>
  );
};

export default Comments;

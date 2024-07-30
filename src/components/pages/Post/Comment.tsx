import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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
  dateCreate: string;
}

const CommentsContainer = styled.div`
  margin-top: 2rem;
`;

const CommentForm = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const CommentTextarea = styled.textarea`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-bottom: 0.5rem;
  resize: none;
  font-size: 1rem;
`;

const CommentButton = styled.button`
  align-self: flex-end;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const CommentItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;

  &:last-child {
    border-bottom: none;
  }
`;

const CommentContent = styled.p`
  margin: 0;
  padding: 0;
  font-size: 1rem;
`;

const CommentAuthor = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: #555;
`;

const CommentActions = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const CommentActionButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
`;

const backUrl = process.env.REACT_APP_BACK_URL;

const EditCommentForm = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Comments: React.FC<CommentProps> = ({ postId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${backUrl}/api/comments/posts/${postId}`);
        const sortedComments = response.data.sort((a: Comment, b: Comment) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime());
        setComments(sortedComments);
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
        `${backUrl}/api/comments/posts/${postId}`, 
        { content: newComment }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setComments([response.data, ...comments]);
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
      await axios.delete(`${backUrl}/api/comments/${commentId}`, {
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
        `${backUrl}/api/comments/${commentId}`, 
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
    <CommentsContainer>
      {currentUser && (
        <CommentForm>
          <CommentTextarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
          />
          <CommentButton onClick={handleCreateComment}>댓글 작성</CommentButton>
        </CommentForm>
      )}
      {comments.map(comment => (
        <CommentItem key={comment.id}>
          {editCommentId === comment.id ? (
            <EditCommentForm>
              <CommentTextarea
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
              />
              <CommentButton onClick={() => handleUpdateComment(comment.id)}>저장</CommentButton>
              <CommentActionButton onClick={() => setEditCommentId(null)}>취소</CommentActionButton>
            </EditCommentForm>
          ) : (
            <div>
              <CommentContent>{comment.content}</CommentContent>
              <CommentAuthor>작성자: {comment.user?.nickname || 'Unknown'}</CommentAuthor>
              {currentUser === comment.user?.userid && (
                <CommentActions>
                  <CommentActionButton onClick={() => { setEditCommentId(comment.id); setEditCommentContent(comment.content); }}>수정</CommentActionButton>
                  <CommentActionButton onClick={() => handleDeleteComment(comment.id)}>삭제</CommentActionButton>
                </CommentActions>
              )}
            </div>
          )}
        </CommentItem>
      ))}
    </CommentsContainer>
  );
};

export default Comments;

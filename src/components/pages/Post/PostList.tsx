import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../services/auth';
import styled from 'styled-components';

interface Post {
  id: number;
  title: string;
  content: string;
  user: {
    userid: string;
    nickname: string;
  };
}

const PostListContainer = styled.div`
  margin: 20px;
`;

const PostItem = styled.li`
  margin: 10px 0;
`;

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts');
      const sortedPosts = response.data.sort((a: Post, b: Post) => b.id - a.id); //게시물 내림차순 정렬
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleCreatePostClick = () => {
    if (isAuthenticated) {
      navigate('/createpost');
    } else {
      navigate('/login');
    }
  };

  return (
    <PostListContainer>
      <h1>게시물</h1>
      <button onClick={handleCreatePostClick}>글쓰기</button>
      <ul>
        {posts.map((post, index) => (
          <PostItem key={post.id}>
            <span>{posts.length - index}. </span>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
            <span> - {post.user.nickname}</span>
          </PostItem>
        ))}
      </ul>
    </PostListContainer>
  );
};
//*
export default PostList;

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

interface PostsResponse {
  posts: Post[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

const PostListContainer = styled.div`
  margin: 20px;
`;

const PostItem = styled.li`
  margin: 10px 0;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationItem = styled.li`
  list-style-type: none;
  margin: 0 5px;
  cursor: pointer;
  &.disabled {
    display: none;
  }
`;

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pageList, setPageList] = useState<number[]>([]);
  const [curPage, setCurPage] = useState(1);
  const [search, setSearch] = useState({ sk: '', sv: '' });
  const [totalPages, setTotalPages] = useState(0);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [curPage]);

  const fetchPosts = async () => {
    try {
      const queryString = Object.entries({ ...search, page: curPage - 1, size: 10 })
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const response = await axios.get<PostsResponse>(`http://localhost:8080/api/posts/pages?${queryString}`);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);

      const maxPagesToShow = 10;
      const startPage = Math.floor((curPage - 1) / maxPagesToShow) * maxPagesToShow + 1;
      const endPage = Math.min(startPage + maxPagesToShow - 1, response.data.totalPages);

      const tmpPages = [];
      for (let i = startPage; i <= endPage; i++) {
        tmpPages.push(i);
      }
      setPageList(tmpPages);

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

  const handlePageClick = (page: number) => {
    setCurPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSearch({
      ...search,
      [name]: value,
    });
  };

  const handleSearch = () => {
    setCurPage(1);
    fetchPosts();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNextPageGroupClick = () => {
    const nextGroupFirstPage = Math.floor((curPage - 1) / 10) * 10 + 11;
    setCurPage(nextGroupFirstPage);
  };

  const handlePrevPageGroupClick = () => {
    const prevGroupFirstPage = Math.floor((curPage - 1) / 10) * 10;
    setCurPage(prevGroupFirstPage);
  };

  return (
    <PostListContainer>
      <h1>게시물</h1>
      <button onClick={handleCreatePostClick}>글쓰기</button>
      <SearchContainer>
        <select name="sk" onChange={handleSearchChange}>
          <option value="">제목+내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
        <input
          type="text"
          name="sv"
          onChange={handleSearchChange}
          onKeyDown={handleKeyPress}
          placeholder="검색어 입력"
        />
        <button onClick={handleSearch}>검색</button>
      </SearchContainer>
      <ul>
        {posts.map((post, index) => (
          <PostItem key={post.id}>
            <span>{(curPage - 1) * 10 + index + 1}. </span>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
            <span> - {post.user.nickname}</span>
          </PostItem>
        ))}
      </ul>
      <PaginationContainer>
        {curPage > 10 && (
          <PaginationItem
            onClick={handlePrevPageGroupClick}
          >
            &lt;
          </PaginationItem>
        )}
        {pageList.map((page, index) => (
          <PaginationItem
            key={index}
            className={page === curPage ? 'active' : ''}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </PaginationItem>
        ))}
        {curPage <= Math.floor(totalPages / 10) * 10 && (
          <PaginationItem
            onClick={handleNextPageGroupClick}
          >
            &gt;
          </PaginationItem>
        )}
      </PaginationContainer>
    </PostListContainer>
  );
};

export default PostList;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useAuth } from '../../services/auth';

interface Post {
  id: number;
  title: string;
  content: string;
  user: {
    userid: string;
    nickname: string;
  };
  viewCount: number;
  likeCount: number;
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
  display: grid;
  grid-template-columns: 1fr 4fr 2fr 1.5fr 1.5fr;
  gap: 10px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  list-style-type: none;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  height: 2.4rem;
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
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;

  &.active {
    background: #007bff;
    color: white;
    font-weight: bold;
  }

  &:hover:not(.active) {
    background: #f0f0f0;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  margin: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const backUrl  = process.env.REACT_APP_BACK_URL;

const PopularPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pageList, setPageList] = useState<number[]>([]);
  const [curPage, setCurPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState({ sk: '', sv: '' });

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  // eslint-disable-next-line
  }, [curPage]);

  const fetchPosts = async () => {
    try {
      const queryString = Object.entries({ ...search, page: curPage - 1, size: 10 })
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const response = await axios.get<PostsResponse>(`${backUrl}/api/posts/popular?${queryString}`);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);

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
      <Button onClick={handleCreatePostClick}>글쓰기</Button>
      <ul>
        {posts.map((post, index) => (
          <PostItem key={post.id}>
            <span>{totalItems - ((curPage - 1) * 10 + index)} </span>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
            <span> {post.user.nickname}</span>
            <span> 조회수: {post.viewCount}</span>
            <span> 좋아요: {post.likeCount}</span>
          </PostItem>
        ))}
      </ul>
      <SearchContainer>
        <Select name="sk" onChange={handleSearchChange}>
          <option value="">제목+내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </Select>
        <Input
          type="text"
          name="sv"
          onChange={handleSearchChange}
          onKeyDown={handleKeyPress}
          placeholder="검색어 입력"
        />
        <Button onClick={handleSearch}>검색</Button>
      </SearchContainer>
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

export default PopularPosts;

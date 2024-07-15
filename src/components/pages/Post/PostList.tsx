import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../services/auth';
import styled from 'styled-components';
import { format, isToday } from 'date-fns'; //npm install date-fns --legacy-peer-deps

interface Post {
  id: number;
  title: string;
  content: string;
  user: {
    userid: string;
    nickname: string;
  };
  dateCreate: string;
  viewCount: number;
  likeCount: number;
}

interface PostsResponse {
  posts: Post[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: top;
`;

const PostListContainer = styled.div`
  margin: 20px;
`;

const BestPost = styled.div`
  padding: 3rem;
  border: 1px solid #ddd;
  width: 100%
  height: 12rem;
`

const BestTitle = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #ddd;
`

const Table = styled.table`
  width: 45rem;
  border-collapse: collapse;
  margin: 20px 0;
`;

const TableRow = styled.tr`
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  padding: 15px;
  text-align: left;
  height: 10rem;
  }
`;

const TableTitle = styled.tr`
  font-size: 1.5rem;
  padding: 0.8rem 0;
  height:3rem;
`

const TableContent = styled.tr`
  font-size: 1rem;
  padding: 0.8rem 0;
  height: 3rem;
`

const TableLike = styled.tr`
  margin-top: -25px;
  text-align: right;
`

const TableNick = styled.tr`
  padding: 0.8rem 0;
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  height: 2.4rem;
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
  margin-bottom: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

const SideContainer= styled.div`
  padding: 3rem 2.5rem;
  width: 27rem;
`

const PostWrite = styled.button`
  width: 100%;
  height: 3rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1.7rem;

  &:hover {
    background-color: #0056b3;
  }
`

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
  // eslint-disable-next-line
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isToday(date) ? format(date, 'HH:mm') : format(date, 'yyyy-MM-dd');
  };

  return (
    <PageContainer>
      <PostListContainer>
        <Button><Link to={`/popularposts`}>좋아요 30 이상글</Link></Button>
        <BestPost>
          <BestTitle>{"\uD83C\uDFC6"} 베스트 게시물</BestTitle>
          <div>1위</div>
          <div>1위</div>
          <div>1위</div>
          <div>1위</div>
        </BestPost>
        <Table>
          <tbody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableTitle>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </TableTitle>
                <TableLike>좋아요 : {post.likeCount}</TableLike>
                <TableContent>
                  <Link to={`/posts/${post.id}`}>{post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}</Link>
                </TableContent>
                <TableNick>{post.user.nickname} | {formatDate(post.dateCreate)} 조회수 : {post.viewCount}</TableNick>
              </TableRow>
            ))}
          </tbody>
        </Table>
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
      </PostListContainer>
      <SideContainer>
        <PostWrite onClick={handleCreatePostClick}>글쓰기</PostWrite>
      </SideContainer>
    </PageContainer>
  );
};

export default PostList;
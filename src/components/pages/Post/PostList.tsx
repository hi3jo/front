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
  imageUrls?: string[];
  commentCount?: number;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  border: 2px solid #20B2AA;
  width: 50rem;
  height: 16rem;
`

const BestTitle = styled.div`
  margin-top: -0.8rem;
  padding: 1.4rem 0;
  border-bottom: 1px solid #ddd;
  font-size: 1.5rem;
  font-weight: bold;
`

const BestPostNumber = styled.span`
  font-size: 1rem;
  font-weight: bold;
`

const BestPostLabel= styled.span`
  background-color: blue;
  padding: 0 0.2rem;
  color: white;
  font-size: 0.7rem;
`

const BestPostItem = styled.div`
  padding: 0.6rem 0;
  }
`;

const Table = styled.div`
  width: 50rem;
  border-collapse: collapse;
  margin: 20px 0;
`;

const TableRow = styled.div`
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  text-align: left;
  height: 10rem;
  }
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height:3rem;
`

const TableTitle = styled.div`
  font-size: 1.2rem;
  color: #333333;
  font-weight: 600;
`

const TableLike = styled.div`
  color: #444444;
  font-size: 0.9rem;
`

const TableContent = styled.div`
  display:flex;
  flex-direction: row;
  color: #555555;
  font-size: 0.9rem;
  padding: 1rem 0.3rem;
  height: 5rem;
`

const PostImg = styled.div`
  right: 0;
  img {
    width:100px;
    height: 100px;
    display: block;
    margin-bottom: 1rem;
  }
`

const TableNick = styled.div`
  color: #444444;
  padding: 0.9rem 0;
  font-size: 0.7rem;

  svg {
    vertical-align: middle;
  }
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  height: 2.4rem;
`;

const PaginationItem = styled.li`
  list-style-type: none;
  cursor: pointer;
  padding: 7px 12px;
  border: 1px solid #ddd;
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
  font-size: 1.4rem;
  font-weight: 700;
  font-family: initial;

  &:hover {
    background-color: #0056b3;
  }
`

const PostCon2 = styled.div`
  margin-top: 1rem;
  diplsay:flex;
  width: 100%;
  height: 50rem;
  border: 1px solid #999;
`
const backUrl = process.env.REACT_APP_BACK_URL;

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pageList, setPageList] = useState<number[]>([]);
  const [curPage, setCurPage] = useState(1);
  const [search, setSearch] = useState({ sk: '', sv: '' });
  const [totalPages, setTotalPages] = useState(0);
  const [bestPosts, setBestPosts] = useState<Post[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchBestPosts();
  // eslint-disable-next-line
  }, [curPage]);

  const fetchPosts = async () => {
    try {
      const queryString = Object.entries({ ...search, page: curPage - 1, size: 10 })
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const response = await axios.get<PostsResponse>(`${backUrl}/api/posts/pages?${queryString}`);
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

  const fetchBestPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Post[]>(`${backUrl}/api/posts/best`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBestPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch best posts:', error);
    }
  };

  const bestPostNumbers = ['1위', '2위', '3위', '4위', '5위']
  const bestPostLabels = ['Best', 'Best', 'Best', 'Best', 'Best'];

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

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Invalid date';
      }
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="no-global-font">
      <PageContainer>
        <PostListContainer>
          <Button><Link to={`/popularposts`}>좋아요 30 이상글</Link></Button>
          <BestPost>
            <BestTitle>{"\uD83C\uDFC6"} 베스트 게시물</BestTitle>
            {bestPosts.map((post, index) => (
              <BestPostItem key={post.id}>
                <BestPostNumber>{bestPostNumbers[index]}&nbsp;</BestPostNumber>
                <Link to={`/posts/${post.id}`}>
                  <BestPostLabel>{bestPostLabels[index]}</BestPostLabel> {post.title}  ({post.commentCount})
                </Link>
              </BestPostItem>
            ))}
          </BestPost>
          <Table>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableHeader>
                  <TableTitle>
                    <Link to={`/posts/${post.id}`}>{post.title} ({post.commentCount})</Link>
                  </TableTitle>
                  <TableLike>{"\u2764\uFE0F"}좋아요: {post.likeCount}</TableLike>
                </TableHeader>
                <TableContent>
                  <Link style={{ width: '700px' }} to={`/posts/${post.id}`}>{post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}</Link>
                  <PostImg>
                    {post.imageUrls && post.imageUrls.length > 0 && (
                      <img src={`${post.imageUrls[0]}`} alt={`게시글 이미지 ${post.title} - 1`} />
                    )}
                  </PostImg>
                </TableContent>
                <TableNick>{post.user.nickname} | {formatDate(post.dateCreate)} 조회수 : {post.viewCount}</TableNick>
              </TableRow>
            ))}
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
          <PostWrite onClick={handleCreatePostClick}>커뮤니티 글쓰기</PostWrite>
          <PostCon2>추가 사이드바</PostCon2>
        </SideContainer>
      </PageContainer>
    </div>
  );
};

export default PostList;
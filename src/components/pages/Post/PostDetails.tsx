import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useAuth } from '../../services/auth';
import Comments from './Comment';
import { format, isToday } from 'date-fns';
import { AiOutlineLike } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { IoMdTime } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";

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
  dateCreate: string;
  likes: { id: number; user: User }[];
  likeCount: number;
  imageUrls?: string[];
  commentCount?: number;
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px;
`;

const PostLine = styled.div`
  margin-top: 1rem;
  border-top: 1px solid #ddd;
  padding: 1rem;
`

const PostListContainer = styled.div`
  margin: 20px;
  width: 60%;
`;

const BestPost = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  border: 2px solid #20B2AA;
  width: 100%;
  margin-bottom: 20px;
`;

const BestTitle = styled.div`
  padding: 0.8rem 0;
  border-bottom: 1px solid #ddd;
  font-size: 1.5rem;
  font-weight: bold;
`;

const BestPostNumber = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

const BestPostLabel = styled.span`
  background-color: blue;
  padding: 0 0.2rem;
  color: white;
  font-size: 0.7rem;
`;

const BestPostItem = styled.div`
  padding: 0.6rem 0;
`;

const PostContainer = styled.div`
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 20px;
  background-color: #f9f9f9;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableTitle = styled.div`
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
`;

const TableLike = styled.div`
  color: #444;
  font-size: 0.9rem;
`;

const TableContent = styled.div`
  color: #555;
  font-size: 0.9rem;
`;

const ContentImg = styled.div`
  margin-top: 1rem;
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin-bottom: 1rem;
  }
`;

const TableNick = styled.div`
  margin-top: 1rem;
  color: #444;
  font-weight: 600;
  font-size: 0.9rem;
`;

const TableTime = styled.div`
  margin-top: 1rem;
  color: #888888;
  font-weight: 500;
  font-size: 0.9rem;

  svg {
    vertical-align: middle;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom:1rem;
`;

const LikeButton = styled.div<{ $liked: boolean }>`
  padding: 0 1rem;
  border-radius: 5px;
  background-color: ${props => (props.$liked ? '#ff6b6b' : '#eeeeee')};
  color: ${props => (props.$liked ? '#eeeeee' : '#000000')};
  cursor: pointer;
  font-size: 3rem; /* 이모티콘의 크기 */

  &:hover {
    color: ${props => (props.$liked ? '#0056b3' : '#ff4c4c')};
  }
`;

const SideContainer = styled.div`
  padding: 3rem 2.5rem;
  width: 30%;
`;

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
`;

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const [bestPosts, setBestPosts] = useState<Post[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPostData();
    fetchBestPosts();
  // eslint-disable-next-line
  }, [id]);

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

  const fetchBestPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Post[]>('http://localhost:8080/api/posts/best', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBestPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch best posts:', error);
    }
  };

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

  const handleCreatePostClick = () => {
    if (isAuthenticated) {
      navigate('/createpost');
    } else {
      navigate('/login');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isToday(date) ? format(date, 'HH:mm') : format(date, 'yyyy.MM.dd');
  };

  const bestPostNumbers = ['1위', '2위', '3위', '4위', '5위'];
  const bestPostLabels = ['Best', 'Best', 'Best', 'Best', 'Best'];

  return (
    <div className="no-global-font">
      <PageContainer>
        <PostListContainer>
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
          {currentUser === post.user.userid && (
            <div>
              <button onClick={() => navigate(`/posts/update/${id}`)}>수정</button>
              <button onClick={handleDelete}>삭제</button>
            </div>
          )}
          <PostContainer>
            <PostHeader>
              <TableTitle>{post.title}</TableTitle>
              <TableLike>{"\u2764\uFE0F"} 좋아요: {post.likeCount}</TableLike>
            </PostHeader>
            <TableNick>글쓴이: {post.user.nickname}</TableNick>
            <TableTime>
              <IoMdTime /> {formatDate(post.dateCreate)}&nbsp;&nbsp;&nbsp;
              <GrView /> {post.viewCount}&nbsp;&nbsp;&nbsp;
              <FaRegCommentDots /> {post.commentCount}
            </TableTime>
            <PostLine />
            <TableContent>{post.content}</TableContent>
            <ContentImg>
              {post.imageUrls && post.imageUrls.map((url, index) => (
                <img key={index} src={`http://localhost:8080${url}`} alt={`게시글 이미지 ${post.title} - ${index + 1}`} />
              ))}
            </ContentImg>
            <ButtonGroup>
              <LikeButton $liked={liked} onClick={handleLike}>
                <AiOutlineLike />
              </LikeButton>
            </ButtonGroup>
            <PostLine />
            <TableTitle>댓글 {post.commentCount}</TableTitle>
            <Comments postId={post.id} currentUser={currentUser} />
          </PostContainer>
        </PostListContainer>
        <SideContainer>
          <PostWrite onClick={handleCreatePostClick}>커뮤니티 글쓰기</PostWrite>
        </SideContainer>
      </PageContainer>
    </div>
  );
};

export default PostDetail;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaCloudUploadAlt } from 'react-icons/fa';

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

const ContentImg = styled.div`
  margin-top: 1rem;
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin-bottom: 1rem;
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: left;
  align-items: center;
`;

const FileInputLabel = styled.label`
  cursor: pointer;
  color: #007bff;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: #0056b3;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const DeleteButton = styled.button`
  margin-left: 1rem;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
`;

const UpdatePost: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [, setCurrentUser] = useState('');
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // 삭제할 이미지 URL 상태 추가
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchPost();
    fetchCurrentUser();
    if (imageFiles) {
      const urls = Array.from(imageFiles).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  }, [id, imageFiles]); // 의존성 배열을 하나로 합칩니다.

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(e.target.files);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
      setPost(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (error) {
      console.error('Failed to fetch post:', error);
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
        setCurrentUser(response.data.userid);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      // 삭제된 이미지 URL을 포함하여 업데이트 요청
      await axios.put(`http://localhost:8080/api/posts/${id}`, { title, content, deletedImages }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleDeleteImage = (e: React.MouseEvent<HTMLButtonElement>, url: string) => {
    e.preventDefault();                         //클릭 이벤트의 기본 동작을 방지
    setDeletedImages([...deletedImages, url]);  //삭제된 이미지 URL 추가
  };

  return (
    <div>
      <h2>Update Post</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <FileInputWrapper>
              <FileInputLabel htmlFor="file-input">
                <FaCloudUploadAlt />
              </FileInputLabel>
              <HiddenFileInput
                id="file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </FileInputWrapper>
        <ContentImg>
          {post?.imageUrls && post.imageUrls.map((url, index) => (
            <div key={index}>
              <img src={`${url}`} alt={`게시글 이미지 ${post.title} - ${index + 1}`} />
              <DeleteButton onClick={(e) => handleDeleteImage(e, url)}>삭제</DeleteButton>
            </div>
          ))}
        </ContentImg>
        {previewUrls.map((url, index) => (
            <img key={index} src={url} alt={`preview ${index}`} style={{ maxWidth: '5rem', marginBottom: '1rem' }} />
          ))}
        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdatePost;
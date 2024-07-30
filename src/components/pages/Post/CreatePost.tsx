import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import styled from 'styled-components';
import { FaCloudUploadAlt } from 'react-icons/fa';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: top;
`;

const PostLine = styled.div`
  margin-top: 1rem;
  border-top: 1px solid #ddd;
  padding: 1rem;
`;

const Container = styled.div`
  width: 50rem;
  margin: 50px auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  padding-right: 5.5rem;
  margin-bottom: 8px;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 30rem;
  padding: 0.4rem;
  border: 1px solid #ddd;
  font-size: 1rem;
`;

const TextAreaContainer = styled.div`
  width: 46rem;
  padding: 1rem;
  margin-bottom: 20px;
  border: 1px solid #999999;
  font-size: 1rem;
  min-height: 150px;
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  outline: none;
  font-size: 1rem;
  min-height: 100px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;

  &:hover {
    background-color: #0056b3;
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

const SideContainer = styled.div`
  padding: 3rem 2.5rem;
  width: 27rem;
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

const apiUrl  = process.env.REACT_APP_API_URL;
const backUrl = process.env.REACT_APP_BACK_URL;

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
//const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    //미리보기 파일
    if (imageFiles) {
      const urls = Array.from(imageFiles).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }

    const handleReceiveMessage = (event: MessageEvent) => {
      
      const { image, story } = event.data;
      if (image instanceof File) {                          // 이미지가 File 객체인지 확인
        setPreviewUrls(prevUrls => [...prevUrls, URL.createObjectURL(image)]);
        setImageFiles(prevFiles => [...prevFiles, image]);
      }

      if (story) { setContent(story); }                       // 사연 내용 설정
    };

    // message 이벤트 리스너 등록
    window.addEventListener('message', handleReceiveMessage);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('message', handleReceiveMessage);
    };
  }, [imageFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // setImageFiles(e.target.files);
      const filesArray = Array.from(e.target.files);
      setImageFiles(filesArray);
      setPreviewUrls(filesArray.map(file => URL.createObjectURL(file)));
    }
  };

  const handleCreatePostClick = () => {
    if (isAuthenticated) {
      navigate('/createpost');
    } else {
      navigate('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    let imageUrls: string[] = [];
    if (imageFiles) {
      for (let i = 0; i < imageFiles.length; i++) {
        const formData = new FormData();
        formData.append('file', imageFiles[i]);
        try {
          const response = await axios.post(`${backUrl}/api/uploads`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          imageUrls.push(response.data);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    }

    const post = { title, content, imageUrls };

    try {
      await axios.post(`${backUrl}/api/posts`, post, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="no-global-font">
      <PageContainer>
        <Container>
          <Form onSubmit={handleSubmit}>
            <div>
              <Label>제목</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <PostLine />
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
            {previewUrls.map((url, index) => (
                <img key={index} src={url} alt={`preview ${index}`} style={{ maxWidth: '5rem', marginBottom: '1rem' }} />
              ))}
            <TextAreaContainer>
              <TextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요..."
              />
            </TextAreaContainer>
            <Button type="submit">Create</Button>
          </Form>
        </Container>
        <SideContainer>
          <PostWrite onClick={handleCreatePostClick}>커뮤니티 글쓰기</PostWrite>
        </SideContainer>
      </PageContainer>
    </div>
  );
};

export default CreatePost;

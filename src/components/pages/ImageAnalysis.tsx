import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../services/auth';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  background: #f8f9fa;
`;

const ImageContainer = styled.div`
  width: 48%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const Header = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FileInput = styled.input`
  margin: 1rem 0;
`;

const IconButton = styled.button`
  background: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #0056b3;
  }
`;

const ResultContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f1f1f1;
  border-radius: 5px;
  text-align: center;
`;

const ResultHeader = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
`;

const ResultContent = styled.p`
  color: #555;
`;

const ImageAnalysis = () => {
  const { user } = useAuth();
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const fileInputRef1 = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);

  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile1(e.target.files[0]);
    }
  };

  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile2(e.target.files[0]);
    }
  };

  const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    if (!file1) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file1);

    try {
      console.log('Sending request to backend...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const res = await axios.post('http://localhost:8080/api/imageAnalysis/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response received:', res.data);
      setAnswer1(res.data); // AI 서버로부터 받은 응답을 state에 저장
    } catch (error: any) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }

    setFile1(null);
    if (fileInputRef1.current) {
      fileInputRef1.current.value = '';
    }
  };

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file2) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file2);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const res = await axios.post('http://localhost:8080/api/imageAnalysis/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setAnswer2(res.data);
    } catch (error: any) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }

    setFile2(null);
    if (fileInputRef2.current) {
      fileInputRef2.current.value = '';
    }
  };

  return (
    <Container>
      <ImageContainer>
        <Header>이미지 분석 1</Header>
        <Form onSubmit={handleSubmit1}>
          <FileInput type="file" onChange={handleFileChange1} ref={fileInputRef1} required />
          <IconButton type="submit">
            <FaPaperPlane />
          </IconButton>
        </Form>
        {file1 && (
          <img src={URL.createObjectURL(file1)} alt="Selected" style={{ width: '100%', marginTop: '1rem' }} />
        )}
        {answer1 && (
          <ResultContainer>
            <ResultHeader>분석 결과 1</ResultHeader>
            <ResultContent>{answer1}</ResultContent>
          </ResultContainer>
        )}
      </ImageContainer>
      <ImageContainer>
        <Header>이미지 분석 2</Header>
        <Form onSubmit={handleSubmit2}>
          <FileInput type="file" onChange={handleFileChange2} ref={fileInputRef2} required />
          <IconButton type="submit">
            <FaPaperPlane />
          </IconButton>
        </Form>
        {file2 && (
          <img src={URL.createObjectURL(file2)} alt="Selected" style={{ width: '100%', marginTop: '1rem' }} />
        )}
        {answer2 && (
          <ResultContainer>
            <ResultHeader>분석 결과 2</ResultHeader>
            <ResultContent>{answer2}</ResultContent>
          </ResultContainer>
        )}
      </ImageContainer>
    </Container>
  );
};

export default ImageAnalysis;

import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
  background-color: #f5f5f5;
  overflow: hidden;
`;

const RegisterForm = styled.form`
  display: flex;
  margin-top: 70px;
  font-size: 1.8rem;
  width: 26rem;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-items:center;
`;

const Input = styled.input`
  padding: 1.3rem;
  width:22rem;
  height:3.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Sub = styled.div`
  font-size:1rem;
  justify-content: flex-start;
  width: 22rem;
  font-size: 1rem;
`

const ErrorText = styled.p`
  color: red;
  font-size:0.8rem;
  width: 22rem;
  justify-content: flex-start;
`;

const Button = styled.button`
  margin-top:1.2rem;
  border: none;
  font-size: 1rem;
  width: 22rem;
  height: 3.5rem;
  border-radius: 4px;
  background-color: #20B2AA;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #008080;
`;

const backUrl  = process.env.REACT_APP_BACK_URL;

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    userid: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    role: 'ROLE_USER'
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [error, setError] = useState({
    general: '',
    passwordMismatch: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({ general: '', passwordMismatch: '' });

    if (!formData.userid || !formData.password || !formData.nickname) {
      setError((prevError) => ({
        ...prevError,
        general: '모든 필드를 입력해 주세요.',
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError((prevError) => ({
        ...prevError,
        passwordMismatch: '비밀번호가 일치하지 않습니다.',
      }));
      return;
    }

    axios.post(`${backUrl}/api/auth/register`, formData)
      .then(response => {
        alert('회원가입 성공!');
        window.location.href = '/login';
      })
      .catch(error => {
        alert('이미 존재하는 아이디 입니다.');
      });
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <h2>회원가입</h2>
        <Sub>아이디</Sub>
        <Input type="text" name="userid" placeholder="아이디" onChange={handleChange} />
        <Sub>비밀번호</Sub>
        <Input type="password" name="password" placeholder="비밀번호" onChange={handleChange} />
        <Sub>비밀번호 확인</Sub>
        <Input type="password" name="confirmPassword" placeholder="비밀번호 확인" onChange={handleChange} />
        {error.passwordMismatch && <ErrorText>{error.passwordMismatch}</ErrorText>}
        <Sub>닉네임</Sub>
        <Input type="text" name="nickname" placeholder="닉네임" onChange={handleChange} />
        {error.general && <ErrorText>{error.general}</ErrorText>}
        <Button type="submit">가입하기</Button>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default RegisterUser;

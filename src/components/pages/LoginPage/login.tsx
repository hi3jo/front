import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
  background-color: #f5f5f5;
  overflow: hidden;
`;

const LoginForm = styled.form`
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
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size:1rem;
`;

const RegisterLink = styled(Link)`
  margin-top:2rem;
  color: #c0c0c0;
  text-decoration: none;
  font-size:1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 1rem;
`

const LoginPage = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ userid: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/');
    } catch {
      setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>로그인</h2>
        <Input type="text" name="userid" placeholder="아이디" onChange={handleChange} />
        <Input type="password" name="password" placeholder="비밀번호" onChange={handleChange} />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit">로그인</Button>
        <AuthLinks>
          <RegisterLink to="/register">회원가입</RegisterLink>
          <RegisterLink to="/register-lawyer">변호사회원가입</RegisterLink>
        </AuthLinks>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;

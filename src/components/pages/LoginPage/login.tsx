import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorText = styled.p`
  color: red;
`;

const RegisterLink = styled(Link)`
  margin-top: 1rem;
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 1rem;
  padding:1rem;
  font-size:0.8rem;
`

const LoginPage = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ userid: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(credentials);
      window.location.href = '/';
    } catch {
      setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <LoginContainer>
      <h2>로그인</h2>
      <LoginForm onSubmit={handleSubmit}>
        <Input type="text" name="userid" placeholder="User ID" onChange={handleChange} />
        <Input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <Button type="submit">Login</Button>
      </LoginForm>
      {error && <ErrorText>{error}</ErrorText>}
      <AuthLinks>
        <RegisterLink to="/register">회원가입</RegisterLink>
      </AuthLinks>
    </LoginContainer>
  );
};

export default LoginPage;

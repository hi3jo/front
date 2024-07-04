import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../services/auth';

const NavbarContainer = styled.nav`
  background: #fff;
  max-height:5rem;
  color: #000;
  padding: 1rem;
  display:flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CustomLink = styled(Link)`
  margin-left: 1rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
`;

const NavLinks = styled.div`
  display: flex;
  font-weight: 600;
  gap: 2rem;
  padding: 1rem;
  font-size:1.2rem;
  margin-left: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledButton = styled.button`
  text-decoration: none;
  color: inherit;
  padding: 0.8rem;
  border-radius: 5px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 1.2rem;

  &:hover {
    transform: scale(0.95);
    background-color: #f1f1f1;
  }
`

const Nickname = styled.div`
display: flex;
padding:1rem;
font-size:1.2rem;
cursor: pointer;
color: blue;
`

const AuthLinks = styled.div`
  display: flex;
  gap: 1rem;
  padding:1rem;
  font-size:0.8rem;
  cursor: pointer;
`

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <NavbarContainer>
      <LeftContainer>
        <CustomLink  to="/">갈림길</CustomLink>
        <NavLinks>
          <StyledButton onClick={() => window.location.href = "/chatbot"}>AI챗봇 시스템</StyledButton>
          <StyledButton onClick={() => window.location.href = "/post"}>커뮤니티</StyledButton>
        </NavLinks>
      </LeftContainer>
      <AuthLinks>
        {isAuthenticated ? (
          <>
            <Nickname>{user?.nickname}</Nickname>
            <AuthLinks onClick={logout}>로그아웃</AuthLinks>
          </>
        ) : (
          <Link to="/login">로그인/가입</Link>
        )}
      </AuthLinks>
    </NavbarContainer>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background: #fff;
  color: #000;
  padding: 1rem;
  display:flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 1rem 1rem 1rem;
  font-size:1.2rem;
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 1rem;
  padding:1rem;
  font-size:0.8rem;
`

const Navbar = () => {
  return (
    <NavbarContainer>
      <NavLinks>
        <Link to="/">갈림길</Link>
        <Link to="/chatbot">Chatbot</Link>
        <Link to="/community">Community</Link>
      </NavLinks>
      <AuthLinks>
        <Link to="/login">로그인/가입</Link>
      </AuthLinks>
    </NavbarContainer>
  );
};

export default Navbar;

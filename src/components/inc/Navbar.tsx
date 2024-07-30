import React, { useState, useEffect, useRef } from 'react';
import { NavLink as RouterNavLink, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../services/auth';
import { FaEllipsisV } from 'react-icons/fa';

const NavbarContainer = styled.nav`
  background: #fff;
  max-height: 5rem;
  color: #000;
  padding: 1rem;
  display: flex;
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

const CustomNavLink = styled(RouterNavLink)`
  text-decoration: none;
  color: #333;
  font-size: 1.8rem;
  font-weight: bold;
  margin-left: 1rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.1rem;
  font-weight: 600;
  padding: 1rem;
  font-size: 1.2rem;
  margin-left: 2rem;

  @media (max-width: 1000px) {
    display: none;
  }
`;

const StyledButton = styled.button`
  display: flex;
  text-decoration: none;
  color: inherit;
  padding: 0.8rem;
  border-radius: 5px;
  background: none;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 1.2rem;
  width: 8rem;

  &:hover {
    transform: scale(0.95);
    background-color: #f1f1f1;
  }

  &.active {
    background-color: #20B2AA;
    color: white;
    border-radius: 20px;
  }
`;

const Nickname = styled.div`
  display: flex;
  padding: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  color: blue;
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  font-size: 0.8rem;
  cursor: pointer;
`;

const MoreOptions = styled.div`
  position: relative;
  display: inline-block;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const DropdownMenu = styled.div<{ $show: boolean }>`
  display: ${props => (props.$show ? 'block' : 'none')};
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
`;

const DropdownItem = styled(Link)`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  font-size: 1rem;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <NavbarContainer>
      <LeftContainer>
        <CustomNavLink to="/">갈림길</CustomNavLink>
        <NavLinks>
          <StyledButton as={RouterNavLink} to="/chatbot">AI챗봇 시스템</StyledButton>
          <StyledButton as={RouterNavLink} to="/image">이미지 생성</StyledButton>
          <StyledButton as={RouterNavLink} to="/imageAnalysis">이미지 분석</StyledButton>
          <StyledButton as={RouterNavLink} to="/post">커뮤니티</StyledButton>
          <StyledButton as={RouterNavLink} to="/lawyer/consultation-request">변호사 상담</StyledButton>
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
        <MoreOptions ref={dropdownRef}>
          <MoreButton onClick={() => setShowDropdown(!showDropdown)}>
            <FaEllipsisV />
          </MoreButton>
          <DropdownMenu $show={showDropdown}>
            <DropdownItem to="/caselowmanagement">판례관리</DropdownItem>
          </DropdownMenu>
        </MoreOptions>
      </AuthLinks>
    </NavbarContainer>
  );
};

export default Navbar;

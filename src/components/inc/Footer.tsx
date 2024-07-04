import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #333;
  color: #fff;
  text-align: center;
  padding: 1rem;
  width: 100%;
`;

const Footer = () => {
  return (
    <FooterContainer>
      &copy; {new Date().getFullYear()} Hi AI3조
    </FooterContainer>
  );
};

export default Footer;

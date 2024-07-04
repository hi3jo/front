import React from 'react';
import styled from 'styled-components';
import Slider from './Slider';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Footer from '../../inc/Footer';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <Content>
        <Slider />
        <Section1 />
        <Section2 />
        <Section3 />
      </Content>
      <Footer />
    </HomeContainer>
  );
};

export default HomePage;

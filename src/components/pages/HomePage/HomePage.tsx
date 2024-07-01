import React from 'react';
import styled from 'styled-components';
import Slider from './Slider';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';

const HomeContainer = styled.div`
  padding: 2rem;
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <Slider />
      <Section1 />
      <Section2 />
      <Section3 />
    </HomeContainer>
  );
};

export default HomePage;

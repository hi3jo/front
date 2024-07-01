import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useInView } from 'react-intersection-observer';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ContentSection = styled.div<{ $inView: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(20px);
  ${({ $inView }) =>
    $inView &&
    css`
      opacity: 1;
      transform: translateY(0);
      animation: ${fadeIn} 1s ease-out forwards;
    `}
`;

const SectionTitle = styled.p`
  font-size: 1.1rem;
  color: DarkSlateGrey;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const SectionTitle2 = styled.h2`
  font-size: 2.5rem;
  line-height: 1.5;
  font-weight: bold;
  background: linear-gradient(90deg, #81d4fa, #00bcd4, #006064);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Content1 = styled.div`
    width: 500px;
    height: 500px;
`

const Section3 = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <ContentSection ref={ref} $inView={inView}>
      <SectionTitle>비슷한 답변 말고</SectionTitle>
      <SectionTitle2>내 사건에 대한 맞춤형 제안서를 받아보세요.</SectionTitle2>
      <Content1></Content1>
    </ContentSection>
  );
};

export default Section3;

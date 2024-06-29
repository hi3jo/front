import React from 'react';
import styled from 'styled-components';

const ContentSection = styled.div`
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
`;

const Content1 = styled.div`
    width: 500px;
    height: 500px;
`

const SectionTest = () => {
  return (
    <ContentSection>
      <Content1>빈 공 간</Content1>
    </ContentSection>
  );
};

export default SectionTest;

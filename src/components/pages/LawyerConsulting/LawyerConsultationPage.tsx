import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: top;
`;

const LawContainer = styled.div`
  width: 50rem;
  margin: 50px 0;
`

const SubHeading = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.8rem;
`;

const LawyerCount = styled.span`
  background-color: #333333;
  color: white;
  border-radius: 20px;
  padding: 0.1rem 0.5rem;
  font-size: 1.2rem;
  margin-left: 0.5rem;
`

const RegisterLawyer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const LawyerName = styled.div`
  background-color: #f1f1f1;
  padding: 0.5rem;
  border-radius: 5px;
`

const SideContainer= styled.div`
  padding: 3rem 2.5rem;
  width: 27rem;
`

const StyledButton = styled.button`
  display: flex;
  text-decoration: none;
  color: inherit;
  padding: 0.8 1.4rem;
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

const PostCon2 = styled.div`
  margin-top: 1rem;
  diplsay:flex;
  width: 100%;
  height: 50rem;
  border: 1px solid #999;
`

const LawyerConsultationPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [lawyerCount, setLawyerCount] = useState(0);
  const [lawyers, setLawyers] = useState<{ id: string; nickname: string}[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyerData = async () => {
      try{
        const response = await axios.get('http://localhost:8080/api/lawyer/count');
        setLawyerCount(response.data);

        const lawyerResponse = await axios.get('http://localhost:8080/api/lawyer/available-lawyers');
        const uniqueLawyers = lawyerResponse.data.reduce((acc: any, current: any) => {
          if (!acc.find((lawyer: any) => lawyer.id === current.id)) {
            acc.push(current);
          }
          return acc;
        }, []);
        setLawyers(uniqueLawyers);
      } catch(error) {
        console.error('변호사 데이터 가져오기 실패', error)
      }
    };
    fetchLawyerData();
  }, []);

  const handLawyerProfile = () => {
    if (isAuthenticated && user) {
      navigate(`/lawyer/lawyerprofile/${user.id}`);
    }
  };

  return (
    <Container>
      <LawContainer>
        <SubHeading>
          변호사 <LawyerCount>{lawyerCount}</LawyerCount>
        </SubHeading>
        <RegisterLawyer>
          {lawyers.map((lawyer) => (
            <LawyerName key={lawyer.id}>{lawyer.nickname}</LawyerName>
          ))}
        </RegisterLawyer>
      </LawContainer>
      <SideContainer>
      {isAuthenticated && user?.role === 'ROLE_LAWYER' && (
        <>
          <StyledButton onClick={handLawyerProfile}>프로필 보기</StyledButton>
        </>
      )}
      <PostCon2>추가 사이드바</PostCon2>
      </SideContainer>
    </Container>
  );
};

export default LawyerConsultationPage;

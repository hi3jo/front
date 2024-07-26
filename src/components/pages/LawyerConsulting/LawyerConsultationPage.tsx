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
`;

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
`;

const RegisterLawyer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LawyerCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 5px;
`;

const LawyerInfo = styled.div`
  flex-grow: 1;
`;

const LawyerImage = styled.img`
  width: 8.5rem;
  height: 8.5rem;
  border-radius: 50%;
  margin-right: 4rem;
`;

const Low = styled.div`
  margin-top: 1.7rem;
  margin-bottom: 1.7rem;
  border: 1px solid #ccc;
  transform: scaleY(0.5);
  transform-origin: center;
`;

const LawyerName = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
`;

const LawyerProfile = styled.div`
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #555;
`;

const LawyerPrice = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 2rem;
`;

const ConsultingPrice = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #eeeeee;
  width: 7.5rem;
  height: 4.3rem;
  justify-content: center;
  font-size: 0.9rem;
  padding: 1.2rem 0 1rem 1.5rem;
`;

const ConsultingGo = styled.div`
  display: flex;
  width: 4.2rem;
  height: 4.3rem;
  background-color: #ff69b4;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
`;

const SideContainer = styled.div`
  padding: 3rem 2.5rem;
  width: 27rem;
`;

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
  display: flex;
  width: 100%;
  height: 50rem;
  border: 1px solid #999;
`;

const LawyerConsultationPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [lawyerCount, setLawyerCount] = useState(0);
  const [lawyers, setLawyers] = useState<{ id: string; nickname: string }[]>([]);
  const [profiles, setProfiles] = useState<{ [key: string]: any }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyerData = async () => {
      try {
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

        uniqueLawyers.forEach(async (lawyer: { id: string }) => {
          try {
            const profileResponse = await axios.get(`http://localhost:8080/api/lawyer/profile/${lawyer.id}`);
            setProfiles((prevProfiles) => ({
              ...prevProfiles,
              [lawyer.id]: profileResponse.data,
            }));
          } catch (error) {
            console.error(`Failed to fetch profile for lawyer ${lawyer.id}`, error);
          }
        });
      } catch (error) {
        console.error('변호사 데이터 가져오기 실패', error);
      }
    };
    fetchLawyerData();
  }, []);

  const handleLawyerProfileClick = (lawyerId: string) => {
    navigate(`/lawyer/lawyerprofile/${lawyerId}`);
  };

  const handleUserProfileClick = () => {
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
          {lawyers.map((lawyer, index) => (
            <React.Fragment key={lawyer.id}>
              <LawyerCard>
                <LawyerInfo>
                  <LawyerName style={{ fontSize: '1.7rem' }} onClick={() => handleLawyerProfileClick(lawyer.id)}>
                    {lawyer.nickname}
                  </LawyerName>
                  {profiles[lawyer.id] && (
                    <>
                      <LawyerProfile>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>법무법인 갈림길</div>
                        <div style={{ color: '#333', marginTop: '1.4rem' }}>{profiles[lawyer.id].title}</div>
                      </LawyerProfile>
                      <LawyerPrice>
                        <ConsultingPrice>
                          <div style={{ fontWeight: 'bold', paddingBottom: '0.3rem' }}>15분 전화상담</div>
                          <div style={{ color: '#666' }}>{profiles[lawyer.id].phoneConsultationPrice}원</div>
                        </ConsultingPrice>
                        <ConsultingPrice>
                          <div style={{ fontWeight: 'bold', paddingBottom: '0.3rem' }}>30분 방문상담</div>
                          <div style={{ color: '#666' }}>{profiles[lawyer.id].inPersonConsultationPrice}원</div>
                        </ConsultingPrice>
                        <ConsultingGo onClick={() => handleLawyerProfileClick(lawyer.id)}>예약하기</ConsultingGo>
                      </LawyerPrice>
                    </>
                  )}
                </LawyerInfo>
                <LawyerImage src="/images/kevin.jpeg" alt={`${lawyer.nickname} 사진`} />
              </LawyerCard>
              {index < lawyers.length - 1 && <Low />}
            </React.Fragment>
          ))}
        </RegisterLawyer>
      </LawContainer>
      <SideContainer>
        {isAuthenticated && user?.role === 'ROLE_LAWYER' && (
          <>
            <StyledButton onClick={handleUserProfileClick}>프로필 보기</StyledButton>
          </>
        )}
        <PostCon2>추가 사이드바</PostCon2>
      </SideContainer>
    </Container>
  );
};

export default LawyerConsultationPage;

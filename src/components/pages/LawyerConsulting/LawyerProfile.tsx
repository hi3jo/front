import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../services/auth';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import AvailableTimeContainer from './AvailableTimeContainer';
import ReservationContainer from './ReservationContainer';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';

const ConCon = styled.div`
  height: 60rem;
`;

const Container = styled.div`
  overflow-x: hidden;
  justify-content: center;

  @media (max-width: 860px) {
    flex-direction: column;
  }
`;

const LeftContainer = styled.div`
  display: inline-block;
  padding: 60px 60px;
  vertical-align: top;
  width: 843px;

  @media (max-width: 860px) {
    display: none;
  }
`;

const RightContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  height: 90vh;
  padding-top: 15px;
  padding-bottom: 15px;
  width: 498px;
  position: fixed;

  @media (max-width: 860px) {
    display: none;
  }
`;

const ProfileField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
`;

const ProfileTitle = styled.div`
  font-weight: bold;
  font-size: 3rem;
`;

const ProfileName = styled.div`
  margin-top: 3rem;
  font-weight: bold;
  font-size: 1.7rem;
`;

const Value = styled.span`
  margin-right: 0.5rem;
`;

const Review = styled.div`
  margin-top: 10rem;
`

const EditIcon = styled(FontAwesomeIcon)`
  color: #20b2aa;
  cursor: pointer;

  &:hover {
    color: #198f87;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SaveButton = styled.button`
  background-color: #20b2aa;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #198f87;
  }
`;

const ProfileCard = styled.div`
  position: relative;
  height: 11%;
  background-color: #35373a;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 20px 40px;
  color: white;
`;

const ProfileImage = styled.img`
  max-width: 100%;
  height: 63%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const ReservationCon = styled.div`
  position: relative;
  justify-content: center;
  height: 14%;
  margin-top: 1rem;
  border-radius: 10px;
  border: 1px solid #ecf0f4;
  background-color: #fff;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.08);
`;

const ReservationHidden = styled.div<{ $isContainerOpen: boolean }>`
  display: ${({ $isContainerOpen }) => ($isContainerOpen ? 'none' : 'block')};
`;

const ReservationPriceCon = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
`;

const ReservationPrice = styled.div`
  align-items: center;
  flex-direction: column;
  margin-top: 1.5rem;
  gap: 0.8rem;
  width: 100%;
  display: flex;
  padding: 0 24px;
`;

const ReservationButton = styled.button`
  background-color: #ff69b4;
  align-items: center;
  border: none;
  width: 100%;
  height: 3rem;
  font-size: 1.6rem;
  color: white;
  border-radius: 10px;
  margin: 30px 0;
  cursor: pointer;
`;

const Row = styled.div`
  margin-top: 1.3rem;
  border: 1px solid #ccc;
  height: 5rem;
`;

const MobileView = styled.div`
  display: none;

  @media (max-width: 860px) {
    display: block;
  }
`;

const LawyerProfile: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState<string>('');
  const [isContainerOpen, setIsContainerOpen] = useState<boolean>(false);
  const [isReservationOpen, setIsReservationOpen] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<number>(0);

  const handleOpen = () => {
    setIsContainerOpen(true);
  };

  const handleReservationOpen = () => {
    setIsReservationOpen(true);
  };

  const handleClose = () => {
    setIsContainerOpen(false);
    setIsReservationOpen(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const response = await axios.get(`http://localhost:8080/api/lawyer/profile/${id}`, {
          headers,
        });
        setProfile(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
          setProfile({});
        } else {
          console.error('Error fetching profile', error);
        }
      }
    };

    fetchProfile();
  }, [id]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const response = await axios.get(`http://localhost:8080/api/reviews/lawyer/${id}/average`, {
          headers,
        });
        setAverageRating(response.data);
      } catch (error) {
        console.error('평균 평점 가져오기 실패', error);
      }
    };
    if (id) {
      fetchAverageRating();
    }
  }, [id]);

  const handleEdit = (field: string) => {
    setEditField(field);
    setFieldValue(profile ? profile[field] : '');
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (editField) {
      let valueToSave: string | number = fieldValue;
      if (editField === 'phoneConsultationPrice' || editField === 'inPersonConsultationPrice') {
        valueToSave = parseFloat(fieldValue);
        if (isNaN(valueToSave)) valueToSave = 0;
      }

      const updatedProfile = { ...profile, [editField]: valueToSave, user: { id: user?.id } };
      try {
        let response;
        if (profile && Object.keys(profile).length > 0) {
          response = await axios.put(`http://localhost:8080/api/lawyer/profile/${id}`, updatedProfile, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          response = await axios.post('http://localhost:8080/api/lawyer/profile', updatedProfile, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        setProfile(response.data);
        setEditField(null);
      } catch (error) {
        console.error('Error saving profile', error);
      }
    }
  };

  const userIdNumber = id ? parseInt(id, 10) : undefined;
  const userNumberId = user?.id ? parseInt(user.id, 10) : undefined;

  return (
    <>
      <Container>
        <LeftContainer>
          <ProfileField>
            {editField === 'title' ? (
              <>
                <Input value={fieldValue || ''} onChange={(e) => setFieldValue(e.target.value)} />
                <SaveButton onClick={handleSave}>저장</SaveButton>
              </>
            ) : (
              <>
                <ProfileTitle>{profile ? profile.title : '제목'}</ProfileTitle>
                {isAuthenticated && userIdNumber === userNumberId && (
                  <EditIcon icon={faPen} onClick={() => handleEdit('title')} />
                )}
              </>
            )}
          </ProfileField>
          <ProfileField>
            {editField === 'name' ? (
              <>
                <Input value={fieldValue || ''} onChange={(e) => setFieldValue(e.target.value)} />
                <SaveButton onClick={handleSave}>저장</SaveButton>
              </>
            ) : (
              <>
                <ProfileName>{profile ? profile.name : '변호사 이름'}</ProfileName>
                {isAuthenticated && userIdNumber === userNumberId && (
                  <EditIcon icon={faPen} onClick={() => handleEdit('name')} style={{ marginTop: '2.7rem' }} />
                )}
              </>
            )}
          </ProfileField>
          <ProfileField>
            <Label>법무법인</Label>
            {editField === 'address' ? (
              <>
                <Input value={fieldValue || ''} onChange={(e) => setFieldValue(e.target.value)} />
                <SaveButton onClick={handleSave}>저장</SaveButton>
              </>
            ) : (
              <>
                <Value>{profile ? profile.address : '입력하세요'}</Value>
                {isAuthenticated && userIdNumber === userNumberId && (
                  <EditIcon icon={faPen} onClick={() => handleEdit('address')} />
                )}
              </>
            )}
          </ProfileField>
          <ProfileField>
            <Label>사무실 전화</Label>
            {editField === 'phoneNumber' ? (
              <>
                <Input value={fieldValue || ''} onChange={(e) => setFieldValue(e.target.value)} />
                <SaveButton onClick={handleSave}>저장</SaveButton>
              </>
            ) : (
              <>
                <Value>{profile ? profile.phoneNumber : '입력하세요'}</Value>
                {isAuthenticated && userIdNumber === userNumberId && (
                  <EditIcon icon={faPen} onClick={() => handleEdit('phoneNumber')} />
                )}
              </>
            )}
          </ProfileField>
          <ProfileField>
            {editField === 'content' ? (
              <>
                <Input value={fieldValue || ''} onChange={(e) => setFieldValue(e.target.value)} />
                <SaveButton onClick={handleSave}>저장</SaveButton>
              </>
            ) : (
              <>
                <Value>{profile ? profile.content : '내용을 입력해주세요'}</Value>
                {isAuthenticated && userIdNumber === userNumberId && (
                  <EditIcon icon={faPen} onClick={() => handleEdit('content')} />
                )}
              </>
            )}
          </ProfileField>
          <Review>
            <div>
              <h2>평균 평점</h2>
              <StarRating rating={averageRating} />
            </div>
            <div>
              <h2>리뷰 작성</h2>
              <ReviewForm lawyerId={id!} />
            </div>
          </Review>
          <ConCon></ConCon>
        </LeftContainer>
        <RightContainer>
          <ProfileCard>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{profile?.name}</div>
            <div>법무법인 갈림길</div>
          </ProfileCard>
          <ProfileImage src="/images/kevin.jpeg" alt="Profile" />
          <ReservationCon>
            {!isContainerOpen && (
              <ReservationHidden $isContainerOpen={isContainerOpen}>
                <ReservationPriceCon>
                  <ReservationPrice>
                    <div>15분 전화상담</div>
                    <ProfileField>
                      {editField === 'phoneConsultationPrice' ? (
                        <>
                          <Input value={fieldValue || ''} onChange={(e) => setFieldValue(e.target.value)} />
                          <SaveButton onClick={handleSave}>저장</SaveButton>
                        </>
                      ) : (
                        <>
                          <Value style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                            {profile ? profile.phoneConsultationPrice : ''}원
                          </Value>
                          {isAuthenticated && userIdNumber === userNumberId && (
                            <EditIcon icon={faPen} onClick={() => handleEdit('phoneConsultationPrice')} />
                          )}
                        </>
                      )}
                    </ProfileField>
                  </ReservationPrice>
                  <Row />
                  <ReservationPrice>
                    <div style={{ color: '#ccc' }}>20분 영상상담</div>
                    <div style={{ color: '#ccc', fontSize: '1.2rem', fontWeight: 'bold' }}>-</div>
                  </ReservationPrice>
                  <Row />
                  <ReservationPrice>
                    <div>30분 방문상담</div>
                    <ProfileField>
                      {editField === 'inPersonConsultationPrice' ? (
                        <>
                          <Input value={fieldValue || ''} onChange={(e) => setFieldValue(e.target.value)} />
                          <SaveButton onClick={handleSave}>저장</SaveButton>
                        </>
                      ) : (
                        <>
                          <Value style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                            {profile ? profile.inPersonConsultationPrice : ''}원
                          </Value>
                          {isAuthenticated && userIdNumber === userNumberId && (
                            <EditIcon icon={faPen} onClick={() => handleEdit('inPersonConsultationPrice')} />
                          )}
                        </>
                      )}
                    </ProfileField>
                  </ReservationPrice>
                </ReservationPriceCon>
                {isAuthenticated ? (
                  userIdNumber === userNumberId ? (
                    <ReservationButton onClick={handleOpen}>상담 예약시간 설정</ReservationButton>
                  ) : (
                    <ReservationButton onClick={handleReservationOpen}>상담 예약하기</ReservationButton>
                  )
                ) : (
                  <ReservationButton onClick={() => alert('상담 예약은 로그인 후 가능합니다.')}>로그인 필요</ReservationButton>
                )}
              </ReservationHidden>
            )}
            {isContainerOpen && (
              <AvailableTimeContainer
                phoneConsultationPrice={profile.phoneConsultationPrice}
                inPersonConsultationPrice={profile.inPersonConsultationPrice}
                onClose={handleClose}
              />
            )}
            {isReservationOpen && (
              <ReservationContainer
                onClose={handleClose}
                phoneConsultationPrice={profile.phoneConsultationPrice}
                inPersonConsultationPrice={profile.inPersonConsultationPrice}
              />
            )}
          </ReservationCon>
        </RightContainer>
      </Container>
      <MobileView>
        <h2>ㅎㅇ</h2>
        <p>ㅎㅇ</p>
      </MobileView>
    </>
  );
};

export default LawyerProfile;

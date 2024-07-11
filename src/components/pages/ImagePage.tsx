import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    overflow: hidden;
  }
`;

const AiResponseContainer = styled.div`
  display: flex;
`;

// 챗봇 아이콘
const ChatbotIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const AiResponseText = styled.span`
  color: #28a745;
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden;
`;

const HistoryContainer = styled.div`
  width: 300px;
  margin-top : 80px;
  background: #343a40;
  color: #fff;
  padding: 1rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ChatbotContainer = styled.div`
  padding: 2rem;
  margin-top : 80px;
  width:100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

const ChatHeader = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`;

const MessageContainer = styled.div`
  flex: 1;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 5px;
  overflow-y: auto;
`;

const WebtoonContainer = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 5px;
  height: auto;
  max-width: 100%;
  text-align: left;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const UserMessage = styled.div`
  text-align: right;
  margin-bottom: 1rem;
  color: #007bff;
`;

const AiResponse = styled.div`
  text-align: left;
  color: #28a745;
`;

const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// textarea 스타일 컴포넌트 정의
const InputField = styled.textarea`
  padding: 0.5rem 2.5rem 0.5rem 0.5rem;
  font-size: 1rem;
  height: 83px; /* 초기 높이 설정 */
  width: 100%;
  border: none;
  outline: none;
  border-radius: 5px;
  border: 1px solid rgb(201, 201, 201);
  resize: none; /* textarea 크기 조정 금지 */
`;

const IconButton = styled.button`
  position: absolute;
  right: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #007bff;
  font-size: 1.3rem;
  padding: 0;

  &:hover {
    color: #0056b3;
  }
`;

const HistoryItem = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  border-bottom: 1px solid #495057;

  &:hover {
    background: #495057;
  }
`;

const WebtoonImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  width: 200px;
  height: 200px;
  cursor: pointer;
`;

const Loader = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Modal = styled.div<{ $show: boolean }>`
  display: ${props => (props.$show ? 'block' : 'none')};
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 70%;
`;

const CloseButton = styled.span`
  color: #aaa;
  float: right;
  font-size: 35px;
  font-weight: bold;

  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

const ChatbotPage = () => {
  const [story, setStory] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string, ai: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [webtoonImage, setWebtoonImage] = useState('');
  const [modalShow, setModalShow] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);           // 로딩 시작
    try {
      const res = await fetch(
        'http://localhost:8000/api/generate-webtoon',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ story })
        }
      );

      if (!res.ok) {
        if (res.status === 400) {
          alert("오류: 유효하지 않은 입력입니다."); // 400 에러 시 알림
        } else {
          alert("오류: 서버에 문제가 발생했습니다.");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      setWebtoonImage(`data:image/png;base64,${data.webtoon}`);
      setChatHistory(prevHistory => [...prevHistory, { user: story, ai: '' }]);
    } catch (error) {
      console.error('Error:', error);
      alert("오류: 요청을 처리하는 도중 문제가 발생했습니다.");
    }

    setLoading(false);
    setStory('');
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [webtoonImage])

  return (
    <>
      <GlobalStyle />
      <Container>
        <HistoryContainer>
          <h2>History</h2>
          {chatHistory.map((chat, index) => (
            <HistoryItem key={index}>
              {chat.user}
            </HistoryItem>
          ))}
        </HistoryContainer>
        <ChatbotContainer>
          <ChatHeader>웹툰 생성</ChatHeader>
          <AiResponseContainer>
            <ChatbotIcon src='/icon/free-icon-chatbot-6014401.png' alt="Chatbot Icon" />
            <AiResponseText>안녕하세요 사연을 적어주시면 사연을 토대로 이미지를 생성해드리겠습니다</AiResponseText>
          </AiResponseContainer>
          <MessageContainer>
            {chatHistory.length === 0 && (
              <>
                <WelcomeMessage>당신의 이야기를 웹툰으로 만들어 드립니다.</WelcomeMessage>
                <WelcomeMessage>카톡 채팅처럼 영역을 가지고 웹툰을 그리고자 하는 사연의 초반 부를 적어주세요.</WelcomeMessage>
              </>
            )}
            {chatHistory.map((chat, index) => (
              <div key={index}>
                <UserMessage>{chat.user}</UserMessage>
                <AiResponse>
                  <WebtoonContainer>
                    <h2>웹툰:</h2>
                    <WebtoonImage
                      src={webtoonImage}
                      alt="웹툰"
                      onClick={() => setModalShow(true)}
                    />
                  </WebtoonContainer>
                </AiResponse>
              </div>
            ))}
            {loading && <Loader />} {/* 로딩 중일 때 로딩바 표시 */}
            <div ref={messageEndRef} />
          </MessageContainer>
          <InputForm onSubmit={handleSubmit}>
            <InputWrapper>
              <InputField
                value={story}
                onChange={handleInputChange}
                placeholder="사연을 입력해주세요."
              />
              <IconButton type="submit">
                <FaPaperPlane />
              </IconButton>
            </InputWrapper>
          </InputForm>
        </ChatbotContainer>
      </Container>
      <Modal $show={modalShow}>
        <ModalContent>
          <CloseButton onClick={() => setModalShow(false)}>&times;</CloseButton>
          <img src={webtoonImage} alt="웹툰" style={{ width: '100%' }} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatbotPage;

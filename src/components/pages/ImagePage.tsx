import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../services/auth';
import dayjs from 'dayjs'; // npm install dayjs --legacy-peer-deps

interface HistoryItem {
  id: number;
  story:string;
  reg_date: string;
  className?: string;
}

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
  position: relative;
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
  margin-top : 50px;
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
  height: 200px; /* 초기 높이 설정 */
  width: 100%;
  border: none;
  outline: none;
  border-radius: 5px;
  border: 1px solid rgb(201, 201, 201);
  resize: none; /* textarea 크기 조정 금지 */
`;

const IconButton = styled.button`
  position: absolute;
  right: 2rem;
  bottom: 1rem;  // 아이콘 버튼을 항상 입력란 오른쪽 하단에 고정
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
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;

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

const DownloadButton = styled.a`
  position: absolute;
  bottom: -10px;
  left: 144px;
  padding: 5px 10px;
  color: white;
  background-color: #007bff;
  border-radius: 5px;
  text-decoration: none;

  &:hover {
    background-color: #0056b3;
  }
`;

const HistorySection = styled.div`
  margin-bottom: 2rem;
`;

const HistoryItemStyled = styled.div`
  
  overflow: hidden; 
  display: -webkit-box; 
  -webkit-box-orient: vertical; 
  -webkit-line-clamp: 2; 
  line-height: 1.2em; /* 줄 높이를 설정 */
  max-height: 3em; /* 최대 높이 설정 */
  white-space: normal; 
  text-overflow: ellipsis; 
  
  padding: 0.5rem;
  cursor: pointer;
  border-bottom: 1px solid #495057;
  transition: transform 0.6s ease, opacity 0.6s ease;

  &:hover {
    background: #495057;
  }

  &.enter {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }

  &.enter-active {
    opacity: 1;
    transform: translateY(0);
  }

  &.exit {
    transform: translateY(0);
    opacity: 1;
  }

  &.exit-active {
    transform: translateY(20px);
    opacity: 0;
  }
`;
const ChatbotPage = () => {
//const [story, setStory] = useState('이혼을 원하는 사유를 4개의 단락으로 나눠주세요 :\n\n1. 초기 문제\n\n2. 갈등의 심화\n\n3. 결정적인 사건\n\n4. 결론 및 감정');
  const [story, setStory] = useState('');
  // 기존에 사용자가 입력한 사연을 출력 부분
  const [chatHistory, setChatHistory] = useState<{ user: string, ai: string, image: string }[]>([]);
  // 변경 된 사연출력 부분
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const { user } = useAuth();

  const fetchUserHistory = async () => {

    const userId = user ? user.id : null;             // user가 없을 경우 null로 설정

    if (userId) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:8080/api/webtoon/story?userId=${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
       
        const data: HistoryItem[] = await response.json();
        
        data.sort((a, b) => new Date(b.reg_date).getTime() - new Date(a.reg_date).getTime());
        
        setHistoryList(data.map(item => ({ ...item, className: '' })));
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    }else{

      //이미지 생성은 로그인하지 않아도 할 수 있음.
      if (!userId) {
        console.log('User is not authenticated');
        alert("비로그인 시 사연은 저장되지 않습니다.");
        //return;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
  };

  //사연 입력 후 비행기 아이콘 클릭.
  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();

    //로그인 여부 체크
    if (!user) {
      console.log('User is not authenticated');
      //return;
    }
    
    setLoading(true);                                         // 로딩 시작
    
    const userId = user ? user.id : null;
    const token = localStorage.getItem('token');
    let currentHistoryId = selectedHistoryId;

    //1.사연 저장
    if (userId && userId !== '') {
      try {
        
        const response = await fetch('http://localhost:8080/api/webtoon/stories', {
              method: 'POST'
            , headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${token}`
            }
            , body: JSON.stringify({ story: story })
        });

        // 응답이 성공적이지 않은 경우 에러 처리
        if (!response.ok) {
          const errorMessage = await response.text(); // 서버에서 반환한 오류 메시지
          console.error('Error saving story:', errorMessage);
          setLoading(false); // 로딩 종료
          return; // 에러 발생 시 함수 종료
        }

      } catch (error) {
          
        console.error('Error saving question:', error);
        setLoading(false);
      }
    } else
      console.warn('User ID is null or empty, skipping story save.');

    //2.웹툰 생성
    try {
      
      const res = await fetch(
        'http://localhost:8000/api/generate-webtoon',
        {
            method: 'POST'
          , headers: { 'Content-Type': 'application/json' }
          , body: JSON.stringify({ story })
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
      const image = `data:image/png;base64,${data.webtoon}`;
      setChatHistory(prevHistory => [...prevHistory, { user: story, ai: '', image }]);
    } catch (error) {
      console.error('Error:', error);
      alert("오류: 요청을 처리하는 도중 문제가 발생했습니다.");
    }

    setLoading(false);
    setStory('');
  };

  useEffect(() => {

    fetchUserHistory();
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, user]);

  const categorizeHistory = (historyList: HistoryItem[]) => {
    
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');
    const last7Days = today.subtract(7, 'day');
    const last30Days = today.subtract(30, 'day');

    return historyList.reduce((acc, history) => {
      
      const date = dayjs(history.reg_date);
      
      if (date.isSame(today, 'day')) {
        acc['오늘'].push(history);
      } else if (date.isSame(yesterday, 'day')) {
        acc['어제'].push(history);
      } else if (date.isAfter(last7Days)) {
        acc['지난 7일'].push(history);
      } else if (date.isAfter(last30Days)) {
        acc['지난 30일'].push(history);
      } else {
        acc['옛날'].push(history);
      }

      return acc;
    }, {
      '오늘': [],
      '어제': [],
      '지난 7일': [],
      '지난 30일': [],
      '옛날': [],
    } as Record<string, HistoryItem[]>);
  };

  const categorizedHistory = categorizeHistory(historyList);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 엔터 키 동작 방지
      handleSubmit(e as any); // 이벤트를 submit 함수에 전달
    }
  };

  const handleHistoryClick = async (historyId: number) => {
    setSelectedHistoryId(historyId);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/chatbot/history/questions?historyId=${historyId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChatHistory(
        data.map((chatBot: { ask: string; answer: string }) => ({
          user: chatBot.ask,
          ai: chatBot.answer,
        }))
      );
      await fetchUserHistory(); // 히스토리를 다시 불러와서 정렬
    } catch (error) {
      console.error('Error fetching history questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setModalShow(true);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        {/* 
        <HistoryContainer> 
        <h2>History</h2> 
          {/* <h2>히스토리</h2>
          {chatHistory.map((chat, index) => (
            <HistoryItem key={index}>
              {chat.user}
            </HistoryItem>
          ))}
        </HistoryContainer> 
        */}
        <HistoryContainer>
          <h2>히스토리</h2>
          {Object.entries(categorizedHistory).map(([category, histories]) => (
            <HistorySection key={category}>
              <h3>{category}</h3>
              {histories.map(history => (
                <HistoryItemStyled
                  key={history.id}
                  onClick={() => handleHistoryClick(history.id)}
                  className={history.className}
                >
                  {/* {history.firstChatBotAsk} */}
                  {history.story}
                </HistoryItemStyled>
              ))}
            </HistorySection>
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
                <WelcomeMessage>카톡 채팅처럼 영역을 가지고 웹툰을 그리고자 하는 사연을 적어주세요.</WelcomeMessage>
              </>
            )}
            {chatHistory.map((chat, index) => (
              <div key={index}>
                <UserMessage>{chat.user}</UserMessage>
                <AiResponse>
                  <WebtoonContainer>
                    <h2>웹툰:</h2>
                    <WebtoonImage
                      src={chat.image}
                      alt="웹툰"
                      onClick={() => handleImageClick(chat.image)}
                    />
                    <DownloadButton href={chat.image} download={`webtoon_${index + 1}.png`}>다운로드</DownloadButton>
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
                onKeyDown={handleKeyDown} // 엔터 키 입력 감지
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
          <img src={selectedImage} alt="웹툰" style={{ width: '100%' }} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatbotPage;
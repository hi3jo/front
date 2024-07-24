import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import ChatHistoryPage from './ChatHistoryPage';
import {
  GlobalStyle,
  Container,
  ChatbotContainer,
  ChatHeader,
  MessageContainer,
  WelcomeMessage,
  UserMessage,
  AiResponse,
  InputForm,
  InputWrapper,
  InputField,
  IconButton,
} from './ChatbotStyles'; // styles.js 파일을 가져옴

// props 타입 정의
interface ChatbotPageProps {
  chatHistory: { user: string, ai: string }[];
  setChatHistory: React.Dispatch<React.SetStateAction<{ user: string, ai: string }[]>>;
}

const ChatbotPage_v2: React.FC<ChatbotPageProps> = ({ chatHistory, setChatHistory }) => {
  // 질문과 AI 응답을 상태로 관리
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // 입력 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // API 호출하여 질문에 대한 응답 받기
      const res = await fetch(`http://localhost:8000/api/query-v3/?query_text=${encodeURIComponent(question)}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setAiResponse(data.answer);
      setChatHistory(prev => [...prev, { user: question, ai: data.answer }]); // 히스토리에 추가
    } catch (error) {
      console.error('Error:', error);

      if (error instanceof Error && error.message.includes('HTTP error! status: 400')) {
        alert('질문을 입력해주세요!');
      } else {
        alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }

    setQuestion(''); // 질문 필드 초기화
  };

  // AI 응답이 업데이트될 때 메시지 끝으로 스크롤
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResponse]);

  return (
    <>
      <GlobalStyle />
      <Container>
        {/* ChatHistoryPage를 렌더링하고 필요한 데이터를 props로 전달 */}
        <ChatHistoryPage chatHistory={chatHistory} setChatHistory={setChatHistory} />
        <ChatbotContainer>
          <ChatHeader>AI 챗봇 해결사 김이랑</ChatHeader>
          <MessageContainer>
            <WelcomeMessage>안녕하세요 이혼 법률 전문 AI챗봇 시스템입니다.</WelcomeMessage>
            {chatHistory.map((message, index) => (
              <div key={index}>
                <UserMessage>{message.user}</UserMessage>
                <AiResponse>{message.ai}</AiResponse>
              </div>
            ))}
            <div ref={messageEndRef} />
          </MessageContainer>
          <InputForm onSubmit={handleSubmit}>
            <InputWrapper>
              <InputField
                type="text"
                value={question}
                onChange={handleInputChange}
                placeholder="질문 해봐"
              />
              <IconButton type="submit">
                <FaPaperPlane />
              </IconButton>
            </InputWrapper>
          </InputForm>
        </ChatbotContainer>
      </Container>
    </>
  );
};

export default ChatbotPage_v2;

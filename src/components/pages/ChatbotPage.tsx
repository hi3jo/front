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
  margin-bottom: 1rem;
`;

const InputForm = styled.form`
  display: flex;
  margin-top: 1rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputField = styled.input`
  padding: 0.5rem 2.5rem 0.5rem 0.5rem;
  font-size: 1rem;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 5px;
  border: 1px solid rgb(201, 201, 201);
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

const ChatbotPage = () => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string, ai: string }[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    try {
      
      const res = await fetch(
          'http://localhost:8000/api/asked'
        , {
              method  :   'POST'
            , headers : { 'Content-Type': 'application/json'}
            , body    : JSON.stringify({ question })
          }
      );
      
      const data = await res.json();
      const aiResponse = data.answer

    if (question.trim()) {
      const aiResponse = "질문해 난 AI야.";

      setChatHistory([...chatHistory, { user: question, ai: aiResponse }]);
      setQuestion('');
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

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
          <ChatHeader>AI 챗봇 해결사</ChatHeader>
          <MessageContainer>
            {chatHistory.length === 0 && (
              <WelcomeMessage>안녕하세요 이혼 법률 전문 AI챗봇 시스템입니다.</WelcomeMessage>
            )}
            {chatHistory.map((chat, index) => (
              <div key={index}>
                <UserMessage>{chat.user}</UserMessage>
                <AiResponse>{chat.ai}</AiResponse>
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

export default ChatbotPage;

import React, { useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';

const ChatbotContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.h1`
  text-align: center;
`;

const MessageContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  bacground: #f8f9fa;
  border-radius: 5px;
  height: 400px;
  max-height:400px;
  overflow-y:auto;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  align-items: top;
  font-size: 1.2rem;
  color: #666;
`;

const UserMessage = styled.div`
  text-align: right;
  margin-bottom: 1rem;
  color:#007bff;
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

const InputField = styled.input`
  padding: 0.5rem 2.5rem 0.5rem 0.5rem;
  font-size: 1rem;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 5px;
  border:1px solid rgb(201, 201, 201);
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

const ChatbotPage = () => {
  const [ question, setQuestion] = useState('');
  const [ chatHistory, setChatHistory] = useState<{user: string, ai: string}[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()){
      const aiResponse = "질문해 난 AI야."
      setChatHistory([...chatHistory, { user: question, ai: aiResponse }]);
      setQuestion('');
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory])

  return (
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
  );
};

export default ChatbotPage;

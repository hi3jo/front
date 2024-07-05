import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';

const ChatbotContainer = styled.div`
  padding: 2rem;
  max-width: 1800px;
  height: 800px;
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
  background: #f8f9fa;
  border-radius: 5px;
  height: 600px;
  overflow-y: auto;
`;

const WebtoonContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 5px;
  height: auto;
  max-width: 100%;
  text-align: center;
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

const WebtoonImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 5px;
`;

const ChatbotPage = () => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string, ai: string }[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [webtoonImage, setWebtoonImage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        'http://localhost:8000/img/generate-webtoon',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        }
      );

      const data = await res.json();
      setWebtoonImage(`data:image/png;base64,${data.image}`);
    } catch (error) {
      console.error('Error:', error);
    }

    setQuestion('');
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [webtoonImage])

  return (
    <ChatbotContainer>
      <ChatHeader>웹툰 생성</ChatHeader>
      <MessageContainer>
        {chatHistory.length === 0 && (
          <WelcomeMessage>당신의 이야기를 웹툰으로 만들어 드립니다.</WelcomeMessage>
        )}
        {webtoonImage && (
          <WebtoonContainer>
            <h2>웹툰:</h2>
            <WebtoonImage src={webtoonImage} alt="웹툰" />
          </WebtoonContainer>
        )}
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
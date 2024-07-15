import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { ImSpinner3 } from 'react-icons/im';
import { useAuth } from '../services/auth';
import dayjs from 'dayjs'; // npm install dayjs --legacy-peer-deps

interface HistoryItem {
  id: number;
  firstChatBotAsk: string;
  lastChatBotDate: string;
  className?: string;
}

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
  margin-top: 80px;
  background: #343a40;
  color: #fff;
  padding: 1rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HistorySection = styled.div`
  margin-bottom: 2rem;
`;

const ChatbotContainer = styled.div`
  padding: 2rem;
  margin-top: 80px;
  width: 100%;
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

const LoadingMessage = styled.div`
  text-align: left;
  margin-top: 45px;
  color: #999;
  font-style: italic;
  display: flex;
  align-items: center;
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

const HistoryItemStyled = styled.div`
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

const NewHistoryButton = styled.button`
  background: #28a745;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #218838;
  }
`;

const ChatbotPage: React.FC = () => {
  const [chatBot, setChatBot] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string, ai: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const fetchUserHistory = async () => {
    if (!user) {
      console.log('User is not authenticated');
      return;
    }

    const userId = user.id;

    if (userId) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:8080/api/chatbot/history?userId=${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: HistoryItem[] = await response.json();
        data.sort((a, b) => new Date(b.lastChatBotDate).getTime() - new Date(a.lastChatBotDate).getTime());
        setHistoryList(data.map(item => ({ ...item, className: 'enter' })));

        setTimeout(() => {
          setHistoryList(prevList => prevList.map(item => ({ ...item, className: '' })));
        }, 500);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    }
  };

  useEffect(() => {
    fetchUserHistory();
  // eslint-disable-next-line
  }, [user]);

  const categorizeHistory = (historyList: HistoryItem[]) => {
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');
    const last7Days = today.subtract(7, 'day');
    const last30Days = today.subtract(30, 'day');

    return historyList.reduce((acc, history) => {
      const date = dayjs(history.lastChatBotDate);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatBot(e.target.value);
  };

  const isHistoryIdNull = (historyId: number | null): boolean => {
    return historyId === null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.log('User is not authenticated');
      return;
    }

    const userId = user.id;

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    let currentHistoryId = selectedHistoryId;

    console.log('Before checking if null, currentHistoryId:', currentHistoryId);

    if (isHistoryIdNull(currentHistoryId)) {
      try {
        const response = await fetch('http://localhost:8080/api/chatbot/create-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ firstChatBotAsk: chatBot })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        currentHistoryId = data;
        setSelectedHistoryId(currentHistoryId);

        if (currentHistoryId !== null) {
          const newHistory: HistoryItem = {
            id: currentHistoryId,
            firstChatBotAsk: chatBot,
            lastChatBotDate: new Date().toISOString(),
            className: 'enter'
          };

          setHistoryList(prevList => {
            const updatedList = [...prevList, newHistory].sort((a, b) => new Date(b.lastChatBotDate).getTime() - new Date(a.lastChatBotDate).getTime());
            return updatedList.map((item, index) => ({ ...item, className: index === 0 ? 'enter' : '' }));
          });
          setTimeout(() => {
            setHistoryList(prevList => prevList.map(item => ({ ...item, className: '' })));
          }, 500);

          console.log('New history created with id:', currentHistoryId);
        }
      } catch (error) {
        console.error('Error creating new history:', error);
      }
    }

    console.log('After checking if null, currentHistoryId:', currentHistoryId);

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ask: chatBot, user: { id: userId }, history: { id: currentHistoryId } })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const aiResponse = data.answer;
      setChatHistory(prevHistory => [...prevHistory, { user: chatBot, ai: '' }]);

      let currentIndex = -1;
      const intervalId = setInterval(() => {
        currentIndex++;
        if (aiResponse && currentIndex < aiResponse.length) {
          setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].ai += aiResponse[currentIndex];
            return newHistory;
          });
        } else {
          clearInterval(intervalId);
          setLoading(false);
        }
      }, 20);

      // Update historyList to bring the current history to the top
      setHistoryList(prevList => {
        const updatedList = prevList.map(item => {
          if (item.id === currentHistoryId) {
            return { ...item, lastChatBotDate: new Date().toISOString(), className: '' };
          }
          return item;
        }).sort((a, b) => new Date(b.lastChatBotDate).getTime() - new Date(a.lastChatBotDate).getTime());
        return updatedList;
      });

      console.log('Received response:', data.id);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    setChatBot('');
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

  const handleNewHistory = () => {
    setSelectedHistoryId(null);
    setChatHistory([]);
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
          <h2>히스토리</h2>
          <NewHistoryButton onClick={handleNewHistory}>새 채팅방</NewHistoryButton>
          {Object.entries(categorizedHistory).map(([category, histories]) => (
            <HistorySection key={category}>
              <h3>{category}</h3>
              {histories.map(history => (
                <HistoryItemStyled
                  key={history.id}
                  onClick={() => handleHistoryClick(history.id)}
                  className={history.className}
                >
                  {history.firstChatBotAsk}
                </HistoryItemStyled>
              ))}
            </HistorySection>
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
            {loading && (
              <LoadingMessage><ImSpinner3 className="spinner" /> Loading...</LoadingMessage>
            )}
            <div ref={messageEndRef} />
          </MessageContainer>
          <InputForm onSubmit={handleSubmit}>
            <InputWrapper>
              <InputField
                type="text"
                value={chatBot}
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
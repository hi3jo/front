// import React from 'react';
import React, { useState } from 'react';  // useState를 React에서 가져오기
import { ImSpinner3 } from 'react-icons/im';
import dayjs from 'dayjs';
import {
  GlobalStyle,
  Container,
  HistoryContainer,
  HistorySection,
  ChatbotContainer,
  ChatHeader,
  MessageContainer,
  WelcomeMessage,
  UserMessage,
  AiResponse,
  LoadingMessage,
  InputForm,
  InputWrapper,
  InputField,
  IconButton,
  HistoryItemStyled,
  NewHistoryButton,
} from './ChatHistoryStyle';

// 히스토리 아이템의 구조를 정의
interface HistoryItem {
  id: number;
  firstChatBotAsk: string;
  lastChatBotDate: string;
  className?: string;
}

// 컴포넌트에 전달될 props의 구조를 정의
interface ChatHistoryPageProps {
  chatHistory: { user: string, ai: string }[];
  setChatHistory: React.Dispatch<React.SetStateAction<{ user: string, ai: string }[]>>;
}

const ChatHistoryPage: React.FC<ChatHistoryPageProps> = ({ chatHistory, setChatHistory }) => {
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  // 히스토리를 카테고리화 하는 함수
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

  return (
    <>
      <HistoryContainer>
        <NewHistoryButton onClick={() => setSelectedHistoryId(null)}>새 히스토리</NewHistoryButton>
        {Object.entries(categorizedHistory).map(([category, histories]) => (
          <HistorySection key={category}>
            <h2>{category}</h2>
            {histories.map(history => (
              <HistoryItemStyled
                key={history.id}
                className={history.className}
                onClick={() => setSelectedHistoryId(history.id)}
              >
                {history.firstChatBotAsk}
              </HistoryItemStyled>
            ))}
          </HistorySection>
        ))}
      </HistoryContainer>
    </>
  );
};

export default ChatHistoryPage;

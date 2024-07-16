import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    overflow: hidden;
  }
`;

export const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden;
`;

export const HistoryContainer = styled.div`
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

export const HistorySection = styled.div`
  margin-bottom: 2rem;
`;

export const ChatbotContainer = styled.div`
  padding: 2rem;
  margin-top: 80px;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

export const ChatHeader = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`;

export const MessageContainer = styled.div`
  flex: 1;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 5px;
  overflow-y: auto;
`;

export const WelcomeMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

export const UserMessage = styled.div`
  text-align: right;
  margin-bottom: 1rem;
  color: #007bff;
`;

export const AiResponse = styled.div`
  text-align: left;
  color: #28a745;
  margin-bottom: 1rem;
`;

export const LoadingMessage = styled.div`
  text-align: left;
  margin-top: 45px;
  color: #999;
  font-style: italic;
  display: flex;
  align-items: center;
`;

export const InputForm = styled.form`
  display: flex;
  margin-top: 1rem;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const InputField = styled.input`
  padding: 0.5rem 2.5rem 0.5rem 0.5rem;
  font-size: 1rem;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 5px;
  border: 1px solid rgb(201, 201, 201);
`;

export const IconButton = styled.button`
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

export const HistoryItemStyled = styled.div`
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

export const NewHistoryButton = styled.button`
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

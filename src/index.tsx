import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import GlobalStyles from './components/styles/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';

// 모달의 앱 엘리먼트를 설정합니다.
Modal.setAppElement('#root');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <GlobalStyles />
    <App />
  </BrowserRouter>
);

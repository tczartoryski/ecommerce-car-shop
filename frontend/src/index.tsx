import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserProvider from './hooks/user/UserProvider';
import { SelectedChatProvider } from './hooks/messages/SelectedChatContext';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <UserProvider>
    <SelectedChatProvider>
      <App />
    </SelectedChatProvider>
  </UserProvider>
);

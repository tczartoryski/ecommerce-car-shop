import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserProvider from './hooks/user/UserProvider';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

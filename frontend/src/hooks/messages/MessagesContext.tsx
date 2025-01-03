import * as React from 'react';

interface MessagesContextType {
  handleDeleteConversation: () => void;
  handleViewCar: () => void;
}

const MessagesContext = React.createContext<MessagesContextType | undefined>(
  undefined
);

export const MessagesProvider: React.FC<{
  handleDeleteConversation: () => void;
  handleViewCar: () => void;
  children: React.ReactNode;
}> = ({ handleDeleteConversation, handleViewCar, children }) => {
  return (
    <MessagesContext.Provider
      value={{ handleDeleteConversation, handleViewCar }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = React.useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

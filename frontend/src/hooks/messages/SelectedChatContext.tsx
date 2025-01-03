import * as React from 'react';
import { Conversation } from '../../pages/message/types';

interface SelectedChatContextType {
  selectedChat: Conversation | null;
  setSelectedChat: (chat: Conversation) => void;
}

const SelectedChatContext = React.createContext<
  SelectedChatContextType | undefined
>(undefined);

export const SelectedChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedChat, setSelectedChat] = React.useState<Conversation | null>(
    null
  );

  return (
    <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
      {children}
    </SelectedChatContext.Provider>
  );
};

export const useSelectedChat = () => {
  const context = React.useContext(SelectedChatContext);
  if (!context) {
    throw new Error(
      'useSelectedChat must be used within a SelectedChatProvider'
    );
  }
  return context;
};

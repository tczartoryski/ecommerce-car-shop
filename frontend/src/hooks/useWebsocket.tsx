import * as React from 'react';
import { isAuthenticated } from './authentication/authUtils';

const useWebSocket = (url: string) => {
  const token: string = isAuthenticated();
  const [messages, setMessages] = React.useState<any[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const webSocketRef = React.useRef<WebSocket | null>(null);

  React.useEffect(() => {
    const webSocketUrl = `${url}?token=${token}`;
    const webSocket = new WebSocket(webSocketUrl);
    webSocketRef.current = webSocket;

    webSocket.onopen = () => {
      setIsConnected(true);
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    webSocket.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      webSocket.close();
    };
  }, [url, token]);

  const sendMessage = React.useCallback(
    (message: any) => {
      if (
        isConnected &&
        webSocketRef.current &&
        webSocketRef.current.readyState === WebSocket.OPEN
      ) {
        webSocketRef.current.send(JSON.stringify(message));
      }
    },
    [isConnected]
  );

  return { messages, sendMessage };
};

export default useWebSocket;

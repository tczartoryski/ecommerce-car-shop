import { useCallback, useEffect, useRef, useState } from 'react';
import { isAuthenticated } from './authentication/authentication';

const useWebSocket = (url: string) => {
  const token: string = isAuthenticated();
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Add the token as a query parameter to the URL
    const webSocketUrl = `${url}?token=${token}`;
    const webSocket = new WebSocket(webSocketUrl);
    webSocketRef.current = webSocket;

    webSocket.onopen = () => {
      console.log('WebSocket connection opened');
      setIsConnected(true);
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("New message received: ", message);
      //console.log('WebSocket message received:', message); // Log the message
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    webSocket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    return () => {
      webSocket.close();
    };
  }, [url, token]);

  const sendMessage = useCallback((message: any) => {
    if (isConnected && webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message); // Log the message being sent
      webSocketRef.current.send(JSON.stringify(message));
    } else {
      console.log('WebSocket is not open. Ready state:', webSocketRef.current?.readyState);
    }
  }, [isConnected]);

  return { messages, sendMessage };
};

export default useWebSocket;
'use client';

import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (
    error: Event,
    context?: { url: string; readyState: string; reconnectAttempts: number; time: string }
  ) => void;
}

interface UseWebSocketReturn {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
  lastMessage: WebSocketMessage | null;
  reconnectAttempts: number;
}

export function useWebSocket({
  url,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  onMessage,
  onOpen,
  onClose,
  onError,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const shouldReconnectRef = useRef(true);

  const connect = () => {
    try {
      const ws = new WebSocket(url);
      const stateText = (s: number) =>
        ({ 0: 'CONNECTING', 1: 'OPEN', 2: 'CLOSING', 3: 'CLOSED' } as const)[s as 0 | 1 | 2 | 3];
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setReconnectAttempts(0);
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event: CloseEvent) => {
        console.log('WebSocket disconnected', { code: event.code, reason: event.reason });
        setIsConnected(false);
        onClose?.();

        // Attempt to reconnect if we should
        if (shouldReconnectRef.current && reconnectAttempts < maxReconnectAttempts) {
          const timeout = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, reconnectInterval);
          reconnectTimeoutRef.current = timeout;
        }
      };

      ws.onerror = (event: Event) => {
        // Browsers do not expose detailed WebSocket error info for security reasons.
        // Provide actionable context instead of logging an empty Event {}
        const details = {
          url,
          readyState: stateText(ws.readyState),
          reconnectAttempts,
          time: new Date().toISOString(),
        };
        console.warn('WebSocket encountered an error. Context:', details);
        onError?.(event, details);
      };

      setSocket(ws);
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  };

  const disconnect = () => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setIsConnected(false);
  };

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const wsMessage: WebSocketMessage = {
        type: 'message',
        data: message,
        timestamp: new Date().toISOString(),
      };
      socket.send(JSON.stringify(wsMessage));
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [url]);

  return {
    socket,
    isConnected,
    sendMessage,
    lastMessage,
    reconnectAttempts,
  };
}

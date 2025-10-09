# WebSocket Setup Guide

## Overview

The POS system now includes real-time features powered by WebSocket technology:

- ✅ **Real-time Date & Time**: Updates every second automatically
- ✅ **WebSocket Infrastructure**: Ready for real-time communication
- ✅ **Order Notifications**: Sends WebSocket messages when orders are created
- ✅ **Connection Status**: Visual indicator shows online/offline status

## Current Implementation

### Real-time Features Working Now:
1. **Live Clock**: Date and time update every second
2. **WebSocket Status Panel**: Shows connection status in the cart sidebar
3. **Order Integration**: When orders are created, WebSocket messages are sent
4. **Message Handling**: Ready to receive real-time updates

### WebSocket Message Types:
- `order_update`: New orders and order status changes
- `product_update`: Product information changes
- `category_update`: Category information changes
- `inventory_update`: Stock level updates
- `system_message`: General system notifications

## Setting Up WebSocket Server

### Option 1: Node.js WebSocket Server (Recommended)

Create a simple WebSocket server:

```javascript
// websocket-server.js
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(8001, () => {
  console.log('WebSocket server running on ws://localhost:8001');
});
```

### Option 2: FastAPI WebSocket (Python)

Add WebSocket support to your existing FastAPI backend:

```python
# Add to your FastAPI app
from fastapi import WebSocket
import json

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Process message and broadcast to other clients
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")
```

### Option 3: Socket.IO (Most Robust)

For production use, consider Socket.IO:

```bash
npm install socket.io
```

```javascript
// socket-server.js
const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('order_created', (data) => {
    console.log('Order created:', data);
    // Broadcast to all clients
    io.emit('new_order', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(8001, () => {
  console.log('Socket.IO server running on http://localhost:8001');
});
```

## Testing WebSocket Connection

### 1. Start WebSocket Server
```bash
node websocket-server.js
```

### 2. Test Connection
The POS system will automatically try to connect to `ws://localhost:8001/ws`

### 3. Verify Connection
- Green dot in header = Connected
- Red dot in header = Offline
- WebSocket Status panel shows connection details

## Real-time Features

### Current Features:
- ✅ Live date/time updates
- ✅ WebSocket connection status
- ✅ Order creation notifications
- ✅ Message handling infrastructure

### Future Enhancements:
- Real-time inventory updates
- Live order status tracking
- Multi-user synchronization
- Push notifications
- Real-time sales analytics

## Configuration

### WebSocket URL Configuration:
The system automatically detects the WebSocket URL based on your API configuration:

```typescript
// In src/app/services/websocketService.ts
const wsUrl = apiUrl ? `ws://${apiUrl.replace(/^https?:\/\//, '')}/ws` : 'ws://localhost:8001/ws';
```

### Custom WebSocket URL:
To use a different WebSocket server:

```typescript
const { isConnected, sendMessage } = usePOSWebSocket('ws://your-websocket-server:port');
```

## Production Considerations

1. **SSL/TLS**: Use `wss://` for secure connections
2. **Authentication**: Add WebSocket authentication
3. **Rate Limiting**: Implement message rate limiting
4. **Scaling**: Use Redis for multi-server WebSocket scaling
5. **Monitoring**: Add WebSocket connection monitoring

## Troubleshooting

### Connection Issues:
1. Check if WebSocket server is running
2. Verify port 8001 is available
3. Check browser console for WebSocket errors
4. Ensure CORS is configured correctly

### Development Mode:
- WebSocket will show "ออฟไลน์" (offline) until server is running
- All features work normally without WebSocket
- Real-time clock works independently of WebSocket

## Next Steps

1. Set up WebSocket server using one of the options above
2. Test real-time order notifications
3. Add inventory management WebSocket updates
4. Implement real-time sales dashboard
5. Add push notifications for new orders

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;

  private users: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.users.set(userId, client);
      console.log(`User connected: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.users.forEach((socket, userId) => {
      if (socket === client) {
        this.users.delete(userId);
        console.log(`User disconnected: ${userId}`);
      }
    });
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody()
    data: {
      toUserId: string;
      fromUserId: string;
      message: string;
    },
  ) {
    const { toUserId, fromUserId, message } = data;
    console.log(`Message from ${fromUserId} to ${toUserId}: ${message}`);

    // Emit message to recipient if connected
    const recipientSocket = this.users.get(toUserId);
    if (recipientSocket) {
      recipientSocket.emit('receiveMessage', {
        fromUserId,
        message,
        timestamp: Date.now(),
      });
    }

    // Optionally, echo back to sender to confirm sent message
    const senderSocket = this.users.get(fromUserId);
    if (senderSocket) {
      senderSocket.emit('messageSent', {
        toUserId,
        message,
        timestamp: Date.now(),
      });
    }
  }

  // New: Client joins a specific group room
  @SubscribeMessage('joinGroup')
  handleJoinGroup(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.groupId);
    console.log(`User joined group ${data.groupId}`);
  }

  // New: Send message to all clients in the group room
  @SubscribeMessage('sendGroupMessage')
  handleGroupMessage(
    @MessageBody()
    data: {
      groupId: string;
      fromUserId: string;
      message: string;
    },
  ) {
    const { groupId, fromUserId, message } = data;
    console.log(`Group ${groupId} message from ${fromUserId}: ${message}`);

    // Broadcast message to all sockets in the group room
    this.server.to(groupId).emit('groupMessage', {
      fromUserId,
      message,
      timestamp: Date.now(),
    });
  }
}

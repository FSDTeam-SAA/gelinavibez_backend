// import { Server, Socket } from 'socket.io';
// import Message from '../modules/message/message.model';

// const users: { userId: string; socketId: string }[] = [];

// export const socketHandler = (io: Server) => {
//   io.on('connection', (socket: Socket) => {
//     console.log('✅ User connected:', socket.id);

//     // Add user to online list
//     socket.on('addUser', (userId: string) => {
//       if (!users.find((u) => u.userId === userId)) {
//         users.push({ userId, socketId: socket.id });
//       }
//       io.emit('getUsers', users);
//     });

//     // Send message
//     socket.on(
//       'sendMessage',
//       async ({ senderId, receiverId, conversationId, message }) => {
//         const newMsg = await Message.create({
//           senderId,
//           receiverId,
//           conversationId,
//           message,
//         });

//         const receiver = users.find((u) => u.userId === receiverId);
//         if (receiver) {
//           io.to(receiver.socketId).emit('receiveMessage', newMsg);
//         }
//       },
//     );

//     // Disconnect
//     socket.on('disconnect', () => {
//       const index = users.findIndex((u) => u.socketId === socket.id);
//       if (index !== -1) users.splice(index, 1);
//       console.log('❌ User disconnected:', socket.id);
//       io.emit('getUsers', users);
//     });
//   });
// };

import { Server, Socket } from 'socket.io';
import Message from '../modules/message/message.model';

const users: { userId: string; socketId: string }[] = [];

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('✅ User connected:', socket.id);

    // Add user to online list
    socket.on('addUser', (userId: string) => {
      // Fix: Update socketId if user reconnects
      const existingUserIndex = users.findIndex((u) => u.userId === userId);
      if (existingUserIndex !== -1) {
        users[existingUserIndex].socketId = socket.id;
      } else {
        users.push({ userId, socketId: socket.id });
      }
      console.log('👤 User added:', userId, 'Total:', users.length);
      io.emit('getUsers', users);
    });

    // Send message
    socket.on(
      'sendMessage',
      async ({ senderId, receiverId, conversationId, message }) => {
        try {
          const newMsg = await Message.create({
            senderId,
            receiverId,
            conversationId,
            message,
          });

          // Fix: Convert Mongoose document to plain object
          const messageData = newMsg.toObject();

          // Send to receiver
          const receiver = users.find((u) => u.userId === receiverId);
          if (receiver) {
            io.to(receiver.socketId).emit('receiveMessage', messageData);
          }

          // Fix: Send confirmation to sender
          socket.emit('messageSent', messageData);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('messageError', { error: 'Failed to send message' });
        }
      },
    );

    // Disconnect
    socket.on('disconnect', () => {
      const index = users.findIndex((u) => u.socketId === socket.id);
      if (index !== -1) users.splice(index, 1);
      console.log('❌ User disconnected:', socket.id);
      io.emit('getUsers', users);
    });
  });
};

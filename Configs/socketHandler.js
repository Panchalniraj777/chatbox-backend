const socketIo = require('socket.io');

const UserModel = new (require('../Models/User.model'))();
const ChatModel = new (require('../Models/Chat.model'))();

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', socket => {
        socket.on('user_connected', async user => {
            try {
                if (!user) return;
                const userData = await UserModel.findOne({ _id: user });

                if (!userData) return;

                userData.socket_id = socket.id;
                userData.is_online = true;

                await userData.save();

                io.emit('user_connected', userData);
            } catch (error) {
                console.error('Error connecting user:', error);
            }
        });

        socket.on('send_message', async data => {
            console.log('Message received:', data);
            const { sender_id, receiver_id, receiver_socket_id, message } = data;
            try {
                const filter = {
                    $or: [
                        { sender_id },
                        { receiver_id },
                        { receiver_id: sender_id },
                        { sender_id: receiver_id },
                    ],
                };

                const update = {
                    $set: {
                        sender_id,
                        receiver_id,
                        updated_at: new Date(),
                    },
                };

                const chat = await ChatModel.findOneAndUpdate(filter, update);

                const messages = await ChatModel.createMessage({
                    chat_id: chat._id,
                    sender_id,
                    message,
                });

                await messages.save();

                io.to(receiver_socket_id).emit('receive_message', messages);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', async user => {
            try {
                const userData = await UserModel.findOne({ socket_id: socket.id });
                if (!userData) return;

                userData.socket_id = null;
                userData.is_online = false;

                await userData.save();
                io.emit('user_disconnected', user);
            } catch (error) {
                console.error('Error disconnecting user:', error);
            }
        });
    });

    return io;
}

module.exports = { initializeSocket, io };

const ChatModel = new (require('../Models/Chat.model'))();

module.exports = class {
    getChats = async (request, response) => {
        try {
            const { sender_id, receiver_id } = request.body;

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
                },
            };

            const chat = await ChatModel.findOneAndUpdate(filter, update);
            const messages = await ChatModel.findChatMessage({
                chat_id: chat?._id,
            });

            response.handler.success(undefined, {
                chat,
                messages,
            });
        } catch (error) {
            console.log('error', error);
            return response.handler.serverError(error);
        }
    };

    createMessage = async (request, response) => {
        try {
            const { sender_id, receiver_id, message } = request.body;

            const filter = {
                sender_id,
                receiver_id,
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
                receiver_id,
                message,
            });

            response.handler.success(undefined, {
                chat,
                messages,
            });
        } catch (error) {
            console.log('error', error);
            return response.handler.serverError(error);
        }
    };
};

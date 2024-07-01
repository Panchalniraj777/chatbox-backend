const { chat: chatSchema, chat_messages: chatMessageSchema } = require('../Database/Schemas');
const { ObjectId } = require('mongodb');

module.exports = class {
    async findOneAndUpdate(filter, update) {
        return chatSchema
            .findOneAndUpdate(filter, update, { upsert: true })
            .populate('sender_id', 'name email')
            .populate('receiver_id', 'name email');
    }

    async findOne(payload) {
        return chatSchema.findOne(payload);
    }

    async find(filter) {
        return chatSchema.find(filter);
    }

    async findChatMessage(filter) {
        return chatMessageSchema
            .find(filter)
            .populate('sender_id', 'name email');
    }

    async create(user) {
        const { name, email, phone, password } = user;

        return await userSchema({
            name,
            email,
            phone,
            password,
        });
    }

    async createMessage(payload) {
        const { chat_id, message, sender_id } = payload;

        return await chatMessageSchema({
            chat_id,
            message,
            sender_id,
        });
    }

    async updateSocketId(id, socket_id) {
        return userSchema.updateOne(
            {
                id: ObjectId(id),
            },
            {
                $set: {
                    socket_id,
                },
            }
        );
    }
};

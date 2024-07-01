const Schema = mongoose.Schema;

const ChatMessagesSchema = new Schema(
    {
        chat_id: {
            type: Schema.Types.ObjectId,
            ref: 'chat',
            required: true,
        },
        sender_id: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

module.exports = mongoose.model('chat_messages', ChatMessagesSchema);

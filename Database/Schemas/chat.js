const Schema = mongoose.Schema;

const ChatSchema = new Schema(
    {
        sender_id: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        receiver_id: {
            type: Schema.Types.ObjectId,
            ref: 'users',
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

module.exports = mongoose.model('chat', ChatSchema);

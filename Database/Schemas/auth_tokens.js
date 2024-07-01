const Schema = mongoose.Schema;

const AuthTokenSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users",
        },
        token: {
            type: String,
            required: true,
        },
        expires_at: {
            type: Schema.Types.Date,
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

module.exports = mongoose.model('auth_tokens', AuthTokenSchema);

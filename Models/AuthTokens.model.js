const { auth_tokens: authTokenSchema } = require('../Database/Schemas');

module.exports = class {
    async findOne(payload) {
        return await authTokenSchema.findOne(payload);
    }

    async create(payload) {
        const { user_id, token, expires_at } = payload;

        return await authTokenSchema({
            user_id,
            token,
            expires_at,
        });
    }

    async destroy(user_id) {
        return await authTokenSchema.destroy({
            where: {
                user_id,
            },
        });
    }
};

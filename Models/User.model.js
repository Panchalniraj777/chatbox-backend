const { users: userSchema } = require('../Database/Schemas');
const { ObjectId } = require('mongodb');

module.exports = class {
    async findOne(payload) {
        return userSchema.findOne(payload);
    }

    async find(payload) {
        return userSchema.find(payload);
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

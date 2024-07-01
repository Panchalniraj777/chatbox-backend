const UserModel = new (require('../Models/User.model'))();
const { convertToSnakeCase } = require('../Utils/helpers');

module.exports = class {
    getProfile = async (request, response) => {
        try {
            const { id } = request.query;
            const user = await UserModel.findOne({ id });

            if (!user) {
                return response.handler.notFound('VALIDATION.NOT_EXISTS.USER');
            }

            response.handler.success(user);
        } catch (error) {
            return response.handler.serverError(error);
        }
    };

    getUsers = async (request, response) => {
        try {
            const { user } = request.loginUser;
            const { _id } = user;
            const users = await UserModel.find({ _id: { $nin: { _id } } });
            response.handler.success(undefined, users);
        } catch (error) {
            console.log('error', error);
            return response.handler.serverError(error);
        }
    };
};

const bcrypt = require('bcryptjs');
const moment = require('moment');

const UserModel = new (require('../Models/User.model'))();
const AuthTokenModel = new (require('../Models/AuthTokens.model'))();

const { SALT_ROUND, STATUS_CODES } = require('../Configs/constants');
const { convertToSnakeCase, generateAccessToken, generateOtp } = require('../Utils/helpers');

module.exports = class {
    signUp = async (request, response) => {
        try {
            const { name, email, phone, password } = convertToSnakeCase(request?.body);

            const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
            const existingUser = await UserModel.findOne({
                name,
                email,
                phone,
            });

            if (existingUser) {
                if (existingUser?.email === email) {
                    return response.handler.conflict('VALIDATION.EXISTS.EMAIL');
                }
            }
            const user = await UserModel.create({
                name,
                email,
                phone,
                password: hashedPassword,
            });

            user.save();

            response.handler.success({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            });
        } catch (error) {
            if (
                error.code === STATUS_CODES.MONGODB_DUPLICATE_KEY_CODE &&
                'email' in error.keyValue
            ) {
                return response.handler.conflict('VALIDATION.EXISTS.EMAIL');
            }
            return response.handler.serverError(error);
        }
    };

    SignIn = async (request, response) => {
        try {
            const { email, password } = convertToSnakeCase(request?.body);

            const user = await UserModel.findOne({ email });

            if (!user) {
                return response.handler.notFound('VALIDATION.NOT_EXISTS.USER');
            }

            const isPasswordValid = await bcrypt.compare(password, user?.password);

            if (!isPasswordValid) {
                return response.handler.unauthorized();
            }

            const accessToken = generateAccessToken(user);

            const expiresAt = moment
                .utc()
                .add(process.env.ACCESS_TOKEN_EXPIRE, 'milliseconds')
                .toISOString();

            const authToken = await AuthTokenModel.create({
                user_id: user.id,
                token: accessToken,
                expires_at: expiresAt,
            });

            authToken.save();

            return response.handler.success(undefined, {
                authToken,
                user: {
                    id: user.id,
                    userName: user.name,
                    email: user.email,
                    phone: user.phone,
                },
            });
        } catch (error) {
            console.error(error);
            response.handler.serverError(error);
        }
    };

    logout = async (request, response) => {
        try {
            const { user, token } = request.loginUser;

            if (!token) {
                return response.handler.notFound('VALIDATION.NOT_EXISTS.TOKEN');
            }

            if (!user) {
                return response.handler.notFound('VALIDATION.NOT_EXISTS.USER');
            }

            const tokenData = await AuthTokenModel.findOne({
                where: { token: token },
            });

            if (!tokenData) {
                return response.handler.notFound('VALIDATION.NOT_EXISTS.TOKEN');
            }

            await AuthTokenModel.destroy(user.id);

            response.handler.success();
        } catch (error) {
            console.log(error);
            return res.error({}, 'Something went wrong. Please try again after sometime');
        }
    };
};

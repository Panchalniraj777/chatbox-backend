const jwt = require('jsonwebtoken');

function verifyToken(request, response, next) {
    const accessToken = request.headers['accesstoken'];

    if (!accessToken) {
        return response.handler.badRequest({}, 'TOKEN.NOT_FOUND');
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
            response.handler.unauthorized({ token });
        } else {
            request.loginUser = authData;
            request.loginUser.accessToken = accessToken;
            next();
        }
    });
}

module.exports = verifyToken;

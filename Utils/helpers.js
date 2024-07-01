const snakeCase = require('lodash.snakecase');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');

/* 
GENERATE RANDOM NUMBER FROM SPECIFIED RANGE
*/
function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

/* 
CHECK IF OBJECT IS EMPTY
*/
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

/* 
CHECK IF TWO ARRAYS ARE EQUAL
*/
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i)  if (a[i] !== b[i]) return false;

    return true;
}

const containsObject = (arr) => {
    return arr.every(function (item) {
        return typeof item === "object";
    });
}

const convertToSnakeCase = (data, updateObj) => {
    if (Array.isArray(data)) {
        return convertListOfKeysToSnakeCase(data);
    }
    else {
        if (!Object.keys(data).length) return {};

        const update = updateObj || {};

        Object.keys((data)).forEach((key) => {
            if (key) {
                if (Array.isArray(data[key])) {
                    if (containsObject(data[key])) {
                        update[snakeCase(key)] = convertListOfKeysToSnakeCase(data[key]);
                    }
                    else {
                        update[snakeCase(key)] = data[key];
                    }
                }
                else if (typeof data[key] === 'object') {
                    update[snakeCase(key)] = convertToSnakeCase(data[key]);
                }
                else {
                    if (key === "_id") {
                        update[key] = data[key];
                    }
                    else {
                        update[snakeCase(key)] = data[key];
                    }
                }
            }
        })
        return update;
    }
}

const generateAccessToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    });
};

const generateToken = async (userId, type) => {
    const resetToken = randomstring.generate({
        length: 40,
        charset: 'alphanumeric',
    });

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    // Store the reset token and its expiration time in the database
    await resetTokensModel.add({
        user_id: userId,
        token: resetToken,
        expires_at: expirationTime?.toString(),
        type: type,
    });

    return resetToken;
};


module.exports = {
    generateRandom,
    isEmpty,
    arraysEqual,
    convertToSnakeCase,
    generateAccessToken,
    generateToken,
}
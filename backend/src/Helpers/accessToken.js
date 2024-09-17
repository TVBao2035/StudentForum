const jwt= require('jsonwebtoken');
require('dotenv').config();
const accessToken = (user) => {
    return jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
    }, process.env.ACCESS_TOKEN, {expiresIn: process.env.EXPIRE_TOKEN});
}

module.exports = accessToken;
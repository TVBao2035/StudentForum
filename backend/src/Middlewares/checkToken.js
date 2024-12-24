require('dotenv').config();
const jwt = require('jsonwebtoken');
const checkToken = (req, res, next) => {
    const tokenHeader = req.header?.authorization?.split(' ')[1];
    const tokenCookie = req.cookies?.accessToken;
    const token = tokenHeader ? tokenHeader : tokenCookie;

    if(!token){
        return res.status(401).json({
            status: 401,
            message: `Please Sign In!`
        })
    }

    try {
       const decode = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = {
            decode,
            token
        }
        next();
    } catch (error) {
        res.status(401).json({
            status: 401,
            message: `Token Is Invalid`
        })
    }
}

module.exports = checkToken;
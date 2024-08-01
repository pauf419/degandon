const Response = require("../responses/response")
const tokenService = require('../services/token-service');
const rid = require("random-id")

module.exports = function (socket, next) { 
    try {    
        const authorizationHeader = socket.handshake.headers.authorization;
        socket.uid = rid(9, "aA0")
        if (!authorizationHeader) {
            return next();
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next();
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next();
        }
   
        socket.user = userData;  
        next();
    } catch (e) { 
        console.error(e)
        return next();
    }
};
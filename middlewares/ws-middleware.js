const Response = require("../responses/response")
const tokenService = require('../services/token-service');

module.exports = function (socket, next) { 
    try {    
        const authorizationHeader = socket.handshake.headers.authorization;
        if (!authorizationHeader) {
            return next(Response.Unauthorized());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(Response.Unauthorized());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(Response.Unauthorized());
        }
   
        socket.user = userData;  
        next();
    } catch (e) { 
        console.error(e)
        return next(Response.Unauthorized());
    }
};
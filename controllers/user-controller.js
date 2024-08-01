const authService = require('../services/auth-service');
const Response = require("../responses/response")
const logic = require("../utils/logic");
const userService = require('../services/user-service');

class AuthController {
    async get(req, res, next) {
        try {
            const {id} = req.params;
            if(logic.regexobject({id})) throw Response.NotFound("User with the same id was not found")
            const userData = await userService.get(id)
            return next(userData)
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new AuthController();
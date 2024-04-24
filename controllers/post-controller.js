const logic = require("../utils/logic")
const Response = require("../responses/response")
const postService = require("../services/post-service");

class PostController {
    async getComments(req, res, next) {
        try {
            const {refer} = req.query
            const res = await postService.getComments(refer)
            return next(res)
        } catch (e) { 
            console.error(e)
            return next(e) 
        }
    } 

    async addComment(req, res, next) {
        try {
            const {username, comment, refer} = req.body;
            if(logic.regexobject({username, comment, refer})) throw Response.BadRequest("Expected data not validated")
            const res = await postService.addComment(
                username, 
                comment,
                refer
            )
            return next(res)
        } catch (e) {  
            console.error(e)
            return next(e) 
        } 
    }
}

module.exports = new PostController()
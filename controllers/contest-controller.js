const contestService = require("../services/contest-service")
const logic = require("../utils/logic")
const Response = require("../responses/response")


class ContestController {

    async getCurrentTask(req, res, next) {
        try {
            const res = await contestService.getCurrentTask(req.user.id)
            return next(res)
        } catch(e) {
            console.error(e) 
            next(e)
        }
    }

    async answerCurrentTask(req, res, next) {
        try {
            const {answer} = req.body
            if(logic.regexobject({answer})) throw Response.BadRequest("Expected data not validated")
            const res = await contestService.passCurrentTask(req.user.id, answer)
            return next(res)
        } catch(e) {
            console.error(e) 
            next(e)
        }
    }
}

module.exports = new ContestController()
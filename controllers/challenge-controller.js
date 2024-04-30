const challengeService = require("../services/challenge-service")
const logic = require("../utils/logic")
const Response = require("../responses/response")

class ChallengeController {
    async getChallenge(req, res, next) {
        try {
            const {id} = req.query 
            const res = await challengeService.getChallenge(id)
            return next(res)
        } catch(e) {
            console.error(e) 
            return next(e)
        }
    }

    async createChallenge(req, res, next) {
        try {
            const {title, code} = req.body
            if(logic.regexobject({title, code})) throw Response.BadRequest("Expected data not validated")
            const res = await challengeService.createChallenge(title, code) 
            return next(res)
        } catch(e) {
            console.error(e) 
            next(e)
        }
    }

    async getChallengers(req, res, next) {
        try {
            const {id} = req.query
            const res = await challengeService.getChallengers(id)
            return next(res)
        } catch(e) {
            console.error(e) 
            next(e)
        }
    }

    async createChallenger(req, res, next) { 
        try {
            const {refer, title} = req.body
            const {preview} = req.files 
            if(logic.regexobject({title, preview})) throw Response.BadRequest("Expected data not validated")
            const res = await challengeService.createChallenger(refer, title, preview)
            return next(res)
        } catch(e) {
            console.error(e) 
            next(e)
        }
    }

    async vote(req, res, next) {
        try {
            const {id, refer} = req.body 
            if(logic.regexobject({id, refer})) throw Response.BadRequest("Expected data not validated")
            const res = await challengeService.vote(id, refer, req.headers['x-forwarded-for'] || req.socket.remoteAddress)
            return next(res)
        } catch(e) {
            console.error(e) 
            next(e)
        }
    }
}

module.exports = new ChallengeController()
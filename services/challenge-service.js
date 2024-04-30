const Response = require("../responses/response") 
const randomId = require("random-id")
const pool = require("../db/postgress-pool")
const fileService = require("./file-service")
const ChallengerDto = require("../dtos/challenger-dto")

class ChallengeService {

    async verifyReferExistence(id = null) {
        if(!id) return await pool.query("SELECT * FROM challenge WHERE current = true").then(data => data.rows[0])
        return await pool.query("SELECT * FROM challenge WHERE id = $1", [id]).then(data => data.rows[0])
    }
    
    async getChallenge(id) {
        const challenge = await this.verifyReferExistence(id)
        if(!challenge) return Response.NotFound()
        return Response.OK(challenge)
    }

    async createChallenge(title, code) {
        if(code !== process.env.ADMIN_CODE) return Response.Unauthorized()
        await pool.query("UPDATE challenge SET current = false WHERE current = true")
        const challenge = await pool.query("INSERT INTO challenge(title, timestamp, id, current) VALUES($1, $2, $3, $4) RETURNING *", [
            title, 
            Date.now(),
            randomId(12, "aA0"),
            true
        ]).then(data => data.rows[0])
        return Response.OK(challenge)
    }

    async getChallengers(id) {
        const current = await this.verifyReferExistence(id)
        if(!current) return Response.NotFound()
        const challengers = await pool.query("SELECT * FROM challenger WHERE refer = $1 ORDER BY votes DESC", [current.id]).then(data => data.rows)
        return Response.OK(challengers.map(el => new ChallengerDto(el)))
    }

    async createChallenger(refer, title, preview) {
        var preview_ = fileService.saveFile(preview)
        const challenge = await this.verifyReferExistence(refer)
        if(!challenge) return Response.NotFound()
        const challenger = await pool.query("INSERT INTO challenger(id, refer, preview, votes, title) VALUES($1, $2, $3, $4, $5) RETURNING *", [randomId(8, "aA0"), challenge.id, preview_, 0, title]).then(data => data.rows[0])
        return Response.OK(challenger)
    }

    async vote(id, refer, ip) {
        const challenge = await this.verifyReferExistence(refer) 
        if(!challenge) return Response.NotFound()
        const challengerex = await pool.query("SELECT * FROM challenger WHERE id = $1", [id]).then(data => data.rows[0])
        if(!challengerex) return Response.NotFound()
        const voteex = await pool.query("SELECT * FROM vote WHERE ip = $1 AND refer = $2", [ip, refer]).then(data => data.rows[0])
        if(voteex) return Response.Unauthorized("You already voted, pidoras.")
        const vote = await pool.query("INSERT INTO vote(id, refer, ip, challenger, timestamp) VALUES($1, $2, $3, $4, $5) RETURNING *", [
            randomId(8, "aA0"),
            refer, 
            ip, 
            refer, 
            Date.now()
        ])
        await pool.query("UPDATE challenger SET votes = $1 WHERE id = $2", [challengerex.votes+1, challengerex.id])
        return Response.OK(vote)
    }
}

module.exports = new ChallengeService()
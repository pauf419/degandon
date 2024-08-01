const pool = require("../db/postgress-pool")
const UserDto = require("../dtos/user-dto")
const Response = require("../responses/response")

class UserService {
    async get(id) {
        const user = await pool.query("SELECT * FROM usr WHERE id = $1", [id]).then(data => data.rows[0])
        if(!user) return Response.NotFound("User with the same id was not found")
        return Response.OK(new UserDto(user))
    }   
}

module.exports = new UserService() 
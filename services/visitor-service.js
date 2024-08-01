const pool = require("../db/postgress-pool")

class VisitorService {
    async registerVisitor(ip) {
        const visitorEx = await pool.query("SELECT * FROM visitor WHERE ip = $1", [ip]).then(data => data.rows[0])
    }   
}

module.exports = new VisitorService() 
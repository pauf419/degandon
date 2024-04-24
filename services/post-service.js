
const Response = require("../responses/response") 
const randomId = require("random-id")
const pool = require("../db/postgress-pool")
 
class PostService {
  async getComments(refer) {
    if(!refer || refer === "root") return Response.OK(await pool.query(`SELECT * FROM comment WHERE refer = 'root' ORDER BY timestamp ASC`).then(data => data.rows.reverse()))
    const referex = await pool.query("SELECT * FROM comment WHERE id = $1", [refer]).then(data => data.rows[0])
    if(!referex) return Response.NotFound("Хули ты там делаешь?")
    const refers = await pool.query("SELECT * FROM comment WHERE refer = $1", [refer]).then(data => data.rows)
  
    return Response.OK(refers)
  }

  async addComment(username, comment, refer) {
    if(refer === "root") return Response.OK(await pool.query("INSERT INTO comment(id, username, comment, timestamp, isadmin, refers, refer) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *", [randomId(12, "aA0"), username, comment, Date.now(), false, 0, refer]).then(data => data.rows[0]))
    const referex = await pool.query("SELECT * FROM comment WHERE id = $1", [refer]).then(data => data.rows[0])
    if(!referex) return Response.NotFound("Хули ты там делаешь?")
    await pool.query("UPDATE comment SET refers = $1 WHERE id = $2 RETURNING *", [referex.refers+1, refer])
    const nrefer = await pool.query("INSERT INTO comment(id, username, comment, timestamp, isadmin, refers, refer) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *", [randomId(12, "aA0"), username, comment, Date.now(), false, 0, refer]).then(data => data.rows[0])
    return Response.OK(nrefer)
  }   
}

module.exports = new PostService()
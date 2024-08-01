const rid= require("random-id");
const pool = require("../db/postgress-pool")
const Response = require("../responses/response")



class ContestService {
    async getCurrentTask(id, raw=false) {
        const passed = await pool.query("SELECT * FROM answer ORDER BY index DESC").then(data => data.rows)
        var task;
        if(!passed.length) task = await pool.query("SELECT * FROM task WHERE index = 0").then(data => data.rows[0])
        else task = await pool.query("SELECT * FROM task WHERE index = $1", [passed[0].index+1]).then(data => data.rows[0])
        console.log(task)
        if(raw) return task 
        return Response.OK(task) 
    }

    async passCurrentTask(id, answer) {
        const task = await this.getCurrentTask(id, true)
        const answerd = await pool.query("INSERT INTO answer(id, refer, value, timestamp, urefer, index) VALUES($1, $2, $3, $4, $5, $6) RETURNING *", [
            rid(8, "aA0"),
            task.id, 
            answer,   
            Date.now(),
            id, 
            task.index
        ]).then(data => data.rows[0])
        return Response.OK({
            ...answerd, 
            refer: task
        })
    }
}

module.exports = new ContestService()
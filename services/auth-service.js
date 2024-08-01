const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const pool = require("../db/postgress-pool")
const Response = require("../responses/response")
const randomId = require("random-id");
const RegsessionDto = require('../dtos/regsession-dto');
const fileService = require('./file-service');
const jdenticon = require("jdenticon")
const rid = require("random-id")
const logic = require("../utils/logic")

class AuthService {
    async registration(email, password, username) {
        const candidate = await pool.query("SELECT * FROM usr WHERE email = $1", [email]).then(data => data.rows[0])
        if (candidate) {
            throw Response.BadRequest(`User with same email already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 3);

        const vCode = randomId(8, "0")
        const regsession = await pool.query(
            "INSERT INTO regsession(id, timestamp, email, password, username, code) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [
                uuid.v4(), 
                Date.now(),
                email, 
                hashPassword,       
                username,
                vCode
            ]
        ).then(data => data.rows[0])
        await mailService.sendActivationMail(email, vCode);

        return {
            session: new RegsessionDto(regsession)
        }
    }

    async update(user, username, description, pfp) {
        const exists = await pool.query("SELECT * FROM usr WHERE username = $1", [username]).then(data => data.rows[0])
        if(exists && exists.id !== user.id) throw Response.BadRequest("User with the same username already exists.")
        if(pfp) pfp = fileService.saveFile(pfp)
        else pfp = user.pfp.replace(`${process.env.STATIC_URL}`, ``)
        const OKVs = logic.generateSQLUpdateValues({username, description, pfp}, [
            "username", 
            "description",
            "pfp"
        ])
        const {script, vars} = logic.generateSQLUpdateScript("usr", OKVs, user.id)
        const usr = await pool.query(script, vars).then(data => data.rows[0])
        if(!usr) return Response.OK()
        return Response.OK(new UserDto(usr))
    }   

    async verify(id, vCode) {
        const session = await pool.query(
            "SELECT * FROM regsession WHERE id = $1",
            [id]
        ).then(data => data.rows[0])
        if(session.code !== vCode) throw Response.BadRequest("Verification codes do not match")
        const user = await pool.query(
            "INSERT INTO usr(email, password, username, id, pfp) VALUES($1, $2, $3, $4, $5) RETURNING *", 
            [
                session.email, 
                session.password, 
                session.username,
                uuid.v4(),
                fileService.saveFileBuf(jdenticon.toPng(rid(10, 'aA0'), 500, {
                    padding: 0
                }))
            ]
        ).then(data => data.rows[0])
        const userDto = new UserDto(user) 
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        await pool.query("DELETE FROM regsession WHERE id = $1", [id])
        return {
            ...tokens, 
            user: userDto
        }
    }

    async destroyRegsession(id) {
        const session = await pool.query("DELETE FROM regsession WHERE id = $1 RETURNING *", [id]).then(data => data.rows[0])
        return {
            success: true
        }
    }

    async login(email, password) {
        const user = await pool.query("SELECT * FROM usr WHERE email = $1", [email]).then(data => data.rows[0])
        if (!user) {
            throw Response.BadRequest('User with same email or password was not found')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) throw Response.BadRequest("User with same email or password was now found")
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return Response.OK(token);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw Response.Unauthorized("Unable to authorize user data")
        }
        
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw Response.Unauthorized("Unable to authorize user data")
        }
        const user = await pool.query("SELECT * FROM usr WHERE id = $1", [userData.id]).then(data => data.rows[0])
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto}); 

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }
}

module.exports = new AuthService();
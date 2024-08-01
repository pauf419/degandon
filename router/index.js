const Router = require('express').Router;
const router = new Router();
const postRouter = require("./post-router")
const challengeRouter = require("./challenge-router")
const chatRouter = require("./chat-router.js")
const authRouter = require("./auth-router")
const userRouter = require("./user-router.js")
const contestRouter = require("./contest-router")

router.use("/", postRouter)
router.use("/auth", authRouter)
router.use("/challenge", challengeRouter)
router.use("/chat", chatRouter)
router.use("/user", userRouter)
router.use("/contest", contestRouter)

module.exports = router
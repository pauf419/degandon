const Router = require('express').Router;
const router = new Router();
const postRouter = require("./post-router")
const challengeRouter = require("./challenge-router")
const chatRouter = require("./chat-router.js")

router.use("/", postRouter)
router.use("/challenge", challengeRouter)
router.use("/chat", chatRouter)

module.exports = router
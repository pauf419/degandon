const Router = require('express').Router;
const router = new Router();
const postRouter = require("./post-router")

router.use("/", postRouter)

module.exports = router
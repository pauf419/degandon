const contestController = require("../controllers/contest-controller")
const authMiddleware = require('../middlewares/auth-middleware');


const Router = require('express').Router;
const router = new Router();

router.get('/task', authMiddleware, contestController.getCurrentTask)
router.post('/task', authMiddleware, contestController.answerCurrentTask)

module.exports = router
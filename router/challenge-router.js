const challengeController = require('../controllers/challenge-controller');


const Router = require('express').Router;
const router = new Router();

router.get('/', challengeController.getChallenge)
router.post('/', challengeController.createChallenge)
router.get("/challenger", challengeController.getChallengers)
router.post("/challenger", challengeController.createChallenger)
router.post("/vote", challengeController.vote)

module.exports = router
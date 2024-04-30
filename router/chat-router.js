const chatController = require('../controllers/chat-controller');



const Router = require('express').Router;
const router = new Router();

router.get('/', chatController.getMessages)
router.post('/', chatController.createMessage)

module.exports = router
const Router = require('express').Router;
const router = new Router();
const postController = require('../controllers/post-controller');

router.get('/comment', postController.getComments)
router.post('/comment', postController.addComment)

module.exports = router
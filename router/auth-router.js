const Router = require('express').Router;
const authController = require('../controllers/auth-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    authController.registration
);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify', authController.verify);
router.post('/session/destroy', authController.destroyRegSession)
router.get('/refresh', authController.refresh);
router.post("/update", authMiddleware, authController.update)

module.exports = router
const express = require('express');
const router = express.Router();
const newsController = require('../app/controllers/newsController')
const registerController = require('../app/controllers/registerController')
const loginController = require('../app/controllers/loginController')
const logoutController = require('../app/controllers/logoutController')
// const authenticateToken = require('../app/middleware/authMiddleware');
const sessionMiddleware  = require('../app/middleware/sessionMiddleware');




router.get('/help', newsController.help);
router.get('/ticket', newsController.ticket);
router.get('/ticketmanager', newsController.tiketManager  );
router.get('/register', registerController.register);
router.get('/login', loginController.login);
router.get('/logout', logoutController.logout);
router.post('/login/signin', loginController.signin);
router.get('/', newsController.index);
router.get('/account', newsController.account);
// router.get('/:slug', newsController.read);


module.exports = router;
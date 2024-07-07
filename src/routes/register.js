const express = require('express');
const router = express.Router();
const RegisterController = require('../app/controllers/registerController')





router.post('/signup', RegisterController.signup);
router.post('/sendemail/forgot', RegisterController.forgot);
router.post('/sendemail/confirm', RegisterController.confirm);
router.post('/changepass', RegisterController.changepass);
router.get('/account/changepassword', RegisterController.viewchange);
router.get('/sendemail', RegisterController.sendemail);
router.get('/sendemail/nextpass', RegisterController.nextpass);


module.exports = router;
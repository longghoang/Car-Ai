const express = require('express');
const router = express.Router();
const storedController = require('../app/controllers/storedController')
const sessionMiddleware = require('../app/middleware/sessionMiddleware');





router.get('/blogs',storedController.stored);
router.get('/park',storedController.park);





module.exports = router;
const express = require('express');
const router = express.Router();
const BlogsController = require('../app/controllers/scanAndSaveFace')
// const authenticateToken = require('../app/middleware/authMiddleware')
// const sessionMiddleware = require('../app/middleware/sessionMiddleware')






router.get('/uicapture', BlogsController.captureface);
router.post('/create', BlogsController.saveFaceData);
router.post('/compare', BlogsController.compareData);






module.exports = router;
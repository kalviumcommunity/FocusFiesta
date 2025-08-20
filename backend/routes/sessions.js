const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const sessionController = require('../controllers/sessionController');

router.post('/', authMiddleware, sessionController.logSession);
router.get('/', authMiddleware, sessionController.getSessions);
router.get('/stats', authMiddleware, sessionController.getStats);

module.exports = router;

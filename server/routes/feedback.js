import express from 'express';
import { sendFeedback, testEmailConfig } from '../controllers/feedbackController.js';

const router = express.Router();

// POST /api/feedback - Send feedback email
router.post('/', sendFeedback);

// GET /api/feedback/test - Test email configuration
router.get('/test', testEmailConfig);

export default router;

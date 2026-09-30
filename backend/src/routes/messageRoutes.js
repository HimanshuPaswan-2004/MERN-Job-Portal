import express from 'express';
import { sendMessage, getMessages, getConversations } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/:otherUserId', getMessages);

export default router;

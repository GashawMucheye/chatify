import { Router } from 'express';

import { protectRoute } from '../middleware/protectRoute.js';
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from '../controllers/messageController.js';
const router = Router();
router.use(protectRoute);
router.get('/contacts', getAllContacts);
router.get('/chats', getChatPartners);
router.get('/:id', getMessagesByUserId);
router.post('/send/:id', sendMessage);

export default router;

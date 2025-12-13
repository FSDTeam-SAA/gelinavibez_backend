import express from 'express';
import { conversationController } from './conversation.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';

const router = express.Router();

// 🔹 Create conversation between logged-in user and receiver
router.post(
  '/',
  auth(userRole.contractor, userRole.user,userRole.superadmin,userRole.admin),
  conversationController.createConversation,
);

// 🔹 Get all conversations of logged-in user
router.get(
  '/',
  auth(userRole.contractor, userRole.user,userRole.superadmin,userRole.admin),
  conversationController.getAllConversations,
);

export const conversationRoutes = router;

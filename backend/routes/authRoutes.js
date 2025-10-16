import { Router } from 'express';
const router = Router();
import { protectRoute } from '../middleware/protectRoute.js';
import {
  checkUser,
  login,
  logout,
  signup,
  updateProfile,
} from '../controllers/authController.js';

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', protectRoute, updateProfile);
router.get('/check', protectRoute, checkUser);

export default router;

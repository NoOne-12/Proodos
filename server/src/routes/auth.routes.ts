import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  oauthGoogle,
  oauthGoogleCallback,
  oauthGitHub,
  oauthGitHubCallback,
  oauthLinkedIn,
  oauthLinkedInCallback,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Standard Auth
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);

// Password Reset Flow
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// OAuth Initiation
router.get('/google', oauthGoogle);
router.get('/google/callback', oauthGoogleCallback);

router.get('/github', oauthGitHub);
router.get('/github/callback', oauthGitHubCallback);

router.get('/linkedin', oauthLinkedIn);
router.get('/linkedin/callback', oauthLinkedInCallback);

export default router;

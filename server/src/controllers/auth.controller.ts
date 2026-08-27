import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator';
import { AppError } from '../utils/errors';
import { sendPasswordResetEmail } from '../services/email.service';
import {
  generateOAuthState,
  getGoogleAuthUrl,
  getGoogleUserInfo,
  getGitHubAuthUrl,
  getGitHubUserInfo,
  getLinkedInAuthUrl,
  getLinkedInUserInfo,
} from '../services/oauth.service';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

const setTokenCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const getCallbackUrl = (req: Request, provider: string): string => {
  if (process.env.AUTH_CALLBACK_URL) {
    return `${process.env.AUTH_CALLBACK_URL.replace(/\/$/, '')}/${provider}/callback`;
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}/api/auth/${provider}/callback`;
};

const getClientUrl = (): string => {
  return (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
};

// ==========================================
// Standard Email / Password Authentication
// ==========================================

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
    });

    const token = generateToken(user.id);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.passwordHash) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);

    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user.id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { name, avatar, currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    let passwordHash = user.passwordHash;
    if (newPassword) {
      if (user.passwordHash) {
        if (!currentPassword) {
          throw new AppError('Current password is required to set a new password', 400);
        }
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
          throw new AppError('Current password does not match', 400);
        }
      }
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(newPassword, salt);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name !== undefined ? name : user.name,
        avatar: avatar !== undefined ? avatar : user.avatar,
        passwordHash,
      },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true },
    });

    res.json({ success: true, data: updated, message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Forgot Password & Reset Password
// ==========================================

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond with a generic success message to prevent user enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Invalidate existing unused tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Generate high-entropy random token and store its SHA-256 hash
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const resetUrl = `${getClientUrl()}/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      throw new AppError('Invalid or expired password reset link. Please request a new one.', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update user password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
    ]);

    res.json({
      success: true,
      message: 'Your password has been successfully updated. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// OAuth Initiation & Callbacks
// ==========================================

export const oauthGoogle = (req: Request, res: Response, next: NextFunction) => {
  try {
    const state = generateOAuthState('google');
    res.cookie('oauth_state_google', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    const redirectUri = getCallbackUrl(req, 'google');
    const authUrl = getGoogleAuthUrl(state, redirectUri);
    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
};

export const oauthGitHub = (req: Request, res: Response, next: NextFunction) => {
  try {
    const state = generateOAuthState('github');
    res.cookie('oauth_state_github', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000,
    });

    const redirectUri = getCallbackUrl(req, 'github');
    const authUrl = getGitHubAuthUrl(state, redirectUri);
    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
};

export const oauthLinkedIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    const state = generateOAuthState('linkedin');
    res.cookie('oauth_state_linkedin', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000,
    });

    const redirectUri = getCallbackUrl(req, 'linkedin');
    const authUrl = getLinkedInAuthUrl(state, redirectUri);
    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
};

// Universal OAuth Handler helper
const handleOAuthCallback = async (
  req: Request,
  res: Response,
  provider: 'google' | 'github' | 'linkedin',
  getUserInfo: (code: string, redirectUri: string) => Promise<{
    providerAccountId: string;
    email: string;
    name: string;
    avatar?: string;
  }>
) => {
  const clientUrl = getClientUrl();
  const stateCookieName = `oauth_state_${provider}`;
  const savedState = req.cookies?.[stateCookieName];
  const { code, state, error, error_description } = req.query;

  res.clearCookie(stateCookieName);

  if (error || !code) {
    const errorMsg = encodeURIComponent(String(error_description || error || 'Authentication was cancelled.'));
    return res.redirect(`${clientUrl}/login?oauth_error=${errorMsg}`);
  }

  // Validate state
  if (!savedState || savedState !== state) {
    const errorMsg = encodeURIComponent('Invalid OAuth security state. Please try again.');
    return res.redirect(`${clientUrl}/login?oauth_error=${errorMsg}`);
  }

  try {
    const redirectUri = getCallbackUrl(req, provider);
    const userInfo = await getUserInfo(String(code), redirectUri);

    // 1. Check if OAuth account already exists
    const existingOAuth = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: userInfo.providerAccountId,
        },
      },
      include: { user: true },
    });

    let user = existingOAuth?.user;

    if (!user) {
      // 2. Check if a user with this email already exists
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      if (existingUserByEmail) {
        user = existingUserByEmail;
        // Update avatar if not set
        if (!user.avatar && userInfo.avatar) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { avatar: userInfo.avatar },
          });
        }
      } else {
        // 3. Create new user
        user = await prisma.user.create({
          data: {
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.avatar,
          },
        });
      }

      // Link OAuth account
      await prisma.oAuthAccount.create({
        data: {
          userId: user.id,
          provider,
          providerAccountId: userInfo.providerAccountId,
        },
      });
    }

    // Issue authentication token
    const token = generateToken(user.id);
    setTokenCookie(res, token);

    // Redirect to frontend with token for seamless client store synchronization
    return res.redirect(`${clientUrl}/login?oauth_token=${token}`);
  } catch (err: any) {
    console.error(`[OAuth ${provider} Error]:`, err);
    const errorMsg = encodeURIComponent(err.message || 'OAuth authentication failed.');
    return res.redirect(`${clientUrl}/login?oauth_error=${errorMsg}`);
  }
};

export const oauthGoogleCallback = (req: Request, res: Response) => {
  return handleOAuthCallback(req, res, 'google', getGoogleUserInfo);
};

export const oauthGitHubCallback = (req: Request, res: Response) => {
  return handleOAuthCallback(req, res, 'github', getGitHubUserInfo);
};

export const oauthLinkedInCallback = (req: Request, res: Response) => {
  return handleOAuthCallback(req, res, 'linkedin', getLinkedInUserInfo);
};

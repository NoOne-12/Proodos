import crypto from 'crypto';

interface OAuthUserInfo {
  providerAccountId: string;
  email: string;
  name: string;
  avatar?: string;
}

// Generate state for CSRF protection
export const generateOAuthState = (provider: string): string => {
  const random = crypto.randomBytes(24).toString('hex');
  return `${provider}:${random}`;
};

export const getGoogleAuthUrl = (state: string, redirectUri: string): string => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('GOOGLE_CLIENT_ID is not configured');

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    state,
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

export const getGoogleUserInfo = async (code: string, redirectUri: string): Promise<OAuthUserInfo> => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  // Exchange code for token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || 'Failed to retrieve Google access token');
  }

  // Get user profile
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userData = await userRes.json();
  if (!userRes.ok || !userData.email) {
    throw new Error('Failed to retrieve Google user profile');
  }

  return {
    providerAccountId: userData.id,
    email: userData.email,
    name: userData.name || userData.email.split('@')[0],
    avatar: userData.picture,
  };
};

export const getGitHubAuthUrl = (state: string, redirectUri: string): string => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) throw new Error('GITHUB_CLIENT_ID is not configured');

  const rootUrl = 'https://github.com/login/oauth/authorize';
  const options = {
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    state,
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

export const getGitHubUserInfo = async (code: string, redirectUri: string): Promise<OAuthUserInfo> => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth credentials not configured');
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || 'Failed to retrieve GitHub access token');
  }

  // Get user info
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'User-Agent': 'Proodos-OAuth',
    },
  });

  const userData = await userRes.json();
  if (!userRes.ok) {
    throw new Error('Failed to retrieve GitHub user profile');
  }

  // Email might be private, fetch user/emails
  let primaryEmail = userData.email;
  if (!primaryEmail) {
    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'Proodos-OAuth',
      },
    });
    if (emailsRes.ok) {
      const emails = await emailsRes.json();
      const primary = emails.find((e: any) => e.primary && e.verified) || emails[0];
      if (primary) primaryEmail = primary.email;
    }
  }

  if (!primaryEmail) {
    throw new Error('No verified email found on GitHub account');
  }

  return {
    providerAccountId: String(userData.id),
    email: primaryEmail,
    name: userData.name || userData.login || primaryEmail.split('@')[0],
    avatar: userData.avatar_url,
  };
};

export const getLinkedInAuthUrl = (state: string, redirectUri: string): string => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) throw new Error('LINKEDIN_CLIENT_ID is not configured');

  const rootUrl = 'https://www.linkedin.com/oauth/v2/authorization';
  const options = {
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: 'openid profile email',
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

export const getLinkedInUserInfo = async (code: string, redirectUri: string): Promise<OAuthUserInfo> => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('LinkedIn OAuth credentials not configured');
  }

  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || 'Failed to retrieve LinkedIn access token');
  }

  // OpenID UserInfo endpoint
  const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userData = await userRes.json();
  if (!userRes.ok || !userData.email) {
    throw new Error('Failed to retrieve LinkedIn user profile');
  }

  return {
    providerAccountId: userData.sub,
    email: userData.email,
    name: userData.name || `${userData.given_name || ''} ${userData.family_name || ''}`.trim() || userData.email.split('@')[0],
    avatar: userData.picture,
  };
};

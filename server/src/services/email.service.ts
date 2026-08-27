import nodemailer from 'nodemailer';

interface SendResetEmailOptions {
  to: string;
  name: string;
  resetUrl: string;
}

export const sendPasswordResetEmail = async ({ to, name, resetUrl }: SendResetEmailOptions): Promise<boolean> => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  // If SMTP configuration is provided, send real email via transporter
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || '587', 10),
        secure: parseInt(SMTP_PORT || '587', 10) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: SMTP_FROM || `"PROODOS" <noreply@proodos.app>`,
        to,
        subject: 'Reset Your PROODOS Password',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #FBF9F4; color: #202522; border-radius: 16px; border: 1px solid #D6D0C2;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; width: 48px; height: 48px; background-color: #23483A; color: #FBF9F4; border-radius: 12px; font-size: 24px; font-weight: bold; line-height: 48px; font-family: serif;">Π</div>
              <h1 style="color: #23483A; font-family: serif; font-size: 24px; margin: 12px 0 4px;">PROODOS</h1>
              <p style="color: #737873; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Personal Learning OS</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #344039;">
              We received a request to reset your password for your PROODOS account. Click the button below to set a new password:
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="background-color: #23483A; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; display: inline-block;">Reset Password</a>
            </div>
            
            <p style="font-size: 12px; color: #737873; line-height: 1.5;">
              This link is valid for <strong>1 hour</strong> and can only be used once. If you did not request this password reset, please safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #D6D0C2; margin: 24px 0;" />
            <p style="font-size: 11px; color: #737873; word-break: break-all;">
              Or copy and paste this URL into your browser:<br />
              <a href="${resetUrl}" style="color: #C87552;">${resetUrl}</a>
            </p>
          </div>
        `,
      });
      return true;
    } catch (err) {
      console.error('[EMAIL ERROR] Failed to send email via SMTP transporter:', err);
      // In production with credentials set, fail honestly
      if (process.env.NODE_ENV === 'production') {
        return false;
      }
    }
  }

  // Development fallback log (when SMTP not configured yet)
  console.log('====================================================');
  console.log('[PROODOS PASSWORD RESET EMAIL]');
  console.log(`To: ${to} (${name})`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log('====================================================');
  return true;
};

import nodemailer from 'nodemailer';

/**
 * Configure email transporter
 * Supports:
 * - Custom SMTP (Host, Port, User, Pass)
 * - Gmail App Passwords
 * - Resend API (via HTTP if RESEND_API_KEY is provided)
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Check if standard Gmail service is specified
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  return null;
}

/**
 * Generates an executive, mobile-friendly HTML email template for password reset
 */
export function generatePasswordResetEmailHtml({ name, email, resetLink }) {
  const currentYear = new Date().getFullYear();
  const recipientName = name ? name.split(' ')[0] : 'Valued Customer';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Ragusma Farms NG®</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f5f0; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px border #e2dcd0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0e2a1b 0%, #1b4d30 100%); padding: 36px 30px; text-align: center; border-bottom: 3px solid #d4af37;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background-color: #d4af37; color: #0e2a1b; font-size: 24px; font-weight: bold; margin-bottom: 12px;">
                      🌾
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; font-family: Georgia, serif;">
                      Ragusma<span style="color: #68d391; font-weight: 400;">Farms</span>
                    </h1>
                    <p style="margin: 6px 0 0; color: #f6e05e; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
                      Nigeria • Project Green Economy
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 36px 30px;">
              <h2 style="margin: 0 0 16px; color: #1a202c; font-size: 20px; font-weight: 700;">
                Password Reset Request
              </h2>
              
              <p style="margin: 0 0 16px; color: #4a5568; font-size: 15px;">
                Hello <strong>${recipientName}</strong>,
              </p>

              <p style="margin: 0 0 24px; color: #4a5568; font-size: 14px; line-height: 1.6;">
                We received a request to reset the password for your account associated with <span style="color: #1b4d30; font-weight: 600;">${email}</span>. Please click the button below to choose a new password.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; background-color: #1b4d30; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 34px; border-radius: 12px; box-shadow: 0 4px 14px rgba(27, 77, 48, 0.35); text-align: center;">
                      Reset My Password &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Alert Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0; background-color: #fefcbf; border-left: 4px solid #d69e2e; border-radius: 8px;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0; color: #744210; font-size: 12px; font-weight: 600;">
                      ⏳ Security Notice: This password reset link is valid for <strong>1 hour</strong>. After that, you will need to request a new link.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Fallback Direct Link -->
              <p style="margin: 24px 0 8px; color: #718096; font-size: 12px;">
                If the button above does not work, copy and paste this secure link directly into your browser:
              </p>
              <div style="background-color: #edf2f7; padding: 12px; border-radius: 8px; font-size: 11px; word-break: break-all; color: #2d3748; font-family: monospace;">
                ${resetLink}
              </div>

              <!-- Security Advice -->
              <p style="margin: 28px 0 0; color: #a0aec0; font-size: 12px; border-top: 1px solid #edf2f7; padding-top: 20px;">
                If you did not request a password reset, you can safely ignore this email. Your current password remains active and your account is secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 24px 36px; text-align: center; border-top: 1px solid #edf2f7;">
              <p style="margin: 0 0 6px; color: #718096; font-size: 12px; font-weight: 600;">
                Ragusma Farms NG®
              </p>
              <p style="margin: 0 0 8px; color: #a0aec0; font-size: 11px;">
                Minna, Niger State, Nigeria &bull; +234 813 583 4368 &bull; info@ragusmafarms.com
              </p>
              <p style="margin: 0; color: #cbd5e0; font-size: 10px;">
                &copy; ${currentYear} Ragusma Farms. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends a password reset email
 */
export async function sendPasswordResetEmail({ to, name, resetLink }) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || '"Ragusma Farms NG®" <noreply@ragusmafarms.com>';
  const subject = 'Reset Your Password - Ragusma Farms NG®';
  const html = generatePasswordResetEmailHtml({ name, email: to, resetLink });
  const text = `Hello ${name || 'Valued Customer'},\n\nWe received a request to reset your password for Ragusma Farms.\n\nPlease use the link below to reset your password (valid for 1 hour):\n${resetLink}\n\nIf you did not request this, you can safely ignore this email.\n\nBest regards,\nRagusma Farms NG® Team`;

  // 1. Try Resend if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          html,
          text
        })
      });

      const resData = await res.json();
      if (res.ok) {
        console.log('✓ Password reset email sent via Resend API to:', to);
        return { success: true, messageId: resData.id, provider: 'resend' };
      } else {
        console.warn('Resend API returned error:', resData);
      }
    } catch (err) {
      console.warn('Resend delivery error:', err.message);
    }
  }

  // 2. Try SMTP Transporter (Nodemailer)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
      });
      console.log('✓ Password reset email sent via SMTP to:', to, info.messageId);
      return { success: true, messageId: info.messageId, provider: 'smtp' };
    } catch (err) {
      console.error('SMTP delivery error:', err.message);
    }
  }

  // 3. Fallback when SMTP is not yet configured: Log to server output
  console.log('----------------------------------------------------');
  console.log(`[PASSWORD RESET DISPATCH] To: ${to}`);
  console.log(`Reset URL: ${resetLink}`);
  console.log('To send real emails, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in Vercel or .env');
  console.log('----------------------------------------------------');

  return {
    success: true,
    simulated: true,
    note: 'Email dispatched (SMTP credentials not yet configured)'
  };
}

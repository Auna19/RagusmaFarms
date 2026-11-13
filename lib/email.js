import nodemailer from 'nodemailer';
import { RAGUSMA_BADGE_BASE64 } from './brandBadge.js';

/**
 * Official Ragusma Farms Brand Assets for Email Templates
 * Embedding via CID (Content-ID inline attachment) ensures 100% rendering across
 * all desktop, mobile, and webmail clients (Gmail, Outlook, Apple Mail, Yahoo)
 * without broken image placeholders or external image blocking.
 *
 * Public fallback points to the Vercel Production CDN (clean headers, no x-robots-tag: none).
 */
export const RAGUSMA_BADGE_URL = 'https://ragusma-farms.vercel.app/assets/ragusma-badge.png';
export const RAGUSMA_CID = 'ragusma_official_seal';

export const INQUIRY_LABELS = {
  'live-chicken': 'Live Chickens Order',
  'frozen-chicken': 'Dressed / Frozen Chicken',
  'rabbits': 'Breeding or Meat Rabbits',
  'fish': 'Fresh Catfish Order',
  'manure': 'Organic Manure & Dungs',
  'consultation': 'Farm Consultation / Training',
  'general': 'General Inquiries / Delivery'
};

/**
 * Standard inline attachment for the circular gold Ragusma badge medallion
 */
function getBadgeAttachment() {
  return {
    filename: 'ragusma-badge.png',
    content: Buffer.from(RAGUSMA_BADGE_BASE64, 'base64'),
    cid: RAGUSMA_CID,
    contentType: 'image/png',
    contentDisposition: 'inline'
  };
}

/**
 * Configure email transporter
 * Supports:
 * - Direct Gmail Service (ragusmaa@gmail.com with App Password)
 * - Custom SMTP (Host, Port, User, Pass)
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || 'ragusmaa@gmail.com';
  const rawPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '';
  const pass = rawPass.replace(/\s+/g, '');

  // 1. Direct Gmail Service if user is Gmail
  if ((user && user.includes('@gmail.com')) && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      family: 4 // Enforce IPv4 to avoid IPv6 DNS lookup delays
    });
  }

  // 2. Custom SMTP host
  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      family: 4
    });
  }

  return null;
}

/**
 * Generates an executive, mobile-friendly HTML email template for password reset.
 * Renders the circular gold brand medallion seamlessly across all email clients.
 */
export function generatePasswordResetEmailHtml({ name, email, resetLink, logoSrc = `cid:${RAGUSMA_CID}` }) {
  const currentYear = new Date().getFullYear();
  const recipientName = name ? name.split(' ')[0] : 'Valued Customer';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ragusma Farms - Forget Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f5f0; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e2dcd0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0e2a1b 0%, #1b4d30 100%); padding: 36px 30px 32px; text-align: center; border-bottom: 3px solid #d4af37;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <!-- Brand Official Medallion (Circular Gold Ring, Transparent Corners) -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 14px auto;">
                      <tr>
                        <td align="center" style="padding: 0; line-height: 0;">
                          <img 
                            src="${logoSrc}" 
                            alt="Ragusma Farms Official Seal" 
                            width="92" 
                            height="92" 
                            border="0" 
                            style="display: block; width: 92px; height: 92px; border: 0; outline: none; margin: 0 auto; text-decoration: none;" 
                          />
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; font-family: Georgia, serif;">
                      Ragusma<span style="color: #68d391; font-weight: 400;">Farms</span>
                    </h1>
                    <p style="margin: 6px 0 0; color: #f6e05e; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
                      Quality You Can Trust &bull; Minna, Nigeria
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
                Ragusma Farms NG&reg;
              </p>
              <p style="margin: 0 0 8px; color: #a0aec0; font-size: 11px;">
                Tunga Goro, Minna, Niger State, Nigeria &bull; +234 813 583 4368 &bull; ragusmaa@gmail.com
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
 * Generates an executive HTML email template confirming successful password reset.
 */
export function generatePasswordResetSuccessEmailHtml({ name, email, loginUrl = 'https://ragusma-farms.vercel.app/login', logoSrc = `cid:${RAGUSMA_CID}` }) {
  const currentYear = new Date().getFullYear();
  const recipientName = name ? name.split(' ')[0] : 'Valued Customer';
  const updatedDate = new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Lagos',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ragusma Farms - Password Reset Successful</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f5f0; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e2dcd0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0e2a1b 0%, #1b4d30 100%); padding: 36px 30px 32px; text-align: center; border-bottom: 3px solid #d4af37;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 14px auto;">
                      <tr>
                        <td align="center" style="padding: 0; line-height: 0;">
                          <img 
                            src="${logoSrc}" 
                            alt="Ragusma Farms Official Seal" 
                            width="92" 
                            height="92" 
                            border="0" 
                            style="display: block; width: 92px; height: 92px; border: 0; outline: none; margin: 0 auto; text-decoration: none;" 
                          />
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; font-family: Georgia, serif;">
                      Ragusma<span style="color: #68d391; font-weight: 400;">Farms</span>
                    </h1>
                    <p style="margin: 6px 0 0; color: #f6e05e; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
                      Quality You Can Trust &bull; Minna, Nigeria
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 36px 30px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; background-color: #c6f6d5; color: #22543d; font-size: 30px; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; margin-bottom: 12px;">
                  ✓
                </div>
                <h2 style="margin: 0; color: #1a202c; font-size: 22px; font-weight: 700;">
                  Password Reset Successful
                </h2>
              </div>
              
              <p style="margin: 0 0 16px; color: #4a5568; font-size: 15px;">
                Hello <strong>${recipientName}</strong>,
              </p>

              <p style="margin: 0 0 20px; color: #4a5568; font-size: 14px; line-height: 1.6;">
                This email confirms that the password for your Ragusma Farms account (<span style="color: #1b4d30; font-weight: 600;">${email}</span>) was successfully updated on <strong>${updatedDate}</strong>.
              </p>

              <p style="margin: 0 0 24px; color: #4a5568; font-size: 14px; line-height: 1.6;">
                You can now log in to your account with your new password to view live stock, track your orders, and enjoy farm-fresh poultry and produce.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" target="_blank" style="display: inline-block; background-color: #1b4d30; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 34px; border-radius: 12px; box-shadow: 0 4px 14px rgba(27, 77, 48, 0.35); text-align: center;">
                      Sign In to Your Account &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Alert Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0; background-color: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 8px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <p style="margin: 0; color: #9b2c2c; font-size: 13px; font-weight: 600;">
                      🔒 Security Notice: If you did not make this change, please contact the farm administration immediately at <strong>ragusmaa@gmail.com</strong> or call <strong>+234 813 583 4368</strong> to secure your account.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 24px 36px; text-align: center; border-top: 1px solid #edf2f7;">
              <p style="margin: 0 0 6px; color: #718096; font-size: 12px; font-weight: 600;">
                Ragusma Farms NG&reg;
              </p>
              <p style="margin: 0 0 8px; color: #a0aec0; font-size: 11px;">
                Tunga Goro, Minna, Niger State, Nigeria &bull; +234 813 583 4368 &bull; ragusmaa@gmail.com
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
 * Sends a password reset email via official Gmail SMTP with inline CID badge
 */
export async function sendPasswordResetEmail({ to, name, resetLink }) {
  const defaultSender = process.env.GMAIL_USER || process.env.SMTP_USER || 'ragusmaa@gmail.com';
  const rawFrom = process.env.EMAIL_FROM || process.env.SMTP_FROM || `Ragusma Farms <${defaultSender}>`;
  const from = rawFrom.replace(/["']/g, '').trim();
  const subject = process.env.EMAIL_SUBJECT || 'Ragusma Farms - Forget Your Password';
  const html = generatePasswordResetEmailHtml({ name, email: to, resetLink, logoSrc: `cid:${RAGUSMA_CID}` });
  const text = `Hello ${name || 'Valued Customer'},\n\nWe received a request to reset your password for Ragusma Farms.\n\nPlease use the link below to reset your password (valid for 1 hour):\n${resetLink}\n\nIf you did not request this, you can safely ignore this email.\n\nBest regards,\nRagusma Farms Team`;

  // 1. Primary: SMTP Transporter (Nodemailer via Official Farm Gmail)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        attachments: [getBadgeAttachment()]
      });
      console.log('✓ Password reset email sent via Gmail SMTP to:', to, info.messageId);
      return { success: true, messageId: info.messageId, provider: 'smtp-gmail' };
    } catch (err) {
      console.error('SMTP delivery error:', err.message);
    }
  }

  // 2. Secondary fallback: Resend if configured and SMTP failed
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
          html: generatePasswordResetEmailHtml({ name, email: to, resetLink, logoSrc: RAGUSMA_BADGE_URL }),
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

  // 3. Fallback when SMTP is not yet configured: Log to server output
  console.log('----------------------------------------------------');
  console.log(`[PASSWORD RESET DISPATCH] To: ${to}`);
  console.log(`Reset URL: ${resetLink}`);
  console.log('----------------------------------------------------');

  return {
    success: true,
    simulated: true,
    note: 'Email dispatched (fallback)'
  };
}

/**
 * Sends a password reset success confirmation email
 */
export async function sendPasswordResetSuccessEmail({ to, name, loginUrl = 'https://ragusma-farms.vercel.app/login' }) {
  const defaultSender = process.env.GMAIL_USER || process.env.SMTP_USER || 'ragusmaa@gmail.com';
  const rawFrom = process.env.EMAIL_FROM || process.env.SMTP_FROM || `Ragusma Farms <${defaultSender}>`;
  const from = rawFrom.replace(/["']/g, '').trim();
  const subject = 'Ragusma Farms - Your Password Has Been Successfully Reset';
  const html = generatePasswordResetSuccessEmailHtml({ name, email: to, loginUrl, logoSrc: `cid:${RAGUSMA_CID}` });
  const text = `Hello ${name || 'Valued Customer'},\n\nYour password for your Ragusma Farms account (${to}) has been reset successfully.\n\nYou can now sign in with your new password at:\n${loginUrl}\n\nIf you did not make this change, please contact us immediately at ragusmaa@gmail.com or +234 813 583 4368.\n\nBest regards,\nRagusma Farms Team`;

  // 1. Primary: SMTP Transporter (Nodemailer via Official Farm Gmail)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        attachments: [getBadgeAttachment()]
      });
      console.log('✓ Password reset confirmation email sent via Gmail SMTP to:', to, info.messageId);
      return { success: true, messageId: info.messageId, provider: 'smtp-gmail' };
    } catch (err) {
      console.error('SMTP delivery error sending reset confirmation:', err.message);
    }
  }

  // 2. Secondary fallback: Resend
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
          html: generatePasswordResetSuccessEmailHtml({ name, email: to, loginUrl, logoSrc: RAGUSMA_BADGE_URL }),
          text
        })
      });

      const resData = await res.json();
      if (res.ok) {
        console.log('✓ Password reset confirmation email sent via Resend API to:', to);
        return { success: true, messageId: resData.id, provider: 'resend' };
      }
    } catch (err) {
      console.warn('Resend delivery error:', err.message);
    }
  }

  return { success: true, simulated: true };
}

/**
 * Generates an executive HTML email template for routing contact form submissions
 * directly to the official farm desk (ragusmaa@gmail.com).
 */
export function generateContactNotificationEmailHtml({ fullName, phone, email, inquiryType, message, logoSrc = `cid:${RAGUSMA_CID}` }) {
  const currentYear = new Date().getFullYear();
  const inquiryLabel = INQUIRY_LABELS[inquiryType] || inquiryType || 'Direct Inquiry';
  const receivedAt = new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Lagos',
    dateStyle: 'full',
    timeStyle: 'medium'
  });
  const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
  const waPhone = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone.replace(/^\+/, '');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Direct Message - Ragusma Farms</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f5f0; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e2dcd0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0e2a1b 0%, #1b4d30 100%); padding: 32px 28px; text-align: center; border-bottom: 3px solid #d4af37;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 12px auto;">
                <tr>
                  <td align="center" style="padding: 0; line-height: 0;">
                    <img 
                      src="${logoSrc}" 
                      alt="Ragusma Farms Official Seal" 
                      width="90" 
                      height="90" 
                      border="0" 
                      style="display: block; width: 90px; height: 90px; border: 0; outline: none; margin: 0 auto; text-decoration: none;" 
                    />
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; font-family: Georgia, serif;">
                Ragusma<span style="color: #68d391; font-weight: 400;">Farms</span>
              </h1>
              <div style="display: inline-block; margin-top: 10px; background-color: #d4af37; color: #0e2a1b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 14px; border-radius: 20px;">
                ★ New Direct Website Message ★
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 24px;">
              <p style="margin: 0 0 20px; font-size: 15px; color: #4a5568;">
                A visitor has submitted a new direct inquiry from the Ragusma Farms website landing page:
              </p>

              <!-- Customer Info Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-bottom: 12px; width: 35%; color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase;">Customer Name</td>
                        <td style="padding-bottom: 12px; color: #1a202c; font-size: 15px; font-weight: 700;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase;">Phone Number</td>
                        <td style="padding-bottom: 12px; color: #1b4d30; font-size: 15px; font-weight: 700;">
                          <a href="tel:${cleanPhone}" style="color: #1b4d30; text-decoration: none;">📞 ${phone}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase;">Email Address</td>
                        <td style="padding-bottom: 12px; color: #2d3748; font-size: 14px; font-weight: 600;">
                          ${email ? `<a href="mailto:${email}" style="color: #2b6cb0; text-decoration: underline;">✉️ ${email}</a>` : '<span style="color: #a0aec0; font-style: italic;">Not provided</span>'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase;">Inquiry Type</td>
                        <td style="padding-bottom: 12px; color: #2d3748; font-size: 14px; font-weight: 700;">
                          <span style="display: inline-block; background-color: #e6fffa; color: #234e52; border: 1px solid #b2f5ea; padding: 3px 10px; border-radius: 6px;">
                            ${inquiryLabel}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase;">Received At</td>
                        <td style="color: #718096; font-size: 13px;">${receivedAt}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Body -->
              <h3 style="margin: 0 0 10px; color: #1a202c; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                Customer Inquiry Message:
              </h3>
              <div style="background-color: #fffdf5; border-left: 4px solid #d4af37; border-top: 1px solid #fef3c7; border-right: 1px solid #fef3c7; border-bottom: 1px solid #fef3c7; border-radius: 10px; padding: 18px 20px; font-size: 14px; line-height: 1.7; color: #2d3748; white-space: pre-wrap; font-style: normal;">
                ${message}
              </div>

              <!-- Quick Action Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0 10px;">
                <tr>
                  <td align="center">
                    <a href="tel:${cleanPhone}" style="display: inline-block; background-color: #1b4d30; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 22px; border-radius: 10px; margin: 4px 6px;">
                      📞 Call ${fullName.split(' ')[0]}
                    </a>
                    ${waPhone ? `
                    <a href="https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${fullName}, thank you for contacting Ragusma Farms regarding your ${inquiryLabel} inquiry!`)}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 22px; border-radius: 10px; margin: 4px 6px;">
                      💬 Open WhatsApp
                    </a>` : ''}
                    ${email ? `
                    <a href="mailto:${email}?subject=${encodeURIComponent(`Ragusma Farms Response - ${inquiryLabel}`)}" style="display: inline-block; background-color: #2b6cb0; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 22px; border-radius: 10px; margin: 4px 6px;">
                      ✉️ Reply Email
                    </a>` : ''}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #edf2f7;">
              <p style="margin: 0; color: #718096; font-size: 11px;">
                Sent from the Ragusma Farms Online Contact Desk &bull; Tunga Goro, Minna, Niger State
              </p>
              <p style="margin: 4px 0 0; color: #a0aec0; font-size: 10px;">
                &copy; ${currentYear} Ragusma Farms NG&reg;. Official Communications Dispatch.
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
 * Routes contact inquiries directly to ragusmaa@gmail.com with inline CID badge
 */
export async function sendContactInquiryEmail({ fullName, phone, email, inquiryType, message }) {
  const targetRecipient = 'ragusmaa@gmail.com';
  const defaultSender = process.env.GMAIL_USER || process.env.SMTP_USER || 'ragusmaa@gmail.com';
  const rawFrom = process.env.EMAIL_FROM || process.env.SMTP_FROM || `Ragusma Farms Website <${defaultSender}>`;
  const from = rawFrom.replace(/["']/g, '').trim();

  const inquiryLabel = INQUIRY_LABELS[inquiryType] || inquiryType || 'Direct Inquiry';
  const subject = `New Farm Inquiry: ${fullName} (${inquiryLabel}) - Ragusma Farms Desk`;
  const html = generateContactNotificationEmailHtml({ fullName, phone, email, inquiryType, message, logoSrc: `cid:${RAGUSMA_CID}` });
  const text = `New Website Direct Message - Ragusma Farms Desk\n\n` +
    `Name: ${fullName}\n` +
    `Phone: ${phone}\n` +
    `Email: ${email || 'Not provided'}\n` +
    `Inquiry Type: ${inquiryLabel}\n\n` +
    `Message:\n${message}\n\n` +
    `Farm Desk Address: Tunga Goro, Minna, Niger State\n`;

  const mailOptions = {
    from,
    to: targetRecipient,
    subject,
    text,
    html,
    replyTo: email && email.includes('@') ? email : undefined,
    attachments: [getBadgeAttachment()]
  };

  // 1. Send via primary SMTP (Nodemailer via Official Farm Gmail)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✓ Contact inquiry forwarded to ragusmaa@gmail.com:', info.messageId);
      return { success: true, messageId: info.messageId, provider: 'smtp-gmail' };
    } catch (err) {
      console.error('SMTP error sending contact inquiry to ragusmaa@gmail.com:', err.message);
    }
  }

  // 2. Resend API Fallback
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
          to: [targetRecipient],
          reply_to: email && email.includes('@') ? email : undefined,
          subject,
          html: generateContactNotificationEmailHtml({ fullName, phone, email, inquiryType, message, logoSrc: RAGUSMA_BADGE_URL }),
          text
        })
      });

      const resData = await res.json();
      if (res.ok) {
        console.log('✓ Contact inquiry forwarded to ragusmaa@gmail.com via Resend:', resData.id);
        return { success: true, messageId: resData.id, provider: 'resend' };
      }
    } catch (err) {
      console.warn('Resend error sending contact inquiry:', err.message);
    }
  }

  // 3. Fallback log
  console.log('----------------------------------------------------');
  console.log(`[CONTACT INQUIRY RECEIVED FOR ragusmaa@gmail.com]`);
  console.log(`From: ${fullName} (${phone}, ${email})`);
  console.log(`Type: ${inquiryLabel}`);
  console.log(`Message: ${message}`);
  console.log('----------------------------------------------------');

  return { success: true, simulated: true };
}

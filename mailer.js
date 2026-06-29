/**
 * TipSea Point — Email Service
 * Handles transactional emails: booking confirmations, inquiry alerts, admin notifications
 */

const nodemailer = require('nodemailer');

// ── Transporter ──────────────────────────────────────────────
function createTransporter() {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Development: log to console, don't actually send
  return {
    sendMail: async (opts) => {
      console.log('\n📧 EMAIL (dev — not sent)');
      console.log('  To:', opts.to);
      console.log('  Subject:', opts.subject);
      console.log('────────────────────────────────────');
      return { messageId: 'dev-' + Date.now() };
    },
  };
}

// ── Shared email wrapper ──────────────────────────────────────
async function sendEmail({ to, subject, html, text }) {
  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'TipSea Point <hello@tipseapoint.com>',
      to,
      subject,
      html,
      text,
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    return { success: false, error: err.message };
  }
}

// ── Shared HTML shell ─────────────────────────────────────────
function emailShell(body) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>TipSea Point</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
    body { margin:0; padding:0; background:#060e1a; font-family:'DM Sans',Arial,sans-serif; color:#F8F4EE; }
    .wrapper { max-width:600px; margin:0 auto; padding:40px 20px; }
    .header { border-bottom:1px solid rgba(0,180,216,0.25); padding-bottom:24px; margin-bottom:32px; }
    .logo { font-family:'Cormorant Garamond',Georgia,serif; font-size:28px; font-weight:400; color:#F8F4EE; letter-spacing:0.05em; }
    .logo span { color:#00B4D8; }
    .tagline { font-size:11px; letter-spacing:0.25em; text-transform:uppercase; color:rgba(248,244,238,0.35); margin-top:4px; font-family:monospace; }
    h2 { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:400; color:#F8F4EE; margin:0 0 16px; }
    p { font-size:15px; line-height:1.75; color:rgba(248,244,238,0.7); margin:0 0 16px; }
    .detail-box { background:rgba(0,180,216,0.06); border:1px solid rgba(0,180,216,0.2); padding:24px; margin:24px 0; }
    .detail-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(0,180,216,0.1); font-size:14px; }
    .detail-row:last-child { border-bottom:none; }
    .detail-label { color:rgba(248,244,238,0.4); font-family:monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; }
    .detail-value { color:#F8F4EE; font-weight:500; }
    .code-badge { background:#00B4D8; color:#0A1628; display:inline-block; padding:8px 18px; font-family:monospace; font-size:16px; font-weight:700; letter-spacing:0.1em; margin:12px 0; }
    .cta-btn { display:inline-block; background:#00B4D8; color:#0A1628 !important; padding:14px 32px; font-size:13px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; text-decoration:none; margin:16px 0; }
    .divider { height:1px; background:linear-gradient(90deg,transparent,rgba(0,180,216,0.3),transparent); margin:28px 0; }
    .footer { margin-top:40px; padding-top:24px; border-top:1px solid rgba(0,180,216,0.1); font-size:12px; color:rgba(248,244,238,0.25); text-align:center; }
    .footer a { color:rgba(0,180,216,0.6); text-decoration:none; }
    .gold { color:#F0C040; }
    .cyan { color:#00B4D8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">TipSea <span>Point</span></div>
      <div class="tagline">Hope Town · Elbow Cay · Abaco, The Bahamas</div>
    </div>
    ${body}
    <div class="footer">
      <p>TipSea Point · Hope Town, Elbow Cay, Abaco, The Bahamas</p>
      <p><a href="https://tipseapoint.com">tipseapoint.com</a> · <a href="mailto:hello@tipseapoint.com">hello@tipseapoint.com</a></p>
      <p style="margin-top:12px;font-size:11px;">You received this email because you submitted a request on tipseapoint.com.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── BOOKING CONFIRMATION → Guest ─────────────────────────────
async function sendBookingConfirmationGuest(booking) {
  const checkIn  = new Date(booking.checkIn).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const html = emailShell(`
    <h2>Your reservation request has been received</h2>
    <p>Thank you, <strong>${booking.guestName}</strong>. We've received your request for TipSea Point and will confirm availability within <strong>24 hours</strong>.</p>

    <div class="detail-box">
      <div class="detail-row">
        <span class="detail-label">Confirmation Code</span>
        <span class="detail-value"><span class="code-badge">${booking.confirmationCode}</span></span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Check-In</span>
        <span class="detail-value">${checkIn}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Check-Out</span>
        <span class="detail-value">${checkOut}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Duration</span>
        <span class="detail-value">${booking.totalNights} nights</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Guests</span>
        <span class="detail-value">${booking.adults} adults${booking.children ? ', ' + booking.children + ' children' : ''}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Estimated Total</span>
        <span class="detail-value gold">$${(booking.totalPrice || 0).toLocaleString()}</span>
      </div>
    </div>

    <p>Keep your confirmation code safe — you'll need it to look up your booking details.</p>

    <div class="divider"></div>

    <h2 style="font-size:20px;">What happens next?</h2>
    <p>Our team will personally review your request and reach out within 24 hours to:</p>
    <ul style="color:rgba(248,244,238,0.6);line-height:2;padding-left:1.25em;font-size:15px;">
      <li>Confirm availability for your selected dates</li>
      <li>Discuss any special arrangements or requirements</li>
      <li>Provide deposit and payment details</li>
      <li>Share arrival instructions and concierge information</li>
    </ul>

    ${booking.specialRequests ? `<div class="divider"></div><p><strong>Your special requests noted:</strong><br/><em style="color:rgba(248,244,238,0.5);">${booking.specialRequests}</em></p>` : ''}

    <div class="divider"></div>
    <p style="color:rgba(248,244,238,0.4);font-size:13px;">Questions before we reach out? Reply to this email or contact us at <a href="mailto:hello@tipseapoint.com" style="color:#00B4D8;">hello@tipseapoint.com</a></p>
  `);

  return sendEmail({
    to: booking.guestEmail,
    subject: `Your TipSea Point Request — ${booking.confirmationCode}`,
    html,
    text: `TipSea Point — Reservation Request Received\n\nHi ${booking.guestName},\n\nYour reservation request has been received.\n\nConfirmation Code: ${booking.confirmationCode}\nCheck-In: ${checkIn}\nCheck-Out: ${checkOut}\nNights: ${booking.totalNights}\nEstimated Total: $${(booking.totalPrice || 0).toLocaleString()}\n\nWe'll be in touch within 24 hours.\n\nTipSea Point Team`,
  });
}

// ── BOOKING ALERT → Admin ────────────────────────────────────
async function sendBookingAlertAdmin(booking) {
  const checkIn  = new Date(booking.checkIn).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const html = emailShell(`
    <h2>🌊 New Booking Request</h2>
    <p>A new reservation request has been submitted on <strong>${new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</strong>.</p>

    <div class="detail-box">
      <div class="detail-row"><span class="detail-label">Code</span><span class="detail-value cyan">${booking.confirmationCode}</span></div>
      <div class="detail-row"><span class="detail-label">Guest</span><span class="detail-value">${booking.guestName}</span></div>
      <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value"><a href="mailto:${booking.guestEmail}" style="color:#00B4D8;">${booking.guestEmail}</a></span></div>
      <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${booking.guestPhone}</span></div>
      <div class="detail-row"><span class="detail-label">Check-In</span><span class="detail-value">${checkIn}</span></div>
      <div class="detail-row"><span class="detail-label">Check-Out</span><span class="detail-value">${checkOut}</span></div>
      <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${booking.totalNights}</span></div>
      <div class="detail-row"><span class="detail-label">Guests</span><span class="detail-value">${booking.adults} adults, ${booking.children || 0} children</span></div>
      <div class="detail-row"><span class="detail-label">Revenue</span><span class="detail-value gold">$${(booking.totalPrice || 0).toLocaleString()}</span></div>
      ${booking.specialRequests ? `<div class="detail-row" style="flex-direction:column;gap:8px;"><span class="detail-label">Special Requests</span><span style="color:rgba(248,244,238,0.6);font-size:13px;">${booking.specialRequests}</span></div>` : ''}
    </div>

    <a href="${process.env.SITE_URL || 'http://localhost:3000'}/admin" class="cta-btn">View in Admin Dashboard</a>
  `);

  return sendEmail({
    to: process.env.EMAIL_TO || 'hello@tipseapoint.com',
    subject: `🌊 New Booking: ${booking.guestName} — ${booking.confirmationCode}`,
    html,
    text: `New Booking Request\n\nGuest: ${booking.guestName}\nEmail: ${booking.guestEmail}\nPhone: ${booking.guestPhone}\nCheck-In: ${checkIn}\nCheck-Out: ${checkOut}\nNights: ${booking.totalNights}\nTotal: $${(booking.totalPrice || 0).toLocaleString()}\n\nView in admin: ${process.env.SITE_URL || 'http://localhost:3000'}/admin`,
  });
}

// ── BOOKING CONFIRMATION → Guest (status change) ─────────────
async function sendBookingStatusUpdate(booking) {
  const statusMessages = {
    confirmed: {
      subject: `✅ Your TipSea Point Stay is Confirmed — ${booking.confirmationCode}`,
      headline: 'Your stay is confirmed!',
      body: `We're thrilled to confirm your reservation at TipSea Point. The estate is yours exclusively — we look forward to welcoming you to Hope Town.`,
    },
    cancelled: {
      subject: `TipSea Point Booking Cancelled — ${booking.confirmationCode}`,
      headline: 'Your booking has been cancelled',
      body: `Your reservation (${booking.confirmationCode}) has been cancelled. If you believe this is an error or have any questions, please reply to this email immediately.`,
    },
  };

  const msg = statusMessages[booking.status];
  if (!msg) return;

  const checkIn  = new Date(booking.checkIn).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const html = emailShell(`
    <h2>${msg.headline}</h2>
    <p>${msg.body}</p>
    <div class="detail-box">
      <div class="detail-row"><span class="detail-label">Confirmation</span><span class="detail-value cyan">${booking.confirmationCode}</span></div>
      <div class="detail-row"><span class="detail-label">Check-In</span><span class="detail-value">${checkIn}</span></div>
      <div class="detail-row"><span class="detail-label">Check-Out</span><span class="detail-value">${checkOut}</span></div>
      <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${booking.totalNights}</span></div>
    </div>
    <p style="color:rgba(248,244,238,0.4);font-size:13px;">Questions? <a href="mailto:hello@tipseapoint.com" style="color:#00B4D8;">hello@tipseapoint.com</a></p>
  `);

  return sendEmail({ to: booking.guestEmail, subject: msg.subject, html, text: msg.headline });
}

// ── INQUIRY CONFIRMATION → Guest ─────────────────────────────
async function sendInquiryConfirmationGuest(inquiry) {
  const html = emailShell(`
    <h2>We've received your message</h2>
    <p>Thank you, <strong>${inquiry.name}</strong>. We'll be in touch within 24 hours — usually much sooner.</p>
    <div class="detail-box">
      <p style="font-style:italic;color:rgba(248,244,238,0.6);font-size:14px;margin:0;">"${inquiry.message}"</p>
    </div>
    <p>In the meantime, you can explore the estate at <a href="https://tipseapoint.com" style="color:#00B4D8;">tipseapoint.com</a> or browse our gallery on Instagram <a href="https://instagram.com/tipseapoint" style="color:#00B4D8;">@tipseapoint</a>.</p>
    <div class="divider"></div>
    <p style="font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:rgba(248,244,238,0.6);">"Where the Atlantic meets paradise."</p>
  `);

  return sendEmail({
    to: inquiry.email,
    subject: 'TipSea Point — We\'ll be in touch',
    html,
    text: `Hi ${inquiry.name},\n\nThank you for your message. We'll be in touch within 24 hours.\n\nTipSea Point Team\nhello@tipseapoint.com`,
  });
}

// ── INQUIRY ALERT → Admin ────────────────────────────────────
async function sendInquiryAlertAdmin(inquiry) {
  const html = emailShell(`
    <h2>✉️ New Inquiry Received</h2>
    <div class="detail-box">
      <div class="detail-row"><span class="detail-label">From</span><span class="detail-value">${inquiry.name}</span></div>
      <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value"><a href="mailto:${inquiry.email}" style="color:#00B4D8;">${inquiry.email}</a></span></div>
      ${inquiry.phone ? `<div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${inquiry.phone}</span></div>` : ''}
      ${inquiry.preferredCheckIn ? `<div class="detail-row"><span class="detail-label">Preferred Stay</span><span class="detail-value">${new Date(inquiry.preferredCheckIn).toLocaleDateString()} – ${new Date(inquiry.preferredCheckOut).toLocaleDateString()}</span></div>` : ''}
      <div class="detail-row" style="flex-direction:column;gap:8px;"><span class="detail-label">Message</span><span style="color:rgba(248,244,238,0.7);font-size:14px;">${inquiry.message}</span></div>
    </div>
    <a href="mailto:${inquiry.email}?subject=Re: Your TipSea Point Inquiry" class="cta-btn">Reply to ${inquiry.name}</a>
  `);

  return sendEmail({
    to: process.env.EMAIL_TO || 'hello@tipseapoint.com',
    subject: `✉️ New Inquiry: ${inquiry.name}`,
    html,
    text: `New Inquiry\n\nFrom: ${inquiry.name}\nEmail: ${inquiry.email}\nMessage: ${inquiry.message}`,
  });
}

module.exports = {
  sendBookingConfirmationGuest,
  sendBookingAlertAdmin,
  sendBookingStatusUpdate,
  sendInquiryConfirmationGuest,
  sendInquiryAlertAdmin,
};

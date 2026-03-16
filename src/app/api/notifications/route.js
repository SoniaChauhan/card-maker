/**
 * Notifications API — admin festival reminders, user new-card notifications,
 * subscriber management, and broadcast messaging.
 *
 * POST /api/notifications  { action, ... }
 *
 * Actions:
 *   subscribe           — register email/phone for notifications
 *   unsubscribe         — remove subscription
 *   getSubscribers      — admin: list all subscribers
 *   sendFestivalReminder — admin: email reminders for upcoming festivals
 *   broadcastNewCard    — admin: notify all subscribers about a new card
 *   getNotificationLog  — admin: view sent notification history
 *   getUnnotifiedCards  — admin: get cards that haven't been announced yet
 *   autoNotifyNewCards  — admin: auto-send notifications for all unannounced cards
 */
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import nodemailer from 'nodemailer';

// Corporate proxy / self-signed cert workaround
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/** Support multiple admin emails (comma-separated in env var) */
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAIL || '').split(',').map(e => e.toLowerCase().trim()).filter(Boolean)
);
function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.has(email.toLowerCase().trim());
}

/**
 * Master card registry — every card type in the app.
 * When you add a new card, add it here too.
 * The `autoNotifyNewCards` action checks this list against
 * the `notified_cards` collection to find unannounced cards.
 */
const CARD_REGISTRY = [
  { id: 'birthday',          name: 'Birthday Invite Designer',          icon: '🎂', desc: 'Create personalised birthday party invitations with ease.', url: '/birthday-invitation-maker' },
  { id: 'wedding',           name: 'Wedding Invite Designer',           icon: '💐', desc: 'Create royal and classic wedding invitations with beautiful themes.', url: '/wedding-card-maker' },
  { id: 'anniversary',       name: 'Anniversary Greeting Designer',     icon: '💍', desc: 'Craft elegant anniversary greetings to celebrate love.', url: '/anniversary-card-maker' },
  { id: 'biodata',           name: 'Marriage Profile Designer',         icon: '💒', desc: 'Build a traditional and detailed marriage biodata.', url: '/marriage-biodata-maker' },
  { id: 'rentcard',          name: 'PG / Rent Card',                    icon: '🏠', desc: 'Create professional PG & rent advertisement cards.', url: '/rent-card-maker' },
  { id: 'saloncard',         name: 'Salon / Parlour Card',              icon: '💇', desc: 'Create elegant salon service & price list cards.', url: '/salon-card-maker' },
  { id: 'cardresume',        name: 'Card Resume Maker',                 icon: '🪪', desc: 'Create a compact card-style resume.', url: '/card-resume-maker' },
  { id: 'resume',            name: 'Resume Builder',                    icon: '📄', desc: 'Design a polished resume and download it instantly.', url: '/resume-builder-online' },
  { id: 'festivalcards',     name: 'Festival Cards',                    icon: '🎆', desc: 'Create festive cards for Diwali, Navratri, Eid & more.', url: '/festival-card-maker' },
  { id: 'holicard',          name: 'Holi Celebration Card',             icon: '🌈', desc: 'Vibrant & colorful Holi greeting card.', url: '/holi-card-maker-online' },
  { id: 'holiwishes',        name: 'Happy Holi Wishes (Hindi)',         icon: '🎨', desc: 'One-click colorful Holi greeting in Hindi.', url: '/happy-holi-wishes-hindi' },
  { id: 'holiwishes-en',     name: 'Happy Holi Wishes (English)',       icon: '🎨', desc: 'One-click colorful Holi greeting in English.', url: '/happy-holi-wishes-english' },
  { id: 'holivideo',         name: 'Holi Video Wishes',                 icon: '🎬', desc: 'Download colorful Holi video greetings.', url: '/holi-celebration-card' },
  { id: 'motivational',      name: 'Motivational Quotes (Hindi)',       icon: '💪', desc: 'Download beautiful motivational quotes cards in Hindi.', url: '/motivational-quotes-images-download' },
  { id: 'motivational-en',   name: 'Motivational Quotes (English)',     icon: '💪', desc: 'Download inspiring English motivational quotes cards.', url: '/motivational-quotes-english' },
  { id: 'fathers',           name: "Father's Quotes (Hindi)",           icon: '👨\u200D👧', desc: 'पिता के प्यार को शब्दों में — फ्री डाउनलोड!', url: '/fathers-quotes-hindi' },
  { id: 'fathers-en',        name: "Father's Quotes (English)",         icon: '👨\u200D👧', desc: "Heartfelt English father's quotes cards.", url: '/fathers-quotes-english' },
  { id: 'mothers',           name: "Mother's Quotes (Hindi)",           icon: '💐', desc: 'माँ के प्यार को शब्दों में — फ्री डाउनलोड!', url: '/mothers-quotes-hindi' },
  { id: 'mothers-en',        name: "Mother's Quotes (English)",         icon: '💐', desc: "Beautiful English mother's quotes cards.", url: '/mothers-quotes-english' },
  { id: 'aitextimage',       name: 'AI Text + Image Card',              icon: '🎨', desc: 'Upload photo, add text, choose layout — create personalised cards!', url: '/ai-text-image-card' },
  { id: 'aifaceswap',        name: 'AI Themed Card Maker',              icon: '🎭', desc: 'Pick a theme, upload your face & get a personalised card!', url: '/ai-themed-card-maker' },
  { id: 'videomaker',        name: 'Video Card Maker',                  icon: '🎬', desc: 'Upload photos & a song to create a video slideshow with transitions!', url: '/video-maker' },
  { id: 'videotrimmer',      name: 'Video Trimmer / Cropper',           icon: '✂️', desc: 'Upload a video, trim it into clips & download — all in your browser!', url: '/video-trimmer' },
  { id: 'mp4tomp3',           name: 'MP4 to MP3 Converter',              icon: '🎵', desc: 'Extract audio from any video — choose quality & download instantly!', url: '/mp4-to-mp3-converter' },
  { id: 'videoaudioswap',    name: 'Video Audio Replacer',              icon: '🔊', desc: 'Replace video sound with a new song — adjust volumes & download!', url: '/video-audio-replacer' },
];

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false },
  });
}

const fromAddress = () =>
  `${process.env.SMTP_FROM_NAME || 'Card Maker'} <${process.env.SMTP_FROM_EMAIL}>`;

async function sendMail(to, subject, html) {
  const transporter = getTransporter();
  await transporter.sendMail({ from: fromAddress(), to, subject, html });
}

/* ── Beautiful HTML email templates ── */

function festivalReminderHtml(festivals) {
  const rows = festivals.map(f =>
    `<tr>
      <td style="padding:12px;border-bottom:1px solid #eee;font-size:24px;text-align:center;width:50px">${f.icon}</td>
      <td style="padding:12px;border-bottom:1px solid #eee">
        <strong style="font-size:15px;color:#333">${f.name}</strong>
        ${f.nameHindi ? `<br><span style="font-size:12px;color:#888">${f.nameHindi}</span>` : ''}
      </td>
      <td style="padding:12px;border-bottom:1px solid #eee;color:#667eea;font-weight:600;white-space:nowrap">
        ${new Date(f.nextStart + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
    </tr>`
  ).join('');

  return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;padding:0">
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:28px;border-radius:16px 16px 0 0;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:22px">🗓️ Festival Reminder</h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:13px">Upcoming festivals — prepare card templates in advance!</p>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 16px 16px">
      <p style="color:#555;font-size:14px;margin:0 0 16px">Hi Admin,</p>
      <p style="color:#555;font-size:14px;margin:0 0 16px">The following festivals are coming up in the next 30 days. Make sure card templates and offers are ready!</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows}</table>
      <div style="text-align:center;margin:24px 0">
        <a href="https://www.creativethinkerdesignhub.com" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          🎨 Open Dashboard
        </a>
      </div>
      <p style="color:#aaa;font-size:11px;text-align:center;margin:20px 0 0">© ${new Date().getFullYear()} Creative Thinker Design Hub</p>
    </div>
  </div>`;
}

function newCardNotificationHtml(cardName, cardIcon, cardDescription, cardUrl) {
  return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;padding:0">
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:28px;border-radius:16px 16px 0 0;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:22px">🎴 Card Maker — New Card Added!</h1>
    </div>
    <div style="background:#fff;padding:28px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 16px 16px">
      <div style="text-align:center;margin-bottom:20px">
        <span style="font-size:48px">${cardIcon || '🎨'}</span>
        <h2 style="color:#333;margin:12px 0 4px;font-size:20px">${cardName}</h2>
        <p style="color:#666;font-size:14px;margin:0">${cardDescription || 'A brand new card design is available for you!'}</p>
      </div>
      <div style="text-align:center;margin:24px 0">
        <a href="${cardUrl || 'https://www.creativethinkerdesignhub.com'}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">
          🎨 Try It Now — Free!
        </a>
      </div>
      <p style="color:#888;font-size:12px;text-align:center">You received this because you subscribed to Card Maker notifications.</p>
      <p style="color:#aaa;font-size:11px;text-align:center;margin:16px 0 0">
        <a href="https://www.creativethinkerdesignhub.com" style="color:#667eea">Unsubscribe</a> · 
        © ${new Date().getFullYear()} Creative Thinker Design Hub
      </p>
    </div>
  </div>`;
}

function festivalOfferHtml(festival) {
  return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;padding:0">
    <div style="background:${festival.grad || 'linear-gradient(135deg,#667eea,#764ba2)'};padding:28px;border-radius:16px 16px 0 0;text-align:center">
      <span style="font-size:48px">${festival.icon}</span>
      <h1 style="color:#fff;margin:12px 0 0;font-size:22px">${festival.name} — Special Offer! 🎉</h1>
    </div>
    <div style="background:#fff;padding:28px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 16px 16px">
      <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 16px">${festival.offerDesc || `Celebrate ${festival.name} with beautiful custom cards!`}</p>
      <div style="background:#f8f6ff;border:2px dashed #667eea;border-radius:12px;padding:16px;text-align:center;margin:16px 0">
        <span style="font-size:28px;font-weight:800;color:#667eea">${festival.offerPrice}</span>
        <p style="color:#888;font-size:12px;margin:4px 0 0">Unlimited Downloads • Lifetime Access</p>
      </div>
      <div style="text-align:center;margin:24px 0">
        <a href="https://www.creativethinkerdesignhub.com" style="display:inline-block;background:${festival.grad || 'linear-gradient(135deg,#667eea,#764ba2)'};color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">
          ${festival.offerCta || '🎨 Create Card Now'}
        </a>
      </div>
      <p style="color:#888;font-size:12px;text-align:center">You received this as a Card Maker subscriber.</p>
      <p style="color:#aaa;font-size:11px;text-align:center;margin:16px 0 0">
        <a href="https://www.creativethinkerdesignhub.com" style="color:#667eea">Unsubscribe</a> · 
        © ${new Date().getFullYear()} Creative Thinker Design Hub
      </p>
    </div>
  </div>`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;
    const db = await getDb();
    const subCol = db.collection('subscribers');
    const logCol = db.collection('notification_log');

    switch (action) {

      /* ── Subscribe for notifications ── */
      case 'subscribe': {
        const { email, phone, name } = body;
        const emailKey = email ? email.toLowerCase().trim() : '';
        const phoneKey = phone ? phone.replace(/\D/g, '').slice(-10) : '';

        if (!emailKey && !phoneKey) {
          return NextResponse.json({ error: 'Provide email or phone' }, { status: 400 });
        }

        // Upsert by email or phone
        const filter = emailKey ? { email: emailKey } : { phone: phoneKey };
        await subCol.updateOne(
          filter,
          {
            $set: {
              ...(emailKey && { email: emailKey }),
              ...(phoneKey && { phone: phoneKey }),
              ...(name && { name: name.trim() }),
              active: true,
              updatedAt: new Date(),
            },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true },
        );
        return NextResponse.json({ ok: true, message: 'Subscribed successfully!' });
      }

      /* ── Unsubscribe ── */
      case 'unsubscribe': {
        const { email, phone } = body;
        const emailKey = email ? email.toLowerCase().trim() : '';
        const phoneKey = phone ? phone.replace(/\D/g, '').slice(-10) : '';
        if (!emailKey && !phoneKey) {
          return NextResponse.json({ error: 'Provide email or phone' }, { status: 400 });
        }
        const filter = emailKey ? { email: emailKey } : { phone: phoneKey };
        await subCol.updateOne(filter, { $set: { active: false, updatedAt: new Date() } });
        return NextResponse.json({ ok: true });
      }

      /* ── Admin: Get all active subscribers ── */
      case 'getSubscribers': {
        const { adminEmail } = body;
        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        const subs = await subCol.find({ active: true }).sort({ createdAt: -1 }).toArray();
        return NextResponse.json({
          subscribers: subs.map(s => ({
            id: s._id.toString(),
            email: s.email || '',
            phone: s.phone || '',
            name: s.name || '',
            createdAt: s.createdAt,
          })),
          total: subs.length,
        });
      }

      /* ── Admin: Send festival reminder to admin ── */
      case 'sendFestivalReminder': {
        const { adminEmail, festivals } = body;
        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        if (!festivals || !festivals.length) {
          return NextResponse.json({ error: 'No festivals provided' }, { status: 400 });
        }

        const html = festivalReminderHtml(festivals);
        // Send to all admin emails
        for (const ae of ADMIN_EMAILS) {
          try { await sendMail(ae, `🗓️ Festival Reminder — ${festivals.length} upcoming festivals`, html); }
          catch (e) { console.error('Failed to send festival reminder to', ae, e); }
        }

        await logCol.insertOne({
          type: 'festival_reminder',
          to: Array.from(ADMIN_EMAILS),
          festivals: festivals.map(f => f.name),
          sentAt: new Date(),
          sentBy: adminEmail,
        });

        return NextResponse.json({ ok: true, message: `Festival reminder sent to ${ADMIN_EMAILS.size} admin(s)` });
      }

      /* ── Admin: Send festival offer to all subscribers ── */
      case 'broadcastFestivalOffer': {
        const { adminEmail, festival } = body;
        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        if (!festival) {
          return NextResponse.json({ error: 'Festival data required' }, { status: 400 });
        }

        const subs = await subCol.find({ active: true, email: { $exists: true, $ne: '' } }).toArray();
        const subject = `${festival.icon} ${festival.name} — Special Offer on Card Maker! 🎉`;
        const html = festivalOfferHtml(festival);
        let sent = 0;
        let failed = 0;

        for (const sub of subs) {
          try {
            await sendMail(sub.email, subject, html);
            sent++;
          } catch {
            failed++;
          }
        }

        await logCol.insertOne({
          type: 'festival_offer',
          festival: festival.name,
          totalSubscribers: subs.length,
          sent,
          failed,
          sentAt: new Date(),
          sentBy: adminEmail,
        });

        return NextResponse.json({ ok: true, sent, failed, total: subs.length });
      }

      /* ── Admin: Broadcast new card notification to all subscribers ── */
      case 'broadcastNewCard': {
        const { adminEmail, cardName, cardIcon, cardDescription, cardUrl } = body;
        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        if (!cardName) {
          return NextResponse.json({ error: 'cardName is required' }, { status: 400 });
        }

        const subs = await subCol.find({ active: true, email: { $exists: true, $ne: '' } }).toArray();
        const subject = `${cardIcon || '🎨'} New Card Added — ${cardName} | Card Maker`;
        const html = newCardNotificationHtml(cardName, cardIcon, cardDescription, cardUrl);
        let sent = 0;
        let failed = 0;

        for (const sub of subs) {
          try {
            await sendMail(sub.email, subject, html);
            sent++;
          } catch {
            failed++;
          }
        }

        await logCol.insertOne({
          type: 'new_card',
          cardName,
          totalSubscribers: subs.length,
          sent,
          failed,
          sentAt: new Date(),
          sentBy: adminEmail,
        });

        // Also mark this card as notified to prevent duplicate auto-notifications
        const notifiedCol = db.collection('notified_cards');
        await notifiedCol.updateOne(
          { cardId: cardName.toLowerCase().replace(/\s+/g, '') },
          { $set: { cardId: cardName.toLowerCase().replace(/\s+/g, ''), cardName, notifiedAt: new Date(), subscriberCount: sent } },
          { upsert: true },
        );

        return NextResponse.json({ ok: true, sent, failed, total: subs.length });
      }

      /* ── Admin: Get notification history ── */
      case 'getNotificationLog': {
        const { adminEmail } = body;
        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        const logs = await logCol.find({}).sort({ sentAt: -1 }).limit(50).toArray();
        return NextResponse.json({
          logs: logs.map(l => ({ ...l, id: l._id.toString(), _id: undefined })),
        });
      }

      /* ── Admin: Get cards that have NOT been notified yet ── */
      case 'getUnnotifiedCards': {
        const { adminEmail } = body;
        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        const notifiedCol = db.collection('notified_cards');
        const notified = await notifiedCol.find({}).toArray();
        const notifiedIds = new Set(notified.map(n => n.cardId));
        const unnotified = CARD_REGISTRY.filter(c => !notifiedIds.has(c.id));
        return NextResponse.json({ unnotified, total: unnotified.length });
      }

      /* ── Admin: Auto-notify subscribers about ALL unannounced cards ── */
      case 'autoNotifyNewCards': {
        const { adminEmail } = body;
        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const notifiedCol = db.collection('notified_cards');
        const notified = await notifiedCol.find({}).toArray();
        const notifiedIds = new Set(notified.map(n => n.cardId));
        const unnotified = CARD_REGISTRY.filter(c => !notifiedIds.has(c.id));

        if (unnotified.length === 0) {
          return NextResponse.json({ ok: true, message: 'All cards already notified.', sent: 0, cards: [] });
        }

        const subs = await subCol.find({ active: true, email: { $exists: true, $ne: '' } }).toArray();
        if (subs.length === 0) {
          // Mark all as notified even if no subscribers
          for (const card of unnotified) {
            await notifiedCol.updateOne(
              { cardId: card.id },
              { $set: { cardId: card.id, cardName: card.name, notifiedAt: new Date(), subscriberCount: 0 } },
              { upsert: true },
            );
          }
          return NextResponse.json({ ok: true, message: 'No subscribers to notify.', sent: 0, cards: unnotified.map(c => c.name) });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.creativethinkerdesignhub.com';
        let totalSent = 0;
        let totalFailed = 0;
        const notifiedCards = [];

        for (const card of unnotified) {
          const cardUrl = `${baseUrl}${card.url}`;
          const subject = `${card.icon} New Card Added — ${card.name} | Card Maker`;
          const html = newCardNotificationHtml(card.name, card.icon, card.desc, cardUrl);
          let sent = 0;
          let failed = 0;

          for (const sub of subs) {
            try {
              await sendMail(sub.email, subject, html);
              sent++;
            } catch {
              failed++;
            }
          }

          totalSent += sent;
          totalFailed += failed;
          notifiedCards.push(card.name);

          // Mark this card as notified
          await notifiedCol.updateOne(
            { cardId: card.id },
            { $set: { cardId: card.id, cardName: card.name, notifiedAt: new Date(), subscriberCount: sent } },
            { upsert: true },
          );

          // Log each card notification
          await logCol.insertOne({
            type: 'new_card',
            cardName: card.name,
            totalSubscribers: subs.length,
            sent,
            failed,
            sentAt: new Date(),
            sentBy: adminEmail,
            auto: true,
          });
        }

        return NextResponse.json({
          ok: true,
          cards: notifiedCards,
          totalSent,
          totalFailed,
          subscriberCount: subs.length,
        });
      }

      /* ── Admin: Mark all current cards as notified (skip sending emails) ── */
      case 'markAllCardsNotified': {
        const { adminEmail } = body;
        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        const notifiedCol = db.collection('notified_cards');
        for (const card of CARD_REGISTRY) {
          await notifiedCol.updateOne(
            { cardId: card.id },
            { $set: { cardId: card.id, cardName: card.name, notifiedAt: new Date(), subscriberCount: 0, markedManually: true } },
            { upsert: true },
          );
        }
        return NextResponse.json({ ok: true, message: `Marked ${CARD_REGISTRY.length} cards as notified.` });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Notifications API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

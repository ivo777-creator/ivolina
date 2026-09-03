// GET /api/cron/milestones
// Runs once a day (see vercel.json) and sends a notification when today is
// something worth noticing: a round number of days together, an anniversary,
// or one of your own saved moments.

import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const FIRST_CONTACT = new Date('2026-05-08T00:00:00Z');       // the day they first spoke
const RELATIONSHIP_START = new Date('2026-07-27T00:00:00Z');  // the day they became a couple

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const CONTACT = process.env.VAPID_CONTACT || 'mailto:ivolina@example.com';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function daysBetween(a, b) {
  return Math.floor((a - b) / 86400000);
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Everything worth a notification today.
function milestonesFor(today, events) {
  const out = [];
  const days = daysBetween(today, RELATIONSHIP_START);

  if (days > 0 && days % 100 === 0) {
    out.push({
      tag: `days-${days}`,
      title: `${days} days together`,
      message: days === 100
        ? 'One hundred days. That deserves a message.'
        : `${days} days of us today.`,
    });
  }

  // Anniversaries
  const sameDay = today.getUTCDate() === RELATIONSHIP_START.getUTCDate();
  const sameMonth = today.getUTCMonth() === RELATIONSHIP_START.getUTCMonth();
  if (sameDay && sameMonth) {
    const years = today.getUTCFullYear() - RELATIONSHIP_START.getUTCFullYear();
    if (years > 0) {
      out.push({
        tag: `anniversary-${years}`,
        title: years === 1 ? 'One year together' : `${years} years together`,
        message: 'Happy anniversary 🌸',
      });
    }
  }

  // Half-year mark
  if (sameDay && !sameMonth) {
    const monthsApart = (today.getUTCFullYear() - RELATIONSHIP_START.getUTCFullYear()) * 12
      + (today.getUTCMonth() - RELATIONSHIP_START.getUTCMonth());
    if (monthsApart > 0 && monthsApart % 6 === 0) {
      out.push({
        tag: `months-${monthsApart}`,
        title: `${monthsApart} months together`,
        message: 'Another six months of us.',
      });
    }
  }

  // The day you first spoke gets its own yearly nod.
  if (today.getUTCDate() === FIRST_CONTACT.getUTCDate()
      && today.getUTCMonth() === FIRST_CONTACT.getUTCMonth()) {
    const years = today.getUTCFullYear() - FIRST_CONTACT.getUTCFullYear();
    if (years > 0) {
      out.push({
        tag: `first-contact-${years}`,
        title: years === 1 ? 'One year since we first spoke' : `${years} years since we first spoke`,
        message: 'Where it all started 💌',
      });
    }
  }

  // Your own saved moments, on the day and the day before.
  const todayKey = today.toISOString().slice(0, 10);
  const tomorrow = new Date(today.getTime() + 86400000).toISOString().slice(0, 10);
  events.forEach((ev) => {
    if (!ev || !ev.date || !ev.title) return;
    if (ev.date === todayKey) {
      out.push({ tag: `event-${ev.id}-day`, title: ev.title, message: `${ev.emoji || '✿'} today` });
    } else if (ev.date === tomorrow) {
      out.push({ tag: `event-${ev.id}-eve`, title: ev.title, message: `${ev.emoji || '✿'} tomorrow` });
    }
  });

  return out;
}

export async function GET(request) {
  // Vercel sends this header on scheduled runs. If you've set CRON_SECRET,
  // anything without it is rejected.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  if (!VAPID_PUBLIC || !VAPID_PRIVATE || !SUPABASE_URL || !SUPABASE_KEY) {
    return Response.json({ error: 'not configured' }, { status: 500 });
  }

  webpush.setVapidDetails(CONTACT, VAPID_PUBLIC, VAPID_PRIVATE);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Your custom moments live in the kv table as one JSON list.
  let events = [];
  try {
    const { data } = await supabase.from('kv').select('value').eq('key', 'events:list').maybeSingle();
    if (data?.value) events = JSON.parse(data.value);
  } catch (e) {
    console.error('could not read events', e);
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const due = milestonesFor(today, events);

  if (!due.length) {
    return Response.json({ checked: true, sent: 0, note: 'nothing today' });
  }

  const { data: subs } = await supabase.from('push_subscriptions').select('*');
  if (!subs || !subs.length) {
    return Response.json({ checked: true, sent: 0, note: 'nobody subscribed' });
  }

  let sent = 0;
  for (const m of due) {
    const payload = JSON.stringify({ title: m.title, body: m.message, url: '/', tag: m.tag });
    await Promise.all(subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        );
        sent++;
      } catch (err) {
        if (err.statusCode !== 404 && err.statusCode !== 410) {
          console.error('milestone push failed', err.statusCode);
        }
      }
    }));
  }

  return Response.json({ checked: true, sent, milestones: due.map(m => m.title) });
}

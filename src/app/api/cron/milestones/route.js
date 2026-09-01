// POST /api/push
// Sends a push notification to one person (or both).
// Called by the app when something happens the other person should know about.

import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const CONTACT = process.env.VAPID_CONTACT || 'mailto:ivolina@example.com';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    return Response.json({ error: 'VAPID keys are not configured' }, { status: 500 });
  }
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return Response.json({ error: 'Supabase is not configured' }, { status: 500 });
  }

  webpush.setVapidDetails(CONTACT, VAPID_PUBLIC, VAPID_PRIVATE);

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'bad request body' }, { status: 400 });
  }

  const { to, title, message, url, tag } = body || {};
  if (!title || !message) {
    return Response.json({ error: 'title and message are required' }, { status: 400 });
  }
  if (to && to !== 'ivo' && to !== 'nikolina' && to !== 'both') {
    return Response.json({ error: 'invalid recipient' }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  let query = supabase.from('push_subscriptions').select('*');
  if (to && to !== 'both') query = query.eq('user_key', to);
  const { data: subs, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  if (!subs || subs.length === 0) {
    return Response.json({ sent: 0, note: 'nobody is subscribed yet' });
  }

  const payload = JSON.stringify({
    title,
    body: message,
    url: url || '/',
    tag: tag || 'ivolina',
  });

  let sent = 0;
  const stale = [];

  await Promise.all(subs.map(async (s) => {
    const subscription = {
      endpoint: s.endpoint,
      keys: { p256dh: s.p256dh, auth: s.auth },
    };
    try {
      await webpush.sendNotification(subscription, payload);
      sent++;
    } catch (err) {
      // 404/410 mean the device unsubscribed or the install was removed.
      if (err.statusCode === 404 || err.statusCode === 410) {
        stale.push(s.endpoint);
      } else {
        console.error('push failed', err.statusCode, err.message || err.body);
      }
    }
  }));

  // Clean up dead subscriptions so we don't keep trying forever.
  if (stale.length) {
    await supabase.from('push_subscriptions').delete().in('endpoint', stale);
  }

  return Response.json({ sent, removed: stale.length });
}

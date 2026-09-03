/* ivolina service worker
   Two jobs:
     1. receive push notifications
     2. make sure the app never comes back on a stale page

   There is deliberately no offline cache. If iOS restarts the app after
   running out of memory, it must fetch the current version rather than
   resurrect whatever it happened to have lying around.
*/

const SW_VERSION = 'ivolina-3';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Throw away anything an older service worker cached.
    const names = await caches.keys();
    await Promise.all(names.map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

// Page loads always go to the network. If the network is genuinely
// unreachable we fall back to whatever the browser has, rather than
// showing nothing.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.mode !== 'navigate') return;

  event.respondWith((async () => {
    try {
      return await fetch(req, { cache: 'no-store' });
    } catch (e) {
      const fallback = await caches.match(req);
      return fallback || Response.error();
    }
  })());
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: 'ivolina', body: event.data ? event.data.text() : '' };
  }

  const title = payload.title || 'ivolina';
  const options = {
    body: payload.body || '',
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: payload.tag || 'ivolina',
    renotify: true,
    data: { url: payload.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

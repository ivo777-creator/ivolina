'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // The whole app is built as a self-contained vanilla JS script
    // that mounts into a div. This keeps the conversion from the
    // original artifact straightforward and easy to edit later.
    if (typeof window === 'undefined') return;
    if (window.__ivolinaBooted) return;
    window.__ivolinaBooted = true;
    require('./ivolina-app.js').boot();
  }, []);

  return <div id="ivolina-root" suppressHydrationWarning />;
}

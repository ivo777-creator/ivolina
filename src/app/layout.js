// Next.js 14 wants viewport and themeColor in their own export.
// Having them inside `metadata` is what produced the build warnings —
// and, more importantly, meant they were quietly ignored.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Lets the page reach under the status bar and the home indicator,
  // which is what makes a translucent top bar possible at all.
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#3E4A5D' },
    { media: '(prefers-color-scheme: light)', color: '#D5E1F6' },
  ],
};

export const metadata = {
  title: 'ivolina',
  description: 'a little world, just for two',
  appleWebApp: {
    capable: true,
    // The status bar becomes transparent and the app draws behind it.
    statusBarStyle: 'black-translucent',
    title: 'ivolina',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

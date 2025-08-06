import type { Metadata } from 'next';
import '@/app/globals.css';
import { Open_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';

const openSans = Open_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FF2050.AI - Find your next AI tool',
  description:
    'Discover the best AI tools and websites. Explore categories, latest products, and top-rated AI solutions. Stay updated with the latest in AI technology.',
};

export default async function RootLayout(props: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await props.params;
  return (
    <html lang={lang} translate="no">
      <body className={openSans.className}>{props.children}</body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics
          gaId={`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        />
      )}
    </html>
  );
}

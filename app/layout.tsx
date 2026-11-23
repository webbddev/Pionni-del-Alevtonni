import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pionni del Alevtonni — Ручные итальянские пионы для интерьера',
  description:
    'Итальянская душа в вашем интерьере: скульптурные пионы ручной работы из премиальных итальянских материалов для офисов, бутиков и резиденций.',
  openGraph: {
    title: 'Pionni del Alevtonni — Ручные итальянские пионы для интерьера',
    description:
      'Скульптурные пионы ручной работы из премиальных итальянских материалов для офисов, бутиков и резиденций.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pionni del Alevtonni — Ручные итальянские пионы для интерьера',
    description:
      'Скульптурные пионы ручной работы из премиальных итальянских материалов для офисов, бутиков и резиденций.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.className}>
      <body suppressHydrationWarning className="text-white selection:bg-[#2C5C88] selection:text-white">
        {children}
      </body>
    </html>
  );
}

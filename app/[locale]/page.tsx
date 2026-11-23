import { setRequestLocale } from 'next-intl/server';
import AtelierLanding from '@/components/AtelierLanding';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AtelierLanding />;
}

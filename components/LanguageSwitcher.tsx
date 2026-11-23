'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';

const LOCALES: { code: AppLocale; short: string; label: string }[] = [
  { code: 'ru', short: 'RU', label: 'Русский' },
  { code: 'ro', short: 'RO', label: 'Română' },
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'bg', short: 'BG', label: 'Български' },
  { code: 'lt', short: 'LT', label: 'Lietuvių' },
];

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'inline';
  onAfterSelect?: () => void;
}

export default function LanguageSwitcher({
  variant = 'dropdown',
  onAfterSelect,
}: LanguageSwitcherProps) {
  const t = useTranslations('nav');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const current = LOCALES.find((item) => item.code === locale) ?? LOCALES[0];

  const handleSelect = (nextLocale: AppLocale) => {
    setOpen(false);
    if (nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale });
    }
    onAfterSelect?.();
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (variant === 'inline') {
    return (
      <div
        role="group"
        aria-label={t('languageAria')}
        className="flex flex-wrap items-center gap-1.5"
      >
        {LOCALES.map((item) => {
          const isActive = item.code === locale;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              aria-current={isActive ? 'true' : undefined}
              className={`cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#2C5C88] text-white'
                  : 'border border-white/10 bg-white/[0.04] text-neutral-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.short}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t('languageAria')}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-neutral-200 whitespace-nowrap transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
      >
        <Globe className="h-3.5 w-3.5 text-[#5b9bd5]" aria-hidden="true" />
        <span>{current.short}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('languageAria')}
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-white/15 bg-[#090a0e]/95 p-1 shadow-2xl backdrop-blur-xl"
        >
          {LOCALES.map((item) => {
            const isActive = item.code === locale;
            return (
              <li key={item.code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                    isActive
                      ? 'bg-[#2C5C88] font-semibold text-white'
                      : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[11px] opacity-75">
                    {item.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

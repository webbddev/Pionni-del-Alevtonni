'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Flower, Phone, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  onOpenOrderModal: (defaultCollection?: string) => void;
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function Navbar({ onOpenOrderModal }: NavbarProps) {
  const t = useTranslations('nav');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#catalog', label: t('catalog') },
    { href: '#metrics', label: t('metrics') },
    { href: '#reviews', label: t('reviews') },
    { href: '#contact', label: t('contact') },
  ];

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/45 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 lg:gap-6 lg:px-8 xl:gap-8 xl:px-10">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#hero"
            className="shrink-0 whitespace-nowrap text-base font-bold tracking-tight text-white transition-opacity hover:opacity-90 sm:text-lg xl:text-xl"
          >
            Pionni del Alevtonni
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="shrink-0 whitespace-nowrap text-sm text-neutral-300 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Language Switcher + Phone + Primary action */}
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3 xl:gap-4">
            <div className="hidden sm:block">
              <LanguageSwitcher variant="dropdown" />
            </div>

            <a
              href="tel:+37378585585"
              aria-label={t('callAria')}
              className="hidden items-center gap-2 whitespace-nowrap text-sm font-medium text-neutral-200 tabular-nums transition-colors duration-200 hover:text-white xl:inline-flex"
            >
              <Phone className="h-4 w-4 text-[#5b9bd5]" aria-hidden="true" />
              <span>+373 785 85 585</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenOrderModal()}
              className="hidden shrink-0 cursor-pointer whitespace-nowrap rounded-lg bg-[#2C5C88] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#3a7aad] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5] sm:inline-flex"
            >
              {t('order')}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                    className="inline-flex"
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="flower-menu"
                    initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                    className="inline-flex"
                  >
                    <Flower className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-drawer"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
              className="origin-top border-t border-white/10 bg-[#050505]/95 px-6 py-5 backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{
                      duration: 0.22,
                      delay: index * 0.04,
                      ease: EASE_OUT_EXPO,
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base text-neutral-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </motion.a>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.16, ease: EASE_OUT_EXPO }}
                  className="pt-1 sm:hidden"
                >
                  <LanguageSwitcher
                    variant="inline"
                    onAfterSelect={() => setMobileMenuOpen(false)}
                  />
                </motion.div>

                <motion.a
                  href="tel:+37378585585"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.2, ease: EASE_OUT_EXPO }}
                  className="mt-1 inline-flex items-center gap-2 text-base font-medium text-[#7ab3e6] tabular-nums"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>+373 785 85 585</span>
                </motion.a>

                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.24, ease: EASE_OUT_EXPO }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrderModal();
                  }}
                  className="mt-1 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#2C5C88] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3a7aad] sm:hidden"
                >
                  {t('orderMobile')}
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}

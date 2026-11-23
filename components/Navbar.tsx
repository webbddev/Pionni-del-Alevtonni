'use client';

import { useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenOrderModal: (defaultCollection?: string) => void;
}

const NAV_LINKS = [
  { href: '#catalog', label: 'Коллекции' },
  { href: '#metrics', label: 'Мастерство' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contact', label: 'Контакты' },
];

export default function Navbar({ onOpenOrderModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/45 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4 sm:px-10">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#hero"
          className="shrink-0 whitespace-nowrap text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90 sm:text-xl"
        >
          Pionni del Alevtonni
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Основная навигация" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 whitespace-nowrap text-sm text-neutral-300 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Clickable phone contact + Primary action */}
        <div className="flex shrink-0 items-center gap-4">
          <a
            href="tel:+37378585585"
            aria-label="Позвонить по номеру +373 785 85 585"
            className="hidden items-center gap-2 whitespace-nowrap text-sm font-medium text-neutral-200 tabular-nums transition-colors duration-200 hover:text-white lg:inline-flex"
          >
            <Phone className="h-4 w-4 text-[#5b9bd5]" aria-hidden="true" />
            <span>+373 785 85 585</span>
          </a>

          <button
            type="button"
            onClick={() => onOpenOrderModal()}
            className="hidden shrink-0 cursor-pointer whitespace-nowrap rounded-lg bg-[#2C5C88] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#3a7aad] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b9bd5] sm:inline-flex"
          >
            Заказать
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#050505]/95 px-6 py-5 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-neutral-200 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+37378585585"
              className="mt-2 inline-flex items-center gap-2 text-base font-medium text-[#7ab3e6] tabular-nums"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>+373 785 85 585</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal();
              }}
              className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-[#2C5C88] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3a7aad]"
            >
              Заказать композицию
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

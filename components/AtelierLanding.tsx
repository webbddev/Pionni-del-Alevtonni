'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';
import ScrollVideoBackground from './ScrollVideoBackground';
import Navbar from './Navbar';

type CategoryKey = 'all' | 'boutique' | 'office' | 'residence';
type ItemId = 'nero-di-milano' | 'aeterna-velluto' | 'palazzo-grand' | 'botanica-pura';

interface CatalogMeta {
  id: ItemId;
  title: string;
  category: Exclude<CategoryKey, 'all'>;
  price: string;
  image: string;
}

interface MetricEntry {
  value: string;
  label: string;
  detail: string;
}

interface ReviewEntry {
  quote: string;
  author: string;
  role: string;
  context: string;
}

const CATALOG_META: CatalogMeta[] = [
  {
    id: 'nero-di-milano',
    title: 'Nero di Milano',
    category: 'boutique',
    price: '€ 890',
    image: '/images/peony-boutique.jpg',
  },
  {
    id: 'aeterna-velluto',
    title: 'Aeterna Velluto',
    category: 'office',
    price: '€ 640',
    image: '/images/peony-office.jpg',
  },
  {
    id: 'palazzo-grand',
    title: 'Palazzo Grand',
    category: 'boutique',
    price: '€ 1 450',
    image: '/images/peony-lounge.jpg',
  },
  {
    id: 'botanica-pura',
    title: 'Botanica Pura',
    category: 'residence',
    price: '€ 480',
    image: '/images/peony-atelier.jpg',
  },
];

const FILTER_KEYS: CategoryKey[] = ['all', 'boutique', 'office', 'residence'];

export default function AtelierLanding() {
  const t = useTranslations();

  const heroRef = useRef<HTMLElement | null>(null);
  const cardsTriggerRef = useRef<HTMLDivElement | null>(null);
  const fixedCardsRef = useRef<HTMLDivElement | null>(null);
  const cardsGridRef = useRef<HTMLDivElement | null>(null);
  const sectionThreeInnerRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const [sectionThreeVisible, setSectionThreeVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CategoryKey>('all');

  // Order modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [modalName, setModalName] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalSpace, setModalSpace] = useState('boutique');
  const [modalError, setModalError] = useState('');
  const [modalSubmitted, setModalSubmitted] = useState(false);

  // Contact section form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSpace, setContactSpace] = useState('office');
  const [contactComment, setContactComment] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const metricsList = t.raw('metrics.items') as MetricEntry[];
  const reviewsList = t.raw('reviews.items') as ReviewEntry[];

  const filteredItems =
    activeFilter === 'all'
      ? CATALOG_META
      : CATALOG_META.filter((item) => item.category === activeFilter);

  const openOrderModal = (collectionTitle?: string) => {
    setSelectedCollection(collectionTitle || t('modal.defaultCollection'));
    setModalSubmitted(false);
    setModalError('');
    setModalOpen(true);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
      anchors: { offset: -80 },
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (modalOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  // Hero fade on scroll
  useEffect(() => {
    const updateHeroOpacity = () => {
      if (!heroRef.current) return;
      const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.3));
      heroRef.current.style.opacity = String(fade);
    };
    updateHeroOpacity();
    window.addEventListener('scroll', updateHeroOpacity, { passive: true });
    return () => window.removeEventListener('scroll', updateHeroOpacity);
  }, []);

  // Fixed cards horizontal mask reveal synced with scroll
  useEffect(() => {
    let rafId = 0;

    const tickCards = () => {
      const trigger = cardsTriggerRef.current;
      const fixedCards = fixedCardsRef.current;
      const cardsGrid = cardsGridRef.current;

      if (trigger && fixedCards && cardsGrid) {
        const rect = trigger.getBoundingClientRect();
        const triggerTop = rect.top + window.scrollY;
        const triggerHeight = rect.height;
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        const start = triggerTop - vh * 0.5;
        const end = triggerTop + triggerHeight - vh * 0.3;
        const range = end - start;

        let progress = range > 0 ? (scrollY - start) / range : 0;
        progress = Math.max(0, Math.min(1, progress));

        const isActive = scrollY >= start - vh * 0.2 && scrollY <= end + vh * 0.3;
        const fadeIn = Math.min(1, Math.max(0, (scrollY - (start - vh * 0.2)) / (vh * 0.2)));
        const fadeOut = Math.min(1, Math.max(0, (end + vh * 0.3 - scrollY) / (vh * 0.3)));
        const containerOpacity = isActive ? Math.min(fadeIn, fadeOut) : 0;

        fixedCards.style.opacity = String(containerOpacity);
        fixedCards.style.pointerEvents = containerOpacity > 0.1 ? 'auto' : 'none';

        const isMobile = window.innerWidth < 768;
        const revealPct = progress * 130;
        if (isMobile) {
          const mask = `linear-gradient(to bottom, black ${revealPct}%, transparent ${revealPct + 20}%)`;
          cardsGrid.style.maskImage = mask;
          cardsGrid.style.webkitMaskImage = mask;
        } else {
          const mask = `linear-gradient(to right, black ${revealPct}%, transparent ${revealPct + 15}%)`;
          cardsGrid.style.maskImage = mask;
          cardsGrid.style.webkitMaskImage = mask;
        }
      }

      rafId = requestAnimationFrame(tickCards);
    };

    rafId = requestAnimationFrame(tickCards);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Section 3 IntersectionObserver
  useEffect(() => {
    const target = sectionThreeInnerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionThreeVisible(true);
          observer.unobserve(target);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7;
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim()) {
      setModalError(t('modal.errorName'));
      return;
    }
    if (!validatePhone(modalPhone)) {
      setModalError(t('modal.errorPhone'));
      return;
    }
    setModalError('');
    setModalSubmitted(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      setContactError(t('contact.form.errorName'));
      return;
    }
    if (!validatePhone(contactPhone)) {
      setContactError(t('contact.form.errorPhone'));
      return;
    }
    setContactError('');
    setContactSubmitted(true);
  };

  return (
    <div className="relative min-h-screen text-white">
      <ScrollVideoBackground />
      <Navbar onOpenOrderModal={openOrderModal} />

      {/* Fixed Cards Overlay */}
      <div
        ref={fixedCardsRef}
        id="fixed-cards"
        className="pointer-events-none fixed right-0 bottom-0 left-0 z-[4] bg-gradient-to-t from-black/85 via-black/55 to-transparent px-4 py-8 opacity-0 sm:px-10 sm:py-10"
      >
        <div
          ref={cardsGridRef}
          className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-10"
        >
          <div className="card">
            <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl">
              {t('pillars.p1Title')}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-300">
              {t('pillars.p1Text')}
            </p>
          </div>
          <div className="card">
            <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl">
              {t('pillars.p2Title')}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-300">
              {t('pillars.p2Text')}
            </p>
          </div>
          <div className="card">
            <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl">
              {t('pillars.p3Title')}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-300">
              {t('pillars.p3Text')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Flow */}
      <main id="content" className="relative z-[2]">
        {/* Section 1: Hero */}
        <section
          ref={heroRef}
          id="hero"
          className="relative flex h-screen w-full flex-col"
        >
          <div
            className="gradient-overlay pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.18), transparent)',
            }}
            aria-hidden="true"
          />

          <div className="content relative z-10 flex flex-1 flex-col items-center justify-end px-6 pb-20 text-center sm:pb-24">
            <p className="subtitle mb-4 text-xs tracking-[0.14em] text-neutral-300 uppercase sm:text-sm">
              {t('hero.subtitle')}
            </p>
            <h1
              className="max-w-4xl font-semibold tracking-tight text-white"
              style={{
                fontSize: 'clamp(1.85rem, 4.8vw, 3.75rem)',
                lineHeight: 1.15,
                textWrap: 'balance',
              }}
            >
              {t('hero.titlePrefix')}{' '}
              <span className="underlined relative inline-block">
                <span
                  className="line absolute bottom-1 left-0 h-[10px] w-full rounded-[2px] bg-[#2C5C88]"
                  aria-hidden="true"
                />
                <span className="relative">{t('hero.titleHighlight')}</span>
              </span>
            </h1>

            <div className="ctas mt-10 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
              <a
                href="tel:+37378585585"
                className="code-box flex items-center gap-2.5 rounded-lg border border-gray-700/60 bg-[#1a1a1a]/90 px-7 py-3.5 text-sm text-gray-200 backdrop-blur-sm transition-colors duration-200 hover:border-[#2C5C88] hover:text-white"
              >
                <span className="prompt font-mono text-sm text-[#5b9bd5]">&gt;</span>
                <span className="font-mono tabular-nums">+373 785 85 585</span>
              </a>

              <a
                href="#catalog"
                className="cta-btn inline-flex items-center gap-2 rounded-lg bg-[#2C5C88] px-8 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#3a7aad]"
              >
                <span>{t('hero.cta')}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <a
            href="#cards-trigger"
            aria-label={t('hero.scrollAria')}
            className="bounce-arrow relative z-10 flex justify-center pb-8"
          >
            <ChevronDown
              className="animate-atelier-bounce h-6 w-6 text-neutral-400"
              aria-hidden="true"
            />
          </a>
        </section>

        {/* Scroll Spacer */}
        <div className="h-[150vh]" aria-hidden="true" />

        {/* Cards Trigger Zone */}
        <div ref={cardsTriggerRef} id="cards-trigger" className="h-[200vh]" aria-hidden="true" />

        {/* Spacer */}
        <div className="h-[100vh]" aria-hidden="true" />

        {/* Section 3: Reveal */}
        <section
          id="section-three"
          className="relative flex min-h-screen items-end justify-center px-6 pb-20 sm:px-10 sm:pb-32"
        >
          <div
            ref={sectionThreeInnerRef}
            id="section-three-inner"
            className={`relative z-10 flex flex-col items-center text-center transition-all duration-1000 ease-out ${
              sectionThreeVisible
                ? 'translate-y-0 opacity-100 blur-none'
                : 'translate-y-8 opacity-0 blur-[8px]'
            }`}
          >
            <p className="mb-3 text-base text-neutral-300">
              {t('reveal.lead')}
            </p>
            <h2
              className="font-bold tracking-tight text-white"
              style={{
                fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
                lineHeight: 1.08,
                textWrap: 'balance',
              }}
            >
              {t('reveal.brand')}
            </h2>
          </div>
        </section>

        {/* Studio Continuation Surface */}
        <div className="relative z-10 border-t border-white/[0.08] bg-[#010101]/90 backdrop-blur-md">
          {/* Studio Section 4: Catalog Showcase */}
          <section id="catalog" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
            <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="mb-3 text-xs tracking-[0.14em] text-[#7ab3e6] uppercase">
                  {t('catalog.eyebrow')}
                </p>
                <h2
                  className="font-semibold tracking-tight text-white"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                    lineHeight: 1.15,
                    textWrap: 'balance',
                  }}
                >
                  {t('catalog.heading')}
                </h2>
              </div>

              {/* Interactive Category Filter */}
              <div
                role="tablist"
                aria-label={t('catalog.filterAria')}
                className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1"
              >
                {FILTER_KEYS.map((key) => {
                  const active = activeFilter === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveFilter(key)}
                      className={`cursor-pointer rounded-md px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors duration-200 sm:text-sm ${
                        active
                          ? 'bg-[#2C5C88] text-white'
                          : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {t(`catalog.filters.${key}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] transition-colors duration-200 hover:border-white/25"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0c0c0f]">
                    <Image
                      src={item.image}
                      alt={t(`catalog.items.${item.id}.alt`)}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      referrerPolicy="no-referrer"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-7 sm:p-8">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                        <span>{t(`catalog.items.${item.id}.categoryLabel`)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{t(`catalog.items.${item.id}.specs`)}</span>
                      </div>

                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-2xl font-semibold tracking-tight text-white">
                          {item.title}
                        </h3>
                        <span className="shrink-0 text-xl font-semibold text-[#7ab3e6] tabular-nums">
                          {item.price}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                        {t(`catalog.items.${item.id}.description`)}
                      </p>
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                      <span className="text-xs text-neutral-400">
                        {t('catalog.customPalette')}
                      </span>
                      <button
                        type="button"
                        onClick={() => openOrderModal(item.title)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#2C5C88] px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap transition-colors duration-200 hover:bg-[#3a7aad]"
                      >
                        <span>{t('catalog.orderBtn')}</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Studio Section 5: Quantitative Advantages */}
          <section
            id="metrics"
            className="scroll-mt-24 border-t border-white/[0.08] bg-white/[0.015] px-6 py-24 sm:px-10 sm:py-28"
          >
            <div className="mx-auto max-w-6xl">
              <div className="mb-14 max-w-2xl">
                <p className="mb-3 text-xs tracking-[0.14em] text-[#7ab3e6] uppercase">
                  {t('metrics.eyebrow')}
                </p>
                <h2
                  className="font-semibold tracking-tight text-white"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                    lineHeight: 1.18,
                    textWrap: 'balance',
                  }}
                >
                  {t('metrics.heading')}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {metricsList.map((metric) => (
                  <div key={metric.label} className="border-t border-white/15 pt-6">
                    <div className="text-4xl font-bold tracking-tight text-white tabular-nums sm:text-5xl">
                      {metric.value}
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">
                      {metric.label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                      {metric.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Studio Section 6: Client Testimonials */}
          <section
            id="reviews"
            className="mx-auto max-w-6xl scroll-mt-24 border-t border-white/[0.08] px-6 py-24 sm:px-10 sm:py-32"
          >
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-xs tracking-[0.14em] text-[#7ab3e6] uppercase">
                {t('reviews.eyebrow')}
              </p>
              <h2
                className="font-semibold tracking-tight text-white"
                style={{
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                  lineHeight: 1.18,
                  textWrap: 'balance',
                }}
              >
                {t('reviews.heading')}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {reviewsList.map((review) => (
                <blockquote
                  key={review.author}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.025] p-7 sm:p-8"
                >
                  <p className="text-sm leading-relaxed text-neutral-200 sm:text-base">
                    «{review.quote}»
                  </p>
                  <footer className="mt-8 border-t border-white/10 pt-5">
                    <div className="font-semibold text-white">{review.author}</div>
                    <div className="mt-1 text-xs text-neutral-400">
                      {review.role}
                    </div>
                    <div className="mt-2 text-xs text-[#7ab3e6]">
                      {review.context}
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>

          {/* Studio Section 7: Contacts & Request Form */}
          <section
            id="contact"
            className="scroll-mt-24 border-t border-white/[0.08] bg-white/[0.015] px-6 py-24 sm:px-10 sm:py-32"
          >
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <p className="mb-3 text-xs tracking-[0.14em] text-[#7ab3e6] uppercase">
                  {t('contact.eyebrow')}
                </p>
                <h2
                  className="font-semibold tracking-tight text-white"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                    lineHeight: 1.15,
                    textWrap: 'balance',
                  }}
                >
                  {t('contact.heading')}
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-neutral-300 sm:text-base">
                  {t('contact.description')}
                </p>

                <div className="mt-10 border-t border-white/10 pt-8">
                  <div className="text-xs tracking-[0.12em] text-neutral-400 uppercase">
                    {t('contact.phoneLabel')}
                  </div>
                  <a
                    href="tel:+37378585585"
                    className="mt-3 inline-flex items-center gap-3 text-2xl font-semibold text-white tabular-nums transition-colors hover:text-[#7ab3e6] sm:text-3xl"
                  >
                    <Phone className="h-6 w-6 text-[#5b9bd5]" aria-hidden="true" />
                    <span>+373 785 85 585</span>
                  </a>
                  <p className="mt-3 text-sm text-neutral-400">
                    {t('contact.hours')}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#08090c] p-7 sm:p-10 lg:col-span-7">
                {contactSubmitted ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#2C5C88]/25 text-[#7ab3e6]">
                      <Check className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">
                      {t('contact.form.successTitle')}
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-300">
                      {t('contact.form.successPrefix')} {contactName}.{' '}
                      {t('contact.form.successMiddle')}{' '}
                      <span className="font-medium text-white tabular-nums">
                        {contactPhone}
                      </span>{' '}
                      {t('contact.form.successSuffix')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setContactSubmitted(false);
                        setContactName('');
                        setContactPhone('');
                        setContactComment('');
                      }}
                      className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/5"
                    >
                      {t('contact.form.reset')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} noValidate className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-2 block text-xs font-medium text-neutral-300"
                        >
                          {t('contact.form.nameLabel')}
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder={t('contact.form.namePlaceholder')}
                          className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-[#5b9bd5] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="mb-2 block text-xs font-medium text-neutral-300"
                        >
                          {t('contact.form.phoneLabel')}
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder={t('contact.form.phonePlaceholder')}
                          className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 tabular-nums transition-colors focus:border-[#5b9bd5] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-space"
                        className="mb-2 block text-xs font-medium text-neutral-300"
                      >
                        {t('contact.form.spaceLabel')}
                      </label>
                      <select
                        id="contact-space"
                        value={contactSpace}
                        onChange={(e) => setContactSpace(e.target.value)}
                        className="w-full rounded-lg border border-white/15 bg-[#0f1116] px-4 py-3 text-sm text-white transition-colors focus:border-[#5b9bd5] focus:outline-none"
                      >
                        <option value="office">{t('contact.form.spaces.office')}</option>
                        <option value="boutique">{t('contact.form.spaces.boutique')}</option>
                        <option value="hotel">{t('contact.form.spaces.hotel')}</option>
                        <option value="residence">{t('contact.form.spaces.residence')}</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-comment"
                        className="mb-2 block text-xs font-medium text-neutral-300"
                      >
                        {t('contact.form.commentLabel')}
                      </label>
                      <textarea
                        id="contact-comment"
                        rows={3}
                        value={contactComment}
                        onChange={(e) => setContactComment(e.target.value)}
                        placeholder={t('contact.form.commentPlaceholder')}
                        className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-[#5b9bd5] focus:outline-none"
                      />
                    </div>

                    {contactError && (
                      <p role="alert" className="text-sm text-rose-400">
                        {contactError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2C5C88] px-6 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#3a7aad]"
                    >
                      <span>{t('contact.form.submit')}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 px-6 py-10 sm:px-10">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="text-base font-bold tracking-tight text-white">
                  Pionni del Alevtonni
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  {t('footer.tagline')}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-300">
                <a href="#catalog" className="transition-colors hover:text-white">
                  {t('nav.catalog')}
                </a>
                <a href="#metrics" className="transition-colors hover:text-white">
                  {t('nav.metrics')}
                </a>
                <a href="#reviews" className="transition-colors hover:text-white">
                  {t('nav.reviews')}
                </a>
                <a
                  href="tel:+37378585585"
                  className="inline-flex items-center gap-2 font-medium text-white tabular-nums transition-colors hover:text-[#7ab3e6]"
                >
                  <Phone className="h-4 w-4 text-[#5b9bd5]" aria-hidden="true" />
                  <span>+373 785 85 585</span>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Order Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg rounded-xl border border-white/15 bg-[#090a0e] p-7 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label={t('modal.closeAria')}
              className="absolute top-5 right-5 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {modalSubmitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2C5C88]/25 text-[#7ab3e6]">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 id="order-modal-title" className="text-xl font-semibold text-white">
                  {t('modal.successTitlePrefix')}
                  {selectedCollection}
                  {t('modal.successTitleSuffix')}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  {t('modal.successMiddle')}{' '}
                  <span className="font-medium text-white tabular-nums">{modalPhone}</span>{' '}
                  {t('modal.successSuffix')}
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#2C5C88] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3a7aad]"
                >
                  {t('modal.back')}
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs tracking-[0.12em] text-[#7ab3e6] uppercase">
                  {t('modal.eyebrow')}
                </p>
                <h3 id="order-modal-title" className="mt-2 text-2xl font-semibold text-white">
                  {selectedCollection}
                </h3>
                <p className="mt-2 text-sm text-neutral-400">
                  {t('modal.subtitlePrefix')}{' '}
                  <a
                    href="tel:+37378585585"
                    className="text-neutral-200 underline decoration-[#2C5C88] underline-offset-4 tabular-nums"
                  >
                    +373 785 85 585
                  </a>
                  .
                </p>

                <form onSubmit={handleModalSubmit} noValidate className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="modal-name"
                      className="mb-1.5 block text-xs font-medium text-neutral-300"
                    >
                      {t('modal.nameLabel')}
                    </label>
                    <input
                      id="modal-name"
                      type="text"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      placeholder={t('modal.namePlaceholder')}
                      className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#5b9bd5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-phone"
                      className="mb-1.5 block text-xs font-medium text-neutral-300"
                    >
                      {t('modal.phoneLabel')}
                    </label>
                    <input
                      id="modal-phone"
                      type="tel"
                      value={modalPhone}
                      onChange={(e) => setModalPhone(e.target.value)}
                      placeholder={t('modal.phonePlaceholder')}
                      className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-neutral-500 tabular-nums focus:border-[#5b9bd5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-space"
                      className="mb-1.5 block text-xs font-medium text-neutral-300"
                    >
                      {t('modal.spaceLabel')}
                    </label>
                    <select
                      id="modal-space"
                      value={modalSpace}
                      onChange={(e) => setModalSpace(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-[#0f1116] px-4 py-2.5 text-sm text-white focus:border-[#5b9bd5] focus:outline-none"
                    >
                      <option value="boutique">{t('modal.spaces.boutique')}</option>
                      <option value="office">{t('modal.spaces.office')}</option>
                      <option value="hotel">{t('modal.spaces.hotel')}</option>
                      <option value="residence">{t('modal.spaces.residence')}</option>
                    </select>
                  </div>

                  {modalError && (
                    <p role="alert" className="text-sm text-rose-400">
                      {modalError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2C5C88] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#3a7aad]"
                  >
                    <span>{t('modal.submit')}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

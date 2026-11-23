'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
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

interface CatalogItem {
  id: string;
  title: string;
  category: Exclude<CategoryKey, 'all'>;
  categoryLabel: string;
  specs: string;
  description: string;
  price: string;
  image: string;
  alt: string;
}

const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'nero-di-milano',
    title: 'Nero di Milano',
    category: 'boutique',
    categoryLabel: 'Бутики и шоурумы',
    specs: 'Высота 95 см · 11 бутонов · Итальянский софт-тач',
    description:
      'Пудровые и кремовые пионы в монолитном матовом кашпо из вулканического камня. Созданы для центральных подиумов и витрин концепт-сторов.',
    price: '€ 890',
    image: '/images/peony-boutique.jpg',
    alt: 'Композиция ручных итальянских пионов Nero di Milano в интерьере бутика',
  },
  {
    id: 'aeterna-velluto',
    title: 'Aeterna Velluto',
    category: 'office',
    categoryLabel: 'Офисы и ресепшн',
    specs: 'Высота 78 см · 9 бутонов · Бархатный композит',
    description:
      'Контрастный ансамбль молочно-белых и глубоких винных пионов на стойку ресепшн или стол переговоров. Подчеркивает архитектурную строгость пространства.',
    price: '€ 640',
    image: '/images/peony-office.jpg',
    alt: 'Интерьерная композиция из белых и бордовых пионов Aeterna Velluto на стойке ресепшн',
  },
  {
    id: 'palazzo-grand',
    title: 'Palazzo Grand',
    category: 'boutique',
    categoryLabel: 'Бутики и отели',
    specs: 'Высота 135 см · 15 бутонов · Дымчатое стекло',
    description:
      'Масштабная вертикальная инсталляция оттенка шампань и пыльной розы в вазе ручной выдувки. Притягивает внимание в лаунж-зонах и холлах.',
    price: '€ 1 450',
    image: '/images/peony-lounge.jpg',
    alt: 'Высокая интерьерная инсталляция из пионов Palazzo Grand в лаунж-зале',
  },
  {
    id: 'botanica-pura',
    title: 'Botanica Pura',
    category: 'residence',
    categoryLabel: 'Частные резиденции',
    specs: 'Высота 65 см · 7 бутонов · Ручная тонировка',
    description:
      'Камерный букет с тончайшей ручной проработкой каждого лепестка и живой фактурой листа. Идеален для гостиных, кабинетов и приватных гардеробных.',
    price: '€ 480',
    image: '/images/peony-atelier.jpg',
    alt: 'Мастерская работа над лепестками итальянского пиона Botanica Pura',
  },
];

const METRICS = [
  {
    value: '140+',
    label: 'Лепестков ручной формовки',
    detail: 'Каждый крупный бутон собирается из десятков индивидуально вырезанных и тонированных лепестков.',
  },
  {
    value: '12 лет',
    label: 'Стойкости оттенка',
    detail: 'Итальянский светостойкий пигмент сохраняет глубину цвета под витринными софитами и солнцем.',
  },
  {
    value: '18 ч',
    label: 'Работы мастера на сет',
    detail: 'Кропотливая скульптурная пластика стеблей и калибровка бутонов под пропорции вашего помещения.',
  },
  {
    value: '0 €',
    label: 'Затрат на уход и замену',
    detail: 'Никакого полива, осыпающихся лепестков и еженедельных счетов флористическим службам.',
  },
];

const REVIEWS = [
  {
    quote:
      'После установки композиции Nero di Milano в центре зала клиенты стали чаще фотографировать витрину и задерживаться у примерочных. За восемь месяцев цветы не потеряли ни свежести формы, ни матового сияния.',
    author: 'Валерия Морозова',
    role: 'Управляющая концепт-стора Atelier Nove',
    context: 'Бутик женской одежды · Композиция 95 см',
  },
  {
    quote:
      'Живые букеты на ресепшн архитектурного бюро требовали замены каждые четыре дня. Итальянские пионы Aeterna Velluto выглядят настолько живо, что партнёры при встрече наклоняются, чтобы ощутить аромат.',
    author: 'Андрей Кравченко',
    role: 'Управляющий партнёр K-Arch Studio',
    context: 'Офис и переговорная · Экономия до € 3 200 в год',
  },
  {
    quote:
      'Для лобби-бара нам требовался акцент, устойчивый к круглосуточному кондиционированию и тёплому вечернему свету. Palazzo Grand стал визуальным якорем интерьера с первого дня.',
    author: 'Елена Руссу',
    role: 'Директор по интерьерам Grand Lounge',
    context: 'Гостиничный холл · Индивидуальная высота 135 см',
  },
];

const FILTER_TABS: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'Все коллекции' },
  { key: 'boutique', label: 'Для бутиков' },
  { key: 'office', label: 'Для офисов' },
  { key: 'residence', label: 'Для резиденций' },
];

export default function AtelierLanding() {
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
  const [selectedCollection, setSelectedCollection] = useState<string>('Nero di Milano');
  const [modalName, setModalName] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalSpace, setModalSpace] = useState('Бутик / Магазин');
  const [modalError, setModalError] = useState('');
  const [modalSubmitted, setModalSubmitted] = useState(false);

  // Contact section form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSpace, setContactSpace] = useState('Офис / Ресепшн');
  const [contactComment, setContactComment] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const filteredItems =
    activeFilter === 'all'
      ? CATALOG_ITEMS
      : CATALOG_ITEMS.filter((item) => item.category === activeFilter);

  const openOrderModal = (collectionTitle?: string) => {
    setSelectedCollection(collectionTitle || 'Индивидуальный подбор');
    setModalSubmitted(false);
    setModalError('');
    setModalOpen(true);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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

  // Hero fade on scroll (1-to-1 from spec)
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

  // Fixed cards horizontal mask reveal synced with scroll (1-to-1 from spec)
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

  // Section 3 IntersectionObserver (1-to-1 from spec)
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
      setModalError('Пожалуйста, укажите ваше имя.');
      return;
    }
    if (!validatePhone(modalPhone)) {
      setModalError('Введите корректный номер телефона для связи.');
      return;
    }
    setModalError('');
    setModalSubmitted(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      setContactError('Пожалуйста, укажите ваше имя.');
      return;
    }
    if (!validatePhone(contactPhone)) {
      setContactError('Введите корректный номер телефона (минимум 7 цифр).');
      return;
    }
    setContactError('');
    setContactSubmitted(true);
  };

  return (
    <div className="relative min-h-screen text-white">
      <ScrollVideoBackground />
      <Navbar onOpenOrderModal={openOrderModal} />

      {/* Fixed Cards Overlay (Spec Section 2) */}
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
              01. Скульптурная лепка
            </h3>
            <p className="text-sm leading-relaxed text-neutral-300">
              Каждый пион формуется вручную итальянскими мастерами: десятки шелковистых лепестков передают живую пластику, утренний изгиб и глубину раскрытого бутона.
            </p>
          </div>
          <div className="card">
            <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl">
              02. Итальянский материал
            </h3>
            <p className="text-sm leading-relaxed text-neutral-300">
              Запатентованный софт-тач из Ломбардии неотличим на ощупь от живого цветка, не выгорает под витринными софитами и сохраняет архитектуру формы десятилетиями.
            </p>
          </div>
          <div className="card">
            <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl">
              03. Статус для бизнеса
            </h3>
            <p className="text-sm leading-relaxed text-neutral-300">
              От строгих офисных переговорных до модных бутиков — крупные пионы мгновенно задают атмосферу европейского салона и притягивают взгляды гостей.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Flow */}
      <main id="content" className="relative z-[2]">
        {/* Section 1: Hero (1-to-1 with Spec) */}
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
              Ручные пионы из Италии
            </p>
            <h1
              className="max-w-4xl font-semibold tracking-tight text-white"
              style={{
                fontSize: 'clamp(1.85rem, 4.8vw, 3.75rem)',
                lineHeight: 1.15,
                textWrap: 'balance',
              }}
            >
              Итальянская душа в{' '}
              <span className="underlined relative inline-block">
                <span
                  className="line absolute bottom-1 left-0 h-[10px] w-full rounded-[2px] bg-[#2C5C88]"
                  aria-hidden="true"
                />
                <span className="relative">вашем интерьере</span>
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
                <span>Подобрать коллекцию</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <a
            href="#cards-trigger"
            aria-label="Прокрутить вниз"
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

        {/* Section 3: Reveal (1-to-1 with Spec) */}
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
              Ателье интерьерной ботаники
            </p>
            <h2
              className="font-bold tracking-tight text-white"
              style={{
                fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
                lineHeight: 1.08,
                textWrap: 'balance',
              }}
            >
              Pionni del Alevtonni
            </h2>
          </div>
        </section>

        {/* Studio Continuation Surface */}
        <div className="relative z-10 border-t border-white/[0.08] bg-[#010101]/90 backdrop-blur-md">
          {/* Studio Section 4: Catalog Showcase with Prices */}
          <section id="catalog" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
            <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="mb-3 text-xs tracking-[0.14em] text-[#7ab3e6] uppercase">
                  Витрина коллекций
                </p>
                <h2
                  className="font-semibold tracking-tight text-white"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                    lineHeight: 1.15,
                    textWrap: 'balance',
                  }}
                >
                  Скульптурные композиции для офисов, бутиков и резиденций
                </h2>
              </div>

              {/* Interactive Category Filter */}
              <div
                role="tablist"
                aria-label="Фильтр коллекций по типу интерьера"
                className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1"
              >
                {FILTER_TABS.map((tab) => {
                  const active = activeFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`cursor-pointer rounded-md px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors duration-200 sm:text-sm ${
                        active
                          ? 'bg-[#2C5C88] text-white'
                          : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {tab.label}
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
                      alt={item.alt}
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
                        <span>{item.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.specs}</span>
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
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                      <span className="text-xs text-neutral-400">
                        Индивидуальная адаптация палитры
                      </span>
                      <button
                        type="button"
                        onClick={() => openOrderModal(item.title)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#2C5C88] px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap transition-colors duration-200 hover:bg-[#3a7aad]"
                      >
                        <span>Заказать</span>
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
                  Преимущества в цифрах
                </p>
                <h2
                  className="font-semibold tracking-tight text-white"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                    lineHeight: 1.18,
                    textWrap: 'balance',
                  }}
                >
                  Математика долговечного премиум-декора
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {METRICS.map((metric) => (
                  <div
                    key={metric.label}
                    className="border-t border-white/15 pt-6"
                  >
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
                Отзывы клиентов
              </p>
              <h2
                className="font-semibold tracking-tight text-white"
                style={{
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                  lineHeight: 1.18,
                  textWrap: 'balance',
                }}
              >
                Впечатление, которое работает на ваш бренд каждый день
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {REVIEWS.map((review) => (
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
                  Прямая связь с ателье
                </p>
                <h2
                  className="font-semibold tracking-tight text-white"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                    lineHeight: 1.15,
                    textWrap: 'balance',
                  }}
                >
                  Создадим композицию под архитектуру вашего зала
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-neutral-300 sm:text-base">
                  Подберём оттенок бутонов под палитру отделки, рассчитаем высоту кашпо для витрины или переговорной и организуем бережную доставку с профессиональной расстановкой.
                </p>

                <div className="mt-10 border-t border-white/10 pt-8">
                  <div className="text-xs tracking-[0.12em] text-neutral-400 uppercase">
                    Телефон для заказа и консультаций
                  </div>
                  <a
                    href="tel:+37378585585"
                    className="mt-3 inline-flex items-center gap-3 text-2xl font-semibold text-white tabular-nums transition-colors hover:text-[#7ab3e6] sm:text-3xl"
                  >
                    <Phone className="h-6 w-6 text-[#5b9bd5]" aria-hidden="true" />
                    <span>+373 785 85 585</span>
                  </a>
                  <p className="mt-3 text-sm text-neutral-400">
                    Ежедневно с 09:00 до 20:00 · Индивидуальный подбор по фото интерьера
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
                      Заявка принята
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-300">
                      Спасибо, {contactName}. Специалист ателье Pionni del Alevtonni свяжется с вами по телефону{' '}
                      <span className="font-medium text-white tabular-nums">{contactPhone}</span> в ближайшее время.
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
                      Отправить ещё одну заявку
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
                          Ваше имя
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Например, Елена"
                          className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-[#5b9bd5] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="mb-2 block text-xs font-medium text-neutral-300"
                        >
                          Телефон
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+373 785 85 585"
                          className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 tabular-nums transition-colors focus:border-[#5b9bd5] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-space"
                        className="mb-2 block text-xs font-medium text-neutral-300"
                      >
                        Тип пространства
                      </label>
                      <select
                        id="contact-space"
                        value={contactSpace}
                        onChange={(e) => setContactSpace(e.target.value)}
                        className="w-full rounded-lg border border-white/15 bg-[#0f1116] px-4 py-3 text-sm text-white transition-colors focus:border-[#5b9bd5] focus:outline-none"
                      >
                        <option value="Офис / Ресепшн">Офис / Ресепшн</option>
                        <option value="Бутик / Магазин">Бутик / Магазин</option>
                        <option value="Отель / Ресторан">Отель / Ресторан</option>
                        <option value="Частная резиденция">Частная резиденция</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-comment"
                        className="mb-2 block text-xs font-medium text-neutral-300"
                      >
                        Пожелания к оттенку и высоте
                      </label>
                      <textarea
                        id="contact-comment"
                        rows={3}
                        value={contactComment}
                        onChange={(e) => setContactComment(e.target.value)}
                        placeholder="Опишите интерьер, желаемую палитру или габариты зоны..."
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
                      <span>Запросить подбор композиции</span>
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
                  Ручные пионы из Италии для премиальных интерьеров · 2026
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-300">
                <a href="#catalog" className="transition-colors hover:text-white">
                  Коллекции
                </a>
                <a href="#metrics" className="transition-colors hover:text-white">
                  Мастерство
                </a>
                <a href="#reviews" className="transition-colors hover:text-white">
                  Отзывы
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
              aria-label="Закрыть окно заказа"
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
                  Заказ на «{selectedCollection}» оформлен
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  Наш флорист-декоратор позвонит вам на номер{' '}
                  <span className="font-medium text-white tabular-nums">{modalPhone}</span> для уточнения деталей вазы и времени доставки.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#2C5C88] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3a7aad]"
                >
                  Вернуться на сайт
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs tracking-[0.12em] text-[#7ab3e6] uppercase">
                  Персональный заказ
                </p>
                <h3 id="order-modal-title" className="mt-2 text-2xl font-semibold text-white">
                  {selectedCollection}
                </h3>
                <p className="mt-2 text-sm text-neutral-400">
                  Оставьте контакты, либо позвоните напрямую по номеру{' '}
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
                      Ваше имя
                    </label>
                    <input
                      id="modal-name"
                      type="text"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      placeholder="Ваше имя"
                      className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#5b9bd5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-phone"
                      className="mb-1.5 block text-xs font-medium text-neutral-300"
                    >
                      Номер телефона
                    </label>
                    <input
                      id="modal-phone"
                      type="tel"
                      value={modalPhone}
                      onChange={(e) => setModalPhone(e.target.value)}
                      placeholder="+373 785 85 585"
                      className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-neutral-500 tabular-nums focus:border-[#5b9bd5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-space"
                      className="mb-1.5 block text-xs font-medium text-neutral-300"
                    >
                      Пространство
                    </label>
                    <select
                      id="modal-space"
                      value={modalSpace}
                      onChange={(e) => setModalSpace(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-[#0f1116] px-4 py-2.5 text-sm text-white focus:border-[#5b9bd5] focus:outline-none"
                    >
                      <option value="Бутик / Магазин">Бутик / Магазин</option>
                      <option value="Офис / Ресепшн">Офис / Ресепшн</option>
                      <option value="Отель / Ресторан">Отель / Ресторан</option>
                      <option value="Частный интерьер">Частный интерьер</option>
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
                    <span>Подтвердить заявку</span>
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

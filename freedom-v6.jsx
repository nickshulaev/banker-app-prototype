import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Bell, Plus, ChevronRight, ChevronDown, X, ArrowLeftRight, MessageCircle, BarChart3, Wallet, TrendingUp, Star, Clock, CreditCard, Newspaper, LayoutList, LayoutGrid, Smartphone, Plane, Sofa, Zap, Phone, Globe, QrCode, Repeat, Send, Landmark, Tv, Bus, GraduationCap, Eye, EyeOff, ArrowLeft, ArrowDown, ArrowDownLeft, Snowflake, FileText, ShoppingCart, Utensils, Fuel, Wifi, Home, Ticket, Settings2, Check, User, Shield, LogOut, Palette } from "lucide-react";
import OnboardingFlow, { ONB_START, ONB_GATES, ONB_PRESETS, ONB_STEPS, SUMSUB_PHASES, SUMSUB_PHASE_LABELS } from "./onboarding.jsx";

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

const PENDING_REQUESTS = [
  { id: 1, type: "request", from: "Валентин Г.", amount: 2100, currency: "EUR", status: "ожидается", initials: "ВГ" },
  { id: 2, type: "request", from: "Алия К.", amount: 500, currency: "USD", status: "ожидается", initials: "АК" },
  { id: 3, type: "invoice", from: "ТОО Магнум", amount: 15800, currency: "KZT", status: "к оплате", initials: "М" },
];

const PROMOS = [
  { id: 1, title: "Частное размещение акций Freedom Holding Corp.", body: "С дисконтом 10%", cta: "Перейти", color: "#163300", textColor: "#9FE870" },
  { id: 2, title: "Кэшбэк до 5% на путешествия", body: "Весь март", cta: "Активировать", color: "#0F172A", textColor: "#FFFFFF" },
  { id: 3, title: "Депозит «Премиум» — до 18% годовых", body: "От 100 000 ₸", cta: "Открыть", color: "#FEF3C7", textColor: "#92400E" },
];

const PROMOS_EMPTY = [
  { id: 1, title: "Откройте счёт в Цифра банк", body: "Для поездок в Россию", cta: "Подробнее", color: "#0F172A", textColor: "#FFFFFF" },
  { id: 2, title: "Пополните карту и получите 1 000 ₸", body: "Приветственный бонус", cta: "Пополнить", color: "#163300", textColor: "#9FE870" },
];

const RECENT_TRANSFERS = [
  { id: 1, name: "Константин", surname: "К.", initials: "К", color: "#22C55E", photo: "🧑🏻‍💼", phone: "+7 701 234 56 78" },
  { id: 2, name: "Иван", surname: "В.", initials: "И", color: "#3B82F6", photo: "👨🏻", phone: "+7 777 111 22 33" },
  { id: 3, name: "Виктор", surname: "Д.", initials: "В", color: "#8B5CF6", photo: "🧔🏻", phone: "+7 705 987 65 43" },
  { id: 4, name: "Умар", surname: "Д.", initials: "У", color: "#F59E0B", photo: "👨🏽", phone: "+7 747 555 44 33" },
  { id: 5, name: "Ирина", surname: "У.", initials: "И", color: "#EC4899", photo: "👩🏼", phone: "+7 700 222 33 44" },
];

/* Устройства (real Devices module: «Это устройство», «В сети») */
const DEVICES = [
  { id: 1, name: "iPhone 15 Pro", note: "Алматы · Freedom Banker 6.0", current: true },
  { id: 2, name: "MacBook Pro · Safari", note: "Алматы · веб-версия", online: true },
  { id: 3, name: "iPad Air", note: "Астана · 3 дня назад" },
];

/* Языки (реальные lproj в репе: ru, kk, en, tg, uk, zh) */
const LANGUAGES = [
  { code: "ru", label: "Русский" },
  { code: "kk", label: "Қазақша" },
  { code: "en", label: "English" },
  { code: "tg", label: "Тоҷикӣ" },
  { code: "uk", label: "Українська" },
  { code: "zh", label: "中文" },
];

const FEATURED_NEWS = {
  id: 1, tag: "Срочное",
  title: "Freedom Bank запускает мультивалютные переводы без комиссии",
  subtitle: "Новый тарифный план для премиум-клиентов",
  author: "Редакция", time: "2 часа назад",
};

const FEATURED_NEWS_EMPTY = {
  id: 2, tag: "Гид",
  title: "Как начать пользоваться Freedom Banker",
  subtitle: "5 первых шагов для нового клиента",
  author: "Freedom Bank", time: "только что",
};

const CARD_PRODUCTS = [
  {
    bank: "Freedom KZ",
    cards: [
      { id: "superpickle", name: "SuperPickle", last4: "0088", primaryBalance: 190822.91, primaryCurrency: "USD",
        breakdown: [
          { currency: "KZT", amount: 35251706.16 },
          { currency: "USD", amount: 113324.68 },
          { currency: "KRW", amount: 30268.06 },
        ], color: "#84CC16", visual: "pickle", fcBalance: 409.18,
      },
      { id: "invest-prestige", name: "Invest Prestige Card", sub: "D75003 — Freedom24", last4: "0011",
        primaryBalance: 121445.05, primaryCurrency: "USD",
        breakdown: [
          { currency: "USD", amount: 115000.00 },
          { currency: "EUR", amount: 3500.00 },
          { currency: "KZT", amount: 1200000.00 },
        ], color: "#1E1B4B",
        visual: "prestige", fcBalance: 87.42,
      },
      { id: "harvey-queen", name: "Supercard Harvey Queen", last4: "0088", primaryBalance: 251722.06, primaryCurrency: "USD",
        breakdown: [
          { currency: "USD", amount: 251709.36 },
          { currency: "KZT", amount: 528.06 },
          { currency: "TRY", amount: 420.23 },
        ], color: "#F472B6", visual: "harvey", fcBalance: 287.42,
      },
    ],
  },
  {
    bank: "Cifra Bank",
    cards: [
      { id: "ru-card", name: "Ru Card", last4: "1222", primaryBalance: 32725.15, primaryCurrency: "USD",
        breakdown: [
          { currency: "KZT", amount: 1577523.88 },
          { currency: "USD", amount: 29258.06 },
          { currency: "EUR", amount: 0 },
        ], color: "#0D9488", visual: "ru-threads", fcBalance: 156.78,
      },
    ],
  },
];

const ACCOUNTS_LIST = [
  { id: "a1", name: "Текущий счёт", number: "KZ81 ALM3 X562 0014 5USD", balance: 12345.67, currency: "USD" },
  { id: "a2", name: "Евровый мой счёт", number: "KZ67 BTQ2 Y742 0007 88EU", balance: 8910.12, currency: "EUR" },
  { id: "a3", name: "Рублики", number: "KZ44 CNR9 Z812 0002 56RU", balance: 543210.50, currency: "RUB" },
  { id: "a4", name: "Евросы", number: "KZ95 DVN5 W932 0006 43EU", balance: 3475.89, currency: "EUR" },
  { id: "a5", name: "Мой счёт в USD", number: "KZ12 EK57 J452 0009 07US", balance: 25000.00, currency: "USD" },
];

const LOANS = [
  { id: "l1", name: "Долг Олексх Х.", returnDate: "31.10.2025", balance: 5250.00, currency: "KZT", baseAmount: 5000, rate: 5 },
  { id: "l2", name: "Долг Иван К.", returnDate: "01.06.2026", balance: 15990.90, currency: "KZT", baseAmount: 15500, rate: 3 },
];

const CREDITS = [
  { id: "c1", name: "Кредит на дом мечты", payoffDate: "31.10.2025", monthly: 12089.09, currency: "KZT", rate: 4.97, paidPercent: 62 },
  { id: "c2", name: "Машина", payoffDate: "01.02.2027", monthly: 223940.00, currency: "KZT", rate: 14.03, paidPercent: 35 },
];

const DEPOSITS = [
  { id: 1, name: 'Депозит «КОПИЛКА»', closingDate: "10 мар 2026", rate: 9.2, currency: "KZT", balance: 452145.41 },
  { id: 2, name: 'Депозит «КОПИЛКА»', closingDate: "03 фев 2027", rate: 1.0, currency: "USD", balance: 115700.60 },
  { id: 3, name: 'Депозит «КОПИЛКА»', closingDate: "07 дек 2026", rate: 16.0, currency: "KZT", balance: 18621557.07 },
  { id: 4, name: 'Депозит «КОПИЛКА»', closingDate: "31 мая 2027", rate: 0.8, currency: "EUR", balance: 51658.01 },
];

const BROKER_ACCOUNTS = [
  { group: "Freedom Broker", accounts: [
    { id: "KZ #713525", type: "Trade", currency: "USD", balance: 463.93 },
    { id: "KZ #D713525", type: "Savings", currency: "USD", balance: 358.42 },
  ]},
  { group: "TFOS", accounts: [
    { id: "ZA #1466005", type: "Trade", currency: "USD", balance: 632487.30 },
    { id: "ZA #D1466005", type: "Savings", currency: "USD", balance: 7206.81 },
  ]},
];

const EMPTY_CARD_PRODUCTS = [
  { bank: "Freedom KZ", cards: [{ id: "first-card", name: "DepositCard", last4: "4521", primaryBalance: 0, primaryCurrency: "KZT", breakdown: [], color: "#22C55E", visual: "fresh", fcBalance: 0 }] },
];

/* ═══════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════ */

const CURRENCY_META = {
  KZT: { symbol: "₸", flag: "🇰🇿", name: "Тенге" },
  USD: { symbol: "$", flag: "🇺🇸", name: "Доллар" },
  EUR: { symbol: "€", flag: "🇪🇺", name: "Евро" },
  RUB: { symbol: "₽", flag: "🇷🇺", name: "Рубль" },
  CNY: { symbol: "¥", flag: "🇨🇳", name: "Юань" },
  TRY: { symbol: "₺", flag: "🇹🇷", name: "Лира" },
  AED: { symbol: "د.إ", flag: "🇦🇪", name: "Дирхам" },
  KRW: { symbol: "₩", flag: "🇰🇷", name: "Вона" },
};

const RATES_TO_KZT = { KZT: 1, USD: 455.0, EUR: 495.0, RUB: 5.1, CNY: 64.0, TRY: 12.5, AED: 124.0, KRW: 0.33 };

/* ═══════════════════════════════════════════════
   ПИКЕР ПРОДУКТА — логика из протокола встречи 25.06.2026
   (флоу пополнения карт/счетов: убран пикер зачисления,
    счёт зачисления подставляется автоматически по иерархии валют)
   ═══════════════════════════════════════════════ */

// Иерархия валют для подстановки счёта зачисления.
// КЗТ — главная валюта банка, остаётся приоритетной (решение со встречи).
const CURRENCY_HIERARCHY = ["KZT", "USD", "EUR", "RUB", "CNY", "TRY", "AED"];

// Развернуть карту в список её валютных суб-счетов.
// breakdown содержит реальные счета по валютам; primary — только для моновалютной карты.
function cardSubAccounts(card) {
  if (!card) return [];
  if (card.breakdown && card.breakdown.length) return card.breakdown;
  return [{ currency: card.primaryCurrency, amount: card.primaryBalance }];
}

// Подстановка счёта зачисления под картой по валюте списания.
// 1) если валюта списания есть на карте → моновалютный перевод на неё;
// 2) иначе → следующий счёт по иерархии КЗТ → USD → EUR → RUB → CNY → TRY → AED.
function resolveCreditAccount(card, debitCurrency) {
  const subs = cardSubAccounts(card);
  if (!subs.length) return null;
  const exact = subs.find(s => s.currency === debitCurrency);
  if (exact) return { ...exact, mono: true };
  for (const cur of CURRENCY_HIERARCHY) {
    const hit = subs.find(s => s.currency === cur);
    if (hit) return { ...hit, mono: false };
  }
  return { ...subs[0], mono: false };
}

function fmtCompact(n) {
  const abs = Math.abs(n);
  if (abs >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toFixed(2);
}
function fmtFull(n) {
  return n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtInt(n) {
  return Math.round(n).toLocaleString("ru-RU");
}
function convertToKZT(amount, currency) {
  return amount * (RATES_TO_KZT[currency] || 1);
}
function convertTo(amountInKZT, targetCurrency) {
  return amountInKZT / (RATES_TO_KZT[targetCurrency] || 1);
}

/* ═══════════════════════════════════════════════
   COLOR PALETTES — clean, Wise-like
   ═══════════════════════════════════════════════ */

const LIGHT_COLORS = {
  bg: "#F7F7F5",
  card: "#FFFFFF",
  text: "#0E0F0C",
  sub: "#5C5F66",
  muted: "#9296A3",
  faint: "rgba(14,15,12,0.04)",
  border: "rgba(14,15,12,0.08)",
  divider: "rgba(14,15,12,0.06)",
  accent: "#9FE870",
  accentDark: "#163300",
  accentFg: "#163300",
  accentSoft: "rgba(159,232,112,0.18)",
  cardShadow: "none",
};

const DARK_COLORS = {
  bg: "#0E0F0C",
  card: "#1A1C19",
  text: "#FAFAF7",
  sub: "rgba(250,250,247,0.7)",
  muted: "rgba(250,250,247,0.45)",
  faint: "rgba(250,250,247,0.05)",
  border: "rgba(250,250,247,0.08)",
  divider: "rgba(250,250,247,0.06)",
  accent: "#9FE870",
  accentDark: "#163300",
  accentFg: "#163300",
  accentSoft: "rgba(159,232,112,0.14)",
  cardShadow: "none",
};

/* ═══════════════════════════════════════════════
   BLOCKS
   ═══════════════════════════════════════════════ */

const BLOCK_LABELS = [
  { key: "balance", label: "Баланс" },
  { key: "requests", label: "Запросы" },
  { key: "promo", label: "Промо" },
  { key: "transfers", label: "Последние переводы" },
  { key: "news", label: "Новости" },
  { key: "services", label: "Travel-сервисы" },
  { key: "products", label: "Продукты" },
  { key: "cta", label: "CTA" },
];

/* ═══════════════════════════════════════════════
   FEATURE FLAGS — real flags from ibank/Config/FeatureFlag.swift
   Wired to prototype blocks the same way the real app gates them
   ═══════════════════════════════════════════════ */

const FEATURE_FLAGS = [
  { key: "kursiv", desc: "Новости на главном экране (без флага — сторисы)", default: true },
  { key: "moneyRequest", desc: "Запросы денег", default: true },
  { key: "becomeClientBanner", desc: "Маркетинговые баннеры", default: true },
  { key: "aviata", desc: "Покупка авиабилетов", default: true },
  { key: "p2pLoan", desc: "P2P займы", default: true },
  { key: "openDeposit", desc: "Открытие депозита", default: true },
  { key: "openCard", desc: "Открытие карты", default: true },
  { key: "openCredit", desc: "Открытие кредита", default: true },
  { key: "toPhoneNumber", desc: "Перевод по номеру телефона", default: true },
  { key: "paySwift", desc: "SWIFT-переводы", default: true },
  { key: "conversionRates", desc: "Курсы валют на экране переводов", default: true },
  { key: "cardPanCVV", desc: "Показ номера карты в деталях", default: true },
  { key: "transferSwap", desc: "Кнопка «Поменять счета местами»", default: true },
  { key: "split", desc: "Сплит счёта — кнопка «Разделить»", default: true },
  { key: "securitySessionBiometry", desc: "Биометрия для входа (Face ID)", default: true },
  { key: "changephone", desc: "Смена номера телефона", default: true },
  { key: "changeIdentityDocument", desc: "Изменение паспортных данных", default: true },
  { key: "certificateOfAccounts", desc: "Справки по счетам", default: true },
  { key: "cardSetPin", desc: "Смена ПИН-кода карты", default: true },
  { key: "applePay", desc: "Пополнение карт с Apple Pay", default: true },
  { key: "earlyLoanRepayment", desc: "Досрочное погашение кредита", default: true },
  { key: "loanRepaymentVariants", desc: "Варианты погашения кредита", default: true },
  { key: "payIbanKnp", desc: "Запрос КНП в IBAN-переводе", default: true },
  { key: "payIbanKbe", desc: "Запрос КБе в IBAN-переводе", default: true },
  { key: "crystal", desc: "Валютный контракт для SWIFT", default: true },
  { key: "payMobile", desc: "Оплата мобильной связи", default: true },
  { key: "chat", desc: "Чат с банком", default: true },
];

/* Stories — shown when `kursiv` flag is OFF (real app behavior) */
const STORIES = [
  { id: 1, title: "FC кэшбэк", emoji: "⭐", bg: "linear-gradient(135deg, #F59E0B, #EF4444)", viewed: false },
  { id: 2, title: "Депозиты", emoji: "📈", bg: "linear-gradient(135deg, #22C55E, #06B6D4)", viewed: false },
  { id: 3, title: "Страхование", emoji: "🛡️", bg: "linear-gradient(135deg, #0AB321, #06B6D4)", viewed: true },
  { id: 4, title: "Тарифы", emoji: "📊", bg: "linear-gradient(135deg, #3B82F6, #6366F1)", viewed: true },
  { id: 5, title: "Новости", emoji: "📰", bg: "linear-gradient(135deg, #EC4899, #F59E0B)", viewed: true },
  { id: 6, title: "Invest Card", emoji: "💳", bg: "linear-gradient(135deg, #6366F1, #A855F7)", viewed: true },
];

/* ═══════════════════════════════════════════════
   PAYMENTS SCREEN DATA — real menu structure and texts
   from PaymentsViewModel callbacks + ru.lproj/Localizable.strings
   ═══════════════════════════════════════════════ */

const PAYMENT_TEMPLATES = [
  { id: 1, title: "Аренда", emoji: "🏠", color: "#6366F1" },
  { id: 2, title: "Коммуналка", emoji: "💡", color: "#F59E0B" },
  { id: 3, title: "Маме", emoji: "💸", color: "#22C55E" },
  { id: 4, title: "Интернет", emoji: "🌐", color: "#3B82F6" },
];

/* Категории «Оплата услуг» — реальные тексты paymentsFlow.payments.* */
const PAYMENT_CATEGORIES = [
  { id: "mobile", title: "Мобильная связь", Icon: Smartphone, color: "#22C55E" },
  { id: "house", title: "Коммунальные услуги", Icon: Home, color: "#F59E0B" },
  { id: "internet", title: "Интернет", Icon: Wifi, color: "#3B82F6" },
  { id: "tv", title: "Телевидение", Icon: Tv, color: "#8B5CF6" },
  { id: "transport", title: "Транспорт", Icon: Bus, color: "#06B6D4" },
  { id: "education", title: "Образование", Icon: GraduationCap, color: "#EC4899" },
  { id: "taxes", title: "Налоги, платежи в бюджет", Icon: Landmark, color: "#64748B" },
  { id: "tickets", title: "Электронные билеты", Icon: Ticket, color: "#EF4444" },
];

/* Лента новостей (real News module: Kursiv list + detail с буллетами) */
const NEWS_FEED = [
  {
    id: 1, tag: "Срочное",
    title: "Freedom Bank запускает мультивалютные переводы без комиссии",
    author: "Редакция", time: "2 часа назад", views: 1240,
    bg: "linear-gradient(135deg, #14532D 0%, #166534 50%, #22C55E 100%)",
    bullets: [
      "Переводы в 12 валютах без комиссии для всех клиентов",
      "Мгновенное зачисление внутри банка",
      "Лимит — до 10 млн ₸ в месяц",
    ],
    body: "Freedom Bank объявил о запуске мультивалютных переводов без комиссии для всех розничных клиентов. Сервис охватывает переводы в 12 валютах, включая тенге, доллары, евро и рубли.\n\nПо словам банка, мгновенное зачисление работает для переводов внутри банка, а внешние переводы проходят в течение одного банковского дня.",
  },
  {
    id: 2, tag: "Рынки",
    title: "Трамп возобновил работу кабмина США, Nvidia вложит в OpenAI $20 млрд",
    author: "Angelina Kleymenova", time: "4 часа назад", views: 3805,
    bg: "linear-gradient(135deg, #1E293B 0%, #475569 50%, #64748B 100%)",
    bullets: [
      "Шатдаун в США завершён после 14 дней",
      "Nvidia анонсировала стратегическое партнёрство с OpenAI",
      "Индекс S&P 500 вырос на 1,2% на новостях",
    ],
    body: "Президент США подписал бюджетный пакет, завершив двухнедельную приостановку работы правительства. Рынки отреагировали ростом.\n\nПараллельно Nvidia объявила о намерении инвестировать до $20 млрд в OpenAI в рамках стратегического партнёрства по развитию инфраструктуры ИИ.",
  },
  {
    id: 3, tag: "Банк",
    title: "Изменение базовых ставок по депозитам с 1 июля",
    author: "Freedom Bank", time: "Вчера", views: 982,
    bg: "linear-gradient(135deg, #7C2D12 0%, #B45309 60%, #F59E0B 100%)",
    bullets: [
      "Ставка по тенговым депозитам — до 15,2% годовых",
      "Валютные депозиты — без изменений",
    ],
    body: "С 1 июля Freedom Bank обновляет базовые ставки по депозитам в тенге. Максимальная ставка составит 15,2% годовых при размещении на 24 месяца с выплатой процентов в конце срока.",
  },
  {
    id: 4, tag: "Технологии",
    title: "Техническое обслуживание: плановые работы в ночь с 5 на 6 июля",
    author: "Freedom Bank", time: "Вчера", views: 451,
    bg: "linear-gradient(135deg, #1E1B4B 0%, #4338CA 60%, #6366F1 100%)",
    bullets: [
      "Сервис будет недоступен с 02:00 до 04:00",
      "Карты продолжат работать в обычном режиме",
    ],
    body: "В ночь с 5 на 6 июля будет проводиться плановое обновление систем банка. Мобильное приложение будет недоступно с 02:00 до 04:00 по времени Астаны. Платежи по картам продолжат обрабатываться в штатном режиме.",
  },
];

/* Центр уведомлений (real «Система уведомлений») */
const NOTIFICATIONS = [
  { id: 1, title: "Перевод зачислен", subtitle: "+50 000 ₸ от Ивана В.", time: "11:05", Icon: ArrowDownLeft, color: "#22C55E", unread: true },
  { id: 2, title: "Запрос денег", subtitle: "Валентин Г. запрашивает 2 100 €", time: "09:41", Icon: Send, color: "#EC4899", unread: true },
  { id: 3, title: "Кэшбэк начислен", subtitle: "+409 FC за покупки в июне", time: "Вчера", Icon: Star, color: "#F59E0B", unread: false },
  { id: 4, title: "Новый ответ", subtitle: "Поддержка ответила на ваше обращение", time: "Вчера", Icon: MessageCircle, color: "#3B82F6", unread: false },
  { id: 5, title: "Безопасность", subtitle: "Вход с нового устройства iPhone 15 Pro", time: "10 июня", Icon: Shield, color: "#64748B", unread: false },
];

/* Слайды сторисов (kursiv off → сторисы, real InAppStory) */
const STORY_SLIDES = {
  1: { title: "FC кэшбэк", text: "Получайте до 5% кэшбэка Freedom Coins за каждую покупку картой", cta: "Подробнее" },
  2: { title: "Депозиты", text: "До 15,2% годовых в тенге — откройте депозит за минуту прямо в приложении", cta: "Открыть депозит" },
  3: { title: "Страхование", text: "Туристическая страховка для путешествий — оформление за 2 минуты", cta: "Оформить" },
  4: { title: "Тарифы", text: "Обновлённые тарифы на переводы и обслуживание с 1 июля", cta: "Смотреть" },
  5: { title: "Новости", text: "Главные новости банка и рынков — теперь в приложении", cta: "Читать" },
  6: { title: "Invest Card", text: "Карта, которая инвестирует за вас: округление покупок в ETF", cta: "Заказать карту" },
};

/* Операторы для оплаты мобильной связи (payMobile) */
const MOBILE_OPERATORS = [
  { prefixes: ["701", "700", "708"], name: "Altel", color: "#E91E8C" },
  { prefixes: ["777", "705", "771"], name: "Beeline", color: "#FFC800" },
  { prefixes: ["747", "750", "751"], name: "Tele2", color: "#1F2229" },
  { prefixes: ["702", "775", "778"], name: "Activ", color: "#7B2D8B" },
];

/* Провайдеры по категориям «Оплата услуг» */
const CATEGORY_PROVIDERS = {
  house: ["Алматы Су", "АлматыЭнергоСбыт", "КазТрансГаз Аймак", "Алматинские тепловые сети"],
  internet: ["Beeline Home", "Казахтелеком", "AlmaTV", "iD Net"],
  tv: ["AlmaTV", "Otau TV", "Казахтелеком TV"],
  transport: ["Онай (Алматы)", "Astana LRT", "ЦОДД штрафы"],
  education: ["КазНУ им. аль-Фараби", "КБТУ", "Детский сад «Балапан»"],
  taxes: ["Налог на имущество", "Налог на транспорт", "ИПН"],
  tickets: ["Ticketon", "Kassir.kz"],
};

/* Рейсы Aviata (флаг aviata) */
const AVIATA_FLIGHTS = [
  { id: 1, carrier: "Air Astana", code: "KC 931", from: "ALA", to: "CDG", dep: "08:45", arr: "13:20", duration: "8ч 35м", direct: true, price: 285000 },
  { id: 2, carrier: "FlyArystan", code: "FS 711 + AF", from: "ALA", to: "CDG", dep: "06:10", arr: "15:40", duration: "12ч 30м", direct: false, price: 198000 },
  { id: 3, carrier: "SCAT", code: "DV 723 + TK", from: "ALA", to: "CDG", dep: "11:30", arr: "21:05", duration: "12ч 35м", direct: false, price: 176500 },
];

/* Пакеты eSIM */
const ESIM_PACKAGES = [
  { id: 1, region: "Франция", flag: "🇫🇷", data: "5 ГБ", days: 15, price: 4500 },
  { id: 2, region: "Европа", flag: "🇪🇺", data: "10 ГБ", days: 30, price: 9900, popular: true },
  { id: 3, region: "Весь мир", flag: "🌍", data: "20 ГБ", days: 30, price: 19900 },
];

/* Чат с банком (флаги chat/typiChat) */
const CHAT_MESSAGES = [
  { id: 1, from: "bank", text: "Здравствуйте, Никита! Я виртуальный помощник Freedom Bank. Чем могу помочь?", time: "09:30" },
  { id: 2, from: "me", text: "Хочу узнать лимит на снятие наличных", time: "09:31" },
  { id: 3, from: "bank", text: "По карте Ru Card ••1222 месячный лимит на снятие — 500 000 ₸, израсходовано 120 000 ₸. Изменить лимит можно в деталях карты → Лимиты расходов.", time: "09:31" },
];

/* График платежей по кредиту */
const CREDIT_SCHEDULE = [
  { date: "01.07.2026", amount: 12089.09, status: "next" },
  { date: "01.08.2026", amount: 12089.09 },
  { date: "01.09.2026", amount: 12089.09 },
  { date: "01.10.2026", amount: 12089.09 },
];

/* Транзакции для ProductDetails */
const TRANSACTIONS = [
  { id: 1, name: "Magnum Cash&Carry", category: "Продукты", amount: -15240.00, currency: "KZT", time: "Сегодня, 14:32", Icon: ShoppingCart, color: "#EF4444" },
  { id: 2, name: "Перевод от Ивана В.", category: "Пополнение", amount: 50000.00, currency: "KZT", time: "Сегодня, 11:05", Icon: ArrowDownLeft, color: "#22C55E" },
  { id: 3, name: "Del Papa", category: "Рестораны", amount: -8900.00, currency: "KZT", time: "Вчера, 20:14", Icon: Utensils, color: "#F59E0B" },
  { id: 4, name: "Helios", category: "АЗС", amount: -12500.00, currency: "KZT", time: "Вчера, 09:41", Icon: Fuel, color: "#3B82F6" },
  { id: 5, name: "Beeline", category: "Мобильная связь", amount: -3490.00, currency: "KZT", time: "10 июня, 16:20", Icon: Smartphone, color: "#8B5CF6" },
];

/* ═══════════════════════════════════════════════
   CARD ART — flat, simple
   ═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   CARD HERO — large image-rich horizontal card
   ═══════════════════════════════════════════════ */

function CardArtwork({ visual }) {
  const artworks = {
    pickle: (
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(circle at 15% 25%, rgba(190,242,100,0.5) 0%, transparent 35%),
          radial-gradient(circle at 85% 80%, rgba(22,101,52,0.7) 0%, transparent 45%),
          radial-gradient(circle at 65% 35%, rgba(74,222,128,0.35) 0%, transparent 30%),
          linear-gradient(135deg, #3F6212 0%, #65A30D 50%, #84CC16 100%)
        `,
      }}>
        <div style={{
          position: "absolute", top: "52%", left: "62%",
          transform: "translate(-50%, -50%) rotate(-15deg)",
          fontSize: 130, opacity: 0.18, lineHeight: 1, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }}>🥒</div>
      </div>
    ),
    prestige: (
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(circle at 80% 15%, rgba(129,140,248,0.3) 0%, transparent 50%),
          radial-gradient(circle at 15% 85%, rgba(244,114,182,0.2) 0%, transparent 45%),
          linear-gradient(135deg, #020617 0%, #1E1B4B 50%, #312E81 100%)
        `,
      }}>
        {/* Gold accent lines */}
        <div style={{ position: "absolute", top: "30%", right: "5%", width: 120, height: 1, backgroundColor: "rgba(252,211,77,0.35)", transform: "rotate(-30deg)" }} />
        <div style={{ position: "absolute", bottom: "35%", left: "5%", width: 80, height: 1, backgroundColor: "rgba(252,211,77,0.25)", transform: "rotate(-30deg)" }} />
        <div style={{
          position: "absolute", top: "55%", left: "58%",
          transform: "translate(-50%, -50%)",
          fontSize: 110, opacity: 0.12, lineHeight: 1,
        }}>🎩</div>
      </div>
    ),
    harvey: (
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse at 28% 35%, rgba(255,255,255,0.35) 0%, transparent 28%),
          radial-gradient(circle at 75% 25%, rgba(96,165,250,0.5) 0%, transparent 35%),
          radial-gradient(circle at 70% 80%, rgba(0,0,0,0.4) 0%, transparent 40%),
          linear-gradient(135deg, #9D174D 0%, #BE185D 45%, #EC4899 100%)
        `,
      }}>
        <div style={{ position: "absolute", top: "20%", left: "18%", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }} />
        <div style={{ position: "absolute", bottom: "22%", right: "22%", width: 34, height: 34, borderRadius: "50%", background: "rgba(59,130,246,0.35)" }} />
        <div style={{ position: "absolute", top: "60%", left: "30%", width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
        <div style={{
          position: "absolute", top: "50%", left: "55%",
          transform: "translate(-50%, -50%) rotate(18deg)",
          fontSize: 110, opacity: 0.2, lineHeight: 1,
        }}>🃏</div>
      </div>
    ),
    "ru-threads": (
      <div style={{
        position: "absolute", inset: 0,
        background: `
          repeating-linear-gradient(60deg, transparent 0, transparent 16px, rgba(255,255,255,0.07) 16px, rgba(255,255,255,0.07) 17px),
          repeating-linear-gradient(120deg, transparent 0, transparent 20px, rgba(0,0,0,0.12) 20px, rgba(0,0,0,0.12) 21px),
          linear-gradient(135deg, #042F2E 0%, #0F766E 45%, #14B8A6 100%)
        `,
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "55%",
          transform: "translate(-50%, -50%)",
          fontSize: 105, opacity: 0.18, lineHeight: 1,
        }}>🪆</div>
      </div>
    ),
    fresh: (
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(159,232,112,0.4) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(22,101,52,0.5) 0%, transparent 45%),
          linear-gradient(135deg, #14532D 0%, #166534 50%, #22C55E 100%)
        `,
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "55%",
          transform: "translate(-50%, -50%)",
          fontSize: 100, opacity: 0.18, lineHeight: 1,
        }}>✨</div>
      </div>
    ),
  };
  return artworks[visual] || artworks.fresh;
}

function CardHero({ card, bank, C, onOpen }) {
  const cm = CURRENCY_META[card.primaryCurrency] || { symbol: card.primaryCurrency };
  const allCurrencies = [card.primaryCurrency, ...card.breakdown.map(b => b.currency)];
  const uniqueCurrencies = [...new Set(allCurrencies)];
  const subtitle = card.sub
    || (uniqueCurrencies.length > 1
      ? uniqueCurrencies.join(" · ")
      : "Активна");

  return (
    <div data-press onClick={() => onOpen?.(card)} style={{
      flexShrink: 0,
      width: 178, height: 138,
      borderRadius: 14,
      backgroundColor: C.card,
      border: `1px solid ${C.border}`,
      scrollSnapAlign: "start",
      cursor: "pointer",
      position: "relative",
      padding: "58px 18px 14px",
    }}>
      {/* Card image — same as list view */}
      <div style={{
        position: "absolute",
        top: -14, left: 18,
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.18))",
      }}>
        <CardArt color={card.color} last4={card.last4} />
      </div>

      {/* Text content */}
      <div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: C.text,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{card.name}</div>
        <div style={{
          fontSize: 17, fontWeight: 800, color: C.text,
          fontFeatureSettings: "'tnum'", letterSpacing: -0.3, lineHeight: 1.1,
          marginTop: 6,
        }}>
          {fmtFull(card.primaryBalance)} <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>{cm.symbol}</span>
        </div>
        <div style={{
          fontSize: 11, color: C.muted, marginTop: 8,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{subtitle}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ACCOUNT HERO — clean minimal card in carousel
   ═══════════════════════════════════════════════ */

function AccountHero({ account, C, onOpen }) {
  const cm = CURRENCY_META[account.currency] || { symbol: account.currency, flag: "💰" };
  const ibanTail = account.number.replace(/\s/g, '').slice(-6);

  return (
    <div data-press onClick={() => onOpen?.(account)} style={{
      flexShrink: 0,
      width: 200, height: 124,
      borderRadius: 14,
      backgroundColor: C.card,
      border: `1px solid ${C.border}`,
      scrollSnapAlign: "start",
      cursor: "pointer",
      padding: "14px 16px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 15 }}>{cm.flag}</span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: C.muted,
            letterSpacing: 0.4, textTransform: "uppercase",
          }}>{account.currency}</span>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 600, color: C.text,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{account.name}</div>
      </div>
      <div>
        <div style={{
          fontSize: 18, fontWeight: 700, color: C.text,
          fontFeatureSettings: "'tnum'", letterSpacing: -0.3, lineHeight: 1.1,
        }}>
          {fmtFull(account.balance)} <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{cm.symbol}</span>
        </div>
        <div style={{
          fontSize: 10, color: C.muted, marginTop: 4,
          fontFeatureSettings: "'tnum'",
        }}>••{ibanTail}</div>
      </div>
    </div>
  );
}

function CardArt({ color, last4 }) {
  return (
    <div style={{
      width: 88, height: 56, borderRadius: 7,
      backgroundColor: color, position: "relative",
      flexShrink: 0,
    }}>
      {/* Chip */}
      <div style={{
        position: "absolute", top: 8, left: 9,
        width: 14, height: 10, borderRadius: 2,
        background: "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
      }} />
      {/* Contactless wave */}
      <div style={{
        position: "absolute", top: 9, left: 27,
        width: 8, height: 8, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.35)",
        borderRight: "1px solid transparent",
        borderBottom: "1px solid transparent",
        transform: "rotate(-45deg)",
      }} />
      {/* Network logo */}
      <div style={{
        position: "absolute", bottom: 6, right: 8,
        fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.95)",
        letterSpacing: 0.5, fontStyle: "italic",
      }}>VISA</div>
      {/* Last 4 hint */}
      <div style={{
        position: "absolute", bottom: 6, left: 8,
        fontSize: 7, fontWeight: 600, color: "rgba(255,255,255,0.55)",
        letterSpacing: 0.3, fontFeatureSettings: "'tnum'",
      }}>••{last4}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CURRENCY PICKER
   ═══════════════════════════════════════════════ */

function CurrencyPicker({ current, currencies, onSelect, onClose, C }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      backgroundColor: "rgba(0,0,0,0.35)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor: C.card, borderRadius: 16, padding: "8px 0",
        width: 280, maxHeight: 360, overflow: "auto",
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ padding: "14px 20px 8px", fontSize: 12, fontWeight: 600, color: C.muted }}>
          Отображать в валюте
        </div>
        {currencies.map(code => {
          const meta = CURRENCY_META[code] || { symbol: code, name: code };
          const isActive = code === current;
          return (
            <div key={code} onClick={() => { onSelect(code); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 20px", cursor: "pointer",
                backgroundColor: isActive ? C.faint : "transparent",
              }}>
              <span style={{ fontSize: 20 }}>{meta.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{code}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{meta.name}</div>
              </div>
              {isActive && <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.accentDark }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BOTTOM SHEET — Constructor
   ═══════════════════════════════════════════════ */

function BottomSheet({ theme, setTheme, onClose, blockVis, setBlockVis, blockOrder, setBlockOrder, emptyState, setEmptyState, featureFlags, setFeatureFlags, onb, setOnb, pickerMode, setPickerMode, autoExpandMode, setAutoExpandMode, stressLong, setStressLong, C }) {
  const isDark = C.bg === '#0E0F0C';
  const [subView, setSubView] = useState(null); // null | "picker" — вложенный экран конструктора
  const themes = [
    { key: "stripe", label: "Light", desc: "Светлая" },
    { key: "dark", label: "Dark", desc: "Тёмная" },
  ];

  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [dragY, setDragY] = useState(0);
  const ROW_H = 48;
  const dragRef = useRef({ index: null, startY: 0, overIndex: null });

  const handleDragStart = (index, e) => {
    e.preventDefault();
    dragRef.current = { index, startY: e.clientY, overIndex: index };
    setDragIndex(index);
    setOverIndex(index);
    setDragY(0);
  };

  useEffect(() => {
    if (dragIndex === null) return;
    const onMove = (e) => {
      const dy = e.clientY - dragRef.current.startY;
      setDragY(dy);
      const raw = dragRef.current.index + Math.round(dy / ROW_H);
      const clamped = Math.max(0, Math.min(blockOrder.length - 1, raw));
      dragRef.current.overIndex = clamped;
      setOverIndex(clamped);
    };
    const onUp = () => {
      const { index: fromIdx, overIndex: toIdx } = dragRef.current;
      if (fromIdx !== toIdx) {
        setBlockOrder(prev => {
          const next = [...prev];
          const [item] = next.splice(fromIdx, 1);
          next.splice(toIdx, 0, item);
          return next;
        });
      }
      setDragIndex(null);
      setOverIndex(null);
      setDragY(0);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [dragIndex]);

  const getDisplacement = (index) => {
    if (dragIndex === null) return 0;
    if (index === dragIndex) return dragY;
    if (dragIndex < overIndex && index > dragIndex && index <= overIndex) return -ROW_H;
    if (dragIndex > overIndex && index < dragIndex && index >= overIndex) return ROW_H;
    return 0;
  };

  // Вложенный экран «Пикер счетов» — режимы выбора счёта (=валюты) на экране пополнения
  if (subView === "picker") {
    const MODES = [
      { key: "currencyFirst", label: "Валюта — первая", desc: "Сначала «в какой валюте», потом «откуда списать». Конверсия — осознанный выбор" },
      { key: "chips", label: "Чипсы валют", desc: "Карта строкой, её счета — чипсы с балансами. Ноль вложенности" },
      { key: "auto", label: "Автомат", desc: "Счета выбираются сами (моновалюта → объём), решение объяснено строкой" },
      { key: "n26", label: "N26 · сумма — первая", desc: "Сумма сверху, «Откуда»/«Куда» — строки-дропдауны, затем отдельный экран проверки с комиссией и лимитом" },
      { key: "revolut", label: "Revolut · карточка перевода", desc: "Источник → стрелка → цель; валюта-дропдаун и сумма в одном блоке, ошибка — шитом с Retry" },
    ];
    const EXPANDS = [
      { key: "currencyFirst", label: "Валюта — первая" },
      { key: "chips", label: "Чипсы валют" },
    ];
    const radio = (items, active, onPick, dim) => items.map(m => (
      <div key={m.key} onClick={() => !dim && onPick(m.key)} style={{
        padding: "12px 14px", borderRadius: 10, cursor: dim ? "default" : "pointer", marginBottom: 8,
        opacity: dim ? 0.4 : 1,
        backgroundColor: active === m.key ? C.accentSoft : "transparent",
        border: `1px solid ${active === m.key ? C.accent : C.border}`,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{m.label}</div>
        {m.desc && <div style={{ fontSize: 11, color: C.muted, marginTop: 2, lineHeight: 1.4 }}>{m.desc}</div>}
      </div>
    ));
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.35)", zIndex: 500 }} />
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430, zIndex: 501,
          backgroundColor: C.card, borderRadius: "20px 20px 0 0",
          padding: "12px 20px 40px", maxHeight: "82vh", overflowY: "auto",
        }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, margin: "0 auto 20px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div data-press onClick={() => setSubView(null)} style={{ cursor: "pointer", display: "flex", padding: 4 }}>
              <ArrowLeft size={20} color={C.text} strokeWidth={2} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Пикер счетов</div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Режим выбора счёта</div>
          {radio(MODES, pickerMode, setPickerMode, false)}

          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, margin: "16px 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>«Изменить» в автомате раскрывает</div>
          {radio(EXPANDS, autoExpandMode, setAutoExpandMode, pickerMode !== "auto")}

          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, margin: "16px 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Стресс-тест</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.divider}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Длинные суммы</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>Балансы ×1000 — проверка чипсов на переполнение</div>
            </div>
            <div onClick={() => setStressLong(v => !v)} style={{
              width: 44, height: 24, borderRadius: 12,
              backgroundColor: stressLong ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
              position: "relative", cursor: "pointer", flexShrink: 0, transition: "background-color 0.2s",
            }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", position: "absolute", top: 2, left: stressLong ? 22 : 2, transition: "left 0.2s" }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 14, lineHeight: 1.5 }}>
            Путь для проверки: карта → Пополнить → выбрать карту в шторке → экран суммы.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.35)", zIndex: 500 }} />
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, zIndex: 501,
        backgroundColor: C.card, borderRadius: "20px 20px 0 0",
        padding: "12px 20px 40px", maxHeight: "82vh", overflowY: "auto",
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, margin: "0 auto 20px" }} />
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 24 }}>Конструктор</div>

        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Тема</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {themes.map(t => (
            <div key={t.key} onClick={() => setTheme(t.key)} style={{
              flex: 1, padding: "12px 14px", borderRadius: 10, cursor: "pointer",
              backgroundColor: theme === t.key ? C.accentSoft : "transparent",
              border: `1px solid ${theme === t.key ? C.accent : C.border}`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t.label}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{t.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Состояние</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", marginBottom: 16, borderBottom: `1px solid ${C.divider}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Empty state</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{emptyState ? "Новый пользователь" : "Активный пользователь"}</div>
          </div>
          <div onClick={() => setEmptyState(v => !v)} style={{
            width: 44, height: 24, borderRadius: 12,
            backgroundColor: emptyState ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
            position: "relative", cursor: "pointer", flexShrink: 0, transition: "background-color 0.2s",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff",
              position: "absolute", top: 2, left: emptyState ? 22 : 2,
              transition: "left 0.2s",
            }} />
          </div>
        </div>

        {/* Пикер счетов — вложенный экран с режимами выбора счёта на пополнении */}
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Пикер счетов</div>
        <div data-press onClick={() => setSubView("picker")} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 0", marginBottom: 16,
          borderBottom: `1px solid ${C.divider}`, cursor: "pointer",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Режим выбора счёта</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>
              {pickerMode === "currencyFirst" ? "Валюта — первая" : pickerMode === "chips" ? "Чипсы валют" : pickerMode === "n26" ? "N26 · сумма — первая" : pickerMode === "revolut" ? "Revolut · карточка перевода" : `Автомат → ${autoExpandMode === "chips" ? "чипсы" : "валюта-первая"}`}
              {stressLong ? " · стресс-тест сумм" : ""}
            </div>
          </div>
          <ChevronRight size={16} color={C.muted} strokeWidth={1.8} />
        </div>

        {/* Онбординг — пре-авторизационный флоу (изолированный, см. onboarding.jsx) */}
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Онбординг</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", marginBottom: onb ? 12 : 24, borderBottom: `1px solid ${C.divider}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Показать онбординг</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{onb ? "Флоу поверх аппа" : "Выключено — апп как обычно"}</div>
          </div>
          <div onClick={() => setOnb(v => v ? null : { gates: { numberInDb: false, isDemoUser: false, iinExists: false }, stepKey: ONB_START })} style={{
            width: 44, height: 24, borderRadius: 12,
            backgroundColor: onb ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
            position: "relative", cursor: "pointer", flexShrink: 0, transition: "background-color 0.2s",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff",
              position: "absolute", top: 2, left: onb ? 22 : 2, transition: "left 0.2s",
            }} />
          </div>
        </div>
        {onb && (
          <div style={{ marginBottom: 24 }}>
            {/* Пресеты-персоны (выставляют гейты и стартуют с phone_entry) */}
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Пресет (старт со входа)</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {ONB_PRESETS.map(p => {
                const active = ONB_GATES.every(g => (onb.gates || {})[g.key] === p.gates[g.key]) && onb.stepKey === ONB_START;
                return (
                  <div key={p.key} onClick={() => setOnb({ gates: { ...p.gates }, stepKey: ONB_START })} style={{
                    padding: "8px 12px", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: active ? C.accent : C.text,
                    backgroundColor: active ? C.accentDark : C.faint,
                  }}>{p.label}</div>
                );
              })}
            </div>

            {/* Гейты роутера (мок-ответы развилок) */}
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Гейты роутера</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {ONB_GATES.map(g => {
                const on = !!(onb.gates || {})[g.key];
                return (
                  <div key={g.key} onClick={() => setOnb({ ...onb, gates: { ...(onb.gates || {}), [g.key]: !on } })} style={{
                    padding: "8px 12px", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: on ? C.accent : C.muted,
                    backgroundColor: on ? C.accentDark : C.faint,
                  }}>{on ? "✓ " : ""}{g.label}</div>
                );
              })}
            </div>

            {/* Джампер по шагам (сгруппирован) */}
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Перейти на экран</div>
            {ONB_STEPS.map((s, i) => {
              const active = onb.stepKey === s.key;
              const prev = ONB_STEPS[i - 1];
              const showGroup = !prev || prev.group !== s.group;
              return (
                <div key={s.key}>
                  {showGroup && (
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, margin: "8px 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.group}</div>
                  )}
                  <div onClick={() => setOnb({ ...onb, stepKey: s.key, sub: "intro" })} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 9,
                    cursor: "pointer", marginBottom: 6,
                    backgroundColor: active ? C.accentSoft : "transparent",
                    border: `1px solid ${active ? C.accent : C.border}`,
                  }}>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>{s.title}</span>
                    <span style={{ fontSize: 11, color: C.muted, fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}>{s.key}</span>
                  </div>
                  {/* Sumsub под-состояния */}
                  {s.sumsub && active && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "0 0 10px 12px" }}>
                      {SUMSUB_PHASES.map(p => {
                        const pa = (onb.sub || "intro") === p;
                        return (
                          <div key={p} onClick={() => setOnb({ ...onb, stepKey: s.key, sub: p })} style={{
                            padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 600,
                            color: pa ? C.accent : C.muted,
                            backgroundColor: pa ? C.accentDark : C.faint,
                          }}>{SUMSUB_PHASE_LABELS[p]}</div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Блоки</div>
        <div style={{ position: "relative" }}>
          {blockOrder.map((key, index) => {
            const block = BLOCK_LABELS.find(b => b.key === key);
            const on = blockVis[key];
            const isDragged = index === dragIndex;
            const displacement = getDisplacement(index);
            return (
              <div key={key} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
                borderBottom: `1px solid ${C.divider}`,
                transform: `translateY(${displacement}px)`,
                transition: isDragged ? "none" : "transform 0.2s",
                zIndex: isDragged ? 10 : 1, position: "relative",
                backgroundColor: isDragged ? C.card : "transparent",
                opacity: isDragged ? 0.92 : 1,
              }}>
                <div onPointerDown={(e) => handleDragStart(index, e)} style={{
                  cursor: "grab", padding: "4px 2px", touchAction: "none",
                }}>
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                    {[3, 7, 11].map(y => (<g key={y}>
                      <circle cx="4" cy={y} r="1" fill={C.muted} />
                      <circle cx="8" cy={y} r="1" fill={C.muted} />
                    </g>))}
                  </svg>
                </div>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: on ? C.text : C.muted }}>{block.label}</span>
                <div onClick={() => setBlockVis(prev => ({ ...prev, [key]: !prev[key] }))} style={{
                  width: 38, height: 22, borderRadius: 11,
                  backgroundColor: on ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
                  position: "relative", cursor: "pointer", flexShrink: 0,
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff",
                    position: "absolute", top: 2, left: on ? 18 : 2,
                    transition: "left 0.15s",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Real feature flags from ibank/Config/FeatureFlag.swift */}
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, margin: "24px 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Фичефлаги <span style={{ textTransform: "none", letterSpacing: 0 }}>· реальные, из iOS-репы</span>
        </div>
        <div>
          {FEATURE_FLAGS.map(f => {
            const on = featureFlags[f.key];
            return (
              <div key={f.key} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "11px 0",
                borderBottom: `1px solid ${C.divider}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: on ? C.text : C.muted,
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  }}>{f.key}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{f.desc}</div>
                </div>
                <div onClick={() => setFeatureFlags(prev => ({ ...prev, [f.key]: !prev[f.key] }))} style={{
                  width: 38, height: 22, borderRadius: 11,
                  backgroundColor: on ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
                  position: "relative", cursor: "pointer", flexShrink: 0,
                  transition: "background-color 0.15s",
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff",
                    position: "absolute", top: 2, left: on ? 18 : 2,
                    transition: "left 0.15s",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   STATUS BAR — minimal
   ═══════════════════════════════════════════════ */

function StatusBar({ C }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 20px 4px", fontSize: 14, fontWeight: 600, color: C.text,
    }}>
      <span style={{ fontFeatureSettings: "'tnum'", letterSpacing: 0.3 }}>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="7" width="3" height="4" rx="0.5" fill={C.text}/>
          <rect x="5" y="5" width="3" height="6" rx="0.5" fill={C.text}/>
          <rect x="10" y="3" width="3" height="8" rx="0.5" fill={C.text}/>
          <rect x="14" y="0" width="3" height="11" rx="0.5" fill={C.text}/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 1C4.6 1 1.9 2 0 3.6l1.5 1.5C3 3.8 5.2 3 7.5 3s4.5 0.8 6 2.1L15 3.6C13.1 2 10.4 1 7.5 1z" fill={C.text}/>
          <path d="M7.5 5C5.7 5 4 5.7 2.7 6.8l1.5 1.5c0.9-0.8 2-1.3 3.3-1.3s2.4 0.5 3.3 1.3l1.5-1.5C11 5.7 9.3 5 7.5 5z" fill={C.text}/>
          <path d="M7.5 9c-0.7 0-1.3 0.3-1.7 0.7L7.5 11l1.7-1.3C8.8 9.3 8.2 9 7.5 9z" fill={C.text}/>
        </svg>
        <div style={{
          width: 25, height: 12, borderRadius: 3, position: "relative",
          border: `1px solid ${C.text}`, opacity: 0.8,
        }}>
          <div style={{ position: "absolute", inset: 1, borderRadius: 1.5, backgroundColor: C.text, width: 20 }} />
          <div style={{ position: "absolute", right: -2, top: 3, width: 1.5, height: 4, borderRadius: 1, backgroundColor: C.text }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════ */

function SectionHeader({ title, action, onAction, onAdd, onToggleView, viewMode, C }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: 12,
    }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: -0.2 }}>{title}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {action && <span data-press onClick={onAction} style={{ fontSize: 13, color: C.text, fontWeight: 500, cursor: "pointer", opacity: 0.7, marginRight: 4 }}>{action}</span>}
        {onToggleView && (
          <div data-press onClick={onToggleView} style={{
            width: 24, height: 24, borderRadius: 6,
            border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
            {viewMode === "carousel"
              ? <LayoutList size={13} color={C.text} strokeWidth={2} />
              : <LayoutGrid size={13} color={C.text} strokeWidth={2} />
            }
          </div>
        )}
        {onAdd && (
          <div data-press onClick={onAdd} style={{
            width: 24, height: 24, borderRadius: 6,
            border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
            <Plus size={13} color={C.text} strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN SCREEN
   ═══════════════════════════════════════════════ */

function MainScreen({
  onAvatarClick, displayCurrency, setDisplayCurrency, pickerOpen, setPickerOpen,
  totalInKZT, productTab, setProductTab,
  blockVis, blockOrder, emptyState, activeCardProducts, activeAccounts,
  activeLoans, activeCredits, activePromos, activeNews, activeRequests,
  featureFlags, onOpenCard, onOpenTotal, onOpenRequest, onOpenProfile, onOpenDeposit, onOpenNews,
  onOpenAccount, onOpenDepositDetails, onOpenCredit, onOpenLoan, onOpenBroker,
  onOpenPromo, onOpenStory, onOpenAllContacts, onOpenEsim, onOpenAviata,
  C, theme,
}) {
  const isDark = C.bg === '#0E0F0C';
  const totalDisplay = convertTo(totalInKZT, displayCurrency);
  const displayMeta = CURRENCY_META[displayCurrency] || { symbol: displayCurrency };
  const availableCurrencies = Object.keys(CURRENCY_META).filter(c => ["KZT","USD","EUR","RUB"].includes(c));

  const [promoIndex, setPromoIndex] = useState(0);
  const [requestIndex, setRequestIndex] = useState(0);
  const [cardsView, setCardsView] = useState("carousel");
  const [accountsView, setAccountsView] = useState("carousel");

  // Real tab logic from ProductsViewModel+ReceptionTabs.swift:
  // a tab is hidden when empty (tabIsEmpty), the whole tabs row is hidden
  // when only one tab remains (configureTabsSection returns nil)
  const bankCount = activeCardProducts.reduce((s, g) => s + g.cards.length, 0);
  const depositCount = emptyState ? 0 : DEPOSITS.length;
  const brokerCount = emptyState ? 0 : BROKER_ACCOUNTS.reduce((s, g) => s + g.accounts.length, 0);
  const allTabs = [
    { key: "bank", label: "Банк", count: bankCount },
    { key: "deposits", label: "Депозиты", count: depositCount },
    { key: "broker", label: "Брокер", count: brokerCount, notif: emptyState ? 0 : 1 },
  ].filter(t => t.count > 0);
  const showTabsRow = allTabs.length > 1;

  // currentTab reset when it disappears (real: currentTab = allTabs.first ?? .bank)
  useEffect(() => {
    if (!allTabs.some(t => t.key === productTab)) {
      setProductTab(allTabs[0]?.key ?? "bank");
    }
  }, [emptyState]);

  // Dark palette for the hero area (creates contrast against light products area below)
  const topC = {
    ...C,
    bg: "#0F172A",
    card: "#1E293B",
    text: "#F8FAFC",
    sub: "rgba(248,250,252,0.7)",
    muted: "rgba(248,250,252,0.45)",
    faint: "rgba(248,250,252,0.05)",
    border: "rgba(248,250,252,0.08)",
    borderStrong: "rgba(248,250,252,0.16)",
    divider: "rgba(248,250,252,0.06)",
  };

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100dvh",
      backgroundColor: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      overflowX: "clip", position: "relative",
      paddingBottom: 80,
    }}>
      {pickerOpen && (
        <CurrencyPicker current={displayCurrency} currencies={availableCurrencies}
          onSelect={setDisplayCurrency} onClose={() => setPickerOpen(false)} C={C} />
      )}

      {/* ═════════════ DARK HERO AREA ═════════════ */}
      <div style={{ backgroundColor: topC.bg, color: topC.text, position: "relative" }}>
      {(() => {
        const C = topC; // shadow: all blocks below use dark palette
        return (
      <>
      <StatusBar C={C} />

      {/* Header — avatar opens Settings (real app), search opens debug constructor */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 0" }}>
        <div onClick={() => onOpenProfile?.()} data-press style={{
          width: 36, height: 36, borderRadius: "50%",
          backgroundColor: C.accentDark,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: C.accent, cursor: "pointer",
        }}>НШ</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div onClick={onAvatarClick} data-press style={{
            width: 36, height: 36, borderRadius: "50%",
            border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
            <Search size={17} color={C.text} strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ═══ BALANCE ═══ */}
      {blockVis.balance && (
      <div style={{ order: blockOrder.indexOf("balance"), padding: "32px 20px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 10 }}>Общий баланс</div>
        <div>
          <div data-press onClick={() => onOpenTotal?.()} style={{
            fontSize: 40, fontWeight: 700, color: C.text,
            letterSpacing: -1.5, fontFeatureSettings: "'tnum'", lineHeight: 1,
            cursor: "pointer", display: "inline-block",
          }}>
            {fmtInt(totalDisplay)}<span style={{ fontSize: 22, fontWeight: 600, color: C.muted, marginLeft: 6 }}>{displayMeta.symbol}</span>
          </div>
        </div>
        <div onClick={() => setPickerOpen(true)} data-press style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "6px 12px", borderRadius: 10,
          backgroundColor: C.faint, cursor: "pointer", marginTop: 14,
        }}>
          <span style={{ fontSize: 13 }}>{displayMeta.flag}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{displayCurrency}</span>
          <ChevronDown size={11} color={C.muted} />
        </div>
      </div>
      )}

      {/* ═══ REQUESTS ═══ (gated by real flag `moneyRequest`) */}
      {blockVis.requests && featureFlags.moneyRequest && activeRequests.length > 0 && (
      <div style={{ order: blockOrder.indexOf("requests"), padding: "0 20px 16px" }}>
        <div data-press onClick={() => onOpenRequest?.(activeRequests[requestIndex])} style={{
          backgroundColor: C.card, borderRadius: 12, padding: "14px 16px",
          border: `1px solid ${C.border}`, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            backgroundColor: C.faint,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: C.text,
          }}>{activeRequests[requestIndex].initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
              {activeRequests[requestIndex].type === "request" ? "Запрос денег" : "Счёт к оплате"}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{activeRequests[requestIndex].from}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
              {fmtFull(activeRequests[requestIndex].amount)} <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{CURRENCY_META[activeRequests[requestIndex].currency]?.symbol || activeRequests[requestIndex].currency}</span>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
              <Clock size={10} color={C.muted} />
              {activeRequests[requestIndex].status}
            </div>
          </div>
        </div>
        {activeRequests.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 10 }}>
            {activeRequests.map((_, i) => (
              <div key={i} onClick={() => setRequestIndex(i)} style={{
                width: i === requestIndex ? 14 : 4, height: 4, borderRadius: 2,
                backgroundColor: i === requestIndex ? C.text : C.border,
                cursor: "pointer", transition: "all 0.2s",
              }} />
            ))}
          </div>
        )}
      </div>
      )}

      {/* ═══ PROMO ═══ (gated by real flag `becomeClientBanner`) */}
      {blockVis.promo && featureFlags.becomeClientBanner && activePromos.length > 0 && (
      <div style={{ order: blockOrder.indexOf("promo"), padding: "0 20px 24px" }}>
        <div data-press onClick={() => onOpenPromo?.(activePromos[promoIndex])} style={{
          borderRadius: 12, padding: "18px 20px", cursor: "pointer",
          backgroundColor: activePromos[promoIndex].color,
          color: activePromos[promoIndex].textColor,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>{activePromos[promoIndex].title}</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>{activePromos[promoIndex].body}</div>
          </div>
          <div style={{
            padding: "6px 14px", borderRadius: 8,
            backgroundColor: activePromos[promoIndex].textColor,
            color: activePromos[promoIndex].color,
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>{activePromos[promoIndex].cta}</div>
        </div>
        {activePromos.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 10 }}>
            {activePromos.map((_, i) => (
              <div key={i} onClick={() => setPromoIndex(i)} style={{
                width: i === promoIndex ? 14 : 4, height: 4, borderRadius: 2,
                backgroundColor: i === promoIndex ? C.text : C.border,
                cursor: "pointer", transition: "all 0.2s",
              }} />
            ))}
          </div>
        )}
      </div>
      )}

      {/* ═══ RECENT TRANSFERS ═══ */}
      {blockVis.transfers && (
      <div style={{ order: blockOrder.indexOf("transfers"), padding: "0 0 24px" }}>
        <div style={{ padding: "0 20px" }}>
          <SectionHeader title="Переводы" action={!emptyState ? "Все" : null} onAction={onOpenAllContacts} C={C} />
        </div>
        {emptyState ? (
          <div style={{ padding: "0 20px" }}>
            <div style={{
              padding: "20px", borderRadius: 12,
              backgroundColor: C.card, border: `1px solid ${C.border}`,
              fontSize: 13, color: C.muted, textAlign: "center",
            }}>
              Здесь появятся ваши последние переводы
            </div>
          </div>
        ) : (
          <div style={{
            display: "flex", gap: 18, overflowX: "auto",
            padding: "0 20px", scrollbarWidth: "none",
          }}>
            {RECENT_TRANSFERS.map(c => (
              <div key={c.id} data-press style={{
                flexShrink: 0, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6, cursor: "pointer", width: 52,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  backgroundColor: c.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 700, color: "#fff",
                }}>{c.initials}</div>
                <span style={{ fontSize: 11, color: C.sub, fontWeight: 500, textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 52 }}>
                  {c.name}
                </span>
              </div>
            ))}
            <div data-press style={{
              flexShrink: 0, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 6, cursor: "pointer", width: 52,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                backgroundColor: C.faint,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Plus size={18} color={C.sub} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 11, color: C.muted }}>Новый</span>
            </div>
          </div>
        )}
      </div>
      )}

      {/* ═══ NEWS / STORIES ═══
          Real flag `kursiv` controls this: flag ON → news, flag OFF → stories
          (ibank/Config/FeatureFlag.swift: "Если флага нет, показывать сторисы") */}
      {blockVis.news && featureFlags.kursiv && (
      <div style={{ order: blockOrder.indexOf("news"), padding: "0 20px 24px" }}>
        <div data-press onClick={() => onOpenNews?.()} style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, padding: "12px 14px",
          cursor: "pointer",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            backgroundColor: "rgba(220,38,38,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Newspaper size={17} color="#DC2626" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: "#DC2626",
                textTransform: "uppercase", letterSpacing: 0.4,
              }}>{activeNews.tag}</span>
              <span style={{ fontSize: 11, color: C.muted }}>· {activeNews.time}</span>
            </div>
            <div style={{
              fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.3,
              overflow: "hidden", textOverflow: "ellipsis",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>{activeNews.title}</div>
          </div>
          <ChevronRight size={16} color={C.muted} strokeWidth={1.8} />
        </div>
      </div>
      )}
      {blockVis.news && !featureFlags.kursiv && (
      <div style={{ order: blockOrder.indexOf("news"), padding: "0 0 24px" }}>
        <div style={{
          display: "flex", gap: 14, overflowX: "auto",
          padding: "0 20px", scrollbarWidth: "none",
        }}>
          {STORIES.map(s => (
            <div key={s.id} data-press onClick={() => onOpenStory?.(s.id)} style={{
              flexShrink: 0, width: 64, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: 18,
                padding: 2,
                border: s.viewed ? `1.5px solid ${C.borderStrong}` : "1.5px solid #9FE870",
              }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: 14,
                  background: s.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>{s.emoji}</div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 500,
                color: s.viewed ? C.muted : C.sub,
                textAlign: "center", whiteSpace: "nowrap",
                overflow: "hidden", textOverflow: "ellipsis", maxWidth: 64,
              }}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ═══ TRAVEL SERVICES ═══ (`aviata` — real flag for flight tickets) */}
      {blockVis.services && (
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { id: "esim", title: "eSIM", subtitle: "Интернет в поездках", Icon: Smartphone, color: "#22C55E", onClick: onOpenEsim },
            ...(featureFlags.aviata ? [{ id: "travel", title: "Авиабилеты", subtitle: "Поиск и покупка", Icon: Plane, color: "#3B82F6", onClick: onOpenAviata }] : []),
            { id: "lounge", title: "Lounge", subtitle: "Залы в аэропортах", Icon: Sofa, color: "#A78BFA", soon: true },
            { id: "fasttrack", title: "Fast Track", subtitle: "Без очереди", Icon: Zap, color: "#F59E0B", soon: true },
          ].map(s => (
            <div key={s.id} data-press onClick={s.onClick} style={{
              backgroundColor: C.card, borderRadius: 14,
              padding: s.soon ? "14px 14px" : "16px 14px",
              border: `1px solid ${C.border}`, cursor: "pointer",
              position: "relative",
              display: "flex", flexDirection: "column",
              justifyContent: s.soon ? "center" : "space-between",
              gap: s.soon ? 0 : 14,
              opacity: s.soon ? 0.55 : 1,
              transition: "opacity 0.15s",
            }}>
              {s.soon && (
                <div style={{
                  position: "absolute", top: 12, right: 12,
                  padding: "3px 9px", borderRadius: 8,
                  backgroundColor: "rgba(0,0,0,0.45)",
                  fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.85)",
                  letterSpacing: 0.3,
                }}>скоро</div>
              )}
              {s.id === "esim" && (
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 11px 5px 5px", borderRadius: 16,
                  backgroundColor: "rgba(0,0,0,0.55)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <span style={{
                    fontSize: 18, lineHeight: 1,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>🇫🇷</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.95)",
                    letterSpacing: 0.2,
                  }}>+110 других</span>
                </div>
              )}
              {!s.soon && (
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: `${s.color}1f`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <s.Icon size={20} color={s.color} strokeWidth={2} />
                </div>
              )}
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3, lineHeight: 1.3 }}>{s.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      </>
      ); })()}
      </div>
      {/* ═════════════ END DARK HERO AREA ═════════════ */}

      {/* ═════════════ FOLDER TABS — bridge dark→light ═════════════
          Hidden entirely when only one tab is non-empty (real app behavior) */}
      {blockVis.products && showTabsRow && (
        <div style={{
          backgroundColor: topC.bg, padding: "16px 12px 0",
          position: "sticky", top: 0, zIndex: 20,
        }}>
          <div style={{ display: "flex", gap: 4, position: "relative" }}>
            {(() => {
              const EAR = 10;
              return allTabs.map(tab => {
                const active = productTab === tab.key;
                return (
                  <div key={tab.key} onClick={() => setProductTab(tab.key)} style={{
                    position: "relative",
                    flex: 1,
                    padding: "11px 10px 13px", cursor: "pointer",
                    fontSize: 13, fontWeight: 700,
                    color: active ? C.text : "rgba(250,250,247,0.7)",
                    backgroundColor: active ? C.bg : "rgba(250,250,247,0.06)",
                    borderRadius: active ? "14px 14px 0 0" : "12px 12px 10px 10px",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    transition: "background-color 0.18s, color 0.18s",
                    zIndex: active ? 2 : 1,
                  }}>
                    {/* Folder-tab "ears" — concave curves at the bottom corners of the active tab */}
                    {active && (
                      <>
                        <div style={{
                          position: "absolute", left: -EAR, bottom: 0,
                          width: EAR, height: EAR,
                          backgroundImage: `radial-gradient(circle at top left, transparent ${EAR}px, ${C.bg} ${EAR}px)`,
                          pointerEvents: "none",
                        }} />
                        <div style={{
                          position: "absolute", right: -EAR, bottom: 0,
                          width: EAR, height: EAR,
                          backgroundImage: `radial-gradient(circle at top right, transparent ${EAR}px, ${C.bg} ${EAR}px)`,
                          pointerEvents: "none",
                        }} />
                      </>
                    )}
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: active ? C.muted : "rgba(250,250,247,0.45)",
                      }}>· {tab.count}</span>
                    )}
                    {tab.notif > 0 && (
                      <div style={{
                        minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8,
                        backgroundColor: "#EF4444",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 700, color: "#fff",
                        fontFeatureSettings: "'tnum'", lineHeight: 1,
                      }}>{tab.notif}</div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* ═════════════ LIGHT PRODUCTS AREA ═════════════ */}
      {blockVis.products && (
      <div style={{ order: blockOrder.indexOf("products"), padding: "24px 20px 24px", backgroundColor: C.bg }}>

        {/* ─── BANK TAB ─── */}
        {productTab === "bank" && (
          <div>
            {/* Cards — toggle between carousel and list */}
            <div style={{ marginBottom: 28 }}>
              <SectionHeader
                title="Карты"
                onAdd={() => {}}
                onToggleView={() => setCardsView(v => v === "carousel" ? "list" : "carousel")}
                viewMode={cardsView}
                C={C}
              />
              {cardsView === "carousel" ? (
                <div style={{
                  display: "flex", gap: 10,
                  overflowX: "auto", overflowY: "visible",
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                  padding: "20px 0 12px",
                }}>
                  {activeCardProducts
                    .flatMap(g => g.cards.map(c => ({ ...c, bank: g.bank })))
                    .sort((a, b) => b.primaryBalance - a.primaryBalance)
                    .map(card => (
                      <CardHero key={card.id} card={card} bank={card.bank} C={C} onOpen={onOpenCard} />
                    ))}
                  {featureFlags.openCard && (
                  <div data-press style={{
                    flexShrink: 0,
                    width: 76, height: 138,
                    borderRadius: 14,
                    border: `1.5px dashed ${C.borderStrong}`,
                    backgroundColor: C.faint,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                    cursor: "pointer",
                    scrollSnapAlign: "start",
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      backgroundColor: C.card, border: `1px solid ${C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Plus size={16} color={C.muted} strokeWidth={1.8} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 500, color: C.muted, textAlign: "center", padding: "0 6px" }}>Новая карта</span>
                  </div>
                  )}
                </div>
              ) : (
                /* List view — grouped by bank */
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {activeCardProducts.map((group, gi) => (
                    <div key={gi}>
                      <div style={{
                        fontSize: 12, fontWeight: 700, color: C.muted,
                        textTransform: "uppercase", letterSpacing: 0.4,
                        marginBottom: 8, padding: "0 4px",
                      }}>{group.bank}</div>
                      <div style={{
                        backgroundColor: C.card, borderRadius: 12,
                        border: `1px solid ${C.border}`, overflow: "hidden",
                      }}>
                        {[...group.cards].sort((a, b) => b.primaryBalance - a.primaryBalance).map((card, ci, sortedCards) => {
                          const cm = CURRENCY_META[card.primaryCurrency] || { symbol: card.primaryCurrency };
                          const allCurrencies = [card.primaryCurrency, ...card.breakdown.map(b => b.currency)];
                          const uniqueCurrencies = [...new Set(allCurrencies)];
                          const subtitle = card.sub
                            || (uniqueCurrencies.length > 1
                              ? uniqueCurrencies.join(" · ")
                              : "Активна");
                          return (
                            <div key={card.id} data-press onClick={() => onOpenCard?.(card)} style={{
                              display: "flex", alignItems: "center", gap: 14,
                              padding: "16px", cursor: "pointer",
                              borderBottom: ci < sortedCards.length - 1 ? `1px solid ${C.divider}` : "none",
                            }}>
                              <CardArt color={card.color} last4={card.last4} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.3,
                                  overflow: "hidden", textOverflow: "ellipsis",
                                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                                }}>{card.name}</div>
                                <div style={{
                                  fontSize: 12, color: C.muted, marginTop: 3,
                                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                }}>{subtitle}</div>
                              </div>
                              <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'", lineHeight: 1.3 }}>
                                  {fmtFull(card.primaryBalance)}
                                </div>
                                <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontWeight: 600 }}>
                                  {card.primaryCurrency}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accounts — toggle between carousel and list */}
            <div style={{ marginBottom: 28 }}>
              <SectionHeader
                title="Счета"
                onAdd={() => {}}
                onToggleView={activeAccounts.length > 0 ? () => setAccountsView(v => v === "carousel" ? "list" : "carousel") : null}
                viewMode={accountsView}
                C={C}
              />
              {activeAccounts.length === 0 ? (
                <div data-press style={{
                  backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
                  padding: "18px 16px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    backgroundColor: C.faint,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Plus size={16} color={C.text} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Открыть счёт</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Мультивалютный — KZT, USD, EUR, RUB</div>
                  </div>
                </div>
              ) : accountsView === "carousel" ? (
                <div style={{
                  display: "flex", gap: 10,
                  overflowX: "auto", overflowY: "visible",
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                  padding: "4px 0 8px",
                }}>
                  {activeAccounts.map(acc => (
                    <AccountHero key={acc.id} account={acc} C={C} onOpen={onOpenAccount} />
                  ))}
                  <div data-press style={{
                    flexShrink: 0,
                    width: 80, height: 124,
                    borderRadius: 14,
                    border: `1.5px dashed ${C.borderStrong}`,
                    backgroundColor: C.faint,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                    cursor: "pointer",
                    scrollSnapAlign: "start",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      backgroundColor: C.card, border: `1px solid ${C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Plus size={16} color={C.muted} strokeWidth={1.8} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 500, color: C.muted, textAlign: "center", padding: "0 6px" }}>Новый счёт</span>
                  </div>
                </div>
              ) : (
                /* List view */
                <div style={{
                  backgroundColor: C.card, borderRadius: 12,
                  border: `1px solid ${C.border}`, overflow: "hidden",
                }}>
                  {activeAccounts.map((acc, i) => {
                    const cm = CURRENCY_META[acc.currency] || { symbol: acc.currency, flag: "💰" };
                    const ibanTail = acc.number.replace(/\s/g, '').slice(-6);
                    return (
                      <div key={acc.id} data-press onClick={() => onOpenAccount?.(acc)} style={{
                        padding: "14px 16px", cursor: "pointer",
                        borderBottom: i < activeAccounts.length - 1 ? `1px solid ${C.divider}` : "none",
                        display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: "50%",
                          backgroundColor: C.faint,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, flexShrink: 0,
                        }}>{cm.flag}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{acc.name}</div>
                          <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>
                            {acc.currency} · ••{ibanTail}
                          </div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'", flexShrink: 0 }}>
                          {fmtFull(acc.balance)} <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{cm.symbol}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Loans — gated by real flag `p2pLoan` */}
            {featureFlags.p2pLoan && (
            <div style={{ marginBottom: 28 }}>
              <SectionHeader title="Денежные займы" onAdd={() => {}} C={C} />
              {activeLoans.length === 0 ? (
                <div data-press style={{
                  backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
                  padding: "18px 16px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    backgroundColor: C.faint,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Plus size={16} color={C.text} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Дать в долг</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Учитывайте долги друзей</div>
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: C.card, borderRadius: 12,
                  border: `1px solid ${C.border}`, overflow: "hidden",
                }}>
                  {activeLoans.map((loan, i) => {
                    const cm = CURRENCY_META[loan.currency] || { symbol: loan.currency };
                    return (
                      <div key={loan.id} data-press onClick={() => onOpenLoan?.(loan)} style={{
                        padding: "14px 16px", cursor: "pointer",
                        borderBottom: i < activeLoans.length - 1 ? `1px solid ${C.divider}` : "none",
                        display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: "50%",
                          backgroundColor: C.faint,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <Wallet size={17} color={C.text} strokeWidth={1.8} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{loan.name}</div>
                          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Возврат {loan.returnDate} · {loan.rate}%</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'", flexShrink: 0 }}>
                          {fmtFull(loan.balance)} <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{cm.symbol}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            )}

            {/* Credits */}
            <div>
              <SectionHeader title="Кредиты" onAdd={() => {}} C={C} />
              {activeCredits.length === 0 ? (
                featureFlags.openCredit ? (
                <div data-press style={{
                  backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
                  padding: "18px 16px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    backgroundColor: C.faint,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Plus size={16} color={C.text} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Взять кредит</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>До 30 млн ₸ от 12% годовых</div>
                  </div>
                </div>
                ) : null
              ) : (
                <div style={{
                  backgroundColor: C.card, borderRadius: 12,
                  border: `1px solid ${C.border}`, overflow: "hidden",
                }}>
                  {activeCredits.map((cr, i) => {
                    const cm = CURRENCY_META[cr.currency] || { symbol: cr.currency };
                    return (
                      <div key={cr.id} data-press onClick={() => onOpenCredit?.(cr)} style={{
                        padding: "14px 16px", cursor: "pointer",
                        borderBottom: i < activeCredits.length - 1 ? `1px solid ${C.divider}` : "none",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: "50%",
                            backgroundColor: C.faint,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            <CreditCard size={17} color={C.text} strokeWidth={1.8} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{cr.name}</div>
                            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Погашение {cr.payoffDate} · {cr.rate}%</div>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'", flexShrink: 0 }}>
                            {fmtFull(cr.monthly)} <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{cm.symbol}</span>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div style={{ marginTop: 12, marginLeft: 50 }}>
                          <div style={{
                            height: 4, borderRadius: 2, overflow: "hidden",
                            backgroundColor: C.divider,
                          }}>
                            <div style={{
                              width: `${cr.paidPercent}%`, height: "100%",
                              backgroundColor: C.accentDark, borderRadius: 2,
                              transition: "width 0.3s ease",
                            }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                            <span style={{ fontSize: 11, color: C.muted }}>Выплачено</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: C.text, fontFeatureSettings: "'tnum'" }}>{cr.paidPercent}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── DEPOSITS TAB ─── */}
        {productTab === "deposits" && (
          <div>
            {emptyState ? (
              <div style={{
                backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
                padding: "28px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>Нет активных депозитов</div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>Откройте депозит до 18% годовых</div>
                <div data-press style={{
                  display: "inline-block",
                  backgroundColor: C.accentDark, borderRadius: 8, padding: "10px 20px",
                  cursor: "pointer",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>Открыть депозит</span>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: C.card, borderRadius: 12,
                border: `1px solid ${C.border}`, overflow: "hidden",
              }}>
                {DEPOSITS.map((dep, i) => {
                  const cm = CURRENCY_META[dep.currency] || { symbol: dep.currency };
                  return (
                    <div key={dep.id} data-press onClick={() => onOpenDepositDetails?.(dep)} style={{
                      padding: "14px 16px", cursor: "pointer",
                      borderBottom: i < DEPOSITS.length - 1 ? `1px solid ${C.divider}` : "none",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{dep.name}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
                          {fmtFull(dep.balance)} <span style={{ fontSize: 11, color: C.muted }}>{cm.symbol}</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: C.muted }}>до {dep.closingDate}</span>
                        <span style={{ fontSize: 12, color: C.muted }}>{dep.rate}% годовых</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Открыть депозит — gated by real openDeposit flag */}
            {!emptyState && featureFlags.openDeposit && (
              <div data-press onClick={() => onOpenDeposit?.()} style={{
                marginTop: 12,
                backgroundColor: C.card, borderRadius: 12, border: `1.5px dashed ${C.borderStrong}`,
                padding: "15px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <Plus size={16} color={C.text} strokeWidth={2} />
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Открыть депозит</span>
              </div>
            )}
          </div>
        )}

        {/* ─── BROKER TAB ─── */}
        {productTab === "broker" && (
          <div>
            {emptyState ? (
              <div style={{
                backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
                padding: "28px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>Нет брокерских счетов</div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>Инвестируйте от 1 ₸</div>
                <div data-press style={{
                  display: "inline-block",
                  backgroundColor: C.accentDark, borderRadius: 8, padding: "10px 20px",
                  cursor: "pointer",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>Открыть счёт</span>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {BROKER_ACCOUNTS.map((group, gi) => (
                  <div key={gi}>
                    <SectionHeader title={group.group} C={C} />
                    <div style={{
                      backgroundColor: C.card, borderRadius: 12,
                      border: `1px solid ${C.border}`, overflow: "hidden",
                    }}>
                      {group.accounts.map((acc, i) => (
                        <div key={acc.id} data-press onClick={() => onOpenBroker?.(acc)} style={{
                          padding: "14px 16px", cursor: "pointer",
                          borderBottom: i < group.accounts.length - 1 ? `1px solid ${C.divider}` : "none",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{acc.id}</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
                              {fmtFull(acc.balance)} <span style={{ fontSize: 11, color: C.muted }}>{acc.currency}</span>
                            </span>
                          </div>
                          <span style={{ fontSize: 12, color: C.muted }}>{acc.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* ═══ CTA ═══ (hidden when all open* flags are off, real gating) */}
      {blockVis.cta && (featureFlags.openCard || featureFlags.openDeposit || featureFlags.openCredit) && (
      <div style={{ order: blockOrder.indexOf("cta"), padding: "0 20px 32px" }}>
        <div data-press onClick={() => featureFlags.openDeposit && onOpenDeposit?.()} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "14px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>Новая карта или продукт</span>
        </div>
      </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════════
   BOTTOM TAB BAR — real HomeTab: products / statistics / payments / chat
   ═══════════════════════════════════════════════ */

function BottomTabBar({ active, onChange, C }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      maxWidth: 430, margin: "0 auto",
      backgroundColor: C.bg,
      borderTop: `1px solid ${C.divider}`,
      padding: "0 0 24px",
      display: "flex", justifyContent: "space-around",
      zIndex: 50,
    }}>
      {[
        { key: "products", Icon: Wallet, label: "Продукты" },
        { key: "statistics", Icon: BarChart3, label: "Статистика" },
        { key: "payments", Icon: ArrowLeftRight, label: "Переводы" },
        { key: "chats", Icon: MessageCircle, label: "Чаты" },
      ].map(tab => {
        const isActive = active === tab.key;
        return (
          <div key={tab.key} data-press onClick={() => onChange(tab.key)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            cursor: "pointer", flex: 1, paddingTop: 10, paddingBottom: 6,
            position: "relative",
          }}>
            {isActive && (
              <div style={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 28, height: 3, borderRadius: "0 0 3px 3px",
                backgroundColor: C.accentDark,
              }} />
            )}
            <tab.Icon size={22} color={isActive ? C.accentDark : C.muted} strokeWidth={isActive ? 2.2 : 1.7} />
            <span style={{
              fontSize: 10, fontWeight: isActive ? 700 : 500,
              color: isActive ? C.accentDark : C.muted,
            }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAYMENTS SCREEN — real Переводы tab
   Sections and texts from PaymentsViewModel + Localizable.strings:
   Шаблоны → «Себе» → «Другим» → «Оплата услуг»
   ═══════════════════════════════════════════════ */

function PaymentsScreen({ C, featureFlags, onOpenStub, onTransferOwn, onRequestMoney, onPhoneTransfer, onConversion, onQrScan, onSwift, onCardTransfer, onIban, onMobilePay, onOpenCategory, onOpenTemplate }) {
  const Row = ({ Icon, color, title, subtitle, last, onClick }) => (
    <div data-press onClick={onClick || onOpenStub} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "13px 16px", cursor: "pointer",
      borderBottom: last ? "none" : `1px solid ${C.divider}`,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        backgroundColor: `${color}14`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={17} color={color} strokeWidth={1.9} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <ChevronRight size={15} color={C.muted} strokeWidth={1.8} />
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: -0.2, marginBottom: 12 }}>{title}</div>
      <div style={{
        backgroundColor: C.card, borderRadius: 12,
        border: `1px solid ${C.border}`, overflow: "hidden",
      }}>{children}</div>
    </div>
  );

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100dvh",
      backgroundColor: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      overflowX: "clip", paddingBottom: 90,
    }}>
      <StatusBar C={C} />
      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>Переводы</div>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          backgroundColor: C.card, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "10px 14px", marginBottom: 20,
        }}>
          <Search size={16} color={C.muted} strokeWidth={1.8} />
          <span style={{ fontSize: 14, color: C.muted }}>Поиск</span>
        </div>

        {/* Шаблоны и автопереводы (real `paymentTemplate`) */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: -0.2, marginBottom: 12 }}>Шаблоны и автопереводы</div>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
            {PAYMENT_TEMPLATES.map(t => (
              <div key={t.id} data-press onClick={() => onOpenTemplate?.(t)} style={{
                flexShrink: 0, width: 56, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6, cursor: "pointer",
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: "50%",
                  backgroundColor: `${t.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21,
                }}>{t.emoji}</div>
                <span style={{ fontSize: 10, fontWeight: 500, color: C.sub, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 56 }}>{t.title}</span>
              </div>
            ))}
            <div data-press onClick={onOpenStub} style={{
              flexShrink: 0, width: 56, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 6, cursor: "pointer",
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: "50%",
                backgroundColor: C.faint,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Plus size={18} color={C.sub} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 10, color: C.muted }}>Новый</span>
            </div>
          </div>
        </div>

        {/* Себе (ownTransfersSection) */}
        <Section title="Себе">
          <Row Icon={Repeat} color="#22C55E" title="Между счетами" subtitle="Мгновенно и без комиссии" onClick={onTransferOwn} />
          <Row Icon={ArrowDownLeft} color="#3B82F6" title="С карты другого банка" subtitle="Пополнение Visa или Mastercard" />
          {featureFlags.conversionRates ? (
            <Row Icon={ArrowLeftRight} color="#F59E0B" title="Конвертация валют" subtitle={`1$ = ${RATES_TO_KZT.USD}₸ · 1€ = ${RATES_TO_KZT.EUR}₸`} onClick={onConversion} last />
          ) : (
            <Row Icon={ArrowLeftRight} color="#F59E0B" title="Конвертация валют" onClick={onConversion} last />
          )}
        </Section>

        {/* Другим (othersTransfersSection) */}
        <Section title="Другим">
          {featureFlags.toPhoneNumber && (
            <Row Icon={Phone} color="#22C55E" title="По номеру телефона" subtitle="Внутри банка и за его пределами" onClick={onPhoneTransfer} />
          )}
          <Row Icon={Landmark} color="#0D9488" title="Внутри Банка" subtitle="На карту или счет" onClick={onCardTransfer} />
          <Row Icon={CreditCard} color="#3B82F6" title="По номеру карты" subtitle="Visa или Mastercard" onClick={onCardTransfer} />
          <Row Icon={FileText} color="#8B5CF6" title="По номеру счета" subtitle="IBAN-перевод" onClick={onIban} />
          {featureFlags.paySwift && (
            <Row Icon={Globe} color="#06B6D4" title="Переводом SWIFT" subtitle="В любую страну" onClick={onSwift} />
          )}
          {featureFlags.moneyRequest && (
            <Row Icon={Send} color="#EC4899" title="Запросить" subtitle="У клиента банка" onClick={onRequestMoney} />
          )}
          <Row Icon={TrendingUp} color="#F59E0B" title="На брокерский счёт" subtitle="Freedom Broker" last />
        </Section>

        {/* Оплата услуг (paymentsSection) */}
        <Section title="Оплата услуг">
          <Row Icon={QrCode} color="#22C55E" title="Оплата по QR или штрихкоду" onClick={onQrScan} />
          {PAYMENT_CATEGORIES.map((cat, i) => (
            <Row key={cat.id} Icon={cat.Icon} color={cat.color} title={cat.title}
              onClick={cat.id === "mobile" && featureFlags.payMobile ? onMobilePay : () => onOpenCategory?.(cat)}
              last={i === PAYMENT_CATEGORIES.length - 1} />
          ))}
        </Section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PRODUCT DETAILS SCREEN — real ProductDetails module
   Card visual + balance + actions + transactions
   ═══════════════════════════════════════════════ */

function ProductDetailsScreen({ card, C, featureFlags, onBack, onTransfer, onOpenTransaction, onOpenLimits, onOpenPinChange, onOpenRequisites, onTopUp, onOpenAllTransactions }) {
  const [panVisible, setPanVisible] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const cm = CURRENCY_META[card.primaryCurrency] || { symbol: card.primaryCurrency };
  const fullPan = `4400 4300 1234 ${card.last4}`;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 80,
      maxWidth: 430, margin: "0 auto",
      backgroundColor: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      overflowY: "auto", overflowX: "clip",
      animation: "screen-slide-in 0.25s ease-out",
    }}>
      <StatusBar C={C} />
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 12px 16px",
      }}>
        <div data-press onClick={onBack} style={{
          width: 36, height: 36, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <ArrowLeft size={20} color={C.text} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 700, color: C.text }}>
          {card.name}
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Big card visual */}
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 20px 20px" }}>
        <div style={{
          width: 240, height: 150, borderRadius: 16,
          backgroundColor: card.color, position: "relative", overflow: "hidden",
          boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
          opacity: isFrozen ? 0.45 : 1,
          filter: isFrozen ? "saturate(0.3)" : "none",
          transition: "opacity 0.25s, filter 0.25s",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.18) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(0,0,0,0.2) 0%, transparent 50%)
            `,
          }} />
          {/* Chip */}
          <div style={{
            position: "absolute", top: 18, left: 20,
            width: 32, height: 24, borderRadius: 5,
            background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 100%)",
          }} />
          {/* PAN — real `cardPanCVV` flag gates the number display */}
          <div style={{
            position: "absolute", bottom: 42, left: 20,
            fontSize: 16, fontWeight: 700, color: "#fff",
            fontFeatureSettings: "'tnum'", letterSpacing: 1.6,
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}>
            {panVisible ? fullPan : `••••  ••••  ••••  ${card.last4}`}
          </div>
          <div style={{
            position: "absolute", bottom: 16, right: 18,
            fontSize: 15, fontWeight: 800, fontStyle: "italic",
            color: "#fff", letterSpacing: 0.4,
            textShadow: "0 1px 2px rgba(0,0,0,0.35)",
          }}>VISA</div>
          {featureFlags.cardPanCVV && (
            <div data-press onClick={() => setPanVisible(v => !v)} style={{
              position: "absolute", top: 14, right: 14,
              width: 32, height: 32, borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
              {panVisible
                ? <EyeOff size={15} color="#fff" strokeWidth={1.9} />
                : <Eye size={15} color="#fff" strokeWidth={1.9} />}
            </div>
          )}
        </div>
      </div>

      {/* Balance */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 6 }}>Доступно</div>
        <div style={{
          fontSize: 32, fontWeight: 800, color: C.text,
          letterSpacing: -1, fontFeatureSettings: "'tnum'", lineHeight: 1,
        }}>
          {fmtFull(card.primaryBalance)} <span style={{ fontSize: 18, fontWeight: 700, color: C.muted }}>{cm.symbol}</span>
        </div>
      </div>

      {/* Actions — real ProductInfoAction set */}
      <div style={{ display: "flex", justifyContent: "center", gap: 22, marginBottom: 28 }}>
        {[
          { Icon: Plus, label: "Пополнить", onClick: onTopUp },
          { Icon: Send, label: "Перевести", onClick: onTransfer },
          { Icon: FileText, label: "Реквизиты", onClick: onOpenRequisites },
          { Icon: Snowflake, label: isFrozen ? "Разморозить" : "Заморозить", onClick: () => setIsFrozen(v => !v), active: isFrozen },
        ].map((a, i) => (
          <div key={i} data-press onClick={a.onClick} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
            cursor: "pointer", width: 64,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              backgroundColor: C.accentDark,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <a.Icon size={19} color={C.accent} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: C.sub }}>{a.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px 110px" }}>
        {/* Currency breakdown (multi-currency card) */}
        {card.breakdown && card.breakdown.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Валютные счета</div>
            <div style={{
              backgroundColor: C.card, borderRadius: 12,
              border: `1px solid ${C.border}`, overflow: "hidden",
            }}>
              {card.breakdown.map((b, i) => {
                const bm = CURRENCY_META[b.currency] || { symbol: b.currency, flag: "💰" };
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 16px",
                    borderBottom: i < card.breakdown.length - 1 ? `1px solid ${C.divider}` : "none",
                  }}>
                    <span style={{ fontSize: 18 }}>{bm.flag}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>{b.currency}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
                      {fmtFull(b.amount)} <span style={{ fontSize: 11, color: C.muted }}>{bm.symbol}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Transactions — real "Транзакции под продуктом" */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Транзакции</span>
            <span data-press onClick={onOpenAllTransactions} style={{ fontSize: 13, color: C.text, fontWeight: 500, cursor: "pointer", opacity: 0.7 }}>Все</span>
          </div>
          <div style={{
            backgroundColor: C.card, borderRadius: 12,
            border: `1px solid ${C.border}`, overflow: "hidden",
          }}>
            {TRANSACTIONS.map((t, i) => (
              <div key={t.id} data-press onClick={() => onOpenTransaction?.(t)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "13px 16px", cursor: "pointer",
                borderBottom: i < TRANSACTIONS.length - 1 ? `1px solid ${C.divider}` : "none",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  backgroundColor: `${t.color}14`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <t.Icon size={16} color={t.color} strokeWidth={1.9} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.category} · {t.time}</div>
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 700, fontFeatureSettings: "'tnum'", flexShrink: 0,
                  color: t.amount > 0 ? "#16A34A" : C.text,
                }}>
                  {t.amount > 0 ? "+" : ""}{fmtFull(t.amount)} ₸
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Управление — real modules CardLimits / SetCardPin / ProductRequisites */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Управление</div>
          <div style={{
            backgroundColor: C.card, borderRadius: 12,
            border: `1px solid ${C.border}`, overflow: "hidden",
          }}>
            {[
              { Icon: Settings2, title: "Лимиты по карте", onClick: onOpenLimits },
              /* real cardSetPin flag */
              ...(featureFlags.cardSetPin ? [{ Icon: CreditCard, title: "Сменить ПИН-код", onClick: onOpenPinChange }] : []),
              { Icon: FileText, title: "Реквизиты счёта", onClick: onOpenRequisites },
            ].map((r, i, arr) => (
              <div key={i} data-press onClick={r.onClick} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "13px 16px", cursor: "pointer",
                borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  backgroundColor: C.faint,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <r.Icon size={16} color={C.text} strokeWidth={1.8} />
                </div>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>{r.title}</span>
                <ChevronRight size={15} color={C.muted} strokeWidth={1.8} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STUB SCREEN — for tabs not yet ported
   ═══════════════════════════════════════════════ */

function StubScreen({ C, title, note }) {
  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100dvh",
      backgroundColor: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      <StatusBar C={C} />
      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>{title}</div>
      </div>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 12,
        padding: "0 40px 120px", textAlign: "center",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          backgroundColor: C.faint,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Clock size={26} color={C.muted} strokeWidth={1.6} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.sub }}>Экран в очереди</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{note}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STATISTICS SCREEN — real Transactions flow
   («Статистика», «Движение средств», «Категории расходов»)
   ═══════════════════════════════════════════════ */

function StatisticsScreen({ C, onOpenTransaction }) {
  const [period, setPeriod] = useState("month");
  const [configOpen, setConfigOpen] = useState(false);
  const [hiddenCats, setHiddenCats] = useState([]);
  const isDark = C.bg === '#0E0F0C';
  const spent = TRANSACTIONS.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const income = TRANSACTIONS.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  // Категории расходов (real totalTransactionsDetails)
  const byCategory = {};
  TRANSACTIONS.filter(t => t.amount < 0).forEach(t => {
    if (!byCategory[t.category]) byCategory[t.category] = { sum: 0, Icon: t.Icon, color: t.color };
    byCategory[t.category].sum += Math.abs(t.amount);
  });
  const allCategories = Object.entries(byCategory).sort((a, b) => b[1].sum - a[1].sum);
  const categories = allCategories.filter(([name]) => !hiddenCats.includes(name));
  const maxCat = categories.length ? categories[0][1].sum : 1;

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100dvh",
      backgroundColor: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      overflowX: "clip", paddingBottom: 90,
    }}>
      <StatusBar C={C} />
      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>Статистика</div>

        {/* Период (real transactionFilters.periodSheet) */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { key: "month", label: "За месяц" },
            { key: "year", label: "За год" },
            { key: "range", label: "Период" },
          ].map(p => (
            <div key={p.key} data-press onClick={() => setPeriod(p.key)} style={{
              padding: "7px 14px", borderRadius: 18, cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              backgroundColor: period === p.key ? C.accentDark : C.faint,
              color: period === p.key ? C.accent : C.sub,
              transition: "all 0.15s",
            }}>{p.label}</div>
          ))}
        </div>

        {/* Движение средств (real navigationCashFlowTitle) */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Движение средств</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{
              backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
              padding: "14px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <ArrowDownLeft size={14} color="#16A34A" strokeWidth={2.2} />
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Поступления</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#16A34A", fontFeatureSettings: "'tnum'" }}>
                +{fmtFull(income)} <span style={{ fontSize: 12 }}>₸</span>
              </div>
            </div>
            <div style={{
              backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
              padding: "14px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <TrendingUp size={14} color="#EF4444" strokeWidth={2.2} style={{ transform: "rotate(90deg)" }} />
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Траты</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'" }}>
                −{fmtFull(spent)} <span style={{ fontSize: 12, color: C.muted }}>₸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Категории расходов (real totalTransactionsDetails.navigationTitle) */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Категории расходов</span>
            <span data-press onClick={() => setConfigOpen(true)} style={{ fontSize: 13, color: C.text, fontWeight: 500, cursor: "pointer", opacity: 0.7 }}>Настроить</span>
          </div>
          <div style={{
            backgroundColor: C.card, borderRadius: 12,
            border: `1px solid ${C.border}`, overflow: "hidden",
          }}>
            {categories.map(([name, cat], i) => (
              <div key={name} style={{
                padding: "13px 16px",
                borderBottom: i < categories.length - 1 ? `1px solid ${C.divider}` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    backgroundColor: `${cat.color}14`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <cat.Icon size={15} color={cat.color} strokeWidth={1.9} />
                  </div>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>{name}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
                    {fmtFull(cat.sum)} <span style={{ fontSize: 11, color: C.muted }}>₸</span>
                  </span>
                </div>
                <div style={{
                  marginTop: 8, marginLeft: 46, height: 4, borderRadius: 2,
                  backgroundColor: C.divider, overflow: "hidden",
                }}>
                  <div style={{
                    width: `${(cat.sum / maxCat) * 100}%`, height: "100%",
                    backgroundColor: cat.color, borderRadius: 2,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* История операций */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>История операций</div>
          <div style={{
            backgroundColor: C.card, borderRadius: 12,
            border: `1px solid ${C.border}`, overflow: "hidden",
          }}>
            {TRANSACTIONS.map((t, i) => (
              <div key={t.id} data-press onClick={() => onOpenTransaction?.(t)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "13px 16px", cursor: "pointer",
                borderBottom: i < TRANSACTIONS.length - 1 ? `1px solid ${C.divider}` : "none",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  backgroundColor: `${t.color}14`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <t.Icon size={16} color={t.color} strokeWidth={1.9} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.category} · {t.time}</div>
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 700, fontFeatureSettings: "'tnum'", flexShrink: 0,
                  color: t.amount > 0 ? "#16A34A" : C.text,
                }}>
                  {t.amount > 0 ? "+" : ""}{fmtFull(t.amount)} ₸
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Настроить категории — sheet with toggles */}
      {configOpen && (
        <BottomSheetModal C={C} onClose={() => setConfigOpen(false)}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 16 }}>Категории расходов</div>
          {allCategories.map(([name, cat]) => {
            const on = !hiddenCats.includes(name);
            return (
              <div key={name} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 0",
                borderBottom: `1px solid ${C.divider}`,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  backgroundColor: `${cat.color}14`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <cat.Icon size={15} color={cat.color} strokeWidth={1.9} />
                </div>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: on ? C.text : C.muted }}>{name}</span>
                <div onClick={() => setHiddenCats(prev => on ? [...prev, name] : prev.filter(x => x !== name))} style={{
                  width: 38, height: 22, borderRadius: 11,
                  backgroundColor: on ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
                  position: "relative", cursor: "pointer", flexShrink: 0,
                  transition: "background-color 0.15s",
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff",
                    position: "absolute", top: 2, left: on ? 18 : 2, transition: "left 0.15s",
                  }} />
                </div>
              </div>
            );
          })}
        </BottomSheetModal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TRANSFER OWN FLOW — real «Между своими счетами»
   TransferOwn → TransferConfirm → TransferResult
   ═══════════════════════════════════════════════ */

const TRANSFER_PRODUCTS = [
  { id: "a1", name: "Текущий счёт", number: "••145USD", balance: 12345.67, currency: "USD" },
  { id: "a5", name: "Мой счёт в USD", number: "••0907US", balance: 25000.00, currency: "USD" },
];

function ScreenShell({ C, title, onBack, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 80,
      maxWidth: 430, margin: "0 auto",
      backgroundColor: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      overflowY: "auto", overflowX: "clip",
      animation: "screen-slide-in 0.25s ease-out",
    }}>
      <StatusBar C={C} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px 16px" }}>
        {onBack ? (
          <div data-press onClick={onBack} style={{
            width: 36, height: 36, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <ArrowLeft size={20} color={C.text} strokeWidth={2} />
          </div>
        ) : <div style={{ width: 36 }} />}
        <div style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 700, color: C.text }}>{title}</div>
        <div style={{ width: 36 }} />
      </div>
      {children}
    </div>
  );
}

function TransferOwnScreen({ C, featureFlags, onBack, onNext }) {
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [amount, setAmount] = useState("1000");
  const from = TRANSFER_PRODUCTS[fromIdx];
  const to = TRANSFER_PRODUCTS[toIdx];
  const num = parseFloat(amount.replace(",", ".")) || 0;
  const valid = num > 0 && num <= from.balance;
  const cm = CURRENCY_META[from.currency] || { symbol: from.currency };

  const ProductRow = ({ label, product }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{label}</div>
      <div style={{
        backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
        padding: "13px 16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", backgroundColor: C.faint,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0,
        }}>🇺🇸</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{product.name}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>{product.number}</div>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
          {fmtFull(product.balance)} <span style={{ fontSize: 11, color: C.muted }}>$</span>
        </span>
      </div>
    </div>
  );

  return (
    <ScreenShell C={C} title="Между своими счетами" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <ProductRow label="Списать со счёта" product={from} />

        {/* Swap — real `transferSwap` flag */}
        {featureFlags.transferSwap && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div data-press onClick={() => { setFromIdx(toIdx); setToIdx(fromIdx); }} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 18,
              backgroundColor: C.faint, cursor: "pointer",
            }}>
              <Repeat size={13} color={C.sub} strokeWidth={2} style={{ transform: "rotate(90deg)" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>Поменять счета местами</span>
            </div>
          </div>
        )}

        <ProductRow label="Зачислить на счёт" product={to} />

        {/* Сумма (real sumFieldTitle) */}
        <div style={{ marginTop: 20, marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Сумма</div>
          <div style={{
            backgroundColor: C.card, borderRadius: 12,
            border: `1.5px solid ${valid || !amount ? C.border : "#EF4444"}`,
            padding: "16px", display: "flex", alignItems: "center", gap: 8,
          }}>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
              inputMode="decimal"
              placeholder="0"
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontSize: 26, fontWeight: 800, color: C.text,
                fontFamily: "inherit", fontFeatureSettings: "'tnum'",
                minWidth: 0,
              }}
            />
            <span style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>{cm.symbol}</span>
          </div>
          {!valid && amount && num > from.balance && (
            <div style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>
              Перевод должен быть меньше {fmtFull(from.balance)} {cm.symbol}
            </div>
          )}
          {!valid && amount && num <= 0 && (
            <div style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>
              Перевод должен быть больше 0 {cm.symbol}
            </div>
          )}
        </div>

        <div style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>Без комиссии · мгновенно</div>

        <div data-press onClick={() => valid && onNext({ from, to, amount: num })} style={{
          backgroundColor: valid ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: valid ? "pointer" : "default",
          transition: "background-color 0.15s",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Перевести</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function TransferConfirmScreen({ C, payload, onBack, onConfirm }) {
  const { from, to, amount } = payload;
  const rows = [
    { label: "Списать со счёта", value: `${from.name} · ${from.number}` },
    { label: "Зачислить на счёт", value: `${to.name} · ${to.number}` },
    { label: "Сумма", value: `${fmtFull(amount)} $` },
    { label: "Комиссия", value: "Без комиссии" },
  ];
  return (
    <ScreenShell C={C} title="Подтверждение" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <div style={{ textAlign: "center", margin: "12px 0 28px" }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 8 }}>Перевод между счетами</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(amount)} <span style={{ fontSize: 20, color: C.muted }}>$</span>
          </div>
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 24,
        }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 16px", gap: 12,
              borderBottom: i < rows.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text, textAlign: "right" }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div data-press onClick={onConfirm} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>Подтвердить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function TransferResultScreen({ C, payload, onDone }) {
  const { to, amount } = payload;
  return (
    <ScreenShell C={C} title="">
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "48px 40px 110px", textAlign: "center",
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          backgroundColor: "rgba(34,197,94,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            backgroundColor: "#22C55E",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Check size={30} color="#fff" strokeWidth={3} />
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Успешно</div>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, marginBottom: 4 }}>
          Перевод выполнен
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'", margin: "12px 0 4px" }}>
          {fmtFull(amount)} <span style={{ fontSize: 17, color: C.muted }}>$</span>
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 40 }}>
          на {to.name} · {to.number}
        </div>
        <div data-press onClick={onDone} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer", alignSelf: "stretch",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>Готово</span>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   PRODUCTS TOTAL — real «Общий баланс» screen
   («Банковские и инвестиционные счета», «Мои деньги»)
   ═══════════════════════════════════════════════ */

function ProductsTotalScreen({ C, totalInKZT, displayCurrency, onBack }) {
  const displayMeta = CURRENCY_META[displayCurrency] || { symbol: displayCurrency };
  const totalDisplay = convertTo(totalInKZT, displayCurrency);

  // «Мои деньги» — per-currency totals from accounts + card primaries
  const groups = {};
  ACCOUNTS_LIST.forEach(a => {
    if (!groups[a.currency]) groups[a.currency] = { total: 0, count: 0 };
    groups[a.currency].total += a.balance;
    groups[a.currency].count += 1;
  });
  CARD_PRODUCTS.forEach(g => g.cards.forEach(c => {
    if (!groups[c.primaryCurrency]) groups[c.primaryCurrency] = { total: 0, count: 0 };
    groups[c.primaryCurrency].total += c.primaryBalance;
    groups[c.primaryCurrency].count += 1;
  }));
  const rows = Object.entries(groups)
    .sort((a, b) => convertToKZT(b[1].total, b[0]) - convertToKZT(a[1].total, a[0]));

  return (
    <ScreenShell C={C} title="Общий баланс" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 10 }}>
            Банковские и инвестиционные счета
          </div>
          <div style={{
            fontSize: 36, fontWeight: 800, color: C.text,
            letterSpacing: -1.2, fontFeatureSettings: "'tnum'", lineHeight: 1,
          }}>
            {fmtInt(totalDisplay)} <span style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>{displayCurrency}</span>
          </div>
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Мои деньги</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16,
        }}>
          {rows.map(([code, g], i) => {
            const cm = CURRENCY_META[code] || { symbol: code, flag: "💰" };
            const word = g.count === 1 ? "счёт" : g.count < 5 ? "счёта" : "счетов";
            return (
              <div key={code} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "13px 16px",
                borderBottom: i < rows.length - 1 ? `1px solid ${C.divider}` : "none",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", backgroundColor: C.faint,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 17, flexShrink: 0,
                }}>{cm.flag}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{code}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{g.count} {word}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
                    {fmtFull(g.total)} <span style={{ fontSize: 11, color: C.muted }}>{cm.symbol}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>
                    ≈ {fmtCompact(convertToKZT(g.total, code))} ₸
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Курс пересчёта */}
        <div style={{
          backgroundColor: C.faint, borderRadius: 12, padding: "12px 16px",
          fontSize: 12, color: C.muted, lineHeight: 1.5,
        }}>
          Пересчёт в {displayCurrency} по курсу банка: 1$ = {RATES_TO_KZT.USD}₸ · 1€ = {RATES_TO_KZT.EUR}₸ · 1₽ = {RATES_TO_KZT.RUB}₸
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   SUCCESS SCREEN — generic result (Запрос отправлен / Успешно)
   ═══════════════════════════════════════════════ */

function SuccessScreen({ C, title, message, amountStr, note, onDone }) {
  return (
    <ScreenShell C={C} title="">
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "48px 40px 110px", textAlign: "center",
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          backgroundColor: "rgba(34,197,94,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            backgroundColor: "#22C55E",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Check size={30} color="#fff" strokeWidth={3} />
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>{title}</div>
        {message && <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5 }}>{message}</div>}
        {amountStr && (
          <div style={{ fontSize: 28, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'", margin: "12px 0 4px" }}>
            {amountStr}
          </div>
        )}
        {note && <div style={{ fontSize: 13, color: C.muted, marginBottom: 40 }}>{note}</div>}
        {!note && <div style={{ marginBottom: 40 }} />}
        <div data-press onClick={onDone} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer", alignSelf: "stretch",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>Готово</span>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   TRANSACTION DETAILS — real TransacitonDetails
   («Транзакция», Карта списания, «В шаблоны», «Разделить»)
   ═══════════════════════════════════════════════ */

function TransactionDetailsScreen({ tx, C, featureFlags, onBack, onSplit, onAddTemplate }) {
  const isExpense = tx.amount < 0;
  return (
    <ScreenShell C={C} title="Транзакция" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            backgroundColor: `${tx.color}14`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <tx.Icon size={26} color={tx.color} strokeWidth={1.9} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{tx.name}</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>{tx.category}</div>
          <div style={{
            fontSize: 32, fontWeight: 800, fontFeatureSettings: "'tnum'", letterSpacing: -1,
            color: tx.amount > 0 ? "#16A34A" : C.text,
          }}>
            {tx.amount > 0 ? "+" : ""}{fmtFull(tx.amount)} <span style={{ fontSize: 18, color: C.muted }}>₸</span>
          </div>
          {/* Status chip */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            marginTop: 12, padding: "5px 12px", borderRadius: 14,
            backgroundColor: "rgba(34,197,94,0.1)",
          }}>
            <Check size={12} color="#16A34A" strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#16A34A" }}>Успешно</span>
          </div>
        </div>

        {/* Details rows — real transactionDetails labels */}
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16,
        }}>
          {[
            { label: isExpense ? "Карта списания" : "Карта зачисления", value: "DepositCard ••4521" },
            { label: "Дата и время", value: tx.time },
            { label: "Категория", value: tx.category },
            { label: "Статус", value: "Проведена" },
          ].map((r, i, arr) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 16px", gap: 12,
              borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text, textAlign: "right" }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Actions: В шаблоны + Разделить (real `split` flag) */}
        <div style={{ display: "flex", gap: 10 }}>
          <div data-press onClick={() => onAddTemplate?.(tx)} style={{
            flex: 1, backgroundColor: C.faint, borderRadius: 12, padding: "14px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>В шаблоны</span>
          </div>
          {featureFlags.split && isExpense && (
            <div data-press onClick={() => onSplit(tx)} style={{
              flex: 1, backgroundColor: C.accentDark, borderRadius: 12, padding: "14px 0",
              textAlign: "center", cursor: "pointer",
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>Разделить</span>
            </div>
          )}
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   SPLIT PAYMENT — real SplitPayment flow
   («Разделить счет» → «Подтверждение» → «Запрос отправлен»)
   ═══════════════════════════════════════════════ */

function SplitMainScreen({ tx, C, onBack, onNext }) {
  const [selected, setSelected] = useState([1, 2]); // ids from RECENT_TRANSFERS
  const total = Math.abs(tx.amount);
  const perPerson = total / (selected.length + 1); // + you
  const toggle = (id) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  return (
    <ScreenShell C={C} title="Разделить счет" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        {/* Вы заплатили (real youPaid) */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 8 }}>Вы заплатили</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'", letterSpacing: -1 }}>
            {fmtFull(total)} <span style={{ fontSize: 18, color: C.muted }}>₸</span>
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{tx.name}</div>
        </div>

        {/* Разделить между (real splitBetween) */}
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Разделить между</div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 8, marginBottom: 20 }}>
          {/* Это вы (real its.you) */}
          <div style={{
            flexShrink: 0, width: 56, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 6, opacity: 0.6,
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%",
              backgroundColor: C.accentDark,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: C.accent,
            }}>НШ</div>
            <span style={{ fontSize: 10, color: C.muted, whiteSpace: "nowrap" }}>Это вы</span>
          </div>
          {RECENT_TRANSFERS.map(c => {
            const on = selected.includes(c.id);
            return (
              <div key={c.id} data-press onClick={() => toggle(c.id)} style={{
                flexShrink: 0, width: 56, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6, cursor: "pointer", position: "relative",
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${c.color}aa 0%, ${c.color} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, lineHeight: 1,
                  border: on ? "2.5px solid #22C55E" : "2.5px solid transparent",
                  opacity: on ? 1 : 0.55,
                  transition: "all 0.15s",
                }}>{c.photo}</div>
                {on && (
                  <div style={{
                    position: "absolute", top: -2, right: 0,
                    width: 18, height: 18, borderRadius: "50%",
                    backgroundColor: "#22C55E", border: `2px solid ${C.bg}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={10} color="#fff" strokeWidth={3} />
                  </div>
                )}
                <span style={{
                  fontSize: 10, fontWeight: 500, color: on ? C.sub : C.muted,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 56,
                }}>{c.name}</span>
              </div>
            );
          })}
        </div>

        {/* Как разделить (real splitTypeTitle / bySumTitle) */}
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Как разделить</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1.5px solid ${C.accentDark}`,
          padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            backgroundColor: C.accentDark,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Check size={12} color={C.accent} strokeWidth={3} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>По сумме</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Сумма делится на всех участников</div>
          </div>
        </div>

        {/* Preview */}
        {selected.length > 0 && (
          <div style={{
            backgroundColor: C.faint, borderRadius: 12, padding: "12px 16px",
            fontSize: 13, color: C.sub, marginBottom: 20, lineHeight: 1.5,
          }}>
            Заплатит вам: <b style={{ color: C.text, fontFeatureSettings: "'tnum'" }}>{fmtFull(perPerson)} ₸</b> × {selected.length} {selected.length === 1 ? "участник" : selected.length < 5 ? "участника" : "участников"}
          </div>
        )}

        <div data-press onClick={() => selected.length > 0 && onNext({ tx, contactIds: selected, perPerson })} style={{
          backgroundColor: selected.length > 0 ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: selected.length > 0 ? "pointer" : "default",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: selected.length > 0 ? C.accent : C.muted }}>Продолжить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function SplitConfirmScreen({ C, payload, onBack, onConfirm }) {
  const { tx, contactIds, perPerson } = payload;
  const contacts = RECENT_TRANSFERS.filter(c => contactIds.includes(c.id));
  return (
    <ScreenShell C={C} title="Подтверждение" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <div style={{ textAlign: "center", margin: "12px 0 28px" }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 8 }}>Разделить счет · {tx.name}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(Math.abs(tx.amount))} <span style={{ fontSize: 20, color: C.muted }}>₸</span>
          </div>
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 24,
        }}>
          {contacts.map((c, i) => (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px",
              borderBottom: `1px solid ${C.divider}`,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: `linear-gradient(135deg, ${c.color}aa 0%, ${c.color} 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, flexShrink: 0,
              }}>{c.photo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{c.name} {c.surname}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Заплатит вам</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
                {fmtFull(perPerson)} <span style={{ fontSize: 11, color: C.muted }}>₸</span>
              </span>
            </div>
          ))}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "13px 16px", backgroundColor: C.faint,
          }}>
            <span style={{ fontSize: 13, color: C.muted }}>Итого вернётся</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#16A34A", fontFeatureSettings: "'tnum'" }}>
              +{fmtFull(perPerson * contacts.length)} ₸
            </span>
          </div>
        </div>
        <div data-press onClick={onConfirm} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>Разделить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   TRANSFER REQUEST — real «Запрос денег», both sides
   Create: form → «Подтверждение» (кнопка «Запросить») → «Запрос отправлен»
   Incoming: «Запрос денег» with Отправить / Отклонить
   ═══════════════════════════════════════════════ */

function RequestCreateScreen({ C, onBack, onNext }) {
  const [selectedId, setSelectedId] = useState(1);
  const [amount, setAmount] = useState("5000");
  const num = parseFloat(amount.replace(",", ".")) || 0;
  const valid = num > 0;
  const contact = RECENT_TRANSFERS.find(c => c.id === selectedId);

  return (
    <ScreenShell C={C} title="Запрос денег" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>У кого запросить</div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 8, marginBottom: 16 }}>
          {RECENT_TRANSFERS.map(c => {
            const on = c.id === selectedId;
            return (
              <div key={c.id} data-press onClick={() => setSelectedId(c.id)} style={{
                flexShrink: 0, width: 56, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6, cursor: "pointer",
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${c.color}aa 0%, ${c.color} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, lineHeight: 1,
                  border: on ? "2.5px solid #22C55E" : "2.5px solid transparent",
                  opacity: on ? 1 : 0.55,
                  transition: "all 0.15s",
                }}>{c.photo}</div>
                <span style={{
                  fontSize: 10, fontWeight: 500, color: on ? C.sub : C.muted,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 56,
                }}>{c.name}</span>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Сумма</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1.5px solid ${C.border}`,
          padding: "16px", display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
        }}>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
            inputMode="decimal"
            placeholder="0"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 26, fontWeight: 800, color: C.text,
              fontFamily: "inherit", fontFeatureSettings: "'tnum'", minWidth: 0,
            }}
          />
          <span style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>₸</span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Зачислить на счёт</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 24,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", backgroundColor: C.faint,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0,
          }}>🇰🇿</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>DepositCard</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>••4521</div>
          </div>
        </div>

        <div data-press onClick={() => valid && onNext({ contact, amount: num })} style={{
          backgroundColor: valid ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: valid ? "pointer" : "default",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Запросить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function RequestConfirmScreen({ C, payload, onBack, onConfirm }) {
  const { contact, amount } = payload;
  const rows = [
    { label: "У кого", value: `${contact.name} ${contact.surname}` },
    { label: "Сумма", value: `${fmtFull(amount)} ₸` },
    { label: "Зачислить на", value: "DepositCard ••4521" },
    { label: "Срок действия", value: "7 дней" },
  ];
  return (
    <ScreenShell C={C} title="Подтверждение" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <div style={{ textAlign: "center", margin: "12px 0 28px" }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 8 }}>Запрос денег</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(amount)} <span style={{ fontSize: 20, color: C.muted }}>₸</span>
          </div>
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 24,
        }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 16px", gap: 12,
              borderBottom: i < rows.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text, textAlign: "right" }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div data-press onClick={onConfirm} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>Запросить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function RequestInfoScreen({ request, C, onBack, onAccept, onReject }) {
  const cm = CURRENCY_META[request.currency] || { symbol: request.currency };
  return (
    <ScreenShell C={C} title="Запрос денег" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        {/* real navigationSubtitle.issueToday */}
        <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: -10, marginBottom: 24 }}>
          Ожидается подтверждение, истекает сегодня
        </div>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            backgroundColor: C.faint,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: C.text,
            margin: "0 auto 14px",
          }}>{request.initials}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 12 }}>
            {request.from} запрашивает у вас
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(request.amount)} <span style={{ fontSize: 20, color: C.muted }}>{cm.symbol}</span>
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Счёт списания</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 24,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", backgroundColor: C.faint,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0,
          }}>🇺🇸</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Текущий счёт</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>••145USD · 12 345,67 $</div>
          </div>
        </div>

        {/* real buttons: Отправить / Отклонить */}
        <div data-press onClick={onAccept} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer", marginBottom: 10,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>Отправить</span>
        </div>
        <div data-press onClick={onReject} style={{
          backgroundColor: C.faint, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#EF4444" }}>Отклонить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   SETTINGS SCREEN — real Settings module
   (sections and texts from settingsFlow.settings.*)
   ═══════════════════════════════════════════════ */

function SettingsScreen({ C, onBack, onOpenNotifications, onOpenProfileInfo, onOpenSecurity, onOpenDevices, onOpenLanguage, onOpenCertificates, onOpenHelp, onOpenDecor, onOpenAbout, onOpenQr, onOpenAviata, onLogout }) {
  const [hideAmount, setHideAmount] = useState(false);
  const isDark = C.bg === '#0E0F0C';

  const Row = ({ Icon, color, title, subtitle, last, danger, toggle, toggleOn, onToggle, onClick }) => (
    <div data-press={!toggle ? true : undefined} onClick={!toggle ? (onClick || (() => {})) : undefined} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "13px 16px", cursor: toggle ? "default" : "pointer",
      borderBottom: last ? "none" : `1px solid ${C.divider}`,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        backgroundColor: danger ? "rgba(239,68,68,0.1)" : `${color}14`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={17} color={danger ? "#EF4444" : color} strokeWidth={1.9} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: danger ? "#EF4444" : C.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {toggle ? (
        <div onClick={onToggle} style={{
          width: 38, height: 22, borderRadius: 11,
          backgroundColor: toggleOn ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
          position: "relative", cursor: "pointer", flexShrink: 0,
          transition: "background-color 0.15s",
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff",
            position: "absolute", top: 2, left: toggleOn ? 18 : 2,
            transition: "left 0.15s",
          }} />
        </div>
      ) : (
        <ChevronRight size={15} color={C.muted} strokeWidth={1.8} />
      )}
    </div>
  );

  const Section = ({ children }) => (
    <div style={{
      backgroundColor: C.card, borderRadius: 12,
      border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16,
    }}>{children}</div>
  );

  return (
    <ScreenShell C={C} title="Настройки" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        {/* Profile header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "8px 0 24px",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            backgroundColor: C.accentDark,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: C.accent, flexShrink: 0,
          }}>НШ</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text, letterSpacing: -0.3 }}>Никита Шулаев</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 3, fontFeatureSettings: "'tnum'" }}>+7 777 ··· ·· 77</div>
          </div>
          <div data-press onClick={onOpenQr} style={{
            width: 40, height: 40, borderRadius: 12,
            border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}>
            <QrCode size={18} color={C.text} strokeWidth={1.8} />
          </div>
        </div>

        {/* Аккаунт */}
        <Section>
          <Row Icon={User} color="#22C55E" title="Профиль" subtitle="Телефон, почта, документы..." onClick={onOpenProfileInfo} />
          <Row Icon={Shield} color="#3B82F6" title="Безопасность" subtitle="Пароли, системные настройки" onClick={onOpenSecurity} />
          <Row Icon={Bell} color="#F59E0B" title="Центр уведомлений" subtitle="Push, SMS и настройки" onClick={onOpenNotifications} />
          <Row Icon={Smartphone} color="#8B5CF6" title="Устройства" onClick={onOpenDevices} last />
        </Section>

        {/* Сервисы */}
        <Section>
          <Row Icon={FileText} color="#0D9488" title="Заказ справок" subtitle="Для оформления визы и в налоговую" onClick={onOpenCertificates} />
          <Row Icon={Plane} color="#3B82F6" title="Путешествия" subtitle="Авиабилеты, горящие туры, пассажиры" onClick={onOpenAviata} last />
        </Section>

        {/* Оформление */}
        <Section>
          <Row Icon={EyeOff} color="#64748B" title="Скрывать баланс" subtitle="При перевороте телефона"
            toggle toggleOn={hideAmount} onToggle={() => setHideAmount(v => !v)} />
          <Row Icon={Palette} color="#EC4899" title="Оформление" subtitle="Приветствие, звуки и вибрация" onClick={onOpenDecor} />
          <Row Icon={Globe} color="#06B6D4" title="Язык" subtitle="Русский" onClick={onOpenLanguage} last />
        </Section>

        {/* Банк */}
        <Section>
          <Row Icon={Landmark} color="#64748B" title="О Банке" subtitle="Адреса, телефоны, отделения..." onClick={onOpenAbout} />
          <Row Icon={Phone} color="#22C55E" title="Связаться с Банком" subtitle="В чате или по телефону" onClick={onOpenHelp} last />
        </Section>

        {/* Logout */}
        <Section>
          <Row Icon={LogOut} color="#EF4444" title="Сменить пользователя" danger onClick={onLogout} last />
        </Section>

        <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 8 }}>
          Freedom Banker · прототип на реальных флоу
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   DEPOSIT OPENING — real DepositCalc → OpenDeposit flow
   (texts from productsFlow.depositCalc.*)
   ═══════════════════════════════════════════════ */

/* Mock rate matrix: term months → annual %, +0.3 п.п. при выплате в конце */
const DEPOSIT_RATES = {
  KZT: { 3: 12.5, 6: 13.8, 12: 14.5, 24: 15.2 },
  USD: { 3: 0.8, 6: 1.2, 12: 2.0, 24: 3.0 },
  EUR: { 3: 0.4, 6: 0.6, 12: 0.8, 24: 1.2 },
};
/* Доступно на счетах по валютам (для «Недостаточно средств!») */
const DEPOSIT_AVAILABLE = { KZT: 2132860.92, USD: 37345.67, EUR: 12386.01 };

function DepositCalcScreen({ C, onBack, onNext }) {
  const [currency, setCurrency] = useState("KZT");
  const [amount, setAmount] = useState("500000");
  const [term, setTerm] = useState(12);
  const [period, setPeriod] = useState("monthly"); // monthly | end

  const cm = CURRENCY_META[currency] || { symbol: currency };
  const num = parseFloat(amount.replace(/\s/g, "").replace(",", ".")) || 0;
  const available = DEPOSIT_AVAILABLE[currency];
  const insufficient = num > available;
  const valid = num > 0 && !insufficient;
  const rate = (DEPOSIT_RATES[currency][term] || 0) + (period === "end" ? 0.3 : 0);
  const income = num * (rate / 100) * (term / 12);
  const terms = Object.keys(DEPOSIT_RATES[currency]).map(Number);

  const Chip = ({ active, label, onClick }) => (
    <div data-press onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 18, cursor: "pointer",
      fontSize: 13, fontWeight: 600,
      backgroundColor: active ? C.accentDark : C.faint,
      color: active ? C.accent : C.sub,
      transition: "all 0.15s", whiteSpace: "nowrap",
    }}>{label}</div>
  );

  return (
    <ScreenShell C={C} title="Открыть депозит" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        {/* Валюта (real currencyTitle) */}
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Валюта</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["KZT", "USD", "EUR"].map(c => (
            <Chip key={c} active={currency === c} label={`${CURRENCY_META[c].flag} ${c}`} onClick={() => setCurrency(c)} />
          ))}
        </div>

        {/* Сумма депозита (real depositAmountTitle) */}
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Сумма депозита</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1.5px solid ${insufficient ? "#EF4444" : C.border}`,
          padding: "16px", display: "flex", alignItems: "center", gap: 8,
        }}>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9.,\s]/g, ""))}
            inputMode="decimal"
            placeholder="0"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 26, fontWeight: 800, color: C.text,
              fontFamily: "inherit", fontFeatureSettings: "'tnum'", minWidth: 0,
            }}
          />
          <span style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>{cm.symbol}</span>
        </div>
        {/* real insufficientBalanceTitle */}
        {insufficient ? (
          <div style={{ fontSize: 12, color: "#EF4444", marginTop: 6, marginBottom: 14 }}>
            Недостаточно средств! Доступно {fmtFull(available)} {cm.symbol}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6, marginBottom: 14 }}>
            Доступно {fmtFull(available)} {cm.symbol}
          </div>
        )}

        {/* На срок (real monthAmountTitle + variant count) */}
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>
          На срок <span style={{ fontWeight: 500 }}>· Доступно {terms.length} варианта</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {terms.map(t => (
            <Chip key={t} active={term === t} label={`${t} мес`} onClick={() => setTerm(t)} />
          ))}
        </div>

        {/* Периодичность выплаты процентов (real periodTitle, monthly/onMonthEnd) */}
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Периодичность выплаты процентов</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          overflow: "hidden", marginBottom: 20,
        }}>
          {[
            { key: "monthly", label: "Ежемесячно", sub: "Проценты на счёт каждый месяц" },
            { key: "end", label: "В конце", sub: `Ставка выше на 0.3 п.п.` },
          ].map((p, i) => (
            <div key={p.key} data-press onClick={() => setPeriod(p.key)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px", cursor: "pointer",
              borderBottom: i === 0 ? `1px solid ${C.divider}` : "none",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                border: period === p.key ? "none" : `2px solid ${C.borderStrong}`,
                backgroundColor: period === p.key ? C.accentDark : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {period === p.key && <Check size={12} color={C.accent} strokeWidth={3} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{p.label}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Расчёт */}
        <div style={{
          backgroundColor: C.accentSoft, borderRadius: 12,
          padding: "14px 16px", marginBottom: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 12, color: C.sub }}>Ставка</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'", marginTop: 2 }}>
              {rate.toFixed(1)}% <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>годовых</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: C.sub }}>Доход за {term} мес</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#16A34A", fontFeatureSettings: "'tnum'", marginTop: 2 }}>
              +{fmtFull(income)} <span style={{ fontSize: 12 }}>{cm.symbol}</span>
            </div>
          </div>
        </div>

        {/* real getDepositButtonText */}
        <div data-press onClick={() => valid && onNext({ currency, amount: num, term, period, rate, income })} style={{
          backgroundColor: valid ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: valid ? "pointer" : "default", marginBottom: 16,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Оформить депозит</span>
        </div>

        {/* real infoDepositCell.aboutDeposit */}
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
          Расчеты являются ориентировочными. Пример расчета условий по депозиту носит исключительно
          информационный характер и не является публичной офертой
        </div>
      </div>
    </ScreenShell>
  );
}

function DepositReviewScreen({ C, payload, onBack, onConfirm }) {
  const [agreed, setAgreed] = useState(false);
  const { currency, amount, term, period, rate, income } = payload;
  const cm = CURRENCY_META[currency] || { symbol: currency };
  const rows = [
    { label: "Валюта", value: currency },
    { label: "Сумма депозита", value: `${fmtFull(amount)} ${cm.symbol}` },
    { label: "На срок", value: `${term} мес` },
    { label: "Ставка", value: `${rate.toFixed(1)}% годовых` },
    { label: "Выплата процентов", value: period === "monthly" ? "Ежемесячно" : "В конце" },
    { label: "Доход к концу срока", value: `+${fmtFull(income)} ${cm.symbol}` },
    { label: "Счёт списания", value: `Счёт в ${currency}` },
  ];
  return (
    <ScreenShell C={C} title="Подтверждение" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <div style={{ textAlign: "center", margin: "12px 0 28px" }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 8 }}>Депозит «КОПИЛКА»</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(amount)} <span style={{ fontSize: 20, color: C.muted }}>{cm.symbol}</span>
          </div>
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 20,
        }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 16px", gap: 12,
              borderBottom: i < rows.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>{r.label}</span>
              <span style={{
                fontSize: 13, fontWeight: 600, textAlign: "right",
                color: r.label.startsWith("Доход") ? "#16A34A" : C.text,
              }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* real agreementText */}
        <div data-press onClick={() => setAgreed(v => !v)} style={{
          display: "flex", gap: 12, cursor: "pointer", marginBottom: 24,
          padding: "13px 16px", backgroundColor: C.card,
          borderRadius: 12, border: `1px solid ${agreed ? C.accentDark : C.border}`,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
            border: agreed ? "none" : `2px solid ${C.borderStrong}`,
            backgroundColor: agreed ? C.accentDark : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}>
            {agreed && <Check size={13} color={C.accent} strokeWidth={3} />}
          </div>
          <span style={{ fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
            Даю согласие на подписание Соглашения-заявления о предоставлении услуг по открытию депозита.
            Подтверждаю, что со справкой ФГВФЛ ознакомлен.
          </span>
        </div>

        <div data-press onClick={() => agreed && onConfirm()} style={{
          backgroundColor: agreed ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: agreed ? "pointer" : "default",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: agreed ? C.accent : C.muted }}>Открыть депозит</span>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   LOCK SCREEN — real AuthPin
   («Введите код для входа в приложение», «Выход»)
   ═══════════════════════════════════════════════ */

function LockScreen({ onUnlock }) {
  const [pin, setPin] = useState("");
  const PIN_LEN = 4;

  const press = (d) => {
    setPin(prev => {
      if (prev.length >= PIN_LEN) return prev;
      const next = prev + d;
      if (next.length === PIN_LEN) setTimeout(onUnlock, 250); // any code unlocks the prototype
      return next;
    });
  };
  const backspace = () => setPin(p => p.slice(0, -1));

  const Key = ({ children, onClick, ghost }) => (
    <div data-press onClick={onClick} style={{
      width: 72, height: 72, borderRadius: "50%",
      backgroundColor: ghost ? "transparent" : "rgba(248,250,252,0.06)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 26, fontWeight: 600, color: "#F8FAFC",
      cursor: "pointer", userSelect: "none",
      transition: "background-color 0.1s",
    }}>{children}</div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      maxWidth: 430, margin: "0 auto",
      backgroundColor: "#0F172A",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      color: "#F8FAFC",
    }}>
      <div style={{ alignSelf: "stretch" }}>
        <StatusBar C={{ text: "#F8FAFC" }} />
      </div>
      {/* Brand */}
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: "linear-gradient(135deg, #163300 0%, #1f4d00 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(159,232,112,0.15)",
        }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: "#9FE870" }}>F</span>
        </div>
        {/* real authPin.existingText */}
        <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(248,250,252,0.85)", textAlign: "center" }}>
          Введите код для входа в приложение
        </div>
      </div>

      {/* PIN dots */}
      <div style={{ display: "flex", gap: 16, marginTop: 28, marginBottom: 12 }}>
        {Array.from({ length: PIN_LEN }).map((_, i) => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: "50%",
            backgroundColor: i < pin.length ? "#9FE870" : "rgba(248,250,252,0.15)",
            transition: "background-color 0.15s",
          }} />
        ))}
      </div>

      {/* Numpad */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 72px)", gap: "18px 28px",
        marginTop: "auto", marginBottom: 24,
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <Key key={n} onClick={() => press(String(n))}>{n}</Key>
        ))}
        {/* Face ID — instant unlock */}
        <Key ghost onClick={onUnlock}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M4 10V7a3 3 0 0 1 3-3h3M20 4h3a3 3 0 0 1 3 3v3M26 20v3a3 3 0 0 1-3 3h-3M10 26H7a3 3 0 0 1-3-3v-3"
              stroke="#9FE870" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10.5" cy="13" r="1.4" fill="#9FE870"/>
            <circle cx="19.5" cy="13" r="1.4" fill="#9FE870"/>
            <path d="M11 19.5c1.1 1 2.4 1.5 4 1.5s2.9-.5 4-1.5" stroke="#9FE870" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </Key>
        <Key onClick={() => press("0")}>0</Key>
        <Key ghost onClick={backspace}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M9 6h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7 6-7z" stroke="rgba(248,250,252,0.7)" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M12.5 10.5l5 5M17.5 10.5l-5 5" stroke="rgba(248,250,252,0.7)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </Key>
      </div>

      {/* real authPin.logout */}
      <div data-press style={{
        marginBottom: 44, fontSize: 14, fontWeight: 600,
        color: "rgba(248,250,252,0.55)", cursor: "pointer",
      }}>Выход</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NOTIFICATIONS — real «Система уведомлений»
   ═══════════════════════════════════════════════ */

function NotificationsScreen({ C, emptyState, onBack }) {
  const items = emptyState ? [] : NOTIFICATIONS;
  return (
    <ScreenShell C={C} title="Система уведомлений" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        {items.length === 0 ? (
          /* real notifications.emptyList */
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "80px 40px", textAlign: "center", gap: 12,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20, backgroundColor: C.faint,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bell size={26} color={C.muted} strokeWidth={1.6} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.sub }}>У вас пока нет уведомлений</div>
          </div>
        ) : (
          <div style={{
            backgroundColor: C.card, borderRadius: 12,
            border: `1px solid ${C.border}`, overflow: "hidden",
          }}>
            {items.map((n, i) => (
              <div key={n.id} data-press style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "13px 16px", cursor: "pointer",
                borderBottom: i < items.length - 1 ? `1px solid ${C.divider}` : "none",
                backgroundColor: n.unread ? C.accentSoft : "transparent",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  backgroundColor: `${n.color}14`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <n.Icon size={16} color={n.color} strokeWidth={1.9} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{n.title}</span>
                    {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#22C55E", flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 2, lineHeight: 1.4 }}>{n.subtitle}</div>
                </div>
                <span style={{ fontSize: 11, color: C.muted, flexShrink: 0, marginTop: 2 }}>{n.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   NEWS — real News module (Kursiv list → detail with bullets)
   ═══════════════════════════════════════════════ */

function NewsListScreen({ C, onBack, onOpenDetail }) {
  return (
    <ScreenShell C={C} title="Все новости" onBack={onBack}>
      <div style={{ padding: "0 20px 110px", display: "flex", flexDirection: "column", gap: 12 }}>
        {NEWS_FEED.map(n => (
          <div key={n.id} data-press onClick={() => onOpenDetail(n)} style={{
            backgroundColor: C.card, borderRadius: 14,
            border: `1px solid ${C.border}`, overflow: "hidden", cursor: "pointer",
          }}>
            {/* Image header */}
            <div style={{ height: 110, background: n.bg, position: "relative" }}>
              <div style={{
                position: "absolute", top: 12, left: 12,
                padding: "3px 9px", borderRadius: 7,
                backgroundColor: "rgba(0,0,0,0.4)",
                fontSize: 10, fontWeight: 700, color: "#fff",
                textTransform: "uppercase", letterSpacing: 0.4,
              }}>{n.tag}</div>
            </div>
            <div style={{ padding: "12px 14px 14px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.35, marginBottom: 8 }}>
                {n.title}
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>
                {n.author} · {n.time} · {n.views.toLocaleString("ru-RU")} 👁
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

function NewsDetailScreen({ news, C, onBack }) {
  return (
    <ScreenShell C={C} title="" onBack={onBack}>
      <div style={{ padding: "0 0 110px" }}>
        {/* Hero image */}
        <div style={{ height: 180, background: news.bg, position: "relative", marginTop: -8 }}>
          <div style={{
            position: "absolute", top: 12, left: 20,
            padding: "4px 10px", borderRadius: 8,
            backgroundColor: "rgba(0,0,0,0.4)",
            fontSize: 10, fontWeight: 700, color: "#fff",
            textTransform: "uppercase", letterSpacing: 0.4,
          }}>{news.tag}</div>
        </div>
        <div style={{ padding: "18px 20px 0" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, lineHeight: 1.3, letterSpacing: -0.3, marginBottom: 10 }}>
            {news.title}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>
            {news.author} · {news.time} · {news.views.toLocaleString("ru-RU")} просмотров
          </div>

          {/* Bullets — real: native bullets above the article body */}
          {news.bullets && news.bullets.length > 0 && (
            <div style={{
              backgroundColor: C.card, borderRadius: 12,
              border: `1px solid ${C.border}`, padding: "14px 16px", marginBottom: 18,
            }}>
              {news.bullets.map((b, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10,
                  marginBottom: i < news.bullets.length - 1 ? 10 : 0,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    backgroundColor: "#22C55E", flexShrink: 0, marginTop: 6,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.text, lineHeight: 1.45 }}>{b}</span>
                </div>
              ))}
            </div>
          )}

          {/* Body */}
          {news.body.split("\n\n").map((p, i) => (
            <p key={i} style={{ fontSize: 14, color: C.sub, lineHeight: 1.65, margin: "0 0 14px" }}>{p}</p>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   PROFILE INFO — «Профиль» (Персональные данные / Документы / Контакты)
   ═══════════════════════════════════════════════ */

function ProfileInfoScreen({ C, featureFlags, onBack }) {
  const Row = ({ label, value, badge, chevron }) => (
    <div data-press={chevron ? true : undefined} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "13px 16px",
      borderBottom: `1px solid ${C.divider}`,
      cursor: chevron ? "pointer" : "default",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: C.muted }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 3 }}>{value}</div>
      </div>
      {badge && (
        <span style={{
          fontSize: 10, fontWeight: 700, color: "#16A34A",
          backgroundColor: "rgba(34,197,94,0.1)",
          padding: "3px 8px", borderRadius: 8,
        }}>{badge}</span>
      )}
      {chevron && <ChevronRight size={15} color={C.muted} strokeWidth={1.8} />}
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>{title}</div>
      <div style={{
        backgroundColor: C.card, borderRadius: 12,
        border: `1px solid ${C.border}`, overflow: "hidden",
      }}>{children}</div>
    </div>
  );

  return (
    <ScreenShell C={C} title="Профиль" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <Section title="Персональные данные">
          <Row label="ФИО" value="Шулаев Никита Сергеевич" />
          <Row label="ИИН" value="9106•••••••3" />
          <Row label="Дата рождения" value="14 июня 1991" />
        </Section>
        <Section title="Документы">
          {/* real flag changeIdentityDocument gates editing */}
          <Row label="Удостоверение личности" value="№ 04••••1234 · до 02.2030"
            chevron={featureFlags.changeIdentityDocument} />
        </Section>
        <Section title="Контакты">
          {/* real flag changephone gates phone change */}
          <Row label="Телефон" value="+7 777 ··· ·· 77" badge="подтверждён"
            chevron={featureFlags.changephone} />
          <Row label="Электронный адрес" value="n.shulaev@ff···.com" badge="подтверждён" />
        </Section>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   SECURITY — real «Безопасность» (settingsFlow.security.*)
   ═══════════════════════════════════════════════ */

function SecurityScreen({ C, featureFlags, onBack }) {
  const isDark = C.bg === '#0E0F0C';
  const [faceId, setFaceId] = useState(true);
  const [quickLogin, setQuickLogin] = useState(false);
  const [incognito, setIncognito] = useState(false);
  const [stats, setStats] = useState(true);

  const Row = ({ title, subtitle, toggle, toggleOn, onToggle, chevron, action }) => (
    <div data-press={chevron || action ? true : undefined} style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "13px 16px",
      borderBottom: `1px solid ${C.divider}`,
      cursor: chevron || action ? "pointer" : "default",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.45 }}>{subtitle}</div>}
      </div>
      {toggle && (
        <div onClick={onToggle} style={{
          width: 38, height: 22, borderRadius: 11, marginTop: 2,
          backgroundColor: toggleOn ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
          position: "relative", cursor: "pointer", flexShrink: 0,
          transition: "background-color 0.15s",
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff",
            position: "absolute", top: 2, left: toggleOn ? 18 : 2,
            transition: "left 0.15s",
          }} />
        </div>
      )}
      {chevron && <ChevronRight size={15} color={C.muted} strokeWidth={1.8} style={{ marginTop: 3 }} />}
      {action && <span style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", flexShrink: 0 }}>{action}</span>}
    </div>
  );

  return (
    <ScreenShell C={C} title="Безопасность" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16,
        }}>
          {/* real password / passwordSubtitle */}
          <Row title="Короткий код" subtitle="Для входа в приложение" chevron />
          {/* real faceIDSubtitle, gated by securitySessionBiometry */}
          {featureFlags.securitySessionBiometry && (
            <Row title="Face ID" subtitle="Входить в приложение через сканирование лица"
              toggle toggleOn={faceId} onToggle={() => setFaceId(v => !v)} />
          )}
          {/* real loginConfirmation */}
          <Row title="Подтверждение входа" subtitle="С кодом из SMS или пин-кодом" chevron />
          {/* real quickLogin + subtitle */}
          <Row title="Быстрый вход"
            subtitle="Если телефон разблокирован менее 10 секунд назад, можно войти без повторной авторизации"
            toggle toggleOn={quickLogin} onToggle={() => setQuickLogin(v => !v)} />
        </div>

        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden",
        }}>
          {/* real incognito + subtitle */}
          <Row title="Инкогнито"
            subtitle="Режим анонимности не позволит другим клиентам увидеть логотип банка рядом с вашим именем в адресной книге"
            toggle toggleOn={incognito} onToggle={() => setIncognito(v => !v)} />
          {/* real collectStatistics */}
          <Row title="Собирать статистику"
            subtitle="Анонимная статистика для улучшения приложения. Данные карт и счетов не передаются третьим лицам"
            toggle toggleOn={stats} onToggle={() => setStats(v => !v)} />
          {/* real clearCache */}
          <Row title="Кэш приложения" subtitle="Временные данные для работы с банкоматами и отделениями" action="Очистить" />
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   DEVICES — real «Устройства» («Это устройство», «В сети»)
   ═══════════════════════════════════════════════ */

function DevicesScreen({ C, onBack }) {
  const [devices, setDevices] = useState(DEVICES);
  return (
    <ScreenShell C={C} title="Устройства" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden",
        }}>
          {devices.map((d, i) => (
            <div key={d.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px",
              borderBottom: i < devices.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                backgroundColor: C.faint,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Smartphone size={16} color={C.text} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{d.name}</span>
                  {d.current && (
                    /* real devices.currentDevice */
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: "#16A34A",
                      backgroundColor: "rgba(34,197,94,0.1)",
                      padding: "2px 7px", borderRadius: 7,
                    }}>Это устройство</span>
                  )}
                  {d.online && !d.current && (
                    /* real devices.onlineDevice */
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: "#3B82F6",
                      backgroundColor: "rgba(59,130,246,0.1)",
                      padding: "2px 7px", borderRadius: 7,
                    }}>В сети</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{d.note}</div>
              </div>
              {!d.current && (
                /* real devices.delete */
                <span data-press onClick={() => setDevices(prev => prev.filter(x => x.id !== d.id))} style={{
                  fontSize: 12, fontWeight: 700, color: "#EF4444",
                  cursor: "pointer", flexShrink: 0,
                }}>Выйти</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 12, lineHeight: 1.5, padding: "0 4px" }}>
          Выход с устройства завершит на нём сессию — для входа потребуется повторная авторизация
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   LANGUAGE — «Язык» (реальные локали из репы)
   ═══════════════════════════════════════════════ */

function LanguageScreen({ C, onBack }) {
  const [lang, setLang] = useState("ru");
  return (
    <ScreenShell C={C} title="Язык" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden",
        }}>
          {LANGUAGES.map((l, i) => (
            <div key={l.code} data-press onClick={() => setLang(l.code)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 16px", cursor: "pointer",
              borderBottom: i < LANGUAGES.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>{l.label}</span>
              {lang === l.code && <Check size={16} color={C.accentDark} strokeWidth={2.6} />}
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   PHONE TRANSFER — real «По номеру телефона»
   («Введите номер телефона получателя»)
   ═══════════════════════════════════════════════ */

function PhoneTransferScreen({ C, onBack, onNext }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [amount, setAmount] = useState("");
  const selected = RECENT_TRANSFERS.find(c => c.id === selectedId);
  const num = parseFloat(amount.replace(",", ".")) || 0;
  const valid = selected && num > 0;

  return (
    <ScreenShell C={C} title="По номеру телефона" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        {/* real phoneInput.hint */}
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`,
          padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
        }}>
          <Phone size={16} color={C.muted} strokeWidth={1.8} />
          <input
            value={selected ? selected.phone : query}
            onChange={e => { setQuery(e.target.value); setSelectedId(null); }}
            placeholder="Введите номер телефона получателя"
            inputMode="tel"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 14, fontWeight: 600, color: C.text,
              fontFamily: "inherit", fontFeatureSettings: "'tnum'", minWidth: 0,
            }}
          />
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Недавние</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 20,
        }}>
          {RECENT_TRANSFERS.map((c, i) => (
            <div key={c.id} data-press onClick={() => setSelectedId(c.id)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", cursor: "pointer",
              borderBottom: i < RECENT_TRANSFERS.length - 1 ? `1px solid ${C.divider}` : "none",
              backgroundColor: selectedId === c.id ? C.accentSoft : "transparent",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: `linear-gradient(135deg, ${c.color}aa 0%, ${c.color} 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, flexShrink: 0,
              }}>{c.photo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{c.name} {c.surname}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>{c.phone}</div>
              </div>
              {selectedId === c.id && <Check size={16} color={C.accentDark} strokeWidth={2.6} />}
            </div>
          ))}
        </div>

        {selected && (
          <>
            {/* Found client */}
            <div style={{
              backgroundColor: C.accentSoft, borderRadius: 12,
              padding: "11px 16px", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <Check size={14} color="#16A34A" strokeWidth={2.6} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                {selected.name} {selected.surname} · клиент Freedom Bank
              </span>
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Сумма</div>
            <div style={{
              backgroundColor: C.card, borderRadius: 12,
              border: `1.5px solid ${C.border}`,
              padding: "16px", display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
            }}>
              <input
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                inputMode="decimal"
                placeholder="0"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: 26, fontWeight: 800, color: C.text,
                  fontFamily: "inherit", fontFeatureSettings: "'tnum'", minWidth: 0,
                }}
              />
              <span style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>₸</span>
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Без комиссии внутри банка</div>

            <div data-press onClick={() => valid && onNext({ contact: selected, amount: num })} style={{
              backgroundColor: valid ? C.accentDark : C.faint,
              borderRadius: 12, padding: "15px 0", textAlign: "center",
              cursor: valid ? "pointer" : "default",
            }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Перевести</span>
            </div>
          </>
        )}
      </div>
    </ScreenShell>
  );
}

function PhoneConfirmScreen({ C, payload, onBack, onConfirm }) {
  const { contact, amount } = payload;
  const rows = [
    { label: "Получатель", value: `${contact.name} ${contact.surname}` },
    { label: "Телефон", value: contact.phone },
    { label: "Банк получателя", value: "Freedom Bank" },
    { label: "Списать с", value: "DepositCard ••4521" },
    { label: "Комиссия", value: "Без комиссии" },
  ];
  return (
    <ScreenShell C={C} title="Подтверждение" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <div style={{ textAlign: "center", margin: "12px 0 28px" }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 8 }}>Перевод по номеру телефона</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(amount)} <span style={{ fontSize: 20, color: C.muted }}>₸</span>
          </div>
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 24,
        }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 16px", gap: 12,
              borderBottom: i < rows.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text, textAlign: "right" }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div data-press onClick={onConfirm} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>Подтвердить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   CONVERSION — real «Конвертация валют»
   («Продажа %S» / «Покупка %S», по курсу банка)
   ═══════════════════════════════════════════════ */

function ConversionScreen({ C, onBack, onNext }) {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("KZT");
  const [amount, setAmount] = useState("100");
  const num = parseFloat(amount.replace(",", ".")) || 0;
  const rate = RATES_TO_KZT[from] / RATES_TO_KZT[to];
  const result = num * rate;
  const valid = num > 0 && from !== to;
  const currencies = ["KZT", "USD", "EUR", "RUB"];

  const CurrencyChips = ({ value, onChange, exclude }) => (
    <div style={{ display: "flex", gap: 8 }}>
      {currencies.map(c => (
        <div key={c} data-press onClick={() => c !== exclude && onChange(c)} style={{
          padding: "8px 14px", borderRadius: 18, cursor: c === exclude ? "default" : "pointer",
          fontSize: 13, fontWeight: 600,
          backgroundColor: value === c ? C.accentDark : C.faint,
          color: value === c ? C.accent : (c === exclude ? C.muted : C.sub),
          opacity: c === exclude ? 0.4 : 1,
          transition: "all 0.15s",
        }}>{CURRENCY_META[c].flag} {c}</div>
      ))}
    </div>
  );

  return (
    <ScreenShell C={C} title="Конвертация валют" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        {/* real sellCurrency */}
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Продажа {from}</div>
        <CurrencyChips value={from} onChange={setFrom} exclude={to} />
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1.5px solid ${C.border}`,
          padding: "16px", display: "flex", alignItems: "center", gap: 8,
          marginTop: 10, marginBottom: 16,
        }}>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
            inputMode="decimal"
            placeholder="0"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 26, fontWeight: 800, color: C.text,
              fontFamily: "inherit", fontFeatureSettings: "'tnum'", minWidth: 0,
            }}
          />
          <span style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>{CURRENCY_META[from].symbol}</span>
        </div>

        {/* real buyCurrency */}
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Покупка {to}</div>
        <CurrencyChips value={to} onChange={setTo} exclude={from} />
        <div style={{
          backgroundColor: C.faint, borderRadius: 12,
          padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 10, marginBottom: 16,
        }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'" }}>
            {valid ? fmtFull(result) : "0"}
          </span>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>{CURRENCY_META[to].symbol}</span>
        </div>

        {/* real ratesSubtitle «Конвертация по курсу» */}
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: "11px 16px", marginBottom: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 13, color: C.muted }}>Конвертация по курсу</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
            1 {from} = {rate >= 1 ? rate.toFixed(2) : rate.toFixed(4)} {to}
          </span>
        </div>

        <div data-press onClick={() => valid && onNext({ from, to, amountFrom: num, amountTo: result, rate })} style={{
          backgroundColor: valid ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: valid ? "pointer" : "default", marginBottom: 14,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Обменять</span>
        </div>

        {/* real sumToInfoText */}
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
          Сумма может измениться из-за разницы в курсах валют на момент фактического перечисления денег
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   CARD LIMITS — real «Лимиты расходов» (cpsFlow.setCardLimit)
   ═══════════════════════════════════════════════ */

function CardLimitsScreen({ C, card, onBack }) {
  const isDark = C.bg === '#0E0F0C';
  const [internetOn, setInternetOn] = useState(true);
  const [abroadOn, setAbroadOn] = useState(false);

  const limits = [
    { label: "Снятие наличных", used: 120000, total: 500000 },
    { label: "Покупки и платежи", used: 840000, total: 2000000 },
  ];

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{
      width: 38, height: 22, borderRadius: 11,
      backgroundColor: on ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
      position: "relative", cursor: "pointer", flexShrink: 0,
      transition: "background-color 0.15s",
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff",
        position: "absolute", top: 2, left: on ? 18 : 2,
        transition: "left 0.15s",
      }} />
    </div>
  );

  return (
    <ScreenShell C={C} title="Лимиты расходов" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        {/* real setCardLimit.subtitle */}
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 16 }}>
          Лимит – это сумма, которую можно оплатить или снять в банкомате в течение месяца
          с карты {card?.name || "DepositCard"} ••{card?.last4 || "4521"}
        </div>

        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16,
        }}>
          {limits.map((l, i) => {
            const pct = Math.round((l.used / l.total) * 100);
            return (
              <div key={i} style={{
                padding: "14px 16px",
                borderBottom: i < limits.length - 1 ? `1px solid ${C.divider}` : "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{l.label}</span>
                  <span data-press style={{ fontSize: 12, fontWeight: 600, color: C.text, opacity: 0.7, cursor: "pointer" }}>Изменить</span>
                </div>
                <div style={{
                  height: 5, borderRadius: 3, backgroundColor: C.divider,
                  overflow: "hidden", marginBottom: 7,
                }}>
                  <div style={{
                    width: `${pct}%`, height: "100%",
                    backgroundColor: pct > 80 ? "#EF4444" : C.accentDark,
                    borderRadius: 3,
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: C.muted, fontFeatureSettings: "'tnum'" }}>
                    Потрачено {fmtCompact(l.used)} ₸
                  </span>
                  <span style={{ fontSize: 12, color: C.muted, fontFeatureSettings: "'tnum'" }}>
                    из {fmtCompact(l.total)} ₸
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "13px 16px", borderBottom: `1px solid ${C.divider}`,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Интернет-платежи</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Оплата в онлайн-магазинах</div>
            </div>
            <Toggle on={internetOn} onToggle={() => setInternetOn(v => !v)} />
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "13px 16px",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Операции за рубежом</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Платежи и снятие вне Казахстана</div>
            </div>
            <Toggle on={abroadOn} onToggle={() => setAbroadOn(v => !v)} />
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   REQUISITES — real «Реквизиты» (productsFlow.productRequisites.*)
   ═══════════════════════════════════════════════ */

function RequisitesScreen({ C, card, onBack }) {
  const [copied, setCopied] = useState(false);
  const rows = [
    { label: "Получатель", value: "Шулаев Никита Сергеевич" },
    { label: "Номер счёта", value: "KZ81 ALM3 X562 0014 5USD" },
    { label: "Банк получателя", value: "АО «Банк Фридом Финанс Казахстан»" },
    { label: "БИК", value: "KSNVKZKA" },
    { label: "SWIFT код", value: "KSNVKZKA" },
    { label: "КБе", value: "19" },
  ];
  return (
    <ScreenShell C={C} title="Реквизиты" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        {/* real tableTitle */}
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>
          Информация о счёте
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 20,
        }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              padding: "12px 16px",
              borderBottom: i < rows.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <div style={{ fontSize: 12, color: C.muted }}>{r.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 3, fontFeatureSettings: "'tnum'" }}>{r.value}</div>
            </div>
          ))}
        </div>

        {/* real copy/copied + send */}
        <div style={{ display: "flex", gap: 10 }}>
          <div data-press onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{
            flex: 1, backgroundColor: C.accentDark, borderRadius: 12, padding: "14px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>
              {copied ? "Скопировано" : "Скопировать"}
            </span>
          </div>
          <div data-press style={{
            flex: 1, backgroundColor: C.faint, borderRadius: 12, padding: "14px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Отправить</span>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   PIN CHANGE — real SetCardPin (authPin: «Придумайте новый код»)
   ═══════════════════════════════════════════════ */

function PinChangeScreen({ C, onBack, onDone }) {
  const [step, setStep] = useState(0); // 0 = new, 1 = confirm
  const [first, setFirst] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const PIN_LEN = 4;

  const press = (d) => {
    setError(false);
    setPin(prev => {
      if (prev.length >= PIN_LEN) return prev;
      const next = prev + d;
      if (next.length === PIN_LEN) {
        setTimeout(() => {
          if (step === 0) {
            setFirst(next); setPin(""); setStep(1);
          } else if (next === first) {
            onDone();
          } else {
            setError(true); setPin("");
          }
        }, 200);
      }
      return next;
    });
  };

  const Key = ({ children, onClick, ghost }) => (
    <div data-press onClick={onClick} style={{
      width: 68, height: 68, borderRadius: "50%",
      backgroundColor: ghost ? "transparent" : C.faint,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 24, fontWeight: 600, color: C.text,
      cursor: "pointer", userSelect: "none",
    }}>{children}</div>
  );

  return (
    <ScreenShell C={C} title="Сменить ПИН-код" onBack={onBack}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "24px 20px 110px",
      }}>
        {/* real authPin.newPin / checkNewText */}
        <div style={{ fontSize: 15, fontWeight: 600, color: C.sub, marginBottom: 6 }}>
          {step === 0 ? "Придумайте новый код" : "Подтвердите новый код"}
        </div>
        {error && (
          <div style={{ fontSize: 12, color: "#EF4444", marginBottom: 4 }}>Коды не совпадают, попробуйте снова</div>
        )}
        <div style={{ display: "flex", gap: 14, margin: "18px 0 36px" }}>
          {Array.from({ length: PIN_LEN }).map((_, i) => (
            <div key={i} style={{
              width: 13, height: 13, borderRadius: "50%",
              backgroundColor: i < pin.length ? C.accentDark : C.divider,
              transition: "background-color 0.15s",
            }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 68px)", gap: "16px 26px" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <Key key={n} onClick={() => press(String(n))}>{n}</Key>
          ))}
          <div />
          <Key onClick={() => press("0")}>0</Key>
          <Key ghost onClick={() => setPin(p => p.slice(0, -1))}>
            <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
              <path d="M9 6h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7 6-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" style={{ color: C.muted }}/>
              <path d="M12.5 10.5l5 5M17.5 10.5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ color: C.muted }}/>
            </svg>
          </Key>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   CERTIFICATES — real «Заказ справок»
   («Справка о наличии счёта», «Сформировать справку», «Язык справки»)
   ═══════════════════════════════════════════════ */

function CertificatesScreen({ C, featureFlags, onBack, onDone }) {
  const [type, setType] = useState(0);
  const [lang, setLang] = useState("ru");
  const types = [
    ...(featureFlags.certificateOfAccounts ? [{ title: "Справка о наличии счёта", sub: "Для оформления визы и в налоговую" }] : []),
    { title: "Справка о доступном остатке", sub: "Актуальный остаток на счетах" },
    { title: "Выписка по счёту", sub: "Операции за выбранный период" },
  ];
  return (
    <ScreenShell C={C} title="Заказ справок" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 20,
        }}>
          {types.map((t, i) => (
            <div key={i} data-press onClick={() => setType(i)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px", cursor: "pointer",
              borderBottom: i < types.length - 1 ? `1px solid ${C.divider}` : "none",
              backgroundColor: type === i ? C.accentSoft : "transparent",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                border: type === i ? "none" : `2px solid ${C.borderStrong}`,
                backgroundColor: type === i ? C.accentDark : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {type === i && <Check size={12} color={C.accent} strokeWidth={3} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t.title}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* real certificateLanguage + subtitle */}
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 4 }}>Язык справки</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Выберите язык документа</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { code: "ru", label: "Русский" },
            { code: "kk", label: "Қазақша" },
            { code: "en", label: "English" },
          ].map(l => (
            <div key={l.code} data-press onClick={() => setLang(l.code)} style={{
              padding: "8px 14px", borderRadius: 18, cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              backgroundColor: lang === l.code ? C.accentDark : C.faint,
              color: lang === l.code ? C.accent : C.sub,
              transition: "all 0.15s",
            }}>{l.label}</div>
          ))}
        </div>

        {/* real generateCertificateButton */}
        <div data-press onClick={onDone} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer", marginBottom: 14,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>Сформировать справку</span>
        </div>
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
          Готовая справка с печатью банка придёт на ваш email и появится в разделе «Документы»
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   HELP — real «Связаться с Банком» (helpFlow.helpMain.*)
   ═══════════════════════════════════════════════ */

function HelpScreen({ C, onBack }) {
  return (
    <ScreenShell C={C} title="Связаться с Банком" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        {/* Big phone */}
        <div style={{
          backgroundColor: C.accentDark, borderRadius: 14,
          padding: "20px", textAlign: "center", marginBottom: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(159,232,112,0.7)", marginBottom: 6 }}>
            Бесплатно с мобильного в Казахстане
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.accent, letterSpacing: 1, fontFeatureSettings: "'tnum'" }}>
            7711
          </div>
        </div>

        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden",
        }}>
          {/* real chatWithBank + subtitle */}
          {[
            { Icon: MessageCircle, color: "#22C55E", title: "Чат с Банком", sub: "Задать вопрос в чате" },
            { Icon: Phone, color: "#3B82F6", title: "Звонок в банк", sub: "По телефону или через интернет" },
            { Icon: FileText, color: "#8B5CF6", title: "Выписки и справки", sub: "Заказ документов" },
          ].map((r, i, arr) => (
            <div key={i} data-press style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px", cursor: "pointer",
              borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                backgroundColor: `${r.color}14`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <r.Icon size={16} color={r.color} strokeWidth={1.9} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{r.title}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{r.sub}</div>
              </div>
              <ChevronRight size={15} color={C.muted} strokeWidth={1.8} />
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   QR SCANNER — «Оплата по QR или штрихкоду» (mock camera)
   ═══════════════════════════════════════════════ */

function QrScannerScreen({ onBack }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 80,
      maxWidth: 430, margin: "0 auto",
      backgroundColor: "#0A0E14",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      animation: "screen-slide-in 0.25s ease-out",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ alignSelf: "stretch" }}>
        <StatusBar C={{ text: "#F8FAFC" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px 16px" }}>
        <div data-press onClick={onBack} style={{
          width: 36, height: 36, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <ArrowLeft size={20} color="#F8FAFC" strokeWidth={2} />
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>
          Оплата по QR
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Camera viewport mock */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 50% 40%, rgba(34,197,94,0.06) 0%, transparent 55%)",
        }} />
        {/* Scan frame */}
        <div style={{ width: 240, height: 240, position: "relative" }}>
          {[
            { top: 0, left: 0, borderTop: "3px solid #9FE870", borderLeft: "3px solid #9FE870", borderRadius: "14px 0 0 0" },
            { top: 0, right: 0, borderTop: "3px solid #9FE870", borderRight: "3px solid #9FE870", borderRadius: "0 14px 0 0" },
            { bottom: 0, left: 0, borderBottom: "3px solid #9FE870", borderLeft: "3px solid #9FE870", borderRadius: "0 0 0 14px" },
            { bottom: 0, right: 0, borderBottom: "3px solid #9FE870", borderRight: "3px solid #9FE870", borderRadius: "0 0 14px 0" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: 46, height: 46, ...s }} />
          ))}
          <div style={{
            position: "absolute", left: 10, right: 10, top: "48%", height: 2,
            background: "linear-gradient(90deg, transparent, #9FE870, transparent)",
            opacity: 0.8,
          }} />
        </div>
        <div style={{
          position: "absolute", bottom: 36, left: 0, right: 0,
          textAlign: "center", fontSize: 14, fontWeight: 500,
          color: "rgba(248,250,252,0.8)",
        }}>
          Наведите камеру на QR-код или штрихкод
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 48,
        padding: "20px 0 44px",
      }}>
        {[
          { label: "Фонарик", icon: <Zap size={20} color="#F8FAFC" strokeWidth={1.8} /> },
          { label: "Из галереи", icon: <LayoutGrid size={20} color="#F8FAFC" strokeWidth={1.8} /> },
        ].map((b, i) => (
          <div key={i} data-press style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              backgroundColor: "rgba(248,250,252,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{b.icon}</div>
            <span style={{ fontSize: 11, color: "rgba(248,250,252,0.65)" }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BOTTOM SHEET MODAL — generic slide-up sheet
   ═══════════════════════════════════════════════ */

function BottomSheetModal({ C, onClose, children }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 150,
      }} />
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, zIndex: 151,
        backgroundColor: C.card, borderRadius: "20px 20px 0 0",
        padding: "12px 20px 40px", maxHeight: "75vh", overflowY: "auto",
        animation: "sheet-slide-up 0.25s ease-out",
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, margin: "0 auto 16px" }} />
        {children}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   GENERIC CONFIRM — reusable rows + amount + button
   ═══════════════════════════════════════════════ */

function GenericConfirmScreen({ C, title, subtitle, amountStr, rows, confirmLabel, onBack, onConfirm }) {
  return (
    <ScreenShell C={C} title={title || "Подтверждение"} onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <div style={{ textAlign: "center", margin: "12px 0 28px" }}>
          {subtitle && <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 8 }}>{subtitle}</div>}
          {amountStr && (
            <div style={{ fontSize: 36, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
              {amountStr}
            </div>
          )}
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 24,
        }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 16px", gap: 12,
              borderBottom: i < rows.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text, textAlign: "right" }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div data-press onClick={onConfirm} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>{confirmLabel || "Подтвердить"}</span>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   PRODUCT DETAIL SCREENS — account / deposit / credit / loan / broker
   ═══════════════════════════════════════════════ */

function AccountDetailsScreen({ account, C, onBack, onOpenRequisites, onTransfer, onOpenTransaction }) {
  const cm = CURRENCY_META[account.currency] || { symbol: account.currency, flag: "💰" };
  return (
    <ScreenShell C={C} title={account.name} onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>{cm.flag}</div>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 6 }}>Доступно</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(account.balance)} <span style={{ fontSize: 18, color: C.muted }}>{cm.symbol}</span>
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6, fontFeatureSettings: "'tnum'" }}>{account.number}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 22, marginBottom: 28 }}>
          {[
            { Icon: Plus, label: "Пополнить" },
            { Icon: Send, label: "Перевести", onClick: onTransfer },
            { Icon: FileText, label: "Реквизиты", onClick: onOpenRequisites },
          ].map((a, i) => (
            <div key={i} data-press onClick={a.onClick} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
              cursor: "pointer", width: 64,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                backgroundColor: C.accentDark,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <a.Icon size={19} color={C.accent} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: C.sub }}>{a.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Транзакции</span>
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden",
        }}>
          {TRANSACTIONS.slice(0, 3).map((t, i) => (
            <div key={t.id} data-press onClick={() => onOpenTransaction?.(t)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px", cursor: "pointer",
              borderBottom: i < 2 ? `1px solid ${C.divider}` : "none",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                backgroundColor: `${t.color}14`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <t.Icon size={16} color={t.color} strokeWidth={1.9} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.time}</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, fontFeatureSettings: "'tnum'", color: t.amount > 0 ? "#16A34A" : C.text }}>
                {t.amount > 0 ? "+" : ""}{fmtFull(t.amount)} ₸
              </span>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

function DepositDetailsScreen({ deposit, C, onBack }) {
  const cm = CURRENCY_META[deposit.currency] || { symbol: deposit.currency };
  const progress = 42; // прошло срока, %
  return (
    <ScreenShell C={C} title={deposit.name} onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 6 }}>На депозите</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(deposit.balance)} <span style={{ fontSize: 18, color: C.muted }}>{cm.symbol}</span>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            marginTop: 10, padding: "5px 12px", borderRadius: 14,
            backgroundColor: "rgba(34,197,94,0.1)",
          }}>
            <TrendingUp size={12} color="#16A34A" strokeWidth={2.4} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }}>{deposit.rate}% годовых</span>
          </div>
        </div>

        {/* Срок */}
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: "14px 16px", marginBottom: 16,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: C.muted }}>Срок депозита</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>до {deposit.closingDate}</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, backgroundColor: C.divider, overflow: "hidden", marginBottom: 7 }}>
            <div style={{ width: `${progress}%`, height: "100%", backgroundColor: C.accentDark, borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>Прошло {progress}% срока</div>
        </div>

        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 20,
        }}>
          {[
            { label: "Начислено процентов", value: `+${fmtFull(deposit.balance * deposit.rate / 100 * 0.42)} ${cm.symbol}`, green: true },
            { label: "Выплата процентов", value: "Ежемесячно" },
            { label: "Лимит пополнения", value: "Без ограничений" },
            { label: "Досрочное снятие", value: "С потерей процентов" },
          ].map((r, i, arr) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 16px", gap: 12,
              borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.muted }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: r.green ? "#16A34A" : C.text }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div data-press style={{
            flex: 1, backgroundColor: C.accentDark, borderRadius: 12, padding: "14px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>Пополнить</span>
          </div>
          <div data-press style={{
            flex: 1, backgroundColor: C.faint, borderRadius: 12, padding: "14px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Снять</span>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function CreditDetailsScreen({ credit, C, featureFlags, onBack }) {
  const cm = CURRENCY_META[credit.currency] || { symbol: credit.currency };
  const totalDebt = credit.monthly * 14; // остаток долга mock
  return (
    <ScreenShell C={C} title={credit.name} onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 6 }}>Остаток долга</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(totalDebt)} <span style={{ fontSize: 18, color: C.muted }}>{cm.symbol}</span>
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Ставка {credit.rate}% · погашение до {credit.payoffDate}</div>
        </div>

        {/* Выплачено */}
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: "14px 16px", marginBottom: 16,
        }}>
          <div style={{ height: 5, borderRadius: 3, backgroundColor: C.divider, overflow: "hidden", marginBottom: 7 }}>
            <div style={{ width: `${credit.paidPercent}%`, height: "100%", backgroundColor: C.accentDark, borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: C.muted }}>Выплачено</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{credit.paidPercent}%</span>
          </div>
        </div>

        {/* График платежей */}
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>График платежей</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 20,
        }}>
          {CREDIT_SCHEDULE.map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px",
              borderBottom: i < CREDIT_SCHEDULE.length - 1 ? `1px solid ${C.divider}` : "none",
              backgroundColor: p.status === "next" ? C.accentSoft : "transparent",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFeatureSettings: "'tnum'" }}>{p.date}</div>
                {p.status === "next" && <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 600, marginTop: 2 }}>Следующий платёж</div>}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
                {fmtFull(p.amount)} <span style={{ fontSize: 11, color: C.muted }}>{cm.symbol}</span>
              </span>
            </div>
          ))}
        </div>

        {/* real flags: earlyLoanRepayment + loanRepaymentVariants */}
        {featureFlags.earlyLoanRepayment && (
          <div data-press style={{
            backgroundColor: C.accentDark, borderRadius: 12, padding: "14px 0",
            textAlign: "center", cursor: "pointer", marginBottom: 10,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>Погасить досрочно</span>
          </div>
        )}
        {featureFlags.loanRepaymentVariants && (
          <div data-press style={{
            backgroundColor: C.faint, borderRadius: 12, padding: "14px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Варианты погашения</span>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}

function LoanDetailsScreen({ loan, C, onBack }) {
  const cm = CURRENCY_META[loan.currency] || { symbol: loan.currency };
  return (
    <ScreenShell C={C} title="P2P займ" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 6 }}>{loan.name}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(loan.balance)} <span style={{ fontSize: 18, color: C.muted }}>{cm.symbol}</span>
          </div>
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 20,
        }}>
          {[
            { label: "Выдано", value: `${fmtFull(loan.baseAmount)} ${cm.symbol}` },
            { label: "Ставка", value: `${loan.rate}%` },
            { label: "Дата возврата", value: loan.returnDate },
            { label: "Статус", value: "Ожидается возврат" },
          ].map((r, i, arr) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 16px", gap: 12,
              borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.muted }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div data-press style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "14px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>Напомнить о возврате</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function BrokerDetailsScreen({ account, C, onBack }) {
  return (
    <ScreenShell C={C} title={account.id} onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, marginBottom: 6 }}>{account.type} · Freedom Broker</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.text, letterSpacing: -1, fontFeatureSettings: "'tnum'" }}>
            {fmtFull(account.balance)} <span style={{ fontSize: 18, color: C.muted }}>{account.currency}</span>
          </div>
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 20,
        }}>
          {[
            { label: "Номер счёта", value: account.id },
            { label: "Тип", value: account.type },
            { label: "Брокер", value: "Freedom Finance Global PLC" },
          ].map((r, i, arr) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 16px", gap: 12,
              borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.muted }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFeatureSettings: "'tnum'" }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div data-press style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "14px 0",
          textAlign: "center", cursor: "pointer", marginBottom: 10,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>Открыть в Tradernet</span>
        </div>
        <div data-press style={{
          backgroundColor: C.faint, borderRadius: 12, padding: "14px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Пополнить с банковского счёта</span>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   STORY VIEWER — fullscreen (real InAppStory pattern)
   ═══════════════════════════════════════════════ */

function StoryViewerScreen({ storyId, onClose }) {
  const [index, setIndex] = useState(STORIES.findIndex(s => s.id === storyId));
  const story = STORIES[index];
  const slide = STORY_SLIDES[story.id];
  const next = () => index < STORIES.length - 1 ? setIndex(index + 1) : onClose();
  const prev = () => index > 0 && setIndex(index - 1);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 250,
      maxWidth: 430, margin: "0 auto",
      background: story.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      animation: "screen-slide-in 0.2s ease-out",
    }}>
      {/* Progress segments */}
      <div style={{ display: "flex", gap: 4, padding: "14px 12px 10px" }}>
        {STORIES.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            backgroundColor: i <= index ? "#fff" : "rgba(255,255,255,0.3)",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Freedom Bank</span>
        <div data-press onClick={onClose} style={{
          width: 32, height: 32, borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <X size={16} color="#fff" strokeWidth={2.2} />
        </div>
      </div>

      {/* Tap zones + content */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 24px 60px" }}>
        <div onClick={prev} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "35%", cursor: "pointer" }} />
        <div onClick={next} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "65%", cursor: "pointer" }} />
        <div style={{ fontSize: 56, marginBottom: 18 }}>{story.emoji}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 12, textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}>
          {slide.title}
        </div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.5, marginBottom: 24, textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
          {slide.text}
        </div>
        <div data-press style={{
          backgroundColor: "#fff", borderRadius: 12, padding: "14px 0",
          textAlign: "center", cursor: "pointer", position: "relative", zIndex: 2,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0E0F0C" }}>{slide.cta}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ALL TRANSACTIONS + ALL CONTACTS
   ═══════════════════════════════════════════════ */

function AllTransactionsScreen({ C, onBack, onOpenTransaction }) {
  const groups = [
    { title: "Сегодня", items: TRANSACTIONS.slice(0, 2) },
    { title: "Вчера", items: TRANSACTIONS.slice(2, 4) },
    { title: "10 июня", items: TRANSACTIONS.slice(4) },
  ];
  return (
    <ScreenShell C={C} title="Все транзакции" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>{g.title}</div>
            <div style={{
              backgroundColor: C.card, borderRadius: 12,
              border: `1px solid ${C.border}`, overflow: "hidden",
            }}>
              {g.items.map((t, i) => (
                <div key={t.id} data-press onClick={() => onOpenTransaction?.(t)} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "13px 16px", cursor: "pointer",
                  borderBottom: i < g.items.length - 1 ? `1px solid ${C.divider}` : "none",
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    backgroundColor: `${t.color}14`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <t.Icon size={16} color={t.color} strokeWidth={1.9} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.category}</div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFeatureSettings: "'tnum'", color: t.amount > 0 ? "#16A34A" : C.text }}>
                    {t.amount > 0 ? "+" : ""}{fmtFull(t.amount)} ₸
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

function AllContactsScreen({ C, onBack, onPick }) {
  return (
    <ScreenShell C={C} title="Все контакты" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden",
        }}>
          {RECENT_TRANSFERS.map((c, i) => (
            <div key={c.id} data-press onClick={() => onPick(c)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", cursor: "pointer",
              borderBottom: i < RECENT_TRANSFERS.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: `linear-gradient(135deg, ${c.color}aa 0%, ${c.color} 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 19, flexShrink: 0,
              }}>{c.photo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{c.name} {c.surname}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>{c.phone}</div>
              </div>
              <ChevronRight size={15} color={C.muted} strokeWidth={1.8} />
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   TRANSFER FORMS — SWIFT / по номеру карты / IBAN / мобильная связь
   ═══════════════════════════════════════════════ */

function FormField({ C, label, value, onChange, placeholder, mono, right }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{label}</div>
      <div style={{
        backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
        padding: "13px 16px", display: "flex", alignItems: "center", gap: 8,
      }}>
        <input
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontSize: 14, fontWeight: 600, color: C.text,
            fontFamily: "inherit", minWidth: 0,
            ...(mono ? { fontFeatureSettings: "'tnum'", letterSpacing: 0.5 } : {}),
          }}
        />
        {right}
      </div>
    </div>
  );
}

function SwiftTransferScreen({ C, featureFlags, onBack, onNext }) {
  const [name, setName] = useState("");
  const [swift, setSwift] = useState("");
  const [iban, setIban] = useState("");
  const [knp, setKnp] = useState("119");
  const [amount, setAmount] = useState("");
  const num = parseFloat(amount.replace(",", ".")) || 0;
  const valid = name && swift.length >= 8 && iban.length >= 10 && num > 0;
  return (
    <ScreenShell C={C} title="Переводом SWIFT" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <FormField C={C} label="Получатель" value={name} onChange={setName} placeholder="Имя и фамилия как в банке получателя" />
        <FormField C={C} label="SWIFT код банка" value={swift} onChange={v => setSwift(v.toUpperCase())} placeholder="DEUTDEFF" mono />
        <FormField C={C} label="IBAN / номер счёта" value={iban} onChange={v => setIban(v.toUpperCase())} placeholder="DE89 3704 0044 0532 0130 00" mono />
        {/* real flags payIbanKnp / payIbanKbe */}
        {featureFlags.payIbanKnp && (
          <FormField C={C} label="КНП — код назначения платежа" value={knp} onChange={setKnp} placeholder="119" mono />
        )}
        <FormField C={C} label="Сумма" value={amount} onChange={v => setAmount(v.replace(/[^0-9.,]/g, ""))} placeholder="0"
          right={<span style={{ fontSize: 16, fontWeight: 700, color: C.muted }}>$</span>} mono />

        {/* real crystal flag — валютный контракт */}
        {featureFlags.crystal && num >= 10000 && (
          <div style={{
            backgroundColor: "rgba(245,158,11,0.08)", borderRadius: 12,
            padding: "12px 16px", marginBottom: 16,
            fontSize: 12, color: "#B45309", lineHeight: 1.5,
          }}>
            Для переводов от 10 000 $ потребуется валютный контракт — подпишем его по СМС на следующем шаге
          </div>
        )}

        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Комиссия 0.35% · мин 25 $ · 1-3 рабочих дня</div>
        <div data-press onClick={() => valid && onNext({ name, swift, iban, knp, amount: num })} style={{
          backgroundColor: valid ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: valid ? "pointer" : "default",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Продолжить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function CardNumberTransferScreen({ C, onBack, onNext }) {
  const [cardNum, setCardNum] = useState("");
  const [amount, setAmount] = useState("");
  const formatted = cardNum.replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);
  const num = parseFloat(amount.replace(",", ".")) || 0;
  const valid = cardNum.replace(/\s/g, "").length === 16 && num > 0;
  return (
    <ScreenShell C={C} title="По номеру карты" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <FormField C={C} label="Номер карты получателя" value={formatted}
          onChange={v => setCardNum(v.replace(/\D/g, "").slice(0, 16))}
          placeholder="0000 0000 0000 0000" mono
          right={<CreditCard size={16} color={C.muted} strokeWidth={1.8} />} />
        {cardNum.replace(/\s/g, "").length === 16 && (
          <div style={{
            backgroundColor: C.accentSoft, borderRadius: 12, padding: "11px 16px", marginBottom: 12,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Check size={14} color="#16A34A" strokeWidth={2.6} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Visa · Kaspi Bank</span>
          </div>
        )}
        <FormField C={C} label="Сумма" value={amount} onChange={v => setAmount(v.replace(/[^0-9.,]/g, ""))} placeholder="0"
          right={<span style={{ fontSize: 16, fontWeight: 700, color: C.muted }}>₸</span>} mono />
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Комиссия 0.95% · мин 200 ₸</div>
        <div data-press onClick={() => valid && onNext({ cardNum: formatted, amount: num })} style={{
          backgroundColor: valid ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: valid ? "pointer" : "default",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Перевести</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function IbanTransferScreen({ C, featureFlags, onBack, onNext }) {
  const [iin, setIin] = useState("");
  const [iban, setIban] = useState("");
  const [kbe, setKbe] = useState("19");
  const [amount, setAmount] = useState("");
  const num = parseFloat(amount.replace(",", ".")) || 0;
  // real iinLength / payIbanLength validation flags
  const valid = iin.length === 12 && iban.length >= 20 && num > 0;
  return (
    <ScreenShell C={C} title="По номеру счета" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <FormField C={C} label="ИИН получателя" value={iin}
          onChange={v => setIin(v.replace(/\D/g, "").slice(0, 12))}
          placeholder="12 цифр" mono />
        {iin.length > 0 && iin.length !== 12 && (
          <div style={{ fontSize: 12, color: "#EF4444", marginTop: -6, marginBottom: 12 }}>ИИН должен иметь длину 12 цифр</div>
        )}
        <FormField C={C} label="IBAN" value={iban}
          onChange={v => setIban(v.toUpperCase().replace(/\s/g, "").slice(0, 20))}
          placeholder="KZ00 0000 0000 0000 0000" mono />
        {/* real payIbanKbe flag */}
        {featureFlags.payIbanKbe && (
          <FormField C={C} label="КБе — код бенефициара" value={kbe} onChange={setKbe} placeholder="19" mono />
        )}
        <FormField C={C} label="Сумма" value={amount} onChange={v => setAmount(v.replace(/[^0-9.,]/g, ""))} placeholder="0"
          right={<span style={{ fontSize: 16, fontWeight: 700, color: C.muted }}>₸</span>} mono />
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>До 1 рабочего дня · комиссия 0 ₸ внутри банка</div>
        <div data-press onClick={() => valid && onNext({ iin, iban, kbe, amount: num })} style={{
          backgroundColor: valid ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: valid ? "pointer" : "default",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Продолжить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function MobilePayScreen({ C, onBack, onNext }) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("1000");
  const digits = phone.replace(/\D/g, "");
  const prefix = digits.startsWith("7") ? digits.slice(1, 4) : digits.slice(0, 3);
  const operator = MOBILE_OPERATORS.find(o => o.prefixes.includes(prefix));
  const num = parseFloat(amount.replace(",", ".")) || 0;
  const valid = digits.length >= 10 && operator && num > 0;
  return (
    <ScreenShell C={C} title="Мобильная связь" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <FormField C={C} label="Номер телефона" value={phone}
          onChange={setPhone} placeholder="+7 ___ ___ __ __" mono
          right={<Phone size={15} color={C.muted} strokeWidth={1.8} />} />
        {operator && (
          <div style={{
            backgroundColor: C.accentSoft, borderRadius: 12, padding: "11px 16px", marginBottom: 12,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7, backgroundColor: operator.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "#fff",
            }}>{operator.name[0]}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Оператор: {operator.name}</span>
          </div>
        )}
        <FormField C={C} label="Сумма" value={amount} onChange={v => setAmount(v.replace(/[^0-9.,]/g, ""))} placeholder="0"
          right={<span style={{ fontSize: 16, fontWeight: 700, color: C.muted }}>₸</span>} mono />
        {/* Quick amounts */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[500, 1000, 2000, 5000].map(a => (
            <div key={a} data-press onClick={() => setAmount(String(a))} style={{
              padding: "7px 13px", borderRadius: 16, cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              backgroundColor: amount === String(a) ? C.accentDark : C.faint,
              color: amount === String(a) ? C.accent : C.sub,
            }}>{a} ₸</div>
          ))}
        </div>
        <div data-press onClick={() => valid && onNext({ phone, operator: operator?.name, amount: num })} style={{
          backgroundColor: valid ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: valid ? "pointer" : "default",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Оплатить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   CATEGORY PROVIDERS + PROVIDER PAY + TEMPLATE PAY
   ═══════════════════════════════════════════════ */

function CategoryProvidersScreen({ C, category, onBack, onPick }) {
  const providers = CATEGORY_PROVIDERS[category.id] || [];
  return (
    <ScreenShell C={C} title={category.title} onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        {providers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", fontSize: 13, color: C.muted }}>
            Услуги данной категории недоступны
          </div>
        ) : (
          <div style={{
            backgroundColor: C.card, borderRadius: 12,
            border: `1px solid ${C.border}`, overflow: "hidden",
          }}>
            {providers.map((p, i) => (
              <div key={i} data-press onClick={() => onPick(p)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "13px 16px", cursor: "pointer",
                borderBottom: i < providers.length - 1 ? `1px solid ${C.divider}` : "none",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  backgroundColor: `${category.color}14`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <category.Icon size={16} color={category.color} strokeWidth={1.9} />
                </div>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>{p}</span>
                <ChevronRight size={15} color={C.muted} strokeWidth={1.8} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ScreenShell>
  );
}

function ProviderPayScreen({ C, provider, onBack, onNext }) {
  const [accountNum, setAccountNum] = useState("");
  const [amount, setAmount] = useState("");
  const num = parseFloat(amount.replace(",", ".")) || 0;
  const valid = accountNum.length >= 5 && num > 0;
  return (
    <ScreenShell C={C} title={provider} onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        <FormField C={C} label="Лицевой счёт" value={accountNum}
          onChange={v => setAccountNum(v.replace(/\D/g, ""))} placeholder="Номер лицевого счёта" mono />
        {accountNum.length >= 5 && (
          <div style={{
            backgroundColor: C.accentSoft, borderRadius: 12, padding: "11px 16px", marginBottom: 12,
            fontSize: 13, fontWeight: 600, color: C.text,
          }}>
            Шулаев Н.С. · задолженность 8 432 ₸
          </div>
        )}
        <FormField C={C} label="Сумма" value={amount} onChange={v => setAmount(v.replace(/[^0-9.,]/g, ""))} placeholder="0"
          right={<span style={{ fontSize: 16, fontWeight: 700, color: C.muted }}>₸</span>} mono />
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Без комиссии</div>
        <div data-press onClick={() => valid && onNext({ provider, accountNum, amount: num })} style={{
          backgroundColor: valid ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: valid ? "pointer" : "default",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Оплатить</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function TemplatePayScreen({ C, template, onBack, onConfirm }) {
  const amounts = { 1: 250000, 2: 18500, 3: 50000, 4: 6900 };
  const amount = amounts[template.id] || 10000;
  return (
    <GenericConfirmScreen
      C={C}
      title="Оплата по шаблону"
      subtitle={template.title}
      amountStr={`${fmtFull(amount)} ₸`}
      rows={[
        { label: "Шаблон", value: template.title },
        { label: "Списать с", value: "DepositCard ••4521" },
        { label: "Комиссия", value: "Без комиссии" },
      ]}
      confirmLabel="Оплатить"
      onBack={onBack}
      onConfirm={() => onConfirm({ template, amount })}
    />
  );
}

/* ═══════════════════════════════════════════════
   CHATS TAB — real chat flag (чат с банком)
   ═══════════════════════════════════════════════ */

function ChatsScreen({ C, featureFlags, onOpenThread }) {
  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100dvh",
      backgroundColor: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      overflowX: "clip", paddingBottom: 90,
    }}>
      <StatusBar C={C} />
      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: -0.5, marginBottom: 14 }}>Чаты</div>
        {!featureFlags.chat ? (
          <div style={{ textAlign: "center", padding: "80px 30px", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            Чат отключён фичефлагом `chat` — в реальном приложении здесь была бы вкладка контактов
          </div>
        ) : (
          <div style={{
            backgroundColor: C.card, borderRadius: 12,
            border: `1px solid ${C.border}`, overflow: "hidden",
          }}>
            <div data-press onClick={onOpenThread} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px", cursor: "pointer",
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: "50%",
                backgroundColor: C.accentDark,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>F</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Поддержка Freedom</span>
                  <span style={{ fontSize: 11, color: C.muted }}>09:31</span>
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  По карте Ru Card ••1222 месячный лимит на снятие — 500 000 ₸...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatThreadScreen({ C, onBack }) {
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: prev.length + 1, from: "me", text: input.trim(), time: "сейчас" }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1, from: "bank",
        text: "Передал ваш вопрос специалисту — ответим в этом чате в течение 5 минут.",
        time: "сейчас",
      }]);
    }, 900);
  };
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 80,
      maxWidth: 430, margin: "0 auto",
      backgroundColor: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      animation: "screen-slide-in 0.25s ease-out",
    }}>
      <StatusBar C={C} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px 12px", borderBottom: `1px solid ${C.divider}` }}>
        <div data-press onClick={onBack} style={{
          width: 36, height: 36, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <ArrowLeft size={20} color={C.text} strokeWidth={2} />
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", backgroundColor: C.accentDark,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: C.accent }}>F</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Поддержка Freedom</div>
          <div style={{ fontSize: 11, color: "#16A34A" }}>онлайн</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map(m => (
          <div key={m.id} style={{
            alignSelf: m.from === "me" ? "flex-end" : "flex-start",
            maxWidth: "78%",
            backgroundColor: m.from === "me" ? C.accentDark : C.card,
            border: m.from === "me" ? "none" : `1px solid ${C.border}`,
            borderRadius: m.from === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            padding: "10px 14px",
          }}>
            <div style={{ fontSize: 14, color: m.from === "me" ? C.accent : C.text, lineHeight: 1.45 }}>{m.text}</div>
            <div style={{
              fontSize: 10, marginTop: 4, textAlign: "right",
              color: m.from === "me" ? "rgba(159,232,112,0.6)" : C.muted,
            }}>{m.time}</div>
          </div>
        ))}
      </div>

      <div style={{
        display: "flex", gap: 8, padding: "10px 16px 28px",
        borderTop: `1px solid ${C.divider}`, backgroundColor: C.bg,
      }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Сообщение..."
          style={{
            flex: 1, border: `1px solid ${C.border}`, outline: "none",
            backgroundColor: C.card, borderRadius: 20, padding: "10px 16px",
            fontSize: 14, color: C.text, fontFamily: "inherit",
          }}
        />
        <div data-press onClick={send} style={{
          width: 42, height: 42, borderRadius: "50%",
          backgroundColor: C.accentDark,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <Send size={17} color={C.accent} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DECOR / ABOUT BANK / PROFILE QR / ESIM / AVIATA
   ═══════════════════════════════════════════════ */

function DecorScreen({ C, onBack }) {
  const isDark = C.bg === '#0E0F0C';
  const [greeting, setGreeting] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [vibro, setVibro] = useState(true);
  const Row = ({ title, subtitle, on, onToggle }) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "13px 16px", borderBottom: `1px solid ${C.divider}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div onClick={onToggle} style={{
        width: 38, height: 22, borderRadius: 11,
        backgroundColor: on ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "background-color 0.15s",
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff",
          position: "absolute", top: 2, left: on ? 18 : 2, transition: "left 0.15s",
        }} />
      </div>
    </div>
  );
  return (
    <ScreenShell C={C} title="Оформление" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden",
        }}>
          {/* real greeting / soundsAndVibration */}
          <Row title="Приветствие" subtitle="«Доброе утро, Никита» на главном экране" on={greeting} onToggle={() => setGreeting(v => !v)} />
          <Row title="Звуки" subtitle="Звук при операциях" on={sounds} onToggle={() => setSounds(v => !v)} />
          <Row title="Вибрация" subtitle="Отклик при нажатиях" on={vibro} onToggle={() => setVibro(v => !v)} />
        </div>
      </div>
    </ScreenShell>
  );
}

function AboutBankScreen({ C, onBack }) {
  return (
    <ScreenShell C={C} title="О Банке" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{ textAlign: "center", margin: "8px 0 24px" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: "0 auto 12px",
            background: "linear-gradient(135deg, #163300 0%, #1f4d00 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: "#9FE870" }}>F</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Freedom Bank Kazakhstan</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Версия 6.0.0 · прототип на реальных флоу</div>
        </div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16,
        }}>
          {[
            { label: "Головной офис", value: "Алматы, пр. аль-Фараби 77/7" },
            { label: "Колл-центр", value: "7711 (бесплатно)" },
            { label: "Лицензия", value: "№ 1.2.245/61 от 03.02.2020" },
            { label: "SWIFT", value: "KSNVKZKA" },
          ].map((r, i, arr) => (
            <div key={i} style={{
              padding: "12px 16px",
              borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none",
            }}>
              <div style={{ fontSize: 12, color: C.muted }}>{r.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 3 }}>{r.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div data-press style={{
            flex: 1, backgroundColor: C.faint, borderRadius: 12, padding: "13px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Сайт банка</span>
          </div>
          <div data-press style={{
            flex: 1, backgroundColor: C.faint, borderRadius: 12, padding: "13px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Отделения</span>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

function ProfileQrScreen({ C, onBack }) {
  return (
    <ScreenShell C={C} title="Мой QR" onBack={onBack}>
      <div style={{ padding: "12px 20px 110px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 24 }}>
          Покажите QR-код — вам смогут перевести деньги без ввода номера
        </div>
        <div style={{
          width: 240, height: 240, margin: "0 auto 20px",
          backgroundColor: "#fff", borderRadius: 20,
          border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}>
          {/* QR mock */}
          <svg width="190" height="190" viewBox="0 0 21 21">
            {[ [0,0],[1,0],[2,0],[4,0],[6,0],[14,0],[16,0],[18,0],[19,0],[20,0],
               [0,1],[6,1],[9,1],[11,1],[14,1],[20,1],
               [0,2],[2,2],[3,2],[4,2],[6,2],[8,2],[10,2],[12,2],[14,2],[16,2],[17,2],[18,2],[20,2],
               [0,3],[6,3],[8,3],[13,3],[14,3],[20,3],[0,4],[2,4],[3,4],[4,4],[6,4],[9,4],[10,4],[16,4],[17,4],[18,4],[20,4],
               [0,5],[6,5],[12,5],[14,5],[20,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[8,6],[10,6],[12,6],[14,6],[15,6],[16,6],[17,6],[18,6],[19,6],[20,6],
               [9,7],[11,7],[13,7],[0,8],[2,8],[5,8],[7,8],[9,8],[14,8],[17,8],[19,8],
               [1,9],[4,9],[8,9],[12,9],[15,9],[18,9],[20,9],[0,10],[3,10],[6,10],[10,10],[13,10],[16,10],[19,10],
               [2,11],[5,11],[9,11],[11,11],[14,11],[17,11],[20,11],[0,12],[1,12],[4,12],[7,12],[10,12],[12,12],[15,12],[18,12],
               [8,13],[13,13],[16,13],[20,13],[0,14],[1,14],[2,14],[3,14],[4,14],[5,14],[6,14],[9,14],[12,14],[14,14],[18,14],
               [0,15],[6,15],[8,15],[11,15],[16,15],[19,15],[0,16],[2,16],[3,16],[4,16],[6,16],[10,16],[13,16],[14,16],[15,16],[17,16],[20,16],
               [0,17],[6,17],[9,17],[12,17],[14,17],[18,17],[0,18],[2,18],[3,18],[4,18],[6,18],[8,18],[11,18],[15,18],[16,18],[19,18],
               [0,19],[6,19],[10,19],[13,19],[17,19],[20,19],[0,20],[1,20],[2,20],[3,20],[4,20],[5,20],[6,20],[9,20],[11,20],[14,20],[16,20],[18,20],[20,20],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="1" height="1" fill="#0E0F0C" />
            ))}
          </svg>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Никита Шулаев</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4, fontFeatureSettings: "'tnum'" }}>+7 777 ··· ·· 77 · Freedom Bank</div>
      </div>
    </ScreenShell>
  );
}

function EsimScreen({ C, onBack, onBuy }) {
  const [selected, setSelected] = useState(2);
  const pkg = ESIM_PACKAGES.find(p => p.id === selected);
  return (
    <ScreenShell C={C} title="eSIM для поездок" onBack={onBack}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 16 }}>
          Интернет в 110+ странах без замены SIM-карты. QR для активации придёт сразу после оплаты
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {ESIM_PACKAGES.map(p => (
            <div key={p.id} data-press onClick={() => setSelected(p.id)} style={{
              backgroundColor: C.card, borderRadius: 12, padding: "14px 16px",
              border: `1.5px solid ${selected === p.id ? C.accentDark : C.border}`,
              cursor: "pointer", position: "relative",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              {p.popular && (
                <div style={{
                  position: "absolute", top: -8, right: 12,
                  padding: "2px 8px", borderRadius: 7,
                  backgroundColor: C.accentDark,
                  fontSize: 9, fontWeight: 700, color: C.accent, letterSpacing: 0.3,
                }}>ПОПУЛЯРНЫЙ</div>
              )}
              <span style={{ fontSize: 26 }}>{p.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{p.region}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{p.data} · {p.days} дней</div>
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'" }}>
                {fmtCompact(p.price)} ₸
              </span>
            </div>
          ))}
        </div>
        <div data-press onClick={() => onBuy(pkg)} style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>Купить за {fmtCompact(pkg.price)} ₸</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function AviataScreen({ C, onBack, onBuy }) {
  const [step, setStep] = useState(0); // 0 = search, 1 = results
  const [selected, setSelected] = useState(null);

  if (step === 0) {
    return (
      <ScreenShell C={C} title="Авиабилеты" onBack={onBack}>
        <div style={{ padding: "4px 20px 110px" }}>
          <div style={{
            backgroundColor: C.card, borderRadius: 14, border: `1px solid ${C.border}`,
            overflow: "hidden", marginBottom: 16,
          }}>
            {[
              { label: "Откуда", value: "Алматы (ALA)" },
              { label: "Куда", value: "Париж (CDG)" },
              { label: "Туда", value: "24 июня 2026" },
              { label: "Пассажиры", value: "1 взрослый · эконом" },
            ].map((r, i, arr) => (
              <div key={i} data-press style={{
                padding: "13px 16px", cursor: "pointer",
                borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none",
              }}>
                <div style={{ fontSize: 11, color: C.muted }}>{r.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginTop: 3 }}>{r.value}</div>
              </div>
            ))}
          </div>
          <div data-press onClick={() => setStep(1)} style={{
            backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>Найти рейсы</span>
          </div>
        </div>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell C={C} title="ALA → CDG · 24 июня" onBack={() => setStep(0)}>
      <div style={{ padding: "0 20px 110px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {AVIATA_FLIGHTS.map(f => (
            <div key={f.id} data-press onClick={() => setSelected(f.id)} style={{
              backgroundColor: C.card, borderRadius: 14, padding: "14px 16px",
              border: `1.5px solid ${selected === f.id ? C.accentDark : C.border}`,
              cursor: "pointer",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{f.carrier}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'" }}>
                  {fmtCompact(f.price)} ₸
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'" }}>{f.dep}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{f.from}</div>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{f.duration}</div>
                  <div style={{ position: "relative", height: 2, backgroundColor: C.divider, borderRadius: 1 }}>
                    <Plane size={12} color={C.muted} style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)" }} />
                  </div>
                  <div style={{ fontSize: 10, color: f.direct ? "#16A34A" : C.muted, marginTop: 3 }}>
                    {f.direct ? "прямой" : "1 пересадка"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'" }}>{f.arr}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{f.to}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selected && (
          <div data-press onClick={() => onBuy(AVIATA_FLIGHTS.find(f => f.id === selected))} style={{
            backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>
              Купить за {fmtCompact(AVIATA_FLIGHTS.find(f => f.id === selected).price)} ₸
            </span>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   ПИКЕР ПОПОЛНЕНИЯ — флоу из протокола встречи 25.06.2026
   Bottom sheet с вариантами перевода → только пикер списания →
   счёт зачисления подставляется автоматически. Поручки ТН без пикеров.
   ═══════════════════════════════════════════════ */

// Внешние способы пополнения (свои карты выбираются прямо в шторке, не отдельным пунктом).
// «По номеру телефона» удалён — свою карту нельзя пополнить по номеру телефона.
const TOPUP_VARIANTS = [
  { id: "otherCard",    title: "С карты другого банка", sub: "Visa или Mastercard",               Icon: CreditCard, color: "#3B82F6", kind: "otherCard" },
  { id: "bankTransfer", title: "Банковским переводом",  sub: "По реквизитам · до 3 рабочих дней", Icon: Landmark,   color: "#0D9488", kind: "requisites" },
  // Поручки ТН — пикеры не показываются, сразу на поручку со счётом-источником
  { id: "broker",       title: "С брокерского счёта",   sub: "Поручение в Tradernet",             Icon: TrendingUp, color: "#F59E0B", kind: "tn" },
  { id: "crypto",       title: "С криптокошелька",      sub: "Digital assets · Tradernet",        Icon: Zap,        color: "#8B5CF6", kind: "tn" },
];

// Токенизированные карты других банков из прошлых переводов (экран «карта другого банка»).
const TOKENIZED_CARDS = [
  { id: "kaspi", bank: "Kaspi Bank", last4: "8421", network: "VISA", color: "#E4002B" },
  { id: "halyk", bank: "Halyk Bank", last4: "5510", network: "MC",   color: "#00A94F" },
];

// Шторка «Пополнить» (прод-состав, улучшенный): весь выбор источника происходит здесь.
// Свои карты раскрываются в валютные счета, чужие — в токенизированные; дальше один экран суммы.
function TopUpSheetContent({ C, card, displayCurrency, onPickOwn, onPickExternal, onPickVariant }) {
  const dc = displayCurrency || "KZT";
  const dcMeta = CURRENCY_META[dc] || { symbol: dc };
  const toApp = (amount, currency) => convertTo(convertToKZT(amount, currency), dc);
  const plural = (n) => `${n} ${n >= 2 && n <= 4 ? "счёта" : "счетов"}`;

  // Свои карты по банкам; карта-получатель уходит в «Скрытые счета» с причиной.
  // Карты НЕ разворачиваются в счета — счёт (валюта) выбирается дальше, на экране пополнения.
  const groups = CARD_PRODUCTS.map(g => ({
    bank: g.bank,
    nodes: g.cards.filter(c => c.id !== card.id).map(c => {
      const accounts = cardSubAccounts(c).map(s => ({ ...s, kzt: convertToKZT(s.amount, s.currency) }));
      return { key: c.id, cardRef: c, title: c.name, last4: c.last4, color: c.color, accounts,
        totalKZT: accounts.reduce((t, a) => t + a.kzt, 0) };
    }).sort((a, b) => b.totalKZT - a.totalKZT),
  })).filter(g => g.nodes.length > 0);

  // Бейдж «по объёму» — на карте с самым крупным счётом (дефолт списания следующего шага).
  const allNodes = groups.flatMap(g => g.nodes);
  const maxAcc = (n) => Math.max(...n.accounts.map(a => a.kzt), 0);
  const topNode = allNodes.length ? allNodes.reduce((mx, n) => (maxAcc(n) > maxAcc(mx) ? n : mx), allNodes[0]) : null;
  const [otherOpen, setOtherOpen] = useState(false);
  const [hiddenOpen, setHiddenOpen] = useState(false);

  const label = (text) => <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, margin: "16px 0 6px" }}>{text}</div>;

  return (
    <>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>Пополнить {card.name}</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Откуда перевести деньги</div>

      {/* Apple Pay — мгновенное пополнение извне */}
      <div data-press onClick={() => onPickVariant({ id: "applePay", kind: "applePay", title: "Apple Pay" })} style={{
        display: "flex", alignItems: "center", gap: 12, padding: "12px 0", cursor: "pointer",
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#111827", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Wallet size={18} color="#fff" strokeWidth={1.9} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Apple Pay</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Мгновенно · картой из Wallet</div>
        </div>
        <ChevronRight size={15} color={C.muted} strokeWidth={1.8} />
      </div>

      {/* Свои карты: тап по карте → сразу экран пополнения (счёт-валюта выбирается там) */}
      {groups.map(g => (
        <div key={g.bank}>
          {label(`Мои карты · ${g.bank}`)}
          <div style={{ backgroundColor: C.bg, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            {g.nodes.map((node, ni) => {
              const availCnt = node.accounts.filter(a => a.amount > 0).length;
              return (
                <div key={node.key} data-press onClick={() => onPickOwn(node.cardRef)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer",
                  borderBottom: ni < g.nodes.length - 1 ? `1px solid ${C.divider}` : "none",
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: node.color || C.faint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CreditCard size={17} color="#fff" strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.title}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'", display: "flex", alignItems: "center", gap: 6 }}>
                      <span>•• {node.last4} · {availCnt < node.accounts.length ? `доступно ${availCnt} из ${node.accounts.length}` : plural(node.accounts.length)}</span>
                      {topNode && node.key === topNode.key && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.accentDark, backgroundColor: C.accentSoft, borderRadius: 20, padding: "1px 7px", flexShrink: 0 }}>по объёму</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'", flexShrink: 0 }}>
                    {fmtFull(convertTo(node.totalKZT, dc))} <span style={{ fontSize: 11, color: C.muted }}>{dcMeta.symbol}</span>
                  </div>
                  <ChevronRight size={15} color={C.muted} strokeWidth={1.8} style={{ marginLeft: 4, flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Внешние способы (прод-состав: чужая карта, реквизиты, брокер, крипта) */}
      {label("Другие способы")}
      {TOPUP_VARIANTS.map((v, i) => (
        <div key={v.id}>
          <div data-press onClick={() => v.kind === "otherCard" ? setOtherOpen(o => !o) : onPickVariant(v)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
            borderBottom: i < TOPUP_VARIANTS.length - 1 || (v.kind === "otherCard" && otherOpen) ? `1px solid ${C.divider}` : "none",
            cursor: "pointer",
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: `${v.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <v.Icon size={18} color={v.color} strokeWidth={1.9} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{v.title}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{v.sub}</div>
            </div>
            {v.kind === "otherCard"
              ? <ChevronDown size={15} color={C.muted} strokeWidth={1.8} style={{ transform: otherOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
              : <ChevronRight size={15} color={C.muted} strokeWidth={1.8} />}
          </div>
          {v.kind === "otherCard" && otherOpen && (
            <div style={{ borderLeft: `3px solid ${v.color}`, backgroundColor: C.faint, borderRadius: "0 8px 8px 0", marginBottom: 4 }}>
              {TOKENIZED_CARDS.map(t => (
                <div key={t.id} data-press onClick={() => onPickExternal(t)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px 10px 12px", cursor: "pointer",
                  borderBottom: `1px solid ${C.divider}`,
                }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: t.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, flexShrink: 0 }}>{t.network}</div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>{t.bank}</div>
                  <div style={{ fontSize: 12, color: C.muted, fontFeatureSettings: "'tnum'" }}>•• {t.last4}</div>
                  <ChevronRight size={14} color={C.muted} strokeWidth={1.8} />
                </div>
              ))}
              <div data-press onClick={() => onPickExternal(null)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px 10px 12px", cursor: "pointer" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Plus size={15} color={C.text} strokeWidth={1.9} />
                </div>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>Ввести номер карты</span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Скрытые счета — не подходят под условия перевода (прозрачность вместо молчаливого фильтра) */}
      <div data-press onClick={() => setHiddenOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 12, padding: "14px 0 4px", cursor: "pointer",
      }}>
        <EyeOff size={16} color={C.muted} strokeWidth={1.8} />
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.muted }}>Скрытые счета</span>
        <ChevronDown size={15} color={C.muted} style={{ transform: hiddenOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </div>
      {hiddenOpen && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", opacity: 0.5 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: card.color || C.faint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CreditCard size={17} color="#fff" strokeWidth={2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{card.name}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Карта зачисления — нельзя списать с неё же</div>
          </div>
        </div>
      )}
    </>
  );
}

// Универсальный экран пополнения/перевода между своими: обе стороны (карта списания
// и карта зачисления) менябельны. Способ выбора счёта (=валюты) задаётся режимом
// из дебаг-блока «Пикер счетов»: currencyFirst (валюта-первая) | chips (чипсы) | auto (автомат).
function TopUpAmountScreen({ C, card, source, displayCurrency, pickerMode, autoExpandMode, stressLong, onBack, onChangeSource, onConfirm }) {
  const kind = source.kind; // own | external | applePay
  const tok = source.tok || null;
  const S = (v) => (stressLong ? v * 1000 : v); // стресс-тест длинных сумм — только отображение

  const [amount, setAmount] = useState("");
  const [autoOpen, setAutoOpen] = useState(false);     // «Изменить» в автомате → полный пикер
  const [targetOpen, setTargetOpen] = useState(false); // смена карты зачисления
  const [targetId, setTargetId] = useState(card.id);
  const [debitSel, setDebitSel] = useState(null);      // id счёта списания; null = авто
  const [creditSel, setCreditSel] = useState(null);    // валюта зачисления; null = авто
  const [fromOpen, setFromOpen] = useState(false);     // n26/revolut: дропдаун «Откуда»
  const [toOpen, setToOpen] = useState(false);         // n26/revolut: дропдаун «Куда» (карты)
  const [curOpen, setCurOpen] = useState(false);       // revolut: дропдаун валюты цели
  const [errOpen, setErrOpen] = useState(false);       // revolut: шит «недостаточно средств» + Retry

  const allCards = CARD_PRODUCTS.flatMap(g => g.cards);
  const target = allCards.find(c => c.id === targetId) || card;
  const targetAccounts = cardSubAccounts(target);

  // Все возможные источники списания: ненулевые счета всех карт, кроме карты зачисления; по объёму.
  const ownSources = allCards
    .filter(c => c.id !== target.id)
    .flatMap(c => cardSubAccounts(c).map(s => ({
      id: `${c.id}-${s.currency}`, cardId: c.id, cardName: c.name, cardColor: c.color,
      last4: c.last4, currency: s.currency, amount: s.amount, kzt: convertToKZT(s.amount, s.currency),
    })))
    .filter(s => s.amount > 0)
    .sort((a, b) => b.kzt - a.kzt);

  // Режим: внешние источники (чужая карта, Apple Pay) списание не выбирают — только зачисление.
  // N26- и Revolut-раскладки применимы и к внешним (From-блок показывает внешний источник).
  const mode = kind === "own" ? pickerMode : (["n26", "revolut"].includes(pickerMode) ? pickerMode : "chips");
  const layout = mode === "auto" ? (autoOpen ? autoExpandMode : "auto") : mode;

  // Авто-дефолт списания: top-счёт карты, выбранной в шторке, иначе top по объёму вообще.
  const srcCardTop = source.srcCard ? ownSources.find(s => s.cardId === source.srcCard.id) : null;
  const autoDebit = srcCardTop || ownSources[0] || null;

  // Расчёт пары списание/зачисление по раскладке.
  let debit = null, credit = null;
  if (kind !== "own") {
    credit = creditSel
      ? (targetAccounts.find(s => s.currency === creditSel) || resolveCreditAccount(target, creditSel))
      : resolveCreditAccount(target, kind === "external" ? "KZT" : target.primaryCurrency);
  } else if (layout === "currencyFirst") {
    // Валюта-первая: валюта зачисления → источники этой валюты (+ секция «с конверсией»).
    const autoCur = (resolveCreditAccount(target, (autoDebit || {}).currency || "KZT") || {}).currency;
    const cur = creditSel || autoCur || (targetAccounts[0] || {}).currency;
    credit = targetAccounts.find(s => s.currency === cur) || resolveCreditAccount(target, cur);
    const chosen = debitSel ? ownSources.find(s => s.id === debitSel) : null;
    debit = chosen || ownSources.find(s => s.currency === cur) || autoDebit;
  } else if (layout === "n26" || layout === "revolut") {
    // N26/Revolut: «Откуда» = любой свой счёт (дропдаун), «Куда» = карта + валюта (дропдаун).
    const chosen = debitSel ? ownSources.find(s => s.id === debitSel) : null;
    debit = chosen || autoDebit;
    credit = creditSel
      ? (targetAccounts.find(s => s.currency === creditSel) || resolveCreditAccount(target, creditSel))
      : resolveCreditAccount(target, (debit || {}).currency || "KZT");
  } else {
    // Чипсы: карта списания фиксирована (из шторки), её счёт — чипсом.
    const chosen = debitSel ? ownSources.find(s => s.id === debitSel) : null;
    const chipCardId = (chosen || srcCardTop || autoDebit || {}).cardId;
    const chipsOfCard = ownSources.filter(s => s.cardId === chipCardId);
    debit = chosen || chipsOfCard[0] || autoDebit;
    credit = creditSel
      ? (targetAccounts.find(s => s.currency === creditSel) || resolveCreditAccount(target, creditSel))
      : resolveCreditAccount(target, (debit || {}).currency || "KZT");
  }

  // Производные для рендера.
  const chipCard = kind === "own" && debit ? allCards.find(c => c.id === debit.cardId) : null;
  const chipSources = chipCard ? ownSources.filter(s => s.cardId === chipCard.id) : [];
  const monoSources = credit ? ownSources.filter(s => s.currency === credit.currency) : [];
  const crossSources = credit ? ownSources.filter(s => s.currency !== credit.currency) : [];

  const debitCur = kind === "own" ? (debit ? debit.currency : (credit || {}).currency) : kind === "external" ? "KZT" : (credit || {}).currency;
  const mono = !!credit && credit.currency === debitCur;
  const cross = !mono;
  const num = parseFloat(amount.replace(",", ".")) || 0;
  const debitEquiv = cross && credit ? convertTo(convertToKZT(num, credit.currency), debitCur) : num;
  const balance = kind === "own" && debit ? debit.amount : null;
  const valid = num > 0 && !!credit && (balance == null || debitEquiv <= balance);
  const creditCm = CURRENCY_META[(credit || {}).currency] || { symbol: (credit || {}).currency || "" };
  const debitCm = CURRENCY_META[debitCur] || { symbol: debitCur || "" };
  const rate = (RATES_TO_KZT[debitCur] || 1) / (RATES_TO_KZT[(credit || {}).currency] || 1);

  const extTitle = kind === "external" ? (tok ? tok.bank : "Карта другого банка") : "Apple Pay";
  const extSub = kind === "external" ? (tok ? `${tok.network} •• ${tok.last4}` : "Visa или Mastercard") : "Картой из Wallet";
  const confirm = () => valid && onConfirm({
    debit: kind === "own"
      ? { name: `${debit.cardName} · ${debit.currency}`, currency: debitCur, sub: `•• ${debit.last4}` }
      : { name: extTitle, currency: debitCur, sub: extSub },
    credit: { ...credit, mono }, amount: num, card: target,
    // Данные для экрана проверки (N26-паттерн: Review с курсом, комиссией и лимитом)
    rateStr: cross ? `1 ${debitCm.symbol} = ${rate >= 1 ? rate.toFixed(2) : rate.toFixed(4)} ${creditCm.symbol}` : null,
    debitEquivStr: cross ? `≈ ${fmtFull(debitEquiv)} ${debitCm.symbol}` : null,
    limitLeftStr: `${fmtFull(convertTo(4980000, (credit || {}).currency || "KZT"))} ${creditCm.symbol}`,
  });

  const sectionLabel = (t) => <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{t}</div>;

  // Чипсы валют; в режиме чипсов — с суммами (стресс-тест длинных значений показателен именно тут).
  const chips = (accounts, activeCur, onPick, withAmounts) => (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {accounts.map(s => {
        const cm = CURRENCY_META[s.currency] || { symbol: s.currency };
        const on = s.currency === activeCur;
        return (
          <div key={s.currency} data-press onClick={() => onPick(s.currency)} style={{
            padding: withAmounts ? "7px 11px" : "9px 13px", borderRadius: 10, cursor: "pointer",
            border: `1.5px solid ${on ? C.accentDark : C.border}`,
            backgroundColor: on ? C.accentSoft : C.card,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{cm.symbol} {s.currency}</div>
            {withAmounts && (
              <div style={{ fontSize: 11, color: C.muted, marginTop: 1, fontFeatureSettings: "'tnum'" }}>{fmtFull(S(s.amount))}</div>
            )}
          </div>
        );
      })}
    </div>
  );

  // Строка источника в списке «валюта-первая» (радио + карта + сумма).
  const sourceRow = (s, isTop, dim) => {
    const on = debit && debit.id === s.id;
    const cm = CURRENCY_META[s.currency] || { symbol: s.currency };
    return (
      <div key={s.id} data-press onClick={() => { setDebitSel(s.id); setFromOpen(false); }} style={{
        display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", cursor: "pointer",
        opacity: dim && !on ? 0.6 : 1,
        backgroundColor: on ? C.accentSoft : "transparent",
        borderBottom: `1px solid ${C.divider}`,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
          border: on ? `5px solid ${C.accentDark}` : `1.5px solid ${C.border}`,
          boxSizing: "border-box", backgroundColor: on ? "#fff" : "transparent",
        }} />
        <div style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: s.cardColor || C.faint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <CreditCard size={13} color="#fff" strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.cardName}</span>
            {isTop && <span style={{ fontSize: 10, fontWeight: 700, color: C.accentDark, backgroundColor: C.accentSoft, borderRadius: 20, padding: "1px 7px", flexShrink: 0 }}>по объёму</span>}
          </div>
          {dim && <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{s.currency} → {(credit || {}).currency} · конверсия</div>}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'", flexShrink: 0 }}>
          {fmtFull(S(s.amount))} <span style={{ fontSize: 11, color: C.muted }}>{cm.symbol}</span>
        </span>
      </div>
    );
  };

  return (
    <ScreenShell C={C} title="Пополнить" onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        {/* Внешний источник (чужая карта / Apple Pay) — компактная строка, счёт не выбирается */}
        {kind !== "own" && !["n26", "revolut"].includes(layout) && (
          <div style={{ marginBottom: 14 }}>
            {sectionLabel("Списать с")}
            <div style={{ backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                backgroundColor: kind === "external" ? (tok ? tok.color : C.faint) : "#111827",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 800, flexShrink: 0,
              }}>
                {kind === "external" && tok ? tok.network
                  : kind === "external" ? <CreditCard size={17} color={C.text} strokeWidth={2} />
                  : <Wallet size={17} color="#fff" strokeWidth={1.9} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{extTitle}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>{extSub}</div>
              </div>
              <span data-press onClick={onChangeSource} style={{ fontSize: 13, fontWeight: 600, color: C.accentDark, cursor: "pointer", flexShrink: 0 }}>Изменить</span>
            </div>
          </div>
        )}

        {/* Чипсы-раскладка: «Списать с» = карта + чипсы её валютных счетов */}
        {kind === "own" && layout === "chips" && chipCard && (
          <div style={{ marginBottom: 14 }}>
            {sectionLabel("Списать с")}
            <div style={{ backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: chipSources.length > 1 ? 10 : 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: chipCard.color || C.faint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CreditCard size={17} color="#fff" strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{chipCard.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>•• {chipCard.last4}</div>
                </div>
                <span data-press onClick={onChangeSource} style={{ fontSize: 13, fontWeight: 600, color: C.accentDark, cursor: "pointer", flexShrink: 0 }}>Изменить</span>
              </div>
              {chipSources.length > 1 && chips(chipSources, (debit || {}).currency, (cur) => setDebitSel(`${chipCard.id}-${cur}`), true)}
            </div>
          </div>
        )}

        {/* N26-раскладка: сумма — первая, «Откуда»/«Куда» — строки-дропдауны, далее Review */}
        {layout === "n26" && (
          <>
            <div style={{ marginBottom: 14 }}>
              {sectionLabel("Сумма пополнения")}
              <div style={{
                backgroundColor: C.card, borderRadius: 12,
                border: `1.5px solid ${valid || !amount ? C.border : "#EF4444"}`,
                padding: "18px 16px", display: "flex", alignItems: "center", gap: 8,
              }}>
                <input
                  autoFocus
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                  inputMode="decimal" placeholder="0"
                  style={{
                    flex: 1, border: "none", outline: "none", background: "transparent",
                    fontSize: 30, fontWeight: 800, color: C.text,
                    fontFamily: "inherit", fontFeatureSettings: "'tnum'", minWidth: 0,
                  }}
                />
                <span style={{ fontSize: 22, fontWeight: 700, color: C.muted }}>{creditCm.symbol}</span>
              </div>
              {cross && (
                <div style={{ fontSize: 12, color: C.muted, marginTop: 6, fontFeatureSettings: "'tnum'" }}>
                  Курс 1 {debitCm.symbol} = {rate >= 1 ? rate.toFixed(2) : rate.toFixed(4)} {creditCm.symbol}
                  {num > 0 && ` · спишем ≈ ${fmtFull(debitEquiv)} ${debitCm.symbol}`}
                </div>
              )}
              {!valid && amount && balance != null && debitEquiv > balance && (
                <div style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>Недостаточно средств на счёте списания</div>
              )}
            </div>

            {/* Откуда — дропдаун источника */}
            <div style={{ marginBottom: 8 }}>
              {sectionLabel("Откуда")}
              <div style={{ backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div data-press onClick={() => { if (kind === "own") { setFromOpen(o => !o); setToOpen(false); } }} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: kind === "own" ? "pointer" : "default",
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: kind === "own" ? 8 : 10,
                    backgroundColor: kind === "own" ? ((debit || {}).cardColor || C.faint) : kind === "external" ? (tok ? tok.color : C.faint) : "#111827",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, flexShrink: 0,
                  }}>
                    {kind === "own" ? <CreditCard size={17} color="#fff" strokeWidth={2} />
                      : kind === "external" && tok ? tok.network
                      : kind === "external" ? <CreditCard size={17} color={C.text} strokeWidth={2} />
                      : <Wallet size={17} color="#fff" strokeWidth={1.9} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {kind === "own" && debit ? `${debit.cardName} · ${debit.currency}` : extTitle}
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>
                      {kind === "own" && debit ? `•• ${debit.last4} · ${fmtFull(S(debit.amount))} ${(CURRENCY_META[debit.currency] || {}).symbol || debit.currency}` : extSub}
                    </div>
                  </div>
                  {kind === "own" && <ChevronDown size={16} color={C.muted} style={{ transform: fromOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }} />}
                </div>
                {fromOpen && kind === "own" && (
                  <div style={{ borderTop: `1px solid ${C.divider}` }}>
                    {monoSources.map((s, i) => sourceRow(s, i === 0, false))}
                    {crossSources.length > 0 && (
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textAlign: "center", padding: "8px 0 4px", letterSpacing: "0.05em" }}>С КОНВЕРСИЕЙ</div>
                    )}
                    {crossSources.map(s => sourceRow(s, false, true))}
                  </div>
                )}
              </div>
            </div>

            {/* Куда — дропдаун карты зачисления + чипсы валют */}
            <div style={{ marginBottom: 14 }}>
              {sectionLabel("Куда")}
              <div style={{ backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div data-press onClick={() => { setToOpen(o => !o); setFromOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: target.color || C.faint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CreditCard size={17} color="#fff" strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{target.name} · {(credit || {}).currency}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>•• {target.last4}</div>
                  </div>
                  <ChevronDown size={16} color={C.muted} style={{ transform: toOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }} />
                </div>
                {toOpen && (
                  <div style={{ borderTop: `1px solid ${C.divider}` }}>
                    {allCards.filter(c => c.id !== target.id).map(c => (
                      <div key={c.id} data-press onClick={() => { setTargetId(c.id); setToOpen(false); setCreditSel(null); setDebitSel(null); }} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", cursor: "pointer", borderBottom: `1px solid ${C.divider}`,
                      }}>
                        <div style={{ width: 30, height: 30, borderRadius: 7, backgroundColor: c.color || C.faint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <CreditCard size={15} color="#fff" strokeWidth={2} />
                        </div>
                        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: C.muted, fontFeatureSettings: "'tnum'" }}>•• {c.last4}</div>
                      </div>
                    ))}
                    {targetAccounts.length > 1 && (
                      <div style={{ padding: "10px 14px" }}>
                        {chips(targetAccounts, (credit || {}).currency, (cur) => { setCreditSel(cur); setToOpen(false); }, false)}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {credit && (
                <div style={{ fontSize: 11, color: C.muted, marginTop: 6, lineHeight: 1.4 }}>
                  {creditSel ? `Счёт зачисления выбран вручную: ${credit.currency}` : `Счёт зачисления подставлен автоматически: ${credit.currency}`}
                  {cross ? " · включится конверсия" : ""}
                </div>
              )}
            </div>
          </>
        )}

        {/* Revolut-раскладка: карточка перевода — источник → ↓ → цель (валюта-дропдаун + сумма в одном блоке) */}
        {layout === "revolut" && (
          <>
            {/* Откуда — строка с кнопкой «Изменить» (Change) */}
            <div style={{ backgroundColor: C.card, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: kind === "own" ? 8 : 10,
                  backgroundColor: kind === "own" ? ((debit || {}).cardColor || C.faint) : kind === "external" ? (tok ? tok.color : C.faint) : "#111827",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, flexShrink: 0,
                }}>
                  {kind === "own" ? <CreditCard size={17} color="#fff" strokeWidth={2} />
                    : kind === "external" && tok ? tok.network
                    : kind === "external" ? <CreditCard size={17} color={C.text} strokeWidth={2} />
                    : <Wallet size={17} color="#fff" strokeWidth={1.9} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {kind === "own" && debit ? `${debit.cardName} · ${debit.currency}` : extTitle}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>
                    {kind === "own" && debit ? `•• ${debit.last4} · ${fmtFull(S(debit.amount))} ${(CURRENCY_META[debit.currency] || {}).symbol || debit.currency}` : extSub}
                  </div>
                </div>
                {kind === "own" && (
                  <div data-press onClick={() => { setFromOpen(o => !o); setToOpen(false); setCurOpen(false); }} style={{
                    backgroundColor: C.faint, borderRadius: 18, padding: "7px 14px", cursor: "pointer", flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>Изменить</span>
                  </div>
                )}
              </div>
              {fromOpen && kind === "own" && (
                <div style={{ borderTop: `1px solid ${C.divider}` }}>
                  {monoSources.map((s, i) => sourceRow(s, i === 0, false))}
                  {crossSources.length > 0 && (
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textAlign: "center", padding: "8px 0 4px", letterSpacing: "0.05em" }}>С КОНВЕРСИЕЙ</div>
                  )}
                  {crossSources.map(s => sourceRow(s, false, true))}
                </div>
              )}
            </div>

            {/* Стрелка-поток между блоками */}
            <div style={{ display: "flex", justifyContent: "center", margin: "-4px 0", position: "relative", zIndex: 2 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: C.faint, border: `3px solid ${C.bg}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowDown size={13} color={C.text} strokeWidth={2.4} />
              </div>
            </div>

            {/* Цель: карта (тап — сменить) + валюта-дропдаун и сумма в одном блоке */}
            <div style={{ backgroundColor: C.faint, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
              <div data-press onClick={() => { setToOpen(o => !o); setFromOpen(false); setCurOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "12px 14px 0", cursor: "pointer",
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{target.name} •• {target.last4}</span>
                <ChevronDown size={13} color={C.muted} style={{ transform: toOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
              </div>
              {toOpen && (
                <div style={{ margin: "8px 14px 0", backgroundColor: C.card, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  {allCards.filter(c => c.id !== target.id).map((c, ci, arr) => (
                    <div key={c.id} data-press onClick={() => { setTargetId(c.id); setToOpen(false); setCreditSel(null); setDebitSel(null); }} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer",
                      borderBottom: ci < arr.length - 1 ? `1px solid ${C.divider}` : "none",
                    }}>
                      <div style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: c.color || C.faint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CreditCard size={13} color="#fff" strokeWidth={2} />
                      </div>
                      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.text }}>{c.name}</span>
                      <span style={{ fontSize: 12, color: C.muted, fontFeatureSettings: "'tnum'" }}>•• {c.last4}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px 4px" }}>
                <div data-press onClick={() => { setCurOpen(o => !o); setFromOpen(false); setToOpen(false); }} style={{
                  display: "flex", alignItems: "center", gap: 6, backgroundColor: C.card, borderRadius: 18,
                  padding: "7px 12px", cursor: "pointer", border: `1px solid ${C.border}`, flexShrink: 0,
                }}>
                  <span style={{ fontSize: 15 }}>{(CURRENCY_META[(credit || {}).currency] || {}).flag}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{(credit || {}).currency}</span>
                  <ChevronDown size={14} color={C.muted} style={{ transform: curOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                </div>
                <input
                  autoFocus
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                  inputMode="decimal" placeholder="0"
                  style={{
                    flex: 1, border: "none", outline: "none", background: "transparent",
                    fontSize: 30, fontWeight: 800, color: C.text, textAlign: "right",
                    fontFamily: "inherit", fontFeatureSettings: "'tnum'", minWidth: 0,
                  }}
                />
              </div>
              {curOpen && (
                <div style={{ margin: "0 14px 8px", backgroundColor: C.card, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  {targetAccounts.map((s, i) => {
                    const cm2 = CURRENCY_META[s.currency] || { symbol: s.currency, flag: "" };
                    const on = s.currency === (credit || {}).currency;
                    return (
                      <div key={s.currency} data-press onClick={() => { setCreditSel(s.currency); setCurOpen(false); }} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer",
                        borderBottom: i < targetAccounts.length - 1 ? `1px solid ${C.divider}` : "none",
                        backgroundColor: on ? C.accentSoft : "transparent",
                      }}>
                        <span style={{ fontSize: 16 }}>{cm2.flag}</span>
                        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.text }}>{cm2.name || s.currency}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, fontFeatureSettings: "'tnum'" }}>{fmtFull(S(s.amount))} {cm2.symbol}</span>
                        {on && <Check size={15} color={C.accentDark} strokeWidth={2.6} style={{ marginLeft: 2 }} />}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 12px" }}>
                <span style={{ fontSize: 11.5, color: C.muted, fontFeatureSettings: "'tnum'" }}>
                  Баланс: {credit ? `${fmtFull(S(credit.amount))} ${(CURRENCY_META[credit.currency] || {}).symbol || ""}` : "—"}
                </span>
                <span style={{ fontSize: 11.5, color: C.muted, fontFeatureSettings: "'tnum'" }}>
                  {cross ? `Конверсия · 1 ${debitCm.symbol} = ${rate >= 1 ? rate.toFixed(2) : rate.toFixed(4)} ${creditCm.symbol}` : "Без комиссии"}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Зачислить на: карта менябельна (инлайн-список), чипсы валют по раскладке */}
        {!["n26", "revolut"].includes(layout) && (
        <div style={{ marginBottom: 14 }}>
          {sectionLabel("Зачислить на")}
          <div style={{ backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div data-press onClick={() => setTargetOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: target.color || C.faint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CreditCard size={17} color="#fff" strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{target.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>•• {target.last4}{layout === "auto" && credit ? ` · счёт ${credit.currency}` : ""}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.accentDark, display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                Изменить <ChevronDown size={15} color={C.accentDark} style={{ transform: targetOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
              </span>
            </div>
            {targetOpen && allCards.filter(c => c.id !== target.id).map(c => (
              <div key={c.id} data-press onClick={() => { setTargetId(c.id); setTargetOpen(false); setCreditSel(null); setDebitSel(null); }} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", cursor: "pointer", borderTop: `1px solid ${C.divider}`,
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, backgroundColor: c.color || C.faint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CreditCard size={15} color="#fff" strokeWidth={2} />
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>{c.name}</div>
                <div style={{ fontSize: 12, color: C.muted, fontFeatureSettings: "'tnum'" }}>•• {c.last4}</div>
              </div>
            ))}
          </div>
          {layout === "currencyFirst" && targetAccounts.length > 1 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>В какой валюте пополнить</div>
              {chips(targetAccounts, (credit || {}).currency, (cur) => { setCreditSel(cur); setDebitSel(null); }, false)}
            </div>
          )}
          {layout === "chips" && targetAccounts.length > 1 && (
            <div style={{ marginTop: 8 }}>
              {chips(targetAccounts, (credit || {}).currency, (cur) => setCreditSel(cur), true)}
            </div>
          )}
          {layout !== "auto" && credit && (
            <div style={{ fontSize: 11, color: C.muted, marginTop: 6, lineHeight: 1.4 }}>
              {creditSel ? `Счёт зачисления выбран вручную: ${credit.currency}` : `Счёт зачисления подставлен автоматически: ${credit.currency}`}
              {cross ? " · включится конверсия" : ""}
            </div>
          )}
        </div>
        )}

        {/* Валюта-первая: источники выбранной валюты + секция «с конверсией» */}
        {kind === "own" && layout === "currencyFirst" && credit && (
          <div style={{ marginBottom: 14 }}>
            {sectionLabel(`Откуда списать ${credit.currency}`)}
            <div style={{ backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              {monoSources.map((s, i) => sourceRow(s, i === 0, false))}
              {monoSources.length === 0 && (
                <div style={{ padding: "12px 14px", fontSize: 12, color: C.muted }}>
                  Нет своих счетов в {credit.currency} — выберите источник с конверсией
                </div>
              )}
              {crossSources.length > 0 && (
                <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textAlign: "center", padding: "8px 0 4px", letterSpacing: "0.05em", borderTop: `1px solid ${C.divider}` }}>
                  С КОНВЕРСИЕЙ
                </div>
              )}
              {crossSources.map(s => sourceRow(s, false, true))}
            </div>
          </div>
        )}

        {/* Автомат: смарт-строка с объяснением; «Изменить» раскрывает полный пикер на месте */}
        {kind === "own" && layout === "auto" && debit && credit && (
          <div style={{ marginBottom: 14, backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <Zap size={15} color={C.accentDark} strokeWidth={2.2} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>
              Спишем с <span style={{ fontWeight: 700, color: C.text }}>{debit.cardName} · {debit.currency}</span>
              {mono ? " — без конверсии" : ` — конверсия ${debitCm.symbol} → ${creditCm.symbol}`}
            </div>
            <span data-press onClick={() => setAutoOpen(true)} style={{ fontSize: 13, fontWeight: 600, color: C.accentDark, cursor: "pointer", flexShrink: 0 }}>Изменить</span>
          </div>
        )}

        {/* Сумма — в валюте счёта зачисления (в N26/Revolut-раскладках сумма живёт выше) */}
        {!["n26", "revolut"].includes(layout) && (
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Сумма пополнения</div>
          <div style={{
            backgroundColor: C.card, borderRadius: 12,
            border: `1.5px solid ${valid || !amount ? C.border : "#EF4444"}`,
            padding: "16px", display: "flex", alignItems: "center", gap: 8,
          }}>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
              inputMode="decimal" placeholder="0"
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontSize: 26, fontWeight: 800, color: C.text,
                fontFamily: "inherit", fontFeatureSettings: "'tnum'", minWidth: 0,
              }}
            />
            <span style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>{creditCm.symbol}</span>
          </div>
          {cross && (
            <div style={{ fontSize: 12, color: C.muted, marginTop: 6, fontFeatureSettings: "'tnum'" }}>
              Курс 1 {debitCm.symbol} = {rate >= 1 ? rate.toFixed(2) : rate.toFixed(4)} {creditCm.symbol}
              {num > 0 && ` · спишем ≈ ${fmtFull(debitEquiv)} ${debitCm.symbol}`}
            </div>
          )}
          {!valid && amount && balance != null && debitEquiv > balance && (
            <div style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>
              Недостаточно средств на счёте списания
            </div>
          )}
        </div>
        )}

        {layout !== "revolut" && (
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>
          {layout === "n26" ? "Комиссия и лимит — на экране проверки" : kind === "own" ? "Без комиссии · мгновенно" : "Зачисление мгновенно · комиссия 0%"}
        </div>
        )}

        {/* Revolut-поведение: кнопка активна при любой сумме; нехватка средств — шитом с Retry */}
        <div data-press onClick={() => {
          if (layout === "revolut" && num > 0 && !valid) { setErrOpen(true); return; }
          confirm();
        }} style={{
          backgroundColor: (layout === "revolut" ? num > 0 : valid) ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: (layout === "revolut" ? num > 0 : valid) ? "pointer" : "default", transition: "background-color 0.15s",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: (layout === "revolut" ? num > 0 : valid) ? C.accent : C.muted }}>{layout === "n26" ? "Продолжить" : "Пополнить"}</span>
        </div>

        {errOpen && (
          <BottomSheetModal C={C} onClose={() => setErrOpen(false)}>
            <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <X size={22} color="#EF4444" strokeWidth={2.4} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.text, lineHeight: 1.35, marginBottom: 18 }}>
                Убедитесь, что на счёте достаточно средств для этой операции
              </div>
              <div data-press onClick={() => setErrOpen(false)} style={{ backgroundColor: C.text, borderRadius: 24, padding: "14px 0", cursor: "pointer" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.card }}>Попробовать снова</span>
              </div>
            </div>
          </BottomSheetModal>
        )}
      </div>
    </ScreenShell>
  );
}

// Поручение ТН — без пикеров, счёт-источник = карта, из-под которой зашли.
function TnOrderScreen({ C, card, variant, onBack, onConfirm }) {
  const [amount, setAmount] = useState("");
  const credit = resolveCreditAccount(card, card.primaryCurrency);
  const num = parseFloat(amount.replace(",", ".")) || 0;
  const valid = num > 0;
  const cm = CURRENCY_META[credit?.currency] || { symbol: credit?.currency || "" };

  return (
    <ScreenShell C={C} title={variant.title} onBack={onBack}>
      <div style={{ padding: "4px 20px 110px" }}>
        {/* Поручка ТН: пикеры не показываются — сразу счёт-источник */}
        <div style={{
          backgroundColor: C.accentSoft, borderRadius: 12, padding: "12px 16px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Zap size={14} color={C.accentDark} strokeWidth={2.2} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Поручение в Tradernet · без пикеров</span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Зачислить на счёт</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", backgroundColor: C.faint,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0,
          }}>{cm.flag}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{card.name} · {credit?.currency}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>•• {card.last4}</div>
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Сумма</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1.5px solid ${C.border}`,
          padding: "16px", display: "flex", alignItems: "center", gap: 8, marginBottom: 24,
        }}>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
            inputMode="decimal" placeholder="0"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 26, fontWeight: 800, color: C.text,
              fontFamily: "inherit", fontFeatureSettings: "'tnum'", minWidth: 0,
            }}
          />
          <span style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>{cm.symbol}</span>
        </div>

        <div data-press onClick={() => valid && credit && onConfirm({ credit, amount: num, card, variant })} style={{
          backgroundColor: valid ? C.accentDark : C.faint,
          borderRadius: 12, padding: "15px 0", textAlign: "center",
          cursor: valid ? "pointer" : "default",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: valid ? C.accent : C.muted }}>Создать поручение</span>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════════ */

export default function FreedomV6() {
  const [displayCurrency, setDisplayCurrency] = useState("EUR");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [productTab, setProductTab] = useState("bank");
  const [theme, setTheme] = useState("stripe");
  const [debugOpen, setDebugOpen] = useState(false);
  const [emptyState, setEmptyState] = useState(false);
  const [blockVis, setBlockVis] = useState(
    BLOCK_LABELS.reduce((acc, b) => ({ ...acc, [b.key]: true }), {})
  );
  const [blockOrder, setBlockOrder] = useState(BLOCK_LABELS.map(b => b.key));
  const [featureFlags, setFeatureFlags] = useState(
    FEATURE_FLAGS.reduce((acc, f) => ({ ...acc, [f.key]: f.default }), {})
  );
  // Mini-router: bottom tabs (real HomeTab) + pushed screens stack
  const [activeTab, setActiveTab] = useState("products");
  const [navStack, setNavStack] = useState([]);
  const pushScreen = (s) => setNavStack(prev => [...prev, s]);
  const popScreen = () => setNavStack(prev => prev.slice(0, -1));
  // Real app launches locked (AuthPin) — any 4-digit code unlocks the prototype
  const [locked, setLocked] = useState(true);
  // Pre-auth onboarding phase: null = выкл (дефолт, нулевая регрессия); иначе { gates, stepKey, sub? }
  const [onb, setOnb] = useState(null);
  // Пикер счетов на экране пополнения — режимы из дебаг-блока «Пикер счетов»
  const [pickerMode, setPickerMode] = useState("currencyFirst"); // currencyFirst | chips | auto
  const [autoExpandMode, setAutoExpandMode] = useState("currencyFirst"); // что раскрывает «Изменить» в автомате
  const [stressLong, setStressLong] = useState(false); // стресс-тест длинных сумм в чипсах
  // Bottom sheets: {type:'promo',promo} | {type:'topup'} | {type:'logout'}
  const [sheet, setSheet] = useState(null);

  const activeCardProducts = emptyState ? EMPTY_CARD_PRODUCTS : CARD_PRODUCTS;
  const activeAccounts = emptyState ? [] : ACCOUNTS_LIST;
  const activeLoans = emptyState ? [] : LOANS;
  const activeCredits = emptyState ? [] : CREDITS;
  const activePromos = emptyState ? PROMOS_EMPTY : PROMOS;
  const activeNews = emptyState ? FEATURED_NEWS_EMPTY : FEATURED_NEWS;
  const activeRequests = emptyState ? [] : PENDING_REQUESTS;

  const totalInKZT = useMemo(() => {
    if (emptyState) return 0;
    let sum = 0;
    CARD_PRODUCTS.forEach(group => {
      group.cards.forEach(c => { sum += convertToKZT(c.primaryBalance, c.primaryCurrency); });
    });
    ACCOUNTS_LIST.forEach(a => { sum += convertToKZT(a.balance, a.currency); });
    return sum;
  }, [emptyState]);

  const C = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  useEffect(() => {
    document.body.style.backgroundColor = C.bg;
  }, [theme]);

  return (
    <>
      <style>{`
        @keyframes screen-slide-in {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes sheet-slide-up {
          from { transform: translateX(-50%) translateY(100%); }
          to   { transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      {debugOpen && (
        <BottomSheet
          theme={theme} setTheme={setTheme}
          onClose={() => setDebugOpen(false)}
          blockVis={blockVis} setBlockVis={setBlockVis}
          blockOrder={blockOrder} setBlockOrder={setBlockOrder}
          emptyState={emptyState} setEmptyState={setEmptyState}
          featureFlags={featureFlags} setFeatureFlags={setFeatureFlags}
          onb={onb} setOnb={setOnb}
          pickerMode={pickerMode} setPickerMode={setPickerMode}
          autoExpandMode={autoExpandMode} setAutoExpandMode={setAutoExpandMode}
          stressLong={stressLong} setStressLong={setStressLong}
          C={C}
        />
      )}
      {activeTab === "products" && (
        <MainScreen
          onAvatarClick={() => setDebugOpen(true)}
          displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency}
          pickerOpen={pickerOpen} setPickerOpen={setPickerOpen}
          totalInKZT={totalInKZT}
          productTab={productTab} setProductTab={setProductTab}
          blockVis={blockVis} blockOrder={blockOrder}
          emptyState={emptyState}
          featureFlags={featureFlags}
          activeCardProducts={activeCardProducts}
          activeAccounts={activeAccounts}
          activeLoans={activeLoans}
          activeCredits={activeCredits}
          activePromos={activePromos}
          activeNews={activeNews}
          activeRequests={activeRequests}
          onOpenCard={(card) => pushScreen({ type: "product", card })}
          onOpenTotal={() => pushScreen({ type: "total" })}
          onOpenRequest={(request) => pushScreen({ type: "requestInfo", request })}
          onOpenProfile={() => pushScreen({ type: "settings" })}
          onOpenDeposit={() => pushScreen({ type: "depositCalc" })}
          onOpenNews={() => pushScreen({ type: "newsList" })}
          onOpenAccount={(account) => pushScreen({ type: "accountDetails", account })}
          onOpenDepositDetails={(deposit) => pushScreen({ type: "depositDetails", deposit })}
          onOpenCredit={(credit) => pushScreen({ type: "creditDetails", credit })}
          onOpenLoan={(loan) => pushScreen({ type: "loanDetails", loan })}
          onOpenBroker={(account) => pushScreen({ type: "brokerDetails", account })}
          onOpenPromo={(promo) => setSheet({ type: "promo", promo })}
          onOpenStory={(storyId) => pushScreen({ type: "story", storyId })}
          onOpenAllContacts={() => pushScreen({ type: "allContacts" })}
          onOpenEsim={() => pushScreen({ type: "esim" })}
          onOpenAviata={() => pushScreen({ type: "aviata" })}
          C={C} theme={theme}
        />
      )}
      {activeTab === "payments" && (
        <PaymentsScreen C={C} featureFlags={featureFlags}
          onOpenStub={() => {}}
          onTransferOwn={() => pushScreen({ type: "transferOwn" })}
          onRequestMoney={() => pushScreen({ type: "requestCreate" })}
          onPhoneTransfer={() => pushScreen({ type: "phoneTransfer" })}
          onConversion={() => pushScreen({ type: "conversion" })}
          onQrScan={() => pushScreen({ type: "qrScanner" })}
          onSwift={() => pushScreen({ type: "swift" })}
          onCardTransfer={() => pushScreen({ type: "cardTransfer" })}
          onIban={() => pushScreen({ type: "ibanTransfer" })}
          onMobilePay={() => pushScreen({ type: "mobilePay" })}
          onOpenCategory={(category) => pushScreen({ type: "category", category })}
          onOpenTemplate={(template) => pushScreen({ type: "templatePay", template })}
        />
      )}
      {activeTab === "statistics" && (
        <StatisticsScreen C={C}
          onOpenTransaction={(tx) => pushScreen({ type: "transaction", tx })}
        />
      )}
      {activeTab === "chats" && (
        <ChatsScreen C={C} featureFlags={featureFlags}
          onOpenThread={() => pushScreen({ type: "chatThread" })}
        />
      )}
      {navStack.map((s, i) => {
        if (s.type === "product") return (
          <ProductDetailsScreen key={i} card={s.card} C={C} featureFlags={featureFlags}
            onBack={popScreen}
            onTransfer={() => pushScreen({ type: "transferOwn" })}
            onOpenTransaction={(tx) => pushScreen({ type: "transaction", tx })}
            onOpenLimits={() => pushScreen({ type: "cardLimits", card: s.card })}
            onOpenPinChange={() => pushScreen({ type: "pinChange" })}
            onOpenRequisites={() => pushScreen({ type: "requisites", card: s.card })}
            onTopUp={() => setSheet({ type: "topup", card: s.card })}
            onOpenAllTransactions={() => pushScreen({ type: "allTransactions" })}
          />
        );
        if (s.type === "topupAmount") return (
          <TopUpAmountScreen key={i} C={C} card={s.card} source={s.source} displayCurrency={displayCurrency}
            pickerMode={pickerMode} autoExpandMode={autoExpandMode} stressLong={stressLong}
            onBack={popScreen}
            onChangeSource={() => { popScreen(); setSheet({ type: "topup", card: s.card }); }}
            onConfirm={(p) => {
              // N26-паттерн: перед исполнением — отдельный экран проверки (Review)
              if (pickerMode === "n26") { pushScreen({ type: "topupReview", payload: p }); return; }
              pushScreen({
                type: "flowSuccess",
                payload: {
                  title: "Пополнение выполнено",
                  message: p.credit.mono ? "Моновалютный перевод" : `Зачислено на счёт в ${p.credit.currency}`,
                  amountStr: `${fmtFull(p.amount)} ${CURRENCY_META[p.credit.currency]?.symbol || ""}`,
                  note: `${p.debit.name} → ${p.card.name} •• ${p.card.last4}`,
                },
              });
            }}
          />
        );
        if (s.type === "topupReview") return (
          <GenericConfirmScreen key={i} C={C}
            title="Проверьте и пополните"
            subtitle={`${s.payload.debit.name} → ${s.payload.card.name}`}
            amountStr={`${fmtFull(s.payload.amount)} ${CURRENCY_META[s.payload.credit.currency]?.symbol || ""}`}
            rows={[
              { label: "Откуда", value: s.payload.debit.name },
              { label: "Куда", value: `${s.payload.card.name} · ${s.payload.credit.currency}` },
              { label: "Комиссия", value: "Бесплатно" },
              ...(s.payload.rateStr ? [
                { label: "Курс", value: s.payload.rateStr },
                { label: "Спишется", value: s.payload.debitEquivStr },
              ] : []),
              { label: "Лимит в месяц", value: `осталось ${s.payload.limitLeftStr}` },
            ]}
            confirmLabel="Пополнить"
            onBack={popScreen}
            onConfirm={() => pushScreen({
              type: "flowSuccess",
              payload: {
                title: "Пополнение выполнено",
                message: s.payload.credit.mono ? "Моновалютный перевод" : `Зачислено на счёт в ${s.payload.credit.currency}`,
                amountStr: `${fmtFull(s.payload.amount)} ${CURRENCY_META[s.payload.credit.currency]?.symbol || ""}`,
                note: `${s.payload.debit.name} → ${s.payload.card.name} •• ${s.payload.card.last4}`,
              },
            })}
          />
        );
        if (s.type === "tnOrder") return (
          <TnOrderScreen key={i} C={C} card={s.card} variant={s.variant}
            onBack={popScreen}
            onConfirm={(p) => pushScreen({
              type: "flowSuccess",
              payload: {
                title: "Поручение создано",
                message: `${p.variant.title} · исполнение в Tradernet`,
                amountStr: `${fmtFull(p.amount)} ${CURRENCY_META[p.credit.currency]?.symbol || ""}`,
                note: `Зачисление на ${p.card.name} •• ${p.card.last4}`,
              },
            })}
          />
        );
        if (s.type === "cardLimits") return (
          <CardLimitsScreen key={i} C={C} card={s.card} onBack={popScreen} />
        );
        if (s.type === "requisites") return (
          <RequisitesScreen key={i} C={C} card={s.card} onBack={popScreen} />
        );
        if (s.type === "pinChange") return (
          <PinChangeScreen key={i} C={C}
            onBack={popScreen}
            onDone={() => pushScreen({ type: "pinChangeResult" })}
          />
        );
        if (s.type === "pinChangeResult") return (
          <SuccessScreen key={i} C={C}
            title="Успешно"
            message="ПИН-код карты изменён"
            onDone={() => setNavStack([])}
          />
        );
        if (s.type === "certificates") return (
          <CertificatesScreen key={i} C={C} featureFlags={featureFlags}
            onBack={popScreen}
            onDone={() => pushScreen({ type: "certificatesResult" })}
          />
        );
        if (s.type === "certificatesResult") return (
          <SuccessScreen key={i} C={C}
            title="Справка сформирована"
            message="Документ с печатью банка отправлен на n.shulaev@ff···.com"
            onDone={() => setNavStack([])}
          />
        );
        if (s.type === "help") return (
          <HelpScreen key={i} C={C} onBack={popScreen} />
        );
        if (s.type === "qrScanner") return (
          <QrScannerScreen key={i} onBack={popScreen} />
        );
        if (s.type === "transferOwn") return (
          <TransferOwnScreen key={i} C={C} featureFlags={featureFlags}
            onBack={popScreen}
            onNext={(payload) => pushScreen({ type: "transferConfirm", payload })}
          />
        );
        if (s.type === "transferConfirm") return (
          <TransferConfirmScreen key={i} C={C} payload={s.payload}
            onBack={popScreen}
            onConfirm={() => pushScreen({ type: "transferResult", payload: s.payload })}
          />
        );
        if (s.type === "transferResult") return (
          <TransferResultScreen key={i} C={C} payload={s.payload}
            onDone={() => setNavStack([])}
          />
        );
        if (s.type === "total") return (
          <ProductsTotalScreen key={i} C={C}
            totalInKZT={totalInKZT} displayCurrency={displayCurrency}
            onBack={popScreen}
          />
        );
        if (s.type === "transaction") return (
          <TransactionDetailsScreen key={i} tx={s.tx} C={C} featureFlags={featureFlags}
            onBack={popScreen}
            onSplit={(tx) => pushScreen({ type: "splitMain", tx })}
            onAddTemplate={() => pushScreen({ type: "templateCreated" })}
          />
        );
        if (s.type === "templateCreated") return (
          <SuccessScreen key={i} C={C}
            title="Шаблон создан"
            message="Найдёте его на экране Переводы в разделе «Шаблоны и автопереводы»"
            onDone={() => setNavStack([])}
          />
        );
        if (s.type === "splitMain") return (
          <SplitMainScreen key={i} tx={s.tx} C={C}
            onBack={popScreen}
            onNext={(payload) => pushScreen({ type: "splitConfirm", payload })}
          />
        );
        if (s.type === "splitConfirm") return (
          <SplitConfirmScreen key={i} C={C} payload={s.payload}
            onBack={popScreen}
            onConfirm={() => pushScreen({ type: "splitResult", payload: s.payload })}
          />
        );
        if (s.type === "splitResult") return (
          <SuccessScreen key={i} C={C}
            title="Запрос отправлен"
            message="Ожидается оплата, истекает через 7 дней"
            amountStr={`+${fmtFull(s.payload.perPerson * s.payload.contactIds.length)} ₸`}
            note={`${s.payload.contactIds.length} ${s.payload.contactIds.length === 1 ? "участник" : s.payload.contactIds.length < 5 ? "участника" : "участников"} · по ${fmtFull(s.payload.perPerson)} ₸`}
            onDone={() => setNavStack([])}
          />
        );
        if (s.type === "requestCreate") return (
          <RequestCreateScreen key={i} C={C}
            onBack={popScreen}
            onNext={(payload) => pushScreen({ type: "requestConfirm", payload })}
          />
        );
        if (s.type === "requestConfirm") return (
          <RequestConfirmScreen key={i} C={C} payload={s.payload}
            onBack={popScreen}
            onConfirm={() => pushScreen({ type: "requestResult", payload: s.payload })}
          />
        );
        if (s.type === "requestResult") return (
          <SuccessScreen key={i} C={C}
            title="Запрос отправлен"
            message={`${s.payload.contact.name} ${s.payload.contact.surname} получит уведомление`}
            amountStr={`${fmtFull(s.payload.amount)} ₸`}
            note="Ожидается подтверждение, истекает через 7 дней"
            onDone={() => setNavStack([])}
          />
        );
        if (s.type === "requestInfo") return (
          <RequestInfoScreen key={i} request={s.request} C={C}
            onBack={popScreen}
            onReject={popScreen}
            onAccept={() => pushScreen({
              type: "requestAccepted",
              payload: s.request,
            })}
          />
        );
        if (s.type === "requestAccepted") return (
          <SuccessScreen key={i} C={C}
            title="Успешно"
            message="Перевод выполнен"
            amountStr={`${fmtFull(s.payload.amount)} ${CURRENCY_META[s.payload.currency]?.symbol || s.payload.currency}`}
            note={`${s.payload.from} · по запросу`}
            onDone={() => setNavStack([])}
          />
        );
        if (s.type === "settings") return (
          <SettingsScreen key={i} C={C} onBack={popScreen}
            onOpenNotifications={() => pushScreen({ type: "notifications" })}
            onOpenProfileInfo={() => pushScreen({ type: "profileInfo" })}
            onOpenSecurity={() => pushScreen({ type: "security" })}
            onOpenDevices={() => pushScreen({ type: "devices" })}
            onOpenLanguage={() => pushScreen({ type: "language" })}
            onOpenCertificates={() => pushScreen({ type: "certificates" })}
            onOpenHelp={() => pushScreen({ type: "help" })}
            onOpenDecor={() => pushScreen({ type: "decor" })}
            onOpenAbout={() => pushScreen({ type: "about" })}
            onOpenQr={() => pushScreen({ type: "profileQr" })}
            onOpenAviata={() => pushScreen({ type: "aviata" })}
            onLogout={() => setSheet({ type: "logout" })}
          />
        );
        if (s.type === "accountDetails") return (
          <AccountDetailsScreen key={i} account={s.account} C={C}
            onBack={popScreen}
            onOpenRequisites={() => pushScreen({ type: "requisites" })}
            onTransfer={() => pushScreen({ type: "transferOwn" })}
            onOpenTransaction={(tx) => pushScreen({ type: "transaction", tx })}
          />
        );
        if (s.type === "depositDetails") return (
          <DepositDetailsScreen key={i} deposit={s.deposit} C={C} onBack={popScreen} />
        );
        if (s.type === "creditDetails") return (
          <CreditDetailsScreen key={i} credit={s.credit} C={C} featureFlags={featureFlags} onBack={popScreen} />
        );
        if (s.type === "loanDetails") return (
          <LoanDetailsScreen key={i} loan={s.loan} C={C} onBack={popScreen} />
        );
        if (s.type === "brokerDetails") return (
          <BrokerDetailsScreen key={i} account={s.account} C={C} onBack={popScreen} />
        );
        if (s.type === "story") return (
          <StoryViewerScreen key={i} storyId={s.storyId} onClose={popScreen} />
        );
        if (s.type === "allTransactions") return (
          <AllTransactionsScreen key={i} C={C} onBack={popScreen}
            onOpenTransaction={(tx) => pushScreen({ type: "transaction", tx })}
          />
        );
        if (s.type === "allContacts") return (
          <AllContactsScreen key={i} C={C} onBack={popScreen}
            onPick={() => pushScreen({ type: "phoneTransfer" })}
          />
        );
        if (s.type === "swift") return (
          <SwiftTransferScreen key={i} C={C} featureFlags={featureFlags}
            onBack={popScreen}
            onNext={(p) => pushScreen({
              type: "genericConfirm",
              payload: {
                subtitle: "SWIFT-перевод",
                amountStr: `${fmtFull(p.amount)} $`,
                rows: [
                  { label: "Получатель", value: p.name },
                  { label: "SWIFT", value: p.swift },
                  { label: "IBAN", value: p.iban },
                  ...(featureFlags.payIbanKnp ? [{ label: "КНП", value: p.knp }] : []),
                  { label: "Комиссия", value: "0.35% · мин 25 $" },
                ],
                success: { title: "Перевод отправлен", message: "SWIFT-переводы исполняются 1-3 рабочих дня", amountStr: `${fmtFull(p.amount)} $`, note: p.name },
              },
            })}
          />
        );
        if (s.type === "cardTransfer") return (
          <CardNumberTransferScreen key={i} C={C}
            onBack={popScreen}
            onNext={(p) => pushScreen({
              type: "genericConfirm",
              payload: {
                subtitle: "Перевод по номеру карты",
                amountStr: `${fmtFull(p.amount)} ₸`,
                rows: [
                  { label: "Карта получателя", value: p.cardNum },
                  { label: "Банк", value: "Kaspi Bank" },
                  { label: "Комиссия", value: `${fmtFull(Math.max(200, p.amount * 0.0095))} ₸` },
                ],
                success: { title: "Успешно", message: "Перевод выполнен", amountStr: `${fmtFull(p.amount)} ₸`, note: p.cardNum },
              },
            })}
          />
        );
        if (s.type === "ibanTransfer") return (
          <IbanTransferScreen key={i} C={C} featureFlags={featureFlags}
            onBack={popScreen}
            onNext={(p) => pushScreen({
              type: "genericConfirm",
              payload: {
                subtitle: "IBAN-перевод",
                amountStr: `${fmtFull(p.amount)} ₸`,
                rows: [
                  { label: "ИИН", value: p.iin },
                  { label: "IBAN", value: p.iban },
                  ...(featureFlags.payIbanKbe ? [{ label: "КБе", value: p.kbe }] : []),
                  { label: "Комиссия", value: "Без комиссии" },
                ],
                success: { title: "Успешно", message: "Перевод выполнен", amountStr: `${fmtFull(p.amount)} ₸`, note: p.iban },
              },
            })}
          />
        );
        if (s.type === "mobilePay") return (
          <MobilePayScreen key={i} C={C}
            onBack={popScreen}
            onNext={(p) => pushScreen({
              type: "genericConfirm",
              payload: {
                subtitle: "Мобильная связь",
                amountStr: `${fmtFull(p.amount)} ₸`,
                rows: [
                  { label: "Номер", value: p.phone },
                  { label: "Оператор", value: p.operator },
                  { label: "Комиссия", value: "Без комиссии" },
                ],
                success: { title: "Успешно", message: "Платёж выполнен", amountStr: `${fmtFull(p.amount)} ₸`, note: `${p.operator} · ${p.phone}` },
              },
            })}
          />
        );
        if (s.type === "category") return (
          <CategoryProvidersScreen key={i} C={C} category={s.category}
            onBack={popScreen}
            onPick={(provider) => pushScreen({ type: "providerPay", provider })}
          />
        );
        if (s.type === "providerPay") return (
          <ProviderPayScreen key={i} C={C} provider={s.provider}
            onBack={popScreen}
            onNext={(p) => pushScreen({
              type: "genericConfirm",
              payload: {
                subtitle: p.provider,
                amountStr: `${fmtFull(p.amount)} ₸`,
                rows: [
                  { label: "Поставщик", value: p.provider },
                  { label: "Лицевой счёт", value: p.accountNum },
                  { label: "Комиссия", value: "Без комиссии" },
                ],
                success: { title: "Успешно", message: "Платёж выполнен", amountStr: `${fmtFull(p.amount)} ₸`, note: p.provider },
              },
            })}
          />
        );
        if (s.type === "templatePay") return (
          <TemplatePayScreen key={i} C={C} template={s.template}
            onBack={popScreen}
            onConfirm={(p) => pushScreen({
              type: "flowSuccess",
              payload: { title: "Успешно", message: "Платёж по шаблону выполнен", amountStr: `${fmtFull(p.amount)} ₸`, note: p.template.title },
            })}
          />
        );
        if (s.type === "genericConfirm") return (
          <GenericConfirmScreen key={i} C={C}
            subtitle={s.payload.subtitle}
            amountStr={s.payload.amountStr}
            rows={s.payload.rows}
            onBack={popScreen}
            onConfirm={() => pushScreen({ type: "flowSuccess", payload: s.payload.success })}
          />
        );
        if (s.type === "flowSuccess") return (
          <SuccessScreen key={i} C={C}
            title={s.payload.title}
            message={s.payload.message}
            amountStr={s.payload.amountStr}
            note={s.payload.note}
            onDone={() => setNavStack([])}
          />
        );
        if (s.type === "chatThread") return (
          <ChatThreadScreen key={i} C={C} onBack={popScreen} />
        );
        if (s.type === "decor") return (
          <DecorScreen key={i} C={C} onBack={popScreen} />
        );
        if (s.type === "about") return (
          <AboutBankScreen key={i} C={C} onBack={popScreen} />
        );
        if (s.type === "profileQr") return (
          <ProfileQrScreen key={i} C={C} onBack={popScreen} />
        );
        if (s.type === "esim") return (
          <EsimScreen key={i} C={C} onBack={popScreen}
            onBuy={(pkg) => pushScreen({
              type: "flowSuccess",
              payload: { title: "eSIM оплачена", message: "QR-код для активации придёт в уведомления и на email в течение минуты", amountStr: `${fmtFull(pkg.price)} ₸`, note: `${pkg.region} · ${pkg.data} · ${pkg.days} дней` },
            })}
          />
        );
        if (s.type === "aviata") return (
          <AviataScreen key={i} C={C} onBack={popScreen}
            onBuy={(flight) => pushScreen({
              type: "flowSuccess",
              payload: { title: "Билет куплен", message: "Маршрутная квитанция придёт на email", amountStr: `${fmtFull(flight.price)} ₸`, note: `${flight.carrier} · ${flight.from} → ${flight.to} · 24 июня` },
            })}
          />
        );
        if (s.type === "profileInfo") return (
          <ProfileInfoScreen key={i} C={C} featureFlags={featureFlags} onBack={popScreen} />
        );
        if (s.type === "security") return (
          <SecurityScreen key={i} C={C} featureFlags={featureFlags} onBack={popScreen} />
        );
        if (s.type === "devices") return (
          <DevicesScreen key={i} C={C} onBack={popScreen} />
        );
        if (s.type === "language") return (
          <LanguageScreen key={i} C={C} onBack={popScreen} />
        );
        if (s.type === "phoneTransfer") return (
          <PhoneTransferScreen key={i} C={C}
            onBack={popScreen}
            onNext={(payload) => pushScreen({ type: "phoneConfirm", payload })}
          />
        );
        if (s.type === "phoneConfirm") return (
          <PhoneConfirmScreen key={i} C={C} payload={s.payload}
            onBack={popScreen}
            onConfirm={() => pushScreen({ type: "phoneResult", payload: s.payload })}
          />
        );
        if (s.type === "phoneResult") return (
          <SuccessScreen key={i} C={C}
            title="Успешно"
            message="Перевод выполнен"
            amountStr={`${fmtFull(s.payload.amount)} ₸`}
            note={`${s.payload.contact.name} ${s.payload.contact.surname} · ${s.payload.contact.phone}`}
            onDone={() => setNavStack([])}
          />
        );
        if (s.type === "conversion") return (
          <ConversionScreen key={i} C={C}
            onBack={popScreen}
            onNext={(payload) => pushScreen({ type: "conversionResult", payload })}
          />
        );
        if (s.type === "conversionResult") return (
          <SuccessScreen key={i} C={C}
            title="Успешно"
            message="Обмен выполнен"
            amountStr={`${fmtFull(s.payload.amountTo)} ${CURRENCY_META[s.payload.to]?.symbol || s.payload.to}`}
            note={`Продажа ${fmtFull(s.payload.amountFrom)} ${s.payload.from} по курсу ${s.payload.rate >= 1 ? s.payload.rate.toFixed(2) : s.payload.rate.toFixed(4)}`}
            onDone={() => setNavStack([])}
          />
        );
        if (s.type === "notifications") return (
          <NotificationsScreen key={i} C={C} emptyState={emptyState} onBack={popScreen} />
        );
        if (s.type === "newsList") return (
          <NewsListScreen key={i} C={C} onBack={popScreen}
            onOpenDetail={(news) => pushScreen({ type: "newsDetail", news })}
          />
        );
        if (s.type === "newsDetail") return (
          <NewsDetailScreen key={i} news={s.news} C={C} onBack={popScreen} />
        );
        if (s.type === "depositCalc") return (
          <DepositCalcScreen key={i} C={C}
            onBack={popScreen}
            onNext={(payload) => pushScreen({ type: "depositReview", payload })}
          />
        );
        if (s.type === "depositReview") return (
          <DepositReviewScreen key={i} C={C} payload={s.payload}
            onBack={popScreen}
            onConfirm={() => pushScreen({ type: "depositResult", payload: s.payload })}
          />
        );
        if (s.type === "depositResult") return (
          <SuccessScreen key={i} C={C}
            title="Успешно"
            message="Депозит открыт"
            amountStr={`${fmtFull(s.payload.amount)} ${CURRENCY_META[s.payload.currency]?.symbol || s.payload.currency}`}
            note={`${s.payload.rate.toFixed(1)}% годовых · ${s.payload.term} мес · ${s.payload.period === "monthly" ? "ежемесячно" : "в конце"}`}
            onDone={() => setNavStack([])}
          />
        );
        return null;
      })}
      <BottomTabBar
        active={activeTab}
        onChange={(k) => { setActiveTab(k); setNavStack([]); }}
        C={C}
      />
      {/* Bottom sheets: promo (real MarketingBannerSheet), top-up, logout */}
      {sheet?.type === "promo" && (
        <BottomSheetModal C={C} onClose={() => setSheet(null)}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>{sheet.promo.title}</div>
          {sheet.promo.subtitle && <div style={{ fontSize: 14, fontWeight: 600, color: C.sub, marginBottom: 6 }}>{sheet.promo.subtitle}</div>}
          <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.55, marginBottom: 20 }}>
            {sheet.promo.body}. Предложение действует для всех клиентов банка — оформление займёт пару минут прямо в приложении.
          </div>
          <div data-press onClick={() => setSheet(null)} style={{
            backgroundColor: C.accentDark, borderRadius: 12, padding: "15px 0",
            textAlign: "center", cursor: "pointer", marginBottom: 10,
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>{sheet.promo.cta}</span>
          </div>
          <div data-press onClick={() => setSheet(null)} style={{
            backgroundColor: C.faint, borderRadius: 12, padding: "15px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Неинтересно</span>
          </div>
        </BottomSheetModal>
      )}
      {sheet?.type === "topup" && (
        <BottomSheetModal C={C} onClose={() => setSheet(null)}>
          <TopUpSheetContent C={C} card={sheet.card} displayCurrency={displayCurrency}
            onPickOwn={(srcCard) => {
              const card = sheet.card; setSheet(null);
              pushScreen({ type: "topupAmount", card, source: { kind: "own", srcCard } });
            }}
            onPickExternal={(tok) => {
              const card = sheet.card; setSheet(null);
              pushScreen({ type: "topupAmount", card, source: { kind: "external", tok } });
            }}
            onPickVariant={(v) => {
              const card = sheet.card; setSheet(null);
              if (v.kind === "tn") pushScreen({ type: "tnOrder", card, variant: v });
              else if (v.kind === "requisites") pushScreen({ type: "requisites", card });
              else if (v.kind === "applePay") pushScreen({ type: "topupAmount", card, source: { kind: "applePay" } });
            }}
          />
        </BottomSheetModal>
      )}
      {sheet?.type === "logout" && (
        <BottomSheetModal C={C} onClose={() => setSheet(null)}>
          {/* real logoutTitle / logoutSubtitle */}
          <div style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 10, lineHeight: 1.3 }}>
            Подтвердите смену пользователя приложения на данном устройстве
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.55, marginBottom: 20 }}>
            Смена пользователя позволит вам зайти под другим клиентом — для этого придётся заново
            пройти авторизацию устройства по биометрии
          </div>
          <div data-press onClick={() => { setSheet(null); setNavStack([]); setActiveTab("products"); setLocked(true); }} style={{
            backgroundColor: "#EF4444", borderRadius: 12, padding: "15px 0",
            textAlign: "center", cursor: "pointer", marginBottom: 10,
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Сменить пользователя</span>
          </div>
          <div data-press onClick={() => setSheet(null)} style={{
            backgroundColor: C.faint, borderRadius: 12, padding: "15px 0",
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Отмена</span>
          </div>
        </BottomSheetModal>
      )}
      {/* Real app behavior: AuthPin lock on launch */}
      {locked && <LockScreen onUnlock={() => setLocked(false)} />}
      {/* Pre-auth onboarding — sibling overlay, gated by `onb` flag (как LockScreen) */}
      {onb && (
        <OnboardingFlow
          C={C}
          initial={onb}
          onComplete={() => { setOnb(null); setLocked(false); setActiveTab("products"); }}
        />
      )}
    </>
  );
}

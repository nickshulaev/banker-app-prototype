import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Bell, Plus, ChevronRight, ChevronDown, X, ArrowLeftRight, MessageCircle, BarChart3, Wallet, TrendingUp, Star, Clock, CreditCard, Newspaper, LayoutList, LayoutGrid, Smartphone, Plane, Sofa, Zap, Phone, Globe, QrCode, Repeat, Send, Landmark, Tv, Bus, GraduationCap, Eye, EyeOff, ArrowLeft, ArrowDownLeft, Snowflake, FileText, ShoppingCart, Utensils, Fuel, Wifi, Home, Ticket, Settings2, Check, User, Shield, LogOut, Palette } from "lucide-react";

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
  { id: 1, name: "Константин", surname: "К.", initials: "К", color: "#22C55E" },
  { id: 2, name: "Иван", surname: "В.", initials: "И", color: "#3B82F6" },
  { id: 3, name: "Виктор", surname: "Д.", initials: "В", color: "#8B5CF6" },
  { id: 4, name: "Умар", surname: "Д.", initials: "У", color: "#F59E0B" },
  { id: 5, name: "Ирина", surname: "У.", initials: "И", color: "#EC4899" },
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
      { id: "superpickle", name: "SuperPickle", last4: "0088", primaryBalance: 897691.32, primaryCurrency: "USD",
        breakdown: [
          { currency: "KZT", amount: 35251706.16 },
          { currency: "USD", amount: 113324.68 },
          { currency: "KRW", amount: 30268.06 },
        ], color: "#84CC16", visual: "pickle", fcBalance: 409.18,
      },
      { id: "invest-prestige", name: "Invest Prestige Card", sub: "D75003 — Freedom24", last4: "0011",
        primaryBalance: 122683.74, primaryCurrency: "USD", breakdown: [], color: "#1E1B4B",
        visual: "prestige", fcBalance: 87.42,
      },
      { id: "harvey-queen", name: "Supercard Harvey Queen", last4: "0088", primaryBalance: 1069.42, primaryCurrency: "USD",
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
      { id: "ru-card", name: "Ru Card", last4: "1222", primaryBalance: 1699039.81, primaryCurrency: "USD",
        breakdown: [
          { currency: "KZT", amount: 1577523.88 },
          { currency: "USD", amount: 29258.06 },
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
  KRW: { symbol: "₩", flag: "🇰🇷", name: "Вона" },
  TRY: { symbol: "₺", flag: "🇹🇷", name: "Лира" },
};

const RATES_TO_KZT = { KZT: 1, USD: 455.0, EUR: 495.0, RUB: 5.1, KRW: 0.33, TRY: 12.5 };

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

function AccountHero({ account, C }) {
  const cm = CURRENCY_META[account.currency] || { symbol: account.currency, flag: "💰" };
  const ibanTail = account.number.replace(/\s/g, '').slice(-6);

  return (
    <div data-press style={{
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

function BottomSheet({ theme, setTheme, onClose, blockVis, setBlockVis, blockOrder, setBlockOrder, emptyState, setEmptyState, featureFlags, setFeatureFlags, C }) {
  const isDark = C.bg === '#0E0F0C';
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

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.35)", zIndex: 200 }} />
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, zIndex: 201,
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

function SectionHeader({ title, action, onAdd, onToggleView, viewMode, C }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: 12,
    }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: -0.2 }}>{title}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {action && <span data-press style={{ fontSize: 13, color: C.text, fontWeight: 500, cursor: "pointer", opacity: 0.7, marginRight: 4 }}>{action}</span>}
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
  featureFlags, onOpenCard, onOpenTotal, onOpenRequest, onOpenProfile, onOpenDeposit,
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
        <div data-press onClick={() => onOpenTotal?.()} style={{
          fontSize: 40, fontWeight: 700, color: C.text,
          letterSpacing: -1.5, fontFeatureSettings: "'tnum'", lineHeight: 1,
          cursor: "pointer", display: "inline-block",
        }}>
          {fmtInt(totalDisplay)}<span style={{ fontSize: 22, fontWeight: 600, color: C.muted, marginLeft: 6 }}>{displayMeta.symbol}</span>
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
        <div data-press style={{
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
          <SectionHeader title="Переводы" action={!emptyState ? "Все" : null} C={C} />
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
        <div data-press style={{
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
            <div key={s.id} data-press style={{
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
            { id: "esim", title: "eSIM", subtitle: "Интернет в поездках", Icon: Smartphone, color: "#22C55E" },
            ...(featureFlags.aviata ? [{ id: "travel", title: "Авиабилеты", subtitle: "Поиск и покупка", Icon: Plane, color: "#3B82F6" }] : []),
            { id: "lounge", title: "Lounge", subtitle: "Залы в аэропортах", Icon: Sofa, color: "#A78BFA", soon: true },
            { id: "fasttrack", title: "Fast Track", subtitle: "Без очереди", Icon: Zap, color: "#F59E0B", soon: true },
          ].map(s => (
            <div key={s.id} data-press style={{
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
                    <AccountHero key={acc.id} account={acc} C={C} />
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
                      <div key={acc.id} data-press style={{
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
                      <div key={loan.id} data-press style={{
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
                      <div key={cr.id} data-press style={{
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
                    <div key={dep.id} data-press style={{
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
                        <div key={acc.id} data-press style={{
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

function PaymentsScreen({ C, featureFlags, onOpenStub, onTransferOwn, onRequestMoney }) {
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
              <div key={t.id} data-press onClick={onOpenStub} style={{
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
            <Row Icon={ArrowLeftRight} color="#F59E0B" title="Конвертация валют" subtitle={`1$ = ${RATES_TO_KZT.USD}₸ · 1€ = ${RATES_TO_KZT.EUR}₸`} last />
          ) : (
            <Row Icon={ArrowLeftRight} color="#F59E0B" title="Конвертация валют" last />
          )}
        </Section>

        {/* Другим (othersTransfersSection) */}
        <Section title="Другим">
          {featureFlags.toPhoneNumber && (
            <Row Icon={Phone} color="#22C55E" title="По номеру телефона" subtitle="Внутри банка и за его пределами" />
          )}
          <Row Icon={Landmark} color="#0D9488" title="Внутри Банка" subtitle="На карту или счет" />
          <Row Icon={CreditCard} color="#3B82F6" title="По номеру карты" subtitle="Visa или Mastercard" />
          <Row Icon={FileText} color="#8B5CF6" title="По номеру счета" subtitle="IBAN-перевод" />
          {featureFlags.paySwift && (
            <Row Icon={Globe} color="#06B6D4" title="Переводом SWIFT" subtitle="В любую страну" />
          )}
          {featureFlags.moneyRequest && (
            <Row Icon={Send} color="#EC4899" title="Запросить" subtitle="У клиента банка" onClick={onRequestMoney} />
          )}
          <Row Icon={TrendingUp} color="#F59E0B" title="На брокерский счёт" subtitle="Freedom Broker" last />
        </Section>

        {/* Оплата услуг (paymentsSection) */}
        <Section title="Оплата услуг">
          <Row Icon={QrCode} color="#22C55E" title="Оплата по QR или штрихкоду" />
          {PAYMENT_CATEGORIES.map((cat, i) => (
            <Row key={cat.id} Icon={cat.Icon} color={cat.color} title={cat.title} last={i === PAYMENT_CATEGORIES.length - 1} />
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

function ProductDetailsScreen({ card, C, featureFlags, onBack, onTransfer, onOpenTransaction }) {
  const [panVisible, setPanVisible] = useState(false);
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
          { Icon: Plus, label: "Пополнить" },
          { Icon: Send, label: "Перевести", onClick: onTransfer },
          { Icon: FileText, label: "Реквизиты" },
          { Icon: Snowflake, label: "Заморозить" },
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
            <span data-press style={{ fontSize: 13, color: C.text, fontWeight: 500, cursor: "pointer", opacity: 0.7 }}>Все</span>
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
              { Icon: Settings2, title: "Лимиты по карте" },
              { Icon: CreditCard, title: "Сменить ПИН-код" },
              { Icon: FileText, title: "Реквизиты счёта" },
            ].map((r, i, arr) => (
              <div key={i} data-press style={{
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
  const spent = TRANSACTIONS.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const income = TRANSACTIONS.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  // Категории расходов (real totalTransactionsDetails)
  const byCategory = {};
  TRANSACTIONS.filter(t => t.amount < 0).forEach(t => {
    if (!byCategory[t.category]) byCategory[t.category] = { sum: 0, Icon: t.Icon, color: t.color };
    byCategory[t.category].sum += Math.abs(t.amount);
  });
  const categories = Object.entries(byCategory).sort((a, b) => b[1].sum - a[1].sum);
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
            <span data-press style={{ fontSize: 13, color: C.text, fontWeight: 500, cursor: "pointer", opacity: 0.7 }}>Настроить</span>
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

function TransactionDetailsScreen({ tx, C, featureFlags, onBack, onSplit }) {
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
          <div data-press style={{
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

function SettingsScreen({ C, onBack }) {
  const [hideAmount, setHideAmount] = useState(false);
  const isDark = C.bg === '#0E0F0C';

  const Row = ({ Icon, color, title, subtitle, last, danger, toggle, toggleOn, onToggle }) => (
    <div data-press={!toggle ? true : undefined} onClick={!toggle ? () => {} : undefined} style={{
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
          <div data-press style={{
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
          <Row Icon={User} color="#22C55E" title="Профиль" subtitle="Телефон, почта, документы..." />
          <Row Icon={Shield} color="#3B82F6" title="Безопасность" subtitle="Пароли, системные настройки" />
          <Row Icon={Bell} color="#F59E0B" title="Центр уведомлений" subtitle="Push, SMS и настройки" />
          <Row Icon={Smartphone} color="#8B5CF6" title="Устройства" last />
        </Section>

        {/* Сервисы */}
        <Section>
          <Row Icon={FileText} color="#0D9488" title="Заказ справок" subtitle="Для оформления визы и в налоговую" />
          <Row Icon={Plane} color="#3B82F6" title="Путешествия" subtitle="Авиабилеты, горящие туры, пассажиры" last />
        </Section>

        {/* Оформление */}
        <Section>
          <Row Icon={EyeOff} color="#64748B" title="Скрывать баланс" subtitle="При перевороте телефона"
            toggle toggleOn={hideAmount} onToggle={() => setHideAmount(v => !v)} />
          <Row Icon={Palette} color="#EC4899" title="Оформление" subtitle="Приветствие, звуки и вибрация" />
          <Row Icon={Globe} color="#06B6D4" title="Язык" subtitle="Русский" last />
        </Section>

        {/* Банк */}
        <Section>
          <Row Icon={Landmark} color="#64748B" title="О Банке" subtitle="Адреса, телефоны, отделения..." />
          <Row Icon={Phone} color="#22C55E" title="Связаться с Банком" subtitle="В чате или по телефону" last />
        </Section>

        {/* Logout */}
        <Section>
          <Row Icon={LogOut} color="#EF4444" title="Сменить пользователя" danger last />
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
      `}</style>
      {debugOpen && (
        <BottomSheet
          theme={theme} setTheme={setTheme}
          onClose={() => setDebugOpen(false)}
          blockVis={blockVis} setBlockVis={setBlockVis}
          blockOrder={blockOrder} setBlockOrder={setBlockOrder}
          emptyState={emptyState} setEmptyState={setEmptyState}
          featureFlags={featureFlags} setFeatureFlags={setFeatureFlags}
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
          C={C} theme={theme}
        />
      )}
      {activeTab === "payments" && (
        <PaymentsScreen C={C} featureFlags={featureFlags}
          onOpenStub={() => {}}
          onTransferOwn={() => pushScreen({ type: "transferOwn" })}
          onRequestMoney={() => pushScreen({ type: "requestCreate" })}
        />
      )}
      {activeTab === "statistics" && (
        <StatisticsScreen C={C}
          onOpenTransaction={(tx) => pushScreen({ type: "transaction", tx })}
        />
      )}
      {activeTab === "chats" && (
        <StubScreen C={C} title="Чаты"
          note="Реальный таб управляется флагами chat / typiChat — чат с банком или контакты." />
      )}
      {navStack.map((s, i) => {
        if (s.type === "product") return (
          <ProductDetailsScreen key={i} card={s.card} C={C} featureFlags={featureFlags}
            onBack={popScreen}
            onTransfer={() => pushScreen({ type: "transferOwn" })}
            onOpenTransaction={(tx) => pushScreen({ type: "transaction", tx })}
          />
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
          <SettingsScreen key={i} C={C} onBack={popScreen} />
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
    </>
  );
}

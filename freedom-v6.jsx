import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Bell, Plus, ChevronRight, ChevronDown, X, ArrowLeftRight, MessageCircle, BarChart3, Wallet, TrendingUp, Star, Clock, CreditCard } from "lucide-react";

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
        ], color: "#84CC16",
      },
      { id: "invest-prestige", name: "Invest Prestige Card", sub: "D75003 — Freedom24", last4: "0011",
        primaryBalance: 122683.74, primaryCurrency: "USD", breakdown: [], color: "#1E1B4B",
      },
      { id: "harvey-queen", name: "Supercard Harvey Queen", last4: "0088", primaryBalance: 1069.42, primaryCurrency: "USD",
        breakdown: [
          { currency: "USD", amount: 251709.36 },
          { currency: "KZT", amount: 528.06 },
          { currency: "TRY", amount: 420.23 },
        ], color: "#F472B6",
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
        ], color: "#0D9488",
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
  { id: "c1", name: "Кредит на дом мечты", payoffDate: "31.10.2025", monthly: 12089.09, currency: "KZT", rate: 4.97 },
  { id: "c2", name: "Машина", payoffDate: "01.02.2027", monthly: 223940.00, currency: "KZT", rate: 14.03 },
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
  { bank: "Freedom KZ", cards: [{ id: "first-card", name: "DepositCard", last4: "4521", primaryBalance: 0, primaryCurrency: "KZT", breakdown: [], color: "#22C55E" }] },
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
  { key: "products", label: "Продукты" },
  { key: "cta", label: "CTA" },
];

/* ═══════════════════════════════════════════════
   CARD ART — flat, simple
   ═══════════════════════════════════════════════ */

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

function BottomSheet({ theme, setTheme, onClose, blockVis, setBlockVis, blockOrder, setBlockOrder, emptyState, setEmptyState, C }) {
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

function SectionHeader({ title, action, onAdd, C }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: 12,
    }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: -0.2 }}>{title}</span>
      {action && <span data-press style={{ fontSize: 13, color: C.text, fontWeight: 500, cursor: "pointer", opacity: 0.7 }}>{action}</span>}
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
  C, theme,
}) {
  const isDark = C.bg === '#0E0F0C';
  const totalDisplay = convertTo(totalInKZT, displayCurrency);
  const displayMeta = CURRENCY_META[displayCurrency] || { symbol: displayCurrency };
  const availableCurrencies = Object.keys(CURRENCY_META).filter(c => ["KZT","USD","EUR","RUB"].includes(c));

  const [promoIndex, setPromoIndex] = useState(0);
  const [requestIndex, setRequestIndex] = useState(0);

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100dvh",
      backgroundColor: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif",
      overflowX: "hidden", position: "relative",
      paddingBottom: 80,
    }}>
      {pickerOpen && (
        <CurrencyPicker current={displayCurrency} currencies={availableCurrencies}
          onSelect={setDisplayCurrency} onClose={() => setPickerOpen(false)} C={C} />
      )}

      <StatusBar C={C} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 0" }}>
        <div onClick={onAvatarClick} data-press style={{
          width: 36, height: 36, borderRadius: "50%",
          backgroundColor: C.accentDark,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: C.accent, cursor: "pointer",
        }}>НШ</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div data-press style={{
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
        <div style={{
          fontSize: 40, fontWeight: 700, color: C.text,
          letterSpacing: -1.5, fontFeatureSettings: "'tnum'", lineHeight: 1,
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

      {/* ═══ REQUESTS ═══ */}
      {blockVis.requests && activeRequests.length > 0 && (
      <div style={{ order: blockOrder.indexOf("requests"), padding: "0 20px 16px" }}>
        <div data-press style={{
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

      {/* ═══ PROMO ═══ */}
      {blockVis.promo && activePromos.length > 0 && (
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

      {/* ═══ NEWS ═══ */}
      {blockVis.news && (
      <div style={{ order: blockOrder.indexOf("news"), padding: "0 20px 24px" }}>
        <div data-press style={{
          backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, padding: "16px 18px",
          cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#DC2626",
              padding: "3px 8px", borderRadius: 4,
              backgroundColor: "rgba(220,38,38,0.08)",
              textTransform: "uppercase", letterSpacing: 0.4,
            }}>{activeNews.tag}</span>
            <span style={{ fontSize: 11, color: C.muted }}>{activeNews.time}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.35, marginBottom: 6 }}>
            {activeNews.title}
          </div>
          {activeNews.subtitle && (
            <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.4 }}>{activeNews.subtitle}</div>
          )}
        </div>
      </div>
      )}

      {/* ═══ PRODUCTS ═══ */}
      {blockVis.products && (
      <div style={{ order: blockOrder.indexOf("products"), padding: "0 20px 24px" }}>
        {/* Tab bar */}
        <div style={{
          display: "flex", gap: 24, marginBottom: 24,
          borderBottom: `1px solid ${C.divider}`,
        }}>
          {[
            { key: "bank", label: "Банк" },
            { key: "deposits", label: "Депозиты" },
            { key: "broker", label: "Брокер" },
          ].map(tab => {
            const active = productTab === tab.key;
            return (
              <div key={tab.key} onClick={() => setProductTab(tab.key)} style={{
                padding: "10px 0", cursor: "pointer",
                fontSize: 14, fontWeight: 600,
                color: active ? C.text : C.muted,
                borderBottom: active ? `2px solid ${C.text}` : "2px solid transparent",
                marginBottom: -1,
              }}>{tab.label}</div>
            );
          })}
        </div>

        {/* ─── BANK TAB ─── */}
        {productTab === "bank" && (
          <div>
            {/* Card groups */}
            {activeCardProducts.map((group, gi) => (
              <div key={gi} style={{ marginBottom: 28 }}>
                <SectionHeader title={group.bank} onAdd={() => {}} C={C} />
                <div style={{
                  backgroundColor: C.card, borderRadius: 12,
                  border: `1px solid ${C.border}`, overflow: "hidden",
                }}>
                  {group.cards.map((card, ci) => {
                    const cm = CURRENCY_META[card.primaryCurrency] || { symbol: card.primaryCurrency };
                    const subtitle = card.sub
                      || (card.breakdown.length > 0
                        ? `${card.breakdown.length + 1} валют${card.breakdown.length + 1 === 1 ? "а" : card.breakdown.length + 1 < 5 ? "ы" : ""}`
                        : `•• ${card.last4}`);
                    return (
                      <div key={card.id} data-press style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "16px", cursor: "pointer",
                        borderBottom: ci < group.cards.length - 1 ? `1px solid ${C.divider}` : "none",
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

            {/* Accounts */}
            <div style={{ marginBottom: 28 }}>
              <SectionHeader title="Счета" onAdd={() => {}} C={C} />
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
              ) : (
                <div style={{
                  backgroundColor: C.card, borderRadius: 12,
                  border: `1px solid ${C.border}`, overflow: "hidden",
                }}>
                  {activeAccounts.map((acc, i) => {
                    const cm = CURRENCY_META[acc.currency] || { symbol: acc.currency, flag: "💰", name: acc.currency };
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

            {/* Loans */}
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

            {/* Credits */}
            <div>
              <SectionHeader title="Кредиты" onAdd={() => {}} C={C} />
              {activeCredits.length === 0 ? (
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
                        display: "flex", alignItems: "center", gap: 12,
                      }}>
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

      {/* ═══ CTA ═══ */}
      {blockVis.cta && (
      <div style={{ order: blockOrder.indexOf("cta"), padding: "0 20px 32px" }}>
        <div data-press style={{
          backgroundColor: C.accentDark, borderRadius: 12, padding: "14px 0",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>Новая карта или продукт</span>
        </div>
      </div>
      )}

      {/* ═══ BOTTOM TAB BAR ═══ */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        maxWidth: 430, margin: "0 auto",
        backgroundColor: C.bg,
        borderTop: `1px solid ${C.divider}`,
        padding: "10px 0 24px",
        display: "flex", justifyContent: "space-around",
        zIndex: 50,
      }}>
        {[
          { Icon: Wallet, label: "Продукты", active: true },
          { Icon: BarChart3, label: "Статистика" },
          { Icon: ArrowLeftRight, label: "Переводы" },
          { Icon: MessageCircle, label: "Чаты" },
        ].map((tab, i) => (
          <div key={i} data-press style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            cursor: "pointer", flex: 1,
          }}>
            <tab.Icon size={22} color={tab.active ? C.text : C.muted} strokeWidth={tab.active ? 2.2 : 1.7} />
            <span style={{
              fontSize: 10, fontWeight: tab.active ? 600 : 500,
              color: tab.active ? C.text : C.muted,
            }}>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
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
      {debugOpen && (
        <BottomSheet
          theme={theme} setTheme={setTheme}
          onClose={() => setDebugOpen(false)}
          blockVis={blockVis} setBlockVis={setBlockVis}
          blockOrder={blockOrder} setBlockOrder={setBlockOrder}
          emptyState={emptyState} setEmptyState={setEmptyState}
          C={C}
        />
      )}
      <MainScreen
        onAvatarClick={() => setDebugOpen(true)}
        displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency}
        pickerOpen={pickerOpen} setPickerOpen={setPickerOpen}
        totalInKZT={totalInKZT}
        productTab={productTab} setProductTab={setProductTab}
        blockVis={blockVis} blockOrder={blockOrder}
        emptyState={emptyState}
        activeCardProducts={activeCardProducts}
        activeAccounts={activeAccounts}
        activeLoans={activeLoans}
        activeCredits={activeCredits}
        activePromos={activePromos}
        activeNews={activeNews}
        activeRequests={activeRequests}
        C={C} theme={theme}
      />
    </>
  );
}

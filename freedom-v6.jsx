import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ArrowLeftRight, Phone, CreditCard, Globe, TrendingUp, DollarSign, Star, Shield, BarChart3, Newspaper, ShoppingCart, Utensils, Fuel, Home, Wallet, Send as SendIcon, Plane } from "lucide-react";

/* ─── Pressable helper ─── */
function usePressable() {
  const [pressed, setPressed] = useState(false);
  const handlers = {
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
  };
  return { pressed, handlers };
}

/* ─── Data ─── */
const RAW_ACCOUNTS = [
  { product: "DepositCard R VISA Rew", last4: "4521", currency: "KZT", balance: 1350320.50 },
  { product: "DepositCard R VISA Rew", last4: "4521", currency: "USD", balance: 412.80 },
  { product: "DepositCARD MC WE Rez7val VIP", last4: "4357", currency: "USD", balance: 523.15 },
  { product: "Business Premium Card", last4: "6608", currency: "KZT", balance: 387640.00 },
  { product: "Business Premium Card", last4: "0120", currency: "KZT", balance: 52100.00 },
  { product: "DepositCARD MCWorld Rez7val", last4: "3674", currency: "KZT", balance: 164230.45 },
  { product: "Deposit card DC ZP 0 Premium", last4: "4787", currency: "KZT", balance: 89410.20 },
  { product: "Инвестиционная карта Global", last4: "1862", currency: "USD", balance: 358.42 },
  { product: "Инвестиционная карта Global", last4: "1862", currency: "KZT", balance: 30649.22 },
  { product: "Инвестиционная карта Global", last4: "1862", currency: "EUR", balance: 185.16 },
  { product: "Инвестиционная карта TFOS", last4: "0160", currency: "USD", balance: 86.50 },
  { product: "Инвестиционная карта TFOS", last4: "0160", currency: "RUB", balance: 12340.75 },
  { product: "Инвестиционная карта Global", last4: "9201", currency: "KZT", balance: 15800.00 },
  { product: "DepositCARD MCWorld Rez7val", last4: "3674", currency: "FREEDOM", balance: 12 },
  { product: "EcoCard MC World Unlim", last4: "0426", currency: "USD", balance: 3.00 },
  { product: "Deposit card DC ZP 0 Premium", last4: "4787", currency: "KZT", balance: 42710.55 },
];

const CARDS = [
  { id: 1, name: "DepositCard VISA Rew", last4: "4521", network: "visa", frozen: false },
  { id: 2, name: "MC WE Rez7val VIP", last4: "4357", network: "mc", frozen: false },
  { id: 3, name: "Business Premium", last4: "6608", network: "mc", frozen: false },
  { id: 4, name: "Инвест Global", last4: "1862", network: "visa", frozen: false },
  { id: 5, name: "Инвест TFOS", last4: "0160", network: "visa", frozen: false },
  { id: 6, name: "EcoCard Unlim", last4: "0426", network: "mc", frozen: true },
  { id: 7, name: "DC ZP Premium", last4: "4787", network: "visa", frozen: false },
  { id: 8, name: "MCWorld Rez7val", last4: "3674", network: "mc", frozen: false },
  { id: 9, name: "Business Premium", last4: "0120", network: "visa", frozen: false },
  { id: 10, name: "Инвест Global", last4: "9201", network: "visa", frozen: false },
];

const CARD_NET = Object.fromEntries(CARDS.map(c => [c.last4, c.network]));

const STORIES = [
  { id: 1, title: "FC кэшбэк", Icon: Star, viewed: false, bg: "linear-gradient(135deg, #F59E0B, #EF4444)" },
  { id: 2, title: "Invest Card", Icon: CreditCard, viewed: false, bg: "linear-gradient(135deg, #6366F1, #A855F7)" },
  { id: 3, title: "Страхование", Icon: Shield, viewed: true, bg: "linear-gradient(135deg, #0AB321, #06B6D4)" },
  { id: 4, title: "Тарифы", Icon: BarChart3, viewed: true, bg: "linear-gradient(135deg, #3B82F6, #6366F1)" },
  { id: 5, title: "Новости", Icon: Newspaper, viewed: true, bg: "linear-gradient(135deg, #EC4899, #F59E0B)" },
];

/* ─── FRHC / Freedom Currency mock data ─── */
const FRHC_PRICE = 194;
const FRHC_CHANGE = 12.4; // % за месяц

const WEEK_SPEND_KZT = [15200, 8500, 22100, 12800, 0, 0, 0];
const WEEK_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const TODAY_INDEX = 3;

const NEWS = [
  { id: 1, featured: true, title: "Freedom Bank запускает мультивалютные переводы без комиссии", subtitle: "Новый тарифный план для премиум-клиентов с моментальными переводами в 12 валютах", time: "2ч назад", tag: "Срочное" },
  { id: 2, featured: false, title: "Изменение базовых ставок по депозитам с 1 апреля", time: "5ч назад" },
  { id: 3, featured: false, title: "Техническое обслуживание: плановые работы в ночь с 5 на 6 марта", time: "Вчера" },
];

const CURRENCY_META = {
  KZT: { symbol: "₸", flag: "🇰🇿", color: "#22C55E", name: "Тенге" },
  USD: { symbol: "$", flag: "🇺🇸", color: "#3B82F6", name: "Доллар" },
  EUR: { symbol: "€", flag: "🇪🇺", color: "#A78BFA", name: "Евро" },
  RUB: { symbol: "₽", flag: "🇷🇺", color: "#F59E0B", name: "Рубль" },
  FREEDOM: { symbol: "F", flag: "⭐", color: "#64748B", name: "Freedom" },
};

const DEPOSITS = [
  { id: 1, name: 'Депозит "КОПИЛКА" новый', closingDate: "10 Mar 2026", rate: 9.2, currency: "KZT", balance: 452145.41 },
  { id: 2, name: 'Депозит "КОПИЛКА" новый', closingDate: "03 Feb 2027", rate: 1.0, currency: "USD", balance: 115700.60 },
  { id: 3, name: 'Депозит "КОПИЛКА" новый', closingDate: "07 Dec 2026", rate: 16.0, currency: "KZT", balance: 18621557.07 },
  { id: 4, name: 'Депозит "КОПИЛКА" новый', closingDate: "31 May 2027", rate: 0.8, currency: "EUR", balance: 51658.01 },
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

// Approximate rates to KZT for display conversion
const RATES_TO_KZT = {
  KZT: 1,
  USD: 455.0,
  EUR: 495.0,
  RUB: 5.1,
  FREEDOM: 100.0,
};

function fmtCompact(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toFixed(2);
}
function fmtFull(n) {
  return n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function convertTo(amountInKZT, targetCurrency) {
  const rate = RATES_TO_KZT[targetCurrency] || 1;
  return amountInKZT / rate;
}

/* ─── Stories ─── */
function StoryItem({ s }) {
  const { pressed, handlers } = usePressable();
  return (
    <div {...handlers} style={{ flexShrink: 0, width: 68, cursor: "pointer", opacity: pressed ? 0.7 : 1, transition: "opacity 0.1s" }}>
      <div style={{
        width: 68, height: 68, borderRadius: 20,
        border: s.viewed ? "1.5px solid #334155" : "1.5px solid #22C55E",
        padding: 2, boxSizing: "border-box",
      }}>
        <div style={{
          width: "100%", height: "100%", borderRadius: 12, background: s.bg || "linear-gradient(135deg, #1E293B, #334155)",
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}><s.Icon size={24} color="#fff" strokeWidth={2} /></div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 500, color: s.viewed ? "#64748B" : "#94A3B8", textAlign: "center", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {s.title}
      </div>
    </div>
  );
}

function StoriesRow() {
  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 20px", scrollbarWidth: "none" }}>
      {STORIES.map(s => (
        <StoryItem key={s.id} s={s} />
      ))}
    </div>
  );
}

/* ─── Currency Wallet ─── */
function CurrencyWallet({ code, total, accounts, isOpen, onToggle }) {
  const meta = CURRENCY_META[code] || { symbol: code, flag: "💰", color: "#64748B" };
  const { pressed, handlers } = usePressable();
  // Sort accounts by balance descending
  const sorted = [...accounts].sort((a, b) => b.balance - a.balance);

  return (
    <div>
      <div {...handlers} onClick={onToggle} style={{
        display: "flex", alignItems: "center", padding: "13px 0",
        cursor: "pointer", borderBottom: isOpen ? "none" : "1px solid #1E293B",
        opacity: pressed ? 0.7 : 1, transition: "opacity 0.1s",
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 20, backgroundColor: meta.color + "15",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, marginRight: 12, flexShrink: 0,
        }}>{meta.flag}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9" }}>{code}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>
            {sorted.length} {sorted.length === 1 ? "счёт" : sorted.length < 5 ? "счёта" : "счетов"}
          </div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", fontFeatureSettings: "'tnum'", letterSpacing: "-0.01em" }}>
          {fmtFull(total)}
          <span style={{ fontSize: 11, fontWeight: 500, color: "#64748B", marginLeft: 3 }}>{meta.symbol}</span>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 8, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
          <path d="M3.5 5.25l3.5 3.5 3.5-3.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {isOpen && (
        <div style={{ paddingBottom: 6, marginBottom: 2, borderBottom: "1px solid #1E293B" }}>
          {sorted.map((acc, i) => {
            const net = CARD_NET[acc.last4];
            return (
              <div key={i} {...handlers} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 0 12px 12px", cursor: "pointer",
                borderBottom: i < sorted.length - 1 ? "1px solid #1E293B" : "none",
                opacity: pressed ? 0.7 : 1, transition: "opacity 0.1s",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  backgroundColor: net === "visa" ? "#1A1F71" : net === "mc" ? "#EB001B" : "#1E293B",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>
                    {net === "visa" ? "VISA" : net === "mc" ? "MC" : "💳"}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#F1F5F9", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{acc.product}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>••{acc.last4}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#F1F5F9", fontFeatureSettings: "'tnum'", flexShrink: 0 }}>
                  {fmtFull(acc.balance)}
                </div>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flexShrink: 0, marginLeft: 2 }}>
                  <path d="M1 1l5 5-5 5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Card chip ─── */
function CardChip({ card }) {
  const { pressed, handlers } = usePressable();
  return (
    <div {...handlers} style={{
      flexShrink: 0, width: 118, height: 74, borderRadius: 12, padding: "10px 12px",
      backgroundColor: "#1E293B",
      border: card.frozen ? "1px dashed #334155" : "1px solid #334155",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      cursor: "pointer", position: "relative", opacity: pressed ? 0.7 : card.frozen ? 0.45 : 1,
      transition: "opacity 0.1s",
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontSize: 11, color: "#64748B", fontFeatureSettings: "'tnum'" }}>••{card.last4}</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.network}</span>
      </div>
      {card.frozen && (
        <div style={{ position: "absolute", top: 6, right: 8, fontSize: 8, fontWeight: 700, color: "#64748B", backgroundColor: "#0F172A", borderRadius: 8, padding: "1px 4px", textTransform: "uppercase" }}>frozen</div>
      )}
    </div>
  );
}

/* ─── News ─── */
function NewsBlock({ onAvatarClick }) {
  const featured = NEWS.find(n => n.featured);
  const secondary = NEWS.filter(n => !n.featured);
  return (
    <div>
      {featured && (
        <div data-press style={{ cursor: "pointer", marginBottom: 8, transition: "opacity 0.1s" }}>
          <div style={{
            height: 140, borderRadius: 12,
            backgroundColor: "#1E293B", border: "1px solid #334155",
            display: "flex", alignItems: "flex-end", padding: 16,
          }}>
            <div>
              <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#E11D48", backgroundColor: "#E11D4818", borderRadius: 8, padding: "2px 8px", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>{featured.tag}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", lineHeight: 1.35 }}>{featured.title}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, lineHeight: 1.3 }}>{featured.subtitle}</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 6, paddingLeft: 2 }}>{featured.time}</div>
        </div>
      )}
      {secondary.map(n => (
        <div key={n.id} data-press style={{ padding: "12px 0", borderTop: "1px solid #1E293B", cursor: "pointer", transition: "opacity 0.1s" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            {n.tag && <div style={{ fontSize: 10, fontWeight: 600, color: "#64748B", backgroundColor: "#1E293B", borderRadius: 8, padding: "2px 7px", flexShrink: 0, marginTop: 2 }}>{n.tag}</div>}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8", lineHeight: 1.35 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>{n.time}</div>
            </div>
          </div>
        </div>
      ))}
      <div onClick={onAvatarClick} style={{ textAlign: "center", padding: "14px 0", cursor: "pointer", borderTop: "1px solid #1E293B", marginTop: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#22C55E" }}>Все новости →</span>
      </div>
    </div>
  );
}

/* ─── Action button ─── */
function ActionBtn({ children, label, accent }) {
  const { pressed, handlers } = usePressable();
  return (
    <div {...handlers} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer", flex: 1, opacity: pressed ? 0.7 : 1, transition: "opacity 0.1s" }}>
      <div style={{
        width: 48, height: 48, borderRadius: 20,
        backgroundColor: accent ? "#22C55E" : "#1E293B",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{children}</div>
      <span style={{ fontSize: 11, color: accent ? "#22C55E" : "#94A3B8", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

/* ─── Search bar ─── */
function SearchBar({ stuck, searchQuery, setSearchQuery, searchFocused, setSearchFocused }) {
  return (
    <div style={{
      padding: stuck ? "8px 20px" : "0 20px",
      backgroundColor: stuck ? "#0F172A" : "transparent",
      borderBottom: stuck ? "1px solid #1E293B" : "none",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <div style={{
        flex: 1,
        display: "flex", alignItems: "center", gap: 8,
        backgroundColor: "#1E293B", borderRadius: 12, padding: "9px 14px",
        border: searchFocused ? "1px solid #22C55E" : "1px solid #334155",
        transition: "border-color 0.15s",
      }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4.5" stroke="#64748B" strokeWidth="1.5"/>
          <path d="M10.5 10.5L14 14" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
          placeholder="Найти контакт, продукт..."
          style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#F1F5F9", fontSize: 14, fontFamily: "inherit" }}
        />
      </div>
      <div data-press style={{
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: "#1E293B", border: "1px solid #334155",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0, transition: "opacity 0.1s",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="#94A3B8"/>
        </svg>
      </div>
    </div>
  );
}

/* ─── Currency Picker Dropdown ─── */
function CurrencyPicker({ current, currencies, onSelect, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "#00000066", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor: "#1E293B", borderRadius: 20, padding: "8px 0",
        width: 260, maxHeight: 340, overflow: "auto",
        boxShadow: "0 20px 60px #00000088",
      }}>
        <div style={{ padding: "12px 20px 8px", fontSize: 13, fontWeight: 600, color: "#64748B", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Отображать баланс в
        </div>
        {currencies.map(code => {
          const meta = CURRENCY_META[code] || { symbol: code, flag: "💰", name: code, color: "#64748B" };
          const isActive = code === current;
          return (
            <div key={code} onClick={() => { onSelect(code); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 20px", cursor: "pointer",
                backgroundColor: isActive ? "#334155" : "transparent",
                transition: "background-color 0.1s",
              }}
            >
              <span style={{ fontSize: 20 }}>{meta.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9" }}>{code}</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>{meta.name}</div>
              </div>
              <span style={{ fontSize: 14, color: "#64748B" }}>{meta.symbol}</span>
              {isActive && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5l3.5 3.5L13 5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Bank Tab Content (currency-wallet model per brief) ─── */
function BankContent({ wallets, openCurrency, setOpenCurrency }) {
  return (
    <div>
      {/* Card chips — horizontal scroll */}
      <div style={{ paddingLeft: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 20, marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B", letterSpacing: "0.04em", textTransform: "uppercase" }}>Карты</span>
          <span style={{ fontSize: 12, color: "#22C55E", fontWeight: 500, cursor: "pointer" }}>Управление</span>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, paddingRight: 20, scrollbarWidth: "none" }}>
          {CARDS.map(c => <CardChip key={c.id} card={c} />)}
          <div style={{
            flexShrink: 0, width: 74, height: 74, borderRadius: 12,
            border: "1px dashed #334155",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Currency wallets — expandable rows */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#64748B", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>Валюты</div>
        {wallets.filter(w => w.code !== "FREEDOM").map(w => (
          <CurrencyWallet key={w.code} code={w.code} total={w.total} accounts={w.accounts}
            isOpen={openCurrency === w.code}
            onToggle={() => setOpenCurrency(openCurrency === w.code ? null : w.code)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Deposits Tab Content ─── */
function DepositsContent() {
  return (
    <div style={{ padding: "0 20px" }}>
      {/* Promo banner */}
      <div style={{
        borderRadius: 12, padding: "20px 22px", marginBottom: 24, position: "relative", overflow: "hidden",
        backgroundColor: "#1E293B", border: "1px solid #334155",
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", lineHeight: 1.3, marginBottom: 8 }}>
          Long-term investment
        </div>
        <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.4 }}>
          up to 7.28% per annum in USD
        </div>
        <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.4 }}>
          up to 3.15% per annum in EUR
        </div>
        <div style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
          <div style={{ width: 36, height: 36, borderRadius: 20, backgroundColor: "#334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#94A3B8" }}>$</div>
          <div style={{ width: 36, height: 36, borderRadius: 20, backgroundColor: "#334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#94A3B8", marginLeft: -8 }}>€</div>
        </div>
      </div>

      {/* Section header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>Депозиты</span>
        <div style={{
          width: 28, height: 28, borderRadius: 8, border: "1.5px solid #22C55E",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3v8M3 7h8" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>Расчёт приблизительный и не является офертой</div>

      {/* Deposit list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {DEPOSITS.map(dep => {
          const cm = CURRENCY_META[dep.currency] || { symbol: dep.currency };
          return (
            <div key={dep.id} style={{
              backgroundColor: "#1E293B", borderRadius: 12, padding: "14px 18px",
              cursor: "pointer", border: "1px solid #334155",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#F1F5F9", maxWidth: "55%" }}>{dep.name}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", fontFeatureSettings: "'tnum'" }}>
                  {fmtFull(dep.balance)} <span style={{ color: "#22C55E" }}>{cm.symbol}</span>
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>Дата закрытия — {dep.closingDate}</span>
                <span style={{ fontSize: 12, color: "#64748B" }}>Ставка {dep.rate}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Broker Tab Content ─── */
function BrokerContent() {
  return (
    <div style={{ padding: "0 20px" }}>
      {BROKER_ACCOUNTS.map((group, gi) => (
        <div key={gi} style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", display: "block", marginBottom: 14 }}>{group.group}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {group.accounts.map(acc => {
              const cm = CURRENCY_META[acc.currency] || { symbol: acc.currency };
              return (
                <div key={acc.id} style={{
                  backgroundColor: "#1E293B", borderRadius: 12, padding: "14px 18px",
                  cursor: "pointer", border: "1px solid #334155",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9" }}>{acc.id}</span>
                    <span style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", fontFeatureSettings: "'tnum'" }}>
                      {fmtFull(acc.balance)} <span style={{ fontSize: 13, color: "#64748B" }}>{acc.currency}</span>
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{acc.type}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const BLOCK_LABELS = [
  { key: "balance", label: "Баланс" },
  { key: "actions", label: "Кнопки действий" },
  { key: "search", label: "Поиск" },
  { key: "stories", label: "Stories" },
  { key: "transfers", label: "Переводы" },
  { key: "banners", label: "Промо-баннеры" },
  { key: "products", label: "Продукты" },
  { key: "news", label: "Новости" },
  { key: "cta", label: "CTA кнопка" },
];

/* ─── Debug Theme Switcher ─── */
function BottomSheet({ theme, setTheme, onClose, blockVis, setBlockVis, blockOrder, setBlockOrder, colors }) {
  const C = colors;
  const isDark = C.bg === '#0F172A';
  const themes = [
    { key: "dark", label: "Dark (v6)", desc: "Тёмная тема, зелёный акцент" },
    { key: "stripe", label: "Stripe Light", desc: "Светлая тема, зелёный акцент" },
  ];

  // DnD state
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [dragY, setDragY] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const ROW_H = 46; // row height + gap

  const dragRef = useRef({ index: null, startY: 0, overIndex: null });

  const handleDragStart = (index, e) => {
    e.preventDefault();
    dragRef.current = { index, startY: e.clientY, overIndex: index };
    setDragIndex(index);
    setOverIndex(index);
    setDragStartY(e.clientY);
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
      if (fromIdx !== null && toIdx !== null && fromIdx !== toIdx) {
        setBlockOrder(bo => {
          const next = [...bo];
          const [moved] = next.splice(fromIdx, 1);
          next.splice(toIdx, 0, moved);
          return next;
        });
      }
      dragRef.current = { index: null, startY: 0, overIndex: null };
      setDragIndex(null);
      setOverIndex(null);
      setDragY(0);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [dragIndex, blockOrder.length, setBlockOrder]);

  const getDisplacement = (index) => {
    if (dragIndex === null || overIndex === null || index === dragIndex) return 0;
    if (dragIndex < overIndex) {
      if (index > dragIndex && index <= overIndex) return -ROW_H;
    } else {
      if (index >= overIndex && index < dragIndex) return ROW_H;
    }
    return 0;
  };

  const labelMap = {};
  BLOCK_LABELS.forEach(b => { labelMap[b.key] = b.label; });

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, backgroundColor: "#00000055", zIndex: 200,
        animation: "sheetOverlay 0.2s ease-out",
      }} />
      {/* Sheet */}
      <div onClick={e => e.stopPropagation()} style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        maxWidth: 393, margin: "0 auto",
        backgroundColor: C.card,
        borderRadius: "20px 20px 0 0",
        maxHeight: "75vh",
        display: "flex", flexDirection: "column",
        zIndex: 201,
        animation: "sheetUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        boxShadow: "0 -8px 40px #00000018",
      }}>
        {/* Pill handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: C.border }} />
        </div>
        {/* Header */}
        <div style={{ padding: "14px 24px 0" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Конструктор</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Тема, порядок и видимость блоков</div>
        </div>
        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 32px", WebkitOverflowScrolling: "touch" }}>
          {/* Theme switcher */}
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Тема</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {themes.map(t => (
              <div key={t.key} onClick={() => { setTheme(t.key); }} style={{
                flex: 1, padding: "10px 12px", borderRadius: 12, cursor: "pointer",
                backgroundColor: theme === t.key ? (isDark ? "#334155" : `${C.accent}10`) : "transparent",
                border: theme === t.key ? `1.5px solid ${C.accent}` : `1.5px solid ${C.border}`,
                transition: "all 0.15s",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{t.label}</div>
                {theme === t.key && <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginTop: 2 }}>ACTIVE</div>}
              </div>
            ))}
          </div>

          {/* Block list */}
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Блоки</div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: 2, position: "relative" }}
          >
            {blockOrder.map((key, index) => {
              const on = blockVis[key];
              const isDragged = index === dragIndex;
              const displacement = getDisplacement(index);
              return (
                <div key={key} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 8px", borderRadius: 10,
                  backgroundColor: isDragged ? (isDark ? "#334155" : "#F3F4F6") : "transparent",
                  transform: isDragged ? `translateY(${dragY}px) scale(1.02)` : `translateY(${displacement}px)`,
                  transition: isDragged ? "box-shadow 0.15s" : "transform 0.2s cubic-bezier(0.2,0,0,1), background-color 0.15s",
                  zIndex: isDragged ? 10 : 1,
                  boxShadow: isDragged ? `0 4px 16px ${isDark ? "#00000044" : "#00000018"}` : "none",
                  userSelect: "none",
                  touchAction: "none",
                  position: "relative",
                }}>
                  {/* Grip handle */}
                  <div
                    onPointerDown={(e) => handleDragStart(index, e)}
                    style={{
                      width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: isDragged ? "grabbing" : "grab", color: C.muted, fontSize: 16, flexShrink: 0,
                      borderRadius: 6,
                    }}
                  >⠿</div>
                  {/* Label */}
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: on ? C.text : C.muted }}>{labelMap[key]}</span>
                  {/* Toggle */}
                  <div onClick={(e) => { e.stopPropagation(); setBlockVis(prev => ({ ...prev, [key]: !prev[key] })); }} style={{
                    width: 40, height: 22, borderRadius: 11,
                    backgroundColor: on ? C.accent : (isDark ? "#475569" : "#D1D5DB"),
                    position: "relative", transition: "background-color 0.2s",
                    cursor: "pointer", flexShrink: 0,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 9,
                      backgroundColor: "#fff", position: "absolute", top: 2,
                      left: on ? 20 : 2, transition: "left 0.2s",
                      boxShadow: "0 1px 3px #00000033",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset */}
          <div onClick={() => {
            setBlockVis(BLOCK_LABELS.reduce((acc, b) => ({ ...acc, [b.key]: true }), {}));
            setBlockOrder(BLOCK_LABELS.map(b => b.key));
          }}
            style={{ fontSize: 12, fontWeight: 600, color: C.accent, textAlign: "center", marginTop: 16, cursor: "pointer", padding: "8px 0" }}>
            Сбросить всё
          </div>
        </div>
      </div>
    </>
  );
}

const LIGHT_COLORS = {
  bg: "#F0EFEB", card: "#FFFFFF", accent: "#0AB321",
  text: "#1A1A1A", sub: "#6B7280", muted: "#9CA3AF", border: "#E5E5E0",
  accentFg: "#FFFFFF",
};

const DARK_COLORS = {
  bg: "#0F172A", card: "#1E293B", accent: "#22C55E",
  text: "#F1F5F9", sub: "#94A3B8", muted: "#64748B", border: "#334155",
  accentFg: "#0F172A",
};

/* ─── Stripe Light Theme ─── */
function StripeThemeApp({ onAvatarClick, wallets, displayCurrency, setDisplayCurrency, pickerOpen, setPickerOpen, totalInKZT, productTab, setProductTab, openCurrency, setOpenCurrency, searchQuery, setSearchQuery, searchFocused, setSearchFocused, fcExpanded, setFcExpanded, blockVis, blockOrder, colors, scrollRef, sentinelRef, searchStuck }) {
  const C = colors;
  const isDark = C.bg === '#0F172A';

  const totalDisplay = convertTo(totalInKZT, displayCurrency);
  const displayMeta = CURRENCY_META[displayCurrency] || { symbol: displayCurrency, flag: "💰" };
  const availableCurrencies = Object.keys(CURRENCY_META).filter(c => c !== "FREEDOM");
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerScrollRef = useRef(null);

  return (
    <div style={{
      maxWidth: 393, margin: "0 auto", backgroundColor: C.bg,
      height: "100vh", display: "flex", flexDirection: "column",
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      position: "relative", overflow: "hidden",
    }}>
      <style>{`[data-press]:active { opacity: 0.7 !important; }
@keyframes sparkle-pulse { 0%,100% { transform: scale(1) rotate(0deg); opacity: 1; } 50% { transform: scale(1.18) rotate(18deg); opacity: 0.85; } }
@keyframes aurora-drift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes orb-float-1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-20px) scale(1.1); } 66% { transform: translate(-20px,15px) scale(0.95); } }
@keyframes orb-float-2 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-25px,25px) scale(1.05); } 66% { transform: translate(35px,-10px) scale(0.9); } }
@keyframes orb-float-3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(15px,30px) scale(1.08); } }
@keyframes shimmer-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes sheetOverlay { from { opacity: 0; } to { opacity: 1; } }`}</style>

      {/* Currency picker modal — light styled */}
      {pickerOpen && (
        <div onClick={() => setPickerOpen(false)} style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#00000033", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: C.card, borderRadius: 20, padding: "8px 0",
            width: 260, maxHeight: 340, overflow: "auto",
            boxShadow: "0 20px 60px #00000022", border: `1px solid ${C.border}`,
          }}>
            <div style={{ padding: "12px 20px 8px", fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Отображать баланс в
            </div>
            {availableCurrencies.map(code => {
              const meta = CURRENCY_META[code] || { symbol: code, flag: "💰", name: code, color: C.muted };
              const isActive = code === displayCurrency;
              return (
                <div key={code} onClick={() => { setDisplayCurrency(code); setPickerOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 20px", cursor: "pointer",
                    backgroundColor: isActive ? C.border : "transparent",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{meta.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{code}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{meta.name}</div>
                  </div>
                  <span style={{ fontSize: 14, color: C.muted }}>{meta.symbol}</span>
                  {isActive && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5l3.5 3.5L13 5" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Aurora gradient — fixed behind scroll content, fades at bottom */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 520,
        backgroundImage: isDark
          ? `linear-gradient(135deg, ${C.accent}28 0%, #6366F125 25%, ${C.bg} 50%, #06B6D420 75%, ${C.accent}18 100%)`
          : `linear-gradient(135deg, ${C.accent}12 0%, #6366F115 25%, ${C.bg} 50%, #06B6D410 75%, ${C.accent}0D 100%)`,
        backgroundSize: "400% 400%",
        animation: "aurora-drift 15s ease infinite",
        zIndex: 0,
        pointerEvents: "none",
        maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
      }} />
      {/* Floating orbs */}
      <div style={{ position: "absolute", top: -30, right: -20, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}${isDark ? "30" : "18"}, transparent 70%)`, animation: "orb-float-1 8s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 300, left: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${isDark ? "#6366F128" : "#6366F112"}, transparent 70%)`, animation: "orb-float-2 10s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 180, left: "60%", width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${isDark ? "#06B6D422" : "#06B6D410"}, transparent 70%)`, animation: "orb-float-3 12s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }} />

      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 40, paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ padding: "16px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", order: -1 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.accent, lineHeight: 1.15, letterSpacing: "-0.03em", textShadow: isDark ? `0 0 30px ${C.accent}40` : "none" }}>Freedom</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.text, lineHeight: 1.15, letterSpacing: "-0.03em" }}>Banker</div>
          </div>
          <div onClick={onAvatarClick} data-press style={{ cursor: "pointer", position: "relative", transition: "opacity 0.1s" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              backgroundColor: C.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1 }}>НШ</span>
            </div>
            {/* Notification dot */}
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: 10, height: 10, borderRadius: "50%",
              backgroundColor: "#EF4444",
              border: `2px solid ${C.bg}`,
              boxSizing: "content-box",
            }} />
          </div>
        </div>

        {/* Balance */}
        {blockVis.balance && (
        <div style={{ padding: "0 24px", order: blockOrder.indexOf("balance") }}>
          <div style={{ fontSize: 14, color: C.sub, marginBottom: 6 }}>
            Общий баланс
          </div>
          {(() => {
            const balanceStr = fmtFull(totalDisplay);
            const len = balanceStr.length;
            const balanceFontSize = len <= 5 ? 56 : len <= 8 ? 50 : len <= 11 ? 44 : len <= 14 ? 38 : 30;
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: balanceFontSize, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'", letterSpacing: "-0.03em", lineHeight: 1, whiteSpace: "nowrap" }}>
                  {balanceStr}
                </div>
                <div onClick={() => setPickerOpen(true)} data-press style={{
                  width: Math.round(balanceFontSize * 0.78), height: Math.round(balanceFontSize * 0.78),
                  borderRadius: "50%", backgroundColor: C.accent,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                  transition: "transform 0.15s", boxShadow: `0 2px 8px ${C.accent}33, 0 0 20px ${C.accent}22, inset 0 1px 1px #ffffff30`,
                }}>
                  <span style={{ fontSize: Math.round(balanceFontSize * 0.38), fontWeight: 700, color: "#fff", lineHeight: 1 }}>{displayMeta.symbol}</span>
                </div>
              </div>
            );
          })()}

          {/* Freedom Tokens — badge + expandable details */}
          {(() => {
            const fcBalance = wallets.find(w => w.code === "FREEDOM")?.total || 0;
            const fcValueUsd = (fcBalance / 10000 * FRHC_PRICE);
            return (
              <div style={{ marginTop: 14 }}>
                {/* Collapsed badge — always visible */}
                <div data-press onClick={() => setFcExpanded(v => !v)} style={{
                  display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "opacity 0.1s",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    backgroundColor: isDark ? `${C.card}CC` : `${C.card}EE`,
                    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                    borderRadius: 10, border: `1px solid ${isDark ? "#ffffff10" : C.border}`,
                    padding: "4px 10px",
                    boxShadow: isDark ? `0 0 12px ${C.accent}10` : "0 1px 4px #0000000A",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.accent }}>F</span>
                    <span style={{ fontSize: 12, color: C.text, fontWeight: 600, fontFeatureSettings: "'tnum'" }}>
                      {fcBalance.toLocaleString("ru-RU")}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: C.sub, fontWeight: 500 }}>Freedom Tokens</span>
                  <span style={{
                    fontSize: 10, color: C.muted, transition: "transform 0.2s",
                    transform: fcExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    display: "inline-block",
                  }}>▼</span>
                </div>

                {/* Expanded details — FRHC price, FC value */}
                {fcExpanded && (
                  <div style={{
                    marginTop: 8, backgroundColor: C.card, borderRadius: 12,
                    border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`,
                    padding: "10px 14px",
                    animation: "fadeIn 0.15s ease-out",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: C.muted }}>FRHC</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFeatureSettings: "'tnum'" }}>${FRHC_PRICE}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.accent }}>↑ {FRHC_CHANGE}%</span>
                      </div>
                      <span style={{ fontSize: 12, color: C.muted, fontFeatureSettings: "'tnum'" }}>≈ ${fcValueUsd.toFixed(2)}</span>
                    </div>
                    <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: C.sub }}>1 акция FRHC = 10 000 FC</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.accent, cursor: "pointer" }}>Подробнее →</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        )}

        {/* Action buttons */}
        {blockVis.actions && (
        <div style={{ display: "flex", padding: "0 20px", order: blockOrder.indexOf("actions") }}>
          {[
            { label: "Отправить", accent: true, d: "M10 16V4M10 4L5 9M10 4L15 9" },
            { label: "Запросить", accent: false, d: "M10 4V16M10 16L5 11M10 16L15 11" },
            { label: "Обмен", accent: false, d: "M4 7H16M16 7L13 4M16 7L13 10M16 13H4M4 13L7 10M4 13L7 16" },
            { label: "Ещё", accent: false, d: null },
          ].map((btn, i) => (
            <div key={i} data-press style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer", flex: 1, transition: "opacity 0.1s" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 18,
                background: btn.accent ? `linear-gradient(135deg, ${C.accent}, #06B6D4)` : (isDark ? `${C.card}CC` : `${C.card}BB`),
                border: btn.accent ? "none" : `1px solid ${isDark ? "#ffffff12" : "#00000008"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: btn.accent ? "none" : "blur(12px)",
                WebkitBackdropFilter: btn.accent ? "none" : "blur(12px)",
                boxShadow: btn.accent
                  ? `0 4px 16px ${C.accent}44, 0 0 24px ${C.accent}22, inset 0 1px 1px #ffffff30`
                  : (isDark ? "0 2px 8px #00000022, inset 0 1px 0 #ffffff08" : "0 2px 8px #0000000A, inset 0 1px 0 #ffffff60"),
                transition: "transform 0.15s, box-shadow 0.15s",
              }}>
                {btn.d ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d={btn.d} stroke={btn.accent ? C.accentFg : C.sub} strokeWidth={btn.label === "Обмен" ? "1.5" : "2"} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="5" cy="10" r="1.5" fill={C.sub}/><circle cx="10" cy="10" r="1.5" fill={C.sub}/><circle cx="15" cy="10" r="1.5" fill={C.sub}/>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 11, color: btn.accent ? C.accent : C.sub, fontWeight: 500 }}>{btn.label}</span>
            </div>
          ))}
        </div>
        )}
        {/* Search bar — sentinel + spacer in ordered flow */}
        <div style={{ order: blockOrder.indexOf("search") }}>
        <div ref={sentinelRef} style={{ height: 0 }} />
        {blockVis.search && !searchStuck && (
        <div style={{
          padding: "0 20px", display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8,
            backgroundColor: C.card, borderRadius: 12, padding: "0 14px",
            height: 40, boxSizing: "border-box",
            border: searchFocused ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
            transition: "border-color 0.15s",
          }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="7" r="4.5" stroke={C.muted} strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              placeholder="Найти контакт, продукт..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: C.text, fontSize: 14, fontFamily: "inherit" }}
            />
          </div>
          <div data-press style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.accent}, #06B6D4)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0, transition: "opacity 0.1s",
            boxShadow: `0 2px 8px ${C.accent}44`,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "sparkle-pulse 2s ease-in-out infinite" }}>
              <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="#FFFFFF"/>
            </svg>
          </div>
        </div>
        )}
        {blockVis.search && searchStuck && <div style={{ height: 56 }} />}
        </div>

        {/* Stories */}
        {blockVis.stories && (
        <div style={{ padding: 0, order: blockOrder.indexOf("stories") }}>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 20px", scrollbarWidth: "none" }}>
            {STORIES.map(s => (
              <div key={s.id} data-press style={{ flexShrink: 0, width: 68, cursor: "pointer", transition: "opacity 0.1s" }}>
                <div style={{
                  width: 68, height: 68, borderRadius: 20,
                  border: s.viewed ? `1.5px solid ${C.border}` : `1.5px solid ${C.accent}`,
                  padding: 2, boxSizing: "border-box",
                }}>
                  <div style={{
                    width: "100%", height: "100%", borderRadius: 16,
                    background: s.bg || C.card,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}><s.Icon size={24} color="#fff" strokeWidth={2} /></div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 500, color: s.viewed ? C.muted : C.sub, textAlign: "center", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.title}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Transfers & Payments — bento grid */}
        {blockVis.transfers && (
        <div style={{ padding: "0 20px", order: blockOrder.indexOf("transfers") }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12 }}>Переводы и платежи</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "auto", gap: 10 }}>
            {/* Row 1: big + small + small */}
            <div data-press style={{
              gridColumn: "1 / 3", padding: "16px", borderRadius: 16,
              backgroundColor: C.card, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "opacity 0.1s",
            }}>
              <ArrowLeftRight size={24} color={C.accent} strokeWidth={2} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Между своими</div>
                <div style={{ fontSize: 10, color: C.muted }}>Карты, депозиты</div>
              </div>
            </div>
            <div data-press style={{
              padding: "14px 4px", borderRadius: 16,
              backgroundColor: C.card, border: `1px solid ${C.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", transition: "opacity 0.1s",
            }}>
              <Phone size={22} color={C.sub} strokeWidth={1.8} />
              <span style={{ fontSize: 9, fontWeight: 500, color: C.sub, textAlign: "center", lineHeight: 1.2 }}>По номеру</span>
            </div>
            <div data-press style={{
              padding: "14px 4px", borderRadius: 16,
              backgroundColor: C.card, border: `1px solid ${C.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", transition: "opacity 0.1s",
            }}>
              <CreditCard size={22} color={C.sub} strokeWidth={1.8} />
              <span style={{ fontSize: 9, fontWeight: 500, color: C.sub, textAlign: "center", lineHeight: 1.2 }}>На карту</span>
            </div>
            {/* Row 2: small + small + big */}
            <div data-press style={{
              padding: "14px 4px", borderRadius: 16,
              backgroundColor: C.card, border: `1px solid ${C.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", transition: "opacity 0.1s",
            }}>
              <Globe size={22} color={C.sub} strokeWidth={1.8} />
              <span style={{ fontSize: 9, fontWeight: 500, color: C.sub, textAlign: "center", lineHeight: 1.2 }}>SWIFT</span>
            </div>
            <div data-press style={{
              padding: "14px 4px", borderRadius: 16,
              backgroundColor: C.card, border: `1px solid ${C.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", transition: "opacity 0.1s",
            }}>
              <TrendingUp size={22} color={C.sub} strokeWidth={1.8} />
              <span style={{ fontSize: 9, fontWeight: 500, color: C.sub, textAlign: "center", lineHeight: 1.2 }}>Брокер</span>
            </div>
            <div data-press style={{
              gridColumn: "3 / 5", padding: "16px", borderRadius: 16,
              backgroundColor: C.card, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "opacity 0.1s",
            }}>
              <DollarSign size={24} color={C.accent} strokeWidth={2} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Обмен валют</div>
                <div style={{ fontSize: 10, color: C.muted }}>По курсу банка</div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Promo banners carousel */}
        {blockVis.banners && (() => {
          const bannerOrder = blockOrder.indexOf("banners");
          const banners = [
            { bg: `linear-gradient(135deg, ${C.accent}, #06B6D4)`, content: (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Globe size={26} color="#fff" strokeWidth={2} />
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Переводы</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 10, lineHeight: 1.4 }}>12 валют без комиссии</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  {[{ from: "🇰🇿", to: "🇷🇺" }, { from: "🇰🇿", to: "🇬🇪" }, { from: "🇰🇿", to: "🇺🇿" }].map((c, i) => (
                    <span key={i} style={{ fontSize: 13, color: "#fff", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "3px 8px" }}>{c.from}→{c.to}</span>
                  ))}
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>+9</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>SWIFT · Western Union · Золотая Корона</div>
              </>
            )},
            { bg: `linear-gradient(135deg, #6366F1, #A855F7)`, content: (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <CreditCard size={26} color="#fff" strokeWidth={2} />
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Invest Card</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 10, lineHeight: 1.4 }}>Кэшбэк Freedom Tokens за каждую покупку</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6 }}>до 5% кэшбэк</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Бесплатное обслуживание · Apple Pay</div>
              </>
            )},
            { bg: `linear-gradient(135deg, #F59E0B, #EF4444)`, content: (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <TrendingUp size={26} color="#fff" strokeWidth={2} />
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Депозиты</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 10, lineHeight: 1.4 }}>Высокие ставки в тенге и валюте</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6 }}>до 14.5% годовых</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>КФГД · без комиссий · онлайн открытие</div>
              </>
            )},
          ];
          const handleScroll = () => {
            const el = bannerScrollRef.current;
            if (!el || !el.children.length) return;
            const child = el.children[0];
            const gap = 12;
            const step = child.offsetWidth + gap;
            const idx = Math.round(el.scrollLeft / step);
            setActiveBanner(Math.min(idx, banners.length - 1));
          };
          const scrollTo = (idx) => {
            const el = bannerScrollRef.current;
            if (!el || !el.children[idx]) return;
            const child = el.children[0];
            const gap = 12;
            const step = child.offsetWidth + gap;
            el.scrollTo({ left: step * idx, behavior: "smooth" });
          };
          return (
            <div style={{ marginBottom: 0, order: bannerOrder }}>
              <div ref={bannerScrollRef} onScroll={handleScroll} style={{
                display: "flex", overflowX: "auto", scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none", padding: "0 20px", gap: 12,
                msOverflowStyle: "none",
              }}>
                {banners.map((b, i) => (
                  <div key={i} data-press style={{
                    flex: `0 0 calc(100% - 40px)`, scrollSnapAlign: "center",
                    padding: "20px 20px 18px", borderRadius: 16, cursor: "pointer",
                    background: b.bg, position: "relative", overflow: "hidden",
                    transition: "opacity 0.1s",
                  }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }}/>
                    <div style={{ position: "absolute", bottom: -12, left: 40, width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }}/>
                    <div style={{ position: "relative" }}>{b.content}</div>
                  </div>
                ))}
              </div>
              {/* Pagination dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
                {banners.map((_, i) => (
                  <div key={i} onClick={() => scrollTo(i)} style={{
                    width: activeBanner === i ? 16 : 6, height: 6, borderRadius: 3,
                    backgroundColor: activeBanner === i ? C.accent : C.border,
                    transition: "all 0.25s ease", cursor: "pointer",
                  }}/>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Product tabs */}
        {blockVis.products && (<div style={{ order: blockOrder.indexOf("products") }}>
        <div style={{ padding: "0 20px" }}>
          <div style={{
            display: "flex", backgroundColor: C.card, borderRadius: 12, padding: 3,
            border: `1px solid ${C.border}`,
          }}>
            {[
              { key: "bank", label: "Банк" },
              { key: "deposits", label: "Депозиты" },
              { key: "broker", label: "Брокер" },
            ].map(tab => {
              const active = productTab === tab.key;
              return (
                <div key={tab.key} data-press onClick={() => setProductTab(tab.key)} style={{
                  flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 10,
                  backgroundColor: active ? C.text : "transparent",
                  cursor: "pointer", transition: "background-color 0.15s, opacity 0.1s",
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: active ? C.card : C.muted,
                  }}>{tab.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        {productTab === "bank" && (
          <div>
            {/* Recent transactions */}
            <div style={{ padding: "16px 20px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: "0.04em", textTransform: "uppercase" }}>Транзакции</span>
              </div>

              {/* Weekly spending chart */}
              <div style={{ backgroundColor: C.card, borderRadius: 16, padding: "20px 20px 18px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: C.sub, marginBottom: 16 }}>Расходы за неделю</div>
                {(() => {
                  const maxAmt = Math.max(...WEEK_SPEND_KZT.filter((_, j) => j <= TODAY_INDEX));
                  const totalWeek = WEEK_SPEND_KZT.reduce((s, v) => s + v, 0);
                  return (
                    <>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
                        {WEEK_SPEND_KZT.map((amt, i) => {
                          const pct = maxAmt > 0 && amt > 0 ? (amt / maxAmt) * 100 : 0;
                          const isFuture = i > TODAY_INDEX;
                          const isToday = i === TODAY_INDEX;
                          return (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                                <div style={{
                                  width: "100%",
                                  height: isFuture ? "20%" : `${Math.max(pct, 6)}%`,
                                  borderRadius: 4,
                                  backgroundColor: isToday ? C.accent : isFuture ? "transparent" : C.border,
                                  border: isFuture ? `1.5px dashed ${C.border}` : "none",
                                }} />
                              </div>
                              <div style={{
                                fontSize: 11, marginTop: 8,
                                color: isToday ? C.text : C.muted,
                                fontWeight: isToday ? 700 : 400,
                              }}>{WEEK_LABELS[i]}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <div>
                          <span style={{ fontSize: 13, color: C.sub }}>Итого</span>
                          <span style={{ fontSize: 20, fontWeight: 700, color: C.text, marginLeft: 10, fontFeatureSettings: "'tnum'" }}>
                            {fmtFull(convertTo(totalWeek, displayCurrency))} {displayMeta.symbol}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.accent }}>↓ 12% к пр. неделе</div>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div style={{ backgroundColor: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                {[
                  { Icon: ShoppingCart, name: "Магнум", desc: "Продукты", amount: "-12 500 ₸", time: "Сегодня, 14:32" },
                  { Icon: Globe, name: "SWIFT перевод", desc: "→ Грузия", amount: "-$320.00", time: "Сегодня, 11:05" },
                  { Icon: Utensils, name: "Glovo", desc: "Доставка еды", amount: "-4 800 ₸", time: "Вчера, 20:18" },
                  { Icon: Fuel, name: "КМГ АЗС", desc: "Топливо", amount: "-15 000 ₸", time: "Вчера, 09:41" },
                  { Icon: Home, name: "Аренда", desc: "Ежемесячный", amount: "-€580.00", time: "1 мар, 08:00" },
                  { Icon: Wallet, name: "Зарплата", desc: "Входящий", amount: "+$2 400.00", time: "28 фев, 10:00", income: true },
                ].map((tx, i, arr) => (
                  <div key={i} data-press style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                    cursor: "pointer", transition: "background 0.1s",
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 20,
                      backgroundColor: C.bg, border: `1px solid ${C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}><tx.Icon size={18} color={tx.income ? C.accent : C.sub} strokeWidth={1.8} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{tx.name}</div>
                      <div style={{ fontSize: 12, color: C.sub, marginTop: 1 }}>{tx.desc} · {tx.time}</div>
                    </div>
                    <div style={{
                      fontSize: 14, fontWeight: 600, fontFeatureSettings: "'tnum'", flexShrink: 0,
                      color: tx.income ? C.accent : C.text,
                    }}>{tx.amount}</div>
                  </div>
                ))}
              </div>
              <div data-press style={{
                marginTop: 12, padding: "14px 0", borderRadius: 12,
                backgroundColor: C.card, border: `1px solid ${C.border}`,
                textAlign: "center", cursor: "pointer",
                fontSize: 14, fontWeight: 600, color: C.accent,
                transition: "opacity 0.1s",
              }}>Все транзакции</div>
            </div>

            {/* Card chips — horizontal scroll */}
            <div style={{ paddingLeft: 20, marginBottom: 0, marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 20, marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: "0.04em", textTransform: "uppercase" }}>Карты</span>
                <span style={{ fontSize: 12, color: C.accent, fontWeight: 500, cursor: "pointer" }}>Управление</span>
              </div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, paddingRight: 20, scrollbarWidth: "none" }}>
                {CARDS.map(c => (
                  <div key={c.id} data-press style={{
                    flexShrink: 0, width: 118, height: 74, borderRadius: 12, padding: "10px 12px",
                    backgroundColor: C.card,
                    border: c.frozen ? `1px dashed ${C.border}` : `1px solid ${C.border}`,
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    cursor: "pointer", position: "relative",
                    opacity: c.frozen ? 0.45 : 1, transition: "opacity 0.1s",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.sub, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <span style={{ fontSize: 11, color: C.muted, fontFeatureSettings: "'tnum'" }}>••{c.last4}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.network}</span>
                    </div>
                    {c.frozen && (
                      <div style={{ position: "absolute", top: 6, right: 8, fontSize: 8, fontWeight: 700, color: C.muted, backgroundColor: C.bg, borderRadius: 8, padding: "1px 4px", textTransform: "uppercase" }}>frozen</div>
                    )}
                  </div>
                ))}
                <div style={{
                  flexShrink: 0, width: 74, height: 74, borderRadius: 12,
                  border: `1px dashed ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4V16M4 10H16" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Currency wallets — expandable rows */}
            <div style={{ padding: "0 20px 0", marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>Валюты</div>
              {wallets.filter(w => w.code !== "FREEDOM").map(w => {
                const meta = CURRENCY_META[w.code] || { symbol: w.code, flag: "💰", color: C.muted };
                const isOpen = openCurrency === w.code;
                const sorted = [...w.accounts].sort((a, b) => b.balance - a.balance);
                return (
                  <div key={w.code}>
                    <div data-press onClick={() => setOpenCurrency(isOpen ? null : w.code)} style={{
                      display: "flex", alignItems: "center", padding: "13px 0",
                      cursor: "pointer", borderBottom: isOpen ? "none" : `1px solid ${C.border}`,
                      transition: "opacity 0.1s",
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 20, backgroundColor: (meta.color || C.muted) + "15",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, marginRight: 12, flexShrink: 0,
                      }}>{meta.flag}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{w.code}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                          {sorted.length} {sorted.length === 1 ? "счёт" : sorted.length < 5 ? "счёта" : "счетов"}
                        </div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'", letterSpacing: "-0.01em" }}>
                        {fmtFull(w.total)}
                        <span style={{ fontSize: 11, fontWeight: 500, color: C.muted, marginLeft: 3 }}>{meta.symbol}</span>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 8, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
                        <path d="M3.5 5.25l3.5 3.5 3.5-3.5" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {isOpen && (
                      <div style={{ paddingBottom: 6, marginBottom: 2, borderBottom: `1px solid ${C.border}` }}>
                        {sorted.map((acc, j) => {
                          const net = CARD_NET[acc.last4];
                          return (
                            <div key={j} data-press style={{
                              display: "flex", alignItems: "center", gap: 12,
                              padding: "12px 0 12px 12px", cursor: "pointer",
                              borderBottom: j < sorted.length - 1 ? `1px solid ${C.border}` : "none",
                              transition: "opacity 0.1s",
                            }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                backgroundColor: net === "visa" ? "#1A1F71" : net === "mc" ? "#EB001B" : C.bg,
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: net ? "#fff" : C.muted, letterSpacing: "0.02em" }}>
                                  {net === "visa" ? "VISA" : net === "mc" ? "MC" : "💳"}
                                </span>
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 500, color: C.text, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{acc.product}</div>
                                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>••{acc.last4}</div>
                              </div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFeatureSettings: "'tnum'", flexShrink: 0 }}>
                                {fmtFull(acc.balance)}
                              </div>
                              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ flexShrink: 0, marginLeft: 2 }}>
                                <path d="M1 1l5 5-5 5" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {productTab === "deposits" && (
          <div style={{ padding: "16px 20px 0" }}>
            {/* Promo banner */}
            <div style={{
              borderRadius: 12, padding: "20px 22px", marginBottom: 16, position: "relative", overflow: "hidden",
              backgroundColor: C.card, border: `1px solid ${C.border}`,
            }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 8 }}>
                Долгосрочные вложения
              </div>
              <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.4 }}>до 7.28% годовых в USD</div>
              <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.4 }}>до 3.15% годовых в EUR</div>
              <div style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
                <div style={{ width: 36, height: 36, borderRadius: 20, backgroundColor: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: C.sub }}>$</div>
                <div style={{ width: 36, height: 36, borderRadius: 20, backgroundColor: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: C.sub, marginLeft: -8 }}>€</div>
              </div>
            </div>

            {/* Section header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Депозиты</span>
              <div style={{
                width: 28, height: 28, borderRadius: 8, border: `1.5px solid ${C.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 3v8M3 7h8" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Расчёт приблизительный и не является офертой</div>

            {/* Deposit list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DEPOSITS.map(dep => {
                const cm = CURRENCY_META[dep.currency] || { symbol: dep.currency };
                return (
                  <div key={dep.id} style={{
                    backgroundColor: C.card, borderRadius: 12, padding: "14px 18px",
                    cursor: "pointer", border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.text, maxWidth: "55%" }}>{dep.name}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
                        {fmtFull(dep.balance)} <span style={{ color: C.accent }}>{cm.symbol}</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: C.muted }}>Дата закрытия — {dep.closingDate}</span>
                      <span style={{ fontSize: 12, color: C.muted }}>Ставка {dep.rate}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {productTab === "broker" && (
          <div style={{ padding: "16px 20px 0" }}>
            {BROKER_ACCOUNTS.map((group, gi) => (
              <div key={gi} style={{ marginBottom: gi < BROKER_ACCOUNTS.length - 1 ? 24 : 0 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: C.text, display: "block", marginBottom: 14 }}>{group.group}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {group.accounts.map(acc => {
                    const cm = CURRENCY_META[acc.currency] || { symbol: acc.currency };
                    return (
                      <div key={acc.id} style={{
                        backgroundColor: C.card, borderRadius: 12, padding: "14px 18px",
                        cursor: "pointer", border: `1px solid ${C.border}`,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{acc.id}</span>
                          <span style={{ fontSize: 17, fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>
                            {fmtFull(acc.balance)} <span style={{ fontSize: 13, color: C.muted }}>{acc.currency}</span>
                          </span>
                        </div>
                        <span style={{ fontSize: 12, color: C.muted }}>{acc.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>)}

        {/* News section */}
        {blockVis.news && (
        <div style={{ padding: "0 20px", order: blockOrder.indexOf("news") }}>
          {(() => {
            const featured = NEWS.find(n => n.featured);
            const secondary = NEWS.filter(n => !n.featured);
            return (
              <div style={{ backgroundColor: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                {featured && (
                  <div data-press style={{ padding: "20px 20px 16px", cursor: "pointer", transition: "opacity 0.1s" }}>
                    <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#E11D48", backgroundColor: "#E11D4818", borderRadius: 8, padding: "2px 8px", marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>{featured.tag}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.35 }}>{featured.title}</div>
                    <div style={{ fontSize: 12, color: C.sub, marginTop: 6, lineHeight: 1.4 }}>{featured.subtitle}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>{featured.time}</div>
                  </div>
                )}
                {secondary.map(n => (
                  <div key={n.id} data-press style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, cursor: "pointer", transition: "opacity 0.1s" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, lineHeight: 1.35 }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{n.time}</div>
                  </div>
                ))}
                <div onClick={onAvatarClick} data-press style={{ textAlign: "center", padding: "14px 20px", cursor: "pointer", borderTop: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>Все новости →</span>
                </div>
              </div>
            );
          })()}
        </div>
        )}

        {/* CTA Button */}
        {blockVis.cta && (
        <div style={{ padding: "0 20px", order: blockOrder.indexOf("cta") }}>
          <div data-press style={{
            backgroundColor: C.accent, borderRadius: 12, padding: "15px 0",
            textAlign: "center", cursor: "pointer", transition: "opacity 0.1s",
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.accentFg }}>Новая карта или продукт</span>
          </div>
        </div>
        )}
      </div>

      {/* Sticky search bar — fixed overlay when scrolled past */}
      {blockVis.search && searchStuck && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          zIndex: 20, padding: "16px 20px", display: "flex", alignItems: "center", gap: 8,
          backgroundColor: C.bg,
        }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8,
            backgroundColor: C.card, borderRadius: 12, padding: "0 14px",
            height: 40, boxSizing: "border-box",
            border: searchFocused ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
            transition: "border-color 0.15s",
          }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="7" r="4.5" stroke={C.muted} strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              placeholder="Найти контакт, продукт..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: C.text, fontSize: 14, fontFamily: "inherit" }}
            />
          </div>
          <div data-press style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.accent}, #06B6D4)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0, transition: "opacity 0.1s",
            boxShadow: `0 2px 8px ${C.accent}44`,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "sparkle-pulse 2s ease-in-out infinite" }}>
              <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="#FFFFFF"/>
            </svg>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-around",
        padding: "10px 16px 28px", backgroundColor: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}>
        {[
          { label: "Главная", active: true, d: "M3 9.5L10 3l7 6.5V19a1 1 0 01-1 1h-4v-5a1 1 0 00-1-1H9a1 1 0 00-1 1v5H4a1 1 0 01-1-1V9.5z" },
          { label: "Статистика", active: false, d: "M4 16V9M8 16V4M12 16V12M16 16V7" },
          { label: "Переводы", active: false, d: "M4 12h12M12 4l4 4-4 4M16 8l-4 4 4 4" },
          { label: "Контакты", active: false, d: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8c0-3.3 3.1-6 7-6s7 2.7 7 6" },
        ].map((tab, i) => (
          <div key={i} data-press style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            cursor: "pointer", padding: "4px 12px", transition: "opacity 0.1s",
          }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              {tab.label === "Главная" ? (
                <path d={tab.d} fill={tab.active ? C.text : "none"} stroke={tab.active ? C.text : C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d={tab.d} stroke={tab.active ? C.text : C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              )}
            </svg>
            <span style={{
              fontSize: 10, fontWeight: tab.active ? 600 : 500,
              color: tab.active ? C.text : C.muted,
            }}>{tab.label}</span>
            {tab.active && (
              <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: C.accent, marginTop: -2 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════ MAIN ═══════ */
export default function FreedomV6() {
  const [openCurrency, setOpenCurrency] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStuck, setSearchStuck] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState("EUR");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [productTab, setProductTab] = useState("bank");
  const [theme, setTheme] = useState("stripe");
  const [debugOpen, setDebugOpen] = useState(false);
  const [fcExpanded, setFcExpanded] = useState(false);
  const [blockVis, setBlockVis] = useState(
    BLOCK_LABELS.reduce((acc, b) => ({ ...acc, [b.key]: true }), {})
  );
  const [blockOrder, setBlockOrder] = useState(BLOCK_LABELS.map(b => b.key));

  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);

  const wallets = useMemo(() => {
    const map = {};
    RAW_ACCOUNTS.forEach(acc => {
      if (!map[acc.currency]) map[acc.currency] = { total: 0, accounts: [] };
      map[acc.currency].total += acc.balance;
      map[acc.currency].accounts.push(acc);
    });
    // Sort accounts within each currency by balance desc
    Object.values(map).forEach(w => {
      w.accounts.sort((a, b) => b.balance - a.balance);
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total).map(([code, data]) => ({ code, ...data }));
  }, []);

  const availableCurrencies = useMemo(() => Object.keys(CURRENCY_META).filter(c => c !== "FREEDOM"), []);

  // Total balance in KZT, then convert to display currency
  const totalInKZT = useMemo(() => {
    let sum = 0;
    RAW_ACCOUNTS.forEach(acc => {
      const rate = RATES_TO_KZT[acc.currency] || 1;
      sum += acc.balance * rate;
    });
    return sum;
  }, []);

  const totalDisplay = convertTo(totalInKZT, displayCurrency);
  const displayMeta = CURRENCY_META[displayCurrency] || { symbol: displayCurrency, flag: "💰" };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const sentinelEl = sentinelRef.current;
    if (!scrollEl || !sentinelEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setSearchStuck(!entry.isIntersecting); },
      { root: scrollEl, threshold: 0 }
    );
    observer.observe(sentinelEl);
    return () => observer.disconnect();
  }, []);

  // Sync body bg with theme
  useEffect(() => {
    document.body.style.backgroundColor = (theme === "stripe" ? LIGHT_COLORS : DARK_COLORS).bg;
  }, [theme]);

  // Stripe theme — completely different UI
  if (theme === "stripe") {
    return (
      <>
        {debugOpen && <BottomSheet theme={theme} setTheme={setTheme} onClose={() => setDebugOpen(false)} blockVis={blockVis} setBlockVis={setBlockVis} blockOrder={blockOrder} setBlockOrder={setBlockOrder} colors={theme === "stripe" ? LIGHT_COLORS : DARK_COLORS} />}
        <StripeThemeApp
          onAvatarClick={() => setDebugOpen(true)}
          wallets={wallets}
          displayCurrency={displayCurrency}
          setDisplayCurrency={setDisplayCurrency}
          pickerOpen={pickerOpen}
          setPickerOpen={setPickerOpen}
          totalInKZT={totalInKZT}
          productTab={productTab}
          setProductTab={setProductTab}
          openCurrency={openCurrency}
          setOpenCurrency={setOpenCurrency}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          fcExpanded={fcExpanded}
          setFcExpanded={setFcExpanded}
          blockVis={blockVis}
          blockOrder={blockOrder}
          colors={LIGHT_COLORS}
          scrollRef={scrollRef}
          sentinelRef={sentinelRef}
          searchStuck={searchStuck}
        />
      </>
    );
  }

  return (
    <>
      {debugOpen && <BottomSheet theme={theme} setTheme={setTheme} onClose={() => setDebugOpen(false)} blockVis={blockVis} setBlockVis={setBlockVis} blockOrder={blockOrder} setBlockOrder={setBlockOrder} colors={theme === "stripe" ? LIGHT_COLORS : DARK_COLORS} />}
      <StripeThemeApp
        onAvatarClick={() => setDebugOpen(true)}
        wallets={wallets}
        displayCurrency={displayCurrency}
        setDisplayCurrency={setDisplayCurrency}
        pickerOpen={pickerOpen}
        setPickerOpen={setPickerOpen}
        totalInKZT={totalInKZT}
        productTab={productTab}
        setProductTab={setProductTab}
        openCurrency={openCurrency}
        setOpenCurrency={setOpenCurrency}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        fcExpanded={fcExpanded}
        setFcExpanded={setFcExpanded}
        blockVis={blockVis}
        blockOrder={blockOrder}
        colors={DARK_COLORS}
        scrollRef={scrollRef}
        sentinelRef={sentinelRef}
        searchStuck={searchStuck}
      />
    </>
  );
}

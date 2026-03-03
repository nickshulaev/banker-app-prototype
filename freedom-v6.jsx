import { useState, useMemo, useRef, useEffect, useCallback } from "react";

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
  { product: "DepositCard R VISA Rew", last4: "4521", currency: "KZT", balance: 35251706.16 },
  { product: "DepositCard R VISA Rew", last4: "4521", currency: "USD", balance: 113324.68 },
  { product: "DepositCARD MC WE Rez7val VIP", last4: "4357", currency: "USD", balance: 130574.74 },
  { product: "Business Premium Card", last4: "6608", currency: "KZT", balance: 4968007.40 },
  { product: "Business Premium Card", last4: "0120", currency: "KZT", balance: 10000000.00 },
  { product: "DepositCARD MCWorld Rez7val", last4: "3674", currency: "KZT", balance: 4046861.97 },
  { product: "Deposit card DC ZP 0 Premium", last4: "4787", currency: "KZT", balance: 1772222.79 },
  { product: "Инвестиционная карта Global", last4: "1862", currency: "USD", balance: 358.42 },
  { product: "Инвестиционная карта Global", last4: "1862", currency: "KZT", balance: 30649.22 },
  { product: "Инвестиционная карта Global", last4: "1862", currency: "EUR", balance: 185.16 },
  { product: "Инвестиционная карта TFOS", last4: "0160", currency: "USD", balance: 7206.81 },
  { product: "Инвестиционная карта TFOS", last4: "0160", currency: "RUB", balance: 196.30 },
  { product: "Инвестиционная карта Global", last4: "9201", currency: "KZT", balance: 30649.22 },
  { product: "DepositCARD MCWorld Rez7val", last4: "3674", currency: "FREEDOM", balance: 12 },
  { product: "EcoCard MC World Unlim", last4: "0426", currency: "USD", balance: 3.00 },
  { product: "Deposit card DC ZP 0 Premium", last4: "4787", currency: "KZT", balance: 372222.79 },
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
];

const STORIES = [
  { id: 1, title: "Be cautious", icon: "🛡️", viewed: false },
  { id: 2, title: "Potential Income", icon: "💰", viewed: false },
  { id: 3, title: "Service Rates", icon: "📊", viewed: true },
  { id: 4, title: "Official Pages", icon: "📱", viewed: true },
  { id: 5, title: "Update Info", icon: "🔄", viewed: true },
];

const NEWS = [
  { id: 1, featured: true, title: "Freedom Bank запускает мультивалютные переводы без комиссии", subtitle: "Новый тарифный план для премиум-клиентов с моментальными переводами в 12 валютах", time: "2ч назад", tag: "Продукт" },
  { id: 2, featured: false, title: "Изменение базовых ставок по депозитам с 1 апреля", time: "5ч назад", tag: "Ставки" },
  { id: 3, featured: false, title: "Техническое обслуживание: плановые работы в ночь с 5 на 6 марта", time: "Вчера", tag: "Сервис" },
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
          width: "100%", height: "100%", borderRadius: 12, background: "linear-gradient(135deg, #1E293B, #334155)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, overflow: "hidden",
        }}>{s.icon}</div>
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
        <div style={{ paddingBottom: 10, marginBottom: 2, borderBottom: "1px solid #1E293B" }}>
          {sorted.map((acc, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0 8px 50px" }}>
              <span style={{ fontSize: 12, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 12 }}>
                {acc.product} <span style={{ color: "#64748B" }}>•{acc.last4}</span>
              </span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#94A3B8", fontFeatureSettings: "'tnum'", flexShrink: 0 }}>
                {fmtFull(acc.balance)}
              </span>
            </div>
          ))}
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
function NewsBlock() {
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
              <div style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "#22C55E", backgroundColor: "#22C55E18", borderRadius: 8, padding: "2px 8px", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>{featured.tag}</div>
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
            <div style={{ fontSize: 10, fontWeight: 600, color: "#64748B", backgroundColor: "#1E293B", borderRadius: 8, padding: "2px 7px", flexShrink: 0, marginTop: 2 }}>{n.tag}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8", lineHeight: 1.35 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>{n.time}</div>
            </div>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", padding: "14px 0", cursor: "pointer", borderTop: "1px solid #1E293B", marginTop: 4 }}>
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
        <span style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>Deposits</span>
        <div style={{
          width: 28, height: 28, borderRadius: 8, border: "1.5px solid #22C55E",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3v8M3 7h8" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>The calculation is approximate and is not an offer</div>

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
                <span style={{ fontSize: 12, color: "#64748B" }}>Closing date - {dep.closingDate}</span>
                <span style={{ fontSize: 12, color: "#64748B" }}>Rate {dep.rate}%</span>
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

/* ─── Debug Theme Switcher ─── */
function DebugModal({ theme, setTheme, onClose }) {
  const themes = [
    { key: "dark", label: "Dark (v6)", desc: "Тёмная тема, зелёный акцент" },
    { key: "stripe", label: "Stripe Light", desc: "Светлая, красный акцент, bento-grid" },
  ];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "#00000066", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#1E293B", borderRadius: 20, padding: 24, width: 280, boxShadow: "0 20px 60px #00000088" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", marginBottom: 4 }}>Debug: Theme</div>
        <div style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>Выберите дизайн интерфейса</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {themes.map(t => (
            <div key={t.key} onClick={() => { setTheme(t.key); onClose(); }} style={{
              padding: "12px 16px", borderRadius: 12, cursor: "pointer",
              backgroundColor: theme === t.key ? "#334155" : "transparent",
              border: theme === t.key ? "1.5px solid #22C55E" : "1.5px solid #334155",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#F1F5F9" }}>{t.label}</span>
                {theme === t.key && <span style={{ fontSize: 10, fontWeight: 700, color: "#22C55E" }}>ACTIVE</span>}
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Stripe Light Theme ─── */
function StripeThemeApp({ onAvatarClick, wallets, displayCurrency, setDisplayCurrency, pickerOpen, setPickerOpen, totalInKZT }) {
  const C = { bg: "#F0EFEB", card: "#FFFFFF", accent: "#EF4444", text: "#1A1A1A", sub: "#6B7280", muted: "#9CA3AF", border: "#E5E5E0" };

  const totalDisplay = convertTo(totalInKZT, displayCurrency);
  const displayMeta = CURRENCY_META[displayCurrency] || { symbol: displayCurrency, flag: "💰" };
  const availableCurrencies = Object.keys(CURRENCY_META);

  return (
    <div style={{
      maxWidth: 393, margin: "0 auto", backgroundColor: C.bg,
      height: "100vh", display: "flex", flexDirection: "column",
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
    }}>
      <style>{`[data-press]:active { opacity: 0.7 !important; }`}</style>

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
                    backgroundColor: isActive ? "#F5F5F0" : "transparent",
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

      {/* Status bar */}
      <div style={{ height: 48, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px" }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>9:41</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <svg width="17" height="12" viewBox="0 0 17 12"><rect y="8" width="3" height="4" rx=".5" fill={C.text}/><rect x="4.5" y="5" width="3" height="7" rx=".5" fill={C.text}/><rect x="9" y="2" width="3" height="10" rx=".5" fill={C.text}/><rect x="13.5" y="0" width="3" height="12" rx=".5" fill={C.text} opacity=".3"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12"><circle cx="8" cy="10" r="1.2" fill={C.text}/><path d="M5 7.5a4.5 4.5 0 016 0" stroke={C.text} strokeWidth="1.3" fill="none" strokeLinecap="round"/><path d="M2.5 5a8 8 0 0111 0" stroke={C.text} strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>
          <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="22" height="12" rx="2.5" stroke={C.text} strokeOpacity=".35" fill="none"/><rect x="24" y="3.5" width="1.5" height="6" rx=".75" fill={C.text} opacity=".4"/><rect x="2" y="2" width="18" height="9" rx="1.5" fill={C.text}/></svg>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <div style={{ padding: "4px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.text, lineHeight: 1.15, letterSpacing: "-0.02em" }}>Credit Card</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.accent, lineHeight: 1.15, letterSpacing: "-0.02em" }}>Freedom</div>
          </div>
          <div onClick={onAvatarClick} data-press style={{ cursor: "pointer", padding: "8px 0", transition: "opacity 0.1s" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 8l5 5 5-5" stroke={C.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Abstract red art */}
        <div style={{ padding: "28px 0 16px", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6, height: 210 }}>
          <div style={{ width: 54, height: 130, borderRadius: 27, backgroundColor: C.accent }} />
          <div style={{ width: 54, height: 80, borderRadius: 27, backgroundColor: C.accent }} />
          <div style={{ width: 54, height: 155, borderRadius: 27, backgroundColor: C.accent }} />
          <div style={{ width: 54, height: 62, borderRadius: 27, backgroundColor: C.accent }} />
          <div style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: C.accent }} />
        </div>

        {/* Balance */}
        <div style={{ padding: "0 24px 6px" }}>
          <div style={{ fontSize: 14, color: C.sub, marginBottom: 6 }}>
            Total Balance – ****{CARDS[0].last4}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <div style={{ fontSize: 46, fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {fmtCompact(totalDisplay)}
            </div>
            <div onClick={() => setPickerOpen(true)} data-press style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              cursor: "pointer", padding: "3px 10px", borderRadius: 8,
              backgroundColor: C.card, border: `1px solid ${C.border}`,
              transition: "opacity 0.1s",
            }}>
              <span style={{ fontSize: 20, fontWeight: 500, color: C.sub }}>{displayMeta.symbol}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M3 4l2 2 2-2" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Currency breakdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            {wallets.filter(w => w.code !== "FREEDOM").slice(0, 4).map(w => {
              const meta = CURRENCY_META[w.code] || { symbol: w.code, flag: "💰" };
              return (
                <div key={w.code} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 13 }}>{meta.flag}</span>
                  <span style={{ fontSize: 12, color: C.sub, fontWeight: 500, fontFeatureSettings: "'tnum'" }}>{fmtCompact(w.total)}</span>
                </div>
              );
            })}
            {/* FREEDOM cashback badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              backgroundColor: C.card, borderRadius: 8, border: `1px solid ${C.border}`,
              padding: "3px 8px",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.accent }}>F</span>
              <span style={{ fontSize: 12, color: C.text, fontWeight: 600, fontFeatureSettings: "'tnum'" }}>
                {(wallets.find(w => w.code === "FREEDOM")?.total || 0).toLocaleString("ru-RU")}
              </span>
            </div>
          </div>
        </div>

        {/* Bento grid */}
        <div style={{ padding: "20px 20px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {/* Gross Volume */}
          <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 16 }}>Gross Volume</div>
            <svg width="100%" height="36" viewBox="0 0 140 36" preserveAspectRatio="none">
              <path d="M0 30 C8 28,16 32,24 26 C32 20,40 24,52 18 C60 14,68 16,80 12 C88 8,96 14,108 10 C116 6,124 4,140 8" fill="none" stroke={C.text} strokeWidth="1.5"/>
              <circle cx="140" cy="8" r="3" fill="none" stroke={C.text} strokeWidth="1.5"/>
            </svg>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginTop: 10, fontFeatureSettings: "'tnum'" }}>$890.00</div>
          </div>

          {/* Spent + Weekly — tall card spanning 2 rows */}
          <div style={{
            backgroundColor: C.card, borderRadius: 16, padding: 16,
            border: `1px solid ${C.border}`, gridColumn: 2, gridRow: "1 / 3",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 14 }}>Spent</div>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 5, minHeight: 80 }}>
              {[50, 30, 70, 25, 40, 95, 55].map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`, borderRadius: 2.5,
                  backgroundColor: i === 5 ? C.text : "#D5D5D0",
                }} />
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 14 }}>
              <div style={{ fontSize: 13, color: C.sub }}>Weekly Spent</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginTop: 2, fontFeatureSettings: "'tnum'" }}>$120.00</div>
            </div>
          </div>

          {/* Last Expenses */}
          <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 14 }}>Last Expenses</div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {[
                { letter: "U", amount: "-$10" },
                { letter: "a", amount: "-$12" },
                { letter: "v", amount: "-$9" },
              ].map((e, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 19,
                    border: `1.5px solid ${C.border}`, backgroundColor: C.card,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6,
                    fontStyle: i > 0 ? "italic" : "normal",
                  }}>{e.letter}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFeatureSettings: "'tnum'" }}>{e.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
  const [displayCurrency, setDisplayCurrency] = useState("KZT");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [productTab, setProductTab] = useState("bank");
  const [theme, setTheme] = useState("dark");
  const [debugOpen, setDebugOpen] = useState(false);

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

  const availableCurrencies = useMemo(() => Object.keys(CURRENCY_META), []);

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
    document.body.style.backgroundColor = theme === "stripe" ? "#F0EFEB" : "#0F172A";
  }, [theme]);

  // Stripe theme — completely different UI
  if (theme === "stripe") {
    return (
      <>
        {debugOpen && <DebugModal theme={theme} setTheme={setTheme} onClose={() => setDebugOpen(false)} />}
        <StripeThemeApp
          onAvatarClick={() => setDebugOpen(true)}
          wallets={wallets}
          displayCurrency={displayCurrency}
          setDisplayCurrency={setDisplayCurrency}
          pickerOpen={pickerOpen}
          setPickerOpen={setPickerOpen}
          totalInKZT={totalInKZT}
        />
      </>
    );
  }

  return (
    <div style={{
      maxWidth: 393, margin: "0 auto", backgroundColor: "#0F172A",
      height: "100vh", display: "flex", flexDirection: "column",
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
    }}>
      <style>{`[data-press]:active { opacity: 0.7 !important; }`}</style>

      {/* Debug theme modal */}
      {debugOpen && <DebugModal theme={theme} setTheme={setTheme} onClose={() => setDebugOpen(false)} />}

      {/* Currency picker modal */}
      {pickerOpen && (
        <CurrencyPicker
          current={displayCurrency}
          currencies={availableCurrencies}
          onSelect={setDisplayCurrency}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {/* Status bar */}
      <div style={{
        height: 48, flexShrink: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 20px", backgroundColor: "#0F172A", zIndex: 20,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9" }}>12:59</span>
        <div style={{ backgroundColor: "#1E293B", borderRadius: 20, padding: "4px 14px" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E" }}>Freedom</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9" }}>Banker</span>
        </div>
        <div onClick={() => setDebugOpen(true)} data-press style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: "#334155", cursor: "pointer", transition: "opacity 0.1s" }} />
      </div>

      {/* Sticky search */}
      {searchStuck && (
        <div style={{ position: "sticky", top: 0, zIndex: 15, backgroundColor: "#0F172A" }}>
          <SearchBar stuck searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            searchFocused={searchFocused} setSearchFocused={setSearchFocused} />
        </div>
      )}

      {/* SCROLL */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto" }}>

        {/* 1. BALANCE */}
        <div style={{ padding: "28px 20px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            Общий баланс
          </div>
          <div style={{
            fontSize: 36, fontWeight: 800, color: "#F1F5F9",
            letterSpacing: "-0.025em", lineHeight: 1, fontFeatureSettings: "'tnum'",
            display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4,
          }}>
            <span>{fmtCompact(totalDisplay)}</span>

            {/* Clickable currency symbol */}
            <div
              onClick={() => setPickerOpen(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                cursor: "pointer", padding: "2px 8px", borderRadius: 8,
                backgroundColor: "#1E293B", marginLeft: 2,
                transition: "background-color 0.15s",
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 500, color: "#94A3B8" }}>
                {displayMeta.symbol}
              </span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M3 4l2 2 2-2" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Mini currency breakdown + FREEDOM cashback */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 18, flexWrap: "wrap" }}>
            {wallets.filter(w => w.code !== "FREEDOM").slice(0, 4).map(w => {
              const meta = CURRENCY_META[w.code] || { symbol: w.code, flag: "💰" };
              return (
                <div key={w.code} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 13 }}>{meta.flag}</span>
                  <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, fontFeatureSettings: "'tnum'" }}>{fmtCompact(w.total)}</span>
                </div>
              );
            })}

            {/* FREEDOM cashback — always visible */}
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              backgroundColor: "#334155", borderRadius: 8, border: "1px solid #334155",
              padding: "3px 8px",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8" }}>F</span>
              <span style={{ fontSize: 12, color: "#F1F5F9", fontWeight: 600, fontFeatureSettings: "'tnum'" }}>
                {(wallets.find(w => w.code === "FREEDOM")?.total || 0).toLocaleString("ru-RU")}
              </span>
            </div>
          </div>
        </div>

        {/* 2. ACTIONS */}
        <div style={{ display: "flex", padding: "4px 20px 22px" }}>
          <ActionBtn label="Отправить" accent>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 16V4M10 4L5 9M10 4L15 9" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionBtn>
          <ActionBtn label="Запросить">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M10 16L5 11M10 16L15 11" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionBtn>
          <ActionBtn label="Обмен">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 7H16M16 7L13 4M16 7L13 10M16 13H4M4 13L7 10M4 13L7 16" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionBtn>
          <ActionBtn label="Ещё">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="5" cy="10" r="1.5" fill="#94A3B8"/><circle cx="10" cy="10" r="1.5" fill="#94A3B8"/><circle cx="15" cy="10" r="1.5" fill="#94A3B8"/>
            </svg>
          </ActionBtn>
        </div>

        {/* 3. SEARCH (natural) */}
        <div ref={sentinelRef}>
          <SearchBar stuck={false} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            searchFocused={searchFocused} setSearchFocused={setSearchFocused} />
        </div>

        {/* 4. STORIES */}
        <div style={{ paddingTop: 18, paddingBottom: 16 }}>
          <StoriesRow />
        </div>

        {/* 5. PRODUCT TABS */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{
            display: "flex", backgroundColor: "#1E293B", borderRadius: 12, padding: 3,
          }}>
            {[
              { key: "bank", label: "Bank" },
              { key: "deposits", label: "Deposits" },
              { key: "broker", label: "Broker" },
            ].map(tab => {
              const active = productTab === tab.key;
              return (
                <div key={tab.key} data-press onClick={() => setProductTab(tab.key)} style={{
                  flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 12,
                  backgroundColor: active ? "#334155" : "transparent",
                  cursor: "pointer", transition: "background-color 0.15s, opacity 0.1s",
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: active ? "#F1F5F9" : "#94A3B8",
                  }}>{tab.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. TAB CONTENT */}
        <div style={{ paddingBottom: 8 }}>
          {productTab === "bank" && <BankContent wallets={wallets} openCurrency={openCurrency} setOpenCurrency={setOpenCurrency} />}
          {productTab === "deposits" && <DepositsContent />}
          {productTab === "broker" && <BrokerContent />}
        </div>

        {/* 8. NEW PRODUCT */}
        <div style={{ padding: "20px 20px" }}>
          <div data-press style={{
            backgroundColor: "#22C55E",
            borderRadius: 12, padding: "15px 0", textAlign: "center", cursor: "pointer",
            transition: "opacity 0.1s",
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Новая карта или продукт</span>
          </div>
        </div>

        {/* 9. NEWS */}
        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#64748B", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12 }}>Новости</div>
          <NewsBlock />
        </div>

      </div>

      {/* BOTTOM NAV */}
      <div style={{
        display: "flex", justifyContent: "space-around", padding: "8px 0 26px",
        borderTop: "1px solid #1E293B", backgroundColor: "#0F172A", flexShrink: 0,
      }}>
        {[
          { label: "Главная", active: true, d: "M3 9l7-6 7 6v8a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" },
          { label: "Статистика", active: false, d: "M4 16V9M8 16V4M12 16V7M16 16V2" },
          { label: "Переводы", active: false, d: "M4 7h12M4 13h12" },
          { label: "Контакты", active: false, d: "M10 10a3 3 0 100-6 3 3 0 000 6zM3 18c0-3 3-5 7-5s7 2 7 5" },
        ].map(item => (
          <div key={item.label} data-press style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", backgroundColor: item.active ? "#22C55E12" : "transparent", padding: "4px 12px", borderRadius: 12, transition: "opacity 0.1s" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d={item.d} stroke={item.active ? "#22C55E" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 10, fontWeight: 600, color: item.active ? "#22C55E" : "#64748B" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

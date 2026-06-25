/* ═══════════════════════════════════════════════════════════════════
   ONBOARDING — пре-авторизационный флоу (изолированный sibling-оверлей)

   Монтируется ДО аппа, гейт по флагу `onb` в FreedomV6 (как LockScreen).
   Получает ТОЛЬКО: C (палитра), initial ({branch, stepKey, sub}), onComplete().
   Никакого доступа к navStack / продуктам / FEATURE_FLAGS / blockVis.

   Визуальные примитивы — копии стиля аппа (StatusBar / ScreenShell / FormField /
   LockScreen-клавиатура / data-press), НЕ импорт из freedom-v6.jsx.

   Источники контента: Freedom.pdf, Frame 1321318585.pdf (Sumsub),
   Опросник AML (1).pdf, 01.Адрес.pdf.
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useEffect } from "react";
import {
  ArrowLeft, Check, ChevronRight, ChevronDown, ChevronUp, X, Paperclip,
  Camera, ShieldCheck, RefreshCw, Phone, CreditCard, TrendingUp, Globe,
  Clock, FileText, Bell,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   СТЕЙТ-МАШИНА (декларативный граф ветвлений)
   ═══════════════════════════════════════════════ */

// ⚠️ МЕХАНИКА: вход ВСЕГДА один — phone_entry. Ветки это исходы гейтвеев, а не точки входа.
//   Старт → [Номер в БД?] → да → OTP → [Демо?] → нет: Авторизация / да: подпроцесс A (онбординг)
//                         → нет → Этап ввода ИИН → «Ввести ИИН» → [ИИН есть?] → да: OTP → подпроцесс B (смена номера)
//                                                                              → нет: подпроцесс C (eResidency)
//                                                → «У меня нет ИИН» → подпроцесс C (eResidency)
export const ONB_START = "phone_entry";

// Мок-ответы гейтвеев — выставляются из дебаг-меню, чтобы дойти до любого терминала из реального входа.
export const ONB_GATES = [
  { key: "numberInDb", label: "Номер в БД" },
  { key: "isDemoUser", label: "Демо-юзер" },
  { key: "iinExists", label: "ИИН существует" },
];

// Быстрые пресеты-персоны (выставляют гейты разом).
export const ONB_PRESETS = [
  { key: "login", label: "Вход (есть клиент)", gates: { numberInDb: true, isDemoUser: false, iinExists: false } },
  { key: "demo", label: "Демо / онбординг", gates: { numberInDb: true, isDemoUser: true, iinExists: false } },
  { key: "changeNumber", label: "Смена номера", gates: { numberInDb: false, isDemoUser: false, iinExists: true } },
  { key: "eResidency", label: "eResidency", gates: { numberInDb: false, isDemoUser: false, iinExists: false } },
];

// Под-состояния Sumsub-машины — для дебаг-джампера.
export const SUMSUB_PHASES = ["intro", "selfie", "checking", "success", "rejected", "pending"];

export const SUMSUB_PHASE_LABELS = {
  intro: "Подтверждение личности",
  selfie: "Селфи",
  checking: "Проверка",
  success: "Успех",
  rejected: "Отклонено",
  pending: "На рассмотрении",
};

// Каждый шаг: { key, group, title, next, back, sumsub?, terminal? }.
// next — строка (следующий key) либо (gates, formData) => key для гейтвеев; null = терминал → onComplete.
export const ONB_STEPS = [
  // ── Роутер (единый вход) ─────────────────────────────────
  { key: "phone_entry",   group: "Роутер", title: "Ввод номера телефона", next: (g) => g.numberInDb ? "otp_login" : "iin_stage", back: null },
  { key: "otp_login",     group: "Роутер", title: "Код-пароль (вход)",    next: (g) => g.isDemoUser ? "card_select" : "authorize", back: "phone_entry" },
  { key: "authorize",     group: "Роутер", title: "Авторизация → апп",    next: null, back: null, terminal: true },
  { key: "iin_stage",     group: "Роутер", title: "Этап ввода ИИН",       next: null, back: "phone_entry" },
  { key: "iin_entry",     group: "Роутер", title: "Ввод ИИН",             next: (g) => g.iinExists ? "otp_changenum" : "eres_intro", back: "iin_stage" },
  { key: "otp_changenum", group: "Роутер", title: "Код-пароль (смена)",   next: () => "chg_form", back: "iin_entry" },

  // ── A · Онбординг-профиль (демо-юзер) ────────────────────
  { key: "card_select", group: "A · Онбординг", title: "Выпуск карты",  next: "aml_form", back: null },
  { key: "aml_form",    group: "A · Онбординг", title: "Анкета (22)",   next: "address",  back: "card_select" },
  { key: "address",     group: "A · Онбординг", title: "Адрес",         next: "sumsub",   back: "aml_form" },
  { key: "sumsub",      group: "A · Онбординг", title: "Идентификация", next: "app_success", back: "address", sumsub: true },
  { key: "app_success", group: "A · Онбординг", title: "Готово → апп",  next: null, back: null, terminal: true },

  // ── B · Смена номера ─────────────────────────────────────
  { key: "chg_form",       group: "B · Смена номера", title: "Сменить номер", next: "chg_statement", back: null },
  { key: "chg_statement",  group: "B · Смена номера", title: "Заявление",     next: "chg_sumsub",    back: "chg_form" },
  { key: "chg_sumsub",     group: "B · Смена номера", title: "Идентификация", next: "chg_processing", back: "chg_statement", sumsub: true },
  { key: "chg_processing", group: "B · Смена номера", title: "В процессе → апп", next: null, back: null, terminal: true },

  // ── C · eResidency ───────────────────────────────────────
  { key: "eres_intro",    group: "C · eResidency", title: "Получить eResidency", next: "eres_redirect", back: null },
  { key: "eres_redirect", group: "C · eResidency", title: "Редирект → вход",     next: "phone_entry",   back: null, terminal: true },
];

/* ═══════════════════════════════════════════════
   AML-ОПРОСНИК (полный конфиг, 22 вопроса, 6 секций)
   Источник: docs/aml-questionnaire-spec.md
   ═══════════════════════════════════════════════ */

export const AML_SECTIONS = [
  "Банковские операции",
  "Открытие счёта",
  "Открытие счёта",
  "Работа и образование",
  "Финансы",
  "Дополнительно",
];

export const AML_QUESTIONS = [
  // ── Секция 1: Банковские операции ──────────────────────────────
  {
    id: "q01", section: 0, type: "single",
    title: "01. Цель прибытия в Республику Казахстан",
    hint: "Выберите один вариант",
    options: ["Не нахожусь в РК", "Работа", "Учёба", "Лечение", "Туризм", "Другое (указать)"],
    otherInput: true,
  },
  {
    id: "q02", section: 0, type: "single",
    title: "02. Укажите страну второго гражданства (при наличии)",
    hint: "Выберите один вариант",
    options: ["Нет", "Да (необходимо обязательно приложить копию паспорта)"],
    conditional: {
      when: "Да (необходимо обязательно приложить копию паспорта)",
      field: { type: "file", label: "Прикрепить документ", note: "Не более 10 Mb" },
    },
  },
  {
    id: "q03", section: 0, type: "country",
    title: "03. Налоговое резидентство",
    placeholder: "Налоговое резидентство (напр. RU, Россия)",
  },
  {
    id: "q04", section: 0, type: "text",
    title: "04. ИНН в стране налогового резидентства",
    placeholder: "ИНН (Индивидуальный идентификационный номер)",
    example: "980101300123",
  },

  // ── Секция 2: Открытие счёта ───────────────────────────────────
  {
    id: "q05", section: 1, type: "multi",
    title: "05. Цель открытия банковского счёта/карточки",
    hint: "Выберите один или несколько вариантов",
    options: [
      "Размещение депозитов", "Получение займов",
      "Трансграничные (международные) переводы, в том числе Р2Р",
      "Переводы без открытия счёта", "Обменные операции с наличной валютой",
      "Оплата налогов и прочих платежей в бюджет", "Расчётно-кассовое обслуживание", "Другое",
    ],
  },

  // ── Секция 3: Открытие счёта (продолжение) ─────────────────────
  {
    id: "q06", section: 2, type: "multi",
    title: "06. Цель открытия банковского счёта/платёжной карточки",
    hint: "Выберите один или несколько вариантов",
    options: [
      "Размещение депозитов", "Получение займов",
      "Трансграничные (международные) переводы, в том числе Р2Р",
      "Переводы без открытия счёта", "Обменные операции с наличной валютой",
      "Оплата налогов и прочих платежей в бюджет", "Расчётно-кассовое обслуживание", "Другое",
    ],
  },
  {
    id: "q07", section: 2, type: "single",
    title: "07. Вы планируете использовать карту для международных переводов?",
    hint: "Выберите один вариант",
    options: ["Нет", "Да"],
  },
  {
    id: "q08", section: 2, type: "single",
    title: "08. Есть ли у вас счета или карты в других банках?",
    hint: "Выберите один вариант",
    options: ["Нет", "Да"],
    conditional: {
      when: "Да",
      field: { type: "multi", label: "Укажите банки", options: ["Halyk Bank", "Kaspi", "БЦК", "Другие"] },
    },
  },
  {
    id: "q09", section: 2, type: "single",
    title: "09. Укажите ожидаемую среднемесячную сумму поступлений на Ваши счета в Банке",
    hint: "Выберите один вариант",
    options: [
      "До 1 млн тенге (до 2 000 USD/EUR) в месяц",
      "1–10 млн тенге (2 000–20 000 USD/EUR) в месяц",
      "10–50 млн тенге (20 000–100 000 USD/EUR) в месяц",
      "Свыше 50 млн тенге (свыше 100 000 USD/EUR) в месяц",
      "Разовое/редкое поступление крупной суммы (не менее 250 млн тенге / 500 000 USD/EUR)",
    ],
  },

  // ── Секция 4: Работа и образование ─────────────────────────────
  {
    id: "q10", section: 3, type: "single",
    title: "10. Укажите Ваш статус в настоящий момент",
    hint: "Выберите один вариант",
    options: [
      "Наёмный сотрудник", "Индивидуальный предприниматель", "Владелец бизнеса", "Инвестор",
      "Самозанятый", "Студент/Учащийся", "Пенсионер", "На иждивении",
      "В декретном/ином длительном отпуске",
    ],
  },
  {
    id: "q11", section: 3, type: "single",
    title: "11. Должность",
    hint: "Выберите один вариант",
    options: [
      "Индивидуальный предприниматель", "Самозанятый", "Учредитель (Акционер) юридического лица",
      "Исполнительное или высшее руководство", "Руководители среднего звена",
      "Менеджмент первого звена", "Старший персонал", "Персонал начального уровня",
    ],
  },
  {
    id: "q12", section: 3, type: "text",
    title: "12. Название компании", placeholder: "Название компании",
  },
  {
    id: "q13", section: 3, type: "single",
    title: "13. Сфера деятельности",
    hint: "Выберите один вариант",
    collapsible: 7,
    options: [
      "Банковская организация", "Страховая (перестраховочная) организация",
      "Профессиональный участник рынка ценных бумаг",
      "Финансовая организация — нерезидент Республики Казахстан", "Государственный орган",
      "Национальный (Центральный) Банк", "Национальный управляющий холдинг",
      "Деятельность исключительно через обменные пункты по организации обменных операций с наличной иностранной валютой",
      "Исключительная деятельность по инкассации банкнот, монет и ценностей",
      "Микрофинансовая организация", "Ломбард", "Кредитное товарищество",
      "Агент (поверенный) поставщиков услуг (кроме финансовых), осуществляющие приём от потребителей наличных денег, в том числе через электронные терминалы",
      "Организаторы игорного бизнеса, а также лица, предоставляющие услуги либо получающие доходы от деятельности онлайн-казино за пределами Республики Казахстан",
      "Туристские услуги",
      "Деятельность по выпуску цифровых активов, организации торгов ими, а также предоставлению услуг по обмену цифровых активов на деньги, ценности и иное имущество",
      "Услуги по финансовому лизингу",
      "Посредническая деятельность по купле-продаже недвижимости",
      "Деятельность, связанная с производством и (или) торговлей оружием, взрывчатыми веществами",
      "Деятельность, связанная с добычей и (или) обработкой, а также куплей-продажей драгоценных металлов, драгоценных камней либо изделий из них",
      "Строительная промышленность", "Горнодобывающая промышленность",
      "Фармацевтика / Здравоохранение",
      "Разработка, производство и обслуживание аэрокосмических технологий",
      "Производство и поставка высокотехнологичного оборудования и компонентов (в т.ч. микросхемы, компьютеры, процессоры, сетевое оборудование, телекоммуникационные технологии и квантовые вычисления)",
      "Сфера морского транспорта",
      "Бухгалтерский учёт (аудит, отчётность и финансовая аналитика)",
      "Оказание помощи в создании и структурировании юридических лиц (трасты и корпорации)",
      "Стратегические бизнес-консультации, планирование и оценка организационных систем",
      "Торговля, поставка и переработка морской рыбы",
      "Производство, экспорт, импорт и хранение алкогольной продукции",
      "Сфера энергетики (нефтяная, газовая промышленность, нефтепродукты, добыча угля, генерация и производство всех типов энергии, экспорт, реэкспорт, продажа или поставка)",
      "Другая деятельность, не включённая в перечень (пожалуйста, укажите)",
    ],
    otherInput: true,
  },
  {
    id: "q14", section: 3, type: "single",
    title: "14. Образование",
    hint: "Выберите один вариант",
    options: ["Высшее", "Колледж", "Среднее", "Неоконченное среднее"],
  },

  // ── Секция 5: Финансы ──────────────────────────────────────────
  {
    id: "q15", section: 4, type: "multi",
    title: "15. Укажите источники происхождения денег, которые будут поступать на Ваши счета в Банке",
    hint: "Выберите один или несколько вариантов",
    options: [
      "Доход от предпринимательской деятельности",
      "Заработная плата, гонорар, вознаграждение от работодателя",
      "Стипендия, пособие, пенсия", "Продажа недвижимости или иного имущества",
      "Проценты, дивиденды, акции, доли капитала",
      "Наследство, дарение, безвозмездная помощь / Заёмные средства", "Другое",
    ],
  },
  {
    id: "q16", section: 4, type: "multi",
    title: "16. Распределение ваших основных активов",
    hint: "Возможны несколько ответов",
    options: ["Депозиты", "Недвижимость", "Финансовые инструменты", "Драгоценные металлы",
      "Банковские депозиты", "Другое"],
    conditional: {
      when: "Недвижимость",
      field: { type: "number", label: "Стоимость в USD (Недвижимость)" },
    },
  },
  {
    id: "q17", section: 4, type: "number",
    title: "17. Годовой доход (USD)", placeholder: "10 000 $",
  },
  {
    id: "q18", section: 4, type: "number",
    title: "18. Годовые расходы (USD)", placeholder: "5 000 $",
  },
  {
    id: "q19", section: 4, type: "countryMulti",
    title: "19. Укажите страны, из которых планируются зачисления денежных средств на ваши брокерские счета",
    placeholder: "Укажите страны",
  },
  {
    id: "q20", section: 4, type: "countryMulti",
    title: "20. Укажите страны, в которые планируете совершать выводы денежных средств с брокерских счетов в нашей компании",
    placeholder: "Укажите страны",
  },

  // ── Секция 6: Дополнительно ────────────────────────────────────
  {
    id: "q21", section: 5, type: "single",
    title: "21. Имеете ли Вы принадлежность к публичным должностным лицам (ПДЛ) или связанным с ними лицам?",
    hint: "Выберите один вариант",
    options: [
      "Нет, не являюсь ПДЛ / связанным лицом с ПДЛ",
      "Да, я сам являюсь ПДЛ",
      "Да, я являюсь лицом, связанным с ПДЛ",
    ],
  },
  {
    id: "q22", section: 5, type: "single",
    title: "22. Судимость",
    hint: "Выберите один вариант",
    options: ["Не был судим", "Да, есть закрытая судимость", "Да, есть открытая судимость",
      "Нахожусь под следствием/судом"],
  },
];

// Моковый список стран для country / countryMulti.
const COUNTRIES = [
  "Россия (RU)", "Казахстан (KZ)", "Кыргызстан (KG)", "Узбекистан (UZ)",
  "Армения (AM)", "Беларусь (BY)", "Грузия (GE)", "Турция (TR)",
  "ОАЭ (AE)", "Германия (DE)", "США (US)", "Великобритания (GB)",
];

const FONT = "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', system-ui, sans-serif";

/* ═══════════════════════════════════════════════
   ЛОКАЛЬНЫЕ ПРИМИТИВЫ (копии стиля аппа)
   ═══════════════════════════════════════════════ */

function OnbStatusBar({ C }) {
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

// Полноэкранный оверлей онбординга. zIndex 400 — выше LockScreen (300), т.к. это пре-авторизационный гейт.
function OnbShell({ C, title, onBack, children, footer }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      maxWidth: 430, margin: "0 auto",
      backgroundColor: C.bg, fontFamily: FONT,
      display: "flex", flexDirection: "column",
      animation: "screen-slide-in 0.25s ease-out",
    }}>
      <OnbStatusBar C={C} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px 12px", flexShrink: 0 }}>
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
      <div style={{ flex: 1, overflowY: "auto", overflowX: "clip" }}>{children}</div>
      {footer && (
        <div style={{ flexShrink: 0, padding: "12px 20px calc(env(safe-area-inset-bottom, 0px) + 20px)", borderTop: `1px solid ${C.divider}`, backgroundColor: C.bg }}>
          {footer}
        </div>
      )}
    </div>
  );
}

function OnbButton({ C, label, onClick, variant = "primary", disabled, icon }) {
  const primary = variant === "primary";
  const danger = variant === "danger";
  const bg = disabled ? C.faint : danger ? "#EF4444" : primary ? C.accentDark : C.faint;
  const fg = disabled ? C.muted : danger ? "#fff" : primary ? C.accent : C.text;
  return (
    <div data-press onClick={() => !disabled && onClick && onClick()} style={{
      backgroundColor: bg, borderRadius: 12, padding: "15px 0",
      textAlign: "center", cursor: disabled ? "default" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>
      {icon}
      <span style={{ fontSize: 15, fontWeight: 700, color: fg }}>{label}</span>
    </div>
  );
}

function OnbField({ C, label, value, onChange, placeholder, numeric, mono }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{label}</div>}
      <div style={{
        backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
        padding: "13px 16px", display: "flex", alignItems: "center", gap: 8,
      }}>
        <input
          value={value || ""}
          onChange={e => onChange(numeric ? e.target.value.replace(/[^0-9.,]/g, "") : e.target.value)}
          placeholder={placeholder}
          inputMode={numeric ? "decimal" : "text"}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "inherit", minWidth: 0,
            ...(mono ? { fontFeatureSettings: "'tnum'", letterSpacing: 0.5 } : {}),
          }}
        />
      </div>
    </div>
  );
}

function ToggleRow({ C, label, sub, on, onToggle }) {
  const isDark = C.bg === "#0E0F0C";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
      <div style={{ flex: 1, paddingRight: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      <div onClick={onToggle} style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0, cursor: "pointer",
        backgroundColor: on ? C.accentDark : (isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"),
        position: "relative", transition: "background-color 0.2s",
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff",
          position: "absolute", top: 2, left: on ? 22 : 2, transition: "left 0.2s",
        }} />
      </div>
    </div>
  );
}

function SelectorRow({ C, value, placeholder, open, onClick }) {
  return (
    <div data-press onClick={onClick} style={{
      backgroundColor: C.card, borderRadius: 12, border: `1px solid ${open ? C.accent : C.border}`,
      padding: "13px 16px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
    }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: value ? C.text : C.muted, lineHeight: 1.35 }}>
        {value || placeholder}
      </span>
      {open
        ? <ChevronUp size={18} color={C.muted} strokeWidth={2} />
        : <ChevronDown size={18} color={C.muted} strokeWidth={2} />}
    </div>
  );
}

function CountryField({ C, multi, placeholder, value, onChange }) {
  const [open, setOpen] = useState(false);
  const arr = multi ? (Array.isArray(value) ? value : []) : [];
  const display = multi ? (arr.length ? arr.join(", ") : "") : (value || "");
  const select = (c) => {
    if (multi) onChange(arr.includes(c) ? arr.filter(x => x !== c) : [...arr, c]);
    else { onChange(c); setOpen(false); }
  };
  return (
    <div style={{ marginBottom: 4 }}>
      <SelectorRow C={C} value={display} placeholder={placeholder} open={open} onClick={() => setOpen(o => !o)} />
      {open && (
        <div style={{
          marginTop: 8, backgroundColor: C.card, borderRadius: 12,
          border: `1px solid ${C.border}`, overflow: "hidden",
        }}>
          {COUNTRIES.map((c, i) => {
            const sel = multi ? arr.includes(c) : value === c;
            return (
              <div key={c} data-press onClick={() => select(c)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer",
                borderBottom: i < COUNTRIES.length - 1 ? `1px solid ${C.divider}` : "none",
                backgroundColor: sel ? C.accentSoft : "transparent",
              }}>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>{c}</span>
                {sel && <Check size={16} color={C.accentDark} strokeWidth={2.6} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FileField({ C, label, note }) {
  const [attached, setAttached] = useState(false);
  return (
    <div style={{ marginBottom: 4 }}>
      <div
        data-press onClick={() => setAttached(a => !a)}
        style={{
          backgroundColor: attached ? C.accentSoft : C.card, borderRadius: 12,
          border: `1px dashed ${attached ? C.accent : C.border}`,
          padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
        }}
      >
        <Paperclip size={16} color={attached ? C.accentDark : C.muted} strokeWidth={2} />
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>
          {attached ? "паспорт.pdf · прикреплён" : (label || "Прикрепить документ")}
        </span>
        {attached && <Check size={16} color={C.accentDark} strokeWidth={2.6} />}
      </div>
      {note && <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{note}</div>}
    </div>
  );
}

function ProgressDots({ C, count, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 20px 8px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          height: 6, borderRadius: 3, transition: "all 0.2s",
          width: i === active ? 22 : 6,
          backgroundColor: i <= active ? C.accentDark : C.divider,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ОБЩИЕ ПОД-КОМПОНЕНТЫ (переиспользуются ветками)
   ═══════════════════════════════════════════════ */

// Ввод номера телефона + ИИН (12 цифр) с дисклеймерами из дизайна.
function PhoneIinEntry({ C, title, subtitle, cta, onBack, onNext }) {
  const [phone, setPhone] = useState("");
  const [iin, setIin] = useState("");
  const valid = phone.replace(/\D/g, "").length >= 10 && iin.length === 12;

  return (
    <OnbShell C={C} title={title} onBack={onBack}
      footer={<OnbButton C={C} label={cta} disabled={!valid} onClick={() => onNext({ phone, iin })} />}>
      <div style={{ padding: "8px 20px 24px" }}>
        {subtitle && <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, marginBottom: 20 }}>{subtitle}</div>}

        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Номер телефона</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
        }}>
          <Phone size={16} color={C.muted} strokeWidth={1.8} />
          <input
            value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9+ ]/g, ""))}
            placeholder="+7 700 000 00 00" inputMode="tel"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "inherit",
              fontFeatureSettings: "'tnum'", minWidth: 0,
            }}
          />
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>ИИН</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 18,
        }}>
          <input
            value={iin} onChange={e => setIin(e.target.value.replace(/\D/g, "").slice(0, 12))}
            placeholder="12 цифр" inputMode="numeric"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "inherit",
              fontFeatureSettings: "'tnum'", letterSpacing: 1, minWidth: 0,
            }}
          />
          <span style={{ fontSize: 12, color: C.muted, fontFeatureSettings: "'tnum'" }}>{iin.length}/12</span>
        </div>

        <div style={{
          backgroundColor: C.accentSoft, borderRadius: 12, padding: "12px 14px",
          display: "flex", gap: 10, marginBottom: 14,
        }}>
          <ShieldCheck size={18} color={C.accentDark} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.45 }}>
            Ваши средства застрахованы до ₸20 млн в рамках системы гарантирования депозитов
          </span>
        </div>

        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
          Продолжая, вы подтверждаете, что не являетесь публичным должностным лицом (ПДЛ) и согласны с
          обработкой данных по требованиям FATCA/CRS.
        </div>
      </div>
    </OnbShell>
  );
}

// Экран «Код-пароль»: 6 цифр, цифровая клавиатура, таймер, «Повторить». Стиль — как LockScreen.
function OtpKeypad({ C, title, phoneHint, onBack, onDone }) {
  const [code, setCode] = useState("");
  const [secs, setSecs] = useState(59);
  const OTP_LEN = 6;

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const press = (d) => setCode(prev => {
    if (prev.length >= OTP_LEN) return prev;
    const next = prev + d;
    if (next.length === OTP_LEN) setTimeout(onDone, 250);
    return next;
  });

  const Key = ({ children, onClick, ghost }) => (
    <div data-press onClick={onClick} style={{
      width: 68, height: 68, borderRadius: "50%",
      backgroundColor: ghost ? "transparent" : C.faint,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 24, fontWeight: 600, color: C.text, cursor: "pointer", userSelect: "none",
    }}>{children}</div>
  );

  return (
    <OnbShell C={C} title={title || "Код-пароль"} onBack={onBack}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 20px 32px", height: "100%" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.sub, textAlign: "center", marginBottom: 4 }}>
          Введите код из SMS
        </div>
        {phoneHint && <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Отправлен на {phoneHint}</div>}

        <div style={{ display: "flex", gap: 12, margin: "24px 0 28px" }}>
          {Array.from({ length: OTP_LEN }).map((_, i) => (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: "50%",
              backgroundColor: i < code.length ? C.accentDark : C.divider,
              transition: "background-color 0.15s",
            }} />
          ))}
        </div>

        <div style={{ fontSize: 13, color: C.muted, marginBottom: "auto", minHeight: 20 }}>
          {secs > 0
            ? `Повторить код доступно через 0:${String(secs).padStart(2, "0")}`
            : <span data-press onClick={() => setSecs(59)} style={{ color: C.accentDark, fontWeight: 700, cursor: "pointer" }}>Повторить код</span>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 68px)", gap: "16px 26px", marginTop: 16 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <Key key={n} onClick={() => press(String(n))}>{n}</Key>
          ))}
          <div />
          <Key onClick={() => press("0")}>0</Key>
          <Key ghost onClick={() => setCode(c => c.slice(0, -1))}>
            <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
              <path d="M9 6h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7 6-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" style={{ color: C.muted }}/>
              <path d="M12.5 10.5l5 5M17.5 10.5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ color: C.muted }}/>
            </svg>
          </Key>
        </div>
      </div>
    </OnbShell>
  );
}

// Sumsub-под-машина: intro → selfie → checking → success/rejected/pending.
// Управляемая фаза задаётся initialPhase (для дебаг-джампера через key-ремоунт).
function SumsubFlow({ C, initialPhase, onBack, onDone, doneLabel }) {
  const [phase, setPhase] = useState(initialPhase || "intro");
  const footnote = (
    <div style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 16 }}>
      Основано на технологии Sumsub
    </div>
  );

  if (phase === "intro") {
    const items = [
      { icon: <CreditCard size={18} color={C.accentDark} strokeWidth={2} />, t: "Личный документ", s: "Удостоверение личности или паспорт" },
      { icon: <Camera size={18} color={C.accentDark} strokeWidth={2} />, t: "Селфи", s: "Короткое видео для подтверждения личности" },
      { icon: <Globe size={18} color={C.accentDark} strokeWidth={2} />, t: "Адрес", s: "Подтверждение адреса проживания" },
    ];
    return (
      <OnbShell C={C} title="Идентификация" onBack={onBack}
        footer={<><OnbButton C={C} label="Начать" onClick={() => setPhase("selfie")} />{footnote}</>}>
        <div style={{ padding: "16px 20px 24px" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 6 }}>Подтверждение личности</div>
          <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, marginBottom: 24 }}>Займёт около 2 минут. Подготовьте документ.</div>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < items.length - 1 ? `1px solid ${C.divider}` : "none" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{it.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{it.t}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{it.s}</div>
              </div>
            </div>
          ))}
        </div>
      </OnbShell>
    );
  }

  if (phase === "selfie") {
    return (
      <OnbShell C={C} title="Селфи" onBack={() => setPhase("intro")}
        footer={<><OnbButton C={C} label="Сделать селфи" icon={<Camera size={18} color={C.accent} strokeWidth={2} />} onClick={() => setPhase("checking")} />{footnote}</>}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.sub, textAlign: "center", marginBottom: 28 }}>
            Расположите лицо внутри рамки
          </div>
          <div style={{
            width: 220, height: 280, borderRadius: 140, position: "relative",
            border: `3px solid ${C.accentDark}`, backgroundColor: C.faint,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 72, opacity: 0.35 }}>🙂</div>
            {[0, 90, 180, 270].map(deg => (
              <div key={deg} style={{
                position: "absolute", width: 28, height: 28,
                borderTop: `3px solid ${C.accent}`, borderLeft: `3px solid ${C.accent}`,
                top: "50%", left: "50%",
                transform: `rotate(${deg}deg) translate(-105px,-135px)`, transformOrigin: "top left",
              }} />
            ))}
          </div>
        </div>
      </OnbShell>
    );
  }

  if (phase === "checking") {
    return (
      <OnbShell C={C} title="Проверка" onBack={onBack}
        footer={<>
          <OnbButton C={C} label="Обновить статус" icon={<RefreshCw size={16} color={C.accent} strokeWidth={2} />} onClick={() => setPhase("success")} />
          <div style={{ height: 10 }} />
          <OnbButton C={C} label="Выйти" variant="secondary" onClick={onBack} />
          {footnote}
        </>}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 32px", textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", backgroundColor: C.accentSoft,
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
          }}>
            <Clock size={36} color={C.accentDark} strokeWidth={2} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 8 }}>Идёт проверка</div>
          <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5 }}>
            Мы получили ваши видео и документы и начали проверку. Обычно это занимает несколько минут.
          </div>
        </div>
      </OnbShell>
    );
  }

  if (phase === "rejected") {
    return (
      <OnbShell C={C} title="Идентификация" onBack={onBack}
        footer={<>
          <OnbButton C={C} label="Обратиться в поддержку" onClick={() => {}} />
          <div style={{ height: 10 }} />
          <OnbButton C={C} label="Начать заново" variant="secondary" onClick={() => setPhase("intro")} />
          {footnote}
        </>}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 32px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <X size={40} color="#EF4444" strokeWidth={3} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 8 }}>Проверка отклонена</div>
          <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5 }}>
            К сожалению, мы не смогли подтвердить вашу личность. Попробуйте пройти проверку заново или обратитесь в поддержку.
          </div>
        </div>
      </OnbShell>
    );
  }

  if (phase === "pending") {
    return (
      <OnbShell C={C} title="Идентификация" onBack={onBack}
        footer={<><OnbButton C={C} label="Перейти в приложение" onClick={onDone} />{footnote}</>}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 32px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: C.faint, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <FileText size={36} color={C.sub} strokeWidth={2} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 8 }}>Документы получены</div>
          <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5 }}>
            Мы получили ваши документы и сообщим, как только проверка будет завершена. Это может занять некоторое время.
          </div>
        </div>
      </OnbShell>
    );
  }

  // success
  return (
    <OnbShell C={C} title="Идентификация"
      footer={<><OnbButton C={C} label={doneLabel || "Перейти в приложение"} onClick={onDone} />{footnote}</>}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 32px", textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", backgroundColor: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", backgroundColor: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={30} color="#fff" strokeWidth={3} />
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Поздравляем!</div>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5 }}>Идентификация пройдена. Ваша личность успешно подтверждена.</div>
      </div>
    </OnbShell>
  );
}

// Финальный «Поздравляем!» → CTA → onComplete.
function OnbSuccess({ C, title, message, cta, onDone }) {
  return (
    <OnbShell C={C} title="" footer={<OnbButton C={C} label={cta || "Перейти в приложение"} onClick={onDone} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 36px", textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", backgroundColor: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", backgroundColor: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={30} color="#fff" strokeWidth={3} />
          </div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 10 }}>{title || "Поздравляем!"}</div>
        {message && <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5 }}>{message}</div>}
      </div>
    </OnbShell>
  );
}

/* ═══════════════════════════════════════════════
   AML — обобщённый рендер вопросов
   ═══════════════════════════════════════════════ */

function CondField({ C, field, value, onChange }) {
  return (
    <div style={{ marginTop: 4, marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${C.accent}` }}>
      {field.label && field.type !== "file" && (
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{field.label}</div>
      )}
      {field.type === "file" && <FileField C={C} label={field.label} note={field.note} />}
      {field.type === "number" && <OnbField C={C} numeric value={value} onChange={onChange} placeholder="Сумма в USD" />}
      {field.type === "multi" && field.options.map(opt => {
        const arr = Array.isArray(value) ? value : [];
        const sel = arr.includes(opt);
        return (
          <div key={opt} data-press onClick={() => onChange(sel ? arr.filter(o => o !== opt) : [...arr, opt])} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10,
            border: `1px solid ${sel ? C.accent : C.border}`, backgroundColor: sel ? C.accentSoft : C.card,
            cursor: "pointer", marginBottom: 6,
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
              border: `2px solid ${sel ? C.accentDark : C.border}`, backgroundColor: sel ? C.accentDark : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{sel && <Check size={11} color={C.accent} strokeWidth={3} />}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{opt}</span>
          </div>
        );
      })}
    </div>
  );
}

function AmlOption({ C, label, selected, multi, onClick }) {
  return (
    <div data-press onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 12,
      border: `1px solid ${selected ? C.accent : C.border}`,
      backgroundColor: selected ? C.accentSoft : C.card, cursor: "pointer", marginBottom: 8,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: multi ? 6 : 10, flexShrink: 0,
        border: `2px solid ${selected ? C.accentDark : C.border}`,
        backgroundColor: selected ? C.accentDark : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{selected && <Check size={12} color={C.accent} strokeWidth={3} />}</div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.35 }}>{label}</span>
    </div>
  );
}

function AmlQuestion({ C, q, all, set }) {
  const [expanded, setExpanded] = useState(false);
  const val = all[q.id];
  const lastOpt = q.options ? q.options[q.options.length - 1] : null;

  const Header = (
    <>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.4, marginBottom: q.hint ? 4 : 12 }}>{q.title}</div>
      {q.hint && <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{q.hint}</div>}
    </>
  );

  if (q.type === "single" || q.type === "multi") {
    const multi = q.type === "multi";
    const arr = multi ? (Array.isArray(val) ? val : []) : null;
    const isSel = (opt) => multi ? arr.includes(opt) : val === opt;
    const toggle = (opt) => {
      if (multi) set(q.id, arr.includes(opt) ? arr.filter(o => o !== opt) : [...arr, opt]);
      else set(q.id, opt);
    };
    const visible = q.collapsible && !expanded ? q.options.slice(0, q.collapsible) : q.options;
    const otherSelected = q.otherInput && (multi ? arr.includes(lastOpt) : val === lastOpt);
    return (
      <div style={{ marginBottom: 24 }}>
        {Header}
        {visible.map(opt => <AmlOption key={opt} C={C} label={opt} multi={multi} selected={isSel(opt)} onClick={() => toggle(opt)} />)}
        {q.collapsible && !expanded && q.options.length > q.collapsible && (
          <div data-press onClick={() => setExpanded(true)} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "10px 0", fontSize: 13, fontWeight: 700, color: C.accentDark, cursor: "pointer",
          }}>
            Показать ещё <ChevronDown size={16} color={C.accentDark} strokeWidth={2.4} />
          </div>
        )}
        {otherSelected && <OnbField C={C} placeholder="Укажите" value={all[q.id + "_other"]} onChange={v => set(q.id + "_other", v)} />}
        {q.conditional && val === q.conditional.when && (
          <CondField C={C} field={q.conditional.field} value={all[q.id + "_cond"]} onChange={v => set(q.id + "_cond", v)} />
        )}
      </div>
    );
  }

  if (q.type === "text" || q.type === "number") {
    return (
      <div style={{ marginBottom: 24 }}>
        {Header}
        <OnbField C={C} numeric={q.type === "number"} placeholder={q.placeholder} value={val} onChange={v => set(q.id, v)} />
        {q.example && <div style={{ fontSize: 11, color: C.muted, marginTop: -4 }}>Например: {q.example}</div>}
      </div>
    );
  }

  if (q.type === "country" || q.type === "countryMulti") {
    return (
      <div style={{ marginBottom: 24 }}>
        {Header}
        <CountryField C={C} multi={q.type === "countryMulti"} placeholder={q.placeholder} value={val} onChange={v => set(q.id, v)} />
      </div>
    );
  }

  return null;
}

function AmlForm({ C, all, set, onBack, onDone }) {
  const [section, setSection] = useState(0);
  const last = AML_SECTIONS.length - 1;
  const questions = AML_QUESTIONS.filter(q => q.section === section);

  const back = () => { if (section > 0) setSection(s => s - 1); else onBack(); };
  const next = () => { if (section < last) setSection(s => s + 1); else onDone(); };

  return (
    <OnbShell C={C} title={AML_SECTIONS[section]} onBack={back}
      footer={<OnbButton C={C} label={section < last ? "Следующий вопрос" : "Завершить"} onClick={next} />}>
      <ProgressDots C={C} count={AML_SECTIONS.length} active={section} />
      <div style={{ padding: "12px 20px 24px" }}>
        {questions.map(q => <AmlQuestion key={q.id} C={C} q={q} all={all} set={set} />)}
      </div>
    </OnbShell>
  );
}

/* ═══════════════════════════════════════════════
   ЭКРАНЫ ВЕТОК (контент из дизайнов)
   ═══════════════════════════════════════════════ */

// eResidency · шаг 1 — «Получите eResidency Казахстана»
function EresIntro({ C, onNext }) {
  const steps = [
    { n: "1", t: "Оформите eResidency онлайн", s: "Цифровая ID-карта, ИИН и eSIM — без визита в Казахстан" },
    { n: "2", t: "Войдите по номеру eSIM", s: "Используйте выданный номер для входа в приложение" },
  ];
  return (
    <OnbShell C={C} title="eResidency" footer={<OnbButton C={C} label="Получить eResidency" onClick={onNext} />}>
      <div style={{ padding: "16px 20px 24px" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, marginBottom: 20,
          background: "linear-gradient(135deg, #163300 0%, #1f4d00 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Globe size={30} color="#9FE870" strokeWidth={2} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text, lineHeight: 1.25, marginBottom: 8 }}>
          Получите eResidency Казахстана
        </div>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, marginBottom: 28 }}>
          Электронное резидентство даёт доступ к банковским услугам Freedom для нерезидентов РК.
        </div>
        {steps.map((st, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              backgroundColor: C.accentDark, color: C.accent, fontWeight: 800, fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{st.n}</div>
            <div style={{ flex: 1, paddingTop: 3 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{st.t}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 3, lineHeight: 1.45 }}>{st.s}</div>
            </div>
          </div>
        ))}
      </div>
    </OnbShell>
  );
}

// eResidency · шаг 2 — «Выпустите или активируйте карту»
function CardSelect({ C, value, onChange, onBack, onNext }) {
  const cards = [
    { id: "invest", name: "Invest Card", sub: "Инвестиционная — доступ к брокериджу Freedom24", icon: <TrendingUp size={20} color={C.accentDark} strokeWidth={2} /> },
    { id: "deposit", name: "Deposit Card", sub: "Мультивалютная — KZT, USD, EUR на одной карте", icon: <CreditCard size={20} color={C.accentDark} strokeWidth={2} /> },
  ];
  return (
    <OnbShell C={C} title="Выпуск карты" onBack={onBack}
      footer={<OnbButton C={C} label="Выпустить карту" disabled={!value} onClick={onNext} />}>
      <div style={{ padding: "16px 20px 24px" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 6 }}>Выпустите или активируйте карту</div>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, marginBottom: 24 }}>Выберите карту, которую хотите оформить первой.</div>
        {cards.map(card => {
          const sel = value === card.id;
          return (
            <div key={card.id} data-press onClick={() => onChange(card.id)} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "16px",
              borderRadius: 14, marginBottom: 12, cursor: "pointer",
              border: `1.5px solid ${sel ? C.accent : C.border}`,
              backgroundColor: sel ? C.accentSoft : C.card,
            }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{card.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{card.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.4 }}>{card.sub}</div>
              </div>
              {sel && <Check size={20} color={C.accentDark} strokeWidth={2.6} />}
            </div>
          );
        })}
      </div>
    </OnbShell>
  );
}

// eResidency · шаг 5 — «Адрес»
function AddressScreen({ C, all, set, onBack, onNext }) {
  const same = all.addr_same;
  return (
    <OnbShell C={C} title="Адрес" onBack={onBack} footer={<OnbButton C={C} label="Продолжить" onClick={onNext} />}>
      <div style={{ padding: "12px 20px 24px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Страна рождения</div>
        <CountryField C={C} placeholder="Выберите страну" value={all.addr_birth} onChange={v => set("addr_birth", v)} />

        <div style={{ height: 12 }} />
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Страна регистрации</div>
        <CountryField C={C} placeholder="Выберите страну" value={all.addr_reg} onChange={v => set("addr_reg", v)} />

        <div style={{ height: 12 }} />
        <OnbField C={C} label="Адрес регистрации" placeholder="Город, улица, дом, квартира" value={all.addr_reg_line} onChange={v => set("addr_reg_line", v)} />

        <div style={{ borderTop: `1px solid ${C.divider}`, marginTop: 8 }}>
          <ToggleRow C={C} label="Адрес проживания совпадает с адресом регистрации" on={!!same} onToggle={() => set("addr_same", !same)} />
        </div>

        {!same && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, marginTop: 4 }}>Страна проживания</div>
            <CountryField C={C} placeholder="Выберите страну" value={all.addr_live} onChange={v => set("addr_live", v)} />
            <div style={{ height: 12 }} />
            <OnbField C={C} label="Адрес проживания" placeholder="Город, улица, дом, квартира" value={all.addr_live_line} onChange={v => set("addr_live_line", v)} />
          </>
        )}
      </div>
    </OnbShell>
  );
}

// changeNumber · шаг 1 — «Сменить номер»
function ChgForm({ C, all, set, onBack, onNext }) {
  const valid = (all.chg_old || "").replace(/\D/g, "").length >= 10
    && (all.chg_iin || "").length === 12
    && (all.chg_new || "").replace(/\D/g, "").length >= 10;
  return (
    <OnbShell C={C} title="Сменить номер" onBack={onBack}
      footer={<OnbButton C={C} label="Продолжить" disabled={!valid} onClick={onNext} />}>
      <div style={{ padding: "12px 20px 24px" }}>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, marginBottom: 20 }}>
          Укажите текущий и новый номера телефона. После проверки данных мы перенесём ваш аккаунт на новый номер.
        </div>
        <OnbField C={C} mono label="Старый номер телефона" placeholder="+7 700 000 00 00" value={all.chg_old} onChange={v => set("chg_old", v.replace(/[^0-9+ ]/g, ""))} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>ИИН</div>
          <div style={{
            backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
            padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
          }}>
            <input
              value={all.chg_iin || ""} onChange={e => set("chg_iin", e.target.value.replace(/\D/g, "").slice(0, 12))}
              placeholder="12 цифр" inputMode="numeric"
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "inherit", fontFeatureSettings: "'tnum'", letterSpacing: 1, minWidth: 0 }}
            />
            <span style={{ fontSize: 12, color: C.muted, fontFeatureSettings: "'tnum'" }}>{(all.chg_iin || "").length}/12</span>
          </div>
        </div>
        <OnbField C={C} mono label="Новый номер телефона" placeholder="+7 777 000 00 00" value={all.chg_new} onChange={v => set("chg_new", v.replace(/[^0-9+ ]/g, ""))} />
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, marginTop: 8 }}>
          Продолжая, вы даёте согласие на обработку персональных данных и подтверждаете, что новый номер
          принадлежит вам.
        </div>
      </div>
    </OnbShell>
  );
}

// changeNumber · шаг 2 — «Заявление на изменение анкетных данных»
function ChgStatement({ C, all, onBack, onNext }) {
  return (
    <OnbShell C={C} title="Заявление" onBack={onBack}
      footer={<>
        <OnbButton C={C} label="Отправить" onClick={onNext} />
        <div style={{ height: 10 }} />
        <OnbButton C={C} label="Закрыть" variant="secondary" onClick={onBack} />
      </>}>
      <div style={{ padding: "12px 20px 24px" }}>
        <div style={{
          backgroundColor: C.card, borderRadius: 14, border: `1px solid ${C.border}`,
          padding: "20px 18px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <FileText size={20} color={C.accentDark} strokeWidth={2} />
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, lineHeight: 1.3 }}>
              Заявление на изменение анкетных данных
            </div>
          </div>
          {[
            "Прошу изменить номер телефона, привязанный к моему аккаунту в Freedom Bank.",
            `Текущий номер: ${all.chg_old || "—"}`,
            `Новый номер: ${all.chg_new || "—"}`,
            `ИИН: ${all.chg_iin || "—"}`,
            "Подтверждаю достоверность указанных данных и принимаю условия обслуживания банка.",
          ].map((line, i) => (
            <div key={i} style={{ fontSize: 13, color: C.sub, lineHeight: 1.6, marginBottom: 10 }}>{line}</div>
          ))}
          <div style={{ borderTop: `1px solid ${C.divider}`, marginTop: 8, paddingTop: 12, fontSize: 12, color: C.muted }}>
            Документ будет подписан кодом из SMS на следующем шаге.
          </div>
        </div>
      </div>
    </OnbShell>
  );
}

// changeNumber · шаг 5 — «Смена номера телефона — В процессе»
function ChgProcessing({ C, all, onComplete }) {
  return (
    <OnbShell C={C} title="" footer={<OnbButton C={C} label="Перейти в приложение" onClick={onComplete} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 32px", textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", backgroundColor: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Clock size={40} color={C.accentDark} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>Смена номера телефона</div>
        <div style={{
          fontSize: 13, fontWeight: 700, color: C.accentDark, backgroundColor: C.accentSoft,
          borderRadius: 20, padding: "5px 14px", marginBottom: 16,
        }}>В процессе</div>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5 }}>
          Заявка принята и обрабатывается — это может занять до 1 суток. Вы можете продолжить пользоваться
          приложением, мы уведомим вас о завершении{all.chg_new ? `. Новый номер: ${all.chg_new}` : ""}.
        </div>
      </div>
    </OnbShell>
  );
}

// changeNumber · опц. — макет пуш-уведомления
function ChgPush({ C, all, onComplete }) {
  return (
    <OnbShell C={C} title="" footer={<OnbButton C={C} label="Перейти в приложение" onClick={onComplete} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", gap: 24 }}>
        <div style={{ fontSize: 13, color: C.muted }}>Так будет выглядеть уведомление</div>
        <div style={{
          width: "100%", backgroundColor: C.card, borderRadius: 18,
          border: `1px solid ${C.border}`, padding: "14px 16px",
          display: "flex", gap: 12, boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #163300 0%, #1f4d00 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Bell size={20} color="#9FE870" strokeWidth={2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>Freedom Banker</span>
              <span style={{ fontSize: 11, color: C.muted }}>сейчас</span>
            </div>
            <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.45, marginTop: 3 }}>
              Поздравляем! Вы успешно сменили номер на {all.chg_new || "+7 ···"}
            </div>
          </div>
        </div>
      </div>
    </OnbShell>
  );
}

/* ═══════════════════════════════════════════════
   РОУТЕР — экраны единого входа
   ═══════════════════════════════════════════════ */

// Старт — ввод номера телефона (только номер; ИИН спрашиваем позже, если номера нет в БД).
function PhoneEntry({ C, onNext }) {
  const [phone, setPhone] = useState("");
  const valid = phone.replace(/\D/g, "").length >= 10;
  return (
    <OnbShell C={C} title="Вход" footer={<OnbButton C={C} label="Продолжить" disabled={!valid} onClick={() => onNext({ phone })} />}>
      <div style={{ padding: "16px 20px 24px" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, marginBottom: 20,
          background: "linear-gradient(135deg, #163300 0%, #1f4d00 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#9FE870" }}>F</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 8 }}>Freedom Banker</div>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, marginBottom: 24 }}>
          Введите номер телефона — войдём, если у вас уже есть аккаунт, или поможем зарегистрироваться.
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Номер телефона</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 18,
        }}>
          <Phone size={16} color={C.muted} strokeWidth={1.8} />
          <input
            value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9+ ]/g, ""))}
            placeholder="+7 700 000 00 00" inputMode="tel"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "inherit",
              fontFeatureSettings: "'tnum'", minWidth: 0,
            }}
          />
        </div>

        <div style={{
          backgroundColor: C.accentSoft, borderRadius: 12, padding: "12px 14px",
          display: "flex", gap: 10, marginBottom: 14,
        }}>
          <ShieldCheck size={18} color={C.accentDark} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.45 }}>
            Ваши средства застрахованы до ₸20 млн в рамках системы гарантирования депозитов
          </span>
        </div>
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
          Продолжая, вы подтверждаете, что не являетесь публичным должностным лицом (ПДЛ) и согласны с
          обработкой данных по требованиям FATCA/CRS.
        </div>
      </div>
    </OnbShell>
  );
}

// Этап ввода ИИН — развилка: «Ввести ИИН» или «У меня нет ИИН».
function IinStage({ C, onBack, onEnterIin, onNoIin }) {
  return (
    <OnbShell C={C} title="Регистрация" onBack={onBack}>
      <div style={{ padding: "16px 20px 24px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Этот номер пока не с нами</div>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, marginBottom: 28 }}>
          Чтобы продолжить, укажите ИИН Казахстана. Если ИИН нет — оформим электронное резидентство.
        </div>

        <div data-press onClick={onEnterIin} style={{
          display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 14,
          marginBottom: 12, cursor: "pointer", border: `1.5px solid ${C.border}`, backgroundColor: C.card,
        }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Check size={20} color={C.accentDark} strokeWidth={2.4} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>У меня есть ИИН</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Резидент РК или есть ИИН Казахстана</div>
          </div>
          <ChevronRight size={18} color={C.muted} strokeWidth={2} />
        </div>

        <div data-press onClick={onNoIin} style={{
          display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 14,
          cursor: "pointer", border: `1.5px solid ${C.border}`, backgroundColor: C.card,
        }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Globe size={20} color={C.accentDark} strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>У меня нет ИИН</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Оформить eResidency Казахстана</div>
          </div>
          <ChevronRight size={18} color={C.muted} strokeWidth={2} />
        </div>
      </div>
    </OnbShell>
  );
}

// Ввод ИИН — 12 цифр + подсказка «Где найти ИИН».
function IinEntry({ C, value, onChange, onBack, onNext }) {
  const iin = value || "";
  const valid = iin.length === 12;
  return (
    <OnbShell C={C} title="Ввод ИИН" onBack={onBack}
      footer={<OnbButton C={C} label="Продолжить" disabled={!valid} onClick={onNext} />}>
      <div style={{ padding: "12px 20px 24px" }}>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, marginBottom: 20 }}>
          Введите индивидуальный идентификационный номер (ИИН) Казахстана.
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>ИИН</div>
        <div style={{
          backgroundColor: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 18,
        }}>
          <input
            value={iin} onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 12))}
            placeholder="12 цифр" inputMode="numeric"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "inherit",
              fontFeatureSettings: "'tnum'", letterSpacing: 1, minWidth: 0,
            }}
          />
          <span style={{ fontSize: 12, color: C.muted, fontFeatureSettings: "'tnum'" }}>{iin.length}/12</span>
        </div>
        <div style={{ backgroundColor: C.faint, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>Где найти ИИН</div>
          <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>
            Граждане РК — в удостоверении личности или в приложении eGov. Иностранным гражданам ИИН
            выдаётся при оформлении eResidency.
          </div>
        </div>
      </div>
    </OnbShell>
  );
}

// eResidency — экран редиректа во внешний сервис (мок), возврат ко входу.
function EresRedirect({ C, onBackToLogin }) {
  return (
    <OnbShell C={C} title="eResidency" footer={<OnbButton C={C} label="Вернуться ко входу" onClick={onBackToLogin} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 32px", textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", backgroundColor: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Globe size={40} color={C.accentDark} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Переходим в eResidency</div>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5 }}>
          Откроется приложение eResidency Казахстана. После получения ID-карты, ИИН и номера eSIM
          вернитесь и войдите в Freedom Banker по выданному номеру.
        </div>
      </div>
    </OnbShell>
  );
}

/* ═══════════════════════════════════════════════
   КОРНЕВОЙ КОМПОНЕНТ — мини-роутер онбординга
   ═══════════════════════════════════════════════ */

export default function OnboardingFlow({ C, initial, onComplete }) {
  const [gates, setGates] = useState((initial && initial.gates) || { numberInDb: false, isDemoUser: false, iinExists: false });
  const [stepKey, setStepKey] = useState((initial && initial.stepKey) || ONB_START);
  const [sumsubPhase, setSumsubPhase] = useState((initial && initial.sub) || "intro");
  const [formData, setFormData] = useState({});

  // Синхронизация с дебаг-меню (initial меняется из BottomSheet: гейты, прыжок на шаг, фаза Sumsub).
  const initGates = initial && initial.gates;
  const initStep = initial && initial.stepKey;
  const initSub = initial && initial.sub;
  useEffect(() => {
    if (initGates) setGates(initGates);
    if (initStep) setStepKey(initStep);
    setSumsubPhase(initSub || "intro");
  }, [initGates, initStep, initSub]);

  const step = ONB_STEPS.find(s => s.key === stepKey) || ONB_STEPS[0];

  const goTo = (k) => { if (!k) { onComplete(); return; } setStepKey(k); };
  const goNext = () => {
    const n = typeof step.next === "function" ? step.next(gates, formData) : step.next;
    goTo(n);
  };
  const goBack = () => { if (step.back) setStepKey(step.back); };
  const set = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  switch (stepKey) {
    // ── Роутер (единый вход) ──
    case "phone_entry":
      return <PhoneEntry C={C} onNext={(d) => { set("phone", d.phone); goNext(); }} />;
    case "otp_login":
      return <OtpKeypad C={C} title="Код-пароль" phoneHint={formData.phone} onBack={goBack} onDone={goNext} />;
    case "authorize":
      return <OnbSuccess C={C} title="Вход выполнен" message="Добро пожаловать в Freedom Banker." cta="Перейти в приложение" onDone={onComplete} />;
    case "iin_stage":
      return <IinStage C={C} onBack={goBack} onEnterIin={() => goTo("iin_entry")} onNoIin={() => goTo("eres_intro")} />;
    case "iin_entry":
      return <IinEntry C={C} value={formData.iin} onChange={v => set("iin", v)} onBack={goBack} onNext={goNext} />;
    case "otp_changenum":
      return <OtpKeypad C={C} title="Код-пароль" phoneHint={formData.phone} onBack={goBack} onDone={goNext} />;

    // ── A · Онбординг-профиль (демо-юзер) ──
    case "card_select":
      return <CardSelect C={C} value={formData.card} onChange={v => set("card", v)} onBack={goBack} onNext={goNext} />;
    case "aml_form":
      return <AmlForm C={C} all={formData} set={set} onBack={goBack} onDone={goNext} />;
    case "address":
      return <AddressScreen C={C} all={formData} set={set} onBack={goBack} onNext={goNext} />;
    case "app_success":
      return <OnbSuccess C={C} title="Поздравляем!" message="Регистрация завершена. Добро пожаловать в Freedom Banker." cta="Перейти в приложение" onDone={onComplete} />;

    // ── B · Смена номера ──
    case "chg_form":
      return <ChgForm C={C} all={formData} set={set} onBack={goBack} onNext={goNext} />;
    case "chg_statement":
      return <ChgStatement C={C} all={formData} onBack={goBack} onNext={goNext} />;
    case "chg_processing":
      return <ChgProcessing C={C} all={formData} onComplete={onComplete} />;

    // ── C · eResidency ──
    case "eres_intro":
      return <EresIntro C={C} onNext={goNext} />;
    case "eres_redirect":
      return <EresRedirect C={C} onBackToLogin={() => goTo("phone_entry")} />;

    // ── Sumsub (общий для A и B) ──
    case "sumsub":
    case "chg_sumsub":
      return (
        <SumsubFlow
          key={sumsubPhase} C={C} initialPhase={sumsubPhase}
          onBack={goBack} onDone={goNext}
          doneLabel={stepKey === "chg_sumsub" ? "Продолжить" : "Перейти в приложение"}
        />
      );

    default:
      return <PhoneEntry C={C} onNext={(d) => { set("phone", d.phone); goNext(); }} />;
  }
}

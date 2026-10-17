import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  CloudMoon,
  Download,
  Eye,
  Feather,
  Heart,
  House,
  KeyRound,
  Leaf,
  LoaderCircle,
  Moon,
  Orbit,
  Route,
  ShieldCheck,
  Sparkles,
  Stars,
  Trash2,
  UserRound,
  Waves,
  Wind,
  X,
} from "lucide-react";
import {
  CelestialMark,
  MoonIllustration,
  Starfield,
} from "./components/Celestial";
import { interpretDream } from "./lib/interpret";
import type { DreamInput, DreamReport } from "./lib/interpret";

type SavedDream = {
  id: string;
  createdAt: string;
  input: DreamInput;
  report: DreamReport;
};
const AGE_KEY = "dreamwise-age";
const JOURNAL_KEY = "dreamwise-journal";
const AGES = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55–64", "65+"];
const DAY_MOODS = ["Happy", "Calm", "Okay", "Anxious", "Low"];
const DREAM_MOODS = ["Joyful", "Peaceful", "Curious", "Uneasy", "Afraid"];
const EXAMPLE =
  "I was walking through a quiet forest at dusk when I found a small door in an old tree. On the other side was an endless ocean. I began floating above the water, feeling weightless, while someone familiar waved to me from the shore.";
const dreamTypes = [
  { value: "dream", label: "Dream", icon: Moon },
  { value: "nightmare", label: "Nightmare", icon: CloudMoon },
  { value: "lucid", label: "Lucid dream", icon: Eye },
] as const;
const symbolIcons = {
  moon: Moon,
  water: Waves,
  flight: Wind,
  house: House,
  path: Route,
  nature: Leaf,
  person: UserRound,
  stars: Stars,
  key: KeyRound,
  heart: Heart,
};

function readAge() {
  try {
    const saved = localStorage.getItem(AGE_KEY);
    return saved && AGES.includes(saved) ? saved : "";
  } catch {
    return "";
  }
}

function readJournal(): SavedDream[] {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(JOURNAL_KEY) || "[]",
    );
    if (!Array.isArray(saved)) return [];
    return saved
      .filter((entry): entry is SavedDream => {
        if (
          !entry ||
          typeof entry.id !== "string" ||
          typeof entry.createdAt !== "string" ||
          !Number.isFinite(Date.parse(entry.createdAt))
        )
          return false;
        const input = entry.input;
        const report = entry.report;
        return Boolean(
          input &&
          typeof input.dream === "string" &&
          AGES.includes(input.age) &&
          ["dream", "nightmare", "lucid"].includes(input.dreamType) &&
          typeof input.dayMood === "string" &&
          typeof input.dreamMood === "string" &&
          report &&
          [
            "title",
            "subtitle",
            "summary",
            "emotionalInsight",
            "reflection",
            "affirmation",
            "interpretationNote",
          ].every((key) => typeof report[key] === "string") &&
          Array.isArray(report.symbols) &&
          report.symbols.every(
            (symbol: Record<string, unknown>) =>
              symbol &&
              typeof symbol.name === "string" &&
              typeof symbol.meaning === "string" &&
              typeof symbol.icon === "string",
          ) &&
          Array.isArray(report.emotions) &&
          report.emotions.every(
            (emotion: Record<string, unknown>) =>
              emotion &&
              typeof emotion.label === "string" &&
              typeof emotion.value === "number" &&
              Number.isFinite(emotion.value),
          ) &&
          ["themes", "prompts"].every(
            (key) =>
              Array.isArray(report[key]) &&
              report[key].every((item: unknown) => typeof item === "string"),
          ),
        );
      })
      .slice(0, 30);
  } catch {
    return [];
  }
}

function MoodFace({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={`mood-face ${className}`}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M11.5 12.7h.05m8.9 0h.05"
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
      {index === 0 ? (
        <path
          d="M10 17c1.3 6 10.7 6 12 0H10Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      ) : index === 1 ? (
        <path
          d="M11 18c2 3 8 3 10 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ) : index === 2 ? (
        <path
          d="M12 20h8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ) : index === 3 ? (
        <>
          <path
            d="m10 9.5 3 1m6 0 3-1M11 21c2-3 8-3 10 0"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M11 22c2-4 8-4 10 0"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="m10 9 3 1m6 0 3-1"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

function MoodSelector({
  label,
  hint,
  moods,
  value,
  onChange,
  error,
}: {
  label: string;
  hint: string;
  moods: string[];
  value: string;
  onChange: (mood: string) => void;
  error?: string;
}) {
  const errorId = useId();
  return (
    <fieldset
      className={`mood-field ${error ? "has-error" : ""}`}
      aria-describedby={error ? errorId : undefined}
    >
      <legend>
        {label}
        <span>{hint}</span>
      </legend>
      <div className="mood-options">
        {moods.map((mood, index) => (
          <label
            className={`mood-option ${value === mood ? "selected" : ""}`}
            key={mood}
          >
            <input
              type="radio"
              name={label}
              value={mood}
              checked={value === mood}
              onChange={() => onChange(mood)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
            <MoodFace index={index} />
            <span>{mood}</span>
          </label>
        ))}
      </div>
      {error && (
        <span id={errorId} className="field-error">
          {error}
        </span>
      )}
    </fieldset>
  );
}

function SectionEyebrow({
  children,
  number,
}: {
  children: ReactNode;
  number: string;
}) {
  return (
    <div className="section-eyebrow">
      <span>{number}</span>
      <span className="eyebrow-line" />
      {children}
    </div>
  );
}

export default function App() {
  const [dream, setDream] = useState("");
  const [age, setAge] = useState(readAge);
  const [dreamType, setDreamType] = useState<DreamInput["dreamType"]>("dream");
  const [dayMood, setDayMood] = useState("");
  const [dreamMood, setDreamMood] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<DreamReport | null>(null);
  const [reportInput, setReportInput] = useState<DreamInput | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [journal, setJournal] = useState(readJournal);
  const [journalOpen, setJournalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const dreamRef = useRef<HTMLTextAreaElement>(null);
  const reportRef = useRef<HTMLElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!isLoading) return;
    const timer = window.setInterval(
      () => setLoadingStep((step) => Math.min(step + 1, 2)),
      650,
    );
    return () => window.clearInterval(timer);
  }, [isLoading]);
  useEffect(() => {
    if (journalOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [journalOpen]);

  function clearError(key: string) {
    setErrors((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }
  function chooseAge(value: string) {
    setAge(value);
    clearError("age");
    try {
      if (value) localStorage.setItem(AGE_KEY, value);
      else localStorage.removeItem(AGE_KEY);
    } catch {
      setToast(
        "Your browser cannot remember your age right now. You can still explore your dream.",
      );
    }
  }
  function scrollTo(element: HTMLElement | null) {
    window.setTimeout(
      () =>
        element?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "start",
        }),
      80,
    );
  }
  function fillExample() {
    setDream(EXAMPLE);
    setDreamType("dream");
    setDayMood("Calm");
    setDreamMood("Curious");
    setErrors({});
    if (!age) chooseAge("25–34");
    dreamRef.current?.focus();
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    const nextErrors: Record<string, string> = {};
    if (dream.trim().length < 20)
      nextErrors.dream =
        "Tell us a little more — at least 20 characters helps us find the thread.";
    if (!age) nextErrors.age = "Choose your age range.";
    if (!dayMood) nextErrors.dayMood = "Choose how you felt during the day.";
    if (!dreamMood) nextErrors.dreamMood = "Choose how you felt in the dream.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      window.setTimeout(
        () =>
          document
            .querySelector<HTMLElement>(
              '[aria-invalid="true"], .has-error input',
            )
            ?.focus(),
        10,
      );
      return;
    }
    const input: DreamInput = {
      dream: dream.trim(),
      age,
      dreamType,
      dayMood,
      dreamMood,
    };
    setIsLoading(true);
    setLoadingStep(0);
    setReport(null);
    setSavedId(null);
    scrollTo(loadingRef.current);
    try {
      const generated = interpretDream(input);
      await new Promise((resolve) => window.setTimeout(resolve, 1900));
      if (!mounted.current) return;
      setReport(generated);
      setReportInput(input);
      setIsLoading(false);
      window.setTimeout(() => {
        scrollTo(reportRef.current);
        reportRef.current?.focus({ preventScroll: true });
      }, 40);
    } catch {
      setIsLoading(false);
      setToast(
        "We couldn’t finish your reading. Your dream is still here — please try again.",
      );
    }
  }
  function saveJournal() {
    if (!report || !reportInput || savedId) return;
    const entry: SavedDream = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      input: reportInput,
      report,
    };
    const next = [entry, ...journal].slice(0, 30);
    try {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
      setJournal(next);
      setSavedId(entry.id);
      setToast("A little piece of your night, saved to your journal.");
    } catch {
      setToast(
        "Your browser couldn’t save this dream. Download your reading to keep a copy.",
      );
    }
  }
  function deleteSaved(id: string) {
    const next = journal.filter((entry) => entry.id !== id);
    try {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
      setJournal(next);
      if (savedId === id) setSavedId(null);
    } catch {
      setToast("Your browser couldn’t update the journal. Please try again.");
    }
  }
  function openSaved(entry: SavedDream) {
    if (isLoading) return;
    setJournalOpen(false);
    setDream(entry.input.dream);
    chooseAge(entry.input.age);
    setDreamType(entry.input.dreamType);
    setDayMood(entry.input.dayMood);
    setDreamMood(entry.input.dreamMood);
    setReport(entry.report);
    setReportInput(entry.input);
    setSavedId(entry.id);
    setErrors({});
    window.setTimeout(() => scrollTo(reportRef.current), 100);
  }
  function startAgain() {
    setDream("");
    setDayMood("");
    setDreamMood("");
    setDreamType("dream");
    setReport(null);
    setReportInput(null);
    setSavedId(null);
    setErrors({});
    dreamRef.current?.focus();
    scrollTo(document.getElementById("dream-form"));
  }
  function downloadReport() {
    if (!report || !reportInput) return;
    const content = `DREAMWISE\n${report.title}\n${report.subtitle}\n\nYOUR DREAM\n${reportInput.dream}\n\nCONTEXT\nAge: ${reportInput.age} · ${reportInput.dreamType}\nDay mood: ${reportInput.dayMood} · Dream mood: ${reportInput.dreamMood}\n\nTHE BIG PICTURE\n${report.summary}\n\nSYMBOLS\n${report.symbols.map((symbol) => `${symbol.name}\n${symbol.meaning}`).join("\n\n")}\n\nEMOTIONAL LANDSCAPE\n${report.emotionalInsight}\n\nA MOMENT TO REFLECT\n${report.reflection}\n${report.prompts.map((prompt, index) => `${index + 1}. ${prompt}`).join("\n")}\n\nA THOUGHT TO TAKE WITH YOU\n${report.affirmation}\n\n${report.interpretationNote}`;
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `dreamwise-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <Starfield />
      <div className="site-content" id="top">
        <header className="site-header">
          <a href="#top" className="brand" aria-label="Dreamwise home">
            <CelestialMark />
            <span>
              dreamwise<span className="brand-period">.</span>
            </span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a className="nav-active" href="#dream-form">
              Interpret a dream
            </a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <button
            className="journal-button"
            aria-label="Your dream journal"
            onClick={() => setJournalOpen(true)}
          >
            <BookOpen size={16} />
            <span>Your dream journal</span>
            {journal.length > 0 ? (
              <span className="journal-count">{journal.length}</span>
            ) : (
              <ArrowUpRight size={14} />
            )}
          </button>
        </header>

        <main className="main-container">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow">
                <Sparkles size={13} />A LITTLE CLARITY, AFTER DARK
              </div>
              <h1 id="hero-title">
                Make sense of
                <br />
                your <em>midnight.</em>
              </h1>
              <p>
                A quiet space for your sleeping mind.
                <br className="desktop-break" /> Uncover the meaning in the
                stories only you can dream.
              </p>
              <a href="#dream-form" className="hero-link">
                Let’s see where your mind wandered <ArrowDown size={14} />
              </a>
            </div>
            <div className="hero-art">
              <MoonIllustration />
              <div className="art-caption">
                <span /> THE NIGHT HAS A WAY OF REVEALING THINGS.
              </div>
            </div>
          </section>

          <section
            className="dream-form-section"
            id="dream-form"
            aria-labelledby="form-heading"
          >
            <div className="form-heading">
              <div>
                <div className="eyebrow">
                  <span className="tiny-star">✦</span> A WINDOW INTO YOUR INNER
                  WORLD
                </div>
                <h2 id="form-heading">What did you dream?</h2>
              </div>
              <button
                className="example-button"
                onClick={fillExample}
                disabled={isLoading}
              >
                Try an example <ArrowUpRight size={14} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Interpret your dream"
            >
              <fieldset className="form-fields" disabled={isLoading}>
                <div
                  className={`dream-textarea-wrap ${errors.dream ? "invalid" : ""}`}
                >
                  <Feather className="textarea-feather" size={19} />
                  <label className="sr-only" htmlFor="dream">
                    Tell us your dream
                  </label>
                  <textarea
                    id="dream"
                    ref={dreamRef}
                    value={dream}
                    onChange={(event) => {
                      setDream(event.target.value);
                      clearError("dream");
                    }}
                    placeholder={
                      "I remember being somewhere I’d never been before…\nStart with a moment, a feeling, a face. Every little detail belongs here."
                    }
                    maxLength={5000}
                    aria-invalid={Boolean(errors.dream)}
                    aria-describedby={
                      errors.dream ? "dream-error" : "dream-hint"
                    }
                  />
                  <div className="textarea-bottom">
                    <span id="dream-hint">
                      No detail is too small. No dream is too strange.
                    </span>
                    <span>
                      {dream.length.toLocaleString()}{" "}
                      <span className="counter-divider">/</span> 5,000
                    </span>
                  </div>
                </div>
                {errors.dream && (
                  <p id="dream-error" className="field-error">
                    {errors.dream}
                  </p>
                )}

                <div className="context-row">
                  <div className="age-field">
                    <label className="field-label" htmlFor="age">
                      Your age <span>A little context helps</span>
                    </label>
                    <div className="select-wrap">
                      <select
                        id="age"
                        value={age}
                        onChange={(event) => chooseAge(event.target.value)}
                        aria-invalid={Boolean(errors.age)}
                        aria-describedby={errors.age ? "age-error" : undefined}
                      >
                        <option value="">Select age range</option>
                        {AGES.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={15} />
                    </div>
                    {errors.age && (
                      <span id="age-error" className="field-error">
                        {errors.age}
                      </span>
                    )}
                  </div>
                  <fieldset className="dream-type-field">
                    <legend className="field-label">
                      A dream, or something more?
                    </legend>
                    <div className="dream-types">
                      {dreamTypes.map(({ value, label, icon: Icon }) => (
                        <label
                          key={value}
                          className={`dream-type ${dreamType === value ? "selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="dreamType"
                            value={value}
                            checked={dreamType === value}
                            onChange={() => setDreamType(value)}
                          />
                          <Icon size={17} strokeWidth={1.4} />
                          <span>{label}</span>
                          {dreamType === value && (
                            <span className="selection-dot" />
                          )}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <div className="mood-grid">
                  <MoodSelector
                    label="Your mood during the day"
                    hint="Before your head hit the pillow"
                    moods={DAY_MOODS}
                    value={dayMood}
                    onChange={(value) => {
                      setDayMood(value);
                      clearError("dayMood");
                    }}
                    error={errors.dayMood}
                  />
                  <MoodSelector
                    label="Your mood in the dream"
                    hint="How it felt to be there"
                    moods={DREAM_MOODS}
                    value={dreamMood}
                    onChange={(value) => {
                      setDreamMood(value);
                      clearError("dreamMood");
                    }}
                    error={errors.dreamMood}
                  />
                </div>
              </fieldset>
              <div className="form-footer">
                <div className="privacy-note">
                  <ShieldCheck size={17} strokeWidth={1.3} />
                  <span>Just you, your dreams, and a little perspective.</span>
                </div>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="spin" size={17} /> Finding the
                      meaning…
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Interpret my dream{" "}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <div ref={loadingRef} className="loading-anchor" aria-live="polite">
            {isLoading && (
              <div className="reading-loader">
                <div className="loading-orbit">
                  <Moon size={29} strokeWidth={1} />
                  <span />
                </div>
                <span className="eyebrow">A MOMENT FOR YOUR INNER WORLD</span>
                <h2>
                  {
                    [
                      "Listening to your story…",
                      "Connecting the symbols…",
                      "Finding the thread…",
                    ][loadingStep]
                  }
                </h2>
                <p>Some things become clearer when we pause.</p>
                <div className="loading-track">
                  <span />
                </div>
              </div>
            )}
          </div>

          {report && reportInput && (
            <section
              className="report-section"
              ref={reportRef}
              tabIndex={-1}
              aria-labelledby="report-title"
            >
              <div className="report-topline">
                <div className="eyebrow">
                  <Sparkles size={13} />
                  YOUR DREAM, UNFOLDED
                </div>
                <span className="reading-tag">
                  <span /> A personal reflection
                </span>
              </div>
              <div className="report-heading">
                <div>
                  <h2 id="report-title">{report.title}</h2>
                  <p>{report.subtitle}</p>
                </div>
                <div className="report-actions">
                  <button
                    onClick={downloadReport}
                    className="icon-button"
                    title="Download your reading"
                    aria-label="Download your reading"
                  >
                    <Download size={17} />
                  </button>
                  <button
                    className={`secondary-button ${savedId ? "saved" : ""}`}
                    onClick={saveJournal}
                    disabled={Boolean(savedId)}
                  >
                    {savedId ? <Check size={15} /> : <Bookmark size={15} />}
                    {savedId ? "Saved to journal" : "Save to journal"}
                  </button>
                </div>
              </div>
              <div className="report-overview report-card">
                <SectionEyebrow number="01">THE BIG PICTURE</SectionEyebrow>
                <h3>A conversation with your subconscious.</h3>
                <p>{report.summary}</p>
                <div className="theme-tags">
                  {report.themes.map((theme) => (
                    <span key={theme}>{theme}</span>
                  ))}
                </div>
                <div className="dream-quote">
                  <span>“</span>
                  <p>
                    {reportInput.dream.length > 220
                      ? `${reportInput.dream.slice(0, 217).trimEnd()}…`
                      : reportInput.dream}
                  </p>
                </div>
              </div>

              <div className="report-symbol-section">
                <SectionEyebrow number="02">
                  THE SYMBOLS THAT SURFACED
                </SectionEyebrow>
                <div className="symbol-grid">
                  {report.symbols.length === 0 && (
                    <article className="symbol-card symbol-fallback">
                      <div className="symbol-icon">
                        <Feather size={25} strokeWidth={1} />
                      </div>
                      <div>
                        <h3>Your own kind of symbolism.</h3>
                        <p>
                          No familiar motif stands out in this description — and
                          that’s perfectly natural. Notice the detail you
                          remember most clearly. What does it mean to you, and
                          where else have you felt something like it?
                        </p>
                      </div>
                    </article>
                  )}
                  {report.symbols.map((symbol, index) => {
                    const Icon =
                      symbolIcons[symbol.icon as keyof typeof symbolIcons] ||
                      Stars;
                    return (
                      <article
                        className={`symbol-card symbol-tone-${index % 3}`}
                        key={`${symbol.name}-${index}`}
                      >
                        <div className="symbol-icon">
                          <Icon size={26} strokeWidth={1} />
                          <span className="symbol-spark">✦</span>
                        </div>
                        <h3>{symbol.name}</h3>
                        <p>{symbol.meaning}</p>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="report-split">
                <article className="report-card emotional-card">
                  <SectionEyebrow number="03">
                    YOUR EMOTIONAL LANDSCAPE
                  </SectionEyebrow>
                  <h3>What’s beneath the surface.</h3>
                  <div className="emotion-graphic">
                    <svg viewBox="0 0 240 160" fill="none" aria-hidden="true">
                      <defs>
                        <radialGradient id="emotion-glow">
                          <stop stopColor="#a6b78e" stopOpacity=".15" />
                          <stop
                            offset="1"
                            stopColor="#a6b78e"
                            stopOpacity="0"
                          />
                        </radialGradient>
                      </defs>
                      <ellipse
                        cx="120"
                        cy="81"
                        rx="101"
                        ry="72"
                        fill="url(#emotion-glow)"
                      />
                      <ellipse
                        cx="120"
                        cy="83"
                        rx="95"
                        ry="29"
                        stroke="#a3b48d"
                        strokeOpacity=".25"
                        transform="rotate(-20 120 83)"
                      />
                      <ellipse
                        cx="120"
                        cy="83"
                        rx="77"
                        ry="55"
                        stroke="#a3b48d"
                        strokeOpacity=".2"
                        transform="rotate(29 120 83)"
                      />
                      <circle
                        cx="120"
                        cy="83"
                        r="46"
                        stroke="#a3b48d"
                        strokeOpacity=".18"
                        strokeDasharray="2 5"
                      />
                      <circle cx="41" cy="98" r="4" fill="#c7cfae" />
                      <circle cx="168" cy="47" r="3" fill="#d0b98c" />
                      <circle cx="169" cy="110" r="3.5" fill="#8eaeb2" />
                      <path
                        d="M132 62a23 23 0 1 0 6 37 23 23 0 0 1-6-37Z"
                        fill="#bec9a8"
                        fillOpacity=".85"
                      />
                      <path
                        d="m148 65 1.2 4.8L154 71l-4.8 1.2L148 77l-1.2-4.8L142 71l4.8-1.2Z"
                        fill="#d0b98c"
                      />
                    </svg>
                    <span>
                      {reportInput.dayMood}
                      <ArrowRight size={13} />
                      {reportInput.dreamMood}
                    </span>
                  </div>
                  <div className="emotion-bars">
                    {report.emotions.map((emotion, index) => (
                      <div
                        className={`emotion-row emotion-${index % 3}`}
                        key={emotion.label}
                      >
                        <span>{emotion.label}</span>
                        <div>
                          <i
                            style={{
                              width: `${Math.max(8, Math.min(100, emotion.value))}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="emotion-insight">{report.emotionalInsight}</p>
                  <span className="chart-note">
                    Reflective themes, not a psychological measurement.
                  </span>
                </article>
                <article className="report-card reflection-card">
                  <SectionEyebrow number="04">
                    A MOMENT TO REFLECT
                  </SectionEyebrow>
                  <h3>Carry the meaning into your day.</h3>
                  <p>{report.reflection}</p>
                  <div className="reflection-prompts">
                    {report.prompts.map((prompt, index) => (
                      <div key={prompt}>
                        <span>0{index + 1}</span>
                        <p>{prompt}</p>
                      </div>
                    ))}
                  </div>
                  <div className="gentle-practice">
                    <Feather size={18} strokeWidth={1.2} />
                    <p>
                      You don’t need all the answers.
                      <br />
                      Just notice what stays with you.
                    </p>
                  </div>
                </article>
              </div>

              <div className="affirmation">
                <Stars size={28} strokeWidth={0.8} />
                <span className="eyebrow">A THOUGHT TO TAKE WITH YOU</span>
                <p>“{report.affirmation}”</p>
                <span className="affirmation-line" />
              </div>
              <p className="interpretation-note">{report.interpretationNote}</p>
              <button className="new-dream-button" onClick={startAgain}>
                Explore another dream <ArrowRight size={15} />
              </button>
            </section>
          )}

          <div className="trust-strip">
            <span>
              <ShieldCheck size={15} strokeWidth={1.3} /> Private by nature
            </span>
            <span className="trust-dot">✦</span>
            <span>
              <Orbit size={16} strokeWidth={1.3} /> Made for your inner world
            </span>
            <span className="trust-dot">✦</span>
            <span>
              <Moon size={15} strokeWidth={1.3} /> A little closer to yourself
            </span>
          </div>

          <section className="how-section" id="how-it-works">
            <div className="how-intro">
              <div className="eyebrow">FROM MIDNIGHT TO MEANING</div>
              <h2>Your night. A new perspective.</h2>
              <p>
                Dreams don’t come with instructions.
                <br />A little reflection is a beautiful place to start.
              </p>
            </div>
            <div className="how-steps">
              <article>
                <span className="step-number">
                  01
                  <span />
                </span>
                <h3>Let it all out.</h3>
                <p>
                  A fleeting image or a whole adventure. Tell the story as you
                  remember it.
                </p>
              </article>
              <article>
                <span className="step-number">
                  02
                  <span />
                </span>
                <h3>Add a little you.</h3>
                <p>
                  Your life stage and feelings give your dream its own, personal
                  context.
                </p>
              </article>
              <article>
                <span className="step-number">
                  03
                  <span />
                </span>
                <h3>Follow the thread.</h3>
                <p>
                  Explore symbols, emotional patterns, and questions worth
                  sitting with.
                </p>
              </article>
            </div>
          </section>

          <section className="faq-section" aria-label="A little more clarity">
            <div className="faq-intro">
              <span className="eyebrow">A LITTLE MORE CLARITY</span>
              <h2>Wondering about something?</h2>
            </div>
            <div className="faq-items">
              <details>
                <summary>
                  How does my dream reading work?
                  <ChevronDown size={16} />
                </summary>
                <p>
                  Your reading is generated in your browser using a curated
                  collection of dream motifs, your life stage, and the feelings
                  you share. It offers symbolic possibilities and personal
                  reflection prompts, rather than a single fixed meaning.
                </p>
              </details>
              <details>
                <summary>
                  Are my dreams kept private?
                  <ChevronDown size={16} />
                </summary>
                <p>
                  Your dream text stays in your browser. We remember only your
                  selected age range automatically. Dreams are saved to this
                  device only when you choose “Save to journal”; you can delete
                  them there at any time. Clearing browser data removes saved
                  dreams.
                </p>
              </details>
              <details>
                <summary>
                  Does every dream have a hidden meaning?
                  <ChevronDown size={16} />
                </summary>
                <p>
                  Not necessarily. Dreams can weave together memories, feelings,
                  and everyday experiences. A reading is an invitation to
                  reflect, not a diagnosis, prediction, or statement of fact.
                  Keep what feels useful and let the rest go.
                </p>
              </details>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <a className="brand footer-brand" href="#top">
            <CelestialMark />
            <span>
              dreamwise<span className="brand-period">.</span>
            </span>
          </a>
          <span>A little wonder. A little understanding.</span>
          <a href="#dream-form">
            Meet your midnight <ArrowUpRight size={13} />
          </a>
        </footer>
      </div>

      <dialog
        className="journal-dialog"
        aria-labelledby="journal-title"
        ref={dialogRef}
        onClose={() => setJournalOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setJournalOpen(false);
        }}
      >
        <div className="journal-dialog-inner">
          <div className="journal-dialog-header">
            <div>
              <div className="eyebrow">LITTLE PIECES OF YOUR NIGHT</div>
              <h2 id="journal-title">
                Your dream journal<span>.</span>
              </h2>
            </div>
            <button
              className="icon-button"
              onClick={() => setJournalOpen(false)}
              aria-label="Close journal"
            >
              <X size={20} />
            </button>
          </div>
          <p className="journal-description">
            A collection of the places your mind has been.
            <br />
            Saved privately in this browser, just for you.
          </p>
          {journal.length === 0 ? (
            <div className="journal-empty">
              <div className="empty-moon">
                <Moon size={42} strokeWidth={0.8} />
                <Stars size={19} strokeWidth={1} />
              </div>
              <h3>Your story starts at midnight.</h3>
              <p>
                Save a reading and it will be waiting here
                <br />
                whenever you want to return to it.
              </p>
              <button
                className="primary-button"
                onClick={() => {
                  setJournalOpen(false);
                  scrollTo(document.getElementById("dream-form"));
                  dreamRef.current?.focus();
                }}
              >
                Explore a dream <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="journal-entries">
              {journal.map((entry) => (
                <article key={entry.id} className="journal-entry">
                  <div className="journal-entry-meta">
                    <span>
                      <Moon size={12} />
                      {entry.input.dreamType === "lucid"
                        ? "Lucid dream"
                        : entry.input.dreamType === "nightmare"
                          ? "Nightmare"
                          : "Dream"}
                    </span>
                    <time dateTime={entry.createdAt}>
                      {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                    <button
                      className="delete-button"
                      onClick={() => deleteSaved(entry.id)}
                      aria-label={`Delete ${entry.report.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <button
                    className="journal-entry-open"
                    disabled={isLoading}
                    onClick={() => openSaved(entry)}
                  >
                    <h3>
                      {entry.report.title}
                      <ArrowUpRight size={16} />
                    </h3>
                    <p>
                      {entry.input.dream.slice(0, 160)}
                      {entry.input.dream.length > 160 ? "…" : ""}
                    </p>
                    <span>
                      Return to this reading <ArrowRight size={13} />
                    </span>
                  </button>
                </article>
              ))}
            </div>
          )}
          <p className="journal-device-note">
            <ShieldCheck size={13} />
            Your journal lives on this device. Download readings to keep a
            backup.
          </p>
        </div>
      </dialog>
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          <span>{toast}</span>
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const GRADES = [3, 4, 5, 6, 7, 8];
const SUBJECTS = [
  { id: "math", label: "Math", blurb: "Number sense, operations, fractions, geometry, algebra, and data" },
  { id: "ela", label: "ELA", blurb: "Reading passages, evidence-based questions, vocabulary, and grammar" }
];

const REFERENCE_SHEETS = {
  5: ["1 foot = 12 inches", "1 yard = 3 feet", "1 mile = 5,280 feet", "1 pound = 16 ounces", "1 cup = 8 fluid ounces", "1 pint = 2 cups", "1 quart = 2 pints", "1 gallon = 4 quarts", "1 meter = 100 centimeters", "1 kilogram = 1,000 grams", "1 liter = 1,000 milliliters", "Volume of a rectangular prism: V = l × w × h or V = B × h"],
  6: ["Area of a rectangle: A = lw", "Area of a parallelogram: A = bh", "Area of a triangle: A = ½bh", "Area of a trapezoid: A = ½h(b₁ + b₂)", "Volume of a right rectangular prism: V = lwh or V = Bh", "1 foot = 12 inches, 1 yard = 3 feet, 1 mile = 5,280 feet", "1 pound = 16 ounces, 1 ton = 2,000 pounds"],
  7: ["Area of a triangle: A = ½bh", "Area of a trapezoid: A = ½h(b₁ + b₂)", "Circumference of a circle: C = 2πr or C = πd", "Area of a circle: A = πr²", "Volume of a right prism: V = Bh", "π ≈ 3.14 or 22/7"],
  8: ["Volume of a cylinder: V = πr²h", "Volume of a cone: V = ⅓πr²h", "Volume of a sphere: V = (4/3)πr³", "Pythagorean Theorem: a² + b² = c²", "Area of a circle: A = πr²", "Circumference: C = 2πr", "π ≈ 3.14"]
};

const STRONG_PERCENT = 70;
const USER_NAME_KEY = "njsla-user-name";
const RESULT_HISTORY_KEY = "njsla-result-history";
const RESULT_HISTORY_LIMIT = 5;

function readResultHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(RESULT_HISTORY_KEY) || "[]");
    return Array.isArray(saved) ? saved.slice(0, RESULT_HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

function NameEntry({ onSave }) {
  const [name, setName] = useState(() => localStorage.getItem(USER_NAME_KEY) || "");
  function submit(event) {
    event.preventDefault();
    const cleaned = name.trim();
    if (!cleaned) return;
    localStorage.setItem(USER_NAME_KEY, cleaned);
    onSave(cleaned);
  }
  return <form className="name-entry" onSubmit={submit}>
    <label htmlFor="student-name">Your name</label>
    <input id="student-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required placeholder="Enter your name" />
    <button className="primary-button" type="submit">Save name</button>
  </form>;
}

function focusById(id) {
  const target = document.getElementById(id);
  if (!target) return;
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus();
  target.scrollIntoView?.({ block: "start" });
}

function SkipLink({ target, children }) {
  return (
    <a
      className="skip-link"
      href={`#${target}`}
      onClick={(event) => {
        event.preventDefault();
        focusById(target);
      }}
    >
      {children}
    </a>
  );
}

function Shell({ children, wide = false, skipTarget = "main-content", skipLabel = "Skip to main content" }) {
  return (
    <>
      <SkipLink target={skipTarget}>{skipLabel}</SkipLink>
      <main className="page-shell" id="main-content" tabIndex={-1}>
        <div className={`app-frame ${wide ? "app-frame-wide" : ""}`}>{children}</div>
      </main>
    </>
  );
}

export function HomePage() {
  const [studentName, setStudentName] = useState(() => localStorage.getItem(USER_NAME_KEY) || "");
  return (
    <Shell>
      <section className="header-block">
        <p className="eyebrow">New Jersey Student Learning Assessment</p>
        <h1>NJSLA Practice Test</h1>
        <p className="lead">Practice the kinds of questions you will see on the NJSLA in ELA and Math. Every test is a new mix of questions.</p>
      </section>

      <NameEntry onSave={setStudentName} />
      <p className="history-link"><Link to="/previous-results">Review previous results</Link></p>

      <div className="button-grid" aria-label="Choose a grade">
        {studentName && GRADES.map((grade) => (
          <Link className="grade-button" key={grade} to={`/subjects/${grade}`}>
            Grade {grade}
          </Link>
        ))}
      </div>
    </Shell>
  );
}

export function SubjectSelection() {
  const { grade } = useParams();

  return (
    <Shell>
      <Link className="back-link" to="/">
        Back to grades
      </Link>
      <section className="header-block">
        <p className="eyebrow">Grade {grade}</p>
        <h1>Choose a Subject</h1>
      </section>

      <div className="button-grid subject-grid" aria-label="Choose a subject">
        {SUBJECTS.map((subject) => (
          <Link className="grade-button subject-button" key={subject.id} to={`/test/${grade}/${subject.id}`}>
            <span>{subject.label}</span>
            <small>{subject.blurb}</small>
          </Link>
        ))}
      </div>
    </Shell>
  );
}

function isAnswered(question, answer) {
  if (!question) return false;
  if (question.itemType === "evidence_based") {
    return Boolean(answer?.partA) && (Array.isArray(answer?.partB) ? answer.partB.length > 0 : Boolean(answer?.partB));
  }
  if (question.itemType === "multiple_select") return Array.isArray(answer) && answer.length > 0;
  return answer !== undefined && answer !== null && String(answer).trim() !== "";
}

function ChoiceList({ choices, selected, selectCount = 1, onChange, name, labelledBy, describedBy }) {
  const multi = selectCount > 1;
  const selectedList = multi ? (Array.isArray(selected) ? selected : []) : [];
  const buttonRefs = useRef([]);
  const selectedIndex = multi ? -1 : choices.indexOf(selected);

  function toggle(choice) {
    if (!multi) return onChange(choice);
    if (selectedList.includes(choice)) return onChange(selectedList.filter((item) => item !== choice));
    if (selectedList.length >= selectCount) return onChange([...selectedList.slice(1), choice]);
    return onChange([...selectedList, choice]);
  }

  function handleRadioKeyDown(event, index) {
    const last = choices.length - 1;
    const moves = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: last };
    if (!(event.key in moves)) return;
    event.preventDefault();
    let next = moves[event.key];
    if (next > last) next = 0;
    if (next < 0) next = last;
    onChange(choices[next]);
    buttonRefs.current[next]?.focus();
  }

  return (
    <div
      className="choice-list"
      role={multi ? "group" : "radiogroup"}
      aria-label={labelledBy ? undefined : name}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
    >
      {choices.map((choice, index) => {
        const isSelected = multi ? selectedList.includes(choice) : selected === choice;
        const tabIndex = multi || index === (selectedIndex === -1 ? 0 : selectedIndex) ? 0 : -1;
        return (
          <button
            className={`choice-button ${isSelected ? "selected" : ""}`}
            key={choice}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={isSelected}
            tabIndex={tabIndex}
            onClick={() => toggle(choice)}
            onKeyDown={multi ? undefined : (event) => handleRadioKeyDown(event, index)}
          >
            <span className={`choice-letter ${multi ? "choice-square" : ""}`} aria-hidden="true">
              {String.fromCharCode(65 + index)}
            </span>
            <span>
              <span className="visually-hidden">{String.fromCharCode(65 + index)}. </span>
              {choice}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionBody({ question, answer, onAnswer }) {
  if (question.itemType === "numeric_entry") {
    return (
      <label className="numeric-entry">
        <span>Type your answer:</span>
        <input
          inputMode="decimal"
          autoComplete="off"
          value={answer ?? ""}
          placeholder="Example: 42 or 3.5 or 3/4"
          onChange={(event) => onAnswer(event.target.value)}
        />
      </label>
    );
  }

  if (question.itemType === "evidence_based") {
    const current = answer || {};
    return question.parts.map((part, index) => {
      const key = index === 0 ? "partA" : "partB";
      const headingId = `${question.id}-${key}-question`;
      const instructionId = `${question.id}-${key}-instruction`;
      return (
        <div className="ebsr-part" key={part.label}>
          <h2 id={headingId}>{part.question}</h2>
          {part.selectCount > 1 && (
            <p className="item-instruction" id={instructionId}>
              Select {part.selectCount} answers.
            </p>
          )}
          <ChoiceList
            name={part.label}
            labelledBy={headingId}
            describedBy={part.selectCount > 1 ? instructionId : undefined}
            choices={part.choices}
            selectCount={part.selectCount}
            selected={current[key]}
            onChange={(value) => onAnswer({ ...current, [key]: value })}
          />
        </div>
      );
    });
  }

  return (
    <>
      {question.itemType === "multiple_select" && (
        <p className="item-instruction" id={`${question.id}-instruction`}>
          Select {question.selectCount} answers.
        </p>
      )}
      <ChoiceList
        name="Answer choices"
        labelledBy={QUESTION_STEM_ID}
        describedBy={question.itemType === "multiple_select" ? `${question.id}-instruction` : undefined}
        choices={question.choices}
        selectCount={question.itemType === "multiple_select" ? question.selectCount : 1}
        selected={answer}
        onChange={onAnswer}
      />
    </>
  );
}

const QUESTION_STEM_ID = "question-stem";

function PassagePanel({ passage }) {
  return (
    <article className="passage-panel">
      <p className="eyebrow">{passage.genre === "literary" ? "Literary passage" : "Informational passage"}</p>
      <h2>{passage.title}</h2>
      {passage.text.split("\n\n").map((paragraph, index) => (
        <p key={index} className={paragraph.includes("\n") ? "poem-stanza" : ""}>
          {paragraph}
        </p>
      ))}
    </article>
  );
}

export function TestPage() {
  const { grade, subject } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [passages, setPassages] = useState({});
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [showReference, setShowReference] = useState(false);
  const [studentName, setStudentName] = useState(() => localStorage.getItem(USER_NAME_KEY) || "");
  const timeLimitSeconds = (subject === "ela" && Number(grade) === 3 ? 150 : 180) * 60;
  const [secondsLeft, setSecondsLeft] = useState(timeLimitSeconds);

  if (!studentName) return <Shell><section className="header-block"><p className="eyebrow">Before you begin</p><h1>Who is taking the test?</h1></section><NameEntry onSave={setStudentName} /></Shell>;

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuestions() {
      setStatus("loading");
      setError("");
      try {
        const response = await fetch(`${API_BASE}/questions?grade=${encodeURIComponent(grade)}&subject=${encodeURIComponent(subject)}`, {
          cache: "no-store",
          signal: controller.signal
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load questions.");
        setQuestions(data.questions);
        setPassages(Object.fromEntries(data.passages.map((passage) => [passage.id, passage])));
        setAnswers({});
        setCurrentIndex(0);
        setSecondsLeft(timeLimitSeconds);
        setStatus("ready");
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
          setStatus("error");
        }
      }
    }

    loadQuestions();
    return () => controller.abort();
  }, [grade, subject, timeLimitSeconds]);

  const currentQuestion = questions[currentIndex];
  const passage = currentQuestion?.passageId ? passages[currentQuestion.passageId] : null;
  const subjectLabel = useMemo(() => SUBJECTS.find((item) => item.id === subject)?.label || subject, [subject]);
  const answeredCount = questions.filter((question) => isAnswered(question, answers[question.id])).length;
  const referenceSheet = subject === "math" ? REFERENCE_SHEETS[grade] : null;

  function setAnswer(value) {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: value }));
  }

  async function submitTest(timeExpired = false) {
    const unanswered = questions.length - answeredCount;
    if (!timeExpired && unanswered > 0 && !window.confirm(`You have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. Submit anyway?`)) return;

    setStatus("submitting");
    try {
      const response = await fetch(`${API_BASE}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: Number(grade), questionIds: questions.map((question) => question.id), answers })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit test.");
      const record = { result: data, grade, subject: subjectLabel, subjectId: subject, name: localStorage.getItem(USER_NAME_KEY) || "Student", completedAt: new Date().toISOString() };
      const history = [record, ...readResultHistory()].slice(0, RESULT_HISTORY_LIMIT);
      localStorage.setItem(RESULT_HISTORY_KEY, JSON.stringify(history));
      navigate("/results", { state: record });
    } catch (submitError) {
      setError(submitError.message);
      setStatus("ready");
    }
  }

  useEffect(() => {
    if (status !== "ready") return undefined;
    const timer = window.setInterval(() => setSecondsLeft((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === "ready" && secondsLeft === 0) submitTest(true);
  }, [secondsLeft, status]);

  if (status === "loading") {
    return (
      <Shell>
        <div className="status-card">Loading questions...</div>
      </Shell>
    );
  }

  if (status === "error") {
    return (
      <Shell>
        <div className="status-card error-card">
          <h1>Questions unavailable</h1>
          <p>{error}</p>
          <Link className="primary-link" to={`/subjects/${grade}`}>
            Choose another subject
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell wide={Boolean(passage)} skipTarget="question-panel" skipLabel="Skip to question">
      <div className="test-topbar">
        <Link className="back-link" to={`/subjects/${grade}`}>
          Exit test
        </Link>
        <span>
          Grade {grade} {subjectLabel} · {answeredCount}/{questions.length} answered
        </span>
        <span className={`timer ${secondsLeft <= 300 ? "timer-warning" : ""}`} role="timer" aria-live="off">
          Time left: {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
        </span>
        {referenceSheet && (
          <button
            className="secondary-button small-button"
            type="button"
            aria-expanded={showReference}
            aria-controls="reference-sheet"
            onClick={() => setShowReference((value) => !value)}
          >
            {showReference ? "Hide" : "Show"} Reference Sheet
          </button>
        )}
      </div>

      {referenceSheet && (
        <aside className="reference-sheet" id="reference-sheet" aria-labelledby="reference-sheet-title" hidden={!showReference}>
          <h2 id="reference-sheet-title">Grade {grade} Mathematics Reference Sheet</h2>
          <ul>
            {referenceSheet.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </aside>
      )}

      <nav className="question-nav" aria-label="Question navigator">
        {questions.map((question, index) => {
          const answered = isAnswered(question, answers[question.id]);
          const current = index === currentIndex;
          return (
            <button
              key={question.id}
              type="button"
              className={`nav-dot ${current ? "current" : ""} ${answered ? "answered" : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-current={current ? "step" : undefined}
              aria-label={`Question ${index + 1}, ${answered ? "answered" : "not answered"}`}
            >
              {index + 1}
            </button>
          );
        })}
      </nav>

      <div className={passage ? "split-layout" : ""}>
        {passage && <PassagePanel passage={passage} />}

        <section className="question-panel" id="question-panel" tabIndex={-1} aria-labelledby={QUESTION_STEM_ID}>
          <div className="question-meta">
            <span>{formatItemType(currentQuestion.itemType)}</span>
            <span>{currentQuestion.standard}</span>
            <span>{currentQuestion.domain}</span>
          </div>
          <p className="question-number" aria-live="polite">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <h1 className="question-stem" id={QUESTION_STEM_ID}>
            {currentQuestion.question}
          </h1>

          <QuestionBody key={currentQuestion.id} question={currentQuestion} answer={answers[currentQuestion.id]} onAnswer={setAnswer} />

          {error && (
            <p className="warning-text" role="alert">
              {error}
            </p>
          )}

          <div className="action-row">
            {currentIndex > 0 && (
              <button className="secondary-button" type="button" onClick={() => setCurrentIndex(currentIndex - 1)}>
                Previous
              </button>
            )}
            {currentIndex === questions.length - 1 ? (
              <button className="primary-button" type="button" onClick={submitTest} disabled={status === "submitting"}>
                {status === "submitting" ? "Scoring..." : "Submit Test"}
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={() => setCurrentIndex(currentIndex + 1)}>
                Next
              </button>
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}

export function PreviousResultsPage() {
  const history = readResultHistory();
  return <Shell>
    <Link className="back-link" to="/">Back to grades</Link>
    <section className="header-block"><p className="eyebrow">Saved on this device</p><h1>Previous Results</h1><p className="lead">Your five most recent practice test results are saved here.</p></section>
    {history.length === 0 ? <p className="status-card">No results saved yet. Complete a practice test and it will appear here.</p> : <div className="history-list">
      {history.map((record, index) => <article className="history-card" key={`${record.completedAt}-${index}`}>
        <div><p className="eyebrow">{record.name} · Grade {record.grade} {record.subject}</p><h2>{record.result.percent}%</h2><p>{record.result.earned} / {record.result.possible} points · {new Date(record.completedAt).toLocaleString()}</p></div>
        <Link className="primary-link" to="/results" state={record}>Review report</Link>
      </article>)}
    </div>}
  </Shell>;
}

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <Shell>
        <div className="status-card">
          <h1>No results yet</h1>
          <p>Complete a practice test to see your score report.</p>
          <button className="primary-button" type="button" onClick={() => navigate("/")}>
            Start a Test
          </button>
        </div>
      </Shell>
    );
  }

  const { grade, subject, subjectId } = location.state;
  const { strengths, focusAreas } = rankStandards(result.skillBreakdown);
  const domains = result.domainBreakdown || [];

  return (
    <Shell>
      <section className="header-block">
        <p className="eyebrow">Grade {grade} {subject}</p>
        <h1>Score Report for {location.state?.name || "Student"}</h1>
        <button className="secondary-button small-button print-button no-print" type="button" onClick={() => window.print()}>
          Print / Save report
        </button>
      </section>

      <div className="summary-grid">
        <ScoreTile label="Points" value={`${result.earned} / ${result.possible}`} />
        <ScoreTile label="Percentage" value={`${result.percent}%`} />
        <ScoreTile label="Fully correct" value={`${result.fullyCorrect} / ${result.total}`} />
        <ScoreTile label="Practice level" value={`Level ${result.performance.level}`} />
      </div>
      <p className="performance-label">
        {result.performance.label} <span>(estimate based on this practice test, not an official NJSLA score)</span>
      </p>

      <section className="results-section callout-grid" aria-label="Strongest and weakest standards">
        <StandardCallout
          tone="strong"
          title="Strongest standards"
          items={strengths}
          empty={`No standard reached ${STRONG_PERCENT}% yet. Review the explanations below and try another test.`}
        />
        <StandardCallout
          tone="weak"
          title="Standards to practice"
          items={focusAreas}
          empty={`Every standard on this test was ${STRONG_PERCENT}% or higher. Great work!`}
        />
      </section>

      {domains.length > 0 && (
        <section className="results-section">
          <h2>Domain Summary</h2>
          <div className="domain-summary">
            {domains.map((item) => (
              <article className="domain-card" key={item.domain}>
                <div className="domain-card-header">
                  <strong>{item.domain}</strong>
                  <b>
                    {item.earned} / {item.possible} <span>({item.percent}%)</span>
                  </b>
                </div>
                <div
                  className="domain-meter"
                  role="meter"
                  aria-label={`${item.domain} score`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={item.percent}
                  aria-valuetext={`${item.percent}%, ${item.earned} of ${item.possible} points`}
                >
                  <span className={meterTone(item.percent)} style={{ width: `${item.percent}%` }} />
                </div>
                <small>
                  {item.standards.length} standard{item.standards.length === 1 ? "" : "s"}: {item.standards.join(", ")}
                </small>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="results-section">
        <h2>Skill Breakdown</h2>
        <div className="skill-breakdown">
          {result.skillBreakdown.map((item) => (
            <article className={`skill-card ${item.earned === item.possible ? "skill-strong" : item.earned === 0 ? "skill-weak" : ""}`} key={item.standard}>
              <div>
                <strong>{item.standard}</strong>
                <span>{item.domain}</span>
              </div>
              <p>{item.skill}</p>
              <b>{item.earned} / {item.possible}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="results-section">
        <h2>Review Missed Questions</h2>
        {result.review.length === 0 ? (
          <p className="success-text">Perfect score. Nice work.</p>
        ) : (
          <div className="incorrect-list">
            {result.review.map((item) => (
              <article className="incorrect-card" key={item.id}>
                <div className="question-meta results-meta">
                  <span>{formatItemType(item.itemType)}</span>
                  <span>{item.standard}</span>
                  <span>{item.points} / {item.maxPoints} points</span>
                </div>
                <h3>{item.question}</h3>
                <p><strong>Your answer:</strong> {item.userAnswer}</p>
                <p><strong>Correct answer:</strong> {item.correctAnswer}</p>
                <p><strong>Skill:</strong> {item.skill}</p>
                <p><strong>Explanation:</strong> {item.explanation}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="action-row no-print">
        <button className="secondary-button" type="button" onClick={() => navigate("/")}>
          Choose Another Grade
        </button>
        <button className="primary-button" type="button" onClick={() => navigate(`/test/${grade}/${subjectId}`)}>
          Take a New {subject} Test
        </button>
      </div>
    </Shell>
  );
}

function standardPercent(item) {
  return item.possible ? Math.round((item.earned / item.possible) * 100) : 0;
}

export function rankStandards(skillBreakdown = [], limit = 3) {
  const ranked = skillBreakdown.map((item) => ({ ...item, percent: standardPercent(item) }));
  const strengths = ranked
    .filter((item) => item.percent >= STRONG_PERCENT)
    .sort((a, b) => b.percent - a.percent || b.possible - a.possible || a.standard.localeCompare(b.standard, undefined, { numeric: true }))
    .slice(0, limit);
  const focusAreas = ranked
    .filter((item) => item.percent < STRONG_PERCENT)
    .sort((a, b) => a.percent - b.percent || b.possible - a.possible || a.standard.localeCompare(b.standard, undefined, { numeric: true }))
    .slice(0, limit);
  return { strengths, focusAreas };
}

function meterTone(percent) {
  if (percent >= STRONG_PERCENT) return "meter-strong";
  if (percent >= 40) return "meter-mid";
  return "meter-weak";
}

function StandardCallout({ tone, title, items, empty }) {
  return (
    <article className={`standard-callout standard-callout-${tone}`}>
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p>{empty}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.standard}>
              <div>
                <strong>{item.standard}</strong>
                <span>{item.skill}</span>
              </div>
              <b>
                {item.earned} / {item.possible} ({item.percent}%)
              </b>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function ScoreTile({ label, value }) {
  return (
    <div className="score-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatItemType(itemType = "multiple_choice") {
  const labels = {
    multiple_choice: "Multiple Choice",
    multiple_select: "Multiple Select",
    numeric_entry: "Type Your Answer",
    evidence_based: "Part A / Part B"
  };
  return labels[itemType] || itemType;
}

import React, { useEffect, useMemo, useState } from "react";
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

function Shell({ children, wide = false }) {
  return (
    <main className="page-shell">
      <div className={`app-frame ${wide ? "app-frame-wide" : ""}`}>{children}</div>
    </main>
  );
}

export function HomePage() {
  return (
    <Shell>
      <section className="header-block">
        <p className="eyebrow">New Jersey Student Learning Assessment</p>
        <h1>NJSLA Practice Test</h1>
        <p className="lead">Practice the kinds of questions you will see on the NJSLA in ELA and Math. Every test is a new mix of questions.</p>
      </section>

      <div className="button-grid" aria-label="Choose a grade">
        {GRADES.map((grade) => (
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

function ChoiceList({ choices, selected, selectCount = 1, onChange, name }) {
  const multi = selectCount > 1;
  const selectedList = multi ? (Array.isArray(selected) ? selected : []) : [];

  function toggle(choice) {
    if (!multi) return onChange(choice);
    if (selectedList.includes(choice)) return onChange(selectedList.filter((item) => item !== choice));
    if (selectedList.length >= selectCount) return onChange([...selectedList.slice(1), choice]);
    return onChange([...selectedList, choice]);
  }

  return (
    <div className="choice-list" role={multi ? "group" : "radiogroup"} aria-label={name}>
      {choices.map((choice, index) => {
        const isSelected = multi ? selectedList.includes(choice) : selected === choice;
        return (
          <button className={`choice-button ${isSelected ? "selected" : ""}`} key={choice} type="button" aria-pressed={isSelected} onClick={() => toggle(choice)}>
            <span className={`choice-letter ${multi ? "choice-square" : ""}`}>{String.fromCharCode(65 + index)}</span>
            <span>{choice}</span>
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
      return (
        <div className="ebsr-part" key={part.label}>
          <h2>{part.question}</h2>
          {part.selectCount > 1 && <p className="item-instruction">Select {part.selectCount} answers.</p>}
          <ChoiceList
            name={part.label}
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
      {question.itemType === "multiple_select" && <p className="item-instruction">Select {question.selectCount} answers.</p>}
      <ChoiceList
        name="Answer choices"
        choices={question.choices}
        selectCount={question.itemType === "multiple_select" ? question.selectCount : 1}
        selected={answer}
        onChange={onAnswer}
      />
    </>
  );
}

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
  }, [grade, subject]);

  const currentQuestion = questions[currentIndex];
  const passage = currentQuestion?.passageId ? passages[currentQuestion.passageId] : null;
  const subjectLabel = useMemo(() => SUBJECTS.find((item) => item.id === subject)?.label || subject, [subject]);
  const answeredCount = questions.filter((question) => isAnswered(question, answers[question.id])).length;
  const referenceSheet = subject === "math" ? REFERENCE_SHEETS[grade] : null;

  function setAnswer(value) {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: value }));
  }

  async function submitTest() {
    const unanswered = questions.length - answeredCount;
    if (unanswered > 0 && !window.confirm(`You have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. Submit anyway?`)) return;

    setStatus("submitting");
    try {
      const response = await fetch(`${API_BASE}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: Number(grade), questionIds: questions.map((question) => question.id), answers })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit test.");
      navigate("/results", { state: { result: data, grade, subject: subjectLabel, subjectId: subject } });
    } catch (submitError) {
      setError(submitError.message);
      setStatus("ready");
    }
  }

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
    <Shell wide={Boolean(passage)}>
      <div className="test-topbar">
        <Link className="back-link" to={`/subjects/${grade}`}>
          Exit test
        </Link>
        <span>
          Grade {grade} {subjectLabel} · {answeredCount}/{questions.length} answered
        </span>
        {referenceSheet && (
          <button className="secondary-button small-button" type="button" onClick={() => setShowReference((value) => !value)}>
            {showReference ? "Hide" : "Show"} Reference Sheet
          </button>
        )}
      </div>

      {showReference && referenceSheet && (
        <aside className="reference-sheet">
          <h2>Grade {grade} Mathematics Reference Sheet</h2>
          <ul>
            {referenceSheet.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </aside>
      )}

      <nav className="question-nav" aria-label="Question navigator">
        {questions.map((question, index) => (
          <button
            key={question.id}
            type="button"
            className={`nav-dot ${index === currentIndex ? "current" : ""} ${isAnswered(question, answers[question.id]) ? "answered" : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Question ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </nav>

      <div className={passage ? "split-layout" : ""}>
        {passage && <PassagePanel passage={passage} />}

        <section className="question-panel">
          <div className="question-meta">
            <span>{formatItemType(currentQuestion.itemType)}</span>
            <span>{currentQuestion.standard}</span>
            <span>{currentQuestion.domain}</span>
          </div>
          <p className="question-number">Question {currentIndex + 1} of {questions.length}</p>
          <h1 className="question-stem">{currentQuestion.question}</h1>

          <QuestionBody key={currentQuestion.id} question={currentQuestion} answer={answers[currentQuestion.id]} onAnswer={setAnswer} />

          {error && <p className="warning-text">{error}</p>}

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

  return (
    <Shell>
      <section className="header-block">
        <p className="eyebrow">Grade {grade} {subject}</p>
        <h1>Score Report</h1>
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

      <div className="action-row">
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

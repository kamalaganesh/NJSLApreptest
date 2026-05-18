import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
const GRADES = [3, 4, 5, 6, 7, 8, 9, 10];
const SUBJECTS = [
  { id: "math", label: "Math" },
  { id: "ela", label: "ELA" },
  { id: "science", label: "Science" }
];

const MULTI_SELECT_TYPES = new Set(["multiple_select"]);

function Shell({ children }) {
  return (
    <main className="page-shell">
      <div className="app-frame">{children}</div>
    </main>
  );
}

export function HomePage() {
  return (
    <Shell>
      <section className="header-block">
        <p className="eyebrow">New Jersey Student Learning Assessment</p>
        <h1>NJSLA Practice Test</h1>
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
            {subject.label}
          </Link>
        ))}
      </div>
    </Shell>
  );
}

export function TestPage() {
  const { grade, subject } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuestions() {
      setStatus("loading");
      setError("");

      try {
        const response = await fetch(
          `${API_BASE}/questions?grade=${encodeURIComponent(grade)}&subject=${encodeURIComponent(subject)}&t=${Date.now()}`,
          { cache: "no-store", signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load questions.");
        }

        setQuestions(data);
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
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : "";
  const isFinalQuestion = currentIndex === questions.length - 1;
  const isMultiSelect = currentQuestion ? MULTI_SELECT_TYPES.has(currentQuestion.itemType) : false;
  const hasAnswer = isMultiSelect ? Array.isArray(selectedAnswer) && selectedAnswer.length > 0 : Boolean(selectedAnswer);

  const subjectLabel = useMemo(() => {
    return SUBJECTS.find((item) => item.id === subject)?.label || subject;
  }, [subject]);

  function chooseAnswer(answer) {
    setWarning("");
    setAnswers((previous) => {
      if (!MULTI_SELECT_TYPES.has(currentQuestion.itemType)) {
        return {
          ...previous,
          [currentQuestion.id]: answer
        };
      }

      const currentAnswers = Array.isArray(previous[currentQuestion.id]) ? previous[currentQuestion.id] : [];
      const nextAnswers = currentAnswers.includes(answer)
        ? currentAnswers.filter((item) => item !== answer)
        : [...currentAnswers, answer];

      return {
        ...previous,
        [currentQuestion.id]: nextAnswers
      };
    });
  }

  function goNext() {
    if (!hasAnswer) {
      setWarning("Please choose an answer before moving on.");
      return;
    }

    setWarning("");
    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
  }

  async function submitTest() {
    if (!hasAnswer) {
      setWarning("Please answer the final question before submitting.");
      return;
    }

    setStatus("submitting");
    setWarning("");

    try {
      const questionIds = questions.map((question) => question.id);
      const userAnswers = questionIds.map((id) => answers[id]);

      const response = await fetch(`${API_BASE}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ questionIds, userAnswers })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit test.");
      }

      navigate("/results", {
        state: {
          result: data,
          grade,
          subject: subjectLabel
        }
      });
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
    <Shell>
      <div className="test-topbar">
        <Link className="back-link" to={`/subjects/${grade}`}>
          Back to subjects
        </Link>
        <span>
          Grade {grade} {subjectLabel}
        </span>
      </div>

      <div className="progress-row">
        <strong>Question {currentIndex + 1} of {questions.length}</strong>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <section className="question-panel">
        <div className="question-meta">
          <span>{formatItemType(currentQuestion.itemType)}</span>
          <span>{currentQuestion.standard}</span>
          <span>{currentQuestion.difficulty}</span>
        </div>
        <p className="skill-text">{currentQuestion.skill}</p>
        <h1>{currentQuestion.question}</h1>
        {isMultiSelect && <p className="item-instruction">Select all answers that apply.</p>}

        <div className="choice-list">
          {currentQuestion.choices.map((choice, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = isMultiSelect
              ? Array.isArray(selectedAnswer) && selectedAnswer.includes(choice)
              : selectedAnswer === choice;

            return (
              <button
                className={`choice-button ${isSelected ? "selected" : ""}`}
                key={choice}
                type="button"
                onClick={() => chooseAnswer(choice)}
              >
                <span className={`choice-letter ${isMultiSelect ? "choice-square" : ""}`}>{letter}</span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {warning && <p className="warning-text">{warning}</p>}
        {error && <p className="warning-text">{error}</p>}

        <div className="action-row">
          {currentIndex > 0 && (
            <button className="secondary-button" type="button" onClick={() => setCurrentIndex(currentIndex - 1)}>
              Previous
            </button>
          )}

          {isFinalQuestion ? (
            <button className="primary-button" type="button" onClick={submitTest} disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting..." : "Submit Test"}
            </button>
          ) : (
            <button className="primary-button" type="button" onClick={goNext}>
              Next
            </button>
          )}
        </div>
      </section>
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

  const percentage = Math.round((result.numberCorrect / result.total) * 100);

  return (
    <Shell>
      <section className="header-block">
        <p className="eyebrow">Grade {location.state.grade} {location.state.subject}</p>
        <h1>Score Summary</h1>
      </section>

      <div className="summary-grid">
        <ScoreTile label="Total Score" value={`${result.totalScore} / ${result.total}`} />
        <ScoreTile label="Percentage" value={`${percentage}%`} />
        <ScoreTile label="Correct" value={result.numberCorrect} />
        <ScoreTile label="Incorrect" value={result.numberIncorrect} />
      </div>

      <section className="results-section">
        <h2>Skill Breakdown</h2>
        <div className="skill-breakdown">
          {result.skillBreakdown?.map((item) => (
            <article className="skill-card" key={item.standard}>
              <div>
                <strong>{item.standard}</strong>
                <span>{item.domain}</span>
              </div>
              <p>{item.skill}</p>
              <b>{item.correct} / {item.total}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="results-section">
        <h2>Incorrect Answers</h2>
        {result.incorrectQuestions.length === 0 ? (
          <p className="success-text">Perfect score. Nice work.</p>
        ) : (
          <div className="incorrect-list">
            {result.incorrectQuestions.map((item, index) => (
              <article className="incorrect-card" key={`${item.question}-${index}`}>
                <div className="question-meta results-meta">
                  <span>{formatItemType(item.itemType)}</span>
                  <span>{item.standard}</span>
                </div>
                <h3>{item.question}</h3>
                <p><strong>Your answer:</strong> {item.userAnswer || "No answer selected"}</p>
                <p><strong>Correct answer:</strong> {item.correctAnswer}</p>
                <p><strong>Skill:</strong> {item.skill}</p>
                <p><strong>Explanation:</strong> {item.explanation}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <button className="primary-button restart-button" type="button" onClick={() => navigate("/")}>
        Take Another Test
      </button>
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
  return itemType
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

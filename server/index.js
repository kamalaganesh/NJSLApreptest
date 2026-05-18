import cors from "cors";
import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");
const PORT = process.env.PORT || 5001;

const app = express();

app.use(cors());
app.use(express.json());

const questionCache = new Map();

async function loadQuestionsByGrade(grade) {
  if (!questionCache.has(grade)) {
    const filePath = path.join(DATA_DIR, `grade-${grade}.json`);
    const raw = await readFile(filePath, "utf8");
    questionCache.set(grade, JSON.parse(raw));
  }

  return questionCache.get(grade);
}

async function loadQuestionsForIds(questionIds) {
  const grades = [...new Set(questionIds.map(getGradeFromQuestionId).filter(Boolean))];
  const hasUnknownGradeIds = grades.length !== questionIds.length;

  if (hasUnknownGradeIds) {
    return loadAllQuestions();
  }

  const gradeBanks = await Promise.all(grades.map((grade) => loadQuestionsByGrade(grade)));
  return gradeBanks.flat();
}

function getGradeFromQuestionId(id = "") {
  const match = String(id).match(/^[MES](\d+)Q\d+$/i);
  return match ? Number(match[1]) : null;
}

async function loadAllQuestions() {
  const grades = [3, 4, 5, 6, 7, 8, 9, 10];
  const gradeBanks = await Promise.all(grades.map((grade) => loadQuestionsByGrade(grade)));
  return gradeBanks.flat();
}

function normalizeSubject(subject = "") {
  return subject.trim().toLowerCase();
}

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function publicQuestion(question) {
  return {
    id: question.id,
    grade: question.grade,
    subject: question.subject,
    standard: question.standard,
    domain: question.domain,
    skill: question.skill,
    itemType: question.itemType,
    difficulty: question.difficulty,
    question: question.question,
    choices: question.choices
  };
}

function correctAnswersFor(question) {
  if (Array.isArray(question.correctAnswers)) {
    return question.correctAnswers.map(String);
  }

  return [String(question.correctAnswer)];
}

function normalizeAnswer(answer) {
  if (Array.isArray(answer)) {
    return answer.map(String).sort();
  }

  if (answer === undefined || answer === null || answer === "") {
    return [];
  }

  return [String(answer)];
}

function answersMatch(userAnswer, question) {
  const expected = correctAnswersFor(question).sort();
  const actual = normalizeAnswer(userAnswer);

  return expected.length === actual.length && expected.every((answer, index) => answer === actual[index]);
}

function displayAnswer(answer) {
  if (Array.isArray(answer)) {
    return answer.length ? answer.join(", ") : "No answer selected";
  }

  return answer || "No answer selected";
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/questions", async (req, res, next) => {
  try {
    const grade = Number(req.query.grade);
    const subject = normalizeSubject(String(req.query.subject || ""));

    if (!grade || !subject) {
      return res.status(400).json({ error: "Both grade and subject are required." });
    }

    const questions = await loadQuestionsByGrade(grade);
    const matching = questions.filter(
      (question) => question.grade === grade && question.subject === subject
    );

    if (matching.length < 30) {
      return res.status(404).json({
        error: `Only ${matching.length} questions found for grade ${grade} ${subject}.`
      });
    }

    res.set("Cache-Control", "no-store");
    res.json(shuffle(matching).slice(0, 30).map(publicQuestion));
  } catch (error) {
    next(error);
  }
});

app.post("/submit", async (req, res, next) => {
  try {
    const { userAnswers, questionIds } = req.body;

    if (!Array.isArray(userAnswers) || !Array.isArray(questionIds)) {
      return res.status(400).json({ error: "userAnswers and questionIds arrays are required." });
    }

    if (userAnswers.length !== questionIds.length) {
      return res.status(400).json({ error: "userAnswers and questionIds must be the same length." });
    }

    const questions = await loadQuestionsForIds(questionIds);
    const questionById = new Map(questions.map((question) => [question.id, question]));

    let numberCorrect = 0;
    const incorrectQuestions = [];

    questionIds.forEach((id, index) => {
      const question = questionById.get(id);
      const userAnswer = userAnswers[index];

      if (!question) {
        incorrectQuestions.push({
          question: `Unknown question ID: ${id}`,
          userAnswer,
          correctAnswer: "Unavailable"
        });
        return;
      }

      if (answersMatch(userAnswer, question)) {
        numberCorrect += 1;
        return;
      }

      incorrectQuestions.push({
        question: question.question,
        userAnswer: displayAnswer(userAnswer),
        correctAnswer: correctAnswersFor(question).join(", "),
        standard: question.standard,
        domain: question.domain,
        skill: question.skill,
        itemType: question.itemType,
        explanation: question.explanation
      });
    });

    const total = questionIds.length;
    const numberIncorrect = total - numberCorrect;

    res.json({
      totalScore: numberCorrect,
      total,
      numberCorrect,
      numberIncorrect,
      incorrectQuestions,
      skillBreakdown: buildSkillBreakdown(questionIds, userAnswers, questionById)
    });
  } catch (error) {
    next(error);
  }
});

function buildSkillBreakdown(questionIds, userAnswers, questionById) {
  const breakdown = new Map();

  questionIds.forEach((id, index) => {
    const question = questionById.get(id);
    if (!question) return;

    const key = question.standard || question.skill || "Uncategorized";
    const current = breakdown.get(key) || {
      standard: question.standard || "Uncategorized",
      domain: question.domain || "General",
      skill: question.skill || "General practice",
      correct: 0,
      total: 0
    };

    current.total += 1;
    if (answersMatch(userAnswers[index], question)) {
      current.correct += 1;
    }

    breakdown.set(key, current);
  });

  return [...breakdown.values()].sort((a, b) => a.standard.localeCompare(b.standard));
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`NJSLA practice server running on http://localhost:${PORT}`);
});

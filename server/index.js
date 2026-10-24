import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gradeTest } from "./grading.js";
import { buildTest, publicQuestion } from "./testBuilder.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data");
const CLIENT_DIST = path.resolve(__dirname, "../client/dist");
const PORT = process.env.PORT || 5001;

export const GRADES = [3, 4, 5, 6, 7, 8];
export const SUBJECTS = ["math", "ela"];
const TEST_LENGTH = 30;

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const bankCache = new Map();

async function loadBank(grade) {
  if (!bankCache.has(grade)) {
    const raw = await readFile(path.join(DATA_DIR, `grade-${grade}.json`), "utf8");
    bankCache.set(grade, JSON.parse(raw));
  }
  return bankCache.get(grade);
}

function parseGrade(value) {
  const grade = Number(value);
  return GRADES.includes(grade) ? grade : null;
}

const api = express.Router();

api.get("/health", (_req, res) => res.json({ status: "ok" }));

api.get("/meta", async (_req, res, next) => {
  try {
    const grades = await Promise.all(GRADES.map(async (grade) => {
      const bank = await loadBank(grade);
      const counts = Object.fromEntries(SUBJECTS.map((subject) => [subject, bank.questions.filter((q) => q.subject === subject).length]));
      return { grade, counts, passages: bank.passages.length };
    }));
    res.json({ grades, subjects: SUBJECTS, testLength: TEST_LENGTH });
  } catch (error) {
    next(error);
  }
});

api.get("/questions", async (req, res, next) => {
  try {
    const grade = parseGrade(req.query.grade);
    const subject = String(req.query.subject || "").trim().toLowerCase();
    if (!grade || !SUBJECTS.includes(subject)) {
      return res.status(400).json({ error: `Choose a grade (${GRADES.join(", ")}) and a subject (${SUBJECTS.join(", ")}).` });
    }

    const test = buildTest(await loadBank(grade), subject, TEST_LENGTH);
    res.set("Cache-Control", "no-store");
    res.json({ grade, subject, passages: test.passages, questions: test.questions.map(publicQuestion) });
  } catch (error) {
    next(error);
  }
});

api.post("/submit", async (req, res, next) => {
  try {
    const grade = parseGrade(req.body?.grade);
    const { answers } = req.body || {};
    const questionIds = req.body?.questionIds;
    if (!grade || !Array.isArray(questionIds) || !answers || typeof answers !== "object") {
      return res.status(400).json({ error: "grade, questionIds, and answers are required." });
    }

    const bank = await loadBank(grade);
    const byId = new Map(bank.questions.map((question) => [question.id, question]));
    const unknown = questionIds.filter((id) => !byId.has(id));
    if (unknown.length) return res.status(400).json({ error: `Unknown question IDs: ${unknown.join(", ")}` });

    res.json(gradeTest(questionIds.map((id) => byId.get(id)), answers));
  } catch (error) {
    next(error);
  }
});

app.use("/api", api);

if (existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(path.join(CLIENT_DIST, "index.html")));
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`NJSLA practice server running on http://localhost:${PORT}`);
});

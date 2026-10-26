import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildChoices, createRng } from "./lib/util.mjs";
import { grade3, grade4, grade5 } from "./math-elementary.mjs";
import { grade6, grade7, grade8 } from "./math-middle.mjs";
import { passages34 } from "./ela/passages-3-4.mjs";
import { passages56 } from "./ela/passages-5-6.mjs";
import { passages78 } from "./ela/passages-7-8.mjs";
import { languageItemsFor } from "./ela/language.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data");

export const GRADES = [3, 4, 5, 6, 7, 8];
const MATH_TEMPLATES = { 3: grade3, 4: grade4, 5: grade5, 6: grade6, 7: grade7, 8: grade8 };
const PASSAGES = { 3: passages34, 4: passages34, 5: passages56, 6: passages56, 7: passages78, 8: passages78 };
const VARIANTS_PER_TEMPLATE = 12;
const MAX_ATTEMPTS = 80;

function pad(n) {
  return String(n).padStart(3, "0");
}

// Templates with a fixed stem (e.g. "Which comparison is true?") still vary by answer,
// so dedupe on the stem plus the answer key rather than the stem alone.
function variantKey(raw) {
  if (raw.type === "multiple_select") {
    const sorted = (values) => values.map(String).sort().join("|");
    return `${raw.question}||${sorted(raw.correct)}||${sorted(raw.wrong)}`;
  }
  return `${raw.question}||${raw.answer}`;
}

function toItem(raw, base, rng) {
  if (raw.type === "multiple_choice") {
    const choices = buildChoices(raw.answer, raw.distractors, rng, { allowNegative: raw.allowNegative !== false });
    if (!choices) return null;
    return {
      ...base,
      itemType: "multiple_choice",
      question: raw.question,
      choices,
      correctAnswer: String(raw.answer),
      explanation: raw.explanation
    };
  }

  if (raw.type === "multiple_select") {
    return {
      ...base,
      itemType: "multiple_select",
      question: raw.question,
      choices: rng.shuffle([...raw.correct, ...raw.wrong].map(String)),
      correctAnswers: raw.correct.map(String),
      explanation: raw.explanation
    };
  }

  return {
    ...base,
    itemType: "numeric_entry",
    question: raw.question,
    correctAnswer: Number(raw.answer),
    explanation: raw.explanation
  };
}

export function generateMath(grade) {
  const rng = createRng(1000 + grade);
  const questions = [];
  const seen = new Set();

  for (const [standard, domain, skill, difficulty, make] of MATH_TEMPLATES[grade]) {
    let made = 0;
    for (let attempt = 0; attempt < MAX_ATTEMPTS && made < VARIANTS_PER_TEMPLATE; attempt += 1) {
      const raw = make(rng);
      const key = variantKey(raw);
      if (seen.has(key)) continue;
      const base = {
        id: `M${grade}Q${pad(questions.length + 1)}`,
        grade,
        subject: "math",
        standard,
        domain,
        skill,
        difficulty: raw.difficulty || difficulty
      };
      const item = toItem(raw, base, rng);
      if (!item) continue;
      seen.add(key);
      made += 1;
      questions.push(item);
    }
  }

  return questions;
}

function fillGrade(text, grade) {
  return text.replaceAll("{g}", String(grade));
}

function elaChoiceItem(item, base, rng) {
  if (item.type === "ms") {
    return {
      ...base,
      itemType: "multiple_select",
      question: item.q,
      choices: rng.shuffle([...item.correct, ...item.wrong]),
      correctAnswers: item.correct,
      explanation: item.expl
    };
  }

  return {
    ...base,
    itemType: "multiple_choice",
    question: item.q,
    choices: rng.shuffle([item.a, ...item.d]),
    correctAnswer: item.a,
    explanation: item.expl
  };
}

export function generateEla(grade) {
  const rng = createRng(2000 + grade);
  const questions = [];
  const passages = PASSAGES[grade].map(({ id, title, genre, text }) => ({ id, title, genre, text }));
  const nextId = () => `E${grade}Q${pad(questions.length + 1)}`;

  for (const passage of PASSAGES[grade]) {
    const domain = passage.genre === "literary" ? "Reading Literature" : "Reading Informational Text";
    for (const item of passage.items) {
      const base = {
        id: nextId(),
        grade,
        subject: "ela",
        standard: fillGrade(item.standard, grade),
        domain,
        skill: item.skill,
        difficulty: "on-grade",
        passageId: passage.id
      };

      if (item.type === "ebsr") {
        questions.push({
          ...base,
          itemType: "evidence_based",
          question: "This question has two parts. Answer Part A, then answer Part B.",
          parts: [
            { label: "Part A", question: item.a.q, choices: rng.shuffle([item.a.a, ...item.a.d]), correctAnswers: [item.a.a] },
            { label: "Part B", question: item.b.q, choices: rng.shuffle([...item.b.correct, ...item.b.wrong]), correctAnswers: item.b.correct }
          ],
          explanation: item.expl
        });
      } else {
        questions.push(elaChoiceItem(item, base, rng));
      }
    }
  }

  for (const item of languageItemsFor(grade)) {
    questions.push(elaChoiceItem(item, {
      id: nextId(),
      grade,
      subject: "ela",
      standard: fillGrade(item.standard, grade),
      domain: item.domain,
      skill: item.skill,
      difficulty: "on-grade"
    }, rng));
  }

  return { passages, questions };
}

export function generateGrade(grade) {
  const ela = generateEla(grade);
  return {
    grade,
    passages: ela.passages,
    questions: [...generateMath(grade), ...ela.questions]
  };
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  for (const file of await readdir(DATA_DIR)) {
    if (/^grade-\d+\.json$/.test(file)) await rm(path.join(DATA_DIR, file));
  }

  for (const grade of GRADES) {
    const bank = generateGrade(grade);
    await writeFile(path.join(DATA_DIR, `grade-${grade}.json`), `${JSON.stringify(bank, null, 2)}\n`);
    const math = bank.questions.filter((q) => q.subject === "math").length;
    const ela = bank.questions.length - math;
    console.log(`Grade ${grade}: ${math} math items, ${ela} ELA items, ${bank.passages.length} passages`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

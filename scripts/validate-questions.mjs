import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data");
export const GRADES = [3, 4, 5, 6, 7, 8];
const MIN_MATH = 150;
const MIN_ELA = 50;
const MIN_PASSAGES = 5;

function checkChoices(label, choices, correct, errors) {
  if (!Array.isArray(choices) || choices.length < 4) errors.push(`${label}: needs at least 4 choices`);
  if (new Set(choices).size !== choices.length) errors.push(`${label}: duplicate choices`);
  for (const answer of correct) {
    if (choices.filter((choice) => choice === answer).length !== 1) errors.push(`${label}: answer "${answer}" must appear exactly once in choices`);
  }
  if (correct.length >= choices.length) errors.push(`${label}: every choice is correct`);
}

export function validateBank(bank) {
  const errors = [];
  const ids = new Set();
  const stems = new Set();
  const passageIds = new Set(bank.passages.map((passage) => passage.id));

  for (const q of bank.questions) {
    const label = `${q.id} (grade ${bank.grade} ${q.subject})`;
    if (ids.has(q.id)) errors.push(`${label}: duplicate id`);
    ids.add(q.id);
    for (const field of ["standard", "domain", "skill", "itemType", "question", "explanation"]) {
      if (!q[field]) errors.push(`${label}: missing ${field}`);
    }
    if (q.grade !== bank.grade) errors.push(`${label}: grade mismatch`);
    if (q.passageId && !passageIds.has(q.passageId)) errors.push(`${label}: unknown passage ${q.passageId}`);

    const stemText = q.itemType === "evidence_based" ? q.parts.map((p) => p.question).join("|") : q.question;
    const choiceText = q.itemType === "evidence_based" ? "" : (q.choices || []).slice().sort().join("|");
    const stemKey = `${q.subject}|${q.passageId || ""}|${stemText}|${choiceText}`;
    if (stems.has(stemKey)) errors.push(`${label}: duplicate question text`);
    stems.add(stemKey);

    switch (q.itemType) {
      case "multiple_choice":
        checkChoices(label, q.choices, [q.correctAnswer], errors);
        if (/select (two|all)/i.test(q.question)) errors.push(`${label}: multi-answer wording on a single-answer item`);
        break;
      case "multiple_select":
        if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length < 2) errors.push(`${label}: multiple_select needs 2+ correct answers`);
        else checkChoices(label, q.choices, q.correctAnswers, errors);
        break;
      case "numeric_entry":
        if (typeof q.correctAnswer !== "number" || !Number.isFinite(q.correctAnswer)) errors.push(`${label}: numeric answer must be a finite number`);
        break;
      case "evidence_based":
        if (!q.passageId) errors.push(`${label}: evidence-based items need a passage`);
        if (!Array.isArray(q.parts) || q.parts.length !== 2) errors.push(`${label}: needs Part A and Part B`);
        else q.parts.forEach((part) => checkChoices(`${label} ${part.label}`, part.choices, part.correctAnswers, errors));
        break;
      default:
        errors.push(`${label}: unknown itemType ${q.itemType}`);
    }
  }

  const math = bank.questions.filter((q) => q.subject === "math").length;
  const ela = bank.questions.filter((q) => q.subject === "ela").length;
  if (math < MIN_MATH) errors.push(`grade ${bank.grade}: only ${math} math items (min ${MIN_MATH})`);
  if (ela < MIN_ELA) errors.push(`grade ${bank.grade}: only ${ela} ELA items (min ${MIN_ELA})`);
  if (bank.passages.length < MIN_PASSAGES) errors.push(`grade ${bank.grade}: only ${bank.passages.length} passages (min ${MIN_PASSAGES})`);
  return errors;
}

export async function loadBank(grade) {
  return JSON.parse(await readFile(path.join(DATA_DIR, `grade-${grade}.json`), "utf8"));
}

async function main() {
  let failures = 0;
  for (const grade of GRADES) {
    const errors = validateBank(await loadBank(grade));
    failures += errors.length;
    errors.forEach((error) => console.error(error));
    console.log(`Grade ${grade}: ${errors.length ? `${errors.length} problem(s)` : "OK"}`);
  }
  if (failures) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

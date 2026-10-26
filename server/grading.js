export function parseNumber(value) {
  if (typeof value === "number") return value;
  if (value === undefined || value === null) return NaN;
  const cleaned = String(value).trim().replace(/[$,°%]/g, "");
  const mixed = cleaned.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const whole = Number(mixed[1]);
    const frac = Number(mixed[2]) / Number(mixed[3]);
    return whole < 0 ? whole - frac : whole + frac;
  }
  const text = cleaned.replace(/\s+/g, "");
  if (text === "") return NaN;
  const fractionMatch = text.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (fractionMatch) return Number(fractionMatch[1]) / Number(fractionMatch[2]);
  return /^-?(\d+\.?\d*|\.\d+)$/.test(text) ? Number(text) : NaN;
}

function sameSet(expected, actual) {
  const a = [...expected].map(String).sort();
  const b = (Array.isArray(actual) ? actual : actual === undefined || actual === null || actual === "" ? [] : [actual]).map(String).sort();
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function maxPoints(question) {
  return question.itemType === "evidence_based" ? 2 : 1;
}

export function scoreQuestion(question, answer) {
  switch (question.itemType) {
    case "numeric_entry": {
      const value = parseNumber(answer);
      return Number.isFinite(value) && Math.abs(value - Number(question.correctAnswer)) < 1e-6 ? 1 : 0;
    }
    case "multiple_select":
      return sameSet(question.correctAnswers, answer) ? 1 : 0;
    case "evidence_based": {
      const [partA, partB] = question.parts;
      const partACorrect = sameSet(partA.correctAnswers, answer?.partA);
      if (!partACorrect) return 0;
      return sameSet(partB.correctAnswers, answer?.partB) ? 2 : 1;
    }
    default:
      return String(answer ?? "") === String(question.correctAnswer) ? 1 : 0;
  }
}

export function correctAnswerText(question) {
  if (question.itemType === "evidence_based") {
    return question.parts.map((part) => `${part.label}: ${part.correctAnswers.join("; ")}`).join(" | ");
  }
  if (question.itemType === "multiple_select") return question.correctAnswers.join("; ");
  return String(question.correctAnswer);
}

export function answerText(question, answer) {
  if (answer === undefined || answer === null || answer === "" || (Array.isArray(answer) && answer.length === 0)) return "No answer";
  if (question.itemType === "evidence_based") {
    const format = (value) => (Array.isArray(value) ? value.join("; ") : value) || "No answer";
    return `Part A: ${format(answer.partA)} | Part B: ${format(answer.partB)}`;
  }
  return Array.isArray(answer) ? answer.join("; ") : String(answer);
}

export function performanceLevel(percent) {
  if (percent >= 85) return { level: 5, label: "Exceeded Expectations" };
  if (percent >= 70) return { level: 4, label: "Met Expectations" };
  if (percent >= 55) return { level: 3, label: "Approached Expectations" };
  if (percent >= 40) return { level: 2, label: "Partially Met Expectations" };
  return { level: 1, label: "Did Not Yet Meet Expectations" };
}

export function gradeTest(questions, answersById) {
  let earned = 0;
  let possible = 0;
  let fullyCorrect = 0;
  const review = [];
  const breakdown = new Map();

  for (const question of questions) {
    const answer = answersById[question.id];
    const points = scoreQuestion(question, answer);
    const max = maxPoints(question);
    earned += points;
    possible += max;
    if (points === max) fullyCorrect += 1;

    const entry = breakdown.get(question.standard) || { standard: question.standard, domain: question.domain, skill: question.skill, earned: 0, possible: 0 };
    entry.earned += points;
    entry.possible += max;
    breakdown.set(question.standard, entry);

    if (points < max) {
      review.push({
        id: question.id,
        question: question.itemType === "evidence_based" ? question.parts.map((part) => part.question).join("\n") : question.question,
        passageId: question.passageId,
        itemType: question.itemType,
        standard: question.standard,
        skill: question.skill,
        points,
        maxPoints: max,
        userAnswer: answerText(question, answer),
        correctAnswer: correctAnswerText(question),
        explanation: question.explanation
      });
    }
  }

  const percent = possible ? Math.round((earned / possible) * 100) : 0;
  const skillBreakdown = [...breakdown.values()].sort((a, b) => a.standard.localeCompare(b.standard, undefined, { numeric: true }));
  return {
    earned,
    possible,
    percent,
    fullyCorrect,
    total: questions.length,
    performance: performanceLevel(percent),
    review,
    skillBreakdown,
    domainBreakdown: domainBreakdown(skillBreakdown)
  };
}

export function domainBreakdown(skillBreakdown) {
  const domains = new Map();
  for (const item of skillBreakdown) {
    const domain = item.domain || "Other";
    const entry = domains.get(domain) || { domain, earned: 0, possible: 0, standards: [] };
    entry.earned += item.earned;
    entry.possible += item.possible;
    entry.standards.push(item.standard);
    domains.set(domain, entry);
  }
  return [...domains.values()].map((entry) => ({ ...entry, percent: entry.possible ? Math.round((entry.earned / entry.possible) * 100) : 0 }));
}

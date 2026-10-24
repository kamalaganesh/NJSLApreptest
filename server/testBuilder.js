const PASSAGES_PER_ELA_TEST = 3;

function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function publicQuestion(question) {
  const base = {
    id: question.id,
    grade: question.grade,
    subject: question.subject,
    standard: question.standard,
    domain: question.domain,
    skill: question.skill,
    itemType: question.itemType,
    difficulty: question.difficulty,
    question: question.question,
    passageId: question.passageId
  };

  if (question.itemType === "evidence_based") {
    return {
      ...base,
      parts: question.parts.map((part) => ({ label: part.label, question: part.question, choices: part.choices, selectCount: part.correctAnswers.length }))
    };
  }
  if (question.itemType === "multiple_select") return { ...base, choices: question.choices, selectCount: question.correctAnswers.length };
  if (question.itemType === "numeric_entry") return base;
  return { ...base, choices: question.choices };
}

function buildMathTest(questions, count, random) {
  const byStandard = new Map();
  for (const question of shuffle(questions, random)) {
    if (!byStandard.has(question.standard)) byStandard.set(question.standard, []);
    byStandard.get(question.standard).push(question);
  }

  const queues = shuffle([...byStandard.values()], random);
  const picked = [];
  while (picked.length < count && queues.some((queue) => queue.length)) {
    for (const queue of queues) {
      if (queue.length && picked.length < count) picked.push(queue.pop());
    }
  }
  return shuffle(picked, random);
}

function buildElaTest(bank, questions, count, random) {
  const passageIds = shuffle(bank.passages.map((passage) => passage.id), random).slice(0, PASSAGES_PER_ELA_TEST);
  const passageItems = passageIds.flatMap((id) => questions.filter((question) => question.passageId === id));
  const languageItems = shuffle(questions.filter((question) => !question.passageId), random);
  const fill = Math.max(count - passageItems.length, 0);
  return {
    passages: bank.passages.filter((passage) => passageIds.includes(passage.id)),
    questions: [...passageItems, ...languageItems.slice(0, fill)]
  };
}

export function buildTest(bank, subject, count = 30, random = Math.random) {
  const questions = bank.questions.filter((question) => question.subject === subject);
  if (subject === "ela") {
    const test = buildElaTest(bank, questions, count, random);
    return { passages: test.passages, questions: test.questions };
  }
  return { passages: [], questions: buildMathTest(questions, count, random) };
}

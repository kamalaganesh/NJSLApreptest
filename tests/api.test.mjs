import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import { app } from "../server/index.js";
import { loadBank } from "../scripts/validate-questions.mjs";

const ANSWER_KEYS = ["correctAnswer", "correctAnswers", "explanation"];

function correctAnswerFor(question) {
  if (question.itemType === "evidence_based") {
    const [partA, partB] = question.parts;
    return { partA: partA.correctAnswers[0], partB: partB.correctAnswers };
  }
  if (question.itemType === "multiple_select") return question.correctAnswers;
  return question.correctAnswer;
}

test("GET /api/health reports ok", async () => {
  const res = await request(app).get("/api/health").expect(200);
  assert.deepEqual(res.body, { status: "ok" });
});

test("GET /api/meta lists every grade with item counts", async () => {
  const res = await request(app).get("/api/meta").expect(200);
  assert.deepEqual(res.body.subjects, ["math", "ela"]);
  assert.equal(res.body.testLength, 30);
  assert.deepEqual(res.body.grades.map((entry) => entry.grade), [3, 4, 5, 6, 7, 8]);
  for (const entry of res.body.grades) {
    const bank = await loadBank(entry.grade);
    assert.equal(entry.counts.math, bank.questions.filter((q) => q.subject === "math").length);
    assert.equal(entry.counts.ela, bank.questions.filter((q) => q.subject === "ela").length);
    assert.equal(entry.passages, bank.passages.length);
  }
});

for (const [grade, subject] of [[3, "math"], [5, "ela"], [8, "math"], [7, "ela"]]) {
  test(`GET /api/questions returns 30 grade ${grade} ${subject} items without answers`, async () => {
    const res = await request(app).get("/api/questions").query({ grade, subject }).expect(200);
    assert.equal(res.headers["cache-control"], "no-store");
    assert.equal(res.body.grade, grade);
    assert.equal(res.body.subject, subject);
    assert.equal(res.body.questions.length, 30);
    assert.equal(new Set(res.body.questions.map((q) => q.id)).size, 30);
    for (const question of res.body.questions) {
      assert.equal(question.grade, grade);
      assert.equal(question.subject, subject);
      for (const key of ANSWER_KEYS) assert.ok(!(key in question), `${question.id} leaks ${key}`);
      for (const part of question.parts || []) assert.ok(!("correctAnswers" in part), `${question.id} ${part.label} leaks correctAnswers`);
    }
    if (subject === "ela") assert.equal(res.body.passages.length, 3);
    else assert.deepEqual(res.body.passages, []);
  });
}

test("GET /api/questions accepts mixed-case subjects", async () => {
  const res = await request(app).get("/api/questions").query({ grade: 4, subject: " MATH " }).expect(200);
  assert.equal(res.body.subject, "math");
});

for (const query of [{}, { grade: 9, subject: "math" }, { grade: 2, subject: "ela" }, { grade: "abc", subject: "math" }, { grade: 5 }, { grade: 5, subject: "science" }]) {
  test(`GET /api/questions rejects ${JSON.stringify(query)} with 400`, async () => {
    const res = await request(app).get("/api/questions").query(query).expect(400);
    assert.match(res.body.error, /grade/);
  });
}

test("POST /api/submit scores a perfect test and a blank test", async () => {
  const { body: test30 } = await request(app).get("/api/questions").query({ grade: 6, subject: "ela" }).expect(200);
  const bank = await loadBank(6);
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const questionIds = test30.questions.map((q) => q.id);
  const possible = questionIds.reduce((sum, id) => sum + (byId.get(id).itemType === "evidence_based" ? 2 : 1), 0);

  const perfectAnswers = Object.fromEntries(questionIds.map((id) => [id, correctAnswerFor(byId.get(id))]));
  const perfect = await request(app).post("/api/submit").send({ grade: 6, questionIds, answers: perfectAnswers }).expect(200);
  assert.equal(perfect.body.earned, possible);
  assert.equal(perfect.body.possible, possible);
  assert.equal(perfect.body.percent, 100);
  assert.equal(perfect.body.fullyCorrect, 30);
  assert.equal(perfect.body.total, 30);
  assert.deepEqual(perfect.body.review, []);
  assert.equal(perfect.body.skillBreakdown.reduce((sum, item) => sum + item.possible, 0), possible);
  assert.equal(perfect.body.domainBreakdown.reduce((sum, item) => sum + item.possible, 0), possible);

  const blank = await request(app).post("/api/submit").send({ grade: 6, questionIds, answers: {} }).expect(200);
  assert.equal(blank.body.earned, 0);
  assert.equal(blank.body.percent, 0);
  assert.equal(blank.body.review.length, 30);
  assert.ok(blank.body.review.every((item) => item.userAnswer === "No answer"));
});

test("POST /api/submit gives partial credit and lists missed items", async () => {
  const bank = await loadBank(4);
  const numeric = bank.questions.find((q) => q.itemType === "numeric_entry");
  const choice = bank.questions.find((q) => q.itemType === "multiple_choice" && q.subject === "math");
  const ebsr = bank.questions.find((q) => q.itemType === "evidence_based");
  const wrongChoice = choice.choices.find((c) => c !== choice.correctAnswer);
  const answers = {
    [numeric.id]: String(numeric.correctAnswer),
    [choice.id]: wrongChoice,
    [ebsr.id]: { partA: ebsr.parts[0].correctAnswers[0], partB: [] }
  };

  const res = await request(app).post("/api/submit").send({ grade: 4, questionIds: [numeric.id, choice.id, ebsr.id], answers }).expect(200);
  assert.equal(res.body.earned, 2);
  assert.equal(res.body.possible, 4);
  assert.equal(res.body.percent, 50);
  assert.equal(res.body.fullyCorrect, 1);
  assert.deepEqual(res.body.review.map((item) => item.id).sort(), [choice.id, ebsr.id].sort());
  assert.equal(res.body.review.find((item) => item.id === choice.id).userAnswer, wrongChoice);
});

test("POST /api/submit rejects unknown question IDs", async () => {
  const bank = await loadBank(5);
  const res = await request(app)
    .post("/api/submit")
    .send({ grade: 5, questionIds: [bank.questions[0].id, "NOPE-1", "M3Q001"], answers: {} })
    .expect(400);
  assert.match(res.body.error, /Unknown question IDs: NOPE-1, M3Q001/);
});

for (const [label, body] of [
  ["missing grade", { questionIds: [], answers: {} }],
  ["invalid grade", { grade: 12, questionIds: [], answers: {} }],
  ["non-array questionIds", { grade: 5, questionIds: "M5Q001", answers: {} }],
  ["missing answers", { grade: 5, questionIds: [] }]
]) {
  test(`POST /api/submit rejects ${label} with 400`, async () => {
    const res = await request(app).post("/api/submit").send(body).expect(400);
    assert.match(res.body.error, /required/);
  });
}

test("unknown API routes do not fall through to the SPA", async () => {
  await request(app).get("/api/does-not-exist").expect(404);
});

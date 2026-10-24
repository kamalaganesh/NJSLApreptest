import assert from "node:assert/strict";
import test from "node:test";
import { gradeTest, parseNumber, scoreQuestion } from "../server/grading.js";
import { buildTest } from "../server/testBuilder.js";
import { loadBank } from "../scripts/validate-questions.mjs";

const ebsr = {
  id: "E1", itemType: "evidence_based", standard: "RL.5.3",
  parts: [{ label: "Part A", correctAnswers: ["a"] }, { label: "Part B", correctAnswers: ["x", "y"] }]
};

test("parseNumber accepts decimals, commas, money, and fractions", () => {
  assert.equal(parseNumber("1,234"), 1234);
  assert.equal(parseNumber("$12.50"), 12.5);
  assert.equal(parseNumber("3/4"), 0.75);
  assert.equal(parseNumber("2 1/2"), 2.5);
  assert.ok(Number.isNaN(parseNumber("abc")));
});

test("numeric entry compares values, not strings", () => {
  const q = { itemType: "numeric_entry", correctAnswer: 12.5 };
  assert.equal(scoreQuestion(q, "12.50"), 1);
  assert.equal(scoreQuestion(q, "12"), 0);
});

test("multiple select requires the exact set", () => {
  const q = { itemType: "multiple_select", correctAnswers: ["a", "b"] };
  assert.equal(scoreQuestion(q, ["b", "a"]), 1);
  assert.equal(scoreQuestion(q, ["a"]), 0);
  assert.equal(scoreQuestion(q, ["a", "b", "c"]), 0);
});

test("evidence-based items award NJSLA-style partial credit", () => {
  assert.equal(scoreQuestion(ebsr, { partA: "a", partB: ["y", "x"] }), 2);
  assert.equal(scoreQuestion(ebsr, { partA: "a", partB: ["x"] }), 1);
  assert.equal(scoreQuestion(ebsr, { partA: "b", partB: ["x", "y"] }), 0);
});

test("gradeTest totals points and lists missed items", () => {
  const mc = { id: "M1", itemType: "multiple_choice", correctAnswer: "4", standard: "3.OA.C.7", question: "2+2?" };
  const result = gradeTest([mc, ebsr], { M1: "4", E1: { partA: "a", partB: ["x"] } });
  assert.equal(result.earned, 2);
  assert.equal(result.possible, 3);
  assert.equal(result.review.length, 1);
});

test("tests are 30 items; ELA tests use whole passage sets", async () => {
  for (const grade of [3, 6, 8]) {
    const bank = await loadBank(grade);
    const math = buildTest(bank, "math");
    assert.equal(math.questions.length, 30);
    assert.equal(new Set(math.questions.map((q) => q.id)).size, 30);
    const ela = buildTest(bank, "ela");
    assert.equal(ela.questions.length, 30);
    assert.equal(ela.passages.length, 3);
    for (const passage of ela.passages) {
      const expected = bank.questions.filter((q) => q.passageId === passage.id).length;
      assert.equal(ela.questions.filter((q) => q.passageId === passage.id).length, expected);
    }
  }
});

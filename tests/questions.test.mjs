import assert from "node:assert/strict";
import test from "node:test";
import { generateGrade } from "../scripts/generate-questions.mjs";
import { GRADES, loadBank, validateBank } from "../scripts/validate-questions.mjs";

for (const grade of GRADES) {
  test(`grade ${grade} committed bank passes validation`, async () => {
    assert.deepEqual(validateBank(await loadBank(grade)), []);
  });

  test(`grade ${grade} committed bank matches the generator`, async () => {
    assert.deepEqual(await loadBank(grade), JSON.parse(JSON.stringify(generateGrade(grade))));
  });
}

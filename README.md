# NJSLA Practice Test

Practice tests for the New Jersey Student Learning Assessment (NJSLA), **grades 3–8, ELA and Math**. Every test is a fresh, randomized 30-question set built from generated, answer-checked question banks.

> These are original practice items written to the NJ Student Learning Standards. They are not official released NJSLA items, and the practice level shown on the score report is only an estimate.

## What's covered

**Math** (about 170–200 items per grade): every NJSLS-M domain for the grade (Operations & Algebraic Thinking, Number & Operations in Base Ten, Fractions, Measurement & Data, Geometry, Ratios & Proportions, The Number System, Expressions & Equations, Functions, Statistics & Probability). Answers are computed by the generator, so the answer keys are always right. Grades 5–8 include the reference sheet.

**ELA** (about 55–65 items per grade): five original reading passages per grade band (literary, informational, poetry, and diary), each with its own question set, plus language and vocabulary items (conventions, context clues, affixes and roots, figurative language).

**NJSLA item types**
- Multiple choice
- Multiple select ("Select two answers")
- Type-your-answer (numeric entry; accepts `42`, `3.5`, `$12.50`, `3/4`, `2 1/2`)
- Evidence-based selected response (Part A / Part B), with NJSLA-style partial credit: 2 points if both parts are right, 1 point if only Part A is right

ELA tests use 3 complete passage sets plus language items. Math tests are spread across the grade's standards. The score report shows points, a skill breakdown by standard, and explanations for every missed question.

## Quick start

Requires Node.js 18 or newer.

```bash
npm run setup     # install dependencies for root, server, and client
npm run dev       # API on http://localhost:5001, app on http://localhost:5173
```

Open http://localhost:5173 and pick a grade and subject.

### Run as a single server

```bash
npm run build     # build the React app into client/dist
npm start         # serves the app and API at http://localhost:5001
```

## Question banks

The banks in `data/grade-3.json` … `data/grade-8.json` are generated. Don't edit them by hand; change the generator and regenerate:

```bash
npm run generate:data   # rebuild data/grade-*.json (deterministic)
npm run validate:data   # check answer keys, choices, duplicates, minimum counts
npm test                # validation + grading tests; also fails if data/ is out of date
```

- `scripts/math-elementary.mjs`, `scripts/math-middle.mjs`: math templates by grade and standard. Each template computes its own answer.
- `scripts/ela/passages-*.mjs`: ELA passages and their question sets by grade band (3–4, 5–6, 7–8).
- `scripts/ela/language.mjs`: conventions, vocabulary, and figurative-language items.

## API

- `GET /api/questions?grade=5&subject=math`: a new 30-question test, without answers (`subject` is `math` or `ela`)
- `POST /api/submit` with `{ "grade": 5, "questionIds": [...], "answers": { "<id>": <answer> } }`: returns points, percent, practice level, a skill breakdown, and review items
- `GET /api/meta`: grades, subjects, and item counts

# NJSLA Practice Test

Practice tests for the New Jersey Student Learning Assessment (NJSLA), **grades 3–8, ELA and Math**. Every test is a fresh, randomized 30-question set built from generated, answer-checked question banks.

> These are original practice items written to the NJ Student Learning Standards. They are not official released NJSLA items, and the practice level shown on the score report is only an estimate.

## What's covered

**Math** (about 270–325 items per grade): every NJSLS-M domain for the grade (Operations & Algebraic Thinking, Number & Operations in Base Ten, Fractions, Measurement & Data, Geometry, Ratios & Proportions, The Number System, Expressions & Equations, Functions, Statistics & Probability). Answers are computed by the generator, so the answer keys are always right. Grades 5–8 include the reference sheet.

**ELA** (about 60–75 items per grade): six original reading passages per grade band (literary, informational, poetry, and diary), each with its own question set, plus language and vocabulary items (conventions, context clues, affixes and roots, figurative language).

**NJSLA item types**
- Multiple choice
- Multiple select ("Select two answers")
- Type-your-answer (numeric entry; accepts `42`, `3.5`, `$12.50`, `3/4`, `2 1/2`)
- Evidence-based selected response (Part A / Part B), with NJSLA-style partial credit: 2 points if both parts are right, 1 point if only Part A is right

ELA tests use 3 complete passage sets plus language items. Math tests are spread across the grade's standards.

**Score report**
- Points, percent, and an estimated practice level
- Strongest standards and standards to practice (70% is the cutoff), taken from the per-standard skill breakdown
- Domain summary: points and percent for each domain (for example, Fractions or Reading Literature)
- Skill breakdown by standard, and explanations for every missed question
- **Print / Save report** button. It opens the browser print dialog; print styles hide the buttons so the report fits on paper or saves cleanly as a PDF.

**Accessibility**: skip link, visible keyboard focus, radio-group and checkbox semantics for answer choices (arrow keys move between single-answer choices), answered/current state on the question navigator, and `aria-expanded` on the reference-sheet toggle.

## Quick start

Requires Node.js 18.18 or newer.

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

The generator makes up to 12 variants per math template and skips repeats (same stem and same answer key). New templates and passages go in the files above; then run `npm run generate:data` and commit the regenerated `data/` files with the script changes.

## Development

```bash
npm run lint           # ESLint (flat config in eslint.config.js): server/, scripts/, tests/ (Node ESM) and client/src/ (React + hooks rules)
npm run lint:fix       # same, with auto-fix
npm run format         # Prettier (settings in .prettierrc) over the repo; data/ and build output are ignored
npm run format:check   # report files Prettier would change
npm test               # node:test: bank validation, grading, test builder, and HTTP API tests
```

`tests/api.test.mjs` sends real HTTP requests to the Express routes (`/api/health`, `/api/meta`, `/api/questions`, `/api/submit`) with `supertest`. `server/index.js` exports `app` and only calls `listen` when it is run directly (`node server/index.js`, `npm start`, `npm run dev`), so importing it in tests doesn't open a port.

### Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull request, on Node 18, 20, and 22. It installs the root, server, and client dependencies with `npm ci`, then runs `npm run lint`, `npm run validate:data`, `npm test`, and `npm run build`. `npm test` fails if `data/` doesn't match the generators, so CI also catches a bank that was edited by hand or not regenerated.

## API

- `GET /api/questions?grade=5&subject=math`: a new 30-question test, without answers (`subject` is `math` or `ela`)
- `POST /api/submit` with `{ "grade": 5, "questionIds": [...], "answers": { "<id>": <answer> } }`: returns points, percent, practice level, `skillBreakdown` (by standard), `domainBreakdown` (by domain: `earned`, `possible`, `percent`, `standards`), and review items. Unknown question IDs return 400.
- `GET /api/meta`: grades, subjects, and item counts
- `GET /api/health`: `{ "status": "ok" }`

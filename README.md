# NJSLA Practice Test

Full-stack practice test app using React, Node.js, Express, and JSON question banks.

## Structure

- `client/` - React frontend built with Vite
- `server/` - Express API
- `data/` - JSON question banks split by grade
- `scripts/` - helper script to generate sample questions

## Run Locally

Install dependencies:

```bash
npm install
npm run install:all
```

Generate the sample question bank:

```bash
npm run generate:data
```

Question files are split by grade:

```text
data/grade-3.json
data/grade-4.json
data/grade-5.json
data/grade-6.json
data/grade-7.json
data/grade-8.json
data/grade-9.json
data/grade-10.json
```

Add more questions to the matching grade file. Keep `subject` lowercase, such as `math`, `ela`, or `science`.

Start both the backend and frontend:

```bash
npm run dev
```

Open the React app at:

```text
http://localhost:5173
```

The API runs at:

```text
http://localhost:5001
```

## API

`GET /questions?grade=3&subject=math`

Returns 30 randomized questions without correct answers.

`POST /submit`

```json
{
  "questionIds": ["M3Q1"],
  "userAnswers": ["42"]
}
```

Returns score totals and incorrect answer details.

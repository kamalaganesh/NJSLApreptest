export const NAMES = ["Maya", "Luis", "Aiden", "Priya", "Jordan", "Sofia", "Malik", "Hana", "Diego", "Grace", "Omar", "Lena", "Kofi", "Ava", "Ravi", "Zoe"];

export function mc(question, answer, distractors, explanation, options = {}) {
  return { type: "multiple_choice", question, answer, distractors, explanation, ...options };
}

export function ms(question, correct, wrong, explanation, options = {}) {
  return { type: "multiple_select", question, correct, wrong, explanation, ...options };
}

export function num(question, answer, explanation, options = {}) {
  return { type: "numeric_entry", question, answer, explanation, ...options };
}

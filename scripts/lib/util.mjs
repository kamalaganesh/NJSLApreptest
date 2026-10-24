export function createRng(seed) {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const rng = {
    next,
    int(min, max) {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    pick(items) {
      return items[Math.floor(next() * items.length)];
    },
    shuffle(items) {
      const copy = [...items];
      for (let index = copy.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(next() * (index + 1));
        [copy[index], copy[swap]] = [copy[swap], copy[index]];
      }
      return copy;
    },
    sample(items, count) {
      return rng.shuffle(items).slice(0, count);
    }
  };

  return rng;
}

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

export function fraction(numerator, denominator, { mixed = false, simplify = true } = {}) {
  let n = numerator;
  let d = denominator;
  if (d < 0) {
    n = -n;
    d = -d;
  }
  if (simplify) {
    const divisor = gcd(n, d);
    n /= divisor;
    d /= divisor;
  }
  if (d === 1) return String(n);
  if (mixed && Math.abs(n) > d) {
    const sign = n < 0 ? "-" : "";
    const whole = Math.floor(Math.abs(n) / d);
    const rest = Math.abs(n) % d;
    return rest === 0 ? `${sign}${whole}` : `${sign}${whole} ${rest}/${d}`;
  }
  return `${n}/${d}`;
}

export function formatNumber(value) {
  const rounded = Math.round(value * 1e6) / 1e6;
  const [whole, decimal] = String(Math.abs(rounded)).split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${rounded < 0 ? "-" : ""}${withCommas}${decimal ? `.${decimal}` : ""}`;
}

export function money(value) {
  return `$${value.toFixed(2)}`;
}

export function round(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function buildChoices(answer, distractors, rng, { count = 4, allowNegative = true } = {}) {
  const correct = String(answer);
  const seen = new Set([correct]);
  const wrong = [];

  for (const distractor of distractors) {
    const text = String(distractor);
    if (seen.has(text)) continue;
    if (!allowNegative && /^-/.test(text)) continue;
    seen.add(text);
    wrong.push(text);
    if (wrong.length === count - 1) break;
  }

  const numeric = Number(String(answer).replace(/,/g, ""));
  if (wrong.length < count - 1 && !Number.isFinite(numeric)) return null;
  let offset = 1;
  while (wrong.length < count - 1) {
    const candidate = Number.isFinite(numeric) ? formatNumber(numeric + offset) : `${correct} (${offset})`;
    offset = offset > 0 ? -offset : -offset + 1;
    if (seen.has(candidate) || (!allowNegative && /^-/.test(candidate))) continue;
    seen.add(candidate);
    wrong.push(candidate);
  }

  return rng.shuffle([correct, ...wrong]);
}

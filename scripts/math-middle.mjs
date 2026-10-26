import { fraction, formatNumber, gcd, lcm, money, round } from "./lib/util.mjs";
import { mc, ms, num, NAMES } from "./lib/items.mjs";

const RP = "Ratios and Proportional Relationships";
const NS = "The Number System";
const EE = "Expressions and Equations";
const F = "Functions";
const G = "Geometry";
const SP = "Statistics and Probability";

function signed(n) {
  return n < 0 ? `(${n})` : String(n);
}

function term(coef, variable = "x") {
  if (coef === 1) return variable;
  if (coef === -1) return `-${variable}`;
  return `${coef}${variable}`;
}

function linear(m, b, variable = "x") {
  if (b === 0) return term(m, variable);
  return `${term(m, variable)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
}

export const grade6 = [
  ["6.RP.A.1", RP, "Understand ratios and use ratio language.", "foundational", (r) => {
    const a = r.int(2, 9);
    const b = r.int(2, 9);
    const k = r.int(2, 6);
    return mc(`A class has ${a * k} girls and ${b * k} boys. What is the ratio of boys to girls in simplest form?`, `${b / gcd(a, b)}:${a / gcd(a, b)}`,
      [`${a / gcd(a, b)}:${b / gcd(a, b)}`, `${b * k}:${(a + b) * k}`, `${b}:${a + b}`], `Boys to girls is ${b * k}:${a * k}, which simplifies to ${b / gcd(a, b)}:${a / gcd(a, b)}.`);
  }],
  ["6.RP.A.2", RP, "Find and use unit rates.", "on-grade", (r) => {
    const unit = r.int(3, 15);
    const n = r.int(3, 9);
    const price = r.int(105, 650) / 100;
    if (r.next() < 0.5) return num(`A car travels ${unit * n} miles in ${n} hours at a constant speed. How many miles does it travel per hour?`, unit, `${unit * n} ÷ ${n} = ${unit} miles per hour.`);
    return num(`${n} bottles of juice cost ${money(price * n)}. What is the cost, in dollars, of one bottle?`, round(price, 2), `${(price * n).toFixed(2)} ÷ ${n} = ${price.toFixed(2)}.`);
  }],
  ["6.RP.A.3", RP, "Solve ratio problems using tables and tape diagrams.", "on-grade", (r) => {
    const a = r.int(1, 5);
    const b = r.int(2, 7);
    const k = r.int(3, 9);
    return num(`A paint mix uses ${a} cup${a > 1 ? "s" : ""} of blue for every ${b} cups of white. How many cups of white paint are needed for ${a * k} cups of blue?`, b * k,
      `The ratio is ${a}:${b}. ${a * k} is ${k} times ${a}, so ${b} × ${k} = ${b * k} cups of white.`);
  }],
  ["6.RP.A.3c", RP, "Find a percent of a quantity and find the whole given a part and percent.", "advanced", (r) => {
    const pct = r.pick([10, 15, 20, 25, 30, 40, 60, 75]);
    const whole = r.int(2, 20) * 20;
    if (r.next() < 0.5) return num(`What is ${pct}% of ${whole}?`, round((pct / 100) * whole, 2), `${pct}% = ${pct / 100}. ${pct / 100} × ${whole} = ${round((pct / 100) * whole, 2)}.`);
    return num(`${round((pct / 100) * whole, 2)} students voted for a field trip to the science museum. That is ${pct}% of the students. How many students voted in all?`, whole,
      `${round((pct / 100) * whole, 2)} ÷ ${pct / 100} = ${whole}.`);
  }],
  ["6.NS.A.1", NS, "Divide fractions by fractions.", "on-grade", (r) => {
    const a = [r.int(1, 7), r.pick([2, 3, 4, 5, 6, 8])];
    const b = [r.int(1, 3), r.pick([3, 4, 6, 8])];
    if (b[0] >= b[1]) b[0] = 1;
    return mc(`What is ${a[0]}/${a[1]} ÷ ${b[0]}/${b[1]}?`, fraction(a[0] * b[1], a[1] * b[0], { mixed: true }),
      [fraction(a[0] * b[0], a[1] * b[1], { mixed: true }), fraction(a[1] * b[0], a[0] * b[1], { mixed: true }), fraction(a[0] + b[1], a[1] + b[0], { mixed: true })],
      `Multiply by the reciprocal: ${a[0]}/${a[1]} × ${b[1]}/${b[0]} = ${fraction(a[0] * b[1], a[1] * b[0], { mixed: true })}.`);
  }],
  ["6.NS.B.3", NS, "Fluently compute with multi-digit decimals.", "foundational", (r) => {
    const a = r.int(1050, 9990) / 100;
    const b = r.int(12, 95) / 10;
    return r.next() < 0.5
      ? num(`What is ${a.toFixed(2)} × ${b.toFixed(1)}?`, round(a * b, 3), `${a.toFixed(2)} × ${b.toFixed(1)} = ${formatNumber(round(a * b, 3))}.`)
      : num(`What is ${a.toFixed(2)} + ${b.toFixed(1)} - 3.75?`, round(a + b - 3.75, 2), `${a.toFixed(2)} + ${b.toFixed(1)} = ${round(a + b, 2)}; minus 3.75 = ${round(a + b - 3.75, 2)}.`);
  }],
  ["6.NS.B.4", NS, "Find greatest common factors and least common multiples.", "on-grade", (r) => {
    if (r.next() < 0.5) {
      const g = r.int(2, 9);
      let a = r.int(2, 7);
      let b = r.int(2, 7);
      while (gcd(a, b) !== 1 || a === b) b = r.int(2, 9);
      const name = r.pick(NAMES);
      return num(`${name} has ${g * a} pencils and ${g * b} erasers. ${name} wants to make identical kits with no supplies left over. What is the greatest number of kits she can make?`, g,
        `The greatest common factor of ${g * a} and ${g * b} is ${g}.`);
    }
    const a = r.pick([4, 6, 8, 9, 10, 12]);
    let b = r.pick([6, 8, 9, 10, 12, 15]);
    if (a === b) b += 1;
    return num(`Hot dogs come in packs of ${a} and buns come in packs of ${b}. What is the least number of hot dogs you can buy to have the same number of hot dogs and buns?`, lcm(a, b),
      `The least common multiple of ${a} and ${b} is ${lcm(a, b)}.`);
  }],
  ["6.NS.C.7", NS, "Order rational numbers and understand absolute value.", "on-grade", (r) => {
    const values = r.sample([-9, -7, -5, -4, -3, -2, -1, 0, 2, 3, 5, 6, 8], 4);
    const sorted = [...values].sort((a, b) => a - b);
    const reversedAbs = [...values].sort((a, b) => Math.abs(a) - Math.abs(b));
    return mc(`Which list shows the numbers ${values.join(", ")} in order from least to greatest?`, sorted.join(", "),
      [[...sorted].reverse().join(", "), reversedAbs.join(", "), [sorted[1], sorted[0], ...sorted.slice(2)].join(", ")],
      "On a number line, numbers increase from left to right; negative numbers farther from 0 are smaller.");
  }],
  ["6.NS.C.8", NS, "Find distances between points with the same coordinate.", "on-grade", (r) => {
    const x = r.int(-8, 8);
    const y1 = r.int(-9, -1);
    const y2 = r.int(1, 9);
    return num(`What is the distance, in units, between (${x}, ${y1}) and (${x}, ${y2})?`, y2 - y1, `The x-coordinates match, so distance = |${y2} - ${signed(y1)}| = ${y2 - y1}.`);
  }],
  ["6.EE.A.1", EE, "Evaluate numerical expressions with whole-number exponents.", "foundational", (r) => {
    const b = r.int(2, 6);
    const e = b > 4 ? 2 : r.int(2, 4);
    const c = r.int(1, 20);
    return num(`What is the value of ${b}${["", "", "²", "³", "⁴"][e]} + ${c}?`, b ** e + c, `${b}${["", "", "²", "³", "⁴"][e]} = ${b ** e}; ${b ** e} + ${c} = ${b ** e + c}.`);
  }],
  ["6.EE.A.2", EE, "Evaluate expressions at specific values.", "on-grade", (r) => {
    const a = r.int(2, 9);
    const b = r.int(1, 15);
    const x = r.int(2, 10);
    return num(`What is the value of ${a}x + ${b} when x = ${x}?`, a * x + b, `${a}(${x}) + ${b} = ${a * x + b}.`);
  }],
  ["6.EE.A.3", EE, "Generate equivalent expressions.", "on-grade", (r) => {
    const a = r.int(2, 9);
    const b = r.int(1, 9);
    return ms(`Select all of the expressions that are equivalent to ${a}(x + ${b}).`, [`${a}x + ${a * b}`, `${a}x + ${a}(${b})`], [`${a}x + ${b}`, `${a + b}x`, `x + ${a * b}`],
      `Distribute ${a} to both terms: ${a}x + ${a * b}.`);
  }],
  ["6.EE.B.7", EE, "Solve one-step equations.", "foundational", (r) => {
    const x = r.int(3, 40);
    const a = r.int(2, 12);
    return r.next() < 0.5
      ? num(`Solve for x: ${a}x = ${a * x}`, x, `Divide both sides by ${a}: x = ${x}.`)
      : num(`Solve for x: x + ${a * 3} = ${x + a * 3}`, x, `Subtract ${a * 3} from both sides: x = ${x}.`);
  }],
  ["6.EE.B.8", EE, "Write inequalities to represent real-world conditions.", "on-grade", (r) => {
    const n = r.int(8, 60);
    const [phrase, sym, wrongs] = r.pick([
      ["at least", "≥", ["≤", "<", ">"]],
      ["no more than", "≤", ["≥", ">", "<"]],
      ["more than", ">", ["<", "≥", "≤"]],
      ["fewer than", "<", [">", "≤", "≥"]]
    ]);
    return mc(`A club needs ${phrase} ${n} members. Which inequality represents m, the number of members?`, `m ${sym} ${n}`, wrongs.map((w) => `m ${w} ${n}`),
      `"${phrase}" is written with ${sym}.`);
  }],
  ["6.G.A.1", G, "Find areas of triangles and composite figures.", "on-grade", (r) => {
    const b = r.int(4, 20);
    const h = r.int(3, 15);
    return num(`A triangle has a base of ${b} meters and a height of ${h} meters. What is its area, in square meters?`, (b * h) / 2, `A = ½ × ${b} × ${h} = ${(b * h) / 2} square meters.`);
  }],
  ["6.G.A.4", G, "Find surface area using nets.", "advanced", (r) => {
    const l = r.int(2, 10);
    const w = r.int(2, 8);
    const h = r.int(2, 8);
    return num(`A box is ${l} in. long, ${w} in. wide, and ${h} in. tall. What is the surface area of the box, in square inches?`, 2 * (l * w + l * h + w * h),
      `SA = 2(${l}·${w}) + 2(${l}·${h}) + 2(${w}·${h}) = ${2 * (l * w + l * h + w * h)} square inches.`);
  }],
  ["6.SP.B.5", SP, "Find measures of center for a data set.", "on-grade", (r) => {
    const data = Array.from({ length: 5 }, () => r.int(2, 20));
    const sum = data.reduce((a, b) => a + b, 0);
    if (sum % 5 === 0 || r.next() < 0.4) {
      const sorted = [...data].sort((a, b) => a - b);
      if (sum % 5 !== 0) return num(`What is the median of this data set? ${data.join(", ")}`, sorted[2], `In order: ${sorted.join(", ")}. The middle value is ${sorted[2]}.`);
      return num(`What is the mean of this data set? ${data.join(", ")}`, sum / 5, `Sum = ${sum}; ${sum} ÷ 5 = ${sum / 5}.`);
    }
    const sorted = [...data].sort((a, b) => a - b);
    return num(`What is the median of this data set? ${data.join(", ")}`, sorted[2], `In order: ${sorted.join(", ")}. The middle value is ${sorted[2]}.`);
  }],
  ["6.SP.A.1", SP, "Recognize statistical questions.", "on-grade", (r) => {
    const yes = r.sample(["How many hours do students in my class sleep on school nights?", "How tall are the sunflowers in the community garden?", "How many pets do families on my street have?", "What are the daily high temperatures in June?"], 2);
    const no = r.sample(["How tall is the school flagpole?", "How many days are in a week?", "What is my teacher's name?", "How many states are in the United States?"], 2);
    return ms("Select all of the statistical questions.", yes, no, "A statistical question expects variability in the answers.");
  }],
  ["6.NS.C.5", NS, "Use positive and negative numbers to represent real-world quantities.", "foundational", (r) => {
    const n = r.int(3, 60);
    const [text, sign] = r.pick([
      [`a temperature of ${n} degrees below zero`, -1],
      [`a depth of ${n} feet below sea level`, -1],
      [`a withdrawal of $${n} from a bank account`, -1],
      [`a loss of ${n} points in a game`, -1],
      [`a gain of ${n} yards in a football game`, 1],
      [`an elevation of ${n} feet above sea level`, 1],
      [`a deposit of $${n} into a bank account`, 1]
    ]);
    const value = sign * n;
    return mc(`Which integer represents ${text}?`, value, [-value, 0, value + sign * 10, sign * (n + 1)],
      `${sign < 0 ? "Below zero, below sea level, withdrawals, and losses are negative" : "Gains, deposits, and heights above sea level are positive"}, so the integer is ${value}.`);
  }],
  ["6.NS.C.6", NS, "Reflect points across the axes of the coordinate plane.", "on-grade", (r) => {
    const x = r.pick([-1, 1]) * r.int(1, 9);
    const y = r.pick([-1, 1]) * r.int(1, 9);
    const axis = r.pick(["x-axis", "y-axis", "x-axis and then the y-axis"]);
    const answer = { "x-axis": `(${x}, ${-y})`, "y-axis": `(${-x}, ${y})`, "x-axis and then the y-axis": `(${-x}, ${-y})` }[axis];
    return mc(`Point P is at (${x}, ${y}). It is reflected across the ${axis}. What are the coordinates of the new point?`, answer,
      [`(${x}, ${-y})`, `(${-x}, ${y})`, `(${-x}, ${-y})`, `(${y}, ${x})`].filter((choice) => choice !== answer),
      "Reflecting across the x-axis changes the sign of the y-coordinate; reflecting across the y-axis changes the sign of the x-coordinate.");
  }],
  ["6.EE.B.6", EE, "Use variables to write expressions for real-world problems.", "on-grade", (r) => {
    const n = r.int(2, 12);
    const name = r.pick(NAMES);
    const kind = r.int(0, 2);
    if (kind === 0) {
      return mc(`${name}'s brother is b years old. ${name} is ${n} years older than the brother. Which expression shows ${name}'s age?`, `b + ${n}`, [`${n}b`, `b - ${n}`, `${n} - b`],
        `"${n} years older" means add ${n} to the brother's age: b + ${n}.`);
    }
    if (kind === 1) {
      return mc(`Each ticket to the science museum costs $${n}. Which expression shows the cost, in dollars, of t tickets?`, `${n}t`, [`t + ${n}`, `t ÷ ${n}`, `${n} - t`],
        `Each of the t tickets costs $${n}, so the cost is ${n} × t = ${n}t.`);
    }
    const length = n * r.int(3, 8);
    return mc(`A ribbon ${length} inches long is cut into p pieces of equal length. Which expression shows the length of each piece, in inches?`, `${length} ÷ p`, [`${length}p`, `p - ${length}`, `${length} + p`],
      `Dividing ${length} inches into p equal pieces gives ${length} ÷ p inches per piece.`);
  }],
  ["6.EE.C.9", EE, "Represent the relationship between dependent and independent variables.", "on-grade", (r) => {
    const [setup, dep, ind, unit] = r.pick([
      ["A car travels at a constant speed of {n} miles per hour.", "d", "t", "d is the distance in miles and t is the time in hours"],
      ["A student earns ${n} per hour walking dogs.", "e", "h", "e is the earnings in dollars and h is the number of hours"],
      ["Apples cost ${n} per pound.", "c", "p", "c is the cost in dollars and p is the number of pounds"],
      ["A printer prints {n} pages per minute.", "g", "m", "g is the number of pages and m is the number of minutes"]
    ]);
    const n = r.int(2, 65);
    return mc(`${setup.replace("{n}", n)} Which equation represents the relationship, where ${unit}?`, `${dep} = ${n}${ind}`, [`${ind} = ${n}${dep}`, `${dep} = ${ind} + ${n}`, `${dep} = ${n} ÷ ${ind}`],
      `${dep} depends on ${ind}: each unit of ${ind} adds ${n}, so ${dep} = ${n}${ind}.`);
  }],
  ["6.G.A.2", G, "Find the volume of right rectangular prisms with fractional edge lengths.", "advanced", (r) => {
    const l = r.int(2, 8) + 0.5;
    const w = r.int(1, 6) + r.pick([0, 0.5]);
    const h = r.int(2, 6);
    return num(`A rectangular prism is ${l} cm long, ${w} cm wide, and ${h} cm tall. What is its volume, in cubic centimeters?`, l * w * h,
      `V = l × w × h = ${l} × ${w} × ${h} = ${formatNumber(l * w * h)} cubic centimeters.`);
  }],
  ["6.G.A.3", G, "Use coordinates to find side lengths of polygons.", "on-grade", (r) => {
    const x1 = r.int(-8, -1);
    const x2 = r.int(1, 8);
    const y1 = r.int(-7, 2);
    const y2 = y1 + r.int(2, 8);
    const width = x2 - x1;
    const height = y2 - y1;
    const vertices = `(${x1}, ${y1}), (${x2}, ${y1}), (${x2}, ${y2}), and (${x1}, ${y2})`;
    if (r.next() < 0.5) {
      return num(`A rectangle has vertices at ${vertices}. What is the perimeter of the rectangle, in units?`, 2 * (width + height),
        `The width is ${x2} - (${x1}) = ${width} and the height is ${y2} - (${y1}) = ${height}. Perimeter = 2 × (${width} + ${height}) = ${2 * (width + height)}.`);
    }
    return num(`A rectangle has vertices at ${vertices}. What is the area of the rectangle, in square units?`, width * height,
      `The width is ${x2} - (${x1}) = ${width} and the height is ${y2} - (${y1}) = ${height}. Area = ${width} × ${height} = ${width * height}.`);
  }],
  ["6.SP.A.3", SP, "Describe the variation in a data set using the range.", "foundational", (r) => {
    const data = Array.from({ length: r.int(6, 8) }, () => r.int(4, 60));
    const range = Math.max(...data) - Math.min(...data);
    return num(`The number of minutes ${r.pick(["students read", "a team practiced", "a class spent outside"])} on several days was: ${data.join(", ")}. What is the range of the data?`, range,
      `Range = greatest - least = ${Math.max(...data)} - ${Math.min(...data)} = ${range}.`);
  }],
  ["6.SP.B.5", SP, "Find the mean absolute deviation of a data set.", "advanced", (r) => {
    let data;
    do {
      data = Array.from({ length: 4 }, () => r.int(2, 20));
    } while (data.reduce((sum, v) => sum + v, 0) % 4 !== 0);
    const mean = data.reduce((sum, v) => sum + v, 0) / 4;
    const deviations = data.map((v) => Math.abs(v - mean));
    const mad = deviations.reduce((sum, v) => sum + v, 0) / 4;
    return num(`The data set is ${data.join(", ")}. Its mean is ${mean}. What is the mean absolute deviation (MAD)?`, mad,
      `The distances from the mean are ${deviations.join(", ")}. Their mean is ${deviations.reduce((sum, v) => sum + v, 0)} ÷ 4 = ${formatNumber(mad)}.`);
  }]
];

export const grade7 = [
  ["7.RP.A.2", RP, "Identify the constant of proportionality.", "on-grade", (r) => {
    const k = r.pick([1.5, 2, 2.5, 3, 4, 5, 6, 0.5]);
    const xs = r.sample([1, 2, 3, 4, 5, 6, 8, 10], 3).sort((a, b) => a - b);
    return mc(`In a proportional relationship, x = ${xs.join(", ")} and y = ${xs.map((x) => formatNumber(x * k)).join(", ")}. Which equation represents the relationship?`, `y = ${formatNumber(k)}x`,
      [`y = x + ${formatNumber(xs[0] * k - xs[0])}`, `y = ${formatNumber(round(1 / k, 3))}x`, `y = ${formatNumber(k + 1)}x`], `y ÷ x = ${formatNumber(k)} for every pair, so y = ${formatNumber(k)}x.`);
  }],
  ["7.RP.A.3", RP, "Solve multistep percent problems (tax, tip, discount, markup).", "on-grade", (r) => {
    const price = r.int(12, 120);
    const pct = r.pick([5, 8, 10, 15, 20, 25, 30]);
    const [label, sign] = r.pick([["discount", -1], ["sales tax", 1], ["tip", 1], ["markup", 1]]);
    const total = round(price * (1 + (sign * pct) / 100), 2);
    return num(`A meal costs ${money(price)}. A ${pct}% ${label} is ${sign < 0 ? "taken off" : "added"}. What is the final amount, in dollars?`, total,
      `${pct}% of ${price} = ${round((price * pct) / 100, 2)}. ${price} ${sign < 0 ? "-" : "+"} ${round((price * pct) / 100, 2)} = ${total.toFixed(2)}.`);
  }],
  ["7.RP.A.3", RP, "Find percent increase or decrease.", "advanced", (r) => {
    const original = r.int(2, 20) * 10;
    const pct = r.pick([10, 20, 25, 30, 40, 50]);
    const up = r.next() < 0.5;
    const next = original * (1 + ((up ? 1 : -1) * pct) / 100);
    return num(`The price of a game changed from ${money(original)} to ${money(next)}. What is the percent ${up ? "increase" : "decrease"}? (Enter the number only.)`, pct,
      `Change = ${Math.abs(next - original)}. ${Math.abs(next - original)} ÷ ${original} = ${pct / 100} = ${pct}%.`);
  }],
  ["7.NS.A.1", NS, "Add and subtract rational numbers.", "foundational", (r) => {
    const a = r.int(-20, 20);
    const b = r.int(-20, 20);
    const c = r.int(-15, 15);
    return num(`What is ${a} + ${signed(b)} - ${signed(c)}?`, a + b - c, `${a} + ${signed(b)} = ${a + b}; ${a + b} - ${signed(c)} = ${a + b - c}.`);
  }],
  ["7.NS.A.2", NS, "Multiply and divide rational numbers.", "foundational", (r) => {
    const a = r.int(-12, -2);
    const b = r.int(-9, 9) || 3;
    return r.next() < 0.5
      ? num(`What is ${a} × ${signed(b)}?`, a * b, `A ${a * b > 0 ? "negative times a negative is positive" : "negative times a positive is negative"}: ${a * b}.`)
      : num(`What is ${a * b} ÷ ${signed(a)}?`, b, `${a * b} ÷ ${signed(a)} = ${b}.`);
  }],
  ["7.NS.A.3", NS, "Solve real-world problems with rational numbers.", "on-grade", (r) => {
    const start = r.int(-12, 5);
    const rise = r.int(3, 18);
    const drop = r.int(2, 15);
    return num(`At 6 a.m. the temperature was ${start}°F. It rose ${rise}° by noon and then dropped ${drop}° by evening. What was the evening temperature, in °F?`, start + rise - drop,
      `${start} + ${rise} - ${drop} = ${start + rise - drop}°F.`);
  }],
  ["7.EE.A.1", EE, "Add, subtract, factor, and expand linear expressions.", "on-grade", (r) => {
    const a = r.int(2, 9);
    const b = r.int(-9, 9) || 4;
    const c = r.int(2, 9);
    const d = r.int(-9, 9) || -3;
    return mc(`Which expression is equivalent to (${linear(a, b)}) + (${linear(c, d)})?`, linear(a + c, b + d),
      [linear(a + c, b - d), linear(a * c, b + d), linear(a + c + b + d, 0)], `Combine like terms: ${a}x + ${c}x = ${a + c}x and ${b} + ${signed(d)} = ${b + d}.`);
  }],
  ["7.EE.B.4", EE, "Solve two-step equations.", "on-grade", (r) => {
    const x = r.int(-10, 15);
    const a = r.int(2, 9);
    const b = r.int(-20, 20);
    return num(`Solve for x: ${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${a * x + b}`, x, `${b < 0 ? "Add" : "Subtract"} ${Math.abs(b)}: ${a}x = ${a * x}. Divide by ${a}: x = ${x}.`);
  }],
  ["7.EE.B.4", EE, "Solve word problems leading to equations of the form px + q = r.", "advanced", (r) => {
    const fee = r.int(10, 40);
    const rate = r.int(4, 15);
    const hours = r.int(2, 9);
    return num(`A bike rental costs a $${fee} fee plus $${rate} per hour. ${r.pick(NAMES)} paid $${fee + rate * hours}. How many hours was the bike rented?`, hours,
      `${fee} + ${rate}h = ${fee + rate * hours}; ${rate}h = ${rate * hours}; h = ${hours}.`);
  }],
  ["7.EE.B.4b", EE, "Solve and interpret two-step inequalities.", "advanced", (r) => {
    const a = r.int(2, 8);
    const b = r.int(1, 20);
    const x = r.int(2, 12);
    return mc(`Which inequality shows the solution to ${a}x + ${b} > ${a * x + b}?`, `x > ${x}`, [`x < ${x}`, `x > ${x + b}`, `x ≥ ${a * x}`],
      `Subtract ${b}: ${a}x > ${a * x}. Divide by ${a}: x > ${x}.`);
  }],
  ["7.G.A.1", G, "Solve problems involving scale drawings.", "on-grade", (r) => {
    const scale = r.int(2, 12);
    const len = r.int(2, 15);
    return num(`On a map, 1 inch represents ${scale} miles. Two towns are ${len} inches apart on the map. What is the actual distance, in miles?`, scale * len, `${len} × ${scale} = ${scale * len} miles.`);
  }],
  ["7.G.B.4", G, "Use formulas for area and circumference of circles.", "on-grade", (r) => {
    const radius = r.int(2, 12);
    const area = r.next() < 0.5;
    return num(`Use 3.14 for π. What is the ${area ? "area" : "circumference"} of a circle with a radius of ${radius} cm? ${area ? "(square cm)" : "(cm)"}`,
      round(area ? 3.14 * radius * radius : 2 * 3.14 * radius, 2), area ? `A = πr² = 3.14 × ${radius}² = ${round(3.14 * radius * radius, 2)}.` : `C = 2πr = 2 × 3.14 × ${radius} = ${round(2 * 3.14 * radius, 2)}.`);
  }],
  ["7.G.B.5", G, "Use facts about supplementary, complementary, vertical, and adjacent angles.", "on-grade", (r) => {
    const [kind, total] = r.pick([["complementary", 90], ["supplementary", 180]]);
    const a = r.int(12, total - 12);
    return num(`Two angles are ${kind}. One angle measures ${a}°. What is the measure of the other angle, in degrees?`, total - a, `${kind[0].toUpperCase() + kind.slice(1)} angles add to ${total}°: ${total} - ${a} = ${total - a}.`);
  }],
  ["7.G.B.6", G, "Solve problems involving volume of right prisms.", "on-grade", (r) => {
    const b = r.int(3, 12);
    const h = r.int(2, 10);
    const len = r.int(4, 15);
    return num(`A triangular prism has a triangular base with base ${b} ft and height ${h} ft. The prism is ${len} ft long. What is its volume, in cubic feet?`, (b * h * len) / 2,
      `Base area = ½ × ${b} × ${h} = ${(b * h) / 2}. Volume = ${(b * h) / 2} × ${len} = ${(b * h * len) / 2}.`);
  }],
  ["7.SP.C.7", SP, "Find probabilities of simple events.", "foundational", (r) => {
    const red = r.int(1, 9);
    const blue = r.int(1, 9);
    const green = r.int(1, 9);
    const total = red + blue + green;
    return mc(`A bag has ${red} red, ${blue} blue, and ${green} green marbles. One marble is picked at random. What is the probability it is blue?`, fraction(blue, total),
      [fraction(blue, red + green), fraction(red + green, total), fraction(red, total), fraction(green, total), fraction(blue + 1, total), `${blue}/${total + blue}`], `P(blue) = ${blue}/${total}${gcd(blue, total) > 1 ? ` = ${fraction(blue, total)}` : ""}.`);
  }],
  ["7.SP.C.8", SP, "Find probabilities of compound events.", "advanced", (r) => {
    const kind = r.int(0, 2);
    if (kind === 0) return mc("A fair coin is flipped and a number cube (1-6) is rolled. What is the probability of getting heads and an even number?", "1/4", ["1/2", "1/12", "1/3"], "P(heads) × P(even) = 1/2 × 1/2 = 1/4.");
    if (kind === 1) {
      const target = r.int(3, 6);
      return mc(`Two number cubes (1-6) are rolled. What is the probability that both show a number greater than ${target - 1}?`, fraction((7 - target) ** 2, 36), [fraction(7 - target, 6), fraction((7 - target) * 2, 36), fraction(7 - target, 36)],
        `P = ${7 - target}/6 × ${7 - target}/6 = ${fraction((7 - target) ** 2, 36)}.`);
    }
    return mc("A fair coin is flipped three times. What is the probability of getting heads all three times?", "1/8", ["1/3", "1/6", "3/8"], "1/2 × 1/2 × 1/2 = 1/8.");
  }],
  ["7.SP.A.2", SP, "Use random samples to draw inferences about a population.", "on-grade", (r) => {
    const sample = r.pick([20, 25, 40, 50]);
    const yes = r.int(2, sample - 2);
    const pop = sample * r.pick([10, 20, 25, 40]);
    return num(`In a random sample of ${sample} students, ${yes} prefer the new lunch menu. Based on the sample, about how many of the school's ${pop} students prefer the new menu?`, (yes / sample) * pop,
      `${yes}/${sample} = ${round(yes / sample, 3)}; ${round(yes / sample, 3)} × ${pop} = ${(yes / sample) * pop}.`);
  }],
  ["7.RP.A.1", RP, "Compute unit rates involving fractions.", "advanced", (r) => {
    const [n1, d1] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]);
    const d2 = r.pick([2, 3, 4, 6, 8]);
    const name = r.pick(NAMES);
    return mc(`${name} walks ${n1}/${d1} mile in 1/${d2} hour. At this rate, how many miles does ${name} walk per hour?`, fraction(n1 * d2, d1, { mixed: true }),
      [fraction(n1, d1 * d2), fraction(d1, n1 * d2, { mixed: true }), fraction(n1 * d2 + d1, d1, { mixed: true }), fraction(n1 + d2, d1, { mixed: true })],
      `Unit rate = (${n1}/${d1}) ÷ (1/${d2}) = ${n1}/${d1} × ${d2} = ${fraction(n1 * d2, d1, { mixed: true })} miles per hour.`);
  }],
  ["7.NS.A.2", NS, "Convert a fraction to a terminating decimal.", "foundational", (r) => {
    const d = r.pick([4, 5, 8, 16, 20, 25, 40]);
    let n;
    do {
      n = r.int(1, d * 2);
    } while (gcd(n, d) !== 1);
    return num(`Write ${n}/${d} as a decimal.`, n / d, `Divide: ${n} ÷ ${d} = ${formatNumber(n / d)}.`);
  }],
  ["7.EE.A.2", EE, "Rewrite expressions to show how quantities are related.", "on-grade", (r) => {
    const p = r.pick([3, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40]);
    const increase = r.next() < 0.5;
    const factor = formatNumber(increase ? 1 + p / 100 : 1 - p / 100);
    const opposite = formatNumber(increase ? 1 - p / 100 : 1 + p / 100);
    return mc(`A store ${increase ? "raises" : "lowers"} the price, p, of a jacket by ${p}%. Which expression represents the new price?`, `${factor}p`,
      [`p ${increase ? "+" : "-"} ${p}`, `${formatNumber(p / 100)}p`, `${opposite}p`, `${p}p`],
      `${increase ? "Adding" : "Subtracting"} ${p}% of p gives p ${increase ? "+" : "-"} ${formatNumber(p / 100)}p = ${factor}p.`);
  }],
  ["7.G.A.2", G, "Determine whether three side lengths can form a triangle.", "on-grade", (r) => {
    const a = r.int(3, 12);
    const b = r.int(3, 12);
    const c = r.int(Math.abs(a - b) + 1, a + b - 1);
    const sides = (x, y, z) => `${x} cm, ${y} cm, ${z} cm`;
    const p = r.int(2, 9);
    const q = r.int(2, 9);
    return mc("Which set of side lengths can form a triangle?", sides(a, b, c), [sides(p, q, p + q), sides(p, q + 1, p + q + r.int(2, 6)), sides(q, q + 2, 2 * q + 2 + r.int(1, 5))],
      `The two shorter sides must add up to more than the longest side. For ${sides(a, b, c)}, that is true.`);
  }],
  ["7.SP.B.4", SP, "Compare the means of two data sets.", "on-grade", (r) => {
    const makeSet = () => {
      let data;
      do {
        data = Array.from({ length: 5 }, () => r.int(60, 99));
      } while (data.reduce((sum, v) => sum + v, 0) % 5 !== 0);
      return data;
    };
    const a = makeSet();
    let b;
    do {
      b = makeSet();
    } while (b.reduce((sum, v) => sum + v, 0) === a.reduce((sum, v) => sum + v, 0));
    const meanA = a.reduce((sum, v) => sum + v, 0) / 5;
    const meanB = b.reduce((sum, v) => sum + v, 0) / 5;
    return num(`Quiz scores for Class A: ${a.join(", ")}. Quiz scores for Class B: ${b.join(", ")}. What is the difference between the mean scores of the two classes?`, Math.abs(meanA - meanB),
      `Mean of Class A = ${meanA}, mean of Class B = ${meanB}. The difference is ${Math.abs(meanA - meanB)}.`);
  }],
  ["7.SP.C.5", SP, "Interpret a probability as the likelihood of an event.", "foundational", (r) => {
    const kind = r.pick(["impossible", "unlikely", "unlikely", "neither likely nor unlikely", "likely", "likely", "certain"]);
    const d = r.pick([5, 8, 10, 12, 20]);
    const value = {
      impossible: "0",
      unlikely: fraction(r.int(1, Math.floor((d - 1) / 3)), d),
      "neither likely nor unlikely": "1/2",
      likely: fraction(d - r.int(1, Math.floor((d - 1) / 3)), d),
      certain: "1"
    }[kind];
    const names = ["impossible", "unlikely", "neither likely nor unlikely", "likely", "certain"];
    return mc(`The probability of an event is ${value}. Which word best describes the likelihood of the event?`, kind, r.shuffle(names.filter((name) => name !== kind)),
      "Probabilities near 0 are unlikely, near 1 are likely, 1/2 is neither likely nor unlikely, 0 is impossible, and 1 is certain.");
  }],
  ["7.SP.C.6", SP, "Use experimental probability to make predictions.", "on-grade", (r) => {
    const trials = r.pick([20, 25, 40, 50]);
    const hits = r.int(2, trials - 2);
    const future = trials * r.pick([4, 6, 10, 20]);
    const [event, setup] = r.pick([["landed on red", "spun a spinner"], ["rolled a 6", "rolled a number cube"], ["made the shot", "took a free throw"], ["drew a blue tile", "drew a tile from a bag and replaced it"]]);
    return num(`${r.pick(NAMES)} ${setup} ${trials} times and ${event} ${hits} times. Based on these results, about how many times would you expect this to happen in ${future} tries?`, (hits / trials) * future,
      `The experimental probability is ${hits}/${trials}. ${hits}/${trials} × ${future} = ${(hits / trials) * future}.`);
  }],
  ["7.SP.C.8", SP, "Find the number of outcomes in a sample space.", "on-grade", (r) => {
    const a = r.int(2, 6);
    const b = r.int(2, 6);
    const c = r.int(2, 4);
    if (r.next() < 0.5) {
      return num(`A sandwich shop offers ${a} kinds of bread and ${b} kinds of filling. How many different sandwiches with one bread and one filling are possible?`, a * b, `${a} × ${b} = ${a * b} possible sandwiches.`);
    }
    return num(`${r.pick(NAMES)} has ${a} shirts, ${b} pairs of pants, and ${c} pairs of shoes. How many different outfits with one of each are possible?`, a * b * c, `${a} × ${b} × ${c} = ${a * b * c} outfits.`);
  }]
];

const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [9, 40, 41]];

export const grade8 = [
  ["8.NS.A.1", NS, "Distinguish rational and irrational numbers.", "on-grade", (r) => {
    const irr = r.sample(["√2", "√7", "π", "√15", "√21", "√3"], 2);
    const rat = r.sample(["√16", "0.75", "-4", "2/3", "√49", "0.333…"], 3);
    return ms("Select all of the irrational numbers.", irr, rat, "Irrational numbers cannot be written as a fraction of integers; square roots of non-perfect squares and π are irrational.");
  }],
  ["8.NS.A.2", NS, "Approximate irrational numbers.", "on-grade", (r) => {
    const n = r.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 20, 24, 27, 30, 35, 40, 50, 60, 70, 80, 90]);
    const lo = Math.floor(Math.sqrt(n));
    return mc(`Between which two whole numbers is √${n}?`, `${lo} and ${lo + 1}`, [`${lo - 1} and ${lo}`, `${lo + 1} and ${lo + 2}`, `${Math.floor(n / 2)} and ${Math.floor(n / 2) + 1}`],
      `${lo}² = ${lo * lo} and ${lo + 1}² = ${(lo + 1) ** 2}, and ${n} is between them.`);
  }],
  ["8.EE.A.1", EE, "Apply properties of integer exponents.", "on-grade", (r) => {
    const base = r.int(2, 9);
    const a = r.int(2, 8);
    const b = r.int(-4, 6) || 2;
    const kind = r.int(0, 2);
    if (kind === 0) return mc(`Which expression is equivalent to ${base}^${a} × ${base}^${b}?`, `${base}^${a + b}`, [`${base}^${a * b}`, `${base * base}^${a + b}`, `${base}^${a - b}`], `Add exponents with the same base: ${a} + ${signed(b)} = ${a + b}.`);
    if (kind === 1) return mc(`Which expression is equivalent to (${base}^${a})^${Math.abs(b)}?`, `${base}^${a * Math.abs(b)}`, [`${base}^${a + Math.abs(b)}`, `${base * Math.abs(b)}^${a}`, `${base}^${a - Math.abs(b)}`], `Multiply exponents: ${a} × ${Math.abs(b)} = ${a * Math.abs(b)}.`);
    return mc(`Which expression is equivalent to ${base}^${a} ÷ ${base}^${a + 2}?`, `1/${base * base}`, [`${base * base}`, `-${base * base}`, `1/${base}`], `${base}^${a} ÷ ${base}^${a + 2} = ${base}^-2 = 1/${base * base}.`);
  }],
  ["8.EE.A.2", EE, "Evaluate square roots and cube roots.", "foundational", (r) => {
    const cube = r.next() < 0.4;
    const n = cube ? r.int(2, 6) : r.int(4, 15);
    return num(`What is the value of x if x${cube ? "³" : "²"} = ${cube ? n ** 3 : n * n} and x is positive?`, n, `${cube ? `∛${n ** 3}` : `√${n * n}`} = ${n}.`);
  }],
  ["8.EE.A.4", EE, "Perform operations with numbers in scientific notation.", "advanced", (r) => {
    const a = r.int(11, 95) / 10;
    const e = r.int(3, 9);
    const b = r.int(2, 4);
    const product = round(a * b, 2);
    const [coef, exp] = product >= 10 ? [round(product / 10, 3), e + 1] : [product, e];
    return mc(`What is (${a} × 10^${e}) × ${b}, written in scientific notation?`, `${coef} × 10^${exp}`,
      [`${product} × 10^${e + 1}`, `${coef} × 10^${exp + 1}`, `${a + b} × 10^${e}`].filter((x) => x !== `${coef} × 10^${exp}`), `${a} × ${b} = ${product}, so the product is ${coef} × 10^${exp}.`);
  }],
  ["8.EE.B.5", EE, "Graph proportional relationships and interpret unit rate as slope.", "on-grade", (r) => {
    const x1 = r.int(-5, 3);
    const y1 = r.int(-6, 6);
    const run = r.int(1, 5);
    const m = r.int(-4, 4) || 2;
    return mc(`What is the slope of the line through (${x1}, ${y1}) and (${x1 + run}, ${y1 + m * run})?`, String(m),
      [String(-m), fraction(run, m * run), String(m * run)], `slope = (${y1 + m * run} - ${signed(y1)}) / (${x1 + run} - ${signed(x1)}) = ${m * run}/${run} = ${m}.`);
  }],
  ["8.EE.C.7", EE, "Solve linear equations with variables on both sides.", "on-grade", (r) => {
    const x = r.int(-8, 12);
    const a = r.int(4, 9);
    const c = r.int(1, a - 1);
    const b = r.int(-15, 15);
    const d = (a - c) * x + b;
    return num(`Solve for x: ${linear(a, b)} = ${linear(c, d)}`, x, `Subtract ${c}x: ${linear(a - c, b)} = ${d}. Then ${a - c}x = ${d - b}, so x = ${x}.`);
  }],
  ["8.EE.C.7a", EE, "Determine the number of solutions of a linear equation.", "advanced", (r) => {
    const a = r.int(2, 6);
    const b = r.int(1, 9);
    const kind = r.int(0, 2);
    const right = kind === 0 ? linear(a, b + r.int(1, 5)) : kind === 1 ? linear(a, b) : linear(a + 1, b);
    const answer = ["no solution", "infinitely many solutions", "exactly one solution"][kind];
    return mc(`How many solutions does ${a}(x + 1) + ${b - a >= 0 ? b - a : `(${b - a})`} = ${right} have?`, answer, ["no solution", "infinitely many solutions", "exactly one solution", "exactly two solutions"].filter((x) => x !== answer),
      `The left side simplifies to ${linear(a, b)}. Compare it to ${right}: ${kind === 0 ? "same slope, different constant → no solution" : kind === 1 ? "identical sides → infinitely many solutions" : "different slopes → exactly one solution"}.`);
  }],
  ["8.EE.C.8", EE, "Solve systems of two linear equations.", "advanced", (r) => {
    const x = r.int(-5, 6);
    const y = r.int(-5, 6);
    const a = r.int(1, 3);
    const b = r.int(2, 4);
    return mc(`What is the solution to the system?\n\ny = ${linear(a, y - a * x)}\ny = ${linear(-b, y + b * x)}`, `(${x}, ${y})`,
      [`(${y}, ${x})`, `(${x}, ${-y})`, `(${x + 1}, ${y + a})`].filter((c) => c !== `(${x}, ${y})`), `Set equal: ${linear(a, y - a * x)} = ${linear(-b, y + b * x)} → x = ${x}, then y = ${y}.`);
  }],
  ["8.F.A.1", F, "Understand that a function assigns exactly one output to each input.", "on-grade", (r) => {
    const xs = r.sample([1, 2, 3, 4, 5, 6, 7], 4);
    const fn = xs.map((x) => `(${x}, ${r.int(-5, 9)})`).join(", ");
    const notFn = [xs[0], xs[1], xs[0], xs[2]].map((x, i) => `(${x}, ${i * 2 + 1})`).join(", ");
    const notFn2 = [xs[3], xs[3], xs[1], xs[2]].map((x, i) => `(${x}, ${i - 1})`).join(", ");
    return ms("Select all of the sets of ordered pairs that represent a function.", [fn, xs.map((x) => `(${x}, 4)`).join(", ")], [notFn, notFn2],
      "A relation is a function when no input (x-value) is paired with two different outputs.");
  }],
  ["8.F.B.4", F, "Construct a function to model a linear relationship.", "on-grade", (r) => {
    const start = r.int(5, 40);
    const rate = r.int(2, 15);
    return mc(`A gym charges a $${start} sign-up fee and $${rate} per month. Which equation gives the total cost, c, after m months?`, `c = ${rate}m + ${start}`,
      [`c = ${start}m + ${rate}`, `c = ${rate + start}m`, `c = ${rate}(m + ${start})`], `The rate of change is ${rate} per month and the initial value is ${start}.`);
  }],
  ["8.F.A.3", F, "Distinguish linear and nonlinear functions.", "on-grade", (r) => {
    const m = r.int(2, 6);
    const b = r.int(-5, 5);
    return ms("Select all of the equations that represent linear functions.", [`y = ${linear(m, b)}`, `y = (${fraction(1, m)})x`], [`y = x² + ${Math.abs(b) + 1}`, `y = ${m}/x`, `y = ${m}^x`],
      "Linear functions have the form y = mx + b; their graphs are straight lines.");
  }],
  ["8.G.A.3", G, "Describe the effect of transformations on coordinates.", "on-grade", (r) => {
    const x = r.int(-7, 7) || 3;
    const y = r.int(-7, 7) || -2;
    const kind = r.int(0, 2);
    if (kind === 0) return mc(`Point A(${x}, ${y}) is reflected across the x-axis. What are the coordinates of A'?`, `(${x}, ${-y})`, [`(${-x}, ${y})`, `(${-x}, ${-y})`, `(${y}, ${x})`], "Reflecting across the x-axis changes the sign of the y-coordinate.");
    if (kind === 1) return mc(`Point A(${x}, ${y}) is reflected across the y-axis. What are the coordinates of A'?`, `(${-x}, ${y})`, [`(${x}, ${-y})`, `(${-x}, ${-y})`, `(${y}, ${x})`], "Reflecting across the y-axis changes the sign of the x-coordinate.");
    const k = r.int(2, 4);
    return mc(`Point A(${x}, ${y}) is dilated by a scale factor of ${k} centered at the origin. What are the coordinates of A'?`, `(${k * x}, ${k * y})`, [`(${x + k}, ${y + k})`, `(${k * x}, ${y})`, `(${x}, ${k * y})`], `Multiply both coordinates by ${k}.`);
  }],
  ["8.G.A.5", G, "Use facts about angle sums and exterior angles of triangles.", "foundational", (r) => {
    const a = r.int(25, 85);
    const b = r.int(25, 150 - a);
    return num(`Two angles of a triangle measure ${a}° and ${b}°. What is the measure of the third angle, in degrees?`, 180 - a - b, `180 - ${a} - ${b} = ${180 - a - b}.`);
  }],
  ["8.G.B.7", G, "Apply the Pythagorean Theorem.", "on-grade", (r) => {
    const [a, b, c] = r.pick(TRIPLES);
    const findLeg = r.next() < 0.4;
    return findLeg
      ? num(`A ${c}-foot ladder leans against a wall. The bottom of the ladder is ${a} feet from the wall. How high up the wall does the ladder reach, in feet?`, b, `${a}² + h² = ${c}², so h² = ${c * c - a * a} and h = ${b}.`)
      : num(`A right triangle has legs of ${a} cm and ${b} cm. What is the length of the hypotenuse, in cm?`, c, `${a}² + ${b}² = ${a * a + b * b} = ${c}².`);
  }],
  ["8.G.B.8", G, "Find the distance between two points in a coordinate system.", "advanced", (r) => {
    const [a, b, c] = r.pick(TRIPLES.slice(0, 5));
    const x = r.int(-5, 3);
    const y = r.int(-5, 3);
    return num(`What is the distance between (${x}, ${y}) and (${x + a}, ${y + b})?`, c, `√(${a}² + ${b}²) = √${a * a + b * b} = ${c}.`);
  }],
  ["8.G.C.9", G, "Use formulas for volumes of cones, cylinders, and spheres.", "on-grade", (r) => {
    const rad = r.int(2, 9);
    const h = r.int(3, 12) * 3;
    const shape = r.int(0, 2);
    if (shape === 0) return num(`Use 3.14 for π. What is the volume of a cylinder with radius ${rad} in. and height ${h} in., in cubic inches?`, round(3.14 * rad * rad * h, 2), `V = πr²h = 3.14 × ${rad * rad} × ${h} = ${round(3.14 * rad * rad * h, 2)}.`);
    if (shape === 1) return num(`Use 3.14 for π. What is the volume of a cone with radius ${rad} cm and height ${h} cm, in cubic centimeters?`, round((3.14 * rad * rad * h) / 3, 2), `V = ⅓πr²h = ⅓ × 3.14 × ${rad * rad} × ${h} = ${round((3.14 * rad * rad * h) / 3, 2)}.`);
    const sr = r.pick([3, 6, 9]);
    return num(`Use 3.14 for π. What is the volume of a sphere with radius ${sr} m, in cubic meters?`, round((4 / 3) * 3.14 * sr ** 3, 2), `V = (4/3)πr³ = (4/3) × 3.14 × ${sr ** 3} = ${round((4 / 3) * 3.14 * sr ** 3, 2)}.`);
  }],
  ["8.SP.A.3", SP, "Use the equation of a linear model to solve problems.", "on-grade", (r) => {
    const m = r.int(2, 9);
    const b = r.int(10, 60);
    const x = r.int(3, 12);
    return num(`The line of best fit for plant height (h, in cm) after w weeks is h = ${m}w + ${b}. What height does the model predict after ${x} weeks, in cm?`, m * x + b, `h = ${m}(${x}) + ${b} = ${m * x + b}.`);
  }],
  ["8.EE.A.3", EE, "Compare quantities written as a single digit times a power of 10.", "advanced", (r) => {
    const b = r.int(1, 4);
    const k = r.int(2, 4);
    const p = r.int(6, 9);
    const q = r.int(2, p - 2);
    const answer = k * 10 ** (p - q);
    return mc(`The population of a country is about ${b * k} × 10^${p}. The population of a city is about ${b} × 10^${q}. About how many times greater is the country's population than the city's?`, formatNumber(answer),
      [formatNumber(answer / 10), formatNumber(answer * 10), formatNumber(10 ** (p - q)), formatNumber(k * (p - q))],
      `${b * k} ÷ ${b} = ${k} and 10^${p} ÷ 10^${q} = 10^${p - q}, so the country is about ${k} × 10^${p - q} = ${formatNumber(answer)} times greater.`);
  }],
  ["8.EE.B.6", EE, "Write the equation of a line given its slope and y-intercept.", "on-grade", (r) => {
    const m = r.pick([-1, 1]) * r.int(1, 6);
    let b;
    do {
      b = r.int(-9, 9);
    } while (b === 0 || b === m);
    return mc(`A line has a slope of ${m} and crosses the y-axis at (0, ${b}). Which equation represents the line?`, `y = ${linear(m, b)}`,
      [`y = ${linear(b, m)}`, `y = ${linear(m, -b)}`, `y = ${term(m)}`, `y = ${linear(-m, b)}`],
      `In y = mx + b, m is the slope and b is the y-intercept, so y = ${linear(m, b)}.`);
  }],
  ["8.F.A.2", F, "Compare the rates of change of two functions represented in different ways.", "on-grade", (r) => {
    const m1 = r.int(1, 9);
    let m2;
    do {
      m2 = r.int(1, 9);
    } while (m2 === m1);
    const b1 = r.int(-5, 10);
    const b2 = r.int(-5, 10);
    const table = [0, 1, 2, 3].map((x) => `(${x}, ${m2 * x + b2})`).join(", ");
    const answer = m1 > m2 ? "Function A has a greater rate of change than Function B." : "Function B has a greater rate of change than Function A.";
    return mc(`Function A is y = ${linear(m1, b1)}. Function B is shown by the ordered pairs ${table}. Which statement is true?`, answer,
      ["Function A has a greater rate of change than Function B.", "Function B has a greater rate of change than Function A.", "The two functions have the same rate of change.", "Neither function is linear."].filter((choice) => choice !== answer),
      `Function A has a rate of change of ${m1}. In Function B, y increases by ${m2} each time x increases by 1, so its rate of change is ${m2}.`);
  }],
  ["8.F.B.4", F, "Interpret the rate of change and initial value of a linear function.", "on-grade", (r) => {
    const rate = r.int(15, 95);
    const fee = r.int(20, 120);
    const [who, unit, x] = r.pick([["A plumber", "hour", "h"], ["A bike rental shop", "hour", "h"], ["A moving company", "mile", "m"], ["A music teacher", "lesson", "n"]]);
    const askRate = r.next() < 0.5;
    const answer = askRate ? `the cost per ${unit}` : "the one-time starting fee";
    return mc(`${who} charges according to the equation c = ${rate}${x} + ${fee}, where c is the total cost in dollars and ${x} is the number of ${unit}s. What does the number ${askRate ? rate : fee} represent?`, answer,
      [askRate ? "the one-time starting fee" : `the cost per ${unit}`, "the total cost", `the number of ${unit}s`],
      `The rate of change (${rate}) is the cost per ${unit}; the initial value (${fee}) is the cost when ${x} = 0, the starting fee.`);
  }],
  ["8.G.A.4", G, "Find side lengths of figures after a dilation.", "on-grade", (r) => {
    const k = r.pick([2, 3, 4, 0.5, 1.5, 2.5]);
    const side = r.int(2, 12) * 2;
    return num(`A triangle has a side that is ${side} cm long. The triangle is dilated by a scale factor of ${k}. How long is the corresponding side of the image, in cm?`, side * k,
      `Multiply by the scale factor: ${side} × ${k} = ${formatNumber(side * k)} cm.`);
  }],
  ["8.SP.A.1", SP, "Describe patterns of association in bivariate data.", "on-grade", (r) => {
    const kind = r.pick(["positive", "negative", "none"]);
    const xs = [1, 2, 3, 4, 5, 6];
    let ys;
    const correlation = (values) => {
      const mx = 3.5;
      const my = values.reduce((sum, v) => sum + v, 0) / values.length;
      const cov = xs.reduce((sum, x, i) => sum + (x - mx) * (values[i] - my), 0);
      const vx = xs.reduce((sum, x) => sum + (x - mx) ** 2, 0);
      const vy = values.reduce((sum, v) => sum + (v - my) ** 2, 0);
      return vy === 0 ? 0 : cov / Math.sqrt(vx * vy);
    };
    do {
      const slope = r.int(3, 8);
      ys = xs.map((x) => (kind === "positive" ? 10 + slope * x : kind === "negative" ? 60 - slope * x : r.int(10, 50)) + (kind === "none" ? 0 : r.int(-2, 2)));
    } while ((kind === "none" && Math.abs(correlation(ys)) > 0.3) || (kind !== "none" && Math.abs(correlation(ys)) < 0.9));
    const answer = { positive: "a positive linear association", negative: "a negative linear association", none: "no association" }[kind];
    return mc(`The table shows hours of practice (x) and a score (y) for six students: ${xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ")}. Which best describes the association between x and y?`, answer,
      ["a positive linear association", "a negative linear association", "no association", "a nonlinear association"].filter((choice) => choice !== answer),
      kind === "none" ? "The y-values do not consistently rise or fall as x increases, so there is no association." : `As x increases, y tends to ${kind === "positive" ? "increase" : "decrease"} at a steady rate, so the association is ${kind} and linear.`);
  }],
  ["8.SP.A.4", SP, "Interpret relative frequencies in a two-way table.", "advanced", (r) => {
    const group = r.pick([10, 20, 25, 50]);
    const yes = r.int(1, group - 1);
    const other = r.int(5, 40);
    const otherYes = r.int(1, other - 1);
    return num(`In a survey, ${group} students have a pet and ${other} students do not. Of the students with a pet, ${yes} play a sport. Of the students without a pet, ${otherYes} play a sport. What percent of the students with a pet play a sport?`, (yes / group) * 100,
      `Use only the students with a pet: ${yes} ÷ ${group} = ${formatNumber(yes / group)} = ${formatNumber((yes / group) * 100)}%.`);
  }]
];

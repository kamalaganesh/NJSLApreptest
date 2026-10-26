import { fraction, formatNumber, gcd, money, round } from "./lib/util.mjs";
import { mc, ms, num, NAMES } from "./lib/items.mjs";

const OA = "Operations and Algebraic Thinking";
const NBT = "Number and Operations in Base Ten";
const NF = "Number and Operations - Fractions";
const MD = "Measurement and Data";
const G = "Geometry";

const SHAPES = {
  quadrilateral: ["square", "rectangle", "rhombus", "trapezoid", "parallelogram"],
  other: ["triangle", "pentagon", "hexagon", "circle", "octagon"]
};

function article(word) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function ordinal(n) {
  return ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"][n - 1] || `${n}th`;
}

function addMinutes(hour, minute, extra) {
  const total = hour * 60 + minute + extra;
  const h = Math.floor(total / 60);
  const m = total % 60;
  const displayHour = ((h - 1) % 12) + 1;
  return `${displayHour}:${String(m).padStart(2, "0")}`;
}

export const grade3 = [
  ["3.OA.A.1", OA, "Interpret products of whole numbers.", "foundational", (r) => {
    const a = r.int(3, 9);
    const b = r.int(3, 9);
    const thing = r.pick(["bags with", "boxes with", "rows of", "plates with"]);
    return mc(`${r.pick(NAMES)} has ${a} ${thing} ${b} ${r.pick(["apples", "crayons", "stickers", "chairs"])} each. Which expression shows the total?`,
      `${a} × ${b}`, [`${a} + ${b}`, `${a * b} ÷ ${a}`, `${b} - ${a}`, `${a} + ${a}`],
      `There are ${a} equal groups of ${b}, so the total is ${a} × ${b} = ${a * b}.`);
  }],
  ["3.OA.A.3", OA, "Use multiplication to solve word problems.", "foundational", (r) => {
    const a = r.int(3, 9);
    const b = r.int(4, 9);
    return num(`A garden has ${a} rows of tomato plants. Each row has ${b} plants. How many tomato plants are in the garden?`,
      a * b, `${a} rows × ${b} plants = ${a * b} plants.`);
  }],
  ["3.OA.A.3", OA, "Use division to solve word problems.", "foundational", (r) => {
    const groups = r.int(3, 9);
    const each = r.int(3, 9);
    return num(`${r.pick(NAMES)} puts ${groups * each} markers into ${groups} equal cups. How many markers go in each cup?`,
      each, `${groups * each} ÷ ${groups} = ${each}.`);
  }],
  ["3.OA.A.4", OA, "Determine the unknown number in a multiplication or division equation.", "on-grade", (r) => {
    const a = r.int(3, 9);
    const b = r.int(3, 9);
    return mc(`What number makes the equation true?\n\n? × ${b} = ${a * b}`, a, [a + 1, a - 1, a * b - b, b + a],
      `${a * b} ÷ ${b} = ${a}, so ${a} × ${b} = ${a * b}.`, { allowNegative: false });
  }],
  ["3.OA.B.5", OA, "Apply properties of operations (distributive property).", "on-grade", (r) => {
    const a = r.int(2, 9);
    const b = r.int(2, 6);
    const c = b + r.int(1, 4);
    return mc(`Which expression has the same value as ${a} × (${b} + ${c})?`,
      `(${a} × ${b}) + (${a} × ${c})`, [`(${a} × ${b}) + ${c}`, `${a} + (${b} × ${c})`, `(${a} + ${b}) × (${a} + ${c})`],
      `The distributive property says ${a} × (${b} + ${c}) = (${a} × ${b}) + (${a} × ${c}) = ${a * (b + c)}.`);
  }],
  ["3.OA.C.7", OA, "Fluently multiply and divide within 100.", "foundational", (r) => {
    const a = r.int(4, 10);
    const b = r.int(4, 10);
    return num(`What is ${a} × ${b}?`, a * b, `${a} × ${b} = ${a * b}.`);
  }],
  ["3.OA.D.8", OA, "Solve two-step word problems using the four operations.", "on-grade", (r) => {
    const packs = r.int(3, 8);
    const per = r.int(4, 8);
    const given = r.int(2, packs * per - 5);
    const name = r.pick(NAMES);
    return num(`${name} buys ${packs} packs of cards with ${per} cards in each pack. Then ${name} gives away ${given} cards. How many cards are left?`,
      packs * per - given, `First ${packs} × ${per} = ${packs * per}. Then ${packs * per} - ${given} = ${packs * per - given}.`);
  }],
  ["3.OA.D.9", OA, "Identify arithmetic patterns.", "on-grade", (r) => {
    const k = r.pick([3, 4, 6, 7, 8]);
    const pool = Array.from({ length: 40 }, (_, i) => i + 10);
    const multiples = r.sample(pool.filter((n) => n % k === 0), 2);
    const others = r.sample(pool.filter((n) => n % k !== 0), 3);
    return ms(`Select all of the numbers that are multiples of ${k}.`, multiples, others,
      `${multiples.join(" and ")} can be divided by ${k} with no remainder.`);
  }],
  ["3.NBT.A.1", NBT, "Round whole numbers to the nearest 10 or 100.", "foundational", (r) => {
    const n = r.int(101, 989);
    const place = r.pick([10, 100]);
    const rounded = Math.round(n / place) * place;
    return mc(`What is ${n} rounded to the nearest ${place}?`, rounded,
      [Math.floor(n / place) * place === rounded ? Math.ceil(n / place) * place : Math.floor(n / place) * place, Math.round(n / (place === 10 ? 100 : 10)) * (place === 10 ? 100 : 10), n + place],
      `Look at the digit to the right of the ${place === 10 ? "tens" : "hundreds"} place to decide whether to round up or down: ${rounded}.`);
  }],
  ["3.NBT.A.2", NBT, "Fluently add and subtract within 1000.", "foundational", (r) => {
    if (r.next() < 0.5) {
      const a = r.int(150, 600);
      const b = r.int(120, 390);
      return num(`A school library has ${a} picture books and ${b} chapter books. How many books is that in all?`, a + b, `${a} + ${b} = ${a + b}.`);
    }
    const a = r.int(400, 950);
    const b = r.int(120, a - 50);
    return num(`What is ${a} - ${b}?`, a - b, `${a} - ${b} = ${a - b}.`);
  }],
  ["3.NBT.A.3", NBT, "Multiply one-digit numbers by multiples of 10.", "foundational", (r) => {
    const a = r.int(2, 9);
    const b = r.int(2, 9) * 10;
    return num(`What is ${a} × ${b}?`, a * b, `${a} × ${b / 10} = ${(a * b) / 10}, so ${a} × ${b} = ${a * b}.`);
  }],
  ["3.NF.A.1", NF, "Understand a fraction as parts of a whole.", "foundational", (r) => {
    const d = r.pick([3, 4, 6, 8]);
    const n = r.int(1, d - 1);
    const name = r.pick(NAMES);
    return mc(`A pan of cornbread is cut into ${d} equal pieces. ${name} eats ${n} of the pieces. What fraction of the cornbread did ${name} eat?`,
      `${n}/${d}`, [`${d}/${n}`, `${n}/${d + n}`, `${d - n}/${d}`, `1/${d}`],
      `${n} out of ${d} equal pieces is ${n}/${d}.`);
  }],
  ["3.NF.A.3", NF, "Compare fractions with the same numerator or denominator.", "on-grade", (r) => {
    const sameDen = r.next() < 0.5;
    let a;
    let b;
    if (sameDen) {
      const d = r.pick([4, 6, 8]);
      const [x, y] = r.sample(Array.from({ length: d - 1 }, (_, i) => i + 1), 2);
      a = [x, d];
      b = [y, d];
    } else {
      const n = r.int(1, 3);
      const [x, y] = r.sample([2, 3, 4, 6, 8].filter((d) => d > n), 2);
      a = [n, x];
      b = [n, y];
    }
    const va = a[0] / a[1];
    const vb = b[0] / b[1];
    const fa = `${a[0]}/${a[1]}`;
    const fb = `${b[0]}/${b[1]}`;
    const correct = va > vb ? `${fa} > ${fb}` : `${fa} < ${fb}`;
    const wrong = va > vb ? [`${fa} < ${fb}`, `${fa} = ${fb}`, `${fb} > ${fa}`] : [`${fa} > ${fb}`, `${fa} = ${fb}`, `${fb} < ${fa}`];
    return mc("Which comparison is true?", correct, wrong,
      sameDen ? "When the denominators are the same, the fraction with more parts is greater." : "When the numerators are the same, the fraction with the smaller denominator has larger pieces, so it is greater.");
  }],
  ["3.NF.A.3", NF, "Express whole numbers as fractions.", "on-grade", (r) => {
    const whole = r.int(2, 5);
    const d = r.pick([2, 3, 4, 6]);
    return mc(`Which fraction is equal to ${whole}?`, `${whole * d}/${d}`, [`${whole}/${d}`, `${d}/${whole * d}`, `${whole + d}/${d}`],
      `${whole * d} ÷ ${d} = ${whole}, so ${whole * d}/${d} = ${whole}.`);
  }],
  ["3.MD.A.1", MD, "Solve elapsed time problems.", "on-grade", (r) => {
    const hour = r.int(1, 10);
    const minute = r.pick([0, 5, 10, 15, 20, 30, 40, 45]);
    const extra = r.pick([15, 20, 25, 35, 40, 45, 50]);
    const answer = addMinutes(hour, minute, extra);
    return mc(`Soccer practice starts at ${hour}:${String(minute).padStart(2, "0")}. It lasts ${extra} minutes. What time does practice end?`,
      answer, [addMinutes(hour, minute, extra + 10), addMinutes(hour, minute, extra - 10), addMinutes(hour, minute, extra + 60)],
      `Count on ${extra} minutes from ${hour}:${String(minute).padStart(2, "0")} to get ${answer}.`);
  }],
  ["3.MD.A.2", MD, "Solve problems involving masses and liquid volumes.", "on-grade", (r) => {
    const a = r.int(120, 450);
    const b = r.int(80, 300);
    return num(`A bag of rice has a mass of ${a} grams. A bag of beans has a mass of ${b} grams. What is the total mass, in grams?`, a + b, `${a} + ${b} = ${a + b} grams.`);
  }],
  ["3.MD.B.3", MD, "Solve problems using scaled bar graphs.", "on-grade", (r) => {
    const scale = r.pick([2, 5]);
    const fruits = r.sample(["apples", "bananas", "grapes", "oranges", "pears"], 3);
    const values = fruits.map(() => r.int(2, 9) * scale);
    const [hi, lo] = values[0] >= values[1] ? [0, 1] : [1, 0];
    return num(`A scaled bar graph (each square = ${scale} students) shows favorite fruits: ${fruits.map((f, i) => `${f} ${values[i]}`).join(", ")}. How many more students chose ${fruits[hi]} than ${fruits[lo]}?`,
      values[hi] - values[lo], `${values[hi]} - ${values[lo]} = ${values[hi] - values[lo]}.`);
  }],
  ["3.MD.C.7", MD, "Find the area of a rectangle.", "foundational", (r) => {
    const l = r.int(3, 12);
    const w = r.int(2, 9);
    return mc(`A rug is ${l} feet long and ${w} feet wide. What is the area of the rug?`, `${l * w} square feet`,
      [`${2 * (l + w)} square feet`, `${l + w} square feet`, `${l * w + l} square feet`], `Area = length × width = ${l} × ${w} = ${l * w} square feet.`);
  }],
  ["3.MD.D.8", MD, "Solve problems involving perimeter.", "on-grade", (r) => {
    const l = r.int(4, 15);
    const w = r.int(2, 10);
    if (r.next() < 0.5) {
      return num(`A rectangular picture frame is ${l} inches long and ${w} inches wide. What is its perimeter, in inches?`, 2 * (l + w), `Perimeter = ${l} + ${w} + ${l} + ${w} = ${2 * (l + w)} inches.`);
    }
    return num(`A rectangle has a perimeter of ${2 * (l + w)} centimeters. Its length is ${l} centimeters. What is its width, in centimeters?`, w,
      `Two lengths are ${2 * l} cm. ${2 * (l + w)} - ${2 * l} = ${2 * w}, and ${2 * w} ÷ 2 = ${w} cm.`, { difficulty: "advanced" });
  }],
  ["3.G.A.1", G, "Understand that shapes in different categories share attributes.", "on-grade", (r) => {
    const yes = r.sample(SHAPES.quadrilateral, 2);
    const no = r.sample(SHAPES.other, 3);
    return ms("Select all of the shapes that are quadrilaterals.", yes, no, "A quadrilateral is any closed shape with exactly 4 straight sides.");
  }],
  ["3.OA.A.2", OA, "Interpret whole-number quotients.", "foundational", (r) => {
    const groups = r.int(2, 9);
    const each = r.int(2, 9);
    const total = groups * each;
    const thing = r.pick(["stickers", "seeds", "beads", "pencils", "crackers"]);
    return mc(`${r.pick(NAMES)} shares ${total} ${thing} equally among ${groups} friends. Which expression shows how many ${thing} each friend gets?`,
      `${total} ÷ ${groups}`, [`${total} × ${groups}`, `${total} - ${groups}`, `${total} + ${groups}`, `${groups} ÷ ${total}`],
      `Sharing ${total} equally into ${groups} groups is ${total} ÷ ${groups} = ${each}.`);
  }],
  ["3.OA.B.6", OA, "Understand division as an unknown-factor problem.", "on-grade", (r) => {
    const a = r.int(3, 9);
    const b = r.int(3, 9);
    return mc(`Which multiplication fact can help you find ${a * b} ÷ ${b}?`, `${b} × ${a} = ${a * b}`,
      [`${b} + ${a} = ${a + b}`, `${b} × ${a + 1} = ${b * (a + 1)}`, `${a * b} - ${b} = ${a * b - b}`, `${b} × ${b + 1} = ${b * (b + 1)}`],
      `${a * b} ÷ ${b} asks, "${b} times what number is ${a * b}?" Since ${b} × ${a} = ${a * b}, the quotient is ${a}.`);
  }],
  ["3.NF.A.2", NF, "Represent fractions on a number line.", "on-grade", (r) => {
    const d = r.pick([2, 3, 4, 6, 8]);
    const n = r.int(1, d - 1);
    return mc(`A number line from 0 to 1 is divided into ${d} equal parts. A point is on the ${ordinal(n)} tick mark to the right of 0. What fraction does the point show?`,
      `${n}/${d}`, [`${d}/${n}`, `${n}/${d + 1}`, `1/${d}`, `${n + 1}/${d}`, `${n}/${d * 2}`],
      `Each part is 1/${d}. The point is ${n} part${n === 1 ? "" : "s"} from 0, so it shows ${n}/${d}.`);
  }],
  ["3.MD.C.6", MD, "Measure areas by counting unit squares.", "foundational", (r) => {
    const rows = r.int(2, 9);
    const cols = r.int(2, 9);
    return num(`A rectangle is covered with no gaps or overlaps by ${rows} rows of unit squares, with ${cols} squares in each row. Each unit square has an area of 1 square unit. What is the area of the rectangle, in square units?`,
      rows * cols, `There are ${rows} rows of ${cols} unit squares: ${rows} × ${cols} = ${rows * cols} square units.`);
  }],
  ["3.MD.C.7", MD, "Relate area to multiplication and the distributive property.", "on-grade", (r) => {
    const w = r.int(2, 9);
    const a = r.int(2, 6);
    const b = r.int(2, 6);
    return mc(`A rectangle is ${w} units wide and ${a + b} units long. It is split into two smaller rectangles: one is ${w} by ${a} and the other is ${w} by ${b}. Which expression shows the total area?`,
      `(${w} × ${a}) + (${w} × ${b})`, [`(${w} + ${a}) × (${w} + ${b})`, `${w} × ${a} + ${b}`, `(${w} × ${a}) × (${w} × ${b})`, `${w} + ${a} + ${b}`],
      `Add the areas of the two parts: ${w} × ${a} = ${w * a} and ${w} × ${b} = ${w * b}. The total is ${w * (a + b)} square units, the same as ${w} × ${a + b}.`);
  }],
  ["3.G.A.1", G, "Identify the attributes of polygons.", "foundational", (r) => {
    const [shape, sides] = r.pick([["triangle", 3], ["quadrilateral", 4], ["pentagon", 5], ["hexagon", 6], ["octagon", 8], ["rectangle", 4], ["square", 4], ["rhombus", 4], ["trapezoid", 4]]);
    const part = r.pick(["sides", "angles", "vertices"]);
    return num(`How many ${part} does ${article(shape)} ${shape} have?`, sides, `${capitalize(article(shape))} ${shape} has ${sides} sides, ${sides} angles, and ${sides} vertices.`);
  }],
  ["3.G.A.2", G, "Partition shapes into parts with equal areas.", "on-grade", (r) => {
    const parts = r.pick([2, 3, 4, 6, 8]);
    const shape = r.pick(["rectangle", "square", "circle", "hexagon"]);
    const shaded = r.int(1, parts - 1);
    return mc(`A ${shape} is divided into ${parts} parts with equal area. ${shaded} of the parts ${shaded === 1 ? "is" : "are"} shaded. What fraction of the ${shape}'s area is shaded?`,
      `${shaded}/${parts}`, [`${parts}/${shaded}`, `${shaded}/${parts + shaded}`, `${parts - shaded}/${parts}`, `1/${parts + 1}`, `${shaded + 1}/${parts}`],
      `Each part is 1/${parts} of the area, so ${shaded} part${shaded === 1 ? "" : "s"} ${shaded === 1 ? "is" : "are"} ${shaded}/${parts} of the area.`);
  }]
];

export const grade4 = [
  ["4.OA.A.2", OA, "Solve multiplicative comparison problems.", "on-grade", (r) => {
    const a = r.int(4, 15);
    const k = r.int(3, 8);
    const [p1, p2] = r.sample(NAMES, 2);
    return num(`${p1} has ${a} baseball cards. ${p2} has ${k} times as many cards as ${p1}. How many cards does ${p2} have?`, a * k, `${k} times as many means ${a} × ${k} = ${a * k}.`);
  }],
  ["4.OA.A.3", OA, "Solve multistep word problems and interpret remainders.", "advanced", (r) => {
    const per = r.int(6, 12);
    const vans = r.int(4, 9);
    const extra = r.int(1, per - 1);
    const students = per * vans + extra;
    return num(`${students} students are going on a field trip. Each van holds ${per} students. What is the fewest number of vans needed so every student has a seat?`,
      vans + 1, `${students} ÷ ${per} = ${vans} R${extra}. The remaining ${extra} students need one more van, so ${vans + 1} vans.`);
  }],
  ["4.OA.B.4", OA, "Find factor pairs and identify prime and composite numbers.", "on-grade", (r) => {
    const n = r.pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 48]);
    const factors = Array.from({ length: n }, (_, i) => i + 1).filter((x) => n % x === 0 && x > 1 && x < n);
    const nonFactors = Array.from({ length: 15 }, (_, i) => i + 2).filter((x) => n % x !== 0);
    return ms(`Select all of the numbers that are factors of ${n}.`, r.sample(factors, 2), r.sample(nonFactors, 3), `A factor of ${n} divides ${n} with no remainder. Factors of ${n}: 1, ${factors.join(", ")}, ${n}.`);
  }],
  ["4.OA.B.4", OA, "Identify prime numbers.", "on-grade", (r) => {
    const prime = r.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);
    const composites = r.sample([15, 21, 25, 27, 33, 35, 39, 45, 49, 51], 3);
    return mc("Which number is prime?", prime, composites, `${prime} has exactly two factors: 1 and ${prime}. Each other choice has more factors.`);
  }],
  ["4.OA.C.5", OA, "Generate a number pattern that follows a given rule.", "on-grade", (r) => {
    const start = r.int(2, 15);
    const step = r.int(3, 9);
    const term = r.int(6, 10);
    return num(`A pattern starts at ${start} and follows the rule "add ${step}." What is term ${term} of the pattern?`, start + step * (term - 1),
      `Term ${term} is ${start} + ${step} × ${term - 1} = ${start + step * (term - 1)}.`);
  }],
  ["4.NBT.A.2", NBT, "Read and write multi-digit numbers in expanded form.", "foundational", (r) => {
    const th = r.int(1, 9);
    const h = r.int(0, 9);
    const t = r.int(1, 9);
    const o = r.int(0, 9);
    const n = th * 1000 + h * 100 + t * 10 + o;
    const parts = [th * 1000, h * 100, t * 10, o].filter(Boolean);
    return mc(`Which shows ${formatNumber(n)} in expanded form?`, parts.map(formatNumber).join(" + "),
      [[th * 1000, t * 100, h * 10, o].filter(Boolean).map(formatNumber).join(" + "), [th * 100, h * 10, t, o].filter(Boolean).map(formatNumber).join(" + "), [th, h, t, o].join(" + ")],
      "Each digit is multiplied by its place value.");
  }],
  ["4.NBT.A.3", NBT, "Round multi-digit whole numbers to any place.", "on-grade", (r) => {
    const n = r.int(10000, 99999);
    const [place, name] = r.pick([[100, "hundred"], [1000, "thousand"], [10000, "ten thousand"]]);
    const rounded = Math.round(n / place) * place;
    const other = Math.round(n / place) * place === Math.floor(n / place) * place ? Math.ceil(n / place) * place : Math.floor(n / place) * place;
    return mc(`What is ${formatNumber(n)} rounded to the nearest ${name}?`, formatNumber(rounded), [formatNumber(other), formatNumber(Math.round(n / (place * 10)) * place * 10 + place), formatNumber(Math.round(n / 10) * 10)],
      `Look at the digit to the right of the ${name}s place: ${formatNumber(rounded)}.`);
  }],
  ["4.NBT.B.4", NBT, "Fluently add and subtract multi-digit whole numbers.", "foundational", (r) => {
    const a = r.int(2000, 9000);
    const b = r.int(1000, a - 100);
    return r.next() < 0.5
      ? num(`A stadium sold ${formatNumber(a)} tickets on Friday and ${formatNumber(b)} tickets on Saturday. How many tickets were sold in all?`, a + b, `${a} + ${b} = ${a + b}.`)
      : num(`What is ${formatNumber(a)} - ${formatNumber(b)}?`, a - b, `${a} - ${b} = ${a - b}.`);
  }],
  ["4.NBT.B.5", NBT, "Multiply up to four digits by one digit and two digits by two digits.", "on-grade", (r) => {
    if (r.next() < 0.5) {
      const a = r.int(120, 2500);
      const b = r.int(3, 9);
      return num(`What is ${formatNumber(a)} × ${b}?`, a * b, `${a} × ${b} = ${a * b}.`);
    }
    const a = r.int(12, 49);
    const b = r.int(12, 39);
    return num(`A theater has ${a} rows with ${b} seats in each row. How many seats are in the theater?`, a * b, `${a} × ${b} = ${a * b}.`);
  }],
  ["4.NBT.B.6", NBT, "Divide with remainders.", "on-grade", (r) => {
    const d = r.int(3, 9);
    const q = r.int(21, 160);
    const rem = r.int(1, d - 1);
    const n = d * q + rem;
    return mc(`What is ${n} ÷ ${d}?`, `${q} R${rem}`, [`${q + 1} R${rem}`, `${q} R${d - rem === rem ? rem + 1 : d - rem}`, `${q - 1} R${rem}`],
      `${d} × ${q} = ${d * q}, and ${n} - ${d * q} = ${rem}, so the answer is ${q} R${rem}.`);
  }],
  ["4.NF.A.1", NF, "Recognize and generate equivalent fractions.", "foundational", (r) => {
    const d = r.pick([3, 4, 5, 6]);
    const n = r.int(1, d - 1);
    const k = r.int(2, 4);
    return mc(`Which fraction is equivalent to ${n}/${d}?`, `${n * k}/${d * k}`, [`${n + k}/${d + k}`, `${n * k}/${d}`, `${n}/${d * k}`],
      `Multiply the numerator and denominator by ${k}: ${n}/${d} = ${n * k}/${d * k}.`);
  }],
  ["4.NF.A.2", NF, "Compare fractions with different numerators and denominators.", "on-grade", (r) => {
    let a;
    let b;
    do {
      a = [r.int(1, 5), r.pick([3, 4, 5, 6, 8, 10, 12])];
      b = [r.int(1, 5), r.pick([3, 4, 5, 6, 8, 10, 12])];
    } while (a[0] >= a[1] || b[0] >= b[1] || a[0] * b[1] === b[0] * a[1]);
    const fa = `${a[0]}/${a[1]}`;
    const fb = `${b[0]}/${b[1]}`;
    const greater = a[0] * b[1] > b[0] * a[1];
    return mc("Which comparison is true?", greater ? `${fa} > ${fb}` : `${fa} < ${fb}`, [greater ? `${fa} < ${fb}` : `${fa} > ${fb}`, `${fa} = ${fb}`, greater ? `${fb} > ${fa}` : `${fb} < ${fa}`],
      `Use a common denominator of ${a[1] * b[1]}: ${a[0] * b[1]}/${a[1] * b[1]} and ${b[0] * a[1]}/${a[1] * b[1]}.`);
  }],
  ["4.NF.B.3", NF, "Add and subtract mixed numbers with like denominators.", "on-grade", (r) => {
    const d = r.pick([4, 5, 6, 8]);
    const w1 = r.int(1, 4);
    const w2 = r.int(1, 3);
    const n1 = r.int(1, d - 1);
    const n2 = r.int(1, d - 1);
    const total = (w1 + w2) * d + n1 + n2;
    return mc(`${r.pick(NAMES)} walked ${w1} ${n1}/${d} miles on Monday and ${w2} ${n2}/${d} miles on Tuesday. How many miles is that in all?`,
      fraction(total, d, { mixed: true, simplify: false }), [`${w1 + w2} ${n1 + n2}/${d + d}`, fraction(total + d, d, { mixed: true, simplify: false }), fraction(total - 1, d, { mixed: true, simplify: false })],
      `Add the wholes and the fractions: ${w1 + w2} + ${n1 + n2}/${d} = ${fraction(total, d, { mixed: true, simplify: false })}.`);
  }],
  ["4.NF.B.4", NF, "Multiply a fraction by a whole number.", "on-grade", (r) => {
    const d = r.pick([3, 4, 5, 6, 8]);
    const n = r.int(1, d - 1);
    const w = r.int(2, 6);
    return mc(`A recipe uses ${n}/${d} cup of oats for one batch. How many cups of oats are needed for ${w} batches?`, fraction(w * n, d, { mixed: true, simplify: false }),
      [`${w * n}/${d * w}`, `${n + w}/${d}`, fraction(w * n + 1, d, { mixed: true, simplify: false })], `${w} × ${n}/${d} = ${w * n}/${d} = ${fraction(w * n, d, { mixed: true, simplify: false })}.`);
  }],
  ["4.NF.C.6", NF, "Use decimal notation for fractions with denominators 10 or 100.", "foundational", (r) => {
    const n = r.int(3, 97);
    if (n % 10 === 0) return mc(`Which decimal is equal to ${n / 10}/10?`, (n / 100).toFixed(1), [(n / 1000).toFixed(2), String(n / 10), `0.0${n / 10}`], `${n / 10}/10 is ${n / 10} tenths = ${(n / 100).toFixed(1)}.`);
    return mc(`Which decimal is equal to ${n}/100?`, (n / 100).toFixed(2), [(n / 10).toFixed(1), (n / 1000).toFixed(3), String(n)], `${n}/100 is ${n} hundredths = ${(n / 100).toFixed(2)}.`);
  }],
  ["4.MD.A.2", MD, "Solve measurement conversion word problems.", "on-grade", (r) => {
    const [big, small, factor] = r.pick([["feet", "inches", 12], ["yards", "feet", 3], ["hours", "minutes", 60], ["meters", "centimeters", 100], ["kilograms", "grams", 1000], ["gallons", "quarts", 4]]);
    const n = r.int(2, 9);
    const extra = factor > 10 ? r.int(1, Math.min(factor - 1, 50)) : 0;
    return num(`A ${r.pick(["ribbon", "project", "container", "race"])} measures ${n} ${big}${extra ? ` ${extra} ${small}` : ""}. How many ${small} is that?`, n * factor + extra,
      `1 ${big.replace(/s$/, "").replace("feet", "foot")} = ${factor} ${small}. ${n} × ${factor}${extra ? ` + ${extra}` : ""} = ${n * factor + extra}.`);
  }],
  ["4.MD.A.3", MD, "Apply area and perimeter formulas.", "on-grade", (r) => {
    const l = r.int(5, 15);
    const w = r.int(3, 12);
    return num(`A rectangular patio has an area of ${l * w} square feet. It is ${l} feet long. How wide is the patio, in feet?`, w, `Width = area ÷ length = ${l * w} ÷ ${l} = ${w} feet.`);
  }],
  ["4.MD.C.7", MD, "Solve problems with additive angle measures.", "on-grade", (r) => {
    const total = r.pick([90, 180, 120, 150, 135]);
    const part = r.int(20, total - 20);
    return num(`An angle measuring ${total}° is split into two angles. One angle measures ${part}°. What is the measure of the other angle, in degrees?`, total - part, `${total}° - ${part}° = ${total - part}°.`);
  }],
  ["4.G.A.2", G, "Classify two-dimensional figures by parallel and perpendicular lines and angles.", "on-grade", (r) => {
    const yes = r.sample(["square", "rectangle", "parallelogram", "rhombus"], 2);
    const no = r.sample(["triangle", "circle", "kite", "pentagon"], 3);
    return ms("Select all of the shapes that always have two pairs of parallel sides.", yes, no, "Squares, rectangles, rhombuses, and parallelograms all have two pairs of parallel sides.");
  }],
  ["4.OA.A.1", OA, "Interpret a multiplication equation as a comparison.", "foundational", (r) => {
    const a = r.int(3, 9);
    const b = r.int(3, 9);
    return mc(`Which statement describes the equation ${a * b} = ${a} × ${b}?`, `${a * b} is ${a} times as many as ${b}.`,
      [`${a * b} is ${a} more than ${b}.`, `${b} is ${a} times as many as ${a * b}.`, `${a * b} is ${a + b} times as many as ${b}.`],
      `Multiplication can compare: ${a * b} is ${a} times as many as ${b}.`);
  }],
  ["4.NF.A.2", NF, "Compare fractions to the benchmark fraction 1/2.", "on-grade", (r) => {
    const d = r.pick([3, 5, 6, 7, 8, 9, 10, 12]);
    let n;
    do {
      n = r.int(1, d - 1);
    } while (n * 2 === d);
    const more = n * 2 > d;
    return mc(`How does ${n}/${d} compare to 1/2?`, more ? `${n}/${d} > 1/2` : `${n}/${d} < 1/2`, [more ? `${n}/${d} < 1/2` : `${n}/${d} > 1/2`, `${n}/${d} = 1/2`, more ? `1/2 > ${n}/${d}` : `1/2 < ${n}/${d}`],
      `Half of ${d} is ${d / 2}. Since ${n} is ${more ? "more" : "less"} than ${d / 2}, ${n}/${d} is ${more ? "greater" : "less"} than 1/2.`);
  }],
  ["4.NF.C.5", NF, "Add fractions with denominators 10 and 100.", "on-grade", (r) => {
    const t = r.int(1, 9);
    const h = r.int(1, 99);
    const total = t * 10 + h;
    return mc(`What is ${t}/10 + ${h}/100?`, `${total}/100`, [`${t + h}/110`, `${t + h}/100`, `${t + h}/10`, `${total}/10`],
      `${t}/10 = ${t * 10}/100, so ${t * 10}/100 + ${h}/100 = ${total}/100.`);
  }],
  ["4.NF.C.7", NF, "Compare two decimals to hundredths.", "on-grade", (r) => {
    let a;
    let b;
    do {
      a = r.int(1, 99);
      b = r.int(1, 9) * 10;
    } while (a === b);
    const fa = (a / 100).toFixed(2);
    const fb = (b / 100).toFixed(1);
    const greater = a > b;
    return mc(`Which comparison of ${fa} and ${fb} is true?`, greater ? `${fa} > ${fb}` : `${fa} < ${fb}`, [greater ? `${fa} < ${fb}` : `${fa} > ${fb}`, `${fa} = ${fb}`, greater ? `${fb} > ${fa}` : `${fb} < ${fa}`],
      `${fb} is the same as ${(b / 100).toFixed(2)}. ${a} hundredths is ${greater ? "greater" : "less"} than ${b} hundredths.`);
  }],
  ["4.MD.A.1", MD, "Express a measurement in a larger unit in terms of a smaller unit.", "foundational", (r) => {
    const [big, one, small, factor] = r.pick([["feet", "foot", "inches", 12], ["yards", "yard", "feet", 3], ["hours", "hour", "minutes", 60], ["minutes", "minute", "seconds", 60], ["kilograms", "kilogram", "grams", 1000], ["meters", "meter", "centimeters", 100], ["pounds", "pound", "ounces", 16], ["liters", "liter", "milliliters", 1000], ["kilometers", "kilometer", "meters", 1000]]);
    const n = r.int(2, 12);
    return num(`How many ${small} are in ${n} ${big}?`, n * factor, `1 ${one} = ${formatNumber(factor)} ${small}, so ${n} × ${formatNumber(factor)} = ${formatNumber(n * factor)} ${small}.`);
  }],
  ["4.MD.B.4", MD, "Solve problems using data from a line plot with fractions.", "on-grade", (r) => {
    const d = r.pick([4, 8]);
    const [v1, v2, v3] = r.sample(Array.from({ length: d - 1 }, (_, i) => i + 1), 3).sort((x, y) => x - y);
    const [c1, c2, c3] = [r.int(1, 5), r.int(1, 5), r.int(1, 5)];
    return mc(`A line plot shows the lengths of some ribbons: ${c1} ${c1 === 1 ? "is" : "are"} ${fraction(v1, d)} inch, ${c2} ${c2 === 1 ? "is" : "are"} ${fraction(v2, d)} inch, and ${c3} ${c3 === 1 ? "is" : "are"} ${fraction(v3, d)} inch long. What is the difference, in inches, between the longest and shortest ribbon?`,
      fraction(v3 - v1, d), [fraction(v3 + v1, d, { mixed: true }), fraction(v3 - v2, d), fraction(v2 - v1 + v3, d, { mixed: true }), fraction(v3 - v1, d * 2)],
      `${fraction(v3, d)} - ${fraction(v1, d)} = ${v3}/${d} - ${v1}/${d} = ${fraction(v3 - v1, d)} inch.`);
  }],
  ["4.G.A.1", G, "Identify acute, right, obtuse, and straight angles.", "foundational", (r) => {
    const kind = r.pick(["acute", "acute", "obtuse", "obtuse", "right", "straight"]);
    const degrees = { acute: r.int(10, 85), right: 90, obtuse: r.int(95, 175), straight: 180 }[kind];
    return mc(`An angle measures ${degrees}°. What kind of angle is it?`, `${kind} angle`, ["acute angle", "right angle", "obtuse angle", "straight angle"].filter((name) => name !== `${kind} angle`),
      "Acute angles are less than 90°, right angles are exactly 90°, obtuse angles are between 90° and 180°, and straight angles are 180°.");
  }],
  ["4.G.A.3", G, "Identify lines of symmetry.", "on-grade", (r) => {
    const [shape, lines] = r.pick([["square", 4], ["rectangle that is not a square", 2], ["equilateral triangle", 3], ["regular hexagon", 6], ["regular pentagon", 5], ["isosceles triangle that is not equilateral", 1], ["regular octagon", 8], ["scalene triangle", 0], ["rhombus that is not a square", 2]]);
    return num(`How many lines of symmetry does ${article(shape)} ${shape} have?`, lines, `A line of symmetry folds a figure into matching halves. ${capitalize(article(shape))} ${shape} has ${lines}.`);
  }]
];

export const grade5 = [
  ["5.OA.A.1", OA, "Evaluate expressions with parentheses and brackets.", "on-grade", (r) => {
    const a = r.int(2, 9);
    const b = r.int(2, 9);
    const c = r.int(2, 6);
    const d = r.int(1, 20);
    return num(`What is the value of [${a} + ${b}] × ${c} - ${d}?`, (a + b) * c - d, `Brackets first: ${a + b}. Then ${a + b} × ${c} = ${(a + b) * c}. Then subtract ${d}: ${(a + b) * c - d}.`);
  }],
  ["5.OA.A.2", OA, "Write and interpret numerical expressions.", "on-grade", (r) => {
    const a = r.int(2, 15);
    const b = r.int(2, 15);
    const c = r.int(2, 9);
    return mc(`Which expression means "add ${a} and ${b}, then multiply by ${c}"?`, `(${a} + ${b}) × ${c}`, [`${a} + ${b} × ${c}`, `${a} × ${c} + ${b}`, `${c} + (${a} × ${b})`],
      "The parentheses show that the sum is found first, then multiplied.");
  }],
  ["5.NBT.A.2", NBT, "Explain patterns when multiplying or dividing by powers of 10.", "on-grade", (r) => {
    const base = round(r.int(11, 999) / 100, 2);
    const k = r.int(1, 3);
    const multiply = r.next() < 0.5;
    const answer = multiply ? round(base * 10 ** k, 4) : round(base / 10 ** k, 6);
    return mc(`What is ${base} ${multiply ? "×" : "÷"} 10${["", "", "²", "³"][k]}?`, formatNumber(answer),
      [formatNumber(multiply ? round(base * 10 ** (k - 1), 4) : round(base / 10 ** (k - 1), 6)), formatNumber(multiply ? round(base * 10 ** (k + 1), 4) : round(base / 10 ** (k + 1), 6)), formatNumber(multiply ? round(base / 10 ** k, 6) : round(base * 10 ** k, 4))],
      `${multiply ? "Multiplying" : "Dividing"} by 10${["", "", "²", "³"][k]} moves each digit ${k} place${k > 1 ? "s" : ""} to the ${multiply ? "left" : "right"}.`);
  }],
  ["5.NBT.A.3", NBT, "Compare decimals to thousandths.", "on-grade", (r) => {
    const values = new Set();
    while (values.size < 4) values.add(round(r.int(1000, 9999) / 1000, 3));
    const list = [...values];
    const max = Math.max(...list);
    return mc(`Which decimal has the greatest value?`, max.toFixed(3), list.filter((v) => v !== max).map((v) => v.toFixed(3)), `Compare digits from left to right; ${max.toFixed(3)} is greatest.`);
  }],
  ["5.NBT.A.4", NBT, "Round decimals to any place.", "on-grade", (r) => {
    const n = round(r.int(1001, 9999) / 1000 + r.int(0, 20), 3);
    const tenth = r.next() < 0.5;
    const ans = tenth ? round(n, 1).toFixed(1) : round(n, 2).toFixed(2);
    return mc(`What is ${n.toFixed(3)} rounded to the nearest ${tenth ? "tenth" : "hundredth"}?`, ans,
      tenth ? [(Math.floor(n * 10) / 10 === round(n, 1) ? Math.ceil(n * 10) / 10 : Math.floor(n * 10) / 10).toFixed(1), round(n, 2).toFixed(2), Math.round(n).toFixed(0)] : [(Math.floor(n * 100) / 100 === round(n, 2) ? Math.ceil(n * 100) / 100 : Math.floor(n * 100) / 100).toFixed(2), round(n, 1).toFixed(1), n.toFixed(3)],
      `Look at the digit to the right of the ${tenth ? "tenths" : "hundredths"} place: ${ans}.`);
  }],
  ["5.NBT.B.5", NBT, "Fluently multiply multi-digit whole numbers.", "foundational", (r) => {
    const a = r.int(120, 899);
    const b = r.int(12, 68);
    return num(`What is ${a} × ${b}?`, a * b, `${a} × ${b} = ${formatNumber(a * b)}.`);
  }],
  ["5.NBT.B.6", NBT, "Divide four-digit dividends by two-digit divisors.", "on-grade", (r) => {
    const d = r.int(12, 48);
    const q = r.int(24, 210);
    return num(`A factory packs ${formatNumber(d * q)} pencils into boxes of ${d}. How many boxes does it fill?`, q, `${d * q} ÷ ${d} = ${q}.`);
  }],
  ["5.NBT.B.7", NBT, "Add, subtract, multiply, and divide decimals to hundredths.", "on-grade", (r) => {
    const kind = r.int(0, 2);
    if (kind === 0) {
      const a = r.int(150, 2500) / 100;
      const b = r.int(150, 1500) / 100;
      return num(`A notebook costs ${money(a)} and a pack of pens costs ${money(b)}. What is the total cost, in dollars?`, round(a + b, 2), `${a.toFixed(2)} + ${b.toFixed(2)} = ${(a + b).toFixed(2)}.`);
    }
    if (kind === 1) {
      const price = r.int(105, 899) / 100;
      const qty = r.int(3, 9);
      return num(`One pound of apples costs ${money(price)}. What is the cost, in dollars, of ${qty} pounds?`, round(price * qty, 2), `${price.toFixed(2)} × ${qty} = ${(price * qty).toFixed(2)}.`);
    }
    const a = r.int(500, 2000) / 100;
    const b = r.int(100, Math.round(a * 100) - 50) / 100;
    return num(`What is ${a.toFixed(2)} - ${b.toFixed(2)}?`, round(a - b, 2), `${a.toFixed(2)} - ${b.toFixed(2)} = ${(a - b).toFixed(2)}.`);
  }],
  ["5.NF.A.1", NF, "Add and subtract fractions with unlike denominators.", "on-grade", (r) => {
    let d1;
    let d2;
    do {
      [d1, d2] = [r.pick([2, 3, 4, 5, 6, 8]), r.pick([3, 4, 6, 8, 10, 12])];
    } while (d1 === d2);
    const n1 = r.int(1, d1 - 1);
    const n2 = r.int(1, d2 - 1);
    const den = d1 * d2;
    return mc(`What is ${n1}/${d1} + ${n2}/${d2}?`, fraction(n1 * d2 + n2 * d1, den, { mixed: true }),
      [`${n1 + n2}/${d1 + d2}`, fraction(n1 + n2, Math.max(d1, d2), { mixed: true }), fraction(n1 * d2 + n2 * d1 + d2, den, { mixed: true })],
      `Rewrite with a common denominator: ${n1 * d2}/${den} + ${n2 * d1}/${den} = ${fraction(n1 * d2 + n2 * d1, den, { mixed: true })}.`);
  }],
  ["5.NF.B.3", NF, "Interpret a fraction as division.", "on-grade", (r) => {
    const people = r.int(3, 8);
    let items = r.int(2, 9);
    if (items % people === 0) items += 1;
    return mc(`${items} pizzas are shared equally among ${people} friends. How much pizza does each friend get?`, `${fraction(items, people, { mixed: true })} pizzas`,
      [`${fraction(people, items, { mixed: true })} pizzas`, `1/${people} pizza`, `${items - people > 0 ? items - people : items + people} pizzas`],
      `${items} ÷ ${people} = ${items}/${people} = ${fraction(items, people, { mixed: true })}.`);
  }],
  ["5.NF.B.4", NF, "Multiply a fraction by a fraction.", "on-grade", (r) => {
    const a = [r.int(1, 4), r.pick([3, 4, 5, 6])];
    const b = [r.int(1, 5), r.pick([2, 3, 4, 6, 8])];
    if (a[0] >= a[1]) a[0] = a[1] - 1;
    if (b[0] >= b[1]) b[0] = b[1] - 1;
    return mc(`What is ${a[0]}/${a[1]} × ${b[0]}/${b[1]}?`, fraction(a[0] * b[0], a[1] * b[1]),
      [fraction(a[0] + b[0], a[1] + b[1], { simplify: false }), fraction(a[0] * b[1], a[1] * b[0]), fraction(a[0] * b[0], a[1] + b[1], { simplify: false })],
      `Multiply numerators and denominators: ${a[0] * b[0]}/${a[1] * b[1]} = ${fraction(a[0] * b[0], a[1] * b[1])}.`);
  }],
  ["5.NF.B.7", NF, "Divide unit fractions by whole numbers and whole numbers by unit fractions.", "advanced", (r) => {
    const u = r.pick([2, 3, 4, 5, 6]);
    const w = r.int(2, 8);
    if (r.next() < 0.5) {
      return mc(`How many 1/${u}-cup servings are in ${w} cups of yogurt?`, String(w * u), [fraction(w, u, { mixed: true }), `1/${w * u}`, String(w + u)],
        `${w} ÷ 1/${u} = ${w} × ${u} = ${w * u}.`);
    }
    return mc(`${w} friends share 1/${u} of a pound of trail mix equally. What fraction of a pound does each friend get?`, `1/${u * w}`, [String(u * w), `${w}/${u}`, `1/${u + w}`],
      `1/${u} ÷ ${w} = 1/${u * w}.`);
  }],
  ["5.MD.A.1", MD, "Convert among measurement units within a system.", "on-grade", (r) => {
    const [from, to, factor] = r.pick([["centimeters", "meters", 100], ["grams", "kilograms", 1000], ["ounces", "pounds", 16], ["inches", "feet", 12], ["milliliters", "liters", 1000]]);
    const target = round(r.int(2, 30) / (factor === 16 || factor === 12 ? 4 : 10), 2);
    const amount = round(target * factor, 2);
    return num(`A ${r.pick(["package", "bottle", "board", "bag"])} measures ${formatNumber(amount)} ${from}. How many ${to} is that?`, target, `${formatNumber(amount)} ÷ ${factor} = ${target} ${to}.`);
  }],
  ["5.MD.C.5", MD, "Find the volume of right rectangular prisms.", "on-grade", (r) => {
    const l = r.int(2, 12);
    const w = r.int(2, 9);
    const h = r.int(2, 8);
    if (r.next() < 0.6) return num(`A fish tank is ${l} inches long, ${w} inches wide, and ${h} inches tall. What is its volume, in cubic inches?`, l * w * h, `V = l × w × h = ${l} × ${w} × ${h} = ${l * w * h} cubic inches.`);
    const l2 = r.int(2, 6);
    return num(`A figure is made of two rectangular prisms. One is ${l} cm × ${w} cm × ${h} cm. The other is ${l2} cm × ${w} cm × ${h} cm. What is the total volume, in cubic centimeters?`, (l + l2) * w * h,
      `${l * w * h} + ${l2 * w * h} = ${(l + l2) * w * h} cubic centimeters.`, { difficulty: "advanced" });
  }],
  ["5.G.A.2", G, "Graph points on the coordinate plane to solve problems.", "on-grade", (r) => {
    const x = r.int(0, 8);
    const y = r.int(0, 8);
    const dx = r.int(1, 5);
    const dy = r.int(1, 5);
    return mc(`A point is located at (${x}, ${y}). It moves ${dx} units right and ${dy} units up. What are its new coordinates?`, `(${x + dx}, ${y + dy})`,
      [`(${x + dy}, ${y + dx})`, `(${y + dy}, ${x + dx})`, `(${x + dx}, ${y})`, `(${x}, ${y + dy})`, `(${x + dx + 1}, ${y + dy})`], `Right changes the x-coordinate (${x} + ${dx}); up changes the y-coordinate (${y} + ${dy}).`);
  }],
  ["5.G.B.4", G, "Classify two-dimensional figures in a hierarchy.", "advanced", (r) => {
    const sets = [
      ["square", ["rectangle", "rhombus", "parallelogram", "quadrilateral"], ["triangle", "trapezoid with only one pair of parallel sides", "pentagon"]],
      ["rectangle", ["parallelogram", "quadrilateral"], ["triangle", "pentagon", "circle"]],
      ["rhombus", ["parallelogram", "quadrilateral"], ["triangle", "hexagon", "circle"]]
    ];
    const [shape, yes, no] = r.pick(sets);
    return ms(`Select all of the names that ALWAYS describe a ${shape}.`, r.sample(yes, 2), r.sample(no, 3), `Every ${shape} is also a ${yes.join(", a ")}.`);
  }],
  ["5.OA.B.3", OA, "Generate two numerical patterns and identify relationships between them.", "advanced", (r) => {
    const a = r.int(2, 6);
    const k = r.int(2, 4);
    const step = r.int(3, 8);
    return num(`Pattern A starts at 0 and adds ${a} each time. Pattern B starts at 0 and adds ${a * k} each time. When the term in Pattern A is ${a * step}, what is the corresponding term in Pattern B?`,
      a * k * step, `Each term in Pattern B is ${k} times the corresponding term in Pattern A, so ${a * step} × ${k} = ${a * k * step}.`);
  }],
  ["5.NBT.A.1", NBT, "Understand that each place is 10 times the place to its right.", "on-grade", (r) => {
    const places = ["thousands", "hundreds", "tens", "ones", "tenths", "hundredths"];
    const gap = r.pick([1, 1, 2]);
    const i = r.int(0, places.length - 1 - gap);
    const digit = r.int(1, 9);
    const digits = places.map((_, index) => {
      if (index === i || index === i + gap) return digit;
      let other;
      do {
        other = r.int(index === 0 ? 1 : 0, 9);
      } while (other === digit);
      return other;
    });
    const number = `${digits[0]},${digits[1]}${digits[2]}${digits[3]}.${digits[4]}${digits[5]}`;
    const times = 10 ** gap;
    return mc(`In the number ${number}, the value of the ${digit} in the ${places[i]} place is how many times the value of the ${digit} in the ${places[i + gap]} place?`,
      String(times), [gap === 1 ? "100" : "10", "1/10", "1", gap === 1 ? "1,000" : "1/100"],
      `Each place is 10 times the place to its right, so ${gap} place${gap === 1 ? "" : "s"} to the left is ${times} times the value.`);
  }],
  ["5.NF.A.2", NF, "Solve word problems by adding or subtracting fractions with unlike denominators.", "on-grade", (r) => {
    let d1;
    let d2;
    let n1;
    let n2;
    do {
      [d1, d2] = [r.pick([2, 3, 4, 5, 6, 8]), r.pick([3, 4, 6, 8, 10, 12])];
      n1 = r.int(1, d1 - 1);
      n2 = r.int(1, d2 - 1);
    } while (d1 === d2 || n1 * d2 <= n2 * d1);
    const name = r.pick(NAMES);
    const den = d1 * d2;
    if (r.next() < 0.5) {
      return mc(`${name} walked ${n1}/${d1} mile in the morning and ${n2}/${d2} mile in the afternoon. How many miles did ${name} walk in all?`, fraction(n1 * d2 + n2 * d1, den, { mixed: true }),
        [`${n1 + n2}/${d1 + d2}`, fraction(n1 + n2, Math.max(d1, d2), { mixed: true }), fraction(n1 * d2 - n2 * d1, den)],
        `Use a common denominator: ${n1 * d2}/${den} + ${n2 * d1}/${den} = ${fraction(n1 * d2 + n2 * d1, den, { mixed: true })} miles.`);
    }
    return mc(`${name} had ${n1}/${d1} of a pound of clay and used ${n2}/${d2} of a pound for a project. How much clay is left, in pounds?`, fraction(n1 * d2 - n2 * d1, den),
      [`${Math.abs(n1 - n2)}/${Math.abs(d1 - d2)}`, fraction(n1 * d2 + n2 * d1, den, { mixed: true }), fraction(n1 * d2 - n2 * d1 + d1, den, { mixed: true })],
      `Use a common denominator: ${n1 * d2}/${den} - ${n2 * d1}/${den} = ${fraction(n1 * d2 - n2 * d1, den)} pound.`);
  }],
  ["5.NF.B.6", NF, "Solve real-world problems by multiplying mixed numbers.", "advanced", (r) => {
    const w = r.int(1, 4);
    const d = r.pick([2, 3, 4, 5, 8]);
    let n;
    do {
      n = r.int(1, d - 1);
    } while (gcd(n, d) !== 1);
    const batches = r.int(2, 6);
    const total = (w * d + n) * batches;
    return mc(`A recipe uses ${w} ${n}/${d} cups of flour. How many cups of flour are needed for ${batches} batches?`, fraction(total, d, { mixed: true }),
      [`${w * batches} ${n}/${d}`, fraction(w * d + n + batches * d, d, { mixed: true }), fraction(total, d * batches, { mixed: true }), fraction(total + d, d, { mixed: true })],
      `${w} ${n}/${d} = ${w * d + n}/${d}, and ${w * d + n}/${d} × ${batches} = ${total}/${d} = ${fraction(total, d, { mixed: true })} cups.`);
  }],
  ["5.MD.B.2", MD, "Use line plots with fractional data to solve problems.", "advanced", (r) => {
    const d = r.pick([2, 4, 8]);
    const values = r.sample(Array.from({ length: 2 * d - 1 }, (_, i) => i + 1), 3).sort((x, y) => x - y);
    const counts = values.map(() => r.int(1, 4));
    const beakers = counts.reduce((sum, c) => sum + c, 0);
    const totalParts = values.reduce((sum, v, i) => sum + v * counts[i], 0);
    const list = values.map((v, i) => `${counts[i]} with ${fraction(v, d, { mixed: true })} liter`).join(", ");
    return mc(`A line plot shows the water in ${beakers} beakers: ${list}. If the water were shared equally among all the beakers, how much would each beaker hold, in liters?`, fraction(totalParts, d * beakers, { mixed: true }),
      [fraction(totalParts, d, { mixed: true }), fraction(totalParts, d * (beakers + 1), { mixed: true }), fraction(values[1], d, { mixed: true }), fraction(totalParts + beakers, d * beakers, { mixed: true })],
      `The total is ${fraction(totalParts, d, { mixed: true })} liters. ${fraction(totalParts, d, { mixed: true })} ÷ ${beakers} = ${fraction(totalParts, d * beakers, { mixed: true })} liter per beaker.`);
  }],
  ["5.MD.C.4", MD, "Measure volume by counting unit cubes.", "foundational", (r) => {
    const l = r.int(2, 8);
    const w = r.int(2, 6);
    const h = r.int(2, 5);
    return num(`A box is packed with unit cubes with no gaps. The bottom layer has ${w} rows of ${l} cubes, and there are ${h} layers. What is the volume of the box, in cubic units?`,
      l * w * h, `Each layer has ${w} × ${l} = ${w * l} cubes, and ${w * l} × ${h} layers = ${l * w * h} cubic units.`);
  }],
  ["5.G.A.1", G, "Use ordered pairs to locate points on the coordinate plane.", "foundational", (r) => {
    const x = r.int(1, 10);
    const y = r.int(1, 10);
    return mc(`Start at the origin. Move ${x} unit${x === 1 ? "" : "s"} right along the x-axis, then ${y} unit${y === 1 ? "" : "s"} up. Which ordered pair names this point?`, `(${x}, ${y})`,
      [`(${y}, ${x})`, `(${x}, 0)`, `(0, ${y})`, `(${x + y}, 0)`, `(${x}, ${x + y})`],
      `The first number tells how far to move right (x = ${x}); the second tells how far to move up (y = ${y}).`);
  }]
];

export { gcd };

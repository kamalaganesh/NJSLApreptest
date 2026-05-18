import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");

const grades = [3, 4, 5, 6, 7, 8, 9, 10];
const subjects = ["math", "ela", "science"];

function makeQuestion(id, grade, subject, question, correctAnswer, distractors) {
  return {
    id,
    grade,
    subject,
    question,
    choices: rotateChoices(uniqueChoices([correctAnswer, ...distractors]), id),
    correctAnswer: String(correctAnswer)
  };
}

function uniqueChoices(values) {
  const seen = new Set();
  const output = [];

  for (const value of values) {
    const normalized = String(value);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      output.push(normalized);
    }
  }

  let filler = 1;
  while (output.length < 4) {
    const candidate = `Not enough information ${filler}`;
    if (!seen.has(candidate)) {
      output.push(candidate);
    }
    filler += 1;
  }

  return output.slice(0, 4);
}

function rotateChoices(choices, seed) {
  const offset = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % choices.length;
  return [...choices.slice(offset), ...choices.slice(0, offset)];
}

function fraction(numerator, denominator) {
  return `${numerator}/${denominator}`;
}

function mathQuestion(grade, index) {
  const id = `M${grade}Q${index}`;
  const n = grade + index;
  const variant = (index - 1) % 10;

  if (grade <= 5) {
    const lower = [
      () => {
        const a = 125 + n * 8;
        const b = 39 + grade * 4;
        return makeQuestion(id, grade, "math", `A library has ${a} fiction books and ${b} nonfiction books on a cart. How many books are on the cart?`, a + b, [a + b - 10, a - b, a + b + 10]);
      },
      () => {
        const sideA = grade + 3;
        const sideB = (index % 5) + 4;
        return makeQuestion(id, grade, "math", `A rectangular garden is ${sideA} feet long and ${sideB} feet wide. What is its area?`, `${sideA * sideB} square feet`, [`${2 * (sideA + sideB)} square feet`, `${sideA + sideB} square feet`, `${sideA * sideB + sideA} square feet`]);
      },
      () => {
        const denominator = grade <= 3 ? 4 : 8;
        const numerator = (index % (denominator - 1)) + 1;
        return makeQuestion(id, grade, "math", `Which fraction is equivalent to ${fraction(numerator, denominator)}?`, fraction(numerator * 2, denominator * 2), [fraction(numerator + 1, denominator * 2), fraction(numerator, denominator * 2), fraction(numerator * 2 + 1, denominator * 2)]);
      },
      () => {
        const start = 6 * grade + index;
        const rule = grade + 2;
        return makeQuestion(id, grade, "math", `The pattern starts ${start}, ${start + rule}, ${start + rule * 2}, ${start + rule * 3}. What is the next number?`, start + rule * 4, [start + rule * 3 + 1, start + rule * 5, start + rule * 4 - 2]);
      },
      () => {
        const thousands = grade + 2;
        const hundreds = index % 9;
        const tens = (index + 3) % 9;
        const number = thousands * 1000 + hundreds * 100 + tens * 10 + 7;
        return makeQuestion(id, grade, "math", `What is the value of the digit ${hundreds} in ${number}?`, hundreds * 100, [hundreds * 10, hundreds, hundreds * 1000]);
      },
      () => {
        const total = 48 + index;
        const groups = grade + 3;
        const perGroup = Math.floor(total / groups);
        return makeQuestion(id, grade, "math", `${total - (total % groups)} students are split equally into ${groups} teams. How many students are on each team?`, perGroup, [perGroup + 1, perGroup - 1, groups]);
      },
      () => {
        const cups = grade + index;
        return makeQuestion(id, grade, "math", `A recipe uses ${cups} cups of flour. How many cups are needed to make the recipe 3 times?`, cups * 3, [cups + 3, cups * 2, cups * 3 + 3]);
      },
      () => {
        const data = [grade + 2, grade + 5, grade + 5, grade + 7];
        return makeQuestion(id, grade, "math", `The numbers of books read by four students are ${data.join(", ")}. What is the mode?`, grade + 5, [grade + 2, grade + 7, grade + 4]);
      },
      () => {
        const perimeter = 2 * ((grade + 5) + (index % 6 + 3));
        return makeQuestion(id, grade, "math", `A rectangle has side lengths ${grade + 5} inches and ${index % 6 + 3} inches. What is the perimeter?`, `${perimeter} inches`, [`${perimeter / 2} inches`, `${(grade + 5) * (index % 6 + 3)} inches`, `${perimeter + 4} inches`]);
      },
      () => {
        const left = grade * 10 + index;
        const right = grade * 7 + index * 2;
        return makeQuestion(id, grade, "math", `Which comparison is true?`, `${left} > ${right}`, [`${left} < ${right}`, `${left} = ${right}`, `${right} > ${left + 20}`]);
      }
    ];
    return lower[variant]();
  }

  if (grade <= 8) {
    const middle = [
      () => {
        const x = grade + index;
        return makeQuestion(id, grade, "math", `Evaluate 3x + 7 when x = ${x}.`, 3 * x + 7, [3 * x, x + 7, 3 * x + 10]);
      },
      () => {
        const price = 20 + index;
        const percent = 10 + grade;
        const sale = price * (1 - percent / 100);
        return makeQuestion(id, grade, "math", `A $${price} item is discounted by ${percent}%. What is the sale price?`, `$${sale.toFixed(2)}`, [`$${(price - percent).toFixed(2)}`, `$${(price + percent / 100).toFixed(2)}`, `$${(price * percent / 100).toFixed(2)}`]);
      },
      () => {
        const rate = grade + 2;
        const hours = (index % 5) + 2;
        return makeQuestion(id, grade, "math", `A cyclist travels at a constant rate of ${rate} miles per hour for ${hours} hours. How far does the cyclist travel?`, `${rate * hours} miles`, [`${rate + hours} miles`, `${rate * hours - rate} miles`, `${rate * hours + hours} miles`]);
      },
      () => {
        const answer = grade + 4;
        const b = index + 9;
        const c = 2 * answer + b;
        return makeQuestion(id, grade, "math", `Solve for x: 2x + ${b} = ${c}`, answer, [answer + 2, answer - 2, c - b]);
      },
      () => {
        const values = [grade, grade + 3, grade + 5, grade + 8, grade + 9];
        const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
        return makeQuestion(id, grade, "math", `What is the mean of ${values.join(", ")}?`, mean, [mean + 1, values[2], values[0]]);
      },
      () => {
        const base = grade + 6;
        const height = (index % 7) + 4;
        return makeQuestion(id, grade, "math", `A triangle has a base of ${base} cm and a height of ${height} cm. What is its area?`, `${(base * height) / 2} square cm`, [`${base * height} square cm`, `${base + height} square cm`, `${base * height + 2} square cm`]);
      },
      () => {
        const slope = grade - 4;
        const intercept = index % 6;
        const x = 4;
        return makeQuestion(id, grade, "math", `For y = ${slope}x + ${intercept}, what is y when x = ${x}?`, slope * x + intercept, [slope + intercept, slope * x, slope * x + intercept + 4]);
      },
      () => {
        const total = 5 * (grade + index);
        const ratioA = 2;
        const ratioB = 3;
        return makeQuestion(id, grade, "math", `A ratio of blue to red tiles is ${ratioA}:${ratioB}. If there are ${total} tiles, how many are red?`, (total / (ratioA + ratioB)) * ratioB, [(total / 5) * 2, total - 3, total / 3]);
      },
      () => {
        const radius = (index % 5) + 3;
        return makeQuestion(id, grade, "math", `Using 3.14 for pi, what is the approximate circumference of a circle with radius ${radius}?`, `${(2 * 3.14 * radius).toFixed(2)}`, [`${(3.14 * radius * radius).toFixed(2)}`, `${(3.14 * radius).toFixed(2)}`, `${(2 * radius).toFixed(2)}`]);
      },
      () => {
        const exponent = (index % 3) + 2;
        return makeQuestion(id, grade, "math", `Which expression is equivalent to 4^${exponent} x 4^2?`, `4^${exponent + 2}`, [`8^${exponent}`, `4^${exponent - 2}`, `16^${exponent}`]);
      }
    ];
    return middle[variant]();
  }

  const high = [
    () => {
      const m = index % 5 + 1;
      const b = grade - 6;
      return makeQuestion(id, grade, "math", `What is the slope of the line y = ${m}x + ${b}?`, m, [b, -m, m + b]);
    },
    () => {
      const rootA = grade - 7;
      const rootB = (index % 5) + 2;
      return makeQuestion(id, grade, "math", `Which value is a solution of (x - ${rootA})(x - ${rootB}) = 0?`, rootA, [rootA + rootB, -rootA, rootB + 1]);
    },
    () => {
      const x = index % 7 + 2;
      return makeQuestion(id, grade, "math", `If f(x) = x^2 - 3x + 5, what is f(${x})?`, x * x - 3 * x + 5, [x * x + 5, 2 * x - 3, x * x - 3]);
    },
    () => {
      const solution = grade - 5;
      const c = index + 8;
      return makeQuestion(id, grade, "math", `Solve for x: ${c} - 4x = ${c - 4 * solution}`, solution, [solution + 1, -solution, c - solution]);
    },
    () => {
      const a = index % 4 + 2;
      const b = grade - 4;
      return makeQuestion(id, grade, "math", `The line y = ${a}x + ${b} is translated up 3 units. What is the new y-intercept?`, b + 3, [b - 3, a + 3, b]);
    },
    () => {
      const legA = 6 + (index % 4);
      const legB = 8 + (index % 4);
      const hyp = Math.sqrt(legA * legA + legB * legB).toFixed(1);
      return makeQuestion(id, grade, "math", `A right triangle has legs ${legA} and ${legB}. Which expression gives the hypotenuse length?`, `sqrt(${legA * legA + legB * legB})`, [`sqrt(${legA + legB})`, `${hyp}^2`, `${legA + legB}`]);
    },
    () => {
      const a = grade + 1;
      return makeQuestion(id, grade, "math", `Which expression is equivalent to (x + ${a})^2?`, `x^2 + ${2 * a}x + ${a * a}`, [`x^2 + ${a * a}`, `x^2 + ${a}x + ${a * a}`, `2x + ${2 * a}`]);
    },
    () => {
      const y = index % 6 + 1;
      const x = y + 2;
      return makeQuestion(id, grade, "math", `In the system x - y = 2 and x + y = ${x + y}, what is x?`, x, [y, x + y, x - 2]);
    },
    () => {
      const start = grade + 2;
      const difference = index % 5 + 2;
      return makeQuestion(id, grade, "math", `An arithmetic sequence starts at ${start} and has common difference ${difference}. What is the 5th term?`, start + difference * 4, [start + difference * 5, start * difference, start + difference]);
    },
    () => {
      const side = index % 8 + 5;
      return makeQuestion(id, grade, "math", `A square has side length ${side}. Its area is doubled. Which expression represents the new area?`, `${2 * side * side}`, [`${side * side + 2}`, `${4 * side}`, `${side * side}`]);
    }
  ];
  return high[variant]();
}

const elaBanks = {
  lower: [
    ["Lena planted three seeds in cups by the sunny window. Each morning she measured the sprouts and wrote the height in a notebook.", "What detail shows Lena is careful?", "She wrote the height in a notebook.", ["She used three cups.", "The cups were by a window.", "The seeds were small."]],
    ["The town opened a new trail behind the school. Families used it to walk, jog, and look for birds after dinner.", "What is the main idea?", "The new trail gives people a place to be active outside.", ["The school serves dinner.", "Birds built the trail.", "Families stopped walking."]],
    ["Omar was reluctant to speak at first, but after practicing twice he volunteered to read his paragraph.", "What does reluctant mean?", "Unsure or unwilling", ["Very loud", "Already finished", "Full of energy"]],
    ["The article explains how rain enters storm drains and eventually reaches nearby rivers.", "Which text structure is used?", "Sequence", ["Cause only", "Question and answer", "Problem without solution"]],
    ["Mia packed an extra pencil because her pencil tip broke during yesterday's quiz.", "Why did Mia pack an extra pencil?", "She learned from a previous problem.", ["She wanted to draw after school.", "She lost her backpack.", "She disliked quizzes."]],
    ["A poster says, 'Turn off lights when leaving a room. Small actions save energy.'", "What is the author's purpose?", "To persuade people to save energy", ["To tell a joke", "To describe a character", "To compare two animals"]],
    ["The creek was shallow, so the hikers could see smooth stones under the clear water.", "Which word helps the reader understand shallow?", "could see smooth stones", ["The creek", "hikers", "under"]],
    ["First, the class mixed soil and seeds. Next, they watered the tray. Finally, they placed it near sunlight.", "Which event happened second?", "They watered the tray.", ["They mixed soil and seeds.", "They placed it near sunlight.", "They harvested vegetables."]],
    ["Noah's hands trembled before the spelling bee, but he smiled when his friend gave him a thumbs-up.", "What can the reader infer?", "Noah felt nervous but encouraged.", ["Noah forgot every word.", "Noah wanted to leave school.", "Noah disliked his friend."]],
    ["A text about bees includes a diagram of a flower and labels for pollen and nectar.", "How does the diagram help?", "It shows parts mentioned in the text.", ["It replaces all the words.", "It gives the story a setting.", "It lists every bee species."]]
  ],
  middle: [
    ["The passage describes a community garden that reduced food waste and gave students a place to study plant growth.", "Which claim is best supported?", "The garden benefits both the community and student learning.", ["The garden is too expensive to maintain.", "Students only visit during winter.", "Food waste increased after the garden opened."]],
    ["A narrator says the hallway seemed longer than usual before an important audition.", "What does this detail suggest?", "The narrator is anxious.", ["The hallway changed size.", "The audition was canceled.", "The narrator is bored."]],
    ["The author contrasts reusable water bottles with single-use plastic bottles.", "Why does the author use contrast?", "To show advantages and disadvantages of each choice", ["To define a scientific term", "To introduce dialogue", "To hide the author's opinion"]],
    ["The word meticulous appears in a sentence about a student checking each line of code before submitting a project.", "What does meticulous most likely mean?", "Extremely careful", ["Quickly forgotten", "Easily damaged", "Loud and confusing"]],
    ["An editorial states that later library hours would help students who participate in after-school activities.", "Which evidence best supports the claim?", "A survey showing many students need evening study space", ["A list of favorite novels", "A map of the library entrance", "A recipe from the cafeteria"]],
    ["A biography begins with the inventor's failed experiments before describing the final successful design.", "What theme is developed?", "Persistence can lead to progress.", ["Success requires no planning.", "Failure should always end a project.", "Inventors work only alone."]],
    ["The paragraph uses words such as however, although, and unlike.", "What relationship do these words signal?", "Contrast", ["Chronology", "Definition", "Repetition"]],
    ["A poem repeats the line 'still the river moves' after each stanza.", "What is one effect of the repetition?", "It emphasizes steady change.", ["It changes the speaker.", "It proves the poem is nonfiction.", "It removes imagery."]],
    ["Two articles discuss school uniforms. One focuses on cost savings, while the other focuses on student expression.", "How do the articles differ?", "They emphasize different concerns about the same topic.", ["They have the same central claim.", "Only one uses words.", "Neither gives reasons."]],
    ["A student summary includes minor details but leaves out the central idea.", "What revision would improve it most?", "Add the central idea and keep only key details.", ["Add every sentence from the text.", "Remove the title only.", "Change all nouns to pronouns."]]
  ],
  high: [
    ["An essay argues that public transportation should be expanded because it reduces traffic and improves access to jobs.", "Which evidence would most strengthen the argument?", "Data showing shorter commute times after new bus routes opened", ["A personal dislike of traffic lights", "A poem about a train station", "A list of unrelated city parks"]],
    ["In a story, a character refuses help early on but later asks teammates for advice before solving a problem.", "What does this change reveal?", "The character learns to value collaboration.", ["The character becomes less responsible.", "The conflict disappears immediately.", "The setting controls every decision."]],
    ["The phrase 'the proposal gained traction' appears in an article about a new recycling policy.", "What does gained traction mean?", "Became more accepted or supported", ["Moved down a road", "Lost important details", "Created extra waste"]],
    ["A speech uses parallel structure in three consecutive sentences beginning with 'We will.'", "What is the likely effect?", "It creates emphasis and a sense of momentum.", ["It makes the claim less clear.", "It removes the audience.", "It changes the topic to fiction."]],
    ["A historical account includes diary entries from workers and a chart of wages.", "Why include both sources?", "To combine personal perspective with quantitative evidence", ["To avoid explaining the event", "To make the text a poem", "To prove all workers agreed"]],
    ["An author acknowledges an opposing view before explaining why the evidence still supports the main claim.", "What is this strategy called?", "Counterclaim and rebuttal", ["Flashback", "Foreshadowing", "Stage direction"]],
    ["A paragraph begins with a broad claim and then analyzes the wording of a quotation.", "What is the paragraph mainly doing?", "Explaining how textual evidence supports an interpretation", ["Listing unrelated facts", "Changing the genre", "Replacing evidence with opinion"]],
    ["A narrator describes a bright celebration while privately worrying about an unresolved conflict.", "What literary effect is created?", "Tension between outward events and inner feelings", ["A complete lack of conflict", "A purely technical explanation", "A shift from prose to drama"]],
    ["Two authors write about artificial intelligence. One emphasizes innovation; the other emphasizes ethical risks.", "What is the best comparison?", "They address the same topic with different perspectives.", ["They use identical evidence.", "They avoid making claims.", "They write about unrelated topics."]],
    ["A conclusion repeats the thesis exactly without connecting the evidence to a broader insight.", "Which revision would improve it?", "Synthesize the evidence and explain why the claim matters.", ["Add a new unrelated claim.", "Delete the introduction.", "Use only shorter words."]]
  ]
};

const elaContexts = {
  3: "classroom reading log",
  4: "local history article",
  5: "school newspaper feature",
  6: "environmental debate",
  7: "technology article",
  8: "historical fiction excerpt",
  9: "civic argument essay",
  10: "literary analysis passage"
};

function elaQuestion(grade, index) {
  const band = grade <= 5 ? "lower" : grade <= 8 ? "middle" : "high";
  const [passage, prompt, correct, distractors] = elaBanks[band][(index - 1) % 10];
  return makeQuestion(
    `E${grade}Q${index}`,
    grade,
    "ela",
    `Read this Grade ${grade} ${elaContexts[grade]} excerpt: "${passage}" ${prompt}`,
    correct,
    distractors
  );
}

const scienceBanks = {
  lower: [
    ["A student places the same kind of plant in sunlight and in a dark cabinet. What variable is being tested?", "Amount of light", ["Type of plant", "Size of pot", "Kind of soil"]],
    ["Which property is best for sorting rocks into groups?", "Texture", ["Favorite color", "Name of collector", "Day found"]],
    ["What happens to water vapor when it cools into liquid droplets?", "Condensation", ["Erosion", "Melting", "Pollination"]],
    ["Which structure helps a plant absorb water from soil?", "Roots", ["Flower petals", "Stem color", "Fruit seeds"]],
    ["A shadow is longest in the early morning and late afternoon. What causes this change?", "The Sun appears at different positions in the sky.", ["The object changes height.", "The ground becomes softer.", "The air stops moving."]],
    ["Which example shows energy causing motion?", "Wind turning a pinwheel", ["A rock resting on a desk", "A book sitting closed", "A cup on a shelf"]],
    ["Why do young animals often resemble their parents?", "Traits are inherited.", ["They eat the same lunch.", "They live near water.", "They sleep at night."]],
    ["Which tool measures temperature?", "Thermometer", ["Ruler", "Balance", "Compass"]],
    ["A river carries small pieces of rock downstream. Which process is this?", "Erosion", ["Freezing", "Germination", "Reflection"]],
    ["Which material would most likely be attracted to a magnet?", "Iron nail", ["Wood chip", "Plastic spoon", "Glass marble"]]
  ],
  middle: [
    ["A substance keeps the same mass before and after a chemical reaction in a closed container. Which principle explains this?", "Conservation of matter", ["Natural selection", "Plate tectonics", "Thermal expansion"]],
    ["Why do seasons occur on Earth?", "Earth's axis is tilted as it orbits the Sun.", ["Earth moves closer to the Sun every summer.", "The Moon blocks sunlight monthly.", "Oceans change Earth's orbit."]],
    ["A population has more individuals with thick fur after many cold winters. Which process is most likely involved?", "Natural selection", ["Condensation", "Static electricity", "Deposition"]],
    ["Which model best represents particles in a gas?", "Particles far apart and moving freely", ["Particles fixed in place", "Particles packed in a crystal only", "Particles with no motion"]],
    ["What happens when an unbalanced force acts on an object?", "The object's motion changes.", ["The object's mass becomes zero.", "Gravity stops acting.", "The object must disappear."]],
    ["Which evidence supports the idea that continents have moved?", "Matching fossils found on continents now far apart", ["Daily weather reports", "Different time zones", "Ocean tides only"]],
    ["What is the role of decomposers in an ecosystem?", "They break down dead matter and recycle nutrients.", ["They make sunlight.", "They stop all competition.", "They produce rocks."]],
    ["A circuit does not light a bulb because there is a gap in the wire. What kind of circuit is it?", "Open circuit", ["Closed circuit", "Parallel circuit only", "Magnetic circuit"]],
    ["Which statement best describes kinetic energy?", "Energy of motion", ["Stored chemical energy", "Energy from position only", "Energy that cannot change"]],
    ["Why is a controlled experiment useful?", "It tests one variable while keeping others the same.", ["It changes every variable at once.", "It avoids collecting data.", "It guarantees the expected result."]]
  ],
  high: [
    ["In photosynthesis, which substances are reactants?", "Carbon dioxide and water", ["Oxygen and glucose", "Nitrogen and salt", "Protein and starch"]],
    ["A ball accelerates downward near Earth's surface. Which force is mainly responsible?", "Gravity", ["Friction only", "Magnetism only", "Buoyancy only"]],
    ["Which statement describes DNA?", "It stores genetic instructions in cells.", ["It is the same as sunlight.", "It is a type of rock layer.", "It measures air pressure."]],
    ["A reaction releases heat to its surroundings. How is it classified?", "Exothermic", ["Endothermic", "Neutral", "Mechanical only"]],
    ["Why can two species occupying the same niche compete?", "They need the same limited resources.", ["They have identical DNA.", "They cannot reproduce.", "They live in different ecosystems only."]],
    ["Which evidence supports common ancestry?", "Similar DNA sequences among related organisms", ["Different weather patterns", "Identical birthdays", "A shared habitat only"]],
    ["What happens to wavelength when wave frequency increases and wave speed stays constant?", "Wavelength decreases.", ["Wavelength increases.", "Wavelength becomes zero.", "Wavelength is unrelated."]],
    ["Which process forms igneous rock?", "Cooling and solidification of magma or lava", ["Compaction of dead plants only", "Evaporation of seawater", "Photosynthesis in soil"]],
    ["A scientist repeats trials and reports uncertainty. Why is this important?", "It improves reliability of the results.", ["It prevents other scientists from checking work.", "It replaces the need for data.", "It makes all hypotheses true."]],
    ["Which pH value represents the strongest acid among the choices?", "2", ["7", "9", "12"]]
  ]
};

const scienceContexts = {
  3: "weather and habitats unit",
  4: "energy and Earth systems unit",
  5: "matter, ecosystems, and space systems unit",
  6: "cells, forces, and Earth materials unit",
  7: "ecosystems, genetics, and chemistry unit",
  8: "physical science and Earth history unit",
  9: "biology and environmental systems unit",
  10: "chemistry, physics, and Earth systems unit"
};

function scienceQuestion(grade, index) {
  const band = grade <= 5 ? "lower" : grade <= 8 ? "middle" : "high";
  const [prompt, correct, distractors] = scienceBanks[band][(index - 1) % 10];
  return makeQuestion(
    `S${grade}Q${index}`,
    grade,
    "science",
    `In a Grade ${grade} ${scienceContexts[grade]}, ${prompt[0].toLowerCase()}${prompt.slice(1)}`,
    correct,
    distractors
  );
}

const generators = {
  math: mathQuestion,
  ela: elaQuestion,
  science: scienceQuestion
};

const questions = [];
const questionsByGrade = new Map();

for (const grade of grades) {
  const gradeQuestions = [];

  for (const subject of subjects) {
    for (let index = 1; index <= 30; index += 1) {
      const question = generators[subject](grade, index);
      questions.push(question);
      gradeQuestions.push(question);
    }
  }

  questionsByGrade.set(grade, gradeQuestions);
}

await mkdir(dataDir, { recursive: true });
await Promise.all(
  [...questionsByGrade.entries()].map(([grade, gradeQuestions]) =>
    writeFile(path.join(dataDir, `grade-${grade}.json`), `${JSON.stringify(gradeQuestions, null, 2)}\n`)
  )
);

console.log(`Generated ${questions.length} questions across ${questionsByGrade.size} grade files.`);

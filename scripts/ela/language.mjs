const LANG = "Language";
const VOCAB = "Vocabulary Acquisition and Use";

const mc = (grades, standard, skill, q, a, d, expl, domain = LANG) => ({ grades, type: "mc", standard, skill, q, a, d, expl, domain });
const ms = (grades, standard, skill, q, correct, wrong, expl, domain = LANG) => ({ grades, type: "ms", standard, skill, q, correct, wrong, expl, domain });

const CONVENTIONS = [
  mc([3, 4], "L.{g}.1", "Ensure subject-verb agreement.", "Which word correctly completes the sentence?\n\nThe puppies ___ in the backyard every afternoon.", "play", ["plays", "playing", "has played"], "“Puppies” is plural, so it needs the plural verb “play.”"),
  mc([3, 4], "L.{g}.1", "Form and use regular and irregular verbs.", "Which word correctly completes the sentence?\n\nYesterday, Mia ___ a thank-you note to her grandmother.", "wrote", ["writed", "writes", "written"], "“Write” is irregular; its simple past tense is “wrote.”"),
  mc([3, 4], "L.{g}.1", "Form and use comparative and superlative adjectives.", "Which word correctly completes the sentence?\n\nOf all five puppies, the brown one is the ___.", "smallest", ["smaller", "most small", "more smaller"], "When comparing more than two things, use the superlative “smallest.”"),
  mc([3, 4], "L.{g}.1", "Form and use irregular plural nouns.", "Which sentence uses the correct plural noun?", "Three geese waddled across the road.", ["Three gooses waddled across the road.", "Three geeses waddled across the road.", "Three goose waddled across the road."], "The plural of “goose” is the irregular noun “geese.”"),
  mc([3, 4], "L.{g}.2", "Use commas in addresses.", "Which shows the address written correctly?", "Trenton, New Jersey 08608", ["Trenton New Jersey, 08608", "Trenton, New, Jersey 08608", "Trenton New, Jersey 08608"], "Put a comma between the city and the state."),
  mc([3, 4], "L.{g}.2", "Use commas and quotation marks in dialogue.", "Which sentence is punctuated correctly?", "“Let's go to the library,” said Maya.", ["“Let's go to the library” said Maya.", "Let's go to the library, “said Maya.”", "“Let's go to the library, said Maya.”"], "The comma goes inside the closing quotation mark, and only the spoken words are inside the quotation marks."),
  mc([3, 4], "L.{g}.2", "Form and use possessives.", "Which sentence uses the possessive correctly?", "The two dogs' leashes were tangled.", ["The two dog's leashes were tangled.", "The two dogs leashes' were tangled.", "The two dogses leashes were tangled."], "For a plural noun ending in s, add an apostrophe after the s: dogs'."),
  mc([3, 4], "L.{g}.2", "Capitalize appropriate words in titles and names.", "Which sentence uses capital letters correctly?", "Last July, we visited Liberty State Park in Jersey City.", ["Last july, we visited Liberty State Park in Jersey City.", "Last July, we visited liberty state park in Jersey City.", "Last July, We visited Liberty State Park in jersey city."], "Months, names of places, and cities are proper nouns."),
  mc([4], "L.{g}.1", "Use relative pronouns.", "Which word correctly completes the sentence?\n\nThe girl ___ won the science fair is in my class.", "who", ["which", "whom", "what"], "Use “who” as the subject of a clause that describes a person."),
  mc([4], "L.{g}.1", "Form and use the progressive verb tenses.", "Which sentence uses the past progressive tense?", "We were waiting for the bus when it started to rain.", ["We wait for the bus every day.", "We will wait for the bus tomorrow.", "We waited for the bus."], "The past progressive uses was/were + a verb ending in -ing."),
  mc([4], "L.{g}.1", "Correctly use frequently confused words.", "Which word correctly completes the sentence?\n\nThe students left ___ backpacks in the hallway.", "their", ["there", "they're", "thier"], "“Their” shows ownership."),
  mc([4], "L.{g}.1", "Produce complete sentences, recognizing fragments and run-ons.", "Which is a complete sentence?", "The class planted tulips near the fence.", ["Planting tulips near the fence.", "Because the class planted tulips.", "The class planted tulips they bloomed in spring."], "A complete sentence has a subject and a predicate and expresses a complete thought."),
  mc([4], "L.{g}.1", "Order adjectives within sentences according to conventional patterns.", "Which sentence orders the adjectives correctly?", "She wore a beautiful long red scarf.", ["She wore a red long beautiful scarf.", "She wore a long red beautiful scarf.", "She wore a red beautiful long scarf."], "Opinion adjectives come before size, and size comes before color."),
  mc([3], "L.{g}.1", "Use coordinating and subordinating conjunctions.", "Which word best completes the sentence?\n\nI wanted to play outside, ___ it was raining.", "but", ["and", "so", "or"], "“But” shows contrast between wanting to play and the rain."),
  mc([5, 6], "L.{g}.1", "Form and use the perfect verb tenses.", "Which words correctly complete the sentence?\n\nBy the time we arrived at the theater, the movie ___ .", "had already started", ["has already started", "already starts", "will have started"], "The past perfect (had + past participle) shows an action finished before another past action."),
  mc([5, 6], "L.{g}.1", "Use correlative conjunctions.", "Which sentence uses correlative conjunctions correctly?", "Neither the coach nor the players wanted to cancel the game.", ["Neither the coach or the players wanted to cancel the game.", "Either the coach nor the players wanted to cancel the game.", "Both the coach or the players wanted to cancel the game."], "“Neither” pairs with “nor.”"),
  mc([5, 6], "L.{g}.2", "Use a comma to separate an introductory element.", "Which sentence is punctuated correctly?", "After the long hike, we rested by the lake.", ["After the long hike we, rested by the lake.", "After, the long hike we rested by the lake.", "After the long, hike we rested by the lake."], "Use a comma after an introductory phrase."),
  mc([5], "L.{g}.2", "Use underlining, quotation marks, or italics to indicate titles of works.", "Which sentence shows the titles written correctly?", "We read the poem “The Road Not Taken” in the book Classic Poems.", ["We read the poem The Road Not Taken in the book “Classic Poems.”", "We read the poem “The Road Not Taken” in the book “Classic Poems.”", "We read the poem The Road Not Taken in the book Classic Poems."], "Short works like poems go in quotation marks; long works like books are italicized or underlined."),
  mc([5], "L.{g}.1", "Recognize and correct inappropriate shifts in verb tense.", "Which sentence has a correct, consistent verb tense?", "Leo opened the door and walked into the kitchen.", ["Leo opens the door and walked into the kitchen.", "Leo opened the door and walks into the kitchen.", "Leo will open the door and walked into the kitchen."], "Both verbs should be in the past tense."),
  mc([5, 6], "L.{g}.1", "Use interjections and a comma to set off yes and no.", "Which sentence is punctuated correctly?", "Yes, I finished my science project.", ["Yes I, finished my science project.", "Yes I finished, my science project.", "Yes I finished my science project,"], "Use a comma after “yes” or “no” at the start of a sentence."),
  mc([6], "L.{g}.1", "Ensure that pronouns are in the proper case.", "Which word correctly completes the sentence?\n\nGrandma gave the concert tickets to my brother and ___.", "me", ["I", "myself", "mine"], "The pronoun is an object of the preposition “to,” so use the objective case “me.”"),
  mc([6], "L.{g}.1", "Use intensive pronouns.", "Which sentence uses an intensive pronoun?", "The students themselves organized the food drive.", ["The students organized the food drive for them.", "They organized the food drive.", "The food drive was theirs."], "An intensive pronoun (themselves) emphasizes the noun before it."),
  mc([6], "L.{g}.1", "Recognize and correct vague pronouns.", "Which sentence avoids a vague pronoun?", "When Ana called Rosa, Rosa was eating dinner.", ["When Ana called Rosa, she was eating dinner.", "When she called her, she was eating dinner.", "When Ana called her, she was eating dinner."], "Naming Rosa makes it clear who was eating dinner."),
  mc([6], "L.{g}.2", "Use punctuation to set off nonrestrictive elements.", "Which sentence is punctuated correctly?", "My uncle, who lives in Newark, is a firefighter.", ["My uncle who lives in Newark, is a firefighter.", "My uncle, who lives in Newark is a firefighter.", "My uncle who, lives in Newark, is a firefighter."], "Nonessential information is set off by commas on both sides."),
  mc([6], "L.{g}.1", "Recognize and correct inappropriate shifts in pronoun number and person.", "Which sentence is written correctly?", "If students want to join the club, they should sign up by Friday.", ["If a student wants to join the club, you should sign up by Friday.", "If students want to join the club, he should sign up by Friday.", "If a student wants to join the club, we should sign up by Friday."], "“Students” and “they” agree in number and person."),
  mc([7, 8], "L.{g}.1", "Explain the function of phrases and clauses.", "In the sentence below, which group of words is a dependent clause?\n\nBecause the bus was late, Marcus missed the first bell.", "Because the bus was late", ["Marcus missed the first bell", "the first bell", "missed the first"], "A dependent clause has a subject and verb but cannot stand alone."),
  mc([7], "L.{g}.1", "Choose among simple, compound, complex, and compound-complex sentences.", "Which is a complex sentence?", "Although the forecast called for snow, the game continued.", ["The forecast called for snow, and the game continued.", "The forecast called for snow.", "The game continued in the snow and the cold."], "A complex sentence has one independent clause and at least one dependent clause."),
  mc([7], "L.{g}.1", "Recognize and correct misplaced and dangling modifiers.", "Which sentence is written correctly?", "Walking to school, I saw a rainbow over the park.", ["Walking to school, a rainbow appeared over the park.", "I saw a rainbow walking to school over the park.", "Over the park walking to school a rainbow I saw."], "The modifier “Walking to school” must describe the person who was walking."),
  mc([7], "L.{g}.2", "Use a comma to separate coordinate adjectives.", "Which sentence is punctuated correctly?", "It was a long, exhausting day.", ["It was a long exhausting, day.", "It was a, long exhausting day.", "It was, a long exhausting day."], "Coordinate adjectives that equally describe a noun are separated by a comma."),
  mc([7, 8], "L.{g}.3", "Choose language that expresses ideas precisely and concisely.", "Which sentence is the most concise?", "The committee decided to postpone the meeting.", ["The committee made a decision that they would postpone the meeting until a later time.", "The committee, after deciding, decided to postpone the meeting for later.", "The committee decided that the meeting would be postponed to a time that was later."], "The first sentence expresses the idea without repetition or extra words."),
  mc([8], "L.{g}.1", "Explain the function of verbals (gerunds, participles, infinitives).", "In the sentence below, what is the function of the word swimming?\n\nSwimming is my favorite way to exercise.", "It is a gerund acting as a noun.", ["It is a participle acting as an adjective.", "It is an infinitive acting as a verb.", "It is an adverb describing exercise."], "A gerund is a verb form ending in -ing that functions as a noun (here, the subject)."),
  mc([8], "L.{g}.1", "Form and use verbs in the active and passive voice.", "Which sentence is written in the active voice?", "The eighth graders painted the mural.", ["The mural was painted by the eighth graders.", "The mural is being painted.", "The mural had been painted by students."], "In the active voice, the subject performs the action."),
  mc([8], "L.{g}.1", "Form and use verbs in the conditional and subjunctive mood.", "Which word correctly completes the sentence?\n\nIf I ___ the principal, I would add more time for recess.", "were", ["was", "am", "be"], "The subjunctive mood uses “were” for hypothetical situations."),
  mc([8], "L.{g}.2", "Use an ellipsis to indicate an omission.", "Which sentence correctly uses an ellipsis to show that words were left out of a quotation?", "The speech said, “We will build a stronger … community.”", ["The speech said, “We will build … a stronger community …”…", "The speech said … “We will build a stronger community.”", "The speech said, “We will build a stronger community” …"], "An ellipsis inside the quotation marks shows where words were omitted."),
  mc([8], "L.{g}.2", "Use a comma, ellipsis, or dash to indicate a pause or break.", "Which sentence uses a dash correctly?", "We packed everything we needed—tents, food, and flashlights.", ["We packed—everything we needed tents, food, and flashlights.", "We packed everything we—needed tents, food, and flashlights.", "We—packed everything we needed, tents, food, and flashlights."], "A dash can introduce a list that explains what came before it.")
];

const FIGURATIVE = [
  mc([3, 4, 5], "L.{g}.5", "Interpret similes and metaphors in context.", "What does the simile mean?\n\nAfter recess, the classroom was as quiet as a library.", "The classroom was very quiet.", ["The classroom was full of books.", "The classroom was very loud.", "The students were reading."], "A simile compares two things using “like” or “as.”", VOCAB),
  mc([3, 4, 5, 6], "L.{g}.5", "Explain the meaning of common idioms.", "What does the idiom mean?\n\nDad said the new video game cost an arm and a leg.", "The game was very expensive.", ["The game was about a robot.", "The game was easy to play.", "Dad hurt himself playing the game."], "“Cost an arm and a leg” means something is very expensive.", VOCAB),
  mc([4, 5, 6], "L.{g}.5", "Explain the meaning of common idioms.", "What does the idiom mean?\n\nLena was feeling under the weather, so she stayed home.", "She was feeling sick.", ["She was standing in the rain.", "She was excited about a storm.", "She was hiding under a blanket."], "“Under the weather” means feeling ill.", VOCAB),
  mc([4, 5, 6, 7], "L.{g}.5", "Interpret figurative language, including personification.", "Which sentence uses personification?", "The wind whispered through the tall grass.", ["The wind was cold and strong.", "The grass was as tall as a fence.", "The tall grass swayed in the wind."], "Personification gives human qualities (whispering) to something that is not human.", VOCAB),
  mc([5, 6, 7], "L.{g}.5", "Interpret figurative language, including hyperbole.", "Which sentence is an example of hyperbole?", "I have told you a million times to clean your room.", ["I have told you twice to clean your room.", "Your room is like a jungle.", "Please clean your room today."], "Hyperbole is an extreme exaggeration.", VOCAB),
  mc([6, 7, 8], "L.{g}.5", "Distinguish among the connotations of words with similar denotations.", "Which word has the most positive connotation to describe someone who saves money carefully?", "thrifty", ["stingy", "cheap", "tight-fisted"], "“Thrifty” suggests wise saving; the other words suggest an unwillingness to share.", VOCAB),
  mc([7, 8], "L.{g}.5", "Interpret figures of speech (e.g., verbal irony, puns) in context.", "Which sentence is an example of verbal irony?", "Stepping into the freezing rain, Jaden said, “What lovely weather for a picnic.”", ["Jaden said the rain was cold.", "The rain fell like tiny needles.", "Jaden ran inside to escape the rain."], "Verbal irony is saying the opposite of what you mean.", VOCAB),
  mc([7, 8], "L.{g}.5", "Interpret allusions in context.", "What does the allusion mean?\n\nWhen it came to puzzles, my little sister was a real Sherlock Holmes.", "She was very good at solving problems.", ["She liked to read mystery books.", "She lived in London.", "She often lost her puzzles."], "Sherlock Holmes is a famous fictional detective known for solving mysteries.", VOCAB),
  mc([3, 4], "L.{g}.5", "Distinguish shades of meaning among related words.", "Which word shows the greatest amount of happiness?", "overjoyed", ["pleased", "content", "glad"], "“Overjoyed” describes the strongest feeling of happiness.", VOCAB),
  mc([5, 6], "L.{g}.5", "Use the relationship between words (synonyms, antonyms) to understand each.", "Which word is an antonym of generous?", "selfish", ["kind", "giving", "helpful"], "An antonym has the opposite meaning; generous means willing to give.", VOCAB)
];

const CONTEXT_CLUES = [
  [[3, 4], "The trail was so steep that we had to stop and rest many times on the way up.", "steep", "rising sharply", ["flat and smooth", "wet and muddy", "long and curvy"]],
  [[3, 4], "Maya was reluctant to jump into the cold lake, so she stood on the dock for a long time.", "reluctant", "not wanting to do something", ["excited", "able to swim fast", "happy and calm"]],
  [[3, 4], "The kitten was timid and hid under the bed whenever visitors came over.", "timid", "shy or easily frightened", ["very playful", "hungry", "loud"]],
  [[4, 5], "The scientist made a hypothesis, or educated guess, about why the plants grew faster.", "hypothesis", "an educated guess", ["a final answer", "a type of plant", "a science tool"]],
  [[4, 5], "The flood caused extensive damage; nearly every street in town needed repairs.", "extensive", "large in amount or area", ["small and minor", "quick", "unexpected"]],
  [[5, 6], "Unlike his gregarious sister, who loved parties, Sam preferred to spend time alone.", "gregarious", "enjoying the company of others", ["quiet and shy", "angry", "tired"]],
  [[5, 6], "The instructions were ambiguous, so half the class built the model one way and half built it another.", "ambiguous", "unclear; open to more than one meaning", ["very detailed", "written in another language", "too short"]],
  [[6, 7], "The coach was adamant that practice would continue, refusing to change her mind even when it rained.", "adamant", "refusing to change one's mind", ["unsure", "cheerful", "worried"]],
  [[6, 7], "The scarcity of water during the drought forced farmers to limit how much they used.", "scarcity", "a shortage", ["a flood", "a cleaning", "a high price"]],
  [[7, 8], "His explanation was so convoluted that no one could follow the steps.", "convoluted", "extremely complicated", ["clear and simple", "very short", "funny"]],
  [[7, 8], "The mayor's speech was meant to placate the angry crowd, and soon people began to calm down.", "placate", "to make less angry", ["to excite", "to confuse", "to ignore"]],
  [[7, 8], "Despite the setbacks, the team remained tenacious, practicing every day until they won.", "tenacious", "persistent; not giving up", ["careless", "lazy", "confused"]],
  [[3, 4], "The giant pumpkin was enormous; it took four people to lift it onto the truck.", "enormous", "very large", ["very light", "very old", "very small"]],
  [[5, 6], "The artist used vivid colors, like bright orange and electric blue, in her mural.", "vivid", "bright and strong", ["dull and faded", "dark", "invisible"]],
  [[8], "The witness gave a candid account, honestly describing even the parts that embarrassed him.", "candid", "honest and direct", ["secretive", "long and boring", "made up"]]
];

const AFFIXES = [
  [[3, 4], "un-", "not", "unhappy", "not happy", ["very happy", "happy again", "happy before"]],
  [[3, 4], "re-", "again", "rebuild", "build again", ["build before", "not build", "build badly"]],
  [[3, 4], "pre-", "before", "preheat", "heat before", ["heat again", "not heat", "heat too much"]],
  [[3, 4], "dis-", "not; opposite of", "disagree", "not agree", ["agree again", "agree before", "agree strongly"]],
  [[3, 4], "mis-", "wrongly", "misspell", "spell wrongly", ["spell again", "spell before", "spell quickly"]],
  [[3, 4], "-less", "without", "fearless", "without fear", ["full of fear", "fear again", "afraid before"]],
  [[3, 4], "-ful", "full of", "careful", "full of care", ["without care", "care again", "not caring"]],
  [[3, 4], "-able", "able to be", "washable", "able to be washed", ["washed again", "not washed", "full of water"]],
  [[3, 4], "-er", "one who", "teacher", "one who teaches", ["teaching again", "not teaching", "taught before"]],
  [[4, 5], "over-", "too much", "overcook", "cook too much", ["cook again", "cook before", "not cook"]],
  [[4, 5], "non-", "not", "nonfiction", "writing that is not made up", ["writing that is made up", "writing done again", "very old writing"]],
  [[4, 5], "-ness", "state of being", "kindness", "the state of being kind", ["without kindness", "one who is kind", "kind again"]],
  [[4, 5], "im-", "not", "impossible", "not possible", ["possible again", "very possible", "possible before"]],
  [[5, 6], "inter-", "between", "international", "between nations", ["inside one nation", "against a nation", "before a nation"]],
  [[5, 6], "trans-", "across", "transatlantic", "across the Atlantic", ["under the Atlantic", "near the Atlantic", "before the Atlantic"]],
  [[6, 7], "anti-", "against", "antibacterial", "working against bacteria", ["full of bacteria", "made of bacteria", "before bacteria"]],
  [[6, 7], "-ology", "study of", "geology", "the study of the earth", ["a map of the earth", "fear of the earth", "the center of the earth"]],
  [[7, 8], "mal-", "bad; badly", "malfunction", "to work badly", ["to work again", "to work quickly", "to stop working forever"]],
  [[7, 8], "circum-", "around", "circumnavigate", "to sail around", ["to sail under", "to sail away", "to sail slowly"]],
  [[7, 8], "bene-", "good; well", "benefit", "something good or helpful", ["something harmful", "something old", "something heavy"]]
];

const ROOTS = [
  [[4, 5, 6], "graph", "write", "autograph", "a person's own signature", ["a picture of a car", "a type of map", "a loud sound"]],
  [[4, 5, 6], "tele", "far", "telescope", "a tool for seeing things far away", ["a tool for hearing", "a tool for writing", "a tool for measuring heat"]],
  [[5, 6, 7], "port", "carry", "portable", "able to be carried", ["able to be eaten", "very large", "made of metal"]],
  [[5, 6, 7], "aud", "hear", "audible", "able to be heard", ["able to be seen", "easy to touch", "hard to understand"]],
  [[5, 6, 7], "spect", "look", "spectator", "a person who watches an event", ["a person who plays in an event", "a person who cooks", "a person who repairs things"]],
  [[5, 6, 7], "bio", "life", "biology", "the study of living things", ["the study of rocks", "the study of numbers", "the study of stars"]],
  [[6, 7, 8], "chron", "time", "chronological", "arranged in time order", ["arranged by size", "arranged by color", "arranged at random"]],
  [[6, 7, 8], "dict", "say; speak", "predict", "to say what will happen before it happens", ["to remember the past", "to write a letter", "to repeat a word"]],
  [[6, 7, 8], "struct", "build", "construct", "to build", ["to destroy", "to draw", "to measure"]],
  [[6, 7, 8], "photo", "light", "photosynthesis", "the process plants use to make food from light", ["the process of taking pictures", "the process of making water", "the process of breathing"]],
  [[7, 8], "micro", "small", "microscopic", "too small to see without a microscope", ["very loud", "very bright", "large enough to hold"]],
  [[7, 8], "rupt", "break", "disrupt", "to break apart or interrupt", ["to build up", "to repeat", "to agree with"]],
  [[7, 8], "vers/vert", "turn", "reverse", "to turn back or go the opposite way", ["to go faster", "to stay still", "to look closely"]],
  [[8], "phil", "love", "philanthropist", "a person who loves and helps others, often by donating", ["a person who studies plants", "a person who writes poems", "a person who fears crowds"]],
  [[8], "cred", "believe", "credible", "able to be believed", ["easy to break", "full of color", "difficult to hear"]]
];

export function languageItemsFor(grade) {
  const items = [...CONVENTIONS, ...FIGURATIVE].filter((item) => item.grades.includes(grade));

  for (const [grades, sentence, word, answer, wrong] of CONTEXT_CLUES) {
    if (!grades.includes(grade)) continue;
    items.push(mc(grades, "L.{g}.4", "Use context clues to determine the meaning of an unknown word.", `Read the sentence.\n\n${sentence}\n\nWhat does the word ${word} mean?`, answer, wrong, `Clues in the sentence show that “${word}” means “${answer}.”`, VOCAB));
  }

  for (const [grades, affix, meaning, word, answer, wrong] of AFFIXES) {
    if (!grades.includes(grade)) continue;
    items.push(mc(grades, "L.{g}.4", "Use common affixes as clues to the meaning of a word.", `The affix ${affix} means “${meaning}.” What does the word ${word} mean?`, answer, wrong, `${affix} means “${meaning},” so ${word} means “${answer}.”`, VOCAB));
  }

  for (const [grades, root, meaning, word, answer, wrong] of ROOTS) {
    if (!grades.includes(grade)) continue;
    items.push(mc(grades, "L.{g}.4", "Use Greek or Latin roots as clues to the meaning of a word.", `The root ${root} means “${meaning}.” What does the word ${word} most likely mean?`, answer, wrong, `The root ${root} (“${meaning}”) helps show that ${word} means “${answer}.”`, VOCAB));
  }

  return items;
}

export { ms };

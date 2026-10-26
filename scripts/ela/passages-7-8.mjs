export const passages78 = [
  {
    id: "P78-SIGNAL",
    title: "Signal Lost",
    genre: "literary",
    text: `The hiking trip had been Dad's idea, and for the first hour, Kenji made sure everyone knew he hated it. He held his phone above his head at every switchback, hunting for a signal that never came.

“It's called disconnecting,” Dad said cheerfully.

“It's called being cut off from civilization,” Kenji muttered.

By noon they reached a ridge where the trail split. The wooden sign had rotted, its arrows pointing at nothing. Dad pulled out a paper map and frowned. A gray wall of clouds was rolling over the far peaks.

“Which way?” Kenji asked, and for the first time his voice carried no sarcasm.

Dad turned the map one way, then another. Kenji leaned in. Without thinking, he traced the contour lines with his finger, the way his science teacher had shown them during the unit on topography. “These lines are close together here,” he said. “That's a cliff. The left trail goes down gradually. That has to be the way back to the lot.”

Dad looked at him for a long moment. “When did you learn that?”

“Eighth grade,” Kenji said. “Apparently I was listening.”

They reached the car just as the first heavy drops began to fall. Inside, rain drummed on the roof, and Kenji's phone buzzed back to life with a dozen notifications. He glanced at the screen, then turned it face down on the seat.

“So,” he said, “where are we going next month?”`,
    items: [
      { type: "mc", standard: "RL.{g}.2", skill: "Determine a theme and analyze its development over the course of a text.", q: "Which theme is best developed in the story?", a: "Stepping away from familiar comforts can reveal unexpected strengths.", d: ["Technology is always harmful to families.", "Maps are more reliable than phones in every situation.", "Parents should not plan trips their children dislike."], expl: "Without his phone, Kenji uses his own knowledge to guide them, and his attitude changes." },
      { type: "ebsr", standard: "RL.{g}.3", skill: "Analyze how particular elements of a story interact (how setting shapes character).",
        a: { q: "Part A: How does the setting at the ridge contribute to a change in Kenji?", a: "The approaching storm and broken sign create a real problem that pushes him to take part.", d: ["The beautiful view makes him forget about his phone.", "The ridge has cell service, so he can look up directions.", "The rotted sign makes him angry at his father."] },
        b: { q: "Part B: Which sentence best shows the change described in Part A?", correct: ["“Which way?” Kenji asked, and for the first time his voice carried no sarcasm."], wrong: ["He held his phone above his head at every switchback.", "“It's called disconnecting,” Dad said cheerfully.", "They reached the car just as the first heavy drops began to fall."] },
        expl: "Facing the split trail and coming storm, Kenji drops the sarcasm and engages." },
      { type: "mc", standard: "RL.{g}.4", skill: "Analyze the impact of word choice on meaning and tone.", q: "How does Kenji's line “Apparently I was listening” affect the tone of the scene?", a: "It adds light humor while showing he is surprised by his own knowledge.", d: ["It makes the scene threatening and tense.", "It shows that Kenji is angry at his teacher.", "It suggests that Kenji is lying to his father."], expl: "The dry remark is playful and self-aware." },
      { type: "ms", standard: "RL.{g}.1", skill: "Cite several pieces of textual evidence that most strongly support an inference.", q: "Select two details that suggest Kenji's attitude toward the trip has changed by the end.", correct: ["He glanced at the screen, then turned it face down on the seat.", "“So,” he said, “where are we going next month?”"], wrong: ["He held his phone above his head at every switchback.", "“It's called being cut off from civilization,” Kenji muttered.", "Dad pulled out a paper map and frowned."], expl: "Ignoring his phone and asking about the next trip show a new attitude." },
      { type: "mc", standard: "RL.{g}.6", skill: "Analyze how differences in characters' points of view create effects such as humor or suspense.", q: "How do the contrasting views of Dad and Kenji in paragraphs 2–3 affect the story?", a: "They establish a conflict about the trip that is resolved by the end.", d: ["They show that Dad and Kenji agree about technology.", "They create suspense about the storm.", "They reveal that Dad is lost from the start."], expl: "“Disconnecting” versus “cut off from civilization” sets up the attitude that later shifts." },
      { type: "mc", standard: "RL.{g}.5", skill: "Analyze how a text's structure contributes to its meaning.", q: "Why does the author end the story with Kenji's question?", a: "to show his transformation through his own words rather than stating it directly", d: ["to set up a sequel about a new trip", "to show that Kenji is still bored", "to explain the science of topography"], expl: "The question reveals that Kenji now wants to go hiking again." }
    ]
  },
  {
    id: "P78-SCHOOLSTART",
    title: "Should Middle Schools Start Later?",
    genre: "informational",
    text: `Across the country, many middle schools begin classes before 8:00 a.m. Some districts have moved their start times later, arguing that students learn better when they are well-rested. Others say later start times create more problems than they solve.

Supporters of later start times point to biology. During adolescence, the body's internal clock shifts so that teenagers naturally feel sleepy later at night. The American Academy of Pediatrics recommends that middle and high schools start no earlier than 8:30 a.m. In districts that have shifted later, researchers have reported improvements in attendance and fewer students falling asleep in class.

Opponents raise practical concerns. Changing bell schedules can affect bus routes, since many districts use the same buses for elementary, middle, and high school students. Later dismissal times may cut into after-school sports, jobs, and family responsibilities such as caring for younger siblings. Some parents also worry that students will simply stay up later, erasing any benefit.

Some districts have found compromises. A few have reorganized bus routes so that younger students, who tend to wake up early, start first. Others have paired later start times with education programs that teach families about healthy sleep habits.

The debate shows that a seemingly simple question—what time should school start?—involves health, transportation, and family life. Any solution will require communities to weigh the evidence and the trade-offs carefully.`,
    items: [
      { type: "mc", standard: "RI.{g}.2", skill: "Determine a central idea and analyze its development.", q: "What is the central idea of the passage?", a: "The question of later school start times involves both benefits and practical challenges that communities must weigh.", d: ["All middle schools should start at 8:30 a.m.", "Later start times always reduce student attendance.", "Bus routes are the only reason schools start early."], expl: "The article presents both sides and concludes that the decision involves trade-offs." },
      { type: "ebsr", standard: "RI.{g}.8", skill: "Trace and evaluate an argument, assessing whether evidence is relevant and sufficient.",
        a: { q: "Part A: Which piece of evidence most directly supports the argument for later start times?", a: "The recommendation from the American Academy of Pediatrics", d: ["The fact that buses serve several schools", "The concern that students will stay up later", "The responsibility of caring for younger siblings"] },
        b: { q: "Part B: Which two additional details also support the argument for later start times? Select two.", correct: ["During adolescence, the body's internal clock shifts so that teenagers naturally feel sleepy later at night.", "Researchers have reported improvements in attendance and fewer students falling asleep in class."], wrong: ["Changing bell schedules can affect bus routes.", "Later dismissal times may cut into after-school sports.", "Some parents also worry that students will simply stay up later."] },
        expl: "Biology and research results support the case for later start times; the other details are counterarguments." },
      { type: "mc", standard: "RI.{g}.6", skill: "Determine an author's point of view and how the author acknowledges conflicting viewpoints.", q: "How does the author present the issue?", a: "by explaining arguments on both sides without taking a strong position", d: ["by arguing only for earlier start times", "by telling a personal story about being tired", "by mocking people who disagree"], expl: "The author presents supporters, opponents, and compromises, then calls for careful weighing." },
      { type: "mc", standard: "RI.{g}.5", skill: "Analyze the structure an author uses to organize a text.", q: "How does paragraph 4 contribute to the structure of the article?", a: "It describes compromises that address concerns from both sides.", d: ["It introduces the debate for the first time.", "It provides a definition of adolescence.", "It summarizes the history of school buses."], expl: "Paragraph 4 explains how districts balanced the issues." },
      { type: "mc", standard: "RI.{g}.4", skill: "Determine the meaning of words and phrases, including connotative meanings.", q: "In the last paragraph, what does trade-offs mean?", a: "giving up one benefit in order to gain another", d: ["agreements to swap bus routes", "arguments that have no evidence", "rules that cannot be changed"], expl: "Each option has costs and benefits that must be balanced." },
      { type: "ms", standard: "RI.{g}.1", skill: "Cite textual evidence that most strongly supports an analysis.", q: "Select two concerns opponents raise about later start times.", correct: ["Bus routes may need to change.", "After-school activities and jobs may be affected."], wrong: ["Students will learn too much.", "Teachers prefer to start earlier.", "Pediatricians recommend early start times."], expl: "Paragraph 3 lists bus routes, after-school activities and responsibilities, and later bedtimes." }
    ]
  },
  {
    id: "P78-MAPMAKER",
    title: "The Mapmaker's Apprentice",
    genre: "literary",
    text: `In the port city of Verano, Master Ilse was known for maps so precise that sailors swore by them. When she agreed to take an apprentice, forty young people applied. She chose Tomas, a fisherman's son who could barely afford ink.

For months, Tomas did nothing but copy. He copied coastlines, rivers, and the curling script of place names until his wrist ached. He grew restless. Other apprentices in the city were already selling maps of their own.

“When will I make something new?” he finally asked.

Ilse set down her pen. “When you understand why each line is where it is.”

That spring, a captain came to the shop, furious. His ship had nearly run aground on a sandbar that wasn't on his map—a map Tomas recognized as one he had copied. Ilse examined it silently, then turned to Tomas. “You copied what was in front of you,” she said. “But the sea changes. Did you ask anyone where the sand had moved?”

Tomas's face burned. He had not.

The next morning, he borrowed his father's boat and spent a week sounding the harbor with a weighted rope, recording depths in a battered notebook. He talked to fishermen, who knew the shifting sandbars better than any chart.

When he returned, Ilse studied his notes for a long time. Then she slid a blank sheet of parchment across the table.

“Now,” she said, “make something new.”`,
    items: [
      { type: "mc", standard: "RL.{g}.2", skill: "Determine a theme and analyze its relationship to characters, setting, and plot.", q: "Which statement best expresses a theme of the story?", a: "True mastery requires understanding and checking information, not just copying it.", d: ["Apprentices should always disagree with their teachers.", "Fishermen make better mapmakers than sailors.", "It is better to work quickly than carefully."], expl: "Tomas only earns the chance to make something new after he gathers real information himself." },
      { type: "ebsr", standard: "RL.{g}.3", skill: "Analyze how a particular incident propels the action and reveals a character.",
        a: { q: "Part A: How does the captain's visit affect Tomas?", a: "It shows him the danger of copying without verifying, which motivates him to investigate.", d: ["It convinces him to quit his apprenticeship.", "It makes him angry at Master Ilse for blaming him.", "It proves that his copied map was perfect."] },
        b: { q: "Part B: Which sentence best supports the answer to Part A?", correct: ["The next morning, he borrowed his father's boat and spent a week sounding the harbor with a weighted rope."], wrong: ["He copied coastlines, rivers, and the curling script of place names until his wrist ached.", "She chose Tomas, a fisherman's son who could barely afford ink.", "Other apprentices in the city were already selling maps of their own."] },
        expl: "Right after the captain's complaint, Tomas goes out to gather real depth data." },
      { type: "mc", standard: "RL.{g}.4", skill: "Analyze the meaning and impact of specific word choices.", q: "What does the phrase “Tomas's face burned” reveal?", a: "He felt ashamed of his mistake.", d: ["He was sunburned from fishing.", "He was excited about the captain's visit.", "He was angry at the captain."], expl: "A burning face suggests embarrassment after realizing he never checked the map." },
      { type: "mc", standard: "RL.{g}.3", skill: "Analyze how dialogue reveals aspects of a character.", q: "What does Ilse's answer, “When you understand why each line is where it is,” reveal about her?", a: "She values deep understanding over speed.", d: ["She does not want Tomas to succeed.", "She is too busy to teach Tomas.", "She believes copying is the only skill a mapmaker needs."], expl: "She wants Tomas to understand the reasons behind the map before creating his own." },
      { type: "ms", standard: "RL.{g}.1", skill: "Cite textual evidence that most strongly supports an inference.", q: "Select two details that show Tomas becomes more thorough in his work.", correct: ["He spent a week sounding the harbor with a weighted rope, recording depths.", "He talked to fishermen, who knew the shifting sandbars better than any chart."], wrong: ["He grew restless.", "Tomas recognized the map as one he had copied.", "Forty young people applied."], expl: "Measuring depths and interviewing fishermen show careful research." },
      { type: "mc", standard: "RL.{g}.5", skill: "Analyze how structure contributes to meaning.", q: "How does the final line connect to an earlier part of the story?", a: "It answers Tomas's earlier question about when he will make something new.", d: ["It repeats the captain's complaint.", "It reveals the name of the port city.", "It explains how sandbars form."], expl: "Tomas asked “When will I make something new?” and Ilse finally says “Now, make something new.”" }
    ]
  },
  {
    id: "P78-WRIGHT",
    title: "Learning from Failure: The Wright Brothers",
    genre: "informational",
    text: `On December 17, 1903, Orville Wright lay on the lower wing of a fragile aircraft near Kitty Hawk, North Carolina. The engine sputtered, the plane lifted off the sand, and for twelve seconds it flew. The flight covered only about 120 feet—shorter than the wingspan of a modern jumbo jet—but it changed the world.

That moment is often described as a sudden triumph. In reality, it was the result of years of failure. Beginning in 1899, Wilbur and Orville Wright built and tested a series of kites and gliders. Their 1901 glider performed so poorly that Wilbur reportedly said that humans would not fly in their lifetime.

Instead of quitting, the brothers questioned their data. They suspected that the published measurements they had relied on were wrong. To test their ideas, they built a small wind tunnel in their bicycle shop and tested more than 200 wing shapes. The results showed that the old data had overestimated the lift of curved wings.

Using their own measurements, the brothers designed a new glider in 1902. It flew hundreds of times. They also solved the problem of control by developing “wing warping,” a system that twisted the wings to help the pilot balance and turn.

The Wright brothers did not succeed because they never failed. They succeeded because they treated each failure as information. Their story suggests that persistence, combined with careful testing, can turn even discouraging setbacks into breakthroughs.`,
    items: [
      { type: "mc", standard: "RI.{g}.2", skill: "Determine a central idea and analyze its development.", q: "What is the central idea of the passage?", a: "The Wright brothers' success came from learning from repeated failures through careful testing.", d: ["The first airplane flight lasted only twelve seconds.", "Kitty Hawk is the best place in the world to fly.", "The Wright brothers built bicycles before airplanes."], expl: "The passage emphasizes how failures and testing led to the 1903 flight." },
      { type: "ebsr", standard: "RI.{g}.3", skill: "Analyze connections and distinctions between individuals, ideas, or events.",
        a: { q: "Part A: What led the Wright brothers to build a wind tunnel?", a: "They suspected the published data they used was inaccurate.", d: ["They wanted to sell wind tunnels to other inventors.", "Their 1903 flight was too short.", "They needed a place to store their gliders."] },
        b: { q: "Part B: Which sentence best supports the answer to Part A?", correct: ["They suspected that the published measurements they had relied on were wrong."], wrong: ["The flight covered only about 120 feet.", "It flew hundreds of times.", "Beginning in 1899, Wilbur and Orville Wright built and tested a series of kites and gliders."] },
        expl: "Paragraph 3 explains that doubts about the old data led to the wind tunnel experiments." },
      { type: "mc", standard: "RI.{g}.6", skill: "Determine an author's point of view or purpose and analyze how the author distinguishes it from others.", q: "How does the author's view of the first flight differ from the way it is “often described”?", a: "The author sees it as the result of years of work, not a sudden triumph.", d: ["The author believes the flight never happened.", "The author thinks the flight was unimportant.", "The author argues that Wilbur flew the plane, not Orville."], expl: "Paragraph 2 contrasts the popular idea of sudden success with the reality of years of failure." },
      { type: "mc", standard: "RI.{g}.4", skill: "Determine the meaning of technical words in context.", q: "Based on paragraph 4, what is the purpose of “wing warping”?", a: "to help the pilot balance and turn the aircraft", d: ["to make the wings lighter", "to measure the lift of curved wings", "to start the engine"], expl: "The passage says wing warping twisted the wings to help the pilot balance and turn." },
      { type: "ms", standard: "RI.{g}.1", skill: "Cite textual evidence.", q: "Select two details that show the brothers' persistence.", correct: ["They tested more than 200 wing shapes.", "After the poor 1901 glider, they questioned their data instead of quitting."], wrong: ["Orville lay on the lower wing of the aircraft.", "The flight was shorter than a jumbo jet's wingspan.", "The flight took place in North Carolina."], expl: "Both details show the brothers kept working through setbacks." },
      { type: "mc", standard: "RI.{g}.5", skill: "Analyze how a key sentence develops and refines an idea.", q: "Why does the author compare the first flight to the wingspan of a modern jumbo jet?", a: "to emphasize how short the flight was despite its importance", d: ["to explain how jumbo jets were invented", "to show that the Wright plane was larger than a jet", "to argue that modern jets are unsafe"], expl: "The comparison highlights the small distance of a world-changing event." }
    ]
  },
  {
    id: "P78-DIARY",
    title: "From the Diary of a Lighthouse Keeper's Daughter, 1886",
    genre: "literary",
    text: `March 3 — Father's fever has not broken. The doctor from the mainland cannot cross until the gale passes, and Mother will not leave Father's side. That leaves the light to me.

I have watched Father tend the lamp a thousand times, but watching is not doing. Tonight I climbed the ninety-two steps with the oil can banging against my knees. My hands shook as I trimmed the wick. When the flame finally caught and the great lens began to turn, I let out a breath I had not known I was holding.

March 4 — No sleep. Every two hours I wound the clockwork that turns the lens, and every two hours I checked the oil. Near dawn, through the spray, I saw the lights of a schooner pass well clear of the rocks. I do not know her name. Her crew will never know mine. Still, I wept a little, and I am not ashamed to write it.

March 6 — The gale has blown itself out, and the doctor has come. Father is weak but awake. When Mother told him I had kept the light, he was quiet for a long time. Then he asked to see the logbook. He read every entry I had made—the times, the oil, the weather—and nodded.

“Neat hand,” he said. “Steady work.”

From Father, that is the highest praise there is. I think I will keep this diary, and I think I will keep the light, too, if they will let me.`,
    items: [
      { type: "mc", standard: "RL.{g}.2", skill: "Determine a theme and analyze its development.", q: "Which theme is developed in the diary entries?", a: "Taking on responsibility in a crisis can reveal courage and purpose.", d: ["Lighthouse work is too dangerous for young people.", "Doctors should live closer to lighthouses.", "Storms are more powerful than people."], expl: "The narrator steps up to keep the light and discovers she wants to continue doing it." },
      { type: "ebsr", standard: "RL.{g}.3", skill: "Analyze how a character develops over the course of a text.",
        a: { q: "Part A: How does the narrator change over the course of the diary?", a: "She moves from uncertainty about the job to confidence that she wants to keep doing it.", d: ["She moves from confidence to fear of the lighthouse.", "She moves from anger at her father to forgiveness.", "She stays equally nervous from beginning to end."] },
        b: { q: "Part B: Which two quotations best support the answer to Part A? Select two.", correct: ["My hands shook as I trimmed the wick.", "I think I will keep this diary, and I think I will keep the light, too, if they will let me."], wrong: ["The doctor from the mainland cannot cross until the gale passes.", "Father is weak but awake.", "He read every entry I had made—the times, the oil, the weather—and nodded."] },
        expl: "Her shaking hands show early uncertainty, and her final wish shows new confidence." },
      { type: "mc", standard: "RL.{g}.4", skill: "Analyze the impact of word choice on meaning and tone.", q: "What does the narrator mean when she writes, “watching is not doing”?", a: "Seeing someone perform a task is different from being responsible for it yourself.", d: ["She was not allowed to watch her father work.", "She prefers to do chores without watching.", "She could not see the lamp from the house."], expl: "She realizes that observing her father didn't fully prepare her." },
      { type: "mc", standard: "RL.{g}.5", skill: "Analyze how a text's form (diary) contributes to its meaning.", q: "How does the diary format affect the reader's understanding of events?", a: "It reveals the narrator's private thoughts and feelings as events unfold.", d: ["It allows the reader to know what every character is thinking.", "It provides an objective news report of the storm.", "It hides the narrator's emotions from the reader."], expl: "Dated first-person entries show her personal reactions, such as weeping when the schooner passes." },
      { type: "ms", standard: "RL.{g}.1", skill: "Cite evidence to support an inference about a character.", q: "Select two details that suggest the narrator's father does not praise people easily.", correct: ["“Neat hand,” he said. “Steady work.”", "From Father, that is the highest praise there is."], wrong: ["Father's fever has not broken.", "The gale has blown itself out, and the doctor has come.", "I have watched Father tend the lamp a thousand times."], expl: "His brief words are described as his highest praise." },
      { type: "mc", standard: "RL.{g}.6", skill: "Analyze how point of view creates effects such as suspense.", q: "Why is the sentence “Her crew will never know mine” significant?", a: "It shows the narrator understands her important work may go unrecognized, yet it still matters to her.", d: ["It shows she is angry the crew did not thank her.", "It reveals that the schooner crashed on the rocks.", "It explains that the narrator forgot her own name."], expl: "She accepts that her role is invisible to the sailors but is moved by having helped them." }
    ]
  },
  {
    id: "P78-CRABS",
    title: "Counting Crabs: Citizen Scientists on the Delaware Bay",
    genre: "informational",
    text: `On calm nights in late May and June, when the moon is full or new, the beaches of the Delaware Bay fill with an ancient visitor. Horseshoe crabs, animals that have existed for more than 400 million years, crawl ashore by the thousands to lay their eggs in the sand.

For decades, scientists struggled to answer a simple question: how many horseshoe crabs are there? The bay's shoreline stretches for miles, and the spawning happens mostly at night. No single research team could watch every beach at once.

The solution came from ordinary people. Since 1990, volunteers have joined a yearly survey. Equipped with flashlights, clipboards, and a square frame called a quadrat, they walk set routes along the tide line. At regular intervals, they drop the quadrat and count every crab inside it. Scientists then use these samples to estimate the total population.

The data have revealed troubling trends. During the 1990s, crabs were harvested in large numbers for use as fishing bait. Counts dropped sharply. The decline mattered beyond the crabs themselves. Each spring, migrating shorebirds called red knots stop at the bay to feast on crab eggs before flying to the Arctic. With fewer eggs available, many red knots could not gain enough weight to complete their journey, and their numbers fell dramatically.

Citizen data helped persuade officials to act. New Jersey placed a moratorium on harvesting horseshoe crabs in 2008, and other states limited their harvests. Critics, including some people in the fishing industry, argued that the restrictions hurt their livelihoods and that the data were incomplete. Researchers responded that the volunteer survey, carried out with the same methods year after year, provided the most consistent record available.

The crab population has not fully recovered, and the debate continues. Still, the survey has shown what is possible when thousands of people with flashlights decide that a question is worth answering. As one longtime volunteer put it, "You don't need a degree to count. You just need to show up."`,
    items: [
      { type: "mc", standard: "RI.{g}.2", skill: "Determine a central idea of a text and analyze its development.", q: "Which statement best expresses a central idea of the passage?", a: "Volunteer counts have given scientists valuable data that influenced decisions about protecting horseshoe crabs.", d: ["Horseshoe crabs are the oldest animals on Earth.", "Red knots are the most important birds on the Delaware Bay.", "The fishing industry has always supported limits on harvesting crabs."], expl: "The passage traces how the volunteer survey began, what it revealed, and how it shaped protection decisions." },
      { type: "ebsr", standard: "RI.{g}.3", skill: "Analyze the interactions between individuals, events, and ideas in a text.",
        a: { q: "Part A: According to the passage, how did the decline of horseshoe crabs affect red knots?", a: "Red knots had fewer eggs to eat, so many could not finish their migration.", d: ["Red knots began to eat fishing bait instead of eggs.", "Red knots stopped visiting the Delaware Bay entirely.", "Red knots helped volunteers count the crabs."] },
        b: { q: "Part B: Which sentence from the passage best supports the answer to Part A?", correct: ["With fewer eggs available, many red knots could not gain enough weight to complete their journey, and their numbers fell dramatically."], wrong: ["Counts dropped sharply.", "During the 1990s, crabs were harvested in large numbers for use as fishing bait.", "The crab population has not fully recovered, and the debate continues."] },
        expl: "Paragraph 4 links fewer crab eggs to red knots being unable to gain weight for migration." },
      { type: "mc", standard: "RI.{g}.4", skill: "Determine the meaning of words and phrases, including technical meanings.", q: "In paragraph 5, what does the word moratorium most likely mean?", a: "an official stop to an activity", d: ["a reward for catching more crabs", "a scientific survey method", "a type of fishing bait"], expl: "New Jersey's moratorium is contrasted with other states that merely limited harvests, so it means a complete stop." },
      { type: "ms", standard: "RI.{g}.6", skill: "Determine an author's point of view or purpose and how the author addresses conflicting viewpoints.", q: "Select two ways the author responds to the critics described in paragraph 5.", correct: ["The author includes researchers' explanation that the survey used consistent methods.", "The author admits that the crab population has not fully recovered."], wrong: ["The author ignores the critics' concerns entirely.", "The author argues that fishing should be banned in every state.", "The author claims that the critics have changed their minds."], expl: "The author presents the researchers' response and acknowledges that the debate continues." },
      { type: "mc", standard: "RI.{g}.8", skill: "Trace and evaluate the argument and specific claims in a text.", q: "Which evidence best supports the claim that the volunteer survey is reliable?", a: "Volunteers have used the same methods year after year since 1990.", d: ["Horseshoe crabs have existed for more than 400 million years.", "Spawning happens mostly at night.", "Volunteers carry flashlights and clipboards."], expl: "Consistent methods over many years make the data comparable and trustworthy." },
      { type: "mc", standard: "RI.{g}.5", skill: "Analyze the structure an author uses to organize a text.", q: "How do paragraphs 2 and 3 relate to each other?", a: "Paragraph 2 describes a problem, and paragraph 3 explains how it was solved.", d: ["Paragraph 2 gives an opinion, and paragraph 3 disagrees with it.", "Paragraph 2 tells a story, and paragraph 3 describes a setting.", "Both paragraphs list facts about red knots."], expl: "Paragraph 2 explains why counting crabs was hard; paragraph 3 explains the volunteer solution." },
      { type: "mc", standard: "RI.{g}.1", skill: "Cite textual evidence that most strongly supports an analysis of what the text says.", q: "Which quotation best supports the idea that anyone can contribute to science?", a: "\"You don't need a degree to count. You just need to show up.\"", d: ["\"No single research team could watch every beach at once.\"", "\"Counts dropped sharply.\"", "\"Critics, including some people in the fishing industry, argued that the restrictions hurt their livelihoods.\""], expl: "The volunteer's quotation says that showing up, not training, is what matters." }
    ]
  }
];

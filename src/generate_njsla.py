import json
import random
from pathlib import Path

"""
NJSLA-oriented sample question generator.

This is not a source of official released NJSLA items. It creates original
practice items that are closer to NJSLA expectations than simple arithmetic or
generic recall questions:

- grade-specific math domains and standards metadata
- ELA passage-based questions with evidence and vocabulary-in-context items
- science scenario/data questions aligned to 3-dimensional reasoning
- explanations for remediation
- split output files for the app: data/grade-3.json ... data/grade-10.json
"""

random.seed(42)

ROOT_DIR = Path(__file__).resolve().parents[1]
SRC_OUTPUT = Path(__file__).with_name("njsla_questions.json")
DATA_DIR = ROOT_DIR / "data"
GRADES = range(3, 11)
SUBJECTS = ("math", "ela", "science")
QUESTIONS_PER_SUBJECT = 40


MATH_BLUEPRINT = {
    3: [
        ("3.OA.A.3", "Operations and Algebraic Thinking", "Represent and solve multiplication and division word problems."),
        ("3.NBT.A.2", "Number and Operations in Base Ten", "Use place value strategies for addition and subtraction."),
        ("3.NF.A.3", "Number and Operations - Fractions", "Explain equivalence of fractions."),
        ("3.M.A.2", "Measurement", "Solve problems involving measurement data."),
        ("3.G.A.1", "Geometry", "Reason about attributes of shapes.")
    ],
    4: [
        ("4.OA.A.3", "Operations and Algebraic Thinking", "Solve multistep word problems."),
        ("4.NBT.B.4", "Number and Operations in Base Ten", "Fluently add and subtract multi-digit whole numbers."),
        ("4.NF.B.3", "Number and Operations - Fractions", "Add and subtract fractions with like denominators."),
        ("4.M.A.3", "Measurement", "Apply area and perimeter formulas."),
        ("4.DL.A.1", "Data Literacy", "Represent and interpret numerical data.")
    ],
    5: [
        ("5.NBT.B.7", "Number and Operations in Base Ten", "Perform operations with decimals to hundredths."),
        ("5.NF.A.1", "Number and Operations - Fractions", "Add and subtract fractions with unlike denominators."),
        ("5.NF.B.4", "Number and Operations - Fractions", "Apply multiplication to fractions."),
        ("5.M.A.1", "Measurement", "Convert among measurement units."),
        ("5.G.A.2", "Geometry", "Represent real-world problems on a coordinate plane.")
    ],
    6: [
        ("6.RP.A.3", "Ratios and Proportional Relationships", "Use ratio and rate reasoning to solve problems."),
        ("6.NS.B.3", "The Number System", "Compute fluently with multi-digit decimals."),
        ("6.EE.B.7", "Expressions and Equations", "Solve one-variable equations."),
        ("6.G.A.1", "Geometry", "Find area of polygons."),
        ("6.SP.B.5", "Statistics and Probability", "Summarize numerical data sets.")
    ],
    7: [
        ("7.RP.A.2", "Ratios and Proportional Relationships", "Recognize and represent proportional relationships."),
        ("7.NS.A.3", "The Number System", "Solve real-world problems with rational numbers."),
        ("7.EE.B.4", "Expressions and Equations", "Use equations and inequalities to solve problems."),
        ("7.G.B.6", "Geometry", "Solve area, volume, and surface area problems."),
        ("7.SP.C.7", "Statistics and Probability", "Develop probability models.")
    ],
    8: [
        ("8.F.A.3", "Functions", "Interpret linear and nonlinear functions."),
        ("8.EE.B.5", "Expressions and Equations", "Graph proportional relationships and interpret slope."),
        ("8.G.B.7", "Geometry", "Apply the Pythagorean Theorem."),
        ("8.SP.A.2", "Statistics and Probability", "Analyze patterns of association in bivariate data."),
        ("8.NS.A.2", "The Number System", "Use rational approximations of irrational numbers.")
    ],
    9: [
        ("A.REI.B.3", "Algebra", "Solve linear equations and inequalities."),
        ("F.IF.B.4", "Functions", "Interpret key features of graphs and functions."),
        ("S.ID.B.6", "Statistics", "Represent data on two quantitative variables."),
        ("G.CO.A.2", "Geometry", "Represent transformations in the plane."),
        ("A.CED.A.2", "Algebra", "Create equations that describe relationships.")
    ],
    10: [
        ("A.REI.C.6", "Algebra", "Solve systems of linear equations."),
        ("F.IF.C.7", "Functions", "Graph and interpret functions."),
        ("G.SRT.B.5", "Geometry", "Use congruence and similarity criteria."),
        ("S.CP.A.3", "Statistics and Probability", "Understand conditional probability."),
        ("A.SSE.B.3", "Algebra", "Choose equivalent forms of expressions.")
    ]
}

SCIENCE_BLUEPRINT = {
    3: ("3-LS3-1", "Life Science", "Inheritance and variation of traits"),
    4: ("4-PS3-2", "Physical Science", "Energy transfer and evidence from observations"),
    5: ("5-ESS1-1", "Earth and Space Science", "Use evidence to support explanations about stars and brightness"),
    6: ("MS-PS1-2", "Physical Science", "Analyze and interpret data on properties of substances"),
    7: ("MS-LS2-1", "Life Science", "Analyze ecosystem interactions and resource availability"),
    8: ("MS-ESS2-2", "Earth and Space Science", "Use evidence to explain geoscience processes"),
    9: ("HS-LS1-5", "Biology", "Use models to explain photosynthesis and matter cycling"),
    10: ("HS-PS1-7", "Chemistry and Physics", "Use mathematical representations to support conservation claims")
}

MATH_CONTEXTS = {
    3: ["During a class supply count,", "At the school garden,", "For a picture graph activity,"],
    4: ["During a field day plan,", "For a library display,", "While comparing measurement data,"],
    5: ["During a science fair budget task,", "On a coordinate-grid map of the school,", "For a recipe conversion problem,"],
    6: ["For a robotics club rate problem,", "During a data summary task,", "In a school store discount problem,"],
    7: ["For a proportional relationship investigation,", "During a probability simulation,", "In a scale drawing task,"],
    8: ["While analyzing a linear graph,", "During a geometry proof warm-up,", "In a bivariate data investigation,"],
    9: ["In an Algebra I modeling task,", "While interpreting a function graph,", "During a statistics analysis,"],
    10: ["In a Geometry and Algebra II task,", "While comparing equivalent expressions,", "During a conditional probability investigation,"]
}

ELA_SKILLS = {
    "lower": [
        ("RL.CR", "Close Reading", "Use explicit details to answer questions about a literary text."),
        ("RI.CI", "Central Idea", "Determine the main idea and supporting details."),
        ("L.VL", "Vocabulary", "Use context to determine word meaning."),
        ("RI.IT", "Text Structure", "Analyze sequence, cause/effect, or comparison."),
        ("RI.AA", "Author's Purpose", "Explain how an author supports a point.")
    ],
    "middle": [
        ("RL.IT", "Literary Analysis", "Analyze theme, character change, and structure."),
        ("RI.CR", "Close Reading", "Cite textual evidence to support analysis."),
        ("RI.AA", "Argument", "Evaluate claims and relevant evidence."),
        ("L.VI", "Vocabulary", "Interpret figurative and academic language."),
        ("RI.PP", "Point of View", "Compare how authors shape perspective.")
    ],
    "high": [
        ("RL.TS", "Text Structure", "Analyze how structure contributes to meaning."),
        ("RI.AA", "Argument", "Evaluate reasoning and sufficiency of evidence."),
        ("RI.MF", "Multiple Sources", "Synthesize ideas across sources."),
        ("L.KL", "Language", "Analyze precise word choice and tone."),
        ("W.AW", "Writing from Sources", "Use evidence to develop a written argument.")
    ]
}


def make_question(question_id, grade, subject, question, choices, correct, standard, domain, skill, explanation, item_type):
    correct_values = [str(value) for value in correct] if isinstance(correct, list) else [str(correct)]
    choices = unique_choices([str(choice) for choice in choices])

    for index, correct_value in enumerate(correct_values):
        if correct_value not in choices:
            choices[-(index + 1)] = correct_value

    rotate_by_id(choices, question_id)

    question_data = {
        "id": question_id,
        "grade": grade,
        "subject": subject,
        "standard": standard,
        "domain": domain,
        "skill": skill,
        "itemType": item_type,
        "difficulty": difficulty_for_number(question_id),
        "question": question,
        "choices": choices,
        "correctAnswer": correct_values[0],
        "explanation": explanation
    }

    if len(correct_values) > 1:
        question_data["correctAnswers"] = correct_values

    return question_data


def unique_choices(choices):
    output = []
    seen = set()
    for choice in choices:
        if choice not in seen:
            seen.add(choice)
            output.append(choice)

    filler = 1
    while len(output) < 4:
        candidate = f"Not supported by the information {filler}"
        if candidate not in seen:
            output.append(candidate)
        filler += 1

    return output[:4]


def rotate_by_id(choices, question_id):
    offset = sum(ord(char) for char in question_id) % len(choices)
    choices[:] = choices[offset:] + choices[:offset]


def difficulty_for_number(question_id):
    number = int(question_id.split("Q")[-1])
    if number % 5 == 0:
        return "advanced"
    if number % 3 == 0:
        return "medium"
    return "foundational"


def math_question(grade, number):
    standard, domain, skill = MATH_BLUEPRINT[grade][(number - 1) % len(MATH_BLUEPRINT[grade])]
    item_id = f"M{grade}Q{number}"
    variant = (number - 1) % 8

    if grade <= 5:
        apples = 18 + grade + number
        rows = 3 + (number % 4)
        cols = 4 + (grade % 3) + (number % 3)
        numerator = 1 + (number % 3)
        denominator = 4 if grade <= 4 else 6
        decimal_a = round(grade + number / 10, 2)
        decimal_b = round((number % 7) / 10 + 0.25, 2)
        x_coord = number % 6
        y_coord = grade + (number % 5)

        templates = [
            (
                f"A cafeteria packed {rows} trays with {cols} lunches on each tray and had {apples} extra lunches. How many lunches were packed in all?",
                rows * cols + apples,
                [rows + cols + apples, rows * (cols + apples), rows * cols],
                "Multiply to find lunches on trays, then add the extra lunches.",
                "multi_step_word_problem"
            ),
            (
                f"A garden has an area of {rows * cols} square feet. One side is {rows} feet long. What is the missing side length?",
                cols,
                [rows, rows + cols, rows * cols],
                "Use area = length x width, so divide the area by the known side.",
                "multiple_choice"
            ),
            (
                f"Which expression is equivalent to {numerator}/{denominator} + {numerator}/{denominator}?",
                f"{numerator * 2}/{denominator}",
                [f"{numerator}/{denominator * 2}", f"{numerator + 1}/{denominator + 1}", f"{numerator * 2}/{denominator * 2}"],
                "When denominators are the same, add the numerators and keep the denominator.",
                "multiple_choice"
            ),
            (
                f"A science notebook weighs {decimal_a} ounces. A pencil case weighs {decimal_b} ounces. What is the total weight?",
                f"{decimal_a + decimal_b:.2f} ounces",
                [f"{decimal_a - decimal_b:.2f} ounces", f"{decimal_a + decimal_b + 1:.2f} ounces", f"{decimal_a * decimal_b:.2f} ounces"],
                "Add the decimal weights and keep the units in the answer.",
                "multiple_choice"
            ),
            (
                f"Point A is located at ({x_coord}, {y_coord}) on a coordinate grid. Which point is 3 units to the right of A?",
                f"({x_coord + 3}, {y_coord})",
                [f"({x_coord}, {y_coord + 3})", f"({x_coord - 3}, {y_coord})", f"({x_coord + 3}, {y_coord + 3})"],
                "Moving right changes the x-coordinate and keeps the y-coordinate the same.",
                "coordinate_reasoning"
            ),
            (
                f"A line plot shows plant heights of {grade}, {grade + 1}, {grade + 1}, and {grade + 3} inches. What is the most common height?",
                f"{grade + 1} inches",
                [f"{grade} inches", f"{grade + 2} inches", f"{grade + 3} inches"],
                "The most common value is the one that appears most often.",
                "data_analysis"
            ),
            (
                f"A class collected {rows * 10} cans in week 1 and {cols * 10} cans in week 2. They packed the cans equally into 5 boxes. How many cans were in each box?",
                (rows * 10 + cols * 10) // 5,
                [rows + cols, rows * cols, rows * 10 + cols * 10],
                "Add the cans from both weeks, then divide by the number of boxes.",
                "multi_step_word_problem"
            ),
            (
                f"Which statement correctly compares {decimal_a:.2f} and {decimal_a + 0.08:.2f}?",
                f"{decimal_a:.2f} < {decimal_a + 0.08:.2f}",
                [f"{decimal_a:.2f} > {decimal_a + 0.08:.2f}", f"{decimal_a:.2f} = {decimal_a + 0.08:.2f}", f"{decimal_a + 0.08:.2f} < {decimal_a:.2f}"],
                "Compare place values from left to right. The second decimal is greater.",
                "multiple_choice"
            )
        ]
    elif grade <= 8:
        rate = grade + 2
        hours = 2 + (number % 5)
        x = grade + number % 7
        discount = 10 + grade
        price = 30 + number
        values = [grade, grade + 2, grade + 5, grade + 5, grade + 8]

        templates = [
            (
                f"A printer makes {rate} pages per minute. Which equation represents p, the number of pages printed in {hours} minutes?",
                f"p = {rate} x {hours}",
                [f"p = {rate} + {hours}", f"p = {hours} - {rate}", f"p = {rate}/{hours}"],
                "A constant rate is multiplied by time to find the total.",
                "equation_modeling"
            ),
            (
                f"Solve for x: 3x + {number} = {3 * x + number}.",
                x,
                [x + 2, x - 2, 3 * x],
                "Subtract the constant from both sides, then divide by 3.",
                "multiple_choice"
            ),
            (
                f"A jacket costs ${price}. It is discounted by {discount}%. What is the sale price?",
                f"${price * (1 - discount / 100):.2f}",
                [f"${price - discount:.2f}", f"${price * discount / 100:.2f}", f"${price + discount:.2f}"],
                "Find the percent discount and subtract it from the original price.",
                "calculator_active"
            ),
            (
                f"The data set is {', '.join(str(v) for v in values)}. Which value is the median?",
                grade + 5,
                [grade + 2, grade + 4, grade + 8],
                "The median is the middle value when the data are ordered.",
                "data_analysis"
            ),
            (
                f"A triangle has base {rate + 3} cm and height {hours + 4} cm. What is its area?",
                f"{((rate + 3) * (hours + 4)) / 2:g} square cm",
                [f"{(rate + 3) * (hours + 4)} square cm", f"{rate + hours + 7} square cm", f"{2 * (rate + hours + 7)} square cm"],
                "Use area of a triangle = 1/2 x base x height.",
                "multiple_choice"
            ),
            (
                f"Line A has equation y = {rate}x + {hours}. What is the slope?",
                rate,
                [hours, rate + hours, -rate],
                "In y = mx + b, the coefficient of x is the slope.",
                "multiple_choice"
            ),
            (
                f"A right triangle has legs {hours + 3} and {hours + 4}. Which expression gives the hypotenuse?",
                f"sqrt({(hours + 3) ** 2 + (hours + 4) ** 2})",
                [f"sqrt({hours + 3 + hours + 4})", f"{hours + 3 + hours + 4}", f"{(hours + 3) * (hours + 4)}"],
                "Use the Pythagorean Theorem: a^2 + b^2 = c^2.",
                "multiple_choice"
            ),
            (
                f"A proportional relationship includes the point ({hours}, {hours * rate}). What is the constant of proportionality?",
                rate,
                [hours, hours * rate, rate + hours],
                "For y = kx, divide y by x to find k.",
                "proportional_reasoning"
            )
        ]
    else:
        a = 2 + number % 5
        b = grade - 6
        x = 1 + number % 6
        y = x + 3

        templates = [
            (
                f"The function f(x) = {a}x + {b}. What is f({x})?",
                a * x + b,
                [a + x + b, a * x, x + b],
                "Substitute the input for x and evaluate the expression.",
                "function_evaluation"
            ),
            (
                f"Solve the system: x - y = -3 and x + y = {x + y}. What is y?",
                y,
                [x, x + y, y - x],
                "The first equation shows y is 3 more than x; solve with the sum equation.",
                "system_of_equations"
            ),
            (
                f"Which expression is equivalent to (x + {a})^2?",
                f"x^2 + {2 * a}x + {a * a}",
                [f"x^2 + {a * a}", f"x^2 + {a}x + {a * a}", f"2x + {2 * a}"],
                "Square the binomial using x^2 + 2ax + a^2.",
                "multiple_choice"
            ),
            (
                f"A data display shows a positive linear association. Which correlation coefficient is most reasonable?",
                "0.82",
                ["-0.82", "0.00", "-0.12"],
                "Positive linear association should have a positive correlation close to 1.",
                "data_analysis"
            ),
            (
                f"A triangle is dilated by a scale factor of {a}. What happens to its area?",
                f"The area is multiplied by {a * a}.",
                [f"The area is multiplied by {a}.", "The area stays the same.", f"The area is divided by {a}."],
                "Area changes by the square of the scale factor.",
                "geometry_reasoning"
            ),
            (
                f"The vertex of g(x) = (x - {a})^2 + {b} is which point?",
                f"({a}, {b})",
                [f"({-a}, {b})", f"({a}, {-b})", f"({b}, {a})"],
                "Vertex form is (x - h)^2 + k, with vertex (h, k).",
                "function_analysis"
            ),
            (
                f"Which equation models a line with slope {a} and y-intercept {b}?",
                f"y = {a}x + {b}",
                [f"y = {b}x + {a}", f"y = {a} + {b}x", f"y = {a - b}x"],
                "Slope-intercept form is y = mx + b.",
                "equation_modeling"
            ),
            (
                f"If P(A) = 0.6 and P(A and B) = 0.24, what is P(B|A)?",
                "0.4",
                ["0.84", "0.36", "0.24"],
                "Conditional probability P(B|A) = P(A and B) / P(A).",
                "probability_reasoning"
            )
        ]

    question, correct, distractors, explanation, item_type = templates[(number - 1) % len(templates)]
    context = MATH_CONTEXTS[grade][((number - 1) // len(templates)) % len(MATH_CONTEXTS[grade])]
    question = f"{context} {question[0].lower()}{question[1:]}"
    return make_question(item_id, grade, "math", question, [correct, *distractors], correct, standard, domain, skill, explanation, item_type)


def ela_band(grade):
    if grade <= 5:
        return "lower"
    if grade <= 8:
        return "middle"
    return "high"


ELA_PASSAGES = {
    3: [
        {
            "text": "Nia placed a bowl outside during a light rain. After ten minutes, she measured the water and wrote the amount on a chart. She repeated the measurement two more times before telling her class what she found.",
            "central": "Nia uses repeated observations to share reliable information.",
            "evidence": ["she measured the water and wrote the amount on a chart", "She repeated the measurement two more times"],
            "vocab": "repeated",
            "meaning": "did again",
            "structure": "It tells events in the order they happened.",
            "inference": "Nia wants her conclusion to be based on careful observations."
        },
        {
            "text": "When the class pet hid under the paper towels, Mateo spoke softly and moved slowly. Soon the guinea pig came out and began eating lettuce from his hand.",
            "central": "Mateo's gentle actions help the animal feel safe.",
            "evidence": ["Mateo spoke softly and moved slowly", "the guinea pig came out and began eating lettuce"],
            "vocab": "softly",
            "meaning": "in a quiet way",
            "structure": "It shows a problem and how a character responds.",
            "inference": "Mateo understands that sudden movements might frighten the animal."
        }
    ],
    4: [
        {
            "text": "A local history article explains that the town's first library began in one room above a bakery. As more families borrowed books, volunteers moved the shelves to a larger building near the train station.",
            "central": "The town library grew as more people used it.",
            "evidence": ["more families borrowed books", "volunteers moved the shelves to a larger building"],
            "vocab": "volunteers",
            "meaning": "people who choose to help without being paid",
            "structure": "It describes changes over time.",
            "inference": "The library became important to the community."
        },
        {
            "text": "The article compares paper maps with digital maps. Paper maps do not need batteries, but digital maps can update quickly when roads close.",
            "central": "Paper maps and digital maps each have useful features.",
            "evidence": ["Paper maps do not need batteries", "digital maps can update quickly"],
            "vocab": "update",
            "meaning": "change to include new information",
            "structure": "It compares two tools.",
            "inference": "The best map choice may depend on the situation."
        }
    ],
    5: [
        {
            "text": "At the edge of the school garden, Amira noticed that the basil plants near the rain barrel were taller than the plants by the fence. She checked the soil and found that the taller plants stayed damp longer after hot afternoons.",
            "central": "Observations can help explain why plants grow differently.",
            "evidence": ["the basil plants near the rain barrel were taller", "the taller plants stayed damp longer"],
            "vocab": "observations",
            "meaning": "details noticed and recorded",
            "structure": "It presents an observation and evidence that helps explain it.",
            "inference": "Water availability may have affected the basil plants."
        },
        {
            "text": "A school newspaper feature describes how fifth graders organized a book swap. Students first counted donated books by genre, then made signs so younger students could find mysteries, biographies, and comics easily.",
            "central": "The students planned the book swap so others could use it easily.",
            "evidence": ["Students first counted donated books by genre", "made signs so younger students could find books"],
            "vocab": "genre",
            "meaning": "a category or type of book",
            "structure": "It explains steps in a process.",
            "inference": "The students considered what younger readers would need."
        }
    ],
    6: [
        {
            "text": "The student council proposed replacing disposable lunch trays with washable trays. Supporters argued that the change would reduce waste, while opponents worried about the cost of new equipment.",
            "central": "The tray proposal has both environmental benefits and cost concerns.",
            "evidence": ["the change would reduce waste", "opponents worried about the cost of new equipment"],
            "vocab": "proposed",
            "meaning": "suggested for consideration",
            "structure": "It presents a proposal and opposing viewpoints.",
            "inference": "The council needs evidence about both waste and cost."
        },
        {
            "text": "A science club article explains that composting cafeteria scraps can reduce trash. The article also notes that compost bins require regular turning and careful monitoring.",
            "central": "Composting can help reduce trash but requires maintenance.",
            "evidence": ["can reduce trash", "require regular turning and careful monitoring"],
            "vocab": "monitoring",
            "meaning": "checking regularly",
            "structure": "It explains benefits and responsibilities.",
            "inference": "A compost program needs a clear plan to succeed."
        }
    ],
    7: [
        {
            "text": "An article about school robotics teams explains that students often revise designs after a robot fails a task. The writer argues that these failures are useful because they reveal exactly what needs improvement.",
            "central": "Failure can guide better engineering decisions.",
            "evidence": ["students often revise designs", "failures are useful because they reveal exactly what needs improvement"],
            "vocab": "revise",
            "meaning": "change to improve",
            "structure": "It states a claim and supports it with a reason.",
            "inference": "The writer values testing as part of learning."
        },
        {
            "text": "A technology column compares handwritten notes with typed notes. Typed notes are faster to search, but handwritten notes may help some students remember ideas because they must choose key points.",
            "central": "Different note-taking methods have different strengths.",
            "evidence": ["Typed notes are faster to search", "handwritten notes may help some students remember ideas"],
            "vocab": "key",
            "meaning": "most important",
            "structure": "It compares advantages of two methods.",
            "inference": "Students may choose a method based on their goal."
        }
    ],
    8: [
        {
            "text": "In the historical fiction excerpt, Lila studies a faded train schedule before leaving home. She knows the last train arrives before sunset, and missing it would force her family to wait another week.",
            "central": "Lila must make a careful decision under time pressure.",
            "evidence": ["the last train arrives before sunset", "missing it would force her family to wait another week"],
            "vocab": "faded",
            "meaning": "less clear or bright than before",
            "structure": "It builds tension by explaining what is at stake.",
            "inference": "The train schedule is important to Lila's family's plans."
        },
        {
            "text": "A profile of a young inventor describes years of prototypes that collapsed, overheated, or moved too slowly. Instead of quitting, she recorded each flaw and adjusted the next model.",
            "central": "Persistence and analysis help the inventor improve her work.",
            "evidence": ["recorded each flaw", "adjusted the next model"],
            "vocab": "prototypes",
            "meaning": "early models used for testing",
            "structure": "It shows repeated problems followed by responses.",
            "inference": "The inventor treats mistakes as useful information."
        }
    ],
    9: [
        {
            "text": "In a civic argument essay, the writer claims that bus routes should be expanded to connect neighborhoods with job centers. The writer cites commute data and interviews with workers who currently spend over an hour transferring between buses.",
            "central": "Expanded bus routes could improve access to employment.",
            "evidence": ["commute data", "interviews with workers who currently spend over an hour transferring"],
            "vocab": "expanded",
            "meaning": "made larger or more extensive",
            "structure": "It makes a claim and supports it with evidence.",
            "inference": "The writer believes transportation affects economic opportunity."
        },
        {
            "text": "An essay on community gardens acknowledges that garden programs require volunteers, water, and planning. However, it argues that they also create green space, teach science skills, and provide fresh produce.",
            "central": "Community gardens require effort but offer several benefits.",
            "evidence": ["require volunteers, water, and planning", "create green space, teach science skills, and provide fresh produce"],
            "vocab": "acknowledges",
            "meaning": "recognizes as true or important",
            "structure": "It addresses a counterclaim before supporting a claim.",
            "inference": "The writer wants readers to consider both costs and benefits."
        }
    ],
    10: [
        {
            "text": "In the editorial, the writer argues that public parks should include shaded seating, accessible paths, and native plants. The writer acknowledges that redesigning parks requires funding, but maintains that thoughtful design increases community use.",
            "central": "Thoughtful park design can make public spaces more useful.",
            "evidence": ["shaded seating, accessible paths, and native plants", "thoughtful design increases community use"],
            "vocab": "maintains",
            "meaning": "continues to argue",
            "structure": "It acknowledges a concern and then reinforces the main claim.",
            "inference": "The writer believes design choices affect how often people use parks."
        },
        {
            "text": "A literary analysis passage describes a narrator who praises a crowded celebration while privately noticing exits and checking the time. The contrast suggests that the narrator's cheerful words hide discomfort.",
            "central": "The narrator's public behavior conflicts with private feelings.",
            "evidence": ["praises a crowded celebration", "privately noticing exits and checking the time"],
            "vocab": "contrast",
            "meaning": "a difference between two things",
            "structure": "It uses contrast to reveal tension.",
            "inference": "The narrator may not feel as comfortable as the words suggest."
        }
    ]
}


def ela_passage(grade, number):
    passages = ELA_PASSAGES[grade]
    return passages[((number - 1) // 6) % len(passages)]


def ela_question(grade, number):
    band = ela_band(grade)
    standard, domain, skill = ELA_SKILLS[band][(number - 1) % len(ELA_SKILLS[band])]
    item_id = f"E{grade}Q{number}"
    passage_data = ela_passage(grade, number)
    passage = passage_data["text"]
    variant = (number - 1) % 6

    if variant == 0:
        question = f"Read the passage. {passage} Which sentence best states the central idea?"
        correct = passage_data["central"]
        distractors = ["The passage is mostly a list of unrelated facts.", "The passage shows that planning is never useful.", "The passage explains why evidence should be ignored."]
        explanation = "The central idea should cover the whole passage, not just one small detail."
        item_type = "multiple_choice"
    elif variant == 1:
        question = f"Read the passage. {passage} Select two details that best support the idea that the decision should be evidence-based."
        correct = passage_data["evidence"]
        distractors = ["The passage gives no useful details.", "The characters choose randomly."]
        explanation = "Both correct choices are details from the passage that support the central idea."
        item_type = "multiple_select"
    elif variant == 2:
        question = f"Read the passage. {passage} What does the word {passage_data['vocab']} most nearly mean as it is used?"
        correct = passage_data["meaning"]
        distractors = ["repairs", "hides", "measures"]
        explanation = "Use the surrounding sentence to determine how the word functions in context."
        item_type = "vocabulary_in_context"
    elif variant == 3:
        question = f"Read the passage. {passage} How is the passage mainly organized?"
        correct = passage_data["structure"]
        distractors = ["It lists events with no relationship.", "It compares two fictional characters.", "It gives only definitions."]
        explanation = "The structure describes how the ideas in the passage are arranged."
        item_type = "text_structure"
    elif variant == 4:
        question = f"Read the passage. {passage} Which inference is best supported?"
        correct = passage_data["inference"]
        distractors = ["The first idea mentioned is always correct.", "Cost never matters in a decision.", "Observations are less useful than guesses."]
        explanation = "A supported inference must follow from details in the passage."
        item_type = "inference"
    else:
        question = f"Read the passage. {passage} Which response would be the strongest short written answer?"
        correct = f"{passage_data['central']} This is supported by details such as {passage_data['evidence'][0]} and {passage_data['evidence'][1]}."
        distractors = ["The passage is mostly about lunch and plants, so no evidence is needed.", "The author says the problem is impossible to solve.", "The best answer should only repeat one phrase from the passage."]
        explanation = "A strong response makes a claim and supports it with several relevant details."
        item_type = "constructed_response_selected"

    correct_choices = correct if isinstance(correct, list) else [correct]
    return make_question(item_id, grade, "ela", question, [*correct_choices, *distractors], correct, standard, domain, skill, explanation, item_type)


SCIENCE_SCENARIOS = {
    3: [
        {
            "scenario": "A class compares two young tomato plants. Plant A receives morning sunlight, and Plant B stays on a shaded shelf. Both plants get the same soil, pot size, and water.",
            "measure": "plant height measured every two days",
            "variable": "amount of sunlight",
            "control": "same soil, pot size, and water",
            "claim": "More sunlight may help Plant A grow taller.",
            "model": "a line graph showing each plant's height over time"
        },
        {
            "scenario": "Students observe pill bugs in a tray with one damp side and one dry side. They count how many pill bugs move to each side after five minutes.",
            "measure": "the number of pill bugs on each side of the tray",
            "variable": "moisture level of the tray area",
            "control": "same tray, time, and number of pill bugs",
            "claim": "Pill bugs may prefer damp environments.",
            "model": "a bar graph comparing how many pill bugs chose each side"
        }
    ],
    4: [
        {
            "scenario": "Students roll toy cars down ramps covered with felt, cardboard, and sandpaper. They measure how far each car travels after leaving the ramp.",
            "measure": "distance traveled by the toy car on each surface",
            "variable": "surface material",
            "control": "same car, ramp height, and starting position",
            "claim": "Rougher surfaces reduce the distance the car travels.",
            "model": "a table comparing surface material and distance traveled"
        },
        {
            "scenario": "A class tests which material keeps an ice cube from melting quickly. They wrap equal-size ice cubes in foil, cloth, and paper and measure mass after ten minutes.",
            "measure": "ice cube mass remaining after ten minutes",
            "variable": "wrapping material",
            "control": "same ice cube size, room, and time",
            "claim": "Some materials slow heat transfer better than others.",
            "model": "a bar graph of remaining ice mass for each material"
        }
    ],
    5: [
        {
            "scenario": "A group models star brightness using flashlights at different distances from a wall. The same flashlight appears dimmer as it moves farther away.",
            "measure": "brightness of the light spot at each distance",
            "variable": "distance from the wall",
            "control": "same flashlight and wall surface",
            "claim": "A light source can appear dimmer when it is farther away.",
            "model": "a graph showing distance and observed brightness"
        },
        {
            "scenario": "Students mix salt into three cups of water at different temperatures. They record how long it takes the salt to dissolve in each cup.",
            "measure": "time needed for salt to dissolve",
            "variable": "water temperature",
            "control": "same amount of water, salt, and stirring",
            "claim": "Water temperature can affect how quickly salt dissolves.",
            "model": "a table comparing water temperature and dissolving time"
        }
    ],
    6: [
        {
            "scenario": "Students compare three unknown solids by measuring mass, volume, color, and whether each dissolves in water.",
            "measure": "density and solubility data for each solid",
            "variable": "type of solid being tested",
            "control": "same water amount and measuring tools",
            "claim": "Characteristic properties can help identify substances.",
            "model": "a data table listing properties of each solid"
        },
        {
            "scenario": "A class observes a sealed bag containing baking soda and vinegar. The bag inflates, but the total mass before and after mixing is nearly the same.",
            "measure": "total mass before and after the reaction",
            "variable": "whether the reactants are mixed",
            "control": "sealed bag and same amounts of reactants",
            "claim": "Mass is conserved when the reaction occurs in a closed system.",
            "model": "a before-and-after particle diagram"
        }
    ],
    7: [
        {
            "scenario": "Students study a pond model. When the amount of duckweed increases, less light reaches underwater plants and the snail population changes.",
            "measure": "duckweed coverage, light level, and snail population",
            "variable": "amount of duckweed",
            "control": "same pond model and observation schedule",
            "claim": "Changes in one population can affect other parts of an ecosystem.",
            "model": "a food web with arrows showing interactions"
        },
        {
            "scenario": "A class compares two habitats after a dry summer. One habitat has fewer flowering plants, and students record a decrease in pollinator visits.",
            "measure": "number of flowering plants and pollinator visits",
            "variable": "water availability during the summer",
            "control": "same observation method and time of day",
            "claim": "Resource availability can affect populations in an ecosystem.",
            "model": "a cause-and-effect diagram linking rainfall, flowers, and pollinators"
        }
    ],
    8: [
        {
            "scenario": "Students examine rock layers on two sides of a valley. Several layers contain the same fossils, but one side is shifted upward along a fault.",
            "measure": "fossil types and relative positions of rock layers",
            "variable": "rock layer location on each side of the fault",
            "control": "same fossil identification method",
            "claim": "Rock layers can provide evidence of past geologic movement.",
            "model": "a cross-section diagram of matching layers across the fault"
        },
        {
            "scenario": "A stream table investigation shows that faster water carries larger sediment and changes the shape of a channel more quickly.",
            "measure": "water speed, sediment size, and channel shape",
            "variable": "water flow speed",
            "control": "same sediment mixture and stream table slope",
            "claim": "Water flow can change Earth's surface through erosion and deposition.",
            "model": "a before-and-after map of the stream channel"
        }
    ],
    9: [
        {
            "scenario": "Biology students place aquatic plants under lights of different brightness and count oxygen bubbles released each minute.",
            "measure": "oxygen bubbles released per minute",
            "variable": "light brightness",
            "control": "same plant species, water volume, and time interval",
            "claim": "Light availability affects the rate of photosynthesis.",
            "model": "a graph of light brightness and oxygen bubble rate"
        },
        {
            "scenario": "Students model matter cycling by tracing carbon from carbon dioxide into glucose during photosynthesis and then into animal cells after feeding.",
            "measure": "movement of carbon through molecules and organisms",
            "variable": "pathway of carbon through the system",
            "control": "same model boundaries and labels",
            "claim": "Matter cycles through living systems as atoms are rearranged.",
            "model": "a flow diagram showing carbon moving through the system"
        }
    ],
    10: [
        {
            "scenario": "Chemistry students study a sealed reaction system. Before the reaction, the total mass is 125.0 g. After the reaction, all products remain sealed inside the container.",
            "measure": "total mass before and after the reaction",
            "variable": "reaction before and after mixing",
            "control": "closed container and same balance",
            "claim": "Mass is conserved because matter does not leave the closed system.",
            "model": "a particle diagram showing atoms rearranged into new molecules"
        },
        {
            "scenario": "Physics students test carts with different masses pushed by the same spring launcher. They measure acceleration for each cart.",
            "measure": "cart mass and acceleration",
            "variable": "mass of the cart",
            "control": "same launcher compression and track",
            "claim": "Greater mass results in less acceleration when the force is the same.",
            "model": "a graph of cart mass versus acceleration"
        }
    ]
}


def science_question(grade, number):
    standard, domain, skill = SCIENCE_BLUEPRINT[grade]
    item_id = f"S{grade}Q{number}"
    variant = (number - 1) % 6
    scenario_data = SCIENCE_SCENARIOS[grade][((number - 1) // 6) % len(SCIENCE_SCENARIOS[grade])]
    scenario_text = scenario_data["scenario"]
    scenario = f"In Grade {grade} science, {scenario_text[0].lower()}{scenario_text[1:]}"

    templates = [
        (
            "Which variable is being tested or compared?",
            scenario_data["variable"],
            [scenario_data["control"], "the students' favorite result", "the title of the investigation"],
            "The tested variable is the factor intentionally changed or compared.",
            "experimental_design"
        ),
        (
            "Select two pieces of evidence that would best support the claim.",
            [scenario_data["measure"], scenario_data["model"]],
            ["the color of the notebook", "the order of names on the lab sheet"],
            "Relevant evidence includes measured data and a model or representation connected to the claim.",
            "multiple_select"
        ),
        (
            "Why is the controlled condition important?",
            f"It keeps {scenario_data['control']} consistent so the comparison is fair.",
            ["It changes every factor at the same time.", "It removes the need to collect data.", "It guarantees the claim is correct."],
            "Controlled conditions make it easier to connect results to the tested variable.",
            "experimental_design"
        ),
        (
            "Which model would best communicate the investigation results?",
            scenario_data["model"],
            ["a list of unrelated vocabulary words", "a drawing with no labels", "a lunch menu from the same day"],
            "The best model directly represents the variables or data from the investigation.",
            "modeling"
        ),
        (
            "Which claim is best supported by the investigation?",
            scenario_data["claim"],
            ["The investigation has no variables.", "The results should be chosen before data are collected.", "Only opinions can explain the pattern."],
            "The claim must match the scenario and the type of evidence collected.",
            "claim_evidence_reasoning"
        ),
        (
            "What should students do before drawing a final conclusion?",
            "repeat the investigation or collect more data",
            ["change all variables at once", "ignore measurements that are inconvenient", "choose the answer that sounds easiest"],
            "Repeated trials and more data improve reliability.",
            "scientific_practice"
        )
    ]

    prompt, correct, distractors, explanation, item_type = templates[variant]
    question = f"{scenario} {prompt}"
    correct_choices = correct if isinstance(correct, list) else [correct]
    return make_question(item_id, grade, "science", question, [*correct_choices, *distractors], correct, standard, domain, skill, explanation, item_type)


GENERATORS = {
    "math": math_question,
    "ela": ela_question,
    "science": science_question
}


def build_questions():
    all_questions = []
    by_grade = {}

    for grade in GRADES:
        grade_questions = []
        for subject in SUBJECTS:
            for number in range(1, QUESTIONS_PER_SUBJECT + 1):
                question = GENERATORS[subject](grade, number)
                grade_questions.append(question)
                all_questions.append(question)
        by_grade[grade] = grade_questions

    return all_questions, by_grade


def validate(questions):
    ids = set()
    for question in questions:
        assert question["id"] not in ids, f"Duplicate id: {question['id']}"
        ids.add(question["id"])
        assert question["subject"] in SUBJECTS, f"Invalid subject in {question['id']}"
        expected = question.get("correctAnswers", [question["correctAnswer"]])
        assert all(answer in question["choices"] for answer in expected), f"Invalid correctAnswer in {question['id']}"
        assert len(question["choices"]) == 4, f"Expected 4 choices in {question['id']}"
        assert len(set(question["choices"])) == 4, f"Duplicate choices in {question['id']}"
        assert question.get("standard"), f"Missing standard in {question['id']}"
        assert question.get("explanation"), f"Missing explanation in {question['id']}"


def write_outputs(all_questions, by_grade):
    DATA_DIR.mkdir(exist_ok=True)
    SRC_OUTPUT.write_text(json.dumps(all_questions, indent=2) + "\n", encoding="utf-8")

    for grade, grade_questions in by_grade.items():
        output_path = DATA_DIR / f"grade-{grade}.json"
        output_path.write_text(json.dumps(grade_questions, indent=2) + "\n", encoding="utf-8")


def main():
    all_questions, by_grade = build_questions()
    validate(all_questions)
    write_outputs(all_questions, by_grade)

    print(f"Generated {len(all_questions)} questions successfully.")
    print(f"Combined output: {SRC_OUTPUT}")
    print(f"Grade files: {DATA_DIR}/grade-*.json")
    print("\nSample question:")
    print(json.dumps(all_questions[0], indent=2))


if __name__ == "__main__":
    main()

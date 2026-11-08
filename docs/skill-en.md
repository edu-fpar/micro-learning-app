# MicroLearn skill: format a course for the interactive slideshow

> **Are you an AI and were you given the address of this page?** It contains your instructions.
> Read all of it, then turn the course provided by the teacher into **a single Markdown document**
> that follows the syntax below exactly. The file will be pasted into *MicroLearn Studio*,
> which turns it into an interactive slideshow (quizzes, flip cards, timelines, character dialogues…).

---

## 1. Your mission

1. **Read the content provided** (text, outline, notes, copied PDF, etc.). Do not lose any important information and do not invent any facts.
2. **Split it into short slides**: one idea per slide, 40 to 80 words of text at most. A module usually has 8 to 20 slides.
3. **For each slide, choose the most engaging format** (see § 4). Vary the formats: avoid more than two "Content" slides in a row.
4. **Add interactivity**: at least one quiz every 4 to 6 slides, cards for vocabulary, a timeline for dates, a dialogue to introduce a situation.
5. **Let characters speak** (roles `mentor` and `peer` by default) in dialogues, tips and quizzes.
6. **Return your answer** in the format described in § 7.

Write the course in the requested language (by default, the language of the content provided) and set it in `lang`. The examples on this page are in English, but the syntax is identical in French: only the texts change; format, role and expression identifiers always stay in English/lowercase.

If the teacher gives instructions (duration, audience, tone, number of slides, preferred formats), they take precedence over the recommendations on this page. Never change the **syntax**.

---

## 2. Overall file structure

The file starts with a **YAML header** between two `---` lines, followed by the slides, **separated by a line containing only `---`**.

```markdown
---
title: "Module title"
subtitle: "Micro-learning · 10 minutes"
description: "One sentence that makes people want to take the module."
duration: 10 min
author: "Teacher's name"
lang: en
theme: violet
characters:
  mentor: "The Guide"
  peer: "The Colleague"
---

<!-- slide: format-title -->
### First title
Text of the first slide.

---

<!-- slide: format-content -->
### Second slide
Text…
```

### Header fields

| Field | Required | Purpose |
|---|---|---|
| `title` | yes | Module title (in quotes if it contains `:` or `'`). |
| `subtitle` | no | Small text above the title on the welcome screen. |
| `description` | recommended | One-sentence introduction on the welcome screen. |
| `duration` | recommended | Estimated duration, e.g. `10 min`. |
| `author` | no | Author. |
| `lang` | **yes** | Course language: `en` or `fr` (more languages to come). It translates the slideshow buttons and instructions (Next, Check, Try again…) and selects the read-aloud voices. **Always set the language you write the course in.** |
| `theme` | no | Colours: `violet` (default), `ocean`, `sunset`, `forest`, `night`. |
| `characters` | recommended | Character **roles** and their displayed label (see § 5). |
| `audio` | no | `off` to disable read-aloud for the whole module. |
| `audio-min` | no | Length (in characters) from which a text gets a listen icon. Default: `120`. |

### Mandatory rules

- A `---` line on its own **always separates two slides**. **Never** use `---` as a horizontal rule inside a slide.
- Each slide starts with the comment `<!-- slide: format-xxx -->` (see § 4), optionally followed by other `<!-- key: value -->` comments.
- Each slide has **exactly one main heading**, at level `###`. `####` subheadings are only used by the Tabs format.
- `<!-- … -->` comments are not displayed: they are settings.
- Everything else is standard Markdown: **bold**, *italic*, lists, links, tables, `code`.
- Do **not invent any image path**. Only use an image (`![alt text](path)`) if the teacher gives you its path or URL; otherwise choose a format that does not need one. Always provide a descriptive alt text.

---

## 3. Slide settings (comments)

| Comment | Effect |
|---|---|
| `<!-- slide: format-quiz -->` | Slide format (required). |
| `<!-- character-role: mentor -->` | Character presenting the slide (dialogue, tip, quiz, cover). |
| `<!-- character-expression: happy -->` | Character expression. |
| `<!-- eyebrow: Chapter 2 -->` | Small label above the title (Cover format). |
| `<!-- button: Start -->` | Button text (Cover format). |
| `<!-- badge: Tip -->` | Badge text (Tip format). |
| `<!-- audio: all -->` | Listen icon on every text of the slide, even short ones. |
| `<!-- audio: off -->` | No read-aloud on this slide (e.g. when hearing the text would spoil the exercise). |

**Available expressions**: `neutral`, `happy`, `encouraging`, `thinking`, `surprised`, `concerned`.

---

## 4. Slide formats

### `format-title` — Cover / chapter opening
Large title, hook, character or image, start button. Use it for the **first slide** and to open each major part.

```markdown
<!-- slide: format-title -->
<!-- character-role: mentor -->
<!-- character-expression: happy -->
<!-- eyebrow: Module 1 -->
### Welcome to the world of photosynthesis
In 10 minutes, discover how plants make their energy.
```

### `format-content` — Content
Text, lists, tables. An image on its own line is displayed next to the text.

```markdown
<!-- slide: format-content -->
### The ingredients of photosynthesis
A plant needs three things:

- **light** from the sun
- **water** drawn up by the roots
- **carbon dioxide** from the air
```

### `format-dialogue` — Character dialogue
Each `>` quote is a line, shown one at a time. To change speaker, put a `character-role` comment before the line, **or** start the line with `@role:` or `@role(expression):`.

```markdown
<!-- slide: format-dialogue -->
<!-- character-role: peer -->
<!-- character-expression: thinking -->
### A starting question
> Say, why are leaves green?

> @mentor(happy): Because of chlorophyll! It is what captures the light.

> @peer(surprised): So it is the plant's solar panel!
```

Ideal for: introducing a situation, raising a problem, closing the module (a single line is enough).

### `format-conseil` — Character tip
A "tip" box with the character shown large. A `>` quote inside is highlighted.

```markdown
<!-- slide: format-conseil -->
<!-- character-role: mentor -->
<!-- character-expression: encouraging -->
<!-- badge: Memory trick -->
### Remember the equation
Think "**CO₂ + water + light → sugar + O₂**".

> The plant eats light and breathes in what we breathe out!
```

### `format-quiz` — Quiz
- `- [x]` = correct answer, `- [ ]` = wrong answer.
- **Several `[x]`** = multiple-answer quiz (Check button).
- After an answer, add ` :: explanation` for tailored feedback (recommended for wrong answers).
- A `>` quote at the end = general explanation shown after answering.
- The character reacts automatically (happy / concerned).
- 3 to 5 options, a single question per slide.

```markdown
<!-- slide: format-quiz -->
<!-- character-role: mentor -->
<!-- character-expression: thinking -->
### Which gas does the plant release?
- [ ] Carbon dioxide :: No, that is the one it absorbs.
- [x] Oxygen :: Exactly, a "waste product" that is precious to us.
- [ ] Nitrogen
- [ ] Water vapour :: It releases some too, but it is not the product of photosynthesis.

> Photosynthesis produces sugar and releases oxygen.
```

### `format-flashcards` — Flip cards
Vocabulary, definitions, key notions. Syntax: `- **Term** :: Definition`. 3 to 8 cards.

```markdown
<!-- slide: format-flashcards -->
### Key vocabulary
Flip each card to discover its definition.

- **Chlorophyll** :: Green pigment that captures light.
- **Stoma** :: Small opening in the leaf through which gases enter and leave.
- **Glucose** :: Sugar made by the plant, its source of energy.
```

### `format-timeline` — Timeline
Dates, steps of a process, an ordered procedure. Syntax: `- **Marker** :: Description`. 3 to 7 steps.

```markdown
<!-- slide: format-timeline -->
### The steps of photosynthesis
- **1. Capture** :: Chlorophyll absorbs light.
- **2. Uptake** :: Roots draw water, stomata take in CO₂.
- **3. Transformation** :: Light energy makes glucose.
- **4. Release** :: Oxygen is released into the air.
```

### `format-tabs` — Tabs (accordion on mobile)
Several facets of one notion. Each `####` subheading creates a tab. 2 to 6 tabs.

```markdown
<!-- slide: format-tabs -->
### Where does photosynthesis happen?
#### Leaves
They concentrate chlorophyll and capture as much light as possible.

#### Green stems
Some plants, such as cacti, carry out photosynthesis in their stems.

#### Algae
They carry out photosynthesis in water and produce a large share of the Earth's oxygen.
```

### `format-hotspots` — Interactive image
**Only if an image is provided.** Clickable points on the image. Syntax: `- X,Y :: **Title** :: Text`, where X and Y are percentages (0 to 100) from the top-left corner. If you do not know the image, spread the points evenly and tell the teacher the coordinates will need adjusting.

```markdown
<!-- slide: format-hotspots -->
### Anatomy of a leaf
Click the points to explore the leaf.

![Cross-section diagram of a leaf](images/leaf.png)

- 20,30 :: **Epidermis** :: Transparent protective layer.
- 50,55 :: **Chloroplasts** :: Where photosynthesis takes place.
- 75,85 :: **Stoma** :: Opening for gas exchange.
```

---

## 5. Characters

- In the header, `characters` declares **roles** (short lowercase identifier → displayed label).
- Learners choose the appearance of each role themselves at launch, from a diverse set (ages, genders, origins, disabilities). **So never describe the physical appearance** of the characters in the text.
- Every role used in a slide **must be declared** in the header.
- Two roles are usually enough: `mentor` (the person who guides) and `peer` (a colleague or classmate who asks the learner's questions). You may add more (e.g. `client: "The Client"`).
- Characters address the learner in a warm, simple tone. Keep the same level of formality throughout the module.

---

## 6. Teaching good practices

- **Slide 1**: `format-title`. **Slide 2**: often a `format-dialogue` that sets out the problem or what is at stake.
- **Last slide**: a short dialogue or a tip that sums up and encourages.
- Short, meaningful titles (under 60 characters), ideally phrased as a question or a statement.
- Short sentences, vocabulary suited to the audience, one notion per slide.
- Quizzes check what has just been covered; wrong answers must be plausible and their explanations useful.
- Accessibility: alt text for every image, no information conveyed by colour alone.
- Read-aloud is automatic (long texts, dialogues, opened items). Write sentences that sound good when spoken; avoid obscure abbreviations and symbols that are read awkwardly. Only add `<!-- audio: all -->` when useful.

---

## 7. Format of your answer

1. Return **the whole course in a single Markdown code block** (tagged ```` ```markdown ````), from the first `---` of the header to the last slide, so the teacher can copy it in one click.
2. If a code example must appear *inside* a slide, use tildes `~~~` for that inner block (so as not to break your answer block).
3. **After** the block, add at most 5 lines: number of slides, formats used, points for the teacher to check (images to provide, coordinates to adjust, debatable teaching choices).
4. Put no other text in the code block.

### Check before sending

- [ ] The header starts and ends with `---` and contains `title`, `lang` and `characters`.
- [ ] Each slide starts with `<!-- slide: format-… -->` using a format from § 4.
- [ ] Slides are separated by a `---` line on its own, with no decorative `---`.
- [ ] Each slide has exactly one `###` heading.
- [ ] Each quiz has at least one `[x]` answer.
- [ ] Cards and timeline steps use `**Term** :: text`.
- [ ] All roles used are declared in `characters`.
- [ ] No invented image; every image has alt text.

---

## 8. Sentence for the teacher to use

> "Read the instructions at [address of this page] and format the following course for MicroLearn: …"

*Source of truth for the syntax: MicroLearn Studio. This page describes version 1.0.*

A living reference for writing and maintaining LLM Council personas. Every persona prompt is built from five ordered sections; skip one and the persona collapses into a generic assistant wearing a costume.

- [The anatomy of a persona prompt](#the-anatomy-of-a-persona-prompt)
- [Section 1 — The Lens](#section-1--the-lens)
- [Section 2 — Cognitive style](#section-2--cognitive-style)
- [Section 3 — Voice & vocabulary](#section-3--voice--vocabulary)
- [Section 4 — Named conflicts](#section-4--named-conflicts)
- [Section 5 — The blind spot](#section-5--the-blind-spot)
- [Common failure modes](#common-failure-modes)
- [Quality test: the three-sentence litmus](#quality-test-the-three-sentence-litmus)
- [The template](#the-template)

---

## The anatomy of a persona prompt

Each persona is built from five distinct sections. Every section has a specific cognitive job — skip one and the persona collapses into a generic assistant with a costume on.

1. **The Lens** — The question this persona asks before all others. Sets the entry point for every response.
2. **Cognitive style** — How they reason, not what they conclude. Defines the method, not the answer.
3. **Voice & vocabulary** — The words, rhythms, and sentence patterns that make this persona recognisable in a single line.
4. **Named conflicts** — Which other personas this voice actively resists, and why on principled grounds.
5. **The blind spot** — The failure mode this persona is prone to. Keeps it honest. Prevents caricature.

---

## Section 1 — The Lens

The Lens is a single, pointed question the persona asks instinctively. It is the cognitive entry point — before reasoning, before evidence, before tone. Get this right and the rest follows naturally.

### Format: a concrete, first-person question

Not a value ("I believe in evidence"), not a trait ("I am analytical"). A question the persona would actually ask out loud in the first ten seconds.

### Strong lens examples

- "Has this actually been tried? Did it work? Under what conditions?" → **The Pragmatist** — grounds every claim in empirical track record
- "Who is most affected by this? Who wasn't in the room?" → **The Empath** — centres power and representation immediately
- "What would have to be true for the opposite of this to be correct?" → **The Contrarian** — attacks assumptions, not conclusions

### Weak lens (traits, not questions)

- "You believe in practical solutions."
- "You are analytical and data-driven."
- "You care about people."

A trait tells the model what to _be_. A lens question tells it what to _look for first_. The question is always more powerful.

---

## Section 2 — Cognitive style

This is the most technically important section. It defines the _reasoning method_, not the conclusion. Two personas can reach opposite conclusions from the same data — what distinguishes them is how they got there.

| Persona | Reasoning method |
|---|---|
| The Pragmatist | Cases → tentative generalisation. Never principle → application. |
| The Builder | Systems diagrams — inputs, outputs, feedback loops, bottlenecks. |
| The Scientist | Data → hypothesis. Names study design and its limits before citing findings. |
| The Historian | Historical analogy, noting where the comparison holds and where it breaks. |
| The Contrarian | Inversion. Steelmans the dismissed position. Finds the crack in the load-bearing wall. |
| The Alchemist | Integrative thinking — not compromise, but synthesis that the inputs didn't contain. |

### Give the method, not the conclusion

Bad: "You reach data-driven conclusions."

Good: "You separate correlation from causation carefully. You name the study design and its limitations before citing the finding. You love null results."

---

## Section 3 — Voice & vocabulary

Voice is the most neglected section. Without it, every persona sounds like the same helpful assistant wearing different hats. Vocabulary creates the recognisable signature that makes council debates feel like distinct minds colliding.

### Three elements of voice

- **Sentence rhythm** — long and winding (Historian), or short and percussive (Pragmatist)?
- **Signature phrases** — two or three actual phrases the persona uses. Not "I tend to say X" but the literal string.
- **Domain vocabulary** — the field whose words they reach for when looking for analogies.

### Strong voice sections

> How you speak: Spare and direct. Short sentences. You name the specific action, the specific person, the specific deadline. You use "so" and "therefore" more than "perhaps" or "imagine." You are allergic to passive voice and abstract nouns. → The Pragmatist

> How you speak: Precise and structural. You reach for analogies from engineering, architecture, ecology, and supply chains. You use words like "load," "throughput," "interface," "upstream," "leverage point." → The Builder

### Specify what they avoid, not just what they use

"You are allergic to passive voice and abstract nouns" is more actionable than "you are direct." Negatives constrain the model more precisely than positives.

---

## Section 4 — Named conflicts

Conflicts are what make a council work. Without them, every persona just agrees with a slight change in emphasis. Conflict must be principled — rooted in genuine philosophical disagreement, not personality clash.

### Two kinds of conflict

#### Epistemic conflict

Disagreement about how we should know things. The Scientist vs the Empath: "population-level data" vs "lived experience as primary evidence." Neither is wrong — they have different epistemologies.

#### Values conflict

Agreement on facts, disagreement on what matters. The Builder vs the Naturalist: both understand complex systems — but one trusts designed systems, the other trusts evolved ones.

| Persona A | Challenges | Because |
|---|---|---|
| Pragmatist | Visionary | Confuses the historically untried with the humanly impossible |
| Scientist | Empath | Elevates individual anecdote over population data |
| Anarchist | Diplomat | Harmony that stabilises an unjust equilibrium |
| Historian | Visionary | Believes the future is terra incognita when precedents exist |
| Contrarian | Pragmatist | Mistakes the familiar for the possible |

### Name the other persona explicitly

Vague: "you resist conventional thinking."

Specific: "you challenge the Pragmatist's conflation of 'what has worked' with 'what is possible.'"

The named conflict becomes available to the council system as routing logic.

---

## Section 5 — The blind spot

The blind spot is what separates a character from a caricature. Every real intellectual has a failure mode that is the shadow of their strength. Name it honestly — and instruct the persona to call itself out.

### Well-written blind spots

> The Pragmatist: "You can mistake the familiar for the possible, and the untried for the impossible."

> The Contrarian: "Contrarianism can become its own orthodoxy — a reflex, not a method. Acknowledge when the consensus is right."

> The Naturalist: "Nature is also red in tooth and claw. Flag when 'natural' is doing normative work it hasn't earned."

> The Alchemist: "Not every tension has a synthesis — some contradictions are real. Acknowledge when the honest answer is 'these cannot be reconciled.'"

### The blind spot must be the shadow of the strength

- The Pragmatist's strength is case-based reasoning → blind spot: over-generalises from the familiar.
- The Visionary's strength is first-principles thinking → blind spot: daydreaming without implementation paths.

If the blind spot doesn't derive from the strength, it reads as arbitrary self-criticism.

---

## Common failure modes

- **Trait instead of lens** — "you are analytical" vs "you ask: what's the study design?"
- **Generic vocabulary** — no persona-specific words or phrases; all sound the same
- **Costume conflict** — "you disagree with X" with no principled reason given
- **Missing blind spot** — persona becomes a mouthpiece, not a mind
- **Method-free cognition** — explains what the persona concludes, not how it reasons
- **Adjective overload** — "sharp, brilliant, incisive, rigorous, clear-eyed" (five adjectives = zero information)
- **Symmetric personas** — two voices with the same method but different topics; should be conflicting epistemologies
- **Blind spot not derived from strength** — reads as arbitrary, breaks internal coherence

---

## Quality test: the three-sentence litmus

After writing a prompt, paste the same question to two personas and read only their opening three sentences. If you can't tell which persona wrote which — by vocabulary and reasoning method alone — the prompts aren't differentiated enough.

### The question to test with

"Should we adopt this new technology?" is ideal — vague enough that framing is everything, specific enough to produce real responses.

### What to look for

Different entry questions, different vocabulary, different sentence rhythms, different first move. If both start with "That's a complex question that depends on context…" — rewrite.

---

## The template

```
You are [Name] — [a one-line description of what they embody].

Your lens: You see [what they notice first]. You ask: "[The signature question]" You [one more epistemic habit].

How you think: You reason [the method]. You [a specific cognitive pattern]. You [another — max three total].

How you speak: [Rhythm]. [Sentence length]. You use "[phrase 1]" and "[phrase 2]." You are [one thing you avoid].

What you push back on: [Failure mode in others]. [Named persona]'s [specific thing]. [Named persona]'s [specific thing].

Your blind spot: [The shadow of the strength, 1-2 sentences]. Acknowledge when [the precise moment to self-correct].
```

**The order of the sections matters.** Lens → Cognition → Voice → Conflict → Blind Spot mirrors how a real persona operates: they perceive first, then reason, then speak, then push back, then self-correct. Writing them out of order tends to produce incoherent personas where the voice doesn't match the cognition.

**The blind spot is load-bearing.** In a council setting, if a persona never acknowledges its own limits, the other personas have no ground to stand on when they challenge it. The Scientist without a blind spot just steamrolls the Empath. With one, the Empath has a legitimate opening: "you admitted quantification embeds assumptions — so does your dataset."

**Conflict asymmetry is intentional.** The Pragmatist challenges the Visionary; the Visionary doesn't necessarily list the Pragmatist as a conflict. That's fine. The council's drama comes from some conflicts being mutual and some being one-directional — that creates natural alliances and surprising coalitions.

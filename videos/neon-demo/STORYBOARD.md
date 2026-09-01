---
format: 1920x1080
duration: 75s
message: "Neon combines customer memory with explainable marketplace fit, then carries the choice into a safe booking"
arc: "Demo Loop: returning-customer ask → remembered relationship → provider evidence → different winners → newcomer tradeoff → booking proof"
audience: WebMCP Challenge judges
mode: autonomous
music: none
---

## Video direction

Use Neon's cream, ink, lime, lavender, and coral as flat editorial blocks with square borders, large display type, and one hard-offset feature block at most. Reveal each fact on its future narration cue with smooth long-tail motion. Frames 4 and 5 deliberately hold their rankings and newcomer tradeoff. No gradients, blurred shadows, fake browser chrome, generic AI glows, breathing cards, screensaver motion, or front-loaded slideshow entrances. Keep important content above the bottom 17% even though the cut is canonically silent.

## Frame 1 — Do not make returning customers start over

- status: animated
- src: compositions/frames/01-returning-hook.html
- duration: 8s
- transition_in: cut
- scene: A natural request about the third and lunchtime resolves into remembered booking context.
- voiceover: "A returning customer should not have to explain everything again. They should be able to ask for their usual haircut on the third, around lunch."
- type: hook
- persuasion: Familiar pain
- beat: memory removes repetitive research
- asset_candidates: none — intentionally typography-only
- blueprint: prompt-type-submit-generate (Adapt)
- focal: typography
- roles: typography = focal
- sfx: none

Adapt: keep the typed natural-language ask, but let remembered context appear as the answer instead of generic generated content.

Scene 1 (0.0–3.2s): a prompt types "My usual haircut on the 3rd around lunch" with a live caret (`discrete-text-sequence`, `context-sensitive-cursor`) on a sparse cream field.
Scene 2 (3.2–6.2s): USUAL, 3RD, and LUNCH extract into three bordered intent chips one by one.
Scene 3 (6.2–8.0s): the chips collapse into NEON REMEMBERS THE RELATIONSHIP, held in a lime marker block.

## Frame 2 — History becomes a useful shortcut

- status: animated
- src: compositions/frames/02-history-shortcut.html
- duration: 12s
- transition_in: cut
- scene: Alex's four visits resolve to Marco, the Signature haircut, Spanish preference, and two lunch slots on September 3.
- voiceover: "Neon reads Alex's relationship history: four visits, Marco Ruiz, the Signature haircut, Spanish when available, and a preference for lunchtime."
- type: feature_showcase
- persuasion: Existing-customer convenience
- beat: vague request becomes exact rebooking options
- asset_candidates: assets/fictional-provider-marco-ruiz.png — fictional provider Marco Ruiz
- blueprint: agent-progress-theater (Adapt)
- focal: assets/fictional-provider-marco-ruiz.png
- roles: assets/fictional-provider-marco-ruiz.png = cutout
- sfx: none

Adapt: keep the agent-working checklist and resolve it into two real slots with the familiar provider.

Scene 1 (0.0–3.5s): Alex's history ledger enters left with 4 VISITS and LAST VISIT · AUG 6; Marco's portrait arrives right only after the relationship is established.
Scene 2 (3.5–8.5s): MARCO RUIZ, SIGNATURE HAIRCUT, and SPANISH check off sequentially; the customer's note about lunch appears last.
Scene 3 (8.5–12.0s): SEPT 3 expands into 11:30 AM and 12:30 PM option cards; REQUIRES CUSTOMER APPROVAL remains visible and the result holds.

## Frame 3 — Discovery uses more than popularity

- status: animated
- src: compositions/frames/03-provider-evidence.html
- duration: 12s
- transition_in: cut
- scene: Six fictional Tampa providers assemble with specialties, review themes, coordinates, pricing, language, accessibility, availability, and promotions.
- voiceover: "When someone wants a change, Neon compares six realistic fictional profiles across specialty, review themes, price, proximity, language, accessibility, availability, and promotions."
- type: feature_showcase
- persuasion: Data depth
- beat: provider cards become decision evidence
- asset_candidates: assets/fictional-provider-marco-ruiz.png — fictional provider Marco Ruiz; assets/fictional-provider-nia-brooks.png — fictional provider Nia Brooks; assets/fictional-provider-mei-chen.png — fictional provider Mei Chen; assets/fictional-provider-sofa-alvarez.png — fictional provider Sofía Alvarez; assets/fictional-provider-darius-cole.png — fictional provider Darius Cole; assets/fictional-provider-amaya-patel.png — fictional provider Amaya Patel
- blueprint: grid-card-assemble (Adapt)
- focal: assets/fictional-provider-amaya-patel.png
- roles: assets/fictional-provider-marco-ruiz.png = supporting; assets/fictional-provider-nia-brooks.png = supporting; assets/fictional-provider-mei-chen.png = supporting; assets/fictional-provider-sofa-alvarez.png = supporting; assets/fictional-provider-darius-cole.png = supporting; assets/fictional-provider-amaya-patel.png = cutout
- sfx: none

Adapt: keep the self-assembling evidence grid, making Amaya the featured newcomer while every profile receives a distinct factual label.

Scene 1 (0.0–3.0s): six portrait tiles expand from center (`center-outward-expansion`) into a two-row grid.
Scene 2 (3.0–8.5s): SPECIALTY, REVIEWS, PRICE, DISTANCE, LANGUAGE, and AVAILABILITY populate across separate tiles one cue at a time.
Scene 3 (8.5–12.0s): Amaya receives NEW PROVIDER and $59 LAUNCH OFFER while the other five retain review-count evidence; the complete market holds.

## Frame 4 — One pool, three winners

- status: animated
- src: compositions/frames/04-three-winners.html
- duration: 16s
- transition_in: cut
- scene: The same six providers are ranked three times, with Marco at 93%, Sofía at 96%, and Mei at 79% for different customers.
- voiceover: "The same six providers produce different winners. Marco is a 93 percent fit for Alex. Sofía is 96 percent for Jamie. Mei is 79 percent for Taylor."
- type: benefit_highlight
- persuasion: Personalization proof
- beat: different people visibly change the answer
- asset_candidates: assets/fictional-provider-marco-ruiz.png — fictional provider Marco Ruiz; assets/fictional-provider-sofa-alvarez.png — fictional provider Sofía Alvarez; assets/fictional-provider-mei-chen.png — fictional provider Mei Chen
- blueprint: comparison-split (Adapt)
- focal: assets/fictional-provider-sofa-alvarez.png
- roles: assets/fictional-provider-marco-ruiz.png = cutout; assets/fictional-provider-sofa-alvarez.png = cutout; assets/fictional-provider-mei-chen.png = cutout
- sfx: none

Adapt: expand the mirrored comparison into a three-panel ranking ledger, keeping each score as the signature reveal.

Scene 1 (0.0–4.8s): Alex's panel enters left; Marco, 93%, SPANISH, VALUE, and 1.1 MI reveal sequentially with a progress fill (`stat-bars-and-fills`).
Scene 2 (4.8–10.0s): Jamie's panel enters center; Sofía, 96%, SENSITIVE SKIN, TRUST, and 0.7 MI reveal.
Scene 3 (10.0–14.0s): Taylor's panel enters right; Mei, 79%, QUIET STUDIO, METICULOUS, and 0.7 MI reveal.
Scene 4 (14.0–16.0s): all three panels hold under SAME MARKET. DIFFERENT ANSWER.

## Frame 5 — A newcomer can compete honestly

- status: animated
- src: compositions/frames/05-new-provider-tradeoff.html
- duration: 12s
- transition_in: cut
- scene: Gulf Glow Med Spa competes through price and availability while its 11-review history remains visible.
- voiceover: "A new provider can compete on price, fit, and open availability without hiding the tradeoff. Gulf Glow has a strong launch offer, but only eleven reviews."
- type: benefit_highlight
- persuasion: Two-sided marketplace value
- beat: fair discovery without paid placement
- asset_candidates: assets/fictional-provider-amaya-patel.png — fictional provider Amaya Patel; assets/fictional-provider-sofa-alvarez.png — fictional provider Sofía Alvarez
- blueprint: comparison-split (Reproduce)
- focal: assets/fictional-provider-amaya-patel.png
- roles: assets/fictional-provider-amaya-patel.png = cutout; assets/fictional-provider-sofa-alvarez.png = supporting
- sfx: none

Scene 1 (0.0–3.8s): Amaya enters left with $59 OFFER and OPEN TODAY as large strengths; her portrait dominates the 60/40 split.
Scene 2 (3.8–8.8s): an established-provider card enters right with 241 REVIEWS; Amaya's 11 REVIEWS appears at equal visual weight in coral.
Scene 3 (8.8–12.0s): both settle under NO PAID PLACEMENT and SHOW THE TRADEOFF, then hold completely still.

## Frame 6 — Memory and fit still end with approval

- status: animated
- src: compositions/frames/06-booking-proof.html
- duration: 15s
- transition_in: cut
- scene: Fourteen native tools lead from history or discovery into customer approval, confirmation, and the same appointment on the provider calendar.
- voiceover: "Fourteen native WebMCP tools carry memory or discovery into a safe workflow. The customer approves the exact details, and the same confirmed appointment appears on the provider calendar."
- type: branding
- persuasion: End-to-end proof
- beat: intelligence becomes safe action
- asset_candidates: assets/providers-section-page-width.png — captured personalized provider results section; assets/fictional-provider-marco-ruiz.png — fictional provider Marco Ruiz
- blueprint: agent-progress-theater (Adapt)
- focal: assets/providers-section-page-width.png
- roles: assets/providers-section-page-width.png = background; assets/fictional-provider-marco-ruiz.png = supporting
- sfx: none

Adapt: keep the agent-progress checklist and confirmation payoff, ending by crossing from customer approval into the provider calendar.

Scene 1 (0.0–4.0s): 14 NATIVE TOOLS counts up (`counting-dynamic-scale`) over the captured result surface; HISTORY, RANK, COMPARE, and AVAILABILITY check off.
Scene 2 (4.0–8.5s): an exact review ledger appears; an early request resolves to APPROVAL REQUIRED before CUSTOMER APPROVED arrives.
Scene 3 (8.5–12.0s): CONFIRMED and NEON-MR-0903-1130 appear, then a horizontal cut reveals the provider calendar with ALEX MORGAN · 11:30 AM.
Scene 4 (12.0–15.0s): a lime closing plate reads PEOPLE CHOOSE. AGENTS HANDLE THE WORK. The public URL appears last and holds.

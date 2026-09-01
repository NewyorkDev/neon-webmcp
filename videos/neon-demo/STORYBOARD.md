---
format: 1920x1080
duration: 60s
message: "Authenticate once, set the limits, ask AI to rebook, and prove the provider received it"
arc: "Demo Loop: authenticate → policy → exception → standing permission → two-sided receipt"
audience: WebMCP Challenge judges
mode: autonomous
music: none
---

## Video direction

The real 1920x1080 browser recording is the source of truth and fills at least 80 percent of the cut. Use the Booksy Reloaded black, white, and acid-lime palette. Product footage stays sharp, level, and readable with no fake browser chrome. Motion uses smooth long-tail settles, short label reveals, and deliberate holds. Browser actions already provide the main movement, so overlays never compete with the interface. Keep the bottom 17 percent clear for future narration captions. Never use generic AI glows, bouncing cards, floating decoration, ethnicity-based labels, a slideshow that front-loads and freezes, or screensaver motion.

## Frame 1 — Ask instead of reopening the app

- status: animated
- src: compositions/frames/01-ask-instead.html
- duration: 7s
- transition_in: cut
- scene: Booksy Reloaded opens on the real marketplace while one outcome-focused title lands.
- voiceover: "I already use a booking marketplace. What if I could just ask AI to rebook my usual appointment?"
- type: hook
- persuasion: Friction reduction
- beat: recognition + curiosity
- blueprint: video-text-pivot (Adapt)
- asset_candidates: assets/booksy-reloaded-native-workflow.mp4 — verified Chrome recording of the full native WebMCP workflow; assets/booksy-reloaded-logo.png — supplied Booksy Reloaded identity
- focal: assets/booksy-reloaded-native-workflow.mp4
- roles: browser recording = background; Booksy Reloaded logo = supporting
- sfx: none

Adapt: keep the real product video as the proof and pivot briefly to the human outcome, not a fabricated metric.
Scene 1 (0.0–2.4s): the supplied logo and BOOKSY RELOADED enter on a black title strip while the real homepage is already visible beneath, full-width and level.
Scene 2 (2.4–5.6s): ASK AI TO REBOOK replaces the strip copy as the real recording reaches the customer login, using one smooth scale-swap while the footage remains dominant.
Scene 3 (5.6–7.0s): the label clears and the real customer account holds cleanly for the cut.

narrativeRole: State the familiar customer pain and the simpler outcome before technical evidence.
keyMessage: Existing customers should be able to ask instead of starting over.

## Frame 2 — The account carries the customer's policy

- status: animated
- src: compositions/frames/02-account-memory.html
- duration: 9s
- transition_in: crossfade
- scene: The real site-owned login and account show Marco, four visits, pay in person, and the configurable $50 booking ceiling.
- voiceover: "The customer signs in on the site. Their account sets the usual provider, service, payment timing, and maximum automatic price."
- type: product_intro
- persuasion: Show-don't-tell proof
- beat: relief + recognition
- blueprint: device-surface-showcase (Adapt)
- asset_candidates: assets/booksy-reloaded-native-workflow.mp4 — verified Chrome recording of the full native WebMCP workflow
- focal: assets/booksy-reloaded-native-workflow.mp4
- roles: browser recording = background
- sfx: none

Adapt: keep the held real browser surface and use sparse callouts instead of reconstructed device screens.
Scene 1 (0.0–3.2s): the source window plays the prefilled customer login at full width; CUSTOMER ACCOUNT appears in the upper-left safe zone.
Scene 2 (3.2–6.4s): the account dashboard arrives; MARCO RUIZ and 4 COMPLETED VISITS receive thin acid-lime outline callouts without covering the interface.
Scene 3 (6.4–9.0s): ASK AI TO REBOOK appears beside the real account action, then all callouts clear and the page holds.

narrativeRole: Prove the shortcut comes from explicit marketplace history, not invisible model memory.
keyMessage: The account already has the context needed for a useful request.

## Frame 3 — WebMCP returns a useful exception

- status: animated
- src: compositions/frames/03-native-trace.html
- duration: 17s
- transition_in: push-slide LEFT
- scene: Native tool calls inspect the scoped session and discover that Marco is unavailable, then return structured choices beside the shared interface.
- voiceover: "The AI calls the page's native tools. Marco is unavailable in the requested window, so WebMCP returns a structured choice instead of silently changing the booking."
- type: feature_showcase
- persuasion: Technical evidence
- beat: clarity + trust
- blueprint: agent-progress-theater (Adapt)
- asset_candidates: assets/booksy-reloaded-native-workflow.mp4 — verified Chrome recording of the full native WebMCP workflow
- focal: assets/booksy-reloaded-native-workflow.mp4
- roles: browser recording = background
- sfx: none

Adapt: the recording already contains the working theater, so keep its real trace panel as the signature receipt and add only step labels.
Scene 1 (0.0–5.2s): the real profile and availability play full-frame; GET CUSTOMER HISTORY then FIND REBOOKING OPTIONS reveal sequentially in a narrow upper-left rail.
Scene 2 (5.2–10.8s): the live WebMCP trace opens in the recording; AGENT REQUEST → WEBMCP TOOL → SHARED UI STATE is underlined as real JSON input and output remain readable.
Scene 3 (10.8–14.2s): SELECT APPOINTMENT and PREPARE BOOKING REVIEW check off as the interface reaches the exact review.
Scene 4 (14.2–17.0s): the preapproval request is shown blocked; APPROVAL REQUIRED lands in acid lime and holds.

narrativeRole: Answer the judge's main technical question with visible native tool traffic and shared state.
keyMessage: This is structured WebMCP execution, not hidden click automation.

## Frame 4 — Exact matches use standing permission

- status: animated
- src: compositions/frames/04-approval-confirmation.html
- duration: 12s
- transition_in: crossfade
- scene: The customer chooses another day with the same provider. The $46 pay-in-person exact match is evaluated against the visible $50 policy and booked without another interruption.
- voiceover: "The customer chooses another day. It is still Marco, the usual service, pay in person, and $46, so the standing policy permits the booking without another pointless confirmation."
- type: benefit_highlight
- persuasion: Risk reversal
- beat: control + confidence
- blueprint: cursor-ui-demo (Adapt)
- asset_candidates: assets/booksy-reloaded-native-workflow.mp4 — verified Chrome recording of the full native WebMCP workflow
- focal: assets/booksy-reloaded-native-workflow.mp4
- roles: browser recording = background
- sfx: none

Adapt: use the real browser interaction and emphasize the two state changes, blocked then approved, without adding a fake cursor.
Scene 1 (0.0–3.4s): the exact review is held full-frame with NOTHING BOOKS YET in the upper-right safe zone.
Scene 2 (3.4–7.0s): the real approval click changes the review; HUMAN APPROVED replaces the warning with a smooth scale-swap.
Scene 3 (7.0–9.4s): the final native booking call completes and the real BR-MR-0903-1130 confirmation appears.
Scene 4 (9.4–12.0s): the customer account fills the frame with YOUR BOOKING IS CONFIRMED and the confirmation-preview receipt visible.

narrativeRole: Prove that WebMCP accelerates the work without taking the consequential decision away from the customer.
keyMessage: The human remains the approval boundary.

## Frame 5 — The provider receives the same appointment

- status: animated
- src: compositions/frames/05-provider-receipt.html
- duration: 9s
- transition_in: push-slide LEFT
- scene: Marco's real provider workspace shows the same customer, service, reference, price, and time on the calendar and activity feed.
- voiceover: "The same appointment reaches Marco's provider workspace immediately, with one reference shared across the customer and business sides."
- type: feature_showcase
- persuasion: End-to-end proof
- beat: completion + credibility
- blueprint: device-surface-showcase (Adapt)
- asset_candidates: assets/booksy-reloaded-native-workflow.mp4 — verified Chrome recording of the full native WebMCP workflow
- focal: assets/booksy-reloaded-native-workflow.mp4
- roles: browser recording = background
- sfx: none

Adapt: keep the recorded provider workspace as the full hero and use one receipt callout rather than cycling reconstructed screens.
Scene 1 (0.0–3.0s): GOOD MORNING, MARCO and CONFIRMED TODAY play in the real provider workspace; PROVIDER SIDE appears in the upper-left.
Scene 2 (3.0–6.4s): the source scrolls to the real calendar; the Alex Morgan appointment and activity feed are outlined together.
Scene 3 (6.4–9.0s): SAME APPOINTMENT. BOTH SIDES. lands above the calendar and holds while the reference remains readable.

narrativeRole: Complete the marketplace loop and prove value for the provider, not only the customer.
keyMessage: The result is shared operational state, not just an AI recommendation.

## Frame 6 — Book at conversation speed

- status: animated
- src: compositions/frames/06-book-at-conversation-speed.html
- duration: 6s
- transition_in: zoom-through
- scene: The provider calendar recedes into a clean Booksy Reloaded end card with the verified proof points and public URL.
- voiceover: "Booksy Reloaded. Fifteen native tools. Smart booking limits. One shared appointment."
- type: branding
- persuasion: Rule of three
- beat: confidence + recall
- blueprint: titlecard-reveal (Adapt)
- asset_candidates: assets/booksy-reloaded-native-workflow.mp4 — verified Chrome recording of the full native WebMCP workflow; assets/booksy-reloaded-logo.png — supplied Booksy Reloaded identity
- focal: assets/booksy-reloaded-logo.png
- roles: browser recording = background; Booksy Reloaded logo = cutout
- sfx: none

Adapt: keep the calm held end-card shape and use the verified calendar as the dimmed evidence field behind the brand lockup.
Scene 1 (0.0–2.2s): the provider calendar dims to black while the supplied logo resolves centered with one restrained opacity reveal.
Scene 2 (2.2–4.4s): 15 NATIVE TOOLS · SMART POLICY · TWO-SIDED RECEIPT reveals as one full-width proof line beneath the logo.
Scene 3 (4.4–6.0s): newyorkdev.github.io/neon-webmcp appears and the complete lockup holds completely still.

narrativeRole: End on the product name, verified difference, and accessible demo URL.
keyMessage: Booksy Reloaded makes booking conversational while keeping the customer in control.

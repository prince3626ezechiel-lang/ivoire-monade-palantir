---
name: morning-operations
description: Run the definitive unified morning planning, calendar, reminder, context-ingest, and command-brief workflow.
version: 2.1.0
author: Thimble
metadata:
  hermes:
    related_skills: [forecast-calibration, recurring-work-detector, person-centered-task-system, google-workspace]
---

# Morning Operations

## When to Use

Canonical name: **Morning Operations**. Treat every phrase the user uses for a morning-oriented skill or workflow—including **Morning Operator**, **Morning Brief**, **Morning Review**, **Morning Operations**, **Morning Operations Skill**, and close variants such as “morning review skill” or “morning brief skill”—as an alias for this one definitive skill. Never create, infer, or operate a competing morning skill.

Use this skill when the user asks for a morning/wake-up planning routine, a daily command brief, a start-of-day check-in, or when a scheduled wake indicator asks Thimble to begin the Morning Operations flow.

This is especially relevant when the user is waking at irregular times, has not slept on a normal schedule, or needs quick scaffolding around multiple active opportunities and admin obligations.

## When NOT to Use

Do not run the full workflow for a single isolated reminder, a request that is explicitly unrelated to daily planning, or an emergency requiring immediate execution rather than an interview. Do not create a parallel morning skill when the user uses a new morning-oriented phrase; treat it as an alias for Morning Operations.

## Core Principle

The Morning Operations is both:

1. a **fast planning interview** that turns an unstructured morning ramble into a realistic day; and
2. the **primary daily ingest point** for learning the user's people, projects, commitments, preferences, household state, and open loops.

The user should be able to ramble naturally about vague things that need attention. Do not make them pre-structure the information. Thimble extracts the tasks, entities, relationships, dependencies, deadlines, and useful durable context.

Keep the conversational surface low-friction and fast. Default target: a 60-second check-in, not a five-minute productivity ceremony. Context capture can happen quietly after or alongside synthesis; do not turn it into extra homework for the user.

## Calendar-First Initialization

Before sending the first Morning Operations message, load the `google-workspace` skill and read the user's primary Google Calendar for the current local calendar day.

1. Resolve the current local date and timezone from the live system; do not assume “morning” means clock-morning.
2. Query from local `00:00:00` through `23:59:59`, including all-day, past, ongoing, and upcoming events. This gives the user a chance to correct stale calendar state as well as plan remaining time.
3. Sort timed events chronologically and distinguish all-day events. Keep the opening compact; include time, title, and only location or context that materially affects scheduling.
4. Lead with the calendar state, then ask one combined intake question:

   > **On your calendar today:** [concise event list]. **What has changed, what else needs to fit around this today, and what is the one thing that cannot slip?**

5. If there are no events:

   > **Your calendar is clear today. What needs to fit into it, and what is the one thing that cannot slip?**

6. If Calendar access fails, say so briefly and continue with the ordinary intake rather than blocking the routine. Never fabricate an empty calendar.
7. If a due forecast review exists, still lead with the calendar snapshot, then run the forecast review before continuing the ordinary planning questions.

### Calendar Reconciliation

Treat the user's first ramble as both planning intake and a proposed calendar-state update. Extract:

- events that happened, moved, were cancelled, or are no longer relevant;
- fixed commitments that must remain untouched;
- new events or work blocks that need to fit around existing commitments;
- stated arrivals at a physical place and time, even when the user does not explicitly call them an “event”;
- durations, deadlines, travel time, preparation time, and context-switch buffers;
- conflicts or impossible overlaps.

### Physical-Location Events and Departure Alerts

Treat any commitment to be at a physical place at a stated time as a schedulable event. Do not create only the destination event and ignore the journey.

For every physical-location event:

1. Resolve the destination and the relevant origin. Use the user's saved home/base location when appropriate, but route from the preceding physical event when that is the real origin.
2. Use an available maps/routing tool to calculate route distance and estimated travel duration. Never fabricate routing data; if routing fails, disclose the failure.
3. Add a default **15-minute traffic/arrival buffer**, unless the user has supplied a different buffer or the travel mode/context clearly warrants more.
4. Work backward from the required arrival time:

   `leave-by time = arrival time - estimated travel duration - arrival buffer`

5. Include the destination event and a separate travel/departure block ending at the destination event's start in the proposed calendar batch. The travel block should record origin, destination, route estimate, buffer, and leave-by time.
6. Also propose a proactive message **five minutes before the travel block begins** telling the user to leave within the next five minutes. The alert must include destination, leave-by time, target arrival time, and concise route/buffer context.
7. Detect and surface overlaps with fixed events. Do not silently assume teleportation between locations.
8. After approval, create and verify both calendar blocks and the departure reminder. Every calendar event created by Hermes defaults to **Amethyst** (`colorId: "3"`) unless the user explicitly requests another mapped color or the event is mandatory/high urgency, in which case use **Tomato** (`colorId: "11"`). Verify `colorId` when reading each event back. If the reminder time has already passed, send an immediate departure warning rather than scheduling a useless past alert.

Reflect the reconciled calendar in the recommended schedule. Batch proposed Google Calendar changes and associated departure alerts into one concise confirmation rather than asking event by event. Calendar writes remain consequential: do not create, delete, or reschedule events until the user explicitly approves the proposed batch. A direct request to schedule a named event and its travel is explicit approval for that operation. After approval, execute the changes and report the actual results.

Do not ask “Any other meeting, deadline, or commitment?” when the live calendar plus the user's opening answer already resolves that question.

## Recurring Work Observation

Load and follow `recurring-work-detector` during task/context ingest.

1. Record only actual or firmly scheduled occurrences in `<notes-root>/Recurring Work Ledger.md`; do not count repeated mentions of one instance.
2. Normalize task families cautiously. Similar labels with materially different inputs, outputs, stakeholders, or judgment demands remain separate.
3. Do not review automation feasibility until a family has **more than seven occurrences in a rolling 14-day window**.
4. After the numeric gate passes, require a `HIGH` feasibility classification under the companion skill. Repetition alone never warrants a suggestion.
5. Suppress physical-presence, caregiving, relationship-essential, highly variable, and high-judgment tasks. Do not offer absurd “automation” for ordinary human obligations.
6. If one candidate passes both gates, add one short **Streamlining Opportunity** near the end of the brief. Name the count, the repeated task, and one concrete skill/script/template/batching mechanism.
7. Never create the proposed skill until the user accepts the suggestion.
8. Surface at most one candidate per Morning Operations session and never repeat a dismissed or already-suggested candidate unless the workflow materially changes.

This observation should be silent almost all the time and must not add recurring interview questions or make the morning routine feel monitored.

## Due Forecast Review Check

Before beginning the ordinary planning interview, check:

`<notes-root>/Forecast Calibration Ledger.md`

for the oldest `OPEN` forecast whose **review-eligible date is today or earlier**.

If one exists:

1. Load and follow the `forecast-calibration` skill.
2. Run that forecast's review before the ordinary Morning Operations questions.
3. Review at most one forecast in a single morning session; leave additional due forecasts queued oldest-first.
4. Preserve the original prediction and reasoning verbatim, append the actual outcome and review, and mark the record `REVIEWED`.
5. After the Forecast Review Brief, continue into the ordinary daily planning flow.
6. If the review was cognitively heavy, shorten the planning interview and produce a lighter day plan.

Do not create a forecast merely because Morning Operations ran. New forecast invitations arise naturally in substantive conversations and must pass the `forecast-calibration` skill's overwhelming-fit gate and strict cadence limits.

## Interview Rules

1. The first substantive Morning Operations message must be the live calendar-first initialization above; do not add a separate preliminary questionnaire.
2. Treat conversational wake replies as consent to continue. **Do not require the exact word “yes.”** Replies like “I’m here,” “awake,” “present,” “okay,” “yeah,” “morning,” or “ugh I’m up” mean the user is awake enough; fetch the calendar and begin the combined intake.
3. Ask what changed on the calendar, what else needs to fit around it today, and what one thing cannot slip.
4. Let the user ramble. Parse the response rather than forcing a checklist format.
5. If the response does not clearly identify the thing or things that absolutely must happen today, explicitly ask: **“What absolutely cannot slip past today?”**
6. For each extra-important item, obtain its **absolute due date/deadline**. If the user gives only a relative or vague deadline and the exact boundary materially affects planning, ask the smallest necessary follow-up.
7. Ask **one short question at a time**.
8. Do **not** give advice until enough of the interview is complete to distinguish hard commitments from optional work.
9. Prefer questions that can be answered with a phrase, short list, or quick choice.
10. Stop asking as soon as there is enough context to make a useful brief and handle deadlines safely.
11. If the user volunteers enough context in one conversational reply, skip redundant questions and synthesize the brief immediately—but do not skip a missing hard-deadline clarification.
12. If the user is exhausted or post-insomnia, bias toward a gentler, lighter plan with fewer priorities.
13. When question 1 produces a sufficiently complete task list, **do not continue interrogating the user**. Identify the one thing that cannot slip, resolve any necessary deadline ambiguity, then synthesize.

## Default Follow-Up Questions

Ask only the questions that remain unanswered:

1. “What absolutely cannot slip past today?”
2. “What is the absolute due date or deadline for that?”
3. “Any other deadline, meeting, or commitment?”
4. “Biggest stressor?”
5. “Anything I can take off your plate?”
6. “One decision blocking progress?”

Do not bundle them all at once unless the user explicitly asks for maximum speed over one-at-a-time interviewing.

## Deadline-Aware Reminder Logic

When an extra-important item has a **specific due time**:

1. Estimate the realistic focused completion time from the available context.
2. Add a **one-hour context-switch buffer**.
3. Calculate:

   `reminder time = due time - estimated completion time - 1 hour`

4. Create a reminder at that calculated time using `cronjob(action='create')`, delivered to Discord/origin as appropriate.
5. Make the reminder self-contained. Include:
   - the task;
   - the absolute due time;
   - the estimated completion time;
   - the one-hour context-switch buffer;
   - the concrete first action;
   - any person/project context needed to act immediately.
6. Tell the user the estimate and scheduled reminder time so the assumption is visible and correctable.

Example:

- Due at 5:00 PM.
- Estimated focused completion time: 2 hours.
- Context-switch buffer: 1 hour.
- Reminder: 2:00 PM.

If the calculated reminder time has already passed, do not schedule a useless past reminder. Flag the item as **start now**, explain the compression, and optionally schedule a nearer progress checkpoint if useful.

If the user provides a date but no specific time, ask for the time only when it materially changes today's plan or reminder scheduling. Do not invent a precise due time and present it as fact.

## Context Ingest and Personal CRM

Treat the Morning Operations as the primary ingest point for new user context. Review the user's entire rambling response and extract:

- people and aliases;
- organizations and projects;
- relationships between people, projects, and the user;
- what someone is waiting on;
- commitments the user made;
- deadlines and dependencies;
- recurring preferences and constraints;
- household/admin state;
- open loops and likely future briefing context.

### Storage rules

1. Use the `person-centered-task-system` skill for people-, company-, call-, meeting-, and commitment-centered context.
2. Update the durable Obsidian state surfaces:
   - `<notes-root>/Person-Centered Task Substrate.md`
   - `<notes-root>/User Context - Current Threads.md`
3. Create or update logical entity/project notes when a person or topic has enough context to deserve its own page. Preserve canonical names, aliases/transcription errors, relationship, current open loops, waiting-on state, and what future briefs should surface.
4. Use persistent `memory` only for compact, stable facts that should be injected into future sessions: durable user preferences, canonical entities, stable relationships, and enduring environment/context facts.
5. Do **not** put temporary task progress, near-term deadlines, completed-work logs, or raw morning dumps into persistent memory. Those belong in Obsidian/current-thread notes and conversation history.
6. Avoid duplicates. Search existing notes/memory before creating a new entity, merge aliases when appropriate, and update an existing section instead of scattering context.
7. Capture without requiring approval for every routine note update unless the inferred identity or relationship is genuinely ambiguous.
8. **Verbally confirm the meaningful information retained or updated.** In natural conversational language, tell the user what Thimble recorded about new people, relationships, projects, commitments, deadlines, preferences, household state, or open loops. Keep this compact and human—not a database changelog—but specific enough that the user can understand and correct the context Hermes will carry across time.
9. Distinguish where useful between stable persistent memory and richer Obsidian/current-thread context. Do not imply that temporary details were placed in injected persistent memory when they were only recorded in the task/context notes.

The goal is to learn rapidly from each brief and build a practical personal CRM—not to hoard undifferentiated text. Store structured context that will improve future reminders, precall briefs, follow-ups, and decisions, while keeping the user conversationally aware of what has been retained.

## Daily Brief Archive

Every completed Morning Operations briefing must be saved as one dated Markdown note. The portable distribution contract is:

`<notes-root>/Morning Operations/YYYY-MM-DD - Distinctive Title.md`

For this installation, `<notes-root>` resolves to `<notes-root>`.

Choose a short, human-readable title that makes the day distinguishable in a folder listing without opening the note. Base it on the most unique cannot-slip outcome, event, project, decision, or circumstance in the briefing—not a generic label such as `Morning Operations Brief`, `Daily Plan`, or `Tasks`. Examples:

- `2026-07-11 - Client Proposal Deadline.md`
- `2026-07-14 - Hermes Workshop at Frontier Tower.md`
- `2026-07-18 - Benefits Enrollment Decision.md`

If intake is missing or the briefing is incomplete, name the specific gap or circumstance, such as `2026-07-11 - Missing Morning Operations Brief Archive Gap.md`.

If the note's distinctive element changes materially while the briefing is being completed, rename the existing dated note rather than creating a second file. Keep exactly one Morning Operations note per local calendar day unless the user explicitly requests separate briefs.

The daily note is the durable record of what the user said needed to happen that day and of the final Morning Command Brief. It must contain:

1. **Intake** — a faithful, concise account of the user's stated tasks, commitments, corrections, deadlines, stressors, and cannot-slip outcome. Preserve important wording and do not replace the user's actual intake with inferred generic tasks.
2. **Calendar snapshot and reconciliation** — the events read from Google Calendar, user-reported changes, conflicts, and open windows used for planning.
3. **Morning Command Brief** — the complete final brief delivered to the user, including priorities, schedule, reminders, approvals, ignored work, and context confirmation.
4. **Actions taken** — reminders, calendar writes, note/entity updates, or autonomous work actually completed, with no invented success claims.
5. **Status** — `COMPLETE` only after the briefing is delivered; use `INCOMPLETE` when intake began but no final brief was produced.

Write or update the note during the same Morning Operations run. If the file already exists, update it rather than creating a duplicate. Preserve earlier intake when resuming an interrupted briefing. Do not mark a note `COMPLETE` until the final brief has actually been delivered.

Before the clean completion line, read the saved note back and verify that it captures the user's stated work and the final brief. The Morning Operations is not complete unless this archive write and verification succeed. If saving fails, disclose that failure before ending rather than implying the day was recorded.

After writing, refresh the QMD index so the briefing can be retrieved later. If QMD refresh fails, preserve the Markdown note, disclose the indexing failure briefly, and do not misrepresent the note as missing.

### Distribution Parity

This installed skill has an assistant-neutral distribution in the **public** repository `https://github.com/cyne-wulf/Hermes-Morning-Operations`. When the user changes core Morning Operations behavior, the work is not complete after patching the installed skill alone. Port the behavior to the public repository, update its documentation, changelog, and validation as appropriate, run local validation, commit and push, confirm GitHub Actions succeeds, and verify the public raw `SKILL.md` contains the change. Keep installation-specific absolute paths out of the distribution contract; use configurable placeholders such as `<notes-root>` there.

See `references/2026-07-11-daily-archive-and-public-parity.md` for the gap that established the archive requirement and the verified publication workflow.

## Thirty-Minute Inactivity Conclusion

Do not leave an initiated Morning Operations interview open indefinitely. Measure inactivity from the assistant's latest unanswered Morning Operations prompt.

1. When the first intake prompt is sent, create a one-shot cron job for **30 minutes later**, attached to the originating session when supported and delivered to the same connected channel.
2. After each user reply that continues the interview, remove the old job and arm a fresh 30-minute one-shot after the next question. Keep exactly one active inactivity job per session.
3. Cancel the job when the ordinary final brief is delivered. The timeout run must inspect session/archive state and emit no duplicate conclusion if the brief is already `COMPLETE`.
4. Give the fresh cron run a self-contained prompt identifying the local date and archive path and directing it to use the originating session context plus the saved `INCOMPLETE` note.
5. After 30 unanswered minutes, deliver the best available final brief using only captured information. Mark unknown deadlines, missing cannot-slip information, and assumptions; do not perform consequential actions still awaiting approval.
6. Include the task-label export, write and verify the completed archive, refresh its configured index, and finish with the canonical completion line without asking another question.
7. If scheduling or same-channel delivery is unavailable, disclose that during the live session rather than claiming the automatic close is armed.

## Output: Morning Command Brief

Before ranking tasks, detect **deadline compression**: travel, appointments, or lost workdays before a deliverable can make today the effective deadline even when the public deadline is later. State one singular “cannot slip” outcome first. Keep errands and household maintenance bounded around it rather than presenting every item as equally urgent.

Produce:

1. **The one thing that cannot slip** — concrete, with its absolute deadline.
2. **Reconciled calendar state** — existing fixed events, user-reported corrections, conflicts, and open windows.
3. **Top 3 priorities** — concrete and realistic.
4. **Recommended schedule** — simple blocks fitted around calendar events and adjusted for wake time, energy, deadlines, estimated completion time, travel, and context-switch buffers.
5. **Proposed or completed calendar changes** — distinguish changes awaiting batch approval from changes actually executed.
6. **Scheduled deadline reminders** — what was scheduled, for when, and the estimate used.
7. **Tasks Thimble can do autonomously or automate** — things the agent can actually take on with tools.
8. **Tasks needing approval** — side effects, messages, purchases, applications, scheduling, or anything requiring user consent.
9. **Streamlining Opportunity** — include only when `recurring-work-detector` verifies at least eight comparable occurrences in 14 days and `HIGH` automation feasibility; otherwise omit the section entirely.
10. **One thing to ignore today** — deliberately remove one distracting/nonessential thread.
11. **Context confirmation** — conversationally summarize the meaningful information retained or updated so the user knows what Hermes will carry forward and can correct it.
12. **Task-label export** — in the final message, include a short fenced Markdown code block containing every still-open task the user mentioned anywhere in the session, including work not selected for today. Put one plain descriptive label per line. Use only a few words per label; no bullets, checkboxes, deadlines, status markers, explanations, or multi-line descriptions. Deduplicate equivalent tasks, preserve distinct tasks, and exclude items explicitly completed or cancelled. This block is intentionally overinclusive for direct paste into a notes system; when uncertain whether an actionable item belongs, include a concise label so the user can prune it later.
13. **Explicit completion line** — after the task-label code block, close with: **“Morning Operations Brief is finished. 🎀”**

## Clean Ending Protocol

The Morning Operations must have an unmistakable endpoint. Once the user has finished dumping, hard deadlines are resolved, reminders and context updates are handled, and the command brief is delivered:

1. State that the Morning Operations Brief is finished.
2. Include the complete overinclusive task-label export in a fenced Markdown code block immediately before the canonical completion line.
3. Do not end with a question, invitation, menu of options, or implied requirement to respond.
4. Do not append “Would you like me to…?”, “Anything else?”, or another interview prompt.
5. Report completed actions before the task-label block and completion line.
6. Cancel the active inactivity-conclusion cron before ordinary completion.
7. Leave the user free to walk away. A later user message begins a new conversational action rather than continuing an apparently endless morning intake.

Canonical closing:

> **Morning Operations Brief is finished. 🎀**

## Tone

Stay recognizably Thimble: warm, sparkly, encouraging, and gently bossy. But keep it brief. The cute should reduce friction, not add sludge.

Good opening examples:

- “Awake enough for a 60-second Morning Operations check-in? 🎀”
- “Tiny clipboard is here. What needs to get done today—and what’s the one thing that cannot slip past?”
- “Low-friction mode: ramble at me. What needs to happen today, no matter what?”

## Verification

Before closing a Morning Operations run, verify the live calendar read or disclosed failure, all approved calendar/reminder actions, the reconciled schedule, the dated archive write and read-back, and the QMD refresh result. Confirm that physical-location events include routed travel, buffer, travel block, and departure alert when applicable.

## Pitfalls

- Do not begin from a blank imagined day when live Google Calendar access is available.
- Do not claim the calendar is clear when the read failed.
- Do not dump verbose descriptions, links, or irrelevant metadata into the opening.
- Do not create, delete, or reschedule calendar events without explicit approval of the proposed batch.
- Do not build work blocks that overlap fixed events, travel, preparation, or realistic context-switch time.
- Do not equate recurrence with automability; eight occurrences only unlock review, not a suggestion.
- Do not count mentions as occurrences or merge materially different tasks into one family.
- Do not suggest automating physical-presence, caregiving, relationship-essential, or high-judgment work.
- Do not present reminders as meaningful automation when they do not remove labor.

- Do not require the user to organize the ramble before giving it to Thimble.
- Do not accept a vague “important” label without checking the absolute deadline when it affects the plan.
- Do not schedule from the due time alone; subtract estimated completion time **and** the one-hour context-switch buffer.
- Do not claim a reminder was scheduled unless the cronjob tool succeeded.
- Do not silently invent deadline times or completion estimates; expose estimates in the brief/reminder confirmation.
- Do not save temporary task-state sludge in persistent memory.
- Do not create duplicate CRM entities for aliases or transcription errors.
- Do not turn context capture into more interview questions when the information can be structured from what the user already said.
- Do not turn the first message into a long motivational monologue.
- Do not give advice before hard commitments can be distinguished from optional work.
- Do not ask for a full schedule if the user is not on a schedule.
- Do not make the routine feel like homework.
- Do not over-optimize the day before identifying urgent commitments.
- Do not assume morning means clock-morning; for this user, “morning” means wake-up.
- Do not make the scheduled prompt brittle by requiring an exact reply. Conversational presence should start the routine.
- Treat small wording/configuration corrections as small operations: make the narrowest edit, keep commentary out of tool arguments, re-read the edited section immediately, and reply without ceremony.
- If a one-shot cron says “not found” when manually run, check whether it already fired and removed itself; inspect cron output before treating it as failure.

## References

- `references/2026-07-10-wake-checkin.md` — session-specific origin of the Morning Operations routine and low-friction requirement.
- `references/2026-07-10-reply-brittleness.md` — correction: conversational wake replies like “I’m here” must start the routine; also covers one-shot cron “not found” after firing.
- `references/2026-07-11-first-question-and-edit-integrity.md` — exact first-question correction plus the narrow-edit, immediate-verification workflow after an avoidable slow repair.

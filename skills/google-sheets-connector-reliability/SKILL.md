---
name: google-sheets-connector-reliability
description: Keep Google Sheets work simple and reliable by using connector-first reads, small upsert batches, verification after writes, one-sheet discipline, and browser fallback only when truly needed.
metadata:
  display-name: Google Sheets Connector Reliability
  enabled: "true"
  version: "1.1"
---

# Google Sheets Connector Reliability

## Purpose
Provide the simplest reliable write pattern for Google Sheets work.

Use this skill whenever a workflow needs to create or update rows in Google Sheets and reliability matters more than cleverness.

## Default rule
Because Google Sheets is connected, use the connector first.

Do not default to browser editing unless:
- the connector is failing repeatedly
- the update is urgent
- the affected range is small enough to edit safely by hand

## One-sheet discipline
When a workflow already has a canonical sheet structure, keep using it.

Do not respond to connector friction by creating:
- staging sheets
- import sheets
- log sheets
- temp sheets
- backup workflow sheets

Reliability problems should be solved with smaller verified writes, not more tabs.

## Simple reliable flow
1. Read the target sheet headers and the rows you may touch.
2. Build row updates using the existing sheet schema.
3. Write in small logical batches, usually 1-10 rows.
4. Re-read the changed rows.
5. Patch only what did not land.
6. Stop if repeated failures make the result unclear.

## What counts as a good batch
Good batches:
- one header setup
- one row add
- one row update
- a few related row updates

Bad batches:
- full-sheet rewrites
- many unrelated edits across the workbook
- giant retries after uncertain timeouts
- splitting one workflow across many sheets to feel safer

## Verification rule
After any non-trivial write:
- read back the changed rows
- compare expected vs actual
- patch only the missing cells

Never assume a timeout means nothing was written.

## Retry discipline
If a write fails:
1. do not rerun the whole batch blindly
2. test one small write first
3. if that works, continue with smaller batches
4. patch only the missing cells

## Placeholders vs blanks
Prefer blanks by default.

Use a short explicit value only when it helps future operations, for example:
- `needs_review`
- `profile_url_missing`
- `preview_only`

Do not fill sheets with placeholder noise just to avoid blanks.

## 503 and timeout handling
A 503 or timeout does not prove the workbook is broken, and it does not prove that nothing was written.

Do this:
- reduce write size
- wait briefly or switch tasks
- test a single write
- read back the affected range
- patch only missing cells

Do not do this:
- spam the same batch repeatedly
- assume nothing landed
- re-run the entire import
- create extra tabs as a workaround

## When to use browser fallback
Use browser-side editing only when all of these are true:
- the connector is unstable or unavailable
- the change is urgent
- the edit scope is small and easy to verify

When falling back:
- keep the same one-sheet structure
- keep only one relevant sheet tab open if possible
- edit only the urgent cells
- avoid schema changes during fallback

## Best outcome
A workflow that stays reliable without:
- duplicate rows
- blind retries
- full-sheet rewrites
- extra logging machinery
- unnecessary browser work
- sheet sprawl

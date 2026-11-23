# DDH Doctor Scheduler

A simple hospital doctor scheduling web app built with vanilla HTML, CSS, and JavaScript. No frameworks, no backend, no build step.

## Running the app

Open `index.html` directly in any modern browser, e.g.:

```sh
open index.html        # macOS
```

Or serve the folder if you prefer a local server:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

All data is saved automatically in the browser's local storage, so it persists between visits on the same browser. (Note: opening via `file://` and via `http://localhost` use separate local storage.)

On first run (empty local storage) the app starts with a 22-doctor dummy roster so there is something to schedule right away; any edits replace it permanently.

## Features

- **Doctors** — add, edit, and remove doctors. Each has a name and residency year (1st/2nd/3rd). Duty groups (A/B/C) are assigned automatically and kept balanced; you can override any doctor's group from the dropdown in the table.
- **Auto-generate** — after adding doctors, the **⚡ Auto-generate schedule** button rebalances duty groups (spreading seniors across groups) and fills one doctor per group in every room for the selected month: 2nd years to the ER, 3rd years to the ICU, 1st/2nd years preferred for general rooms, doctors with less leave that month picked first. All of it remains manually editable afterwards.
- **Rooms** — six rooms per month: the **ER (all of Floor 1)** and **ICU (Floor 2)** as special rooms, plus general rooms on Floors 2–5.
  - The ER accepts **2nd-year residents only** and the ICU **3rd-year residents only**; invalid assignments are rejected.
  - General rooms accept any year, with 1st/2nd years listed first (preferred) and 3rd years in a "use if needed" group.
  - Each room has **three rotation slots (A/B/C)** cycling Duty → Post-duty → Pre-duty, so every room has someone on Duty every day. Any doctor can take any slot regardless of their badge group — the slot sets their duty days for that room (a small group tag appears in the schedule when they differ).
  - **One floor per doctor per month** — a slotted doctor is reserved for that floor: they disappear from every other room's slot pickers and double-assignments are rejected. They stay available as one-day leave covers anywhere.
  - **Group-to-room reservation** — a general floor (2–5) can be reserved for one group for the month: the floor keeps its three rotation slots (so it still has a Duty doctor daily), but the slots and any leave covers may only be filled with that group's doctors, picked one at a time. Reserved-group doctors disappear from other rooms' slot pickers (though they remain available there as one-day leave covers). One room per group; ER/ICU always use individual picks so the year rules stay enforced. Auto-generate fills a reserved floor from its group only and skips group rebalancing while any reservation exists.
- **Leave** — record leave dates per doctor. The daily schedule highlights rooms whose assigned doctor is on leave and lets you pick an available cover doctor for that date (same eligibility rules apply).
- **Duty rotation** — groups A, B, and C cycle through Duty → Post-duty → Pre-duty each day. Pick which group is on Duty on the 1st of the month; each date shows the full rotation and each doctor's status.
- **Status filter** — the daily schedule can be filtered by duty status (defaults to **Duty**); non-matching cells are dimmed, and rooms with unresolved leave stay visible regardless.
- **Assignment history** — each doctor's row shows every room they've been assigned to by month, plus any dates they covered, newest first.
- **CSV roster import** — the **Import doctors from CSV** button replaces the roster from a file with columns `Name, Year (1–3), Group (A/B/C, optional)` (header row optional; group auto-balances if omitted). Existing doctors are matched by name and keep their leave dates and assignments; doctors missing from the file are removed. **Download CSV template** gives you the current roster as a starting file — this makes the app fully usable on static hosting (e.g. GitHub Pages) with no database: keep the roster in a CSV, import it each month.
- **Printing** — the **🖨 Print** button prints the monthly schedule (landscape): the room-assignment summary plus the full daily grid, with controls stripped out. The printout follows the on-screen status filter — e.g. with **Duty** selected you print a clean duty roster; choose **All** first to print every status.
- **Persistence & export** — schedules save to local storage per month; the **Export month as JSON** button downloads the selected month's full schedule (assignments, covers, leave, and daily duty statuses).

## Files

- `index.html` — page structure
- `styles.css` — styling (responsive; the daily table scrolls horizontally on small screens)
- `app.js` — all application logic and local-storage persistence

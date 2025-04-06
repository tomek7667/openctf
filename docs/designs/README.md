# Designs

## Tabs

- Main navigation tabs:
  - Teams
  - Users
  - Forum
  - TODO: Define additional tabs (e.g., Events, Statistics?)

---

## Teams

- A paginated table listing teams, sorted from best to worst.
- Filters available:
  - By year
  - By country
  - By team name (search)
- Sort order: ASC / DESC
- Filtering sidebar on the left (similar to online store filtering, e.g., MediaMarkt).
- The table only shows teams that have at least **1 point**.
- Country filters only include actual countries (possibly fetched from a `possibleFilters` endpoint).
- Visual indicators:
  - 🔼 Green arrow for a team that has risen by X positions in the current week (X displayed next to the arrow).
  - 🔽 Red arrow for a team that has dropped by X positions.
- Flag icons next to each team.
- ✅ Checkmark icon for verified teams.

---

## Users

- General user profiling and improvement.

### Captain Feedback After CTFs

- Captains can assign which members solved which tasks during a CTF.
- For each task, the captain indicates:
  - Which user(s) worked on it (multiple allowed).
  - What category the task belonged to (predefined or default "MISC").
- Categories (predefined): `web`, `rev`, `pwn`, `crypto`. New categories default to `MISC`.
- Each captain assessment is a separate row in the database (i.e., a dedicated table).
- Points for a user are calculated based on:
  - The number of solves for a challenge vs. how many teams solved at least one challenge in that CTF.
  - Multiplied by the CTF’s weight.
  - If multiple users are marked for a challenge, points are split evenly among them.
- A database `VIEW` aggregates individual user points per category for overall rankings.

**Benefits:**

- Rankings of players grouped by category and overall.
- Highlight top specialists (e.g., Best Web Hacker).

TODO:

- Define how category assignments and weights are stored.
- Decide how and when CTF weights are defined or updated.

---

## Forum

- A place for users to discuss upcoming or past events.
- Each **event** is treated as a forum post.
- Users can comment under each event.
- Event feed displays posts for:
  - Events that ended up to one week ago.
  - Events starting up to one week in the future.

TODO:

- Define moderation system (if any).
- Add support for nested comments or upvoting?
- Determine event source: manually created or fetched from an API?

---

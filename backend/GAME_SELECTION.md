# Admin game selection

The game picker and saved guild selections share `getSelectableGamesQuery`.
They read the game schedule directly, independently of the shared scoreboard's
active-week rollover.

Eligible games involve at least one FBS team and are either:

- Scheduled with kickoff at or after the request time and strictly before
  14 days later (a rolling 336-hour window).
- In progress, regardless of kickoff time.

Completed games and past scheduled games are excluded. Conference membership
is resolved for the game's season. Results are ordered by kickoff and game ID.
The existing week filter can narrow the list; postseason and season transitions
use kickoff timestamps rather than a hard-coded year or week.

Both guild-loading paths use the same eligibility query to restore manual picks.
Follows outside the window remain stored; they are not deleted. An empty window
returns no visible manual picks without issuing an empty SQL `IN` list.

The list refreshes when the Admin page loads. Deploy the backend changes and
reload the page to use the new window. No database migration is required.

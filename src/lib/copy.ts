/**
 * SAMPLE COPY shared between pages, so the homepage teaser and the full page
 * cannot drift apart.
 *
 * Design-stage writing in the Circle's voice, to be reviewed and replaced. It
 * states nothing verifiable about the Circle's size, track record, results,
 * fees, or the people in it. Descriptive numbers are fine; metrics are not.
 */

export const tiers = [
  {
    name: "Executive Circle",
    body: "For leaders taking their place among peers. Full access to the forums, the briefings and the network, with counsel available as questions arise rather than on a schedule.",
  },
  {
    name: "Elite Circle",
    body: "For members who shape the Circle's agenda as well as draw on it. Adds a standing advisory group and a council seat, and a hand in setting what the year's programme takes on.",
  },
  {
    name: "Chairman's Circle",
    body: "Entered by invitation from the chair. Convenes the smallest rooms in the Circle, holds its governance, and carries a say in who is invited to join next.",
  },
] as const;

export const membershipCategoriesIntro =
  "Membership is held in one of three categories. Each carries a different depth of involvement; all three are entered the same way.";

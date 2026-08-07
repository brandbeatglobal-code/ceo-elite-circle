const words = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
  "Twenty",
];

/**
 * Running section index, spelled out — "One", "Two", "Three"…
 *
 * The list runs to twenty because sections can be added through the admin now.
 * It used to stop at twelve, which was the longest page anyone had written by
 * hand; the first page to pass that would have shown a bare numeral among the
 * words, which is not the convention the design uses anywhere. Past twenty it
 * still falls back to a numeral rather than throwing — a page that long is a
 * problem with the page, not something to fail a render over.
 */
export function ordinal(i: number) {
  return words[i] ?? String(i + 1);
}

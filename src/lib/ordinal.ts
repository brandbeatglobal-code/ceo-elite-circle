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
];

/** Running section index, spelled out — "One", "Two", "Three"… */
export function ordinal(i: number) {
  return words[i] ?? String(i + 1);
}

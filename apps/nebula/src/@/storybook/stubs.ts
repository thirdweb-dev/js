export function randomLorem(length: number) {
  const loremWords = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
  ];

  return Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * loremWords.length);
    return loremWords[randomIndex];
  }).join(" ");
}

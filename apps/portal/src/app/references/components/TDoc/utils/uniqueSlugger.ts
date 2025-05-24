export function uniqueSlugger(options: {
  base: string;
  isUnique: (slug: string) => boolean;
}) {
  const limit = 20;
  const { base, isUnique } = options;

  // if slug is unique, save it and return
  if (isUnique(base)) {
    return base;
  }

  // build a new slug by adding -n where n is the first number that makes the slug unique
  let i = 2;
  while (!isUnique(`${base}-${i}`)) {
    i++;
    if (i > limit) {
      throw new Error(`Too many duplicates found for slug: ${base}`);
    }
  }

  return `${base}-${i}`;
}

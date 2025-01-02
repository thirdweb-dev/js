export const subgroups = {
  components: "UI Components",
  hooks: "React Hooks",
  functions: "Core Functions",
};

export const nameToSubgroupSlug = (() => {
  const obj: Record<string, keyof typeof subgroups> = {};
  for (const [key, value] of Object.entries(subgroups)) {
    obj[value] = key as keyof typeof subgroups;
  }
  return obj;
})();

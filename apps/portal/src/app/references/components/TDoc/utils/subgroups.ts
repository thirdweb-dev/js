export const subgroups = {
  components: "UI Components",
  hooks: "React Hooks",
  classes: "Classes",
  functions: "Core Functions",
  variables: "Variables",
  types: "Types",
  enums: "Enums",
};

export const nameToSubgroupSlug = (() => {
  const obj: Record<string, keyof typeof subgroups> = {};
  for (const [key, value] of Object.entries(subgroups)) {
    obj[value] = key as keyof typeof subgroups;
  }
  return obj;
})();

export const subgroups = {
	components: "Components",
	hooks: "Hooks",
	classes: "Classes",
	functions: "Functions",
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

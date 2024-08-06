export const ignoreHeadings = new Set(
	[
		"components",
		"hooks",
		"functions",
		"variables",
		"types",
		"props",
		"type",
		"prop",
		"__namedParameters",
		"installation",
		"getting started",
		"enums",
		"classes",
		"parameters",
		"accessors",
		"returns",
		"example",
	].map((t) => t.toLowerCase()),
);

export const minimumParagraphlength = 20;

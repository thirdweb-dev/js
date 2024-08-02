import escapeStringRegexp from "escape-string-regexp";

type MatchArgs = {
	value: string;
	match: string;
};

export function getMatches({ value, match }: MatchArgs) {
	const splitText = value.split("");
	const escapedSearch = escapeStringRegexp(match.trim());
	const regexp = new RegExp(escapedSearch.replaceAll(" ", "|"), "ig");
	let result;
	let index = 0;
	const output: { text: string; highlight: boolean }[] = [];

	while ((result = regexp.exec(value)) && regexp.lastIndex !== 0) {
		const before = splitText.splice(0, result.index - index).join("");
		const after = splitText.splice(0, regexp.lastIndex - result.index).join("");
		index = regexp.lastIndex;
		output.push(
			{
				text: before,
				highlight: false,
			},
			{
				text: after,
				highlight: true,
			},
		);
	}

	output.push({ text: splitText.join(""), highlight: false });

	return output;
}

import { TokenInfo } from "typedoc-better-json";
import { getAllTSReferencesLinks } from "./getAllTSReferencesLinkMap";

// TODO: take the current package version as input, fetch the dependencies from NPM, and point to the correct version instead of /latest/

export async function getTokenLinks(
	tokens: TokenInfo[],
): Promise<Map<string, string>> {
	const linkMap = new Map<string, string>();
	const validReferenceLinks = await getAllTSReferencesLinks();

	function setLink(key: string, value: string) {
		if (validReferenceLinks.has(value)) {
			linkMap.set(key, value);
		}
	}

	tokens.forEach((token) => {
		if (token.package) {
			switch (token.package) {
				case "@thirdweb-dev/react-core":
				case "@thirdweb-dev/react": {
					setLink(token.name, `/references/react/latest/${token.name}`);
					break;
				}

				case "@thirdweb-dev/react-native": {
					setLink(token.name, `/references/react-native/latest/${token.name}`);
					break;
				}

				case "@thirdweb-dev/sdk": {
					setLink(token.name, `/references/typescript/v4/${token.name}`);
					break;
				}

				case "thirdweb": {
					setLink(token.name, `/references/typescript/v5/${token.name}`);
					break;
				}

				case "@thirdweb-dev/storage": {
					setLink(token.name, `/references/storage/latest/${token.name}`);
					break;
				}

				case "@thirdweb-dev/wallets": {
					setLink(token.name, `/references/wallets/latest/${token.name}`);
					break;
				}
			}
		}
	});

	return linkMap;
}

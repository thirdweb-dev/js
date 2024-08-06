import { withCache } from "../../../../../lib/withCache";
import { fetchJSON } from "@/lib/fetchJSON";
import { TBody, Table, Td, Th, Tr } from "@/components/Document/Table";
import Link from "next/link";
import { Heading, Paragraph } from "../../../../../components/Document";

export default async function ExtensionPage() {
	const URL =
		"https://raw.githubusercontent.com/thirdweb-dev/js/main/packages/thirdweb/typedoc/documentation.json.gz";
	const doc = await withCache(() => fetchJSON(URL), {
		cacheKey: URL,
		// cache for 24hrs - we don't really add new extensions everyday - plus this json file is large
		cacheTime: 24 * 60 * 60 * 1000,
	});
	const toExclude = [""];
	const extensions = [
		...new Set(
			doc.children
				.filter((item: { name: string }) => item.name.startsWith("extensions/"))
				.map((item: { name: string }) => item.name.split("/")[1]),
		),
	].filter((name) => !toExclude.includes(name as string)) as string[];

	const overrides: Record<string, { name?: string; description?: string }> = {
		common: {
			name: "Common",
			description: "Common contract extensions",
		},
		erc20: { description: "ERC20 token standard extensions" },
		erc721: { description: "ERC721 token standard extensions" },
		erc1155: { description: "ERC1155 token standard extensions" },
		erc4337: { description: "ERC4337 account abstraction extensions" },
		erc4626: { description: "ERC4626 Tokenized Vaults extensions" },
		farcaster: { description: "Farcaster protocol extensions" },
		lens: { description: "Lens protocol extensions" },
	};
	return (
		<>
			<Heading level={1} id="built-in-extensions">
				Built-in extensions for common standards{" "}
			</Heading>
			<Paragraph>
				The SDK comes packed with a set of built-in extensions for common
				standards. These extensions are designed to make it easy to interact
				with popular contracts and protocols. They are available as part of the
				SDK and can be used in your application without any additional setup.
			</Paragraph>
			<Table>
				<TBody>
					<Tr>
						<Th>Standard</Th>
						<Th>Import Path</Th>
						<Th>Description</Th>
					</Tr>

					{extensions.map((item) => {
						return (
							<Tr key={item}>
								<Td>{overrides[item]?.name ?? item.toUpperCase()}</Td>
								<Td>
									<Link
										href={`/references/typescript/v5/functions#${item}`}
										className="flex flex-nowrap items-center gap-4 whitespace-nowrap font-medium text-accent-500 transition-colors hover:text-f-100"
									>
										thirdweb/extensions/{item}
									</Link>
								</Td>
								<Td>
									{overrides[item]?.description ??
										`${item.toUpperCase()} extensions`}
								</Td>
							</Tr>
						);
					})}
				</TBody>
			</Table>
			More extensions are being added regularly. Anyone can{" "}
			<Link
				className="font-medium text-accent-500 transition-colors hover:text-f-100"
				href="/typescript/v5/extensions/create"
			>
				create an extension
			</Link>{" "}
			and contribute it back to the repository. You can also{" "}
			<Link
				className="font-medium text-accent-500 transition-colors hover:text-f-100"
				href="/typescript/v5/extensions/generate"
			>
				generate extensions
			</Link>{" "}
			for any deployed contract.
		</>
	);
}

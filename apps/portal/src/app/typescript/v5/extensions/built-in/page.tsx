import { TBody, Table, Td, Th, Tr } from "@/components/Document/Table";
import Link from "next/link";
import { Heading, Paragraph } from "../../../../../components/Document";
import { fetchTypeScriptDoc } from "../../../../references/components/TDoc/fetchDocs/fetchTypeScriptDoc";
import { getCustomTag } from "../../../../references/components/TDoc/utils/getSidebarLinkgroups";

export default async function ExtensionPage() {
  const docs = await fetchTypeScriptDoc("v5");
  const extensions = [
    ...new Set(
      docs.functions
        ?.filter((f) => {
          const [extension] = getCustomTag(f) || [];
          return extension === "@extension";
        })
        ?.map((f) => {
          const [, extensionName] = getCustomTag(f) || [];
          return extensionName;
        })
        .filter((item) => item !== undefined) || [],
    ),
  ];

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
                <Td>{overrides[item]?.name ?? item}</Td>
                <Td>
                  <Link
                    href={`/references/typescript/v5/functions#${item.toLowerCase()}`}
                    className="text-accent-500 hover:text-f-100 flex flex-nowrap items-center gap-4 whitespace-nowrap font-medium transition-colors"
                  >
                    thirdweb/extensions/{item.toLowerCase()}
                  </Link>
                </Td>
                <Td>{overrides[item]?.description ?? `${item} extensions`}</Td>
              </Tr>
            );
          })}
        </TBody>
      </Table>
      More extensions are being added regularly. Anyone can{" "}
      <Link
        className="text-accent-500 hover:text-f-100 font-medium transition-colors"
        href="/typescript/v5/extensions/create"
      >
        create an extension
      </Link>{" "}
      and contribute it back to the repository. You can also{" "}
      <Link
        className="text-accent-500 hover:text-f-100 font-medium transition-colors"
        href="/typescript/v5/extensions/generate"
      >
        generate extensions
      </Link>{" "}
      for any deployed contract.
    </>
  );
}

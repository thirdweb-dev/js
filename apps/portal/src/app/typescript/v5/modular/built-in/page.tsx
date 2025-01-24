import { TBody, Table, Td, Th, Tr } from "@/components/Document/Table";
import {
  DocLink,
  Heading,
  Paragraph,
} from "../../../../../components/Document";
import { fetchTypeScriptDoc } from "../../../../references/components/TDoc/fetchDocs/fetchTypeScriptDoc";
import { getCustomTag } from "../../../../references/components/TDoc/utils/getSidebarLinkgroups";

export default async function ModulesPage() {
  const docs = await fetchTypeScriptDoc("v5");
  const extensions = [
    ...new Set(
      docs.functions
        ?.filter((f) => {
          const [extension, extensionName] = getCustomTag(f) || [];
          return extension === "@modules" && extensionName !== "Common";
        })
        ?.map((f) => {
          const [, extensionName] = getCustomTag(f) || [];
          return extensionName;
        })
        .filter((item) => item !== undefined) || [],
    ),
  ];
  return (
    <>
      <Heading level={1} id="built-in-extensions">
        Built-in modules
      </Heading>
      <Paragraph>
        The SDK comes packed with a set of built-in modules for convenient use.
        Note that you can also create your own modules.
      </Paragraph>
      <Table>
        <TBody>
          <Tr>
            <Th>Module Name</Th>
            {/* <Th>Description</Th> TODO add descriptions */}
          </Tr>

          {extensions.map((item) => {
            return (
              <Tr key={item}>
                <Td>
                  <DocLink
                    href={`/references/typescript/v5/functions#${item.toLowerCase()}`}
                  >
                    {item}
                  </DocLink>
                </Td>
                {/* <Td>{`${item}`}</Td> */}
              </Tr>
            );
          })}
        </TBody>
      </Table>
      <Paragraph>
        More modules are being added regularly. You can also{" "}
        <DocLink href="/contracts/modular-contracts/get-started/create-module-contract">
          create your own modules
        </DocLink>
        .
      </Paragraph>
    </>
  );
}

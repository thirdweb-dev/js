import { Flex } from "@chakra-ui/react";
import { HighlightedButton } from "components/product-pages/common/HighlightedButton";
import { useState } from "react";
import { CodeBlock } from "tw-components";

const deployCode = `const txResult = await sdk.deployer.deployBuiltInContract(
  "edition-drop", 
  {
    // Contract name
    name: "My ERC1155", 
    // Address that'll take the primary sale revenue
    primary_sale_recipient: "{{user_address}}", 
    // Optionally take a free of primary sale revenue
    platform_fee_recipient: "{{admin_address}}", 
    // 10% fee
    platform_fee_basis_points: 1000, 
  }
);`;

const mintAndAirdropCode = `// Get the contract
const contract = await sdk.getContract("0x..."); 

const tx = await contract.erc1155.mint({
  metadata,
  // The number of this NFT you want to mint
  supply: 1000, 
});

const tx = await contract.erc1155.airdrop(
  "0", // Token ID
  ["0x...", "0x...", "0x..."], // List of addresses
);`;

export const DeployAndAirdrop = () => {
  const [selectedTab, setSelectedTab] = useState("deploy");

  return (
    <Flex w="full" flexDir="column" mx="auto" mt={6}>
      <Flex
        direction={{
          base: "column",
          md: "row",
        }}
        justifyContent="center"
        gap={{ base: 4, md: 8 }}
        mb={12}
      >
        <HighlightedButton
          isHighlighted={selectedTab === "deploy"}
          title="Deploy a Contract"
          minHeight="63px"
          width={{
            base: "full",
            md: "236px",
          }}
          onClick={() => {
            setSelectedTab("deploy");
          }}
        />
        <HighlightedButton
          isHighlighted={selectedTab === "mint-and-airdrop"}
          title="Mint and Airdrop"
          minHeight="63px"
          width={{
            base: "full",
            md: "236px",
          }}
          onClick={() => {
            setSelectedTab("mint-and-airdrop");
          }}
        />
      </Flex>
      {selectedTab === "deploy" ? (
        <CodeBlock code={deployCode} language="typescript" />
      ) : (
        <CodeBlock code={mintAndAirdropCode} language="typescript" />
      )}
    </Flex>
  );
};

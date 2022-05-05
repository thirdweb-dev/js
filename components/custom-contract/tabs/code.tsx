import { Box, Flex } from "@chakra-ui/react";
import { useContractFunctions } from "@thirdweb-dev/react";
import { Card, CodeBlock, Heading } from "tw-components";

interface ContentOverviewProps {
  contractAddress: string;
}

export const CustomContractCodeTab: React.VFC<ContentOverviewProps> = ({
  contractAddress,
}) => {
  const functionsQuery = useContractFunctions(contractAddress);

  const functions = functionsQuery.data
    ?.filter(
      (d) =>
        d.name !== "contractURI" &&
        d.name !== "setThirdwebInfo" &&
        d.name !== "getPublishMetadataUri",
    )
    .map((f) => f.signature);

  if (functionsQuery.isError) {
    return <Box>Contract does not support generated functions</Box>;
  }

  return (
    <Flex gap={4} direction="column">
      <Card as={Flex} gap={2} flexDirection="column">
        <Heading size="subtitle.md">Install the thirdweb SDK</Heading>
        <CodeBlock
          px={4}
          py={2}
          borderRadius="md"
          language="bash"
          code={`npm install @thirdweb-dev/sdk`}
        />
      </Card>
      <Card as={Flex} gap={2} flexDirection="column">
        <Heading size="subtitle.md">
          Use your contract with the thirdweb SDK
        </Heading>
        <CodeBlock
          language="typescript"
          code={`import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const provider = ethers.Wallet.createRandom();
const sdk = new ThirdwebSDK(provider);
const contract = await sdk.getContract("${contractAddress}");`}
        />
      </Card>

      {functions && (
        <Card as={Flex} gap={2} flexDirection="column">
          <Heading size="subtitle.md">Contract functions</Heading>
          {functions?.map((signature) => (
            <CodeBlock
              key={signature}
              code={`contract.functions.${signature}`}
              language="typescript"
            />
          ))}
        </Card>
      )}
    </Flex>
  );
};

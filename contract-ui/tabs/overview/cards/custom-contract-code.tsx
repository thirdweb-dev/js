import { Box, Flex } from "@chakra-ui/react";
import { ChainId, useChainId, useContractFunctions } from "@thirdweb-dev/react";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { Environment } from "components/contract-tabs/code/types";
import { useState } from "react";
import { Card, CodeBlock, Heading } from "tw-components";

interface ContentOverviewProps {
  contractAddress?: string;
}

export const CustomContractCode: React.FC<ContentOverviewProps> = ({
  contractAddress,
}) => {
  const functionsQuery = useContractFunctions(contractAddress);
  const chainId = useChainId();
  const chainName = getChainName(chainId);

  // TODO filter out functions that are part of detected extensions already
  const functions = functionsQuery.data
    ?.filter(
      (d) =>
        d.name !== "tw_initializeOwner" &&
        d.name !== "setThirdwebInfo" &&
        d.name !== "getPublishMetadataUri",
    )
    .map((f) => f.signature);

  const [codeEnv, setCodeEnv] = useState<Environment>("javascript");

  if (functionsQuery.isError) {
    return <Box>Contract does not support generated functions</Box>;
  }

  return (
    <Flex gap={4} direction="column" w="full">
      <Heading size="subtitle.sm">Get started with the SDK</Heading>
      <Card as={Flex} gap={2} flexDirection="column">
        <Heading size="subtitle.md">Install the thirdweb SDK</Heading>
        <CodeSegment
          setEnvironment={setCodeEnv}
          environment={codeEnv}
          isInstallCommand
          snippet={{
            javascript: `npm install @thirdweb-dev/sdk ethers`,
            react: `npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers`,
            python: `pip install thirdweb-sdk`,
            go: `go get github.com/thirdweb-dev/go-sdk/thirdweb`,
          }}
        />
      </Card>
      <Card as={Flex} gap={2} flexDirection="column">
        <Heading size="subtitle.md">
          Use your contract with the thirdweb SDK
        </Heading>
        <CodeSegment
          setEnvironment={setCodeEnv}
          environment={codeEnv}
          snippet={{
            javascript: `import { ThirdwebSDK } from "@thirdweb-dev/sdk;

const sdk = new ThirdwebSDK("${chainName}");
const contract = await sdk.getContract("${contractAddress}");`,
            react: `const { contract, isLoading } = useContract("${contractAddress}");`,
            python: `from thirdweb import ThirdwebSDK

sdk = ThirdwebSDK("${chainName}")
contract = sdk.get_contract("${contractAddress}")`,
            go: `import (
  "github.com/thirdweb-dev/go-sdk/thirdweb"
)
            
sdk, err := thirdweb.NewThirdwebSDK("${chainName}", nil)
contract, err := sdk.GetContract("${contractAddress}")`,
          }}
        />
      </Card>

      {functions && (
        <Card as={Flex} gap={2} flexDirection="column">
          <Heading size="subtitle.md">Contract functions</Heading>
          {functions.map((signature) => (
            <CodeBlock key={signature} code={signature} language="javascript" />
          ))}
        </Card>
      )}
    </Flex>
  );
};

function getChainName(chainId: number | undefined) {
  switch (chainId) {
    case ChainId.Mainnet:
      return "mainnet";
    case ChainId.Rinkeby:
      return "rinkeby";
    case ChainId.Goerli:
      return "goerli";
    case ChainId.Polygon:
      return "polygon";
    case ChainId.Mumbai:
      return "mumbai";
    case ChainId.Fantom:
      return "fantom";
    case ChainId.Avalanche:
      return "avalanche";
    default:
      return "mainnet";
  }
}

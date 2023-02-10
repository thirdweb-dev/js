import { CodeSegment } from "./CodeSegment";
import {
  CodeSnippet,
  Environment,
  SnippetApiResponse,
  SnippetSchema,
} from "./types";
import { usePascalCaseContractName } from "@3rdweb-sdk/react";
import { Flex, Spinner, Stack } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { Abi } from "@thirdweb-dev/sdk";
import { CodeOverview } from "contract-ui/tabs/code/components/code-overview";
import { constants } from "ethers";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useCallback, useMemo, useState } from "react";
import { IoDocumentOutline } from "react-icons/io5";
import { Card, CodeBlock, Heading, LinkButton, Text } from "tw-components";
import { SupportedNetwork } from "utils/network";

function replaceVariablesInCodeSnippet(
  snippet: CodeSnippet,
  contractAddress?: string,
  walletAddress?: string,
  chainName?: string,
): CodeSnippet {
  const envs = Object.keys(snippet) as Environment[];
  for (const env of envs) {
    if (contractAddress) {
      snippet[env] = snippet[env]
        ?.replace(/{{contract_address}}/gm, contractAddress)
        ?.replace(/{{program_address}}/gm, contractAddress)
        ?.replace(/{{chainName}}/gm, chainName || "goerli")
        .replace(/<YOUR-CONTRACT-ADDRESS>/gm, contractAddress);
    }

    if (walletAddress) {
      snippet[env] = snippet[env]?.replace(
        /{{wallet_address}}/gm,
        walletAddress,
      );
    }
  }
  return snippet;
}

interface ContractCodeProps {
  contractAddress?: string | undefined;
  contractType: string;
  ecosystem: "evm" | "solana";
}

const INSTALL_COMMANDS = {
  evm: {
    typescript: "npm install @thirdweb-dev/sdk ethers@5",
    javascript: "npm install @thirdweb-dev/sdk ethers@5",
    react: "npm install @thirdweb-dev/sdk @thirdweb-dev/react ethers@5",
    python: "pip install thirdweb-sdk",
    go: "go get github.com/thirdweb-dev/go-sdk/thirdweb",
  },
  solana: {
    typescript: "npm install @thirdweb-dev/sdk",
    javascript: "npm install @thirdweb-dev/sdk",
    react:
      "npm install @thirdweb-dev/sdk @thirdweb-dev/react @solana/wallet-adapter-wallets @solana/wallet-adapter-react",
    python: "pip install thirdweb-sdk",
    go: "go get github.com/thirdweb-dev/go-sdk/thirdweb",
  },
};

const CREATE_APP_COMMANDS = {
  evm: "npx thirdweb create app --evm",
  solana: "npx thirdweb create app --solana",
};

export const ContractCode: React.FC<ContractCodeProps> = ({
  contractAddress = constants.AddressZero,
  contractType,
  ecosystem,
}) => {
  const { data, isLoading } = useContractCodeSnippetQuery(ecosystem);
  const chainName = useSingleQueryParam<SupportedNetwork>("networkOrAddress");

  const contractName = usePascalCaseContractName(contractType);

  const scopedData = useMemo(() => {
    return getContractSnippets(data, contractName);
  }, [data, contractName]);

  const evmAddress = useAddress();
  const solanaAddress = useWallet().publicKey?.toBase58();
  const address = evmAddress || solanaAddress;
  const [environment, setEnvironment] = useState<Environment>("react");

  const replaceSnippetVars = useCallback(
    (snip: Partial<Record<Environment, string>>) =>
      replaceVariablesInCodeSnippet(snip, contractAddress, address, chainName),
    [address, contractAddress, chainName],
  );

  const { contract } = useContract(contractAddress);

  if (isLoading) {
    return (
      <Card>
        <Spinner /> Loading...
      </Card>
    );
  }

  if (!scopedData && contract) {
    return (
      <CodeOverview
        abi={contract?.abi as Abi}
        contractAddress={contractAddress}
      />
    );
  }

  if (!scopedData) {
    return (
      <Card>
        <Heading as="h2" size="title.sm">
          Code snippets for this contract are not yet available.
        </Heading>
        <Text>Please check back for updates over the next couple of days.</Text>
      </Card>
    );
  }

  const snippetCard = (snippet: SnippetSchema) => (
    <Card key={snippet.name}>
      <Stack spacing={4}>
        <Flex direction="row" gap={2} justify="space-between" align="center">
          <Flex direction="column" gap={2}>
            <Heading size="label.lg">{snippet.summary}</Heading>
            {snippet.remarks && <Text>{snippet.remarks}</Text>}
          </Flex>
          {snippet.reference[environment as string] && (
            <LinkButton
              flexShrink={0}
              leftIcon={<IoDocumentOutline />}
              isExternal
              noIcon
              href={snippet.reference[environment as string]}
              variant="outline"
              size="sm"
            >
              Documentation
            </LinkButton>
          )}
        </Flex>
        <CodeSegment
          snippet={replaceSnippetVars(snippet.examples)}
          environment={environment}
          setEnvironment={setEnvironment}
        />
      </Stack>
    </Card>
  );

  return (
    <Stack spacing={4}>
      <Card>
        <Stack spacing={3}>
          {environment === "react" ? (
            <>
              <Heading size="title.sm">Create a new Project</Heading>
              <Text>
                Get up and running in seconds using a template React project
              </Text>
              <CodeBlock
                language="bash"
                code={CREATE_APP_COMMANDS[ecosystem]}
              />
            </>
          ) : (
            <>
              <Heading size="title.sm">Getting started</Heading>
              <Text>First, install the latest version of the SDK.</Text>
              <CodeBlock
                language="bash"
                code={
                  INSTALL_COMMANDS[ecosystem][
                    environment !== "web3button" ? environment : "react"
                  ]
                }
              />
            </>
          )}
          <Text>
            Follow along below to get started using this contract in your code.
          </Text>
          <CodeSegment
            snippet={replaceSnippetVars(scopedData.examples)}
            environment={environment}
            setEnvironment={setEnvironment}
          />
        </Stack>
      </Card>
      {scopedData.methods?.map((snippet) => {
        return snippetCard(snippet);
      })}

      {scopedData.properties?.map((snippet) => {
        return snippetCard(snippet);
      })}
    </Stack>
  );
};

function getContractSnippets(
  snippets?: SnippetApiResponse,
  contractName?: string | null,
): SnippetSchema | null {
  return contractName && snippets ? snippets[contractName] : null;
}

function useContractCodeSnippetQuery(ecosystem: "evm" | "solana") {
  return useQuery(["code-snippet"], async () => {
    const filename = ecosystem === "evm" ? "snippets" : "snippets_solana";
    const res = await fetch(
      `https://raw.githubusercontent.com/thirdweb-dev/docs/main/docs/${filename}.json`,
    );
    return (await res.json()) as SnippetApiResponse;
  });
}

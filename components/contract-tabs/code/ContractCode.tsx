import { CodeSegment } from "./CodeSegment";
import {
  CodeEnvironment,
  CodeSnippet,
  SnippetApiResponse,
  SnippetSchema,
} from "./types";
import { usePascalCaseContractName } from "@3rdweb-sdk/react";
import { Flex, Spinner, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useAddress, useContract } from "@thirdweb-dev/react";
import type { Abi } from "@thirdweb-dev/sdk";
import { CodeOverview } from "contract-ui/tabs/code/components/code-overview";
import { constants } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { IoDocumentOutline } from "react-icons/io5";
import { Card, CodeBlock, Heading, LinkButton, Text } from "tw-components";

function replaceVariablesInCodeSnippet(
  snippet: CodeSnippet,
  contractAddress?: string,
  walletAddress?: string,
  chainName?: string,
): CodeSnippet {
  const envs = Object.keys(snippet) as CodeEnvironment[];
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
}

const INSTALL_COMMANDS = {
  typescript: "npm install @thirdweb-dev/sdk ethers@5",
  javascript: "npm install @thirdweb-dev/sdk ethers@5",
  react: "npm install @thirdweb-dev/sdk @thirdweb-dev/react ethers@5",
  "react-native":
    "npm install 'ethers@5' node-libs-browser react-native-crypto react-native-randombytes react-native-get-random-values react-native-svg react-native-mmkv@2.5.1 @react-native-async-storage/async-storage @thirdweb-dev/react-native @thirdweb-dev/react-native-compat",
  python: "pip install thirdweb-sdk",
  go: "go get github.com/thirdweb-dev/go-sdk/thirdweb",
  unity: ``,
};

const CREATE_APP_COMMAND = "npx thirdweb create app";

export const ContractCode: React.FC<ContractCodeProps> = ({
  contractAddress = constants.AddressZero,
  contractType,
}) => {
  const { data, isLoading } = useContractCodeSnippetQuery();

  // TODO jonas - bring this back when we figure out what the SDK inputs are going to be for this
  const chainName = "";

  const contractName = usePascalCaseContractName(contractType);

  const scopedData = useMemo(() => {
    return getContractSnippets(data, contractName);
  }, [data, contractName]);

  const address = useAddress();

  const [environment, setEnvironment] = useState<CodeEnvironment>("javascript");

  const replaceSnippetVars = useCallback(
    (snip: Partial<Record<CodeEnvironment, string>>) =>
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
          {environment.includes("react") ? (
            <>
              <Heading size="title.sm">Create a new Project</Heading>
              <Text>
                Get up and running in seconds using a template React project
              </Text>
              <CodeBlock language="bash" code={CREATE_APP_COMMAND} />
            </>
          ) : (
            <>
              <Heading size="title.sm">Getting started</Heading>
              <Text>First, install the latest version of the SDK:</Text>
              <CodeBlock
                language="bash"
                code={
                  INSTALL_COMMANDS[
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

function useContractCodeSnippetQuery() {
  return useQuery(["code-snippet"], async () => {
    const res = await fetch(
      `https://raw.githubusercontent.com/thirdweb-dev/docs/main/docs/snippets.json`,
    );
    return (await res.json()) as SnippetApiResponse;
  });
}

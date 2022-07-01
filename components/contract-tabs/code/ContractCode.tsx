import { ABICopyButton } from "./ABICopyButton";
import { CodeSegment } from "./CodeSegment";
import {
  CodeSnippet,
  Environment,
  SnippetApiResponse,
  SnippetSchema,
} from "./types";
import { useContractName, useWeb3 } from "@3rdweb-sdk/react";
import { Flex, Spinner, Stack } from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useCallback, useMemo, useState } from "react";
import { IoDocumentOutline } from "react-icons/io5";
import { useQuery } from "react-query";
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
        ?.replace(/{{chainName}}/gm, chainName || "rinkeby")
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

interface IContractCode {
  contract?: ValidContractInstance;
}

const INSTALL_COMMANDS = {
  typescript: "npm install @thirdweb-dev/sdk",
  javascript: "npm install @thirdweb-dev/sdk",
  react: "npm install @thirdweb-dev/react",
  python: "pip install thirdweb-sdk",
  go: "go get github.com/thirdweb-dev/go-sdk/thirdweb",
};

export const ContractCode: React.FC<IContractCode> = ({ contract }) => {
  const { data, isLoading } = useContractCodeSnippetQuery();
  const chainName = useSingleQueryParam<SupportedNetwork>("network");

  const contractName = useContractName(contract);

  const scopedData = useMemo(() => {
    return getContractSnippets(data, contractName);
  }, [data, contractName]);

  const { address } = useWeb3();
  const [environment, setEnvironment] = useState<Environment>("javascript");
  const replaceSnippetVars = useCallback(
    (snip: Partial<Record<Environment, string>>) =>
      replaceVariablesInCodeSnippet(
        snip,
        contract?.getAddress(),
        address,
        chainName,
      ),
    [address, contract, chainName],
  );

  if (isLoading) {
    return (
      <Card>
        <Spinner /> Loading...
      </Card>
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
          <Heading size="title.sm">Getting Started</Heading>
          <Text>First, install the latest version of the SDK.</Text>
          <CodeBlock language="bash" code={INSTALL_COMMANDS[environment]} />
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

      <Card>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={2}
          justify="space-between"
        >
          <Flex direction="column" gap={2} mb={{ base: 2, md: 0 }}>
            <Heading size="title.sm">Contract ABI</Heading>
            <Text>
              If you need the underlying contract ABI for this contract you can
              copy it from here.
            </Text>
          </Flex>
          {contract && (
            <ABICopyButton colorScheme="purple" contract={contract} />
          )}
        </Flex>
      </Card>
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

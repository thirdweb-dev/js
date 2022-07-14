import { Box, Flex, Select } from "@chakra-ui/react";
import { useContractFunctions } from "@thirdweb-dev/react";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { Environment } from "components/contract-tabs/code/types";
import { useMemo, useState } from "react";
import { Card, Heading, Text } from "tw-components";

interface CodeOverviewProps {
  contractAddress?: string;
}

const COMMANDS = {
  install: {
    javascript: "npm install @thirdweb-dev/sdk",
    react: "npm install @thirdweb-dev/react",
    python: "pip install thirdweb-sdk",
    go: "go get github.com/thirdweb-dev/go-sdk/thirdweb",
  },
  setup: {
    javascript: `import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("mumbai");
const contract = await sdk.getContract("CONTRACT-ADDRESS");`,
    react: `import { useContract } from "@thirdweb-dev/react";

export default function Component() {
  const contract = useContract("CONTRACT-ADDRESS");
  // Now you can use the contract in the rest of the component
}`,
    python: `from thirdweb import ThirdwebSDK

sdk = ThirdwebSDK("mumbai")
contract = sdk.get_contract("CONTRACT-ADDRESS")`,
    go: `import "github.com/thirdweb-dev/go-sdk/thirdweb"

sdk, err := thirdweb.NewThirdwebSDK("mumbai")
contract, err := sdk.GetContract("CONTRACT-ADDRESS")
`,
  },
  read: {
    javascript: `const data = await contract.call("FN", ARGS)`,
    react: `import { useContract, useContractData } from "@thirdweb-dev/react";

export default function Component() {
  const contract = useContract("CONTRACT-ADDRESS");
  const { data, isLoading } = useContractData(contract, "FN", ARGS)
}`,
    python: `data = contract.call("FN", ARGS)`,
    go: `data, err := contract.Call("FN", ARGS)`,
  },
  write: {
    javascript: `const data = await contract.call("FN", ARGS)`,
    react: `import { useContract, useContractCall } from "@thirdweb-dev/react";

export default function Component() {
  const contract = useContract("CONTRACT-ADDRESS");
  const { mutate, isLoading } = useContractCall(contract, "FN")

  function call() {
    mutate(ARGS, {
      onSuccess: (data) => {
        console.log(data)
      }
    })
  }
}`,
    python: `data = contract.call("FN", ARGS)`,
    go: `data, err := contract.Call("FN", ARGS)`,
  },
};

interface SnippetOptions {
  contractAddress?: string;
  fn?: string;
  args?: string[];
}

function formatSnippet(
  snippet: Record<Environment, any>,
  { contractAddress, fn, args }: SnippetOptions,
) {
  const code = { ...snippet };
  for (const key of Object.keys(code)) {
    const env = key as Environment;

    if (args && args.length) {
      code[env] = code[env]
        .replace("CONTRACT-ADDRESS", contractAddress || "")
        .replace("FN", fn || "")
        .replace("ARGS", args?.join(", ") || "");
    } else {
      code[env] = code[env]
        .replace("CONTRACT-ADDRESS", contractAddress || "")
        .replace("FN", fn || "")
        .replace(", ARGS", "")
        .replace("ARGS, ", "");
    }
  }

  return code;
}

export const CodeOverview: React.FC<CodeOverviewProps> = ({
  contractAddress,
}) => {
  const [environment, setEnvironment] = useState<Environment>("react");

  const functionsQuery = useContractFunctions(contractAddress);
  const { readFunctions, writeFunctions } = useMemo(() => {
    return {
      readFunctions: functionsQuery.data?.filter(
        (f) => f.stateMutability === "view" || f.stateMutability === "pure",
      ),
      writeFunctions: functionsQuery.data?.filter(
        (f) => f.stateMutability !== "view" && f.stateMutability !== "pure",
      ),
    };
  }, [functionsQuery.data]);

  const [read, setRead] = useState(
    readFunctions && readFunctions.length > 0 ? readFunctions[0].name : "",
  );
  const [write, setWrite] = useState(
    writeFunctions && writeFunctions.length > 0 ? writeFunctions[0].name : "",
  );

  return (
    <>
      <Card as={Flex} flexDirection="column" gap={3}>
        <Heading size="title.sm">Getting Started</Heading>
        <Text>First, install the latest version of the SDK.</Text>
        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={COMMANDS.install}
          isInstallCommand
        />
        <Text>
          Follow along below to get started using this contract in your code.
        </Text>
        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={formatSnippet(COMMANDS.setup as any, { contractAddress })}
          hideTabs
        />
      </Card>
      <Card as={Flex} flexDirection="column" gap={3}>
        <Flex align="center" justify="space-between">
          <Heading size="title.sm">Reading Data</Heading>
          <Box>
            <Select value={read} onChange={(e) => setRead(e.target.value)}>
              {readFunctions?.map((f, i) => (
                <option value={f.name} key={i}>
                  {f.name}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
        <Text>
          Once you setup your contract, you can read data from contract
          functions as follows.
        </Text>
        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={formatSnippet(COMMANDS.read as any, {
            contractAddress,
            fn: read,
            args: readFunctions
              ?.find((f) => f.name === read)
              ?.inputs?.map((i) => i.name),
          })}
        />
      </Card>
      <Card as={Flex} flexDirection="column" gap={3}>
        <Flex align="center" justify="space-between">
          <Heading size="title.sm">Writing Data</Heading>
          <Box>
            <Select
              width="200px"
              value={write}
              onChange={(e) => setWrite(e.target.value)}
            >
              {writeFunctions?.map((f, i) => (
                <option value={f.name} key={i}>
                  {f.name}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
        <Text>
          And you can also make write function calls with the following setup
        </Text>
        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={formatSnippet(COMMANDS.write as any, {
            contractAddress,
            fn: write,
            args: writeFunctions
              ?.find((f) => f.name === write)
              ?.inputs?.map((i, index) => i.name || `arg${index}`),
          })}
        />
      </Card>
    </>
  );
};

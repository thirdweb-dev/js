import { Box, Flex, Select } from "@chakra-ui/react";
import { useContractFunctions } from "@thirdweb-dev/react";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { Environment } from "components/contract-tabs/code/types";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useMemo, useState } from "react";
import { Card, Heading, Text } from "tw-components";
import { SupportedNetwork } from "utils/network";

interface CodeOverviewProps {
  contractAddress?: string;
}

const COMMANDS = {
  install: {
    javascript: "npm install @thirdweb-dev/sdk ethers",
    react: "npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers",
    python: "pip install thirdweb-sdk",
    go: "go get github.com/thirdweb-dev/go-sdk/thirdweb",
  },
  setup: {
    javascript: `import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("{{chainName}}");
const contract = await sdk.getContract("{{contract_address}}");`,
    react: `import { useContract } from "@thirdweb-dev/react";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  // Now you can use the contract in the rest of the component
}`,
    python: `from thirdweb import ThirdwebSDK

sdk = ThirdwebSDK("{{chainName}}")
contract = sdk.get_contract("{{contract_address}}")`,
    go: `import "github.com/thirdweb-dev/go-sdk/thirdweb"

sdk, err := thirdweb.NewThirdwebSDK("{{chainName}}")
contract, err := sdk.GetContract("{{contract_address}}")
`,
  },
  read: {
    javascript: `const data = await contract.call("{{function}}", {{args}})`,
    react: `import { useContract, useContractData } from "@thirdweb-dev/react";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  const { data, isLoading } = useContractData(contract, "{{function}}", {{args}})
}`,
    python: `data = contract.call("{{function}}", {{args}})`,
    go: `data, err := contract.Call("{{function}}", {{args}})`,
  },
  write: {
    javascript: `const data = await contract.call("{{function}}", {{args}})`,
    react: `import { useContract, useContractCall } from "@thirdweb-dev/react";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  const { mutateAsync: {{function}}, isLoading } = useContractCall(contract, "{{function}}")

  const call = async () => {
    try{
      const data = await {{function}}({ {{args}} });
      console.log("contract call successs", data);
    }catch(err){
      console.error("contract call failure", err);
    }
  }
}`,
    python: `data = contract.call("{{function}}", {{args}})`,
    go: `data, err := contract.Call("{{function}}", {{args}})`,
  },
};

interface SnippetOptions {
  contractAddress?: string;
  fn?: string;
  args?: string[];
  chainName?: string;
}

function formatSnippet(
  snippet: Record<Environment, any>,
  { contractAddress, fn, args, chainName }: SnippetOptions,
) {
  const code = { ...snippet };
  for (const key of Object.keys(code)) {
    const env = key as Environment;

    code[env] = code[env]
      ?.replace(/{{contract_address}}/gm, contractAddress)
      ?.replace(/{{chainName}}/gm, chainName || "goerli")
      ?.replace(/{{function}}/gm, fn || "");

    if (args && args.length) {
      code[env] = code[env]?.replace(/{{args}}/gm, args?.join(", ") || "");
    } else {
      code[env] = code[env]
        ?.replace(", {{args}}", "")
        ?.replace("{{args}}, ", "");
    }
  }

  return code;
}

export const CodeOverview: React.FC<CodeOverviewProps> = ({
  contractAddress,
}) => {
  const chainName = useSingleQueryParam<SupportedNetwork>("network");
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
          snippet={formatSnippet(COMMANDS.setup as any, {
            contractAddress,
            chainName,
          })}
          hideTabs
        />
      </Card>
      <Card as={Flex} flexDirection="column" gap={3}>
        <Flex align="center" justify="space-between">
          <Heading size="title.sm">Reading Data</Heading>
          <Box>
            <Select
              variant="outline"
              value={read}
              onChange={(e) => setRead(e.target.value)}
            >
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
            chainName,
          })}
        />
      </Card>
      <Card as={Flex} flexDirection="column" gap={3}>
        <Flex align="center" justify="space-between">
          <Heading size="title.sm">Writing Data</Heading>
          <Box>
            <Select
              variant="outline"
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
            chainName,
          })}
        />
      </Card>
    </>
  );
};

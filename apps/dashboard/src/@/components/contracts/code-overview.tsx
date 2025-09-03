"use client";
import {
  type Abi,
  type AbiEvent,
  type AbiFunction,
  formatAbiItem,
} from "abitype";
import { CircleAlertIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import * as ERC4337Ext from "thirdweb/extensions/erc4337";
import { useActiveAccount } from "thirdweb/react";
import { toFunctionSelector } from "thirdweb/utils";
import { getContractFunctionsFromAbi } from "@/api/contract/getContractFunctionsFromAbi";
import {
  type CodeEnvironment,
  CodeSegment,
} from "@/components/blocks/code/code-segment.client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TabButtons } from "@/components/ui/tabs";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useContractEvents } from "@/hooks/contract-hooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const COMMANDS = {
  events: {
    javascript: `import { prepareEvent, getContractEvents } from "thirdweb";

const preparedEvent = prepareEvent({
  signature: "{{function}}"
});
const events = await getContractEvents({
  contract,
  events: [preparedEvent]
});`,
    react: `import { prepareEvent } from "thirdweb";
import { useContractEvents } from "thirdweb/react";

const preparedEvent = prepareEvent({
  signature: "{{function}}"
});

export default function Component() {
  const { data: event } = useContractEvents({
    contract,
    events: [preparedEvent]
  });
}`,
    "react-native": `import { prepareEvent } from "thirdweb";
import { useContractEvents } from "thirdweb/react";

const preparedEvent = prepareEvent({
  signature: "{{function}}"
});

export default function Component() {
  const { data: event } = useContractEvents({
    contract,
    events: [preparedEvent]
  });
}`,
    unity: `using Thirdweb;

// Get your contract
var contract = await ThirdwebManager.Instance.GetContract(
  address: "{{contract_address}}", 
  chainId: {{chainId}},
);

// Listen to contract events
var events = await contract.Events("{{function}}");`,
    dotnet: `using Thirdweb;

// Get your contract
var contract = await ThirdwebContract.Create(client, "{{contract_address}}", {{chainId}});

// Listen to contract events
var events = await contract.Events("{{function}}");`,
  },
  install: {
    javascript: "npm i thirdweb",
    react: "npm i thirdweb",
    "react-native": "npm i thirdweb",
    unity: `// Download the .unitypackage from the latest release:
// https://github.com/thirdweb-dev/unity-sdk/releases
// and drag it into your project`,
    dotnet: `// Download the .unitypackage from the latest release:
// https://github.com/thirdweb-dev/unity-sdk/releases
// and drag it into your project`,
  },
  read: {
    javascript: `import { readContract } from "thirdweb";

const data = await readContract({
  contract,
  method: "{{function}}",
  params: [{{args}}]
})`,
    react: `import { useReadContract } from "thirdweb/react";

export default function Component() {
  const { data, isPending } = useReadContract({
    contract,
    method: "{{function}}",
    params: [{{args}}]
  });
}`,
    "react-native": `import { useReadContract } from "thirdweb/react";

export default function Component() {
  const { data, isPending } = useReadContract({
    contract,
    method: "{{function}}",
    params: [{{args}}]
  });
}`,
    unity: `using Thirdweb;

// Get your contract
var contract = await ThirdwebManager.Instance.GetContract(
  address: "{{contract_address}}", 
  chainId: {{chainId}}
);

// Read from the contract
var result = await contract.Read<T>(
  "{{function}}",
  {{args}}
);`,
    dotnet: `using Thirdweb;

// Get your contract
var contract = await ThirdwebContract.Create(
  client,
  "{{contract_address}}",
  {{chainId}}
);

// Read from the contract
var result = await contract.Read<T>(
  "{{function}}",
  {{args}}
);`,
  },
  setup: {
    javascript: `import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// create the client with your clientId, or secretKey if in a server environment
const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID"
 });

// connect to your contract
const contract = getContract({
  client,
  chain: defineChain({{chainId}}),
  address: "{{contract_address}}"
});`,
    react: `import { createThirdwebClient, getContract, resolveMethod } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";

// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID"
});

// connect to your contract
export const contract = getContract({
  client,
  chain: defineChain({{chainId}}),
  address: "{{contract_address}}"
});

function App() {
  return (
    <ThirdwebProvider>
      <Component />
    </ThirdwebProvider>
  )
}`,
    "react-native": `import { createThirdwebClient, getContract, resolveMethod } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";

// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID"
});

// connect to your contract
export const contract = getContract({
  client,
  chain: defineChain({{chainId}}),
  address: "{{contract_address}}",
});

function App() {
  return (
    <ThirdwebProvider>
      <Component />
    </ThirdwebProvider>
  )
}
`,
    unity: `using Thirdweb;

// Get your contract
var contract = await ThirdwebManager.Instance.GetContract(
  address: "{{contract_address}}", 
  chainId: {{chainId}}
);`,
    dotnet: `using Thirdweb;

// Get your contract
var contract = await ThirdwebContract.Create(
  client,
  "{{contract_address}}",
  {{chainId}
);`,
  },
  write: {
    javascript: `import { prepareContractCall, sendTransaction } from "thirdweb";

const transaction = await prepareContractCall({
  contract,
  method: "{{function}}",
  params: [{{args}}]
});
const { transactionHash } = await sendTransaction({
  transaction,
  account
});`,
    react: `import { prepareContractCall } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";

export default function Component() {
  const { mutate: sendTransaction } = useSendTransaction();

  const onClick = () => {
    const transaction = prepareContractCall({
      contract,
      method: "{{function}}",
      params: [{{args}}]
    });
    sendTransaction(transaction);
  }
}`,
    "react-native": `import { prepareContractCall } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";

export default function Component() {
  const { mutate: sendTransaction } = useSendTransaction();

  const onClick = () => {
    const transaction = prepareContractCall({
      contract,
      method: "{{function}}",
      params: [{{args}}]
    });
    sendTransaction(transaction);
  }
}`,
    unity: `using Thirdweb;

// Get your contract
var contract = await ThirdwebManager.Instance.GetContract(
  address: "{{contract_address}}", 
  chainId: {{chainId}}
);

// Write to the contract
var transactionReceipt = await contract.Write(
  wallet,
  contract,
  "{{function}}",
  weiValue,
  {{args}}
);`,
    dotnet: `using Thirdweb;

// Get your contract
var contract = await ThirdwebContract.Create(
  client,
  "{{contract_address}}",
  {{chainId}}
);

// Write to the contract
var transactionReceipt = await contract.Write(
  wallet,
  contract,
  "{{function}}",
  weiValue,
  {{args}}
);`,
  },
  api: {
    read: `const response = await fetch('https://api.thirdweb.com/v1/contracts/read', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-secret-key': '<YOUR_SECRET_KEY>'
  },
  body: JSON.stringify({
    calls: [
      {
        contractAddress: "{{contract_address}}",
        method: "{{function}}",
        params: [{{args}}]
      }
    ],
    chainId: {{chainId}}
  })
});

const data = await response.json();`,
    write: `const response = await fetch('https://api.thirdweb.com/v1/contracts/write', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-secret-key': '<YOUR_SECRET_KEY>'
  },
  body: JSON.stringify({
    calls: [
      {
        contractAddress: "{{contract_address}}",
        method: "{{function}}",
        params: [{{args}}]
      }
    ],
    chainId: {{chainId}},
    from: "<YOUR_WALLET_ADDRESS>"
  })
});

const data = await response.json();`,
    events: `const response = await fetch('https://api.thirdweb.com/v1/contracts/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-secret-key': '<YOUR_SECRET_KEY>'
  },
  body: JSON.stringify({
    contractAddress: "{{contract_address}}",
    eventName: "{{function}}",
    chainId: {{chainId}}
  })
});

const data = await response.json();`,
  },
  curl: {
    read: `curl https://api.thirdweb.com/v1/contracts/read \\
  --request POST \\
  --header 'Content-Type: application/json' \\
  --header 'x-client-id: <YOUR_CLIENT_ID>' \\
  --data '{
  "calls": [
    {
      "contractAddress": "{{contract_address}}",
      "method": "{{function}}",
      "params": [{{args}}]
    }
  ],
  "chainId": {{chainId}}
}'`,
    write: `curl -X POST https://api.thirdweb.com/v1/contracts/write \\
-H "Content-Type: application/json" \\
-H "x-secret-key: <YOUR_SECRET_KEY>" \\
-d '{
  "calls": [
    {
      "contractAddress": "{{contract_address}}",
      "method": "{{function}}",
      "params": [{{args}}]
    }
  ],
  "chainId": {{chainId}},
  "from": "<YOUR_WALLET_ADDRESS>"
}'`,
    events: `curl https://api.thirdweb.com/v1/contracts/events \\
  --request POST \\
  --header 'Content-Type: application/json' \\
  --header 'x-secret-key: <YOUR_SECRET_KEY>' \\
  --data '{
  "contractAddress": "{{contract_address}}",
  "eventName": "{{function}}",
  "chainId": {{chainId}}
}'`,
  },
};

const WALLETS_SNIPPETS = [
  {
    description: "Deploy accounts for your users",
    iconUrl:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/smart-wallet.svg",
    id: "smart-wallet",
    link: "https://portal.thirdweb.com/references/typescript/v5/smartWallet",
    name: "Account Abstraction",
    supportedLanguages: {
      javascript: `import { defineChain } from "thirdweb";
import { inAppWallet, smartWallet } from "thirdweb/wallets";

const chain = defineChain({{chainId}});

// First, connect the personal wallet, which can be any wallet (metamask, in-app, etc.)
const personalWallet = inAppWallet();
const personalAccount = await personalWallet.connect({
  client,
  chain,
  strategy: "google",
});

// Then, connect the Smart Account
const wallet = smartWallet({
  chain, // the chain where your account will be or is deployed
  factoryAddress: "{{factory_address}}", // your own deployed account factory address
  gasless: true, // enable or disable gasless transactions
});
const smartAccount = await wallet.connect({
  client,
  personalWallet,
});`,
      react: `import { defineChain } from "thirdweb";
import { ThirdwebProvider, ConnectButton } from "thirdweb/react";

export default function App() {
return (
    <ThirdwebProvider>
      <ConnectButton
        client={client}
        accountAbstraction={{
          chain: defineChain({{chainId}}),
          factoryAddress: "{{factory_address}}",
          gasless: true,
        }}
      />
    </ThirdwebProvider>
  );
}`,
      unity: `using Thirdweb;

public async void ConnectWallet()
{
    // Reference to your Thirdweb SDK
    var sdk = ThirdwebManager.Instance.SDK;

    // Configure the connection
    var connection = new WalletConnection(
      provider: WalletProvider.SmartWallet,        // The wallet provider you want to connect to (Required)
      chainId: 1,                                  // The chain you want to connect to (Required)
      password: "myEpicPassword",                  // If using a local wallet as personal wallet (Optional)
      email: "email@email.com",                    // If using an email wallet as personal wallet (Optional)
      personalWallet: WalletProvider.LocalWallet   // The personal wallet you want to use with your Account (Optional)
    );

    // Connect the wallet
    string address = await sdk.wallet.Connect(connection);
}`,
    },
  },
];

function buildJavascriptSnippet(args: {
  extensionName: string;
  extensionNamespace: string;
  type: "read" | "write" | "event";
  fnArgs: string[];
}) {
  const importStatement = `import { ${args.type === "read" ? "readContract" : args.type === "write" ? "sendTransaction" : "getContractEvents"} } from "thirdweb";
import { ${args.extensionName} } from "thirdweb/extensions/${args.extensionNamespace}";`;

  switch (args.type) {
    case "read": {
      return `${importStatement}

const data = await readContract(${args.extensionName}, {
  contract,${args.fnArgs.map((arg) => `\n  ${arg}`).join(",")}
});`;
    }
    case "write": {
      return `${importStatement}

const transaction = ${args.extensionName}({
  contract,${args.fnArgs.map((arg) => `\n  ${arg}`).join(",")}
});

const { transactionHash } = await sendTransaction({
  transaction,
  account
});`;
    }
    case "event": {
      return `${importStatement}

const preparedEvent = ${args.extensionName}({
  contract
});

const events = await getContractEvents({
  contract,
  events: [preparedEvent]
});`;
    }
  }
}

function buildReactSnippet(args: {
  extensionName: string;
  extensionNamespace: string;
  type: "read" | "write" | "event";
  fnArgs: string[];
}) {
  const importStatement = `import { use${args.type === "read" ? "ReadContract" : args.type === "write" ? "SendTransaction" : "ContractEvents"} } from "thirdweb/react";
import { ${args.extensionName} } from "thirdweb/extensions/${args.extensionNamespace}";`;

  switch (args.type) {
    case "read": {
      return `${importStatement}

const { data, isPending } = useReadContract(${args.extensionName}, {
  contract,${args.fnArgs.map((arg) => `\n  ${arg}`).join(",")}
});`;
    }
    case "write": {
      return `${importStatement}

const { mutate: sendTransaction } = useSendTransaction();

const onClick = () => {
  const transaction = ${args.extensionName}({
    contract,${args.fnArgs.map((arg) => `\n    ${arg}`).join(",")}
  });
  sendTransaction(transaction);
};`;
    }
    case "event": {
      return `${importStatement}

const preparedEvent = ${args.extensionName}({
  contract
});

const { data: event } = useContractEvents({
  contract,
  events: [preparedEvent]
});`;
    }
  }
}

/**
 * This is a temporary solution to provide code snippets for the different extensions.
 */
const EXTENSION_NAMESPACE_FUNCTION_MAPPING = {
  erc20: {
    claim: {
      args: ["to", "amount"],
      name: "claimTo",
    },
  },
  erc721: {
    claim: {
      args: ["to", "amount"],
      name: "claimTo",
    },
  },
  erc1155: {
    claim: {
      args: ["to", "amount", "tokenId"],
      name: "claimTo",
    },
  },
} as Record<
  string,
  Record<
    string,
    {
      name: string;
      args: string[];
    }
  >
>;

type SnippetOptions = {
  contractAddress?: string;
  fn?: AbiFunction | AbiEvent;
  args?: string[];
  address?: string;
  clientId?: string;
  chainId?: number;
  extensionNamespace?: string;
};

export function formatSnippet(
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  snippet: Partial<Record<CodeEnvironment, any>>,
  {
    contractAddress,
    fn,
    args,
    chainId,
    address,
    clientId,
    extensionNamespace,
  }: SnippetOptions,
) {
  const code = { ...snippet };

  const formattedAbi = fn
    ? formatAbiItem({
        ...fn,
        type: "stateMutability" in fn ? "function" : "event",
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
      } as any)
    : "";

  for (const key of Object.keys(code)) {
    const env = key as CodeEnvironment;

    let codeForEnv = code[env];

    // hacks on hacks on hacks
    if (
      fn?.name &&
      extensionNamespace &&
      extensionNamespace in EXTENSION_NAMESPACE_FUNCTION_MAPPING &&
      EXTENSION_NAMESPACE_FUNCTION_MAPPING[extensionNamespace] &&
      fn.name in EXTENSION_NAMESPACE_FUNCTION_MAPPING[extensionNamespace]
    ) {
      const extensionConfig =
        EXTENSION_NAMESPACE_FUNCTION_MAPPING[extensionNamespace][fn.name];

      if (!extensionConfig) {
        continue;
      }

      switch (env) {
        case "javascript":
          codeForEnv = buildJavascriptSnippet({
            extensionName: extensionConfig.name,
            extensionNamespace,
            fnArgs: extensionConfig.args,
            type:
              "stateMutability" in fn
                ? fn.stateMutability === "view" || fn.stateMutability === "pure"
                  ? "read"
                  : "write"
                : "event",
          });
          break;
        case "react":
        case "react-native":
          codeForEnv = buildReactSnippet({
            extensionName: extensionConfig.name,
            extensionNamespace,
            fnArgs: extensionConfig.args,
            type:
              "stateMutability" in fn
                ? fn.stateMutability === "view" || fn.stateMutability === "pure"
                  ? "read"
                  : "write"
                : "event",
          });
          break;
        case "api":
          // For API, we don't need special extension handling, just use the standard templates
          break;
      }
    }
    // end hacks on hacks on hacks -- now just hacks on hacks from here on out

    code[env] = codeForEnv
      ?.replace(/{{contract_address}}/gm, contractAddress || "0x...")
      ?.replace(/{{factory_address}}/gm, contractAddress || "0x...")
      ?.replace(/{{wallet_address}}/gm, address || "walletAddress")
      ?.replace("YOUR_CLIENT_ID", clientId || "YOUR_CLIENT_ID")
      ?.replace(/{{function}}/gm, formattedAbi || "")
      ?.replace(/{{chainId}}/gm, chainId?.toString() || "1");

    if (args?.some((arg) => arg)) {
      code[env] = code[env]?.replace(/{{args}}/gm, args?.join(", ") || "");
    } else {
      code[env] = code[env]?.replace(/{{args}}/gm, "");
    }
  }

  return code;
}

export function CodeOverview(props: {
  abi?: Abi;
  contractAddress?: string;
  onlyInstall?: boolean;
  chainId: number;
  noSidebar?: boolean;
}) {
  const {
    abi,
    contractAddress = "0x...",
    onlyInstall = false,
    noSidebar = false,
    chainId,
  } = props;

  const searchParams = useSearchParams();
  const defaultEnvironment = searchParams?.get("environment") as
    | CodeEnvironment
    | undefined;

  const [environment, setEnvironment] = useState<CodeEnvironment>(
    defaultEnvironment || "api",
  );

  const [tab, setTab] = useState("write");

  const address = useActiveAccount()?.address;
  const isMobile = useIsMobile();

  const functionSelectors = useMemo(() => {
    return (abi || [])
      .filter((a) => a.type === "function")
      .map((fn) => toFunctionSelector(fn));
  }, [abi]);

  const isAccountFactory = useMemo(() => {
    return [
      ERC4337Ext.isGetAllAccountsSupported(functionSelectors),
      ERC4337Ext.isGetAccountsSupported(functionSelectors),
      ERC4337Ext.isTotalAccountsSupported(functionSelectors),
      ERC4337Ext.isGetAccountsOfSignerSupported(functionSelectors),
      ERC4337Ext.isPredictAccountAddressSupported(functionSelectors),
    ].every(Boolean);
  }, [functionSelectors]);
  const isERC20 = useMemo(
    () => ERC20Ext.isERC20(functionSelectors),
    [functionSelectors],
  );
  const isERC721 = useMemo(() => {
    // this will have to do for now
    return [ERC721Ext.isGetNFTsSupported(functionSelectors)].every(Boolean);
  }, [functionSelectors]);

  const isERC1155 = useMemo(() => {
    // this will have to do for now
    return [ERC1155Ext.isGetNFTsSupported(functionSelectors)].every(Boolean);
  }, [functionSelectors]);

  const extensionNamespace = useMemo(() => {
    if (isERC20) {
      return "erc20";
    }
    if (isERC721) {
      return "erc721";
    }
    if (isERC1155) {
      return "erc1155";
    }
    return undefined;
  }, [isERC20, isERC721, isERC1155]);

  const { idToChain } = useAllChainsData();
  const chainInfo = chainId ? idToChain.get(chainId) : undefined;

  const functions = getContractFunctionsFromAbi(abi || []);
  const events = useContractEvents(abi as Abi);
  const { readFunctions, writeFunctions } = useMemo(() => {
    return {
      readFunctions: functions?.filter(
        (f) => f.stateMutability === "view" || f.stateMutability === "pure",
      ),
      writeFunctions: functions?.filter(
        (f) => f.stateMutability !== "view" && f.stateMutability !== "pure",
      ),
    };
  }, [functions]);

  const [read, setRead] = useState(
    readFunctions && readFunctions.length > 0 ? readFunctions[0] : undefined,
  );
  const [write, setWrite] = useState(
    writeFunctions && writeFunctions.length > 0 ? writeFunctions[0] : undefined,
  );
  const [event, setEvent] = useState(
    events && events.length > 0 ? events[0] : undefined,
  );

  const tabList = useMemo(() => {
    const _tablist: Array<{
      name: string;
      onClick: () => void;
      isActive: boolean;
    }> = [];

    if (writeFunctions && writeFunctions.length > 0) {
      _tablist.push({
        name: "Write",
        onClick: () => setTab("write"),
        isActive: tab === "write",
      });
    }

    if (readFunctions && readFunctions.length > 0) {
      _tablist.push({
        name: "Read",
        onClick: () => setTab("read"),
        isActive: tab === "read",
      });
    }

    if (events && events.length > 0) {
      _tablist.push({
        name: "Events",
        onClick: () => setTab("events"),
        isActive: tab === "events",
      });
    }

    return _tablist;
  }, [writeFunctions, readFunctions, events, tab]);

  return (
    <div className="space-y-12">
      {isAccountFactory && (
        <AccountFactorySection
          address={address}
          chainId={chainId}
          contractAddress={contractAddress}
          environment={environment}
          setEnvironment={setEnvironment}
        />
      )}

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {isAccountFactory
              ? "Direct contract interaction (advanced)"
              : chainInfo
                ? "Interact with this contract from your app"
                : "Getting Started"}
          </h2>
        </div>
        {(noSidebar || isMobile) && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Choose a language:</p>
            <CodeSegment
              environment={environment}
              onlyTabs
              setEnvironment={setEnvironment}
              snippet={COMMANDS.install}
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          {environment === "react-native" || environment === "unity" ? (
            <p className="text-sm text-muted-foreground">
              Install the latest version of the SDK.{" "}
              <UnderlineLink
                className="text-primary-500"
                href={`https://portal.thirdweb.com/${environment}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn how in the{" "}
                {environment === "react-native" ? "React Native" : "Unity"}{" "}
                documentation
              </UnderlineLink>
              .
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Install the latest version of the SDK:
              </p>
              <CodeSegment
                environment={environment}
                hideTabs
                isInstallCommand
                setEnvironment={setEnvironment}
                snippet={COMMANDS.install}
              />
            </>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Initialize the SDK and contract on your project:
          </p>
          <CodeSegment
            environment={environment}
            hideTabs
            setEnvironment={setEnvironment}
            snippet={formatSnippet(COMMANDS.setup, {
              chainId,
              contractAddress,
            })}
          />
          <p className="text-sm text-muted-foreground">
            You will need to pass a client ID/secret key to use thirdweb&apos;s
            infrastructure services. If you don&apos;t have any API keys yet you
            can create one by creating a project for free from the{" "}
            <UnderlineLink href="/team">dashboard</UnderlineLink>.
          </p>
        </div>
      </div>

      {!onlyInstall && (
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-3">
            All Functions & Events
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
            <div className="border bg-card rounded-lg overflow-hidden ">
              {(writeFunctions || []).length > 0 ||
              (readFunctions || []).length > 0 ? (
                <div>
                  {/* tabs */}
                  <div className="bg-background">
                    <TabButtons
                      tabs={tabList}
                      tabContainerClassName="px-3 pt-2"
                    />
                  </div>

                  {tab === "write" && (
                    <AccentButtonListContainer>
                      {writeFunctions?.map((fn) => (
                        <AccentButton
                          isActive={write?.signature === fn.signature}
                          key={fn.signature}
                          label={fn.name}
                          onClick={() => {
                            setTab("write");
                            setWrite(fn);
                          }}
                        />
                      ))}
                    </AccentButtonListContainer>
                  )}

                  {tab === "read" && (
                    <AccentButtonListContainer>
                      {readFunctions?.map((fn) => (
                        <AccentButton
                          isActive={read?.signature === fn.signature}
                          key={fn.signature}
                          onClick={() => {
                            setTab("read");
                            setRead(fn);
                          }}
                          label={fn.name}
                        />
                      ))}
                    </AccentButtonListContainer>
                  )}

                  {tab === "events" && (
                    <AccentButtonListContainer>
                      {events?.map((ev) => (
                        <AccentButton
                          isActive={event?.name === ev.name}
                          key={ev.name}
                          onClick={() => {
                            setTab("events");
                            setEvent(ev);
                          }}
                          label={ev.name}
                        />
                      ))}
                    </AccentButtonListContainer>
                  )}
                </div>
              ) : null}
            </div>
            <CodeSegment
              environment={environment}
              setEnvironment={setEnvironment}
              snippet={formatSnippet(
                // biome-ignore lint/suspicious/noExplicitAny: FIXME
                COMMANDS[tab as keyof typeof COMMANDS] as any,
                {
                  args:
                    abi
                      ?.filter(
                        (f) => f.type === "function" || f.type === "event",
                      )
                      ?.find(
                        (f) =>
                          f.name ===
                          (tab === "read"
                            ? read?.name
                            : tab === "write"
                              ? write?.name
                              : event?.name),
                      )
                      ?.inputs.map((i) => i.name || "") || [],

                  chainId,
                  contractAddress,
                  extensionNamespace,
                  fn: tab === "read" ? read : tab === "write" ? write : event,
                },
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AccentButtonListContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 px-2 py-3 max-h-[300px] lg:max-h-[700px] overflow-y-auto">
      {props.children}
    </div>
  );
}

function AccentButton(props: {
  isActive: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      className={cn(
        "text-sm justify-start h-auto py-1.5 px-2 text-muted-foreground font-normal font-mono",
        props.isActive && "text-foreground bg-accent",
      )}
      onClick={props.onClick}
      size="sm"
      variant="ghost"
    >
      {props.label}
    </Button>
  );
}

function AccountFactorySection(props: {
  environment: CodeEnvironment;
  setEnvironment: (environment: CodeEnvironment) => void;
  address?: string;
  chainId: number;
  contractAddress: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Integrate your account factory
        </h2>
        <Alert variant="info">
          <CircleAlertIcon className="w-5 h-5 text-blue-500" />
          <AlertTitle>Account Factory</AlertTitle>
          <AlertDescription>
            The recommended way to use account factories is to integrate the{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/transactions/sponsor"
              rel="noopener noreferrer"
              target="_blank"
            >
              thirdweb SDK
            </UnderlineLink>{" "}
            in your applications. This will ensure account contracts are
            deployed for your users only when they need it.
          </AlertDescription>
        </Alert>
      </div>
      <div className="flex flex-col gap-2">
        <CodeSegment
          environment={props.environment}
          hideTabs
          setEnvironment={props.setEnvironment}
          snippet={formatSnippet(
            (WALLETS_SNIPPETS.find((w) => w.id === "smart-wallet")
              ?.supportedLanguages || {}) as Record<CodeEnvironment, string>,
            {
              address: props.address,
              chainId: props.chainId,
              contractAddress: props.contractAddress,
            },
          )}
        />
      </div>
    </div>
  );
}

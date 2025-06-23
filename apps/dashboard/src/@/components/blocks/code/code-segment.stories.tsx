import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeContainer } from "@/storybook/utils";
import { type CodeEnvironment, CodeSegment } from "./code-segment.client";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "blocks/CodeSegment",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

type Mode = "default" | "no-tabs" | "only-tabs";

function Story() {
  const [mode, setMode] = useState<Mode>("default");
  const modes: Mode[] = ["default", "no-tabs", "only-tabs"];

  return (
    <div className="container flex max-w-[700px] flex-col gap-10 py-10">
      <Select
        onValueChange={(v) => {
          setMode(v as Mode);
        }}
        value={mode}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {modes.map((item) => {
              return (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Variant envsToShow={["javascript"]} mode={mode} storyLabel="1 env" />

      <Variant
        envsToShow={["javascript", "typescript"]}
        mode={mode}
        storyLabel="2 envs"
      />

      <Variant
        envsToShow={[
          "javascript",
          "typescript",
          "react",
          "react-native",
          "unity",
        ]}
        mode={mode}
        storyLabel="5 envs"
      />
    </div>
  );
}

function Variant(props: {
  envsToShow: CodeEnvironment[];
  storyLabel: string;
  mode: Mode;
}) {
  const [env, setEnv] = useState<CodeEnvironment>(
    props.envsToShow[0] || "javascript",
  );
  return (
    <BadgeContainer label={props.storyLabel}>
      <CodeSegment
        environment={env}
        hideTabs={props.mode === "no-tabs"}
        onlyTabs={props.mode === "only-tabs"}
        setEnvironment={setEnv}
        snippet={{
          javascript: props.envsToShow.includes("javascript")
            ? jsCode
            : undefined,
          react: props.envsToShow.includes("react") ? jsxCode : undefined,
          "react-native": props.envsToShow.includes("react-native")
            ? jsxCode
            : undefined,
          typescript: props.envsToShow.includes("typescript")
            ? tsCode
            : undefined,
          unity: props.envsToShow.includes("unity") ? unityCode : undefined,
        }}
      />
    </BadgeContainer>
  );
}

const jsCode = `\
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";

const contract = getContract({
  client,
  address: "0x1234...",
  chain: sepolia,
});
`;

const jsxCode = `\
import { ThirdwebProvider } from "thirdweb/react";

function Main() {
  return (
    <ThirdwebProvider>
      <App />
    </ThirdwebProvider>
  );
}`;

const unityCode = `\
using Thirdweb;

// Reference the SDK
var sdk = ThirdwebManager.Instance.SDK;

// Create data
NFTMetadata meta = new NFTMetadata()
{
    name = "Unity NFT",
    description = "Minted From Unity",
    image = "ipfs://QmbpciV7R5SSPb6aT9kEBAxoYoXBUsStJkMpxzymV4ZcVc",
};
string metaJson = Newtonsoft.Json.JsonConvert.SerializeObject(meta);

// Upload raw text or from a file path
var response = await ThirdwebManager.Instance.SDK.storage.UploadText(metaJson);`;

const tsCode = `\
type User = {
  name: string;
  age: number;
}

function logUser(user: User) {
  console.log(user)
}
`;

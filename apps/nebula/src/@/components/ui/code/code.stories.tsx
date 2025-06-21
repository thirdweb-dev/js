import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "@/storybook/utils";
import { CodeClient } from "./code.client";

const meta = {
  component: Component,
  parameters: {},
  title: "code/lang",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

const tsCode = `\
type User = {
  name: string;
  age: number;
}

function logUser(user: User) {
  console.log(user)
}
`;

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

const tsxCode = `\
type User = {
  name: string;
  age: number;
}

function UserInfo(props: { user: User }) {
  return <div> {props.user.name} </div>
}
`;

const tsxCodeWithFormError = `\
// This piece of code has invalid syntax and can't be formatted by prettier
// this should not crash the page - and be rendered as is without formatting
// the format error is logged in console

type User = // missing { here
  name: string;
  age: number;
}

function UserInfo(props: { user: User }) {
  return <div> {props.user.name} </div>
}
`;

const bashCode = "pnpm i thirdweb";

function Component() {
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <BadgeContainer label="ts">
        <CodeClient code={tsCode} lang="ts" />
      </BadgeContainer>

      <BadgeContainer label="js">
        <CodeClient code={jsCode} lang="js" />
      </BadgeContainer>

      <BadgeContainer label="bash">
        <CodeClient code={bashCode} lang="bash" />
      </BadgeContainer>

      <BadgeContainer label="jsx">
        <CodeClient code={jsxCode} lang="jsx" />
      </BadgeContainer>

      <BadgeContainer label="tsx">
        <CodeClient code={tsxCode} lang="tsx" />
      </BadgeContainer>

      <BadgeContainer label="tsx">
        <CodeClient code={tsxCodeWithFormError} lang="tsx" />
      </BadgeContainer>
    </div>
  );
}

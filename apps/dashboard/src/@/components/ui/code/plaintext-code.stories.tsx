import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { PlainTextCodeBlock } from "./plaintext-code";

const meta = {
  title: "code/plaintext",
  component: Component,
  parameters: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

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

const overflowText =
  "123456789abcdefghijklmnopqrstuvwxyz123456789abcdefghijklmnopqrstuvwxyz123456789abcdefghijklmnopqrstuvwxyz123456789abcdefghijklmnopqrstuvwxyz123456789abcdefghijklmnopqrstuvwxyz123456789abcdefghijklmnopqrstuvwxyz";

function Component() {
  return (
    <div className="container flex max-w-[600px] flex-col gap-10 py-10">
      <BadgeContainer label="large chunk of code">
        <PlainTextCodeBlock code={jsCode} />
      </BadgeContainer>

      <BadgeContainer label="overflow test">
        <PlainTextCodeBlock code={overflowText} />
      </BadgeContainer>
    </div>
  );
}

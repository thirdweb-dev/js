import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { storybookThirdwebClient } from "@/storybook/utils";
import { FundWalletModal } from "./index";

const meta: Meta<typeof FundWalletModal> = {
  title: "Blocks/FundWalletModal",
  component: Variant,
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <div className="p-10">
          <ConnectButton client={storybookThirdwebClient} />
          <div className="h-4" />
          <Story />
        </div>
      </ThirdwebProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Test: Story = {
  args: {},
};
function Variant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Open
      </Button>

      <FundWalletModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="This is a title"
        description="This is a description"
        recipientAddress="0x83Dd93fA5D8343094f850f90B3fb90088C1bB425"
        client={storybookThirdwebClient}
      />
    </div>
  );
}

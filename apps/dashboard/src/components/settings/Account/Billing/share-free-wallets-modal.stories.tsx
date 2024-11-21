import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { mobileViewport } from "../../../../stories/utils";
import { ShareFreeWalletsModal } from "./share-free-wallets-modal.client";

const meta = {
  title: "Billing/Coupons/ShareFreeWalletsModal",
  component: Variants,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Variants>;

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

function Variants() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex grow items-center justify-center p-6">
      <Button onClick={() => setIsOpen(true)}>Open Again</Button>
      <ShareFreeWalletsModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}

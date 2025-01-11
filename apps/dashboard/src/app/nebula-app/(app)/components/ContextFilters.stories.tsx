import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toaster } from "sonner";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import type { ContextFilters } from "../api/chat";
import ContextFiltersButton from "./ContextFilters";

const meta = {
  title: "Nebula/ContextFilters",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

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

function Story() {
  return (
    <div className="container flex max-w-[1000px] flex-col gap-8 py-10 lg:p-10">
      <Variant contextFilters={undefined} label="No Filters Set" />

      <Variant
        contextFilters={{
          chainIds: ["137"],
        }}
        label="1 chain"
      />

      <Variant
        contextFilters={{
          chainIds: ["137", "10", "421614"],
        }}
        label="Few chains"
      />

      <Variant
        contextFilters={{
          contractAddresses: ["0x1E51e33F9838A5a043E099C60409f62aA564272f"],
        }}
        label="1 contract"
      />

      <Variant
        contextFilters={{
          contractAddresses: [
            "0x1E51e33F9838A5a043E099C60409f62aA564272f",
            "0xF61c8d5492139b40af09bDB353733d5F0a348aCf",
          ],
        }}
        label="Few contracts"
      />

      <Variant
        contextFilters={{
          walletAddresses: ["0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37"],
        }}
        label="1 wallet"
      />

      <Variant
        contextFilters={{
          walletAddresses: [
            "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
            "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425",
          ],
        }}
        label="Few wallets"
      />

      <Variant
        contextFilters={{
          chainIds: ["137", "10", "421614"],
          contractAddresses: [
            "0x1E51e33F9838A5a043E099C60409f62aA564272f",
            "0xF61c8d5492139b40af09bDB353733d5F0a348aCf",
          ],
          walletAddresses: [
            "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
            "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425",
          ],
        }}
        label="chains + wallets + contracts"
      />
      <Toaster richColors />
    </div>
  );
}

function Variant(props: {
  label: string;
  contextFilters: ContextFilters | undefined;
}) {
  const [contextFilters, setContextFilters] = useState<
    ContextFilters | undefined
  >(props.contextFilters);
  return (
    <BadgeContainer label={props.label}>
      <ContextFiltersButton
        contextFilters={contextFilters}
        setContextFilters={setContextFilters}
        updateContextFilters={async (values) => {
          console.log("Updating context filters", values);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
    </BadgeContainer>
  );
}

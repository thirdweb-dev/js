import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import { BadgeContainer, mobileViewport } from "stories/utils";
import {
  type TransferrableModuleFormValues,
  TransferrableModuleUI,
} from "./Transferrable";

const meta = {
  title: "Modules/Transferrable",
  component: Component,
  parameters: {
    layout: "centered",
  },
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

const testAddress1 = "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37";
const testAddress2 = "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425";

function Component() {
  async function updateStub(values: TransferrableModuleFormValues) {
    console.log("submitting", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return (
    <div className="container flex max-w-[1150px] flex-col gap-10 py-10">
      <BadgeContainer label="Empty AllowList, Not Restricted">
        <TransferrableModuleUI
          allowList={[]}
          isPending={false}
          isRestricted={false}
          adminAddress={testAddress1}
          update={updateStub}
        />
      </BadgeContainer>

      <BadgeContainer label="Empty AllowList, Restricted">
        <TransferrableModuleUI
          allowList={[]}
          isPending={false}
          isRestricted={true}
          adminAddress={testAddress1}
          update={updateStub}
        />
      </BadgeContainer>

      <BadgeContainer label="Length 1 AllowList, Restricted">
        <TransferrableModuleUI
          allowList={[testAddress1]}
          isPending={false}
          isRestricted={true}
          adminAddress={testAddress1}
          update={updateStub}
        />
      </BadgeContainer>

      <BadgeContainer label="Length 2 AllowList, Restricted">
        <TransferrableModuleUI
          allowList={[testAddress1, testAddress2]}
          isPending={false}
          isRestricted={true}
          adminAddress={testAddress1}
          update={updateStub}
        />
      </BadgeContainer>

      <BadgeContainer label="Pending">
        <TransferrableModuleUI
          allowList={[]}
          isPending={true}
          adminAddress={testAddress1}
          isRestricted={false}
          update={updateStub}
        />
      </BadgeContainer>

      <Toaster richColors />
    </div>
  );
}

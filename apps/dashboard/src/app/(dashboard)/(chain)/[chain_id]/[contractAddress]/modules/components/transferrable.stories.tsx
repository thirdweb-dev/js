import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import { BadgeContainer, mobileViewport } from "stories/utils";
import {
  type TransferrableModuleFormValues,
  TransferrableModuleUI,
} from "./Transferrable";

import { ThirdwebProvider, useActiveAccount, ConnectButton, useSendTransaction } from "thirdweb/react";
import { createThirdwebClient, getContract } from "thirdweb";
import { anvil } from "thirdweb/chains";
import { useSendBatchTransaction, useReadContract } from "thirdweb/react";
import { TransferableERC721 } from "thirdweb/modules";

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

// TESTING: used to test out the SDK in story book for now
const client = createThirdwebClient({
  //clientId: process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID!,
  secretKey: process.env.DASHBOARD_SECRET_KEY!
});

const contract = getContract({
  client,
  address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  chain: anvil,
});

function AnvilComponent() {
  const account = useActiveAccount();
  const { mutateAsync: sendTransaction, error } = useSendTransaction();
  const { data: isTransferEnabled, isLoading } = useReadContract(TransferableERC721.isTransferEnabled, {
    contract
  });

  async function anvilUpdate(values: TransferrableModuleFormValues) {
    if (isTransferEnabled !== values.isRestricted) {
      const setTransferableTransaction = TransferableERC721.setTransferable({
        contract,
        enableTransfer: values.isRestricted,
      });

      await sendTransaction(setTransferableTransaction)
    }

    const setTransferableForTransactions = values.allowList.map(allowlistedAddress => TransferableERC721.setTransferableFor({
      contract,
      enableTransfer: true,
      target: allowlistedAddress.address,
    }))

    await Promise.allSettled(setTransferableForTransactions.map(transaction => sendTransaction(transaction)))
  };

  return (
    <>
      <ConnectButton client={client} />

      <BadgeContainer label="Anvil localhost test">
        <TransferrableModuleUI
          allowList={[]}
          isPending={isLoading}
          isRestricted={isLoading ? false : isTransferEnabled!}
          adminAddress={account?.address ?? ""}
          update={anvilUpdate}
        />
      </BadgeContainer>
    </>
  )
}

function Component() {

  async function updateStub(values: TransferrableModuleFormValues) {
    console.log("submitting", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[1150px] flex-col gap-10 py-10">

        <AnvilComponent />

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
    </ThirdwebProvider>
  );
}

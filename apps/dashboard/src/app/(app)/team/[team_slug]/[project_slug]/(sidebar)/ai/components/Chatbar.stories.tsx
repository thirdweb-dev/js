import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { BadgeContainer, storybookThirdwebClient } from "@/storybook/utils";
import type { NebulaContext } from "../api/types";
import { ChatBar, type WalletMeta } from "./ChatBar";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "AI/Chatbar",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

const smartWalletAddress = "0x61230342D8D377cA437BdC7CD02C09e09A470500";
const userWalletAddress = "0x2d7B4e58bb163462cba2e705090a4EC56A958F2a";

function Story() {
  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[800px] flex-col gap-14 py-10">
        <Variant
          activeAccountAddress={undefined}
          connectedWallets={[]}
          isStreaming={false}
          label="Not Streaming"
          showContextSelector={true}
        />
        <Variant
          activeAccountAddress={undefined}
          connectedWallets={[]}
          isStreaming={true}
          label="Streaming"
          showContextSelector={true}
        />

        <Variant
          activeAccountAddress={undefined}
          connectedWallets={[]}
          context={{
            chainIds: ["1"],
            networks: null,
            walletAddress: null,
          }}
          isStreaming={false}
          label="1 Chain set in context"
          showContextSelector={true}
        />

        <Variant
          activeAccountAddress={undefined}
          connectedWallets={[]}
          context={{
            chainIds: ["1", "137", "10"],
            networks: null,
            walletAddress: null,
          }}
          isStreaming={false}
          label="3 Chains set in context"
          showContextSelector={true}
        />

        <Variant
          activeAccountAddress={userWalletAddress}
          connectedWallets={[
            {
              address: userWalletAddress,
              walletId: "io.metamask",
            },
          ]}
          context={{
            chainIds: ["1", "137", "10", "146", "80094"],
            networks: null,
            walletAddress: null,
          }}
          isStreaming={false}
          label="5 Chains set in context, 1 user connected wallet"
          showContextSelector={true}
        />

        <Variant
          activeAccountAddress={smartWalletAddress}
          connectedWallets={[
            {
              address: userWalletAddress,
              walletId: "io.metamask",
            },
            {
              address: smartWalletAddress,
              walletId: "smart",
            },
          ]}
          context={{
            chainIds: ["1", "137", "10", "146", "80094"],
            networks: null,
            walletAddress: null,
          }}
          isStreaming={false}
          label="5 Chains set in context, 2 connected wallets - smart wallet active"
          showContextSelector={true}
        />

        <Variant
          activeAccountAddress={undefined}
          connectedWallets={[]}
          isStreaming={false}
          label="Prefilled Message"
          prefillMessage="This is a prefilled message"
          showContextSelector={true}
        />

        <Variant
          activeAccountAddress={undefined}
          connectedWallets={[]}
          isStreaming={false}
          label="No Context Selector"
          showContextSelector={false}
        />

        <Variant
          activeAccountAddress={undefined}
          allowImageUpload={false}
          connectedWallets={[]}
          isStreaming={false}
          label="No Image Upload"
          showContextSelector={true}
        />

        <Variant
          activeAccountAddress={undefined}
          connectedWallets={[]}
          isConnectingWallet={true}
          isStreaming={false}
          label="Connecting Wallet"
          showContextSelector={true}
        />
      </div>
    </ThirdwebProvider>
  );
}

function Variant(props: {
  label: string;
  prefillMessage?: string;
  context?: NebulaContext;
  isStreaming: boolean;
  showContextSelector: boolean;
  connectedWallets: WalletMeta[];
  activeAccountAddress: string | undefined;
  isConnectingWallet?: boolean;
  allowImageUpload?: boolean;
}) {
  const [context, setContext] = useState<NebulaContext | undefined>(
    props.context,
  );

  return (
    <BadgeContainer label={props.label}>
      <ChatBar
        abortChatStream={() => {}}
        allowImageUpload={
          props.allowImageUpload === undefined ? true : props.allowImageUpload
        }
        client={storybookThirdwebClient}
        connectedWallets={props.connectedWallets}
        context={context}
        isChatStreaming={props.isStreaming}
        isConnectingWallet={props.isConnectingWallet || false}
        onLoginClick={undefined}
        placeholder={"Ask thirdweb AI"}
        prefillMessage={props.prefillMessage}
        sendMessage={() => {}}
        setActiveWallet={(wallet) => {
          setContext({
            chainIds: context?.chainIds || [],
            networks: context?.networks || null,
            walletAddress: wallet.address,
          });
        }}
        setContext={setContext}
        showContextSelector={props.showContextSelector}
      />
    </BadgeContainer>
  );
}

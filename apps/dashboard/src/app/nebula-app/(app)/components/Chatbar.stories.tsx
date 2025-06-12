import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { BadgeContainer, storybookThirdwebClient } from "stories/utils";
import { ThirdwebProvider } from "thirdweb/react";
import type { NebulaContext } from "../api/chat";
import { ChatBar, type WalletMeta } from "./ChatBar";
const meta = {
  title: "Nebula/Chatbar",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
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
          label="Not Streaming"
          isStreaming={false}
          showContextSelector={true}
          connectedWallets={[]}
          activeAccountAddress={undefined}
        />
        <Variant
          label="Streaming"
          isStreaming={true}
          showContextSelector={true}
          connectedWallets={[]}
          activeAccountAddress={undefined}
        />

        <Variant
          label="1 Chain set in context"
          isStreaming={false}
          context={{
            chainIds: ["1"],
            networks: null,
            walletAddress: null,
          }}
          showContextSelector={true}
          connectedWallets={[]}
          activeAccountAddress={undefined}
        />

        <Variant
          label="3 Chains set in context"
          isStreaming={false}
          context={{
            chainIds: ["1", "137", "10"],
            networks: null,
            walletAddress: null,
          }}
          showContextSelector={true}
          connectedWallets={[]}
          activeAccountAddress={undefined}
        />

        <Variant
          label="5 Chains set in context, 1 user connected wallet"
          isStreaming={false}
          context={{
            chainIds: ["1", "137", "10", "146", "80094"],
            networks: null,
            walletAddress: null,
          }}
          showContextSelector={true}
          connectedWallets={[
            {
              walletId: "io.metamask",
              address: userWalletAddress,
            },
          ]}
          activeAccountAddress={userWalletAddress}
        />

        <Variant
          label="5 Chains set in context, 2 connected wallets - smart wallet active"
          isStreaming={false}
          context={{
            chainIds: ["1", "137", "10", "146", "80094"],
            networks: null,
            walletAddress: null,
          }}
          showContextSelector={true}
          connectedWallets={[
            {
              walletId: "io.metamask",
              address: userWalletAddress,
            },
            {
              walletId: "smart",
              address: smartWalletAddress,
            },
          ]}
          activeAccountAddress={smartWalletAddress}
        />

        <Variant
          label="Prefilled Message"
          isStreaming={false}
          prefillMessage="This is a prefilled message"
          showContextSelector={true}
          connectedWallets={[]}
          activeAccountAddress={undefined}
        />

        <Variant
          label="No Context Selector"
          isStreaming={false}
          showContextSelector={false}
          connectedWallets={[]}
          activeAccountAddress={undefined}
        />

        <Variant
          label="No Image Upload"
          isStreaming={false}
          showContextSelector={true}
          connectedWallets={[]}
          activeAccountAddress={undefined}
          allowImageUpload={false}
        />

        <Variant
          label="Connecting Wallet"
          isStreaming={false}
          isConnectingWallet={true}
          showContextSelector={true}
          connectedWallets={[]}
          activeAccountAddress={undefined}
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
        placeholder={"Ask Nebula"}
        isConnectingWallet={props.isConnectingWallet || false}
        client={storybookThirdwebClient}
        abortChatStream={() => {}}
        onLoginClick={undefined}
        isChatStreaming={props.isStreaming}
        sendMessage={() => {}}
        prefillMessage={props.prefillMessage}
        context={context}
        setContext={setContext}
        showContextSelector={props.showContextSelector}
        connectedWallets={props.connectedWallets}
        allowImageUpload={
          props.allowImageUpload === undefined ? true : props.allowImageUpload
        }
        setActiveWallet={(wallet) => {
          setContext({
            chainIds: context?.chainIds || [],
            networks: context?.networks || null,
            walletAddress: wallet.address,
          });
        }}
      />
    </BadgeContainer>
  );
}

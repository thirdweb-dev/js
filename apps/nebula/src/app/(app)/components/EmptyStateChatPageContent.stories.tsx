import type { Meta, StoryObj } from "@storybook/nextjs";
import { ThirdwebProvider } from "thirdweb/react";
import { EmptyStateChatPageContent } from "./EmptyStateChatPageContent";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Nebula/EmptyStateChatPage",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prefillMessage: undefined,
  },
};

export const PrefilledMessage: Story = {
  args: {
    prefillMessage: "This is a prefilled message",
  },
};

function Story(props: { prefillMessage: string | undefined }) {
  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[800px] grow flex-col justify-center overflow-hidden">
        <EmptyStateChatPageContent
          allowImageUpload={true}
          connectedWallets={[]}
          context={undefined}
          isConnectingWallet={false}
          onLoginClick={undefined}
          prefillMessage={props.prefillMessage}
          sendMessage={() => {}}
          setActiveWallet={() => {}}
          setContext={() => {}}
          showAurora={false}
        />
      </div>
    </ThirdwebProvider>
  );
}

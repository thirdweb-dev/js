import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import { EmptyStateChatPageContent } from "./EmptyStateChatPageContent";

const meta = {
  title: "Nebula/EmptyStateChatPage",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
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

function Story(props: {
  prefillMessage: string | undefined;
}) {
  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[800px] grow flex-col justify-center overflow-hidden">
        <EmptyStateChatPageContent
          showAurora={false}
          isConnectingWallet={false}
          sendMessage={() => {}}
          prefillMessage={props.prefillMessage}
          context={undefined}
          setContext={() => {}}
          connectedWallets={[]}
          activeAccountAddress={undefined}
          setActiveWallet={() => {}}
        />
      </div>
    </ThirdwebProvider>
  );
}

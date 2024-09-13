import type { Meta, StoryObj } from "@storybook/react";
import {
  type UseConnectModalOptions,
  useConnectModal,
} from "../../react/web/ui/ConnectWallet/useConnectModal.js";
import { storyAuthStub, storyClient } from "../utils.js";

const meta = {
  title: "Connect/useConnectModal",
  component: TestComponent,
  args: {
    client: storyClient,
  },
} satisfies Meta<typeof TestComponent>;

type Story = StoryObj<typeof meta>;

export const Connect: Story = {
  args: {},
};

export const ConnectAndAuth: Story = {
  name: "Connect + Auth",
  args: {
    auth: storyAuthStub,
  },
};

export const ConnectNonDismissible: Story = {
  name: "Connect (Non Dismissible)",
  args: {
    dismissible: false,
  },
};

export const ConnectAndAuthNonDismissible: Story = {
  name: "Connect + Auth (Non Dismissible)",
  args: {
    auth: storyAuthStub,
    dismissible: false,
  },
};

function TestComponent(options: UseConnectModalOptions) {
  const { connect } = useConnectModal();
  return (
    <button
      type="button"
      onClick={async () => {
        const wallet = await connect(options);

        console.log("done:", wallet);
      }}
    >
      Test
    </button>
  );
}

export default meta;

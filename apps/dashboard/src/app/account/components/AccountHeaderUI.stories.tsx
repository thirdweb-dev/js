import { Button } from "@/components/ui/button";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import { teamsAndProjectsStub } from "../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import {
  AccountHeaderDesktopUI,
  AccountHeaderMobileUI,
} from "./AccountHeaderUI";

const meta = {
  title: "Headers/AccountHeader",
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    type: "desktop",
  },
};

export const Mobile: Story = {
  args: {
    type: "mobile",
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

const client = getThirdwebClient();

function Variants(props: {
  type: "mobile" | "desktop";
}) {
  const Comp =
    props.type === "mobile" ? AccountHeaderMobileUI : AccountHeaderDesktopUI;

  return (
    <ThirdwebProvider>
      <div className="flex min-h-dvh flex-col gap-6 bg-gray-700 px-4 py-10">
        <BadgeContainer label="Account Loaded">
          <Comp
            teamsAndProjects={teamsAndProjectsStub}
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
            createProject={() => {}}
            account={{
              id: "foo",
              email: "foo@example.com",
            }}
            client={client}
          />
        </BadgeContainer>

        <BadgeContainer label="Account Loading">
          <Comp
            teamsAndProjects={teamsAndProjectsStub}
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
            createProject={() => {}}
            account={undefined}
            client={client}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

function ConnectButtonStub() {
  return <Button>Connect</Button>;
}

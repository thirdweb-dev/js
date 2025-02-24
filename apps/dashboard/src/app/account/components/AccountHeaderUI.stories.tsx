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
const accountAddressStub = "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37";

function Variants(props: {
  type: "mobile" | "desktop";
}) {
  const Comp =
    props.type === "mobile" ? AccountHeaderMobileUI : AccountHeaderDesktopUI;

  return (
    <ThirdwebProvider>
      <div className="flex min-h-dvh flex-col gap-6 bg-background py-10">
        <BadgeContainer label="Account Loaded">
          <div className="border-y bg-card">
            <Comp
              teamsAndProjects={teamsAndProjectsStub}
              logout={() => {}}
              accountAddress={accountAddressStub}
              connectButton={<ConnectButtonStub />}
              createProject={() => {}}
              account={{
                id: "foo",
                email: "foo@example.com",
              }}
              client={client}
            />
          </div>
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

function ConnectButtonStub() {
  return <Button>Connect</Button>;
}

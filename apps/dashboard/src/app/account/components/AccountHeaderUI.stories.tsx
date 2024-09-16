import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import { teamsAndProjectsStub } from "../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import {
  AccountHeaderDesktopUI,
  AccountHeaderMobileUI,
} from "./AccountHeaderUI";

const meta = {
  title: "Account/Account Header",
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

function Variants(props: {
  type: "mobile" | "desktop";
}) {
  const Comp =
    props.type === "mobile" ? AccountHeaderMobileUI : AccountHeaderDesktopUI;

  return (
    <ThirdwebProvider>
      <div
        className={"flex flex-col gap-6 bg-gray-700 px-4 py-10 min-h-screen"}
      >
        <BadgeContainer label="Logged in">
          <Comp
            teamsAndProjects={teamsAndProjectsStub}
            email="eng@thirdweb.com"
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
            createProject={() => {}}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

function ConnectButtonStub() {
  return <Button>Connect</Button>;
}

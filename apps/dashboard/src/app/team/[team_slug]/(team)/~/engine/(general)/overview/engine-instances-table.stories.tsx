import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import type { Meta, StoryObj } from "@storybook/react";
import { EngineInstancesTableUI } from "./engine-instances-table";

const meta: Meta<typeof Story> = {
  title: "Engine/general/instances",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (StoryInstance) => (
      <div className="container max-w-[1154px] py-10">
        <StoryInstance />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Story>;

function createEngineInstanceStub(
  name: string,
  status: EngineInstance["status"],
): EngineInstance {
  const engineId = `${name.toLowerCase().replace(/\s+/g, "-")}-engine`;
  return {
    id: engineId,
    name,
    url: `https://${engineId}.example.com`,
    status,
    deploymentId: status === "active" ? "dep-123" : undefined,
    accountId: "acc-123",
    lastAccessedAt: new Date().toISOString(),
  };
}

const cloudHostedActiveEngineInstance = createEngineInstanceStub(
  "Cloud Hosted Engine",
  "active",
);
const selfHostedActiveEngineInstance = createEngineInstanceStub(
  "Self Hosted Engine",
  "active",
);
const pendingEngineInstance = createEngineInstanceStub(
  "Staging Engine",
  "requested",
);
const deployingEngineInstance = createEngineInstanceStub(
  "Test Engine",
  "deploying",
);
const deploymentFailedEngineInstance = createEngineInstanceStub(
  "Deployment Failed Engine",
  "deploymentFailed",
);
const paymentFailedEngineInstance = createEngineInstanceStub(
  "Failed Engine",
  "paymentFailed",
);

export const MultipleInstances: Story = {
  args: {
    instances: [
      // active
      cloudHostedActiveEngineInstance,
      selfHostedActiveEngineInstance,
      // others
      pendingEngineInstance,
      deployingEngineInstance,
      paymentFailedEngineInstance,
      deploymentFailedEngineInstance,
    ],
    engineLinkPrefix: "/team/test/engine",
  },
};

export const NoInstances: Story = {
  args: {
    instances: [],
    engineLinkPrefix: "/team/test/engine",
  },
};

export const OneInstance: Story = {
  args: {
    instances: [cloudHostedActiveEngineInstance],
    engineLinkPrefix: "/team/test/engine",
  },
};

function Story(
  props: Omit<
    React.ComponentProps<typeof EngineInstancesTableUI>,
    | "deleteCloudHostedEngine"
    | "editEngineInstance"
    | "removeEngineFromDashboard"
  >,
) {
  return (
    <EngineInstancesTableUI
      deleteCloudHostedEngine={async (params) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("deleteCloudHostedEngine", params);
      }}
      editEngineInstance={async (params) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("editEngineInstance", params);
      }}
      removeEngineFromDashboard={async (params) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("removeEngineFromDashboard", params);
      }}
      {...props}
    />
  );
}

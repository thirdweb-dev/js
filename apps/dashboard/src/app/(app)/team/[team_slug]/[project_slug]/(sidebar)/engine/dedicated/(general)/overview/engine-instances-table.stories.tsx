import type { Meta, StoryObj } from "@storybook/nextjs";
import type { EngineInstance } from "@/hooks/useEngine";
import { teamStub } from "../../../../../../../../../../@/storybook/stubs";
import { EngineInstancesTableUI } from "./engine-instances-table";

const meta: Meta<typeof Story> = {
  component: Story,
  decorators: [
    (StoryInstance) => (
      <div className="container max-w-[1154px] py-10">
        <StoryInstance />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Engine/general/instances",
};

export default meta;
type Story = StoryObj<typeof Story>;

function createEngineInstanceStub(
  name: string,
  status: EngineInstance["status"],
  isCloudHosted: boolean,
  isPlanEngine: boolean,
): EngineInstance {
  const engineId = `${name.toLowerCase().replace(/\s+/g, "-")}-engine`;
  return {
    accountId: "acc-123",
    deploymentId: status === "active" ? "dep-123" : undefined,
    id: engineId,
    isCloudHosted,
    isPlanEngine,
    lastAccessedAt: new Date().toISOString(),
    name,
    status,
    url: `https://${engineId}.example.com`,
  };
}

const cloudHostedEngineInstance = createEngineInstanceStub(
  "Cloud Hosted Engine",
  "active",
  true,
  false,
);

const cloudHostedPlanActiveEngineInstance = createEngineInstanceStub(
  "Cloud Hosted Plan Engine",
  "active",
  true,
  true,
);
const selfHostedActiveEngineInstance = createEngineInstanceStub(
  "Self Hosted Engine",
  "active",
  false,
  false,
);
const pendingEngineInstance = createEngineInstanceStub(
  "Pending Engine",
  "requested",
  false,
  false,
);
const deployingEngineInstance = createEngineInstanceStub(
  "Deploying Engine",
  "deploying",
  false,
  false,
);

const paymentFailedEngineInstance = createEngineInstanceStub(
  "Payment Failed Engine",
  "paymentFailed",
  false,
  false,
);

const deploymentFailedEngineInstance = createEngineInstanceStub(
  "Deployment Failed Engine",
  "deploymentFailed",
  false,
  false,
);

export const MultipleInstances: Story = {
  args: {
    engineLinkPrefix: "/team/test/engine",
    instances: [
      // active
      cloudHostedEngineInstance,
      cloudHostedPlanActiveEngineInstance,
      selfHostedActiveEngineInstance,
      // others
      pendingEngineInstance,
      deployingEngineInstance,
      paymentFailedEngineInstance,
      deploymentFailedEngineInstance,
    ],
  },
};

export const NoInstancesProPlan: Story = {
  args: {
    engineLinkPrefix: "/team/test/engine",
    instances: [],
    team: teamStub("1", "pro"),
  },
};

export const NoInstancesGrowthPlan: Story = {
  args: {
    engineLinkPrefix: "/team/test/engine",
    instances: [],
    team: teamStub("2", "growth"),
  },
};

// this one can't technically happen because Accelerate plan always has one cloud hosted engine by default - but testing it anyway
// the section that prompts user to either choose a cloud-hosted engine or import an engine is hidden in this case
export const NoInstancesAcceleratePlan: Story = {
  args: {
    engineLinkPrefix: "/team/test/engine",
    instances: [],
    team: teamStub("3", "accelerate"),
  },
};

export const OneInstance: Story = {
  args: {
    engineLinkPrefix: "/team/test/engine",
    instances: [cloudHostedEngineInstance],
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

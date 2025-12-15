import type { Meta, StoryObj } from "@storybook/nextjs";
import type { ProjectWalletSummary } from "@/lib/server/project-wallet";
import { projectStub } from "@/storybook/stubs";
import { storybookThirdwebClient } from "@/storybook/utils";
import { ProjectWalletSectionUI } from "./project-wallet";

const meta = {
  component: Variant,
  title: "Project/ProjectWalletSection",
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="container py-8 pb-20 max-w-7xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectWalletSectionUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const projectWithManagedAccessToken = projectStub("foo", "bar");
projectWithManagedAccessToken.services = [
  {
    name: "engineCloud",
    actions: [],
    managementAccessToken: "managed-access-token",
  },
];

const projectWithoutManagedAccessToken = projectStub("foo", "bar");

const serverWallet1: ProjectWalletSummary = {
  id: "server-wallet-id",
  address: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
  label: "XYZ",
};

const serverWallet2: ProjectWalletSummary = {
  id: "server-wallet-id-2",
  address: "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425",
  label: "FooBar",
};

export const NoProjectWalletSetNoManagedAccessToken: Story = {
  args: {
    layout: "column",
    project: projectWithoutManagedAccessToken,
    client: storybookThirdwebClient,
    teamSlug: "bar",
    projectWallet: undefined,
    getProjectServerWallets: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [];
    },
  },
};

export const NoProjectWalletSetWithManagedAccessToken: Story = {
  args: {
    layout: "column",
    project: projectWithManagedAccessToken,
    client: storybookThirdwebClient,
    teamSlug: "bar",
    projectWallet: undefined,
    getProjectServerWallets: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [];
    },
  },
};

export const NoProjectWalletSetWithManagedAccessTokenAndServerWallets: Story = {
  args: {
    layout: "column",
    project: projectWithManagedAccessToken,
    teamSlug: "bar",
    client: storybookThirdwebClient,
    projectWallet: undefined,
    getProjectServerWallets: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [serverWallet1, serverWallet2];
    },
  },
};

export const NoProjectWalletSetLoading: Story = {
  args: {
    layout: "column",
    project: projectWithManagedAccessToken,
    teamSlug: "bar",
    client: storybookThirdwebClient,
    projectWallet: undefined,
    getProjectServerWallets: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100000));
      return [serverWallet1, serverWallet2];
    },
  },
};

export const ProjectWalletSetMultipleServerWallets: Story = {
  args: {
    layout: "column",
    project: projectWithManagedAccessToken,
    teamSlug: "bar",
    client: storybookThirdwebClient,
    projectWallet: serverWallet1,
    getProjectServerWallets: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [serverWallet1, serverWallet2];
    },
  },
};

export const ProjectWalletSetSingleServerWallet: Story = {
  args: {
    layout: "column",
    project: projectWithManagedAccessToken,
    teamSlug: "bar",
    projectWallet: serverWallet1,
    client: storybookThirdwebClient,
    getProjectServerWallets: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [serverWallet1];
    },
  },
};

function Variant(props: Parameters<typeof ProjectWalletSectionUI>[0]) {
  return (
    <div className="space-y-20">
      <ProjectWalletSectionUI {...props} />

      <div className="max-w-[660px]">
        <ProjectWalletSectionUI {...props} />
      </div>
    </div>
  );
}

import type { Meta, StoryObj } from "@storybook/nextjs";
import { teamStub } from "@/storybook/stubs";
import { storybookThirdwebClient } from "@/storybook/utils";
import { TeamSelectorCard } from "./team-selector";

const meta: Meta<typeof TeamSelectorCard> = {
  component: TeamSelectorCard,
  decorators: [
    (Story) => (
      <div className="py-20 flex justify-center items-center">
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "selectors/TeamSelectorCard",
};

export default meta;
type Story = StoryObj<typeof TeamSelectorCard>;

export const TwoTeams: Story = {
  args: {
    client: storybookThirdwebClient,
    paths: undefined,
    searchParams: "",
    teams: [teamStub("1", "free"), teamStub("2", "starter")],
  },
};

export const FiveTeams: Story = {
  args: {
    client: storybookThirdwebClient,
    paths: undefined,
    searchParams: "",
    teams: [
      teamStub("1", "free"),
      teamStub("2", "starter"),
      teamStub("3", "growth"),
      teamStub("4", "pro"),
      teamStub("5", "scale"),
    ],
  },
};

export const WithSearchParams: Story = {
  args: {
    client: storybookThirdwebClient,
    paths: undefined,
    searchParams: "tab=overview&section=analytics",
    teams: [
      teamStub("1", "free"),
      teamStub("2", "starter"),
      teamStub("3", "growth"),
    ],
  },
};

export const WithPaths: Story = {
  args: {
    client: storybookThirdwebClient,
    paths: ["projects", "123", "settings"],
    searchParams: "",
    teams: [teamStub("1", "free"), teamStub("2", "starter")],
  },
};

export const WithPathsAndSearchParams: Story = {
  args: {
    client: storybookThirdwebClient,
    paths: ["projects", "123", "settings"],
    searchParams: "tab=overview&section=analytics",
    teams: [
      teamStub("1", "free"),
      teamStub("2", "starter"),
      teamStub("3", "growth"),
      teamStub("4", "pro"),
    ],
  },
};

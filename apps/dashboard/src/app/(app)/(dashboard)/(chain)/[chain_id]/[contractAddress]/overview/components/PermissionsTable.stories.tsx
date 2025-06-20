import type { Meta, StoryObj } from "@storybook/nextjs";
import { ThirdwebProvider } from "thirdweb/react";
import { PermissionsTableUI } from "./PermissionsTable";

const meta: Meta<typeof PermissionsTableUI> = {
  args: {
    isPending: false,
    members: [],
    viewMoreLink: "#",
  },
  component: PermissionsTableUI,
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <div className="container max-w-4xl py-10">
          <Story />
        </div>
      </ThirdwebProvider>
    ),
  ],
  title: "Contracts/Overview/PermissionsTable",
};

export default meta;
type Story = StoryObj<typeof PermissionsTableUI>;

export const Loading: Story = {
  args: {
    isPending: true,
    members: [],
  },
};

export const NoMembers: Story = {
  args: {
    isPending: false,
    members: [],
  },
};

export const OneMember: Story = {
  args: {
    isPending: false,
    members: [
      {
        member: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
        roles: ["admin"],
      },
    ],
  },
};

export const FiveMembers: Story = {
  args: {
    isPending: false,
    members: [
      {
        member: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
        roles: ["admin", "minter"],
      },
      {
        member: "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425",
        roles: ["transfer"],
      },
      {
        member: "0x1f4202eD5c33d229bCda7B9B6AB3B57caDf423e6",
        roles: ["admin", "transfer", "minter"],
      },
      {
        member: "0x6844F0056d4C84CA2a894Fcf85473d75d8252b24",
        roles: [
          "admin",
          "minter",
          "transfer",
          "metadata",
          "burner",
          "manager",
          "lister",
        ],
      },
    ],
  },
};

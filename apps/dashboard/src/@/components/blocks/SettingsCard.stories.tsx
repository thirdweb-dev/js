import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "../../../stories/utils";
import { SettingsCard } from "./SettingsCard";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Blocks/Cards/SettingsCard",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <BadgeContainer label="No Header">
        <SettingsCard
          bottomText="This is bottom text"
          errorText={undefined}
          header={undefined}
          noPermissionText={undefined}
          saveButton={undefined}
        >
          <ChildrenPlaceholder />
        </SettingsCard>
      </BadgeContainer>

      <BadgeContainer label="Header">
        <SettingsCard
          bottomText="This is bottom text"
          errorText={undefined}
          header={{
            description: "This is some description for this card",
            title: "Some Title",
          }}
          noPermissionText={undefined}
          saveButton={undefined}
        >
          <ChildrenPlaceholder />
        </SettingsCard>
      </BadgeContainer>

      <BadgeContainer label="Error">
        <SettingsCard
          bottomText="This is bottom text"
          errorText="This is error text"
          header={{
            description: "This is some description for this card",
            title: "Some Title",
          }}
          noPermissionText={undefined}
          saveButton={undefined}
        >
          <ChildrenPlaceholder />
        </SettingsCard>
      </BadgeContainer>

      <BadgeContainer label="No Permission">
        <SettingsCard
          bottomText="This is bottom text"
          errorText={undefined}
          header={{
            description: "This is some description for this card",
            title: "Some Title",
          }}
          noPermissionText="You do not have permission to edit this"
          saveButton={{
            disabled: false,
            isPending: false,
            onClick: () => {},
          }}
        >
          <ChildrenPlaceholder />
        </SettingsCard>
      </BadgeContainer>

      <BadgeContainer label="Save">
        <SettingsCard
          bottomText="This is bottom text"
          errorText={undefined}
          header={{
            description: "This is some description for this card",
            title: "Some Title",
          }}
          noPermissionText={undefined}
          saveButton={{
            disabled: false,
            isPending: false,
            onClick: () => {},
          }}
        >
          <ChildrenPlaceholder />
        </SettingsCard>
      </BadgeContainer>

      <BadgeContainer label="Save Disabled">
        <SettingsCard
          bottomText="This is bottom text"
          errorText={undefined}
          header={{
            description: "This is some description for this card",
            title: "Some Title",
          }}
          noPermissionText={undefined}
          saveButton={{
            disabled: true,
            isPending: false,
            onClick: () => {},
          }}
        >
          <ChildrenPlaceholder />
        </SettingsCard>
      </BadgeContainer>

      <BadgeContainer label="Save Loading">
        <SettingsCard
          bottomText="This is bottom text"
          errorText={undefined}
          header={{
            description: "This is some description for this card",
            title: "Some Title",
          }}
          noPermissionText={undefined}
          saveButton={{
            disabled: false,
            isPending: true,
            onClick: () => {},
          }}
        >
          <ChildrenPlaceholder />
        </SettingsCard>
      </BadgeContainer>
    </div>
  );
}

function ChildrenPlaceholder() {
  return (
    <div className="flex h-10 items-center justify-center text-muted-foreground/50 text-xs">
      CHILDREN GOES HERE
    </div>
  );
}

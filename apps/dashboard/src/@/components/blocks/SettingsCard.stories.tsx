import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import { SettingsCard } from "./SettingsCard";

const meta = {
  title: "Blocks/Cards/SettingsCard",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story() {
  return (
    <div className="min-h-dvh bg-background py-6 text-foreground">
      <div className="container flex max-w-[1100px] flex-col gap-10 lg:p-10">
        <BadgeContainer label="No Header">
          <SettingsCard
            bottomText="This is bottom text"
            header={undefined}
            errorText={undefined}
            noPermissionText={undefined}
            saveButton={undefined}
          >
            <ChildrenPlaceholder />
          </SettingsCard>
        </BadgeContainer>

        <BadgeContainer label="Header">
          <SettingsCard
            bottomText="This is bottom text"
            header={{
              title: "Some Title",
              description: "This is some description for this card",
            }}
            errorText={undefined}
            noPermissionText={undefined}
            saveButton={undefined}
          >
            <ChildrenPlaceholder />
          </SettingsCard>
        </BadgeContainer>

        <BadgeContainer label="Error">
          <SettingsCard
            bottomText="This is bottom text"
            header={{
              title: "Some Title",
              description: "This is some description for this card",
            }}
            errorText="This is error text"
            noPermissionText={undefined}
            saveButton={undefined}
          >
            <ChildrenPlaceholder />
          </SettingsCard>
        </BadgeContainer>

        <BadgeContainer label="No Permission">
          <SettingsCard
            bottomText="This is bottom text"
            header={{
              title: "Some Title",
              description: "This is some description for this card",
            }}
            saveButton={{
              disabled: false,
              isPending: false,
              onClick: () => {},
            }}
            noPermissionText="You do not have permission to edit this"
            errorText={undefined}
          >
            <ChildrenPlaceholder />
          </SettingsCard>
        </BadgeContainer>

        <BadgeContainer label="Save">
          <SettingsCard
            bottomText="This is bottom text"
            header={{
              title: "Some Title",
              description: "This is some description for this card",
            }}
            saveButton={{
              disabled: false,
              isPending: false,
              onClick: () => {},
            }}
            noPermissionText={undefined}
            errorText={undefined}
          >
            <ChildrenPlaceholder />
          </SettingsCard>
        </BadgeContainer>

        <BadgeContainer label="Save Disabled">
          <SettingsCard
            bottomText="This is bottom text"
            header={{
              title: "Some Title",
              description: "This is some description for this card",
            }}
            saveButton={{
              disabled: true,
              isPending: false,
              onClick: () => {},
            }}
            noPermissionText={undefined}
            errorText={undefined}
          >
            <ChildrenPlaceholder />
          </SettingsCard>
        </BadgeContainer>

        <BadgeContainer label="Save Loading">
          <SettingsCard
            bottomText="This is bottom text"
            header={{
              title: "Some Title",
              description: "This is some description for this card",
            }}
            saveButton={{
              disabled: false,
              isPending: true,
              onClick: () => {},
            }}
            noPermissionText={undefined}
            errorText={undefined}
          >
            <ChildrenPlaceholder />
          </SettingsCard>
        </BadgeContainer>
      </div>
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

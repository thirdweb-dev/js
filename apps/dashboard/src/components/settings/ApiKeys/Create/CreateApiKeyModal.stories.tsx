import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toaster } from "sonner";
import { CreateProjectDialogUI, type CreateProjectPrefillOptions } from ".";
import { projectStub } from "../../../../stories/stubs";
import { mobileViewport } from "../../../../stories/utils";

const meta = {
  title: "Project/Create Project Modal",
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

function Story(props: {
  prefill?: CreateProjectPrefillOptions;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex grow items-center justify-center p-6">
      <CreateProjectDialogUI
        open={isOpen}
        onOpenChange={setIsOpen}
        createProject={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return {
            project: projectStub("foo", "bar"),
            secret: "123",
          };
        }}
        prefill={props.prefill}
        enableNebulaServiceByDefault={false}
        teamSlug="foo"
      />

      <Button
        variant="outline"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open
      </Button>

      <Toaster richColors />
    </div>
  );
}

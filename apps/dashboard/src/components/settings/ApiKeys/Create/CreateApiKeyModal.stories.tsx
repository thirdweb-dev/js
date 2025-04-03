import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CreateProjectDialogUI, type CreateProjectPrefillOptions } from ".";
import { projectStub } from "../../../../stories/stubs";

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

export const Variants: Story = {
  args: {},
};

function Story(props: {
  prefill?: CreateProjectPrefillOptions;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
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
    </div>
  );
}

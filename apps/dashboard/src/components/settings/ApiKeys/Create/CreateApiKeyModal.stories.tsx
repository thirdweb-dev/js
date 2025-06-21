import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { projectStub } from "../../../../stories/stubs";
import { CreateProjectDialogUI, type CreateProjectPrefillOptions } from ".";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Project/Create Project Modal",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Story(props: { prefill?: CreateProjectPrefillOptions }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <CreateProjectDialogUI
        createProject={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return {
            project: projectStub("foo", "bar"),
            secret: "123",
          };
        }}
        enableNebulaServiceByDefault={false}
        onOpenChange={setIsOpen}
        open={isOpen}
        prefill={props.prefill}
        teamSlug="foo"
      />

      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        variant="outline"
      >
        Open
      </Button>
    </div>
  );
}

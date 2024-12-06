import { Button } from "@/components/ui/button";
import type { CreateKeyInput } from "@3rdweb-sdk/react/hooks/useApi";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { CreateAPIKeyDialogUI, type CreateAPIKeyPrefillOptions } from ".";
import { createApiKeyStub } from "../../../../stories/stubs";
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
  prefill?: CreateAPIKeyPrefillOptions;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const mutation = useMutation({
    mutationFn: async (input: CreateKeyInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const apiKey = createApiKeyStub();
      apiKey.name = input.name || apiKey.name;
      return apiKey;
    },
  });

  return (
    <div className="flex grow items-center justify-center p-6">
      <CreateAPIKeyDialogUI
        open={isOpen}
        onOpenChange={setIsOpen}
        createKeyMutation={mutation}
        prefill={props.prefill}
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

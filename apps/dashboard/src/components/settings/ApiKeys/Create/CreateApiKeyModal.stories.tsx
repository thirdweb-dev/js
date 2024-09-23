import { Button } from "@/components/ui/button";
import type { CreateKeyInput } from "@3rdweb-sdk/react/hooks/useApi";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { CreateAPIKeyDialogUI } from ".";
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

export const DesktopProjectWording: Story = {
  args: {
    wording: "project",
  },
};

export const MobileProjectWording: Story = {
  args: {
    wording: "project",
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

export const DesktopAPIKeyWording: Story = {
  args: {
    wording: "api-key",
  },
};

export const MobileAPIKeyWording: Story = {
  args: {
    wording: "api-key",
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story(props: {
  wording: "project" | "api-key";
}) {
  const [isOpen, setIsOpen] = useState(true);
  const mutation = useMutation({
    mutationFn: async (input: CreateKeyInput) => {
      console.log("Creating API key with", input);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const apiKey = createApiKeyStub();
      apiKey.name = input.name || apiKey.name;
      return apiKey;
    },
  });

  return (
    <div className="flex grow items-center justify-center p-6">
      <CreateAPIKeyDialogUI
        wording={props.wording}
        open={isOpen}
        onOpenChange={setIsOpen}
        createKeyMutation={mutation}
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

import type { UpdateKeyInput } from "@3rdweb-sdk/react/hooks/useApi";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { createApiKeyStub } from "../../../../../stories/stubs";
import { mobileViewport } from "../../../../../stories/utils";
import { ProjectGeneralSettingsPageUI } from "./ProjectGeneralSettingsPage";

const meta = {
  title: "Project/Settings/General",
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

const apiKeyStub = createApiKeyStub();
apiKeyStub.secret = undefined;

function Story() {
  const updateMutation = useMutation({
    mutationFn: async (inputs: UpdateKeyInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("update with", inputs);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("delete with", id);
    },
  });
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6">
      <ProjectGeneralSettingsPageUI
        apiKey={apiKeyStub}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
        paths={{
          aaConfig: "/aaConfig",
          afterDeleteRedirectTo: "/afterDeleteRedirectTo",
          inAppConfig: "/inAppConfig",
          payConfig: "/payConfig",
        }}
        onKeyUpdated={undefined}
        showNebulaSettings={false}
      />

      <Toaster richColors />
    </div>
  );
}

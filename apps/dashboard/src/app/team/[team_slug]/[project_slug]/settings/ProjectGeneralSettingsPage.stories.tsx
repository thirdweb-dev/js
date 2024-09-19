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
  args: {
    wording: "project",
  },
};

export const Mobile: Story = {
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

const apiKeyStub = createApiKeyStub();
apiKeyStub.secret = undefined;

function Story(props: {
  wording: "project" | "api-key";
}) {
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
    <div className="max-w-[1100px] py-6 px-4 w-full mx-auto">
      <ProjectGeneralSettingsPageUI
        apiKey={apiKeyStub}
        wording={props.wording}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
        paths={{
          aaConfig: "/aaConfig",
          afterDeleteRedirectTo: "/afterDeleteRedirectTo",
          inAppConfig: "/inAppConfig",
          payConfig: "/payConfig",
        }}
        onKeyUpdated={undefined}
      />

      <Toaster richColors />
    </div>
  );
}

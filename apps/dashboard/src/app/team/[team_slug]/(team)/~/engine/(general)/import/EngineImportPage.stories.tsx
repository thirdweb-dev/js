import type { Meta, StoryObj } from "@storybook/react";
import { EngineImportCardUI } from "./EngineImportPage";

const meta: Meta<typeof EngineImportCardUI> = {
  title: "Engine/general/import",
  component: EngineImportCardUI,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="py-10">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EngineImportCardUI>;

export const Default: Story = {
  args: {
    prefillImportUrl: undefined,
    importEngine: async (params) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("importEngine", params);
    },
  },
};

export const WithPrefillUrl: Story = {
  args: {
    prefillImportUrl: "https://engine.example.com",
    importEngine: async (params) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("importEngine", params);
    },
  },
};

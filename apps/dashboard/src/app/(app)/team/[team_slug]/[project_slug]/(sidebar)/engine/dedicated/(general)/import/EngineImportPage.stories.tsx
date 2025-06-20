import type { Meta, StoryObj } from "@storybook/nextjs";
import { EngineImportCardUI } from "./EngineImportPage";

const meta: Meta<typeof EngineImportCardUI> = {
  component: EngineImportCardUI,
  decorators: [
    (Story) => (
      <div className="py-10">
        <Story />
      </div>
    ),
  ],
  title: "Engine/general/import",
};

export default meta;
type Story = StoryObj<typeof EngineImportCardUI>;

export const Default: Story = {
  args: {
    importEngine: async (params) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("importEngine", params);
    },
    prefillImportUrl: undefined,
  },
};

export const WithPrefillUrl: Story = {
  args: {
    importEngine: async (params) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("importEngine", params);
    },
    prefillImportUrl: "https://engine.example.com",
  },
};

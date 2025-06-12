import type { Meta, StoryObj } from "@storybook/nextjs";
import { DropZone } from "./drop-zone";

const meta = {
  title: "blocks/DropZone",
  component: DropZone,
  decorators: [
    (Story) => (
      <div className="container max-w-6xl py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isError: false,
    onDrop: () => {},
    title: "This is a title",
    description: "This is a description for drop zone",
    accept: undefined,
    resetButton: undefined,
  },
};

export const ErrorState: Story = {
  args: {
    isError: true,
    onDrop: () => {},
    title: "this is title",
    description: "This is a description",
    accept: undefined,
    resetButton: undefined,
  },
};

export const ErrorStateWithResetButton: Story = {
  args: {
    isError: true,
    onDrop: () => {},
    title: "this is title",
    description: "This is a description",
    accept: undefined,
    resetButton: {
      label: "Remove Files",
      onClick: () => {},
    },
  },
};

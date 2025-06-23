import type { Meta, StoryObj } from "@storybook/nextjs";
import { DropZone } from "./drop-zone";

const meta = {
  component: DropZone,
  decorators: [
    (Story) => (
      <div className="container max-w-6xl py-10">
        <Story />
      </div>
    ),
  ],
  title: "blocks/DropZone",
} satisfies Meta<typeof DropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    accept: undefined,
    description: "This is a description for drop zone",
    isError: false,
    onDrop: () => {},
    resetButton: undefined,
    title: "This is a title",
  },
};

export const ErrorState: Story = {
  args: {
    accept: undefined,
    description: "This is a description",
    isError: true,
    onDrop: () => {},
    resetButton: undefined,
    title: "this is title",
  },
};

export const ErrorStateWithResetButton: Story = {
  args: {
    accept: undefined,
    description: "This is a description",
    isError: true,
    onDrop: () => {},
    resetButton: {
      label: "Remove Files",
      onClick: () => {},
    },
    title: "this is title",
  },
};

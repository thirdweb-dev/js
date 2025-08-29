import type { Meta, StoryObj } from "@storybook/nextjs";
import { Spinner } from "./spinner";

const meta = {
  component: Component,
  title: "ui/spinner",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: {},
};

function Component() {
  return (
    <div className="flex flex-col justify-center gap-8 items-center py-10">
      <Spinner className="size-4" />
      <Spinner className="size-5" />
      <Spinner className="size-6" />
      <Spinner className="size-7" />
      <Spinner className="size-8" />
      <Spinner className="size-9" />
      <Spinner className="size-10" />
      <Spinner className="size-11" />
      <Spinner className="size-12" />
      <Spinner className="size-12 text-red-500" />
      <div className="text-blue-500">
        <Spinner className="size-12" />
      </div>
    </div>
  );
}

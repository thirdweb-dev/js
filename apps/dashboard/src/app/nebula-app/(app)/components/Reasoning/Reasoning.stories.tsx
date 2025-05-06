import type { Meta, StoryObj } from "@storybook/react";
import { randomLorem } from "../../../../../stories/stubs";
import { Reasoning } from "./Reasoning";

const meta = {
  title: "Nebula/Reasoning",
  component: Story,
  decorators: [
    (Story) => (
      <div className="container max-w-[800px] py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {},
};

function Story() {
  return (
    <div className="flex flex-col gap-10">
      <Reasoning isPending texts={[randomLorem(10), randomLorem(5)]} />
      <Reasoning
        isPending={false}
        texts={[randomLorem(10), randomLorem(5), randomLorem(30)]}
      />
    </div>
  );
}

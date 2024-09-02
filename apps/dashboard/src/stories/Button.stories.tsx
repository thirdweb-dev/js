import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Shadcn/Buttons",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {
    theme: "light",
  },
};

function Component() {
  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="flex gap-6">
        <Button> Default </Button>
        <Button variant="primary"> Primary </Button>
        <Button variant="secondary"> Secondary </Button>
        <Button variant="ghost"> Ghost </Button>
        <Button variant="outline"> Outline </Button>
        <Button variant="destructive"> Destructive </Button>
      </div>
    </div>
  );
}

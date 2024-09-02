import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Shadcn/Buttons",
  component: Variants,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    theme: "light",
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

function Variants(props: {
  theme: "light" | "dark";
}) {
  return (
    <div
      data-theme={props.theme}
      className="min-h-screen bg-background p-6 text-foreground"
    >
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

import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Shadcn/Buttons",
  component: Story,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: {},
};

function Variants(props: {
  theme: "light" | "dark";
}) {
  return (
    <div data-theme={props.theme}>
      <p className="text-sm mb-2 border px-3 py-2 bg-muted inline-block rounded-xl text-foreground">
        {props.theme}
      </p>
      <div className="flex gap-6 p-6 bg-background text-foreground border rounded-lg">
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

function Story() {
  return (
    <div className="flex flex-col gap-6">
      <Variants theme="light" />
      <Variants theme="dark" />
    </div>
  );
}

import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "@workspace/ui/components/button";
import { BadgeContainer } from "@workspace/ui/storybook/utils";
import { StarIcon } from "lucide-react";

const meta = {
  component: Component,
  title: "ui/button",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: {},
};

function Component() {
  return (
    <div className="flex min-h-dvh flex-col gap-6 bg-background p-6 text-foreground">
      <Variants size="default" />
      <Variants size="sm" />
      <Variants size="icon" />
      <Variants size="lg" />
    </div>
  );
}

function Variants(props: { size: "default" | "icon" | "sm" | "lg" }) {
  return (
    <BadgeContainer label={`Size: ${props.size}`}>
      <div className="flex gap-6">
        <Button size={props.size}>
          {props.size === "icon" ? <StarIcon className="size-4" /> : "Default"}
        </Button>
        <Button size={props.size} variant="primary">
          {props.size === "icon" ? <StarIcon className="size-4" /> : "Primary"}
        </Button>
        <Button size={props.size} variant="secondary">
          {props.size === "icon" ? (
            <StarIcon className="size-4" />
          ) : (
            "Secondary"
          )}
        </Button>
        <Button size={props.size} variant="ghost">
          {props.size === "icon" ? <StarIcon className="size-4" /> : "Ghost"}
        </Button>
        <Button size={props.size} variant="outline">
          {props.size === "icon" ? <StarIcon className="size-4" /> : "Outline"}
        </Button>
        <Button size={props.size} variant="destructive">
          {props.size === "icon" ? (
            <StarIcon className="size-4" />
          ) : (
            "Destructive"
          )}
        </Button>
      </div>
    </BadgeContainer>
  );
}

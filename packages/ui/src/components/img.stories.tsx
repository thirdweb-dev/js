import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "@workspace/ui/components/button";
import { BadgeContainer } from "@workspace/ui/storybook/utils";
import { ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Img } from "./img";

const meta = {
  component: Story,
  title: "ui/img",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Story() {
  return (
    <div className="flex flex-col gap-10 p-10">
      <p> All images below are set with size-20 className </p>

      <BadgeContainer label="No Src - pending">
        <Img className="size-20" src={undefined} />
      </BadgeContainer>

      <BadgeContainer label="Failed to load - fallback">
        <Img className="size-20" src="invalid-src" />
      </BadgeContainer>

      <BadgeContainer label="No Src, pending - rounded-full">
        <Img className="size-20 rounded-full" src={undefined} />
      </BadgeContainer>

      <BadgeContainer label="Failed to load - fallback - rounded-full">
        <Img className="size-20 rounded-full" src="invalid-src" />
      </BadgeContainer>

      <BadgeContainer label="Valid Src">
        <Img className="size-20" src="https://picsum.photos/200" />
      </BadgeContainer>

      <BadgeContainer label="Valid Src, rounded">
        <Img className="size-20 rounded-full" src="https://picsum.photos/200" />
      </BadgeContainer>

      <ToggleTest />

      <BadgeContainer label="Custom Skeleton">
        <Img
          className="size-20"
          skeleton={
            <div className="flex items-center justify-center rounded-lg border">
              <Loader2 className="size-6 animate-spin" />
            </div>
          }
          src={undefined}
        />
      </BadgeContainer>

      <BadgeContainer label="Custom Fallback">
        <Img
          className="size-20"
          fallback={
            <div className="flex items-center justify-center rounded-lg border">
              <ImageIcon className="size-10 text-muted-foreground" />
            </div>
          }
          src="invalid-src"
        />
      </BadgeContainer>
    </div>
  );
}

function ToggleTest() {
  const [src, setSrc] = useState<undefined | string>(undefined);

  return (
    <div className="relative flex flex-col gap-10 border p-6">
      <Button
        className="absolute top-6 right-6 inline-flex"
        onClick={() => {
          if (src) {
            setSrc(undefined);
          } else {
            setSrc("https://picsum.photos/400");
          }
        }}
        variant="outline"
      >
        Toggle Src
      </Button>

      <p> Src is {src ? "set" : "not set"} </p>

      <BadgeContainer label="Valid Src">
        <Img className="size-20" src={src} />
      </BadgeContainer>

      <BadgeContainer label="invalid Src">
        <Img
          className="size-20 rounded-full"
          src={src ? "invalid-src" : undefined}
        />
      </BadgeContainer>
    </div>
  );
}

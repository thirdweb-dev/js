import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import {
  BadgeContainer,
  storybookThirdwebClient,
} from "../../../../stories/utils";
import { Button } from "../../ui/button";
import { GradientAvatar } from "./GradientAvatar";

const meta = {
  component: Story,
  title: "blocks/Avatars/GradientAvatar",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <p> All images below are set with size-20 className </p>

      <BadgeContainer label="No Src, No id - Skeleton">
        <GradientAvatar
          className="size-20"
          client={storybookThirdwebClient}
          id={undefined}
          src={undefined}
        />
      </BadgeContainer>

      <BadgeContainer label="No Src, id=foo - Skeleton">
        <GradientAvatar
          className="size-20"
          client={storybookThirdwebClient}
          id={"foo"}
          src={undefined}
        />
      </BadgeContainer>

      <BadgeContainer label="Invalid Src, id=foo - Gradient">
        <GradientAvatar
          className="size-20"
          client={storybookThirdwebClient}
          id={"foo"}
          src={""}
        />
      </BadgeContainer>

      <BadgeContainer label="Invalid Src, id=bar - Gradient">
        <GradientAvatar
          className="size-20"
          client={storybookThirdwebClient}
          id={"bar"}
          src={""}
        />
      </BadgeContainer>

      <BadgeContainer label="Empty/Invalid Src, No id - default fallback">
        <GradientAvatar
          className="size-20"
          client={storybookThirdwebClient}
          id={undefined}
          src="invalid-src"
        />
      </BadgeContainer>

      <BadgeContainer label="Valid Src, https">
        <GradientAvatar
          className="size-20"
          client={storybookThirdwebClient}
          id={undefined}
          src="https://picsum.photos/200/300"
        />
      </BadgeContainer>

      <BadgeContainer label="Valid Src, ipfs">
        <GradientAvatar
          className="size-20"
          client={storybookThirdwebClient}
          id={undefined}
          src="ipfs://QmZbeJYEs7kCJHyQxjxU2SJUtjSAr4m87wzJFJUyWomKdj/Smily.svg"
        />
      </BadgeContainer>

      <ToggleTest />
    </div>
  );
}

function ToggleTest() {
  const [data, setData] = useState<undefined | { src: string; id: string }>(
    undefined,
  );

  return (
    <div className="relative flex flex-col gap-10 border p-6">
      <Button
        className="absolute top-6 right-6 inline-flex"
        onClick={() => {
          if (data) {
            setData(undefined);
          } else {
            setData({
              id: "foo",
              src: "https://picsum.photos/400",
            });
          }
        }}
        variant="outline"
      >
        Toggle Src
      </Button>

      <p> Src+ID is: {data ? "set" : "not set"} </p>

      <BadgeContainer label="Valid Src">
        <GradientAvatar
          className="size-20"
          client={storybookThirdwebClient}
          id={data?.id}
          src={data?.src}
        />
      </BadgeContainer>

      <BadgeContainer label="invalid Src">
        <GradientAvatar
          className="size-20"
          client={storybookThirdwebClient}
          id={undefined}
          src={data ? "invalid-src" : undefined}
        />
      </BadgeContainer>
    </div>
  );
}

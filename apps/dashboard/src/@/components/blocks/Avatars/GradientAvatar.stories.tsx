import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  BadgeContainer,
  storybookThirdwebClient,
} from "../../../../stories/utils";
import { Button } from "../../ui/button";
import { GradientAvatar } from "./GradientAvatar";

const meta = {
  title: "blocks/Avatars/GradientAvatar",
  component: Story,
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
          id={undefined}
          src={undefined}
          className="size-20"
          client={storybookThirdwebClient}
        />
      </BadgeContainer>

      <BadgeContainer label="No Src, id=foo - Skeleton">
        <GradientAvatar
          id={"foo"}
          src={undefined}
          className="size-20"
          client={storybookThirdwebClient}
        />
      </BadgeContainer>

      <BadgeContainer label="Invalid Src, id=foo - Gradient">
        <GradientAvatar
          id={"foo"}
          src={""}
          className="size-20"
          client={storybookThirdwebClient}
        />
      </BadgeContainer>

      <BadgeContainer label="Invalid Src, id=bar - Gradient">
        <GradientAvatar
          id={"bar"}
          src={""}
          className="size-20"
          client={storybookThirdwebClient}
        />
      </BadgeContainer>

      <BadgeContainer label="Empty/Invalid Src, No id - default fallback">
        <GradientAvatar
          src="invalid-src"
          id={undefined}
          className="size-20"
          client={storybookThirdwebClient}
        />
      </BadgeContainer>

      <BadgeContainer label="Valid Src, https">
        <GradientAvatar
          src="https://picsum.photos/200/300"
          id={undefined}
          className="size-20"
          client={storybookThirdwebClient}
        />
      </BadgeContainer>

      <BadgeContainer label="Valid Src, ipfs">
        <GradientAvatar
          src="ipfs://QmZbeJYEs7kCJHyQxjxU2SJUtjSAr4m87wzJFJUyWomKdj/Smily.svg"
          id={undefined}
          className="size-20"
          client={storybookThirdwebClient}
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
        variant="outline"
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
        className="absolute top-6 right-6 inline-flex"
      >
        Toggle Src
      </Button>

      <p> Src+ID is: {data ? "set" : "not set"} </p>

      <BadgeContainer label="Valid Src">
        <GradientAvatar
          src={data?.src}
          id={data?.id}
          className="size-20"
          client={storybookThirdwebClient}
        />
      </BadgeContainer>

      <BadgeContainer label="invalid Src">
        <GradientAvatar
          className="size-20"
          src={data ? "invalid-src" : undefined}
          id={undefined}
          client={storybookThirdwebClient}
        />
      </BadgeContainer>
    </div>
  );
}

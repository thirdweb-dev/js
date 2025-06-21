import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import {
  BadgeContainer,
  storybookThirdwebClient,
} from "../../../../stories/utils";
import { Button } from "../../ui/button";
import { ProjectAvatar } from "./ProjectAvatar";

const meta = {
  component: Story,
  parameters: {},
  title: "blocks/Avatars/ProjectAvatar",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <p> All images below are set with size-6 className </p>

      <BadgeContainer label="No Src - Skeleton">
        <ProjectAvatar
          className="size-6"
          client={storybookThirdwebClient}
          src={undefined}
        />
      </BadgeContainer>

      <BadgeContainer label="Invalid/Empty Src - BoxIcon Fallback">
        <ProjectAvatar
          className="size-6"
          client={storybookThirdwebClient}
          src={""}
        />
      </BadgeContainer>

      <ToggleTest />
    </div>
  );
}

function ToggleTest() {
  const [data, setData] = useState<undefined | { src: string; name: string }>(
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
              name: "foo",
              src: "https://picsum.photos/400",
            });
          }
        }}
        variant="outline"
      >
        Toggle Src
      </Button>

      <p> Src+Name is: {data ? "set" : "not set"} </p>

      <BadgeContainer label="Valid Src">
        <ProjectAvatar
          className="size-6"
          client={storybookThirdwebClient}
          src={data?.src}
        />
      </BadgeContainer>

      <BadgeContainer label="invalid Src">
        <ProjectAvatar
          className="size-6"
          client={storybookThirdwebClient}
          src={data ? "invalid-src" : undefined}
        />
      </BadgeContainer>
    </div>
  );
}

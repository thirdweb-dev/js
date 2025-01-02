import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BadgeContainer } from "../../../../stories/utils";
import { Button } from "../../ui/button";
import { ProjectAvatar } from "./ProjectAvatar";

const meta = {
  title: "blocks/Avatars/ProjectAvatar",
  component: Story,
  parameters: {},
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

function Story() {
  return (
    <div className="flex flex-col gap-10 p-10">
      <p> All images below are set with size-6 className </p>

      <BadgeContainer label="No Src - Skeleton">
        <ProjectAvatar src={undefined} className="size-6" />
      </BadgeContainer>

      <BadgeContainer label="Invalid/Empty Src - BoxIcon Fallback">
        <ProjectAvatar src={""} className="size-6" />
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
        variant="outline"
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
        className="absolute top-6 right-6 inline-flex"
      >
        Toggle Src
      </Button>

      <p> Src+Name is: {data ? "set" : "not set"} </p>

      <BadgeContainer label="Valid Src">
        <ProjectAvatar src={data?.src} className="size-6" />
      </BadgeContainer>

      <BadgeContainer label="invalid Src">
        <ProjectAvatar
          src={data ? "invalid-src" : undefined}
          className="size-6"
        />
      </BadgeContainer>
    </div>
  );
}

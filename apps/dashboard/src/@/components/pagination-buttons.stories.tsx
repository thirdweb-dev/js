import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BadgeContainer, mobileViewport } from "../../stories/utils";
import { PaginationButtons } from "./pagination-buttons";

const meta = {
  title: "blocks/PaginationButtons",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story() {
  return (
    <div className="container flex max-w-[1000px] flex-col gap-8 py-10">
      <Variant label="10 Pages" totalPages={10} />
      <Variant label="100 Pages" totalPages={100} />
      <Variant label="3 Pages" totalPages={2} />
      <Variant label="6 Pages" totalPages={6} />
      <Variant label="1 Page - nothing rendered" totalPages={1} />
    </div>
  );
}

function Variant(props: {
  label: string;
  totalPages: number;
}) {
  const [activePage, setActivePage] = useState(1);
  return (
    <BadgeContainer label={props.label}>
      <div className="border bg-card py-5">
        <PaginationButtons
          activePage={activePage}
          onPageClick={setActivePage}
          totalPages={props.totalPages}
        />
      </div>
    </BadgeContainer>
  );
}

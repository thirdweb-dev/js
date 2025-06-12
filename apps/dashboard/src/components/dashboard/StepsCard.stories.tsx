import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "../../stories/utils";
import { StepsCard } from "./StepsCard";

const meta = {
  title: "Blocks/Cards/StepsCard",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultCardTitle = "Get started with deploying contracts";
const defaultCardDescription =
  "This guide will help you to start deploying contracts on-chain in just a few minutes";

export const Variants: Story = {
  args: {
    cardTitle: defaultCardTitle,
    cardDescription: defaultCardDescription,
  },
};

function stepStub(options: {
  id: number;
  completed: boolean;
  showCompletedChildren?: boolean;
  description?: string;
}) {
  return {
    title: `This is step ${options.id} title`,
    description:
      options.description ?? `This is step ${options.id} description`,
    completed: options.completed,
    children: <ChildrenPlaceholder />,
    showCompletedChildren: options.showCompletedChildren,
  };
}

function Component(props: {
  cardTitle: string;
  cardDescription: string;
}) {
  const { cardTitle, cardDescription } = props;
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <BadgeContainer label="2 steps, 0 Completed">
        <StepsCard
          steps={[
            stepStub({ id: 1, completed: false }),
            stepStub({ id: 2, completed: false }),
          ]}
          title={cardTitle}
          description={cardDescription}
        />
      </BadgeContainer>

      <BadgeContainer label="2 steps, 0 Completed, No Card desc">
        <StepsCard
          steps={[
            stepStub({ id: 1, completed: false }),
            stepStub({ id: 2, completed: false }),
          ]}
          title={cardTitle}
        />
      </BadgeContainer>

      <BadgeContainer label="2 steps, 1 Completed">
        <StepsCard
          steps={[
            stepStub({ id: 1, completed: true }),
            stepStub({ id: 2, completed: false }),
          ]}
          title={cardTitle}
          description={cardDescription}
        />
      </BadgeContainer>

      <BadgeContainer label="2 steps, First Completed, Show Completed">
        <StepsCard
          steps={[
            stepStub({ id: 1, completed: true, showCompletedChildren: true }),
            stepStub({
              id: 2,
              completed: false,
            }),
          ]}
          title={cardTitle}
          description={cardDescription}
        />
      </BadgeContainer>

      <BadgeContainer label="2 steps, All Complete - No render">
        <StepsCard
          steps={[
            stepStub({ id: 1, completed: true }),
            stepStub({ id: 2, completed: true }),
          ]}
          title={cardTitle}
          description={cardDescription}
        />
      </BadgeContainer>
    </div>
  );
}

function ChildrenPlaceholder() {
  return (
    <div className="h-[50px] rounded-lg bg-gradient-to-r from-muted to-muted/50" />
  );
}

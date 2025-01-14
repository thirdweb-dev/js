import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "../../stories/utils";
import { StepsCard } from "./StepsCard";

const meta = {
  title: "Blocks/Cards/StepsCard",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultCardTitle = "Get started with deploying contracts";
const defaultCardDescription =
  "This guide will help you to start deploying contracts on-chain in just a few minutes";

export const Desktop: Story = {
  args: {
    cardTitle: defaultCardTitle,
    cardDescription: defaultCardDescription,
  },
};

export const Mobile: Story = {
  args: {
    cardTitle: defaultCardTitle,
    cardDescription: defaultCardDescription,
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
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
    <div className="min-h-dvh bg-background p-4 text-foreground">
      <div className="mx-auto flex max-w-[1000px] flex-col gap-12">
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
    </div>
  );
}

function ChildrenPlaceholder() {
  return (
    <div className="h-[50px] rounded-lg bg-gradient-to-r from-muted to-muted/50" />
  );
}

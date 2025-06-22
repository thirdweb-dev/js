import type { Meta, StoryObj } from "@storybook/nextjs";
import { StepsCard } from "@/components/blocks/StepsCard";
import { BadgeContainer } from "@/storybook/utils";

const meta = {
  component: Component,
  title: "Blocks/Cards/StepsCard",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultCardTitle = "Get started with deploying contracts";
const defaultCardDescription =
  "This guide will help you to start deploying contracts on-chain in just a few minutes";

export const Variants: Story = {
  args: {
    cardDescription: defaultCardDescription,
    cardTitle: defaultCardTitle,
  },
};

function stepStub(options: {
  id: number;
  completed: boolean;
  showCompletedChildren?: boolean;
  description?: string;
}) {
  return {
    children: <ChildrenPlaceholder />,
    completed: options.completed,
    description:
      options.description ?? `This is step ${options.id} description`,
    showCompletedChildren: options.showCompletedChildren,
    title: `This is step ${options.id} title`,
  };
}

function Component(props: { cardTitle: string; cardDescription: string }) {
  const { cardTitle, cardDescription } = props;
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <BadgeContainer label="2 steps, 0 Completed">
        <StepsCard
          description={cardDescription}
          steps={[
            stepStub({ completed: false, id: 1 }),
            stepStub({ completed: false, id: 2 }),
          ]}
          title={cardTitle}
        />
      </BadgeContainer>

      <BadgeContainer label="2 steps, 0 Completed, No Card desc">
        <StepsCard
          steps={[
            stepStub({ completed: false, id: 1 }),
            stepStub({ completed: false, id: 2 }),
          ]}
          title={cardTitle}
        />
      </BadgeContainer>

      <BadgeContainer label="2 steps, 1 Completed">
        <StepsCard
          description={cardDescription}
          steps={[
            stepStub({ completed: true, id: 1 }),
            stepStub({ completed: false, id: 2 }),
          ]}
          title={cardTitle}
        />
      </BadgeContainer>

      <BadgeContainer label="2 steps, First Completed, Show Completed">
        <StepsCard
          description={cardDescription}
          steps={[
            stepStub({ completed: true, id: 1, showCompletedChildren: true }),
            stepStub({
              completed: false,
              id: 2,
            }),
          ]}
          title={cardTitle}
        />
      </BadgeContainer>

      <BadgeContainer label="2 steps, All Complete - No render">
        <StepsCard
          description={cardDescription}
          steps={[
            stepStub({ completed: true, id: 1 }),
            stepStub({ completed: true, id: 2 }),
          ]}
          title={cardTitle}
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

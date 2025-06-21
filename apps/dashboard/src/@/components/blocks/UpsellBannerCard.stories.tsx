import type { Meta, StoryObj } from "@storybook/nextjs";
import { ArrowRightIcon, RocketIcon, StarIcon } from "lucide-react";
import { BadgeContainer } from "../../../stories/utils";
import { UpsellBannerCard } from "./UpsellBannerCard";

function Story() {
  return (
    <div className="container flex max-w-4xl flex-col gap-8 py-10">
      <BadgeContainer label="Green with icon (default)">
        <UpsellBannerCard
          accentColor="green"
          cta={{
            icon: <ArrowRightIcon className="size-4" />,
            link: "#",
            text: "View plans",
          }}
          description="Upgrade to increase limits and access advanced features."
          icon={<RocketIcon className="size-5" />}
          title="Unlock more with thirdweb"
        />
      </BadgeContainer>

      <BadgeContainer label="Blue accent">
        <UpsellBannerCard
          accentColor="blue"
          cta={{
            icon: <ArrowRightIcon className="size-4" />,
            link: "#",
            text: "Upgrade storage",
          }}
          description="Add additional space to your account."
          icon={<StarIcon className="size-5" />}
          title="Need more storage?"
        />
      </BadgeContainer>

      <BadgeContainer label="Purple without leading icon">
        <UpsellBannerCard
          accentColor="purple"
          cta={{
            icon: <ArrowRightIcon className="size-4" />,
            link: "#",
            text: "Request access",
          }}
          description="Get early access to experimental features."
          title="Join the beta"
        />
      </BadgeContainer>
    </div>
  );
}

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "blocks/Banners/UpsellBannerCard",
} satisfies Meta<typeof Story>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

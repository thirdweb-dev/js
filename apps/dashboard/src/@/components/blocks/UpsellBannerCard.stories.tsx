import type { Meta, StoryObj } from "@storybook/nextjs";
import { ArrowRightIcon, RocketIcon, StarIcon } from "lucide-react";
import { BadgeContainer } from "../../../stories/utils";
import { UpsellBannerCard } from "./UpsellBannerCard";

function Story() {
  return (
    <div className="container flex max-w-4xl flex-col gap-8 py-10">
      <BadgeContainer label="Green with icon (default)">
        <UpsellBannerCard
          title="Unlock more with thirdweb"
          description="Upgrade to increase limits and access advanced features."
          cta={{
            text: "View plans",
            icon: <ArrowRightIcon className="size-4" />,
            link: "#",
          }}
          icon={<RocketIcon className="size-5" />}
          accentColor="green"
        />
      </BadgeContainer>

      <BadgeContainer label="Blue accent">
        <UpsellBannerCard
          title="Need more storage?"
          description="Add additional space to your account."
          cta={{
            text: "Upgrade storage",
            icon: <ArrowRightIcon className="size-4" />,
            link: "#",
          }}
          icon={<StarIcon className="size-5" />}
          accentColor="blue"
        />
      </BadgeContainer>

      <BadgeContainer label="Purple without leading icon">
        <UpsellBannerCard
          title="Join the beta"
          description="Get early access to experimental features."
          cta={{
            text: "Request access",
            icon: <ArrowRightIcon className="size-4" />,
            link: "#",
          }}
          accentColor="purple"
        />
      </BadgeContainer>
    </div>
  );
}

const meta = {
  title: "blocks/Banners/UpsellBannerCard",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

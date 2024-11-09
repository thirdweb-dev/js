import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { DiscordIcon } from "components/icons/brand-icons/DiscordIcon";
import { GithubIcon } from "components/icons/brand-icons/GithubIcon";
import { LinkedInIcon } from "components/icons/brand-icons/LinkedinIcon";
import { MediumIcon } from "components/icons/brand-icons/MediumIcon";
import { MetaIcon } from "components/icons/brand-icons/MetaIcon";
import { RedditIcon } from "components/icons/brand-icons/RedditIcon";
import { TelegramIcon } from "components/icons/brand-icons/TelegramIcon";
import { XIcon } from "components/icons/brand-icons/XIcon";
import type { ProfileMetadata } from "constants/schemas";
import { GlobeIcon } from "lucide-react";
import { hostnameEndsWith } from "../../../utils/url";

const TRACKING_CATEGORY = "releaser-header";

export const PublisherSocials: React.FC<{
  publisherProfile: ProfileMetadata;
}> = ({ publisherProfile }) => (
  <div className="flex items-center gap-0.5">
    {publisherProfile.twitter && (
      <TrackedIconButton
        href={
          hostnameEndsWith(publisherProfile.twitter, "twitter.com")
            ? publisherProfile.twitter
            : `https://twitter.com/${publisherProfile.twitter}`
        }
        label="twitter"
        icon={XIcon}
      />
    )}

    {publisherProfile.discord && (
      <TrackedIconButton
        href={publisherProfile.discord}
        icon={DiscordIcon}
        label="discord"
      />
    )}

    {publisherProfile.github && (
      <TrackedIconButton
        href={
          hostnameEndsWith(publisherProfile.github, "github.com")
            ? publisherProfile.github
            : `https://github.com/${publisherProfile.github}`
        }
        icon={GithubIcon}
        label="github"
      />
    )}

    {publisherProfile.website && (
      <TrackedIconButton
        href={publisherProfile.website}
        icon={GlobeIcon}
        label="website"
      />
    )}

    {publisherProfile.medium && (
      <TrackedIconButton
        href={
          hostnameEndsWith(publisherProfile.medium, "medium.com")
            ? publisherProfile.medium
            : `https://medium.com/@${publisherProfile.medium}`
        }
        icon={MediumIcon}
        label="medium"
      />
    )}

    {publisherProfile.telegram && (
      <TrackedIconButton
        href={
          hostnameEndsWith(publisherProfile.telegram, "t.me")
            ? publisherProfile.telegram
            : `https://t.me/${publisherProfile.telegram}`
        }
        icon={TelegramIcon}
        label="telegram"
      />
    )}

    {publisherProfile.facebook && (
      <TrackedIconButton
        href={publisherProfile.facebook}
        icon={MetaIcon}
        label="facebook"
      />
    )}

    {publisherProfile.reddit && (
      <TrackedIconButton
        href={
          hostnameEndsWith(publisherProfile.reddit, "reddit.com")
            ? publisherProfile.reddit
            : `https://reddit.com/user/${publisherProfile.reddit}`
        }
        icon={RedditIcon}
        label="reddit"
      />
    )}

    {publisherProfile.linkedin && (
      <TrackedIconButton
        href={
          hostnameEndsWith(publisherProfile.linkedin, "linkedin.com")
            ? publisherProfile.linkedin
            : `https://linkedin.com/in/${publisherProfile.linkedin}`
        }
        icon={LinkedInIcon}
        label="linkedin"
      />
    )}
  </div>
);

function TrackedIconButton(props: {
  icon: React.FC<{ className?: string }>;
  href: string;
  label: string;
}) {
  return (
    <Button variant="ghost" size="sm">
      <TrackedLinkTW
        href={props.href}
        target="_blank"
        category={TRACKING_CATEGORY}
        label={props.label}
        aria-label={props.label}
      >
        <props.icon className="size-4" />
      </TrackedLinkTW>
    </Button>
  );
}

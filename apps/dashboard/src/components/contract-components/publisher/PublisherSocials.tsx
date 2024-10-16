import { ButtonGroup, type ButtonGroupProps } from "@chakra-ui/react";
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
import { LinkButton, TrackedIconButton } from "tw-components";
import { hostnameEndsWith } from "../../../utils/url";

const TRACKING_CATEGORY = "releaser-header";

interface PublisherSocialsProps extends ButtonGroupProps {
  publisherProfile: ProfileMetadata;
}

export const PublisherSocials: React.FC<PublisherSocialsProps> = ({
  publisherProfile,
  spacing = 0,
  size = "sm",
  ...props
}) => (
  <ButtonGroup size={size} spacing={spacing} {...props}>
    {publisherProfile.twitter && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          hostnameEndsWith(publisherProfile.twitter, "twitter.com")
            ? publisherProfile.twitter
            : `https://twitter.com/${publisherProfile.twitter}`
        }
        bg="transparent"
        aria-label="twitter"
        icon={<XIcon className="size-4" />}
        category={TRACKING_CATEGORY}
        label="twitter"
      />
    )}
    {publisherProfile.discord && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={publisherProfile.discord}
        bg="transparent"
        aria-label="discord"
        icon={<DiscordIcon className="size-4" />}
        category={TRACKING_CATEGORY}
        label="discord"
      />
    )}
    {publisherProfile.github && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          hostnameEndsWith(publisherProfile.github, "github.com")
            ? publisherProfile.github
            : `https://github.com/${publisherProfile.github}`
        }
        bg="transparent"
        aria-label="github"
        icon={<GithubIcon className="size-4" />}
        category={TRACKING_CATEGORY}
        label="github"
      />
    )}
    {publisherProfile.website && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={publisherProfile.website}
        bg="transparent"
        aria-label="website"
        icon={<GlobeIcon className="size-4" />}
        category={TRACKING_CATEGORY}
        label="website"
      />
    )}

    {publisherProfile.medium && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          hostnameEndsWith(publisherProfile.medium, "medium.com")
            ? publisherProfile.medium
            : `https://medium.com/@${publisherProfile.medium}`
        }
        bg="transparent"
        aria-label="medium"
        icon={<MediumIcon className="size-4" />}
        category={TRACKING_CATEGORY}
        label="medium"
      />
    )}
    {publisherProfile.telegram && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          hostnameEndsWith(publisherProfile.telegram, "t.me")
            ? publisherProfile.telegram
            : `https://t.me/${publisherProfile.telegram}`
        }
        bg="transparent"
        aria-label="telegram"
        icon={<TelegramIcon className="size-4" />}
        category={TRACKING_CATEGORY}
        label="telegram"
      />
    )}
    {publisherProfile.facebook && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={publisherProfile.facebook}
        bg="transparent"
        aria-label="facebook"
        icon={<MetaIcon className="size-4" />}
        category={TRACKING_CATEGORY}
        label="facebook"
      />
    )}
    {publisherProfile.reddit && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          hostnameEndsWith(publisherProfile.reddit, "reddit.com")
            ? publisherProfile.reddit
            : `https://reddit.com/user/${publisherProfile.reddit}`
        }
        bg="transparent"
        aria-label="reddit"
        icon={<RedditIcon className="size-4" />}
        category={TRACKING_CATEGORY}
        label="reddit"
      />
    )}
    {publisherProfile.linkedin && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          hostnameEndsWith(publisherProfile.linkedin, "linkedin.com")
            ? publisherProfile.linkedin
            : `https://linkedin.com/in/${publisherProfile.linkedin}`
        }
        bg="transparent"
        aria-label="linkedin"
        icon={<LinkedInIcon className="size-4" />}
        category={TRACKING_CATEGORY}
        label="linkedin"
      />
    )}
  </ButtonGroup>
);

import { ButtonGroup, Icon } from "@chakra-ui/react";
// eslint-disable-next-line no-duplicate-imports
import type { ButtonGroupProps } from "@chakra-ui/react";
import { SiDiscord } from "@react-icons/all-files/si/SiDiscord";
import { SiFacebook } from "@react-icons/all-files/si/SiFacebook";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { SiLinkedin } from "@react-icons/all-files/si/SiLinkedin";
import { SiMedium } from "@react-icons/all-files/si/SiMedium";
import { SiReddit } from "@react-icons/all-files/si/SiReddit";
import { SiTelegram } from "@react-icons/all-files/si/SiTelegram";
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";
import type { ProfileMetadata } from "@thirdweb-dev/sdk/evm";
import { FiGlobe } from "react-icons/fi";
import { LinkButton, TrackedIconButton } from "tw-components";

interface ReleaserSocialsProps extends ButtonGroupProps {
  releaserProfile: ProfileMetadata;
}

export const ReleaserSocials: React.FC<ReleaserSocialsProps> = ({
  releaserProfile,
  spacing = 0,
  size = "sm",
  ...props
}) => (
  <ButtonGroup size={size} spacing={spacing} {...props}>
    {releaserProfile.twitter && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          releaserProfile.twitter.includes("twitter.com")
            ? releaserProfile.twitter
            : `https://twitter.com/${releaserProfile.twitter}`
        }
        bg="transparent"
        aria-label="twitter"
        icon={<Icon as={SiTwitter} />}
        category="releaser-header"
        label="twitter"
      />
    )}
    {releaserProfile.discord && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={releaserProfile.discord}
        bg="transparent"
        aria-label="discord"
        icon={<Icon as={SiDiscord} />}
        category="releaser-header"
        label="discord"
      />
    )}
    {releaserProfile.github && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          releaserProfile.github.includes("github.com")
            ? releaserProfile.github
            : `https://github.com/${releaserProfile.github}`
        }
        bg="transparent"
        aria-label="github"
        icon={<Icon as={SiGithub} />}
        category="releaser-header"
        label="github"
      />
    )}
    {releaserProfile.website && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={releaserProfile.website}
        bg="transparent"
        aria-label="website"
        icon={<Icon as={FiGlobe} />}
        category="releaser-header"
        label="website"
      />
    )}

    {releaserProfile.medium && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          releaserProfile.medium.includes("medium.com")
            ? releaserProfile.medium
            : `https://medium.com/@${releaserProfile.medium}`
        }
        bg="transparent"
        aria-label="medium"
        icon={<Icon as={SiMedium} />}
        category="releaser-header"
        label="medium"
      />
    )}
    {releaserProfile.telegram && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          releaserProfile.telegram.includes("t.me")
            ? releaserProfile.telegram
            : `https://t.me/${releaserProfile.telegram}`
        }
        bg="transparent"
        aria-label="telegram"
        icon={<Icon as={SiTelegram} />}
        category="releaser-header"
        label="telegram"
      />
    )}
    {releaserProfile.facebook && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={releaserProfile.facebook}
        bg="transparent"
        aria-label="facebook"
        icon={<Icon as={SiFacebook} />}
        category="releaser-header"
        label="facebook"
      />
    )}
    {releaserProfile.reddit && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          releaserProfile.reddit.includes("reddit.com")
            ? releaserProfile.reddit
            : `https://reddit.com/user/${releaserProfile.reddit}`
        }
        bg="transparent"
        aria-label="reddit"
        icon={<Icon as={SiReddit} />}
        category="releaser-header"
        label="reddit"
      />
    )}
    {releaserProfile.linkedin && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={
          releaserProfile.linkedin.includes("linkedin.com")
            ? releaserProfile.linkedin
            : `https://linkedin.com/in/${releaserProfile.linkedin}`
        }
        bg="transparent"
        aria-label="linkedin"
        icon={<Icon as={SiLinkedin} />}
        category="releaser-header"
        label="linkedin"
      />
    )}
  </ButtonGroup>
);

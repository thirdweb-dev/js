import { Icon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { ProfileMetadata } from "@thirdweb-dev/sdk";
import { FiGlobe } from "react-icons/fi";
import {
  SiDiscord,
  SiFacebook,
  SiGithub,
  SiLinkedin,
  SiMedium,
  SiReddit,
  SiTelegram,
  SiTwitter,
} from "react-icons/si";
import { LinkButton, TrackedIconButton } from "tw-components";

interface ReleaserSocialsProps {
  releaserProfile: ProfileMetadata;
}

export const ReleaserSocials: React.FC<ReleaserSocialsProps> = ({
  releaserProfile,
}) => (
  <Flex>
    {releaserProfile.twitter && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={releaserProfile.twitter}
        bg="transparent"
        aria-label="twitter"
        icon={<Icon boxSize={5} as={SiTwitter} />}
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
        icon={<Icon boxSize={5} as={SiDiscord} />}
        category="releaser-header"
        label="discord"
      />
    )}
    {releaserProfile.github && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={releaserProfile.github}
        bg="transparent"
        aria-label="github"
        icon={<Icon boxSize={5} as={SiGithub} />}
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
        icon={<Icon boxSize={5} as={FiGlobe} />}
        category="releaser-header"
        label="website"
      />
    )}
    {releaserProfile.medium && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={releaserProfile.medium}
        bg="transparent"
        aria-label="medium"
        icon={<Icon boxSize={5} as={SiMedium} />}
        category="releaser-header"
        label="medium"
      />
    )}
    {releaserProfile.telegram && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={releaserProfile.telegram}
        bg="transparent"
        aria-label="telegram"
        icon={<Icon boxSize={5} as={SiTelegram} />}
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
        icon={<Icon boxSize={5} as={SiFacebook} />}
        category="releaser-header"
        label="facebook"
      />
    )}
    {releaserProfile.reddit && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={releaserProfile.reddit}
        bg="transparent"
        aria-label="reddit"
        icon={<Icon boxSize={5} as={SiReddit} />}
        category="releaser-header"
        label="reddit"
      />
    )}
    {releaserProfile.linkedin && (
      <TrackedIconButton
        as={LinkButton}
        isExternal
        noIcon
        href={releaserProfile.linkedin}
        bg="transparent"
        aria-label="linkedin"
        icon={<Icon boxSize={5} as={SiLinkedin} />}
        category="releaser-header"
        label="linkedin"
      />
    )}
  </Flex>
);

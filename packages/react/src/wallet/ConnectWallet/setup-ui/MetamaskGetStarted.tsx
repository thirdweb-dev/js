import { Spacer } from "../../../components/Spacer";
import { iconSize, spacing, radius } from "../../../design-system";
import { Theme } from "../../../design-system/index";
import { AppleStoreIcon } from "../icons/AppleStoreIcon";
import { ChromeIcon } from "../icons/ChromeIcon";
import { GooglePlayStoreIcon } from "../icons/GooglePlayStoreIcon";
import { MetamaskIcon } from "../icons/MetamaskIcon";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
} from "../shared/modalElements";
import styled from "@emotion/styled";

export const MetamaskGetStarted: React.FC<{ onBack: () => void }> = (props) => {
  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="lg" />

      <MetamaskIcon width={iconSize.xl} height={iconSize.xl} />
      <Spacer y="md" />

      <ModalTitle>Get started with Metamask</ModalTitle>
      <Spacer y="md" />

      <ModalDescription>
        Download your preferred option and then refresh this page.
      </ModalDescription>
      <Spacer y="xl" />

      {/* Chrome Extension  */}
      <ButtonLink
        target="_blank"
        href={
          "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
        }
      >
        <ChromeIcon size={iconSize.lg} />
        <span>Download Chrome Extension</span>
      </ButtonLink>
      <Spacer y="xs" />

      {/* Google Play store  */}
      <ButtonLink
        target="_blank"
        href={
          "https://play.google.com/store/apps/details?id=io.metamask&hl=en_US"
        }
      >
        <GooglePlayStoreIcon size={iconSize.lg} />
        <span>Download for Android</span>
      </ButtonLink>
      <Spacer y="xs" />

      {/* Apple Store  */}
      <ButtonLink
        target="_blank"
        href={
          "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202"
        }
      >
        <AppleStoreIcon size={iconSize.lg} />
        <span>Download for iOS</span>
      </ButtonLink>
    </>
  );
};

const ButtonLink = styled.a<{ theme?: Theme }>`
  all: unset;
  text-decoration: none;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.sm};
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  color: ${(p) => p.theme.text.neutral};
  background: ${(p) => p.theme.bg.elevated};
  transition: 100ms ease;
  &:hover {
    background: ${(p) => p.theme.bg.highlighted};
  }
`;

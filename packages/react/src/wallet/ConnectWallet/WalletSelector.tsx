import { Img } from "../../components/Img";
import { Spacer } from "../../components/Spacer";
import { Flex } from "../../components/basic";
import { Button } from "../../components/buttons";
import { HelperLink, ModalTitle } from "../../components/modalElements";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  Theme,
} from "../../design-system";
import styled from "@emotion/styled";
import { useWalletInfo, useWalletsInfo } from "./walletInfo";
import { WalletInfo } from "../types";
import { walletIds } from "@thirdweb-dev/wallets";

export const WalletSelector: React.FC<{
  onGetStarted: () => void;
  onGuestConnect: () => void;
}> = (props) => {
  const _allWalletsInfo = useWalletsInfo();
  const allWalletsInfo = _allWalletsInfo.filter(
    (w) => w.wallet.id !== walletIds.localWallet,
  );
  const localWalletInfo = useWalletInfo("localWallet", false);

  const showGetStarted =
    !localWalletInfo && !!allWalletsInfo[0].wallet.meta.urls;

  return (
    <>
      <ModalTitle>Choose your wallet</ModalTitle>
      <Spacer y="xl" />

      <WalletSelection walletsInfo={allWalletsInfo} />

      {localWalletInfo && (
        <>
          <Spacer y="xl" />
          <Flex justifyContent="center">
            <Button variant="link" onClick={props.onGuestConnect}>
              Continue as guest
            </Button>
          </Flex>
        </>
      )}

      {showGetStarted && (
        <>
          <Spacer y="xl" />
          <HelperLink
            as="button"
            onClick={props.onGetStarted}
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
            }}
          >
            Need help getting started?
          </HelperLink>
        </>
      )}
    </>
  );
};

export const WalletSelection: React.FC<{ walletsInfo: WalletInfo[] }> = ({
  walletsInfo,
}) => {
  // show the installed wallets first
  const sortedWalletsInfo = walletsInfo.sort((a, b) => {
    if (a.installed && !b.installed) {
      return -1;
    }
    if (!a.installed && b.installed) {
      return 1;
    }
    return 0;
  });

  return (
    <WalletList>
      {sortedWalletsInfo.map((walletInfo) => {
        return (
          <li key={walletInfo.wallet.id}>
            <WalletButton
              type="button"
              onClick={() => {
                walletInfo.connect();
              }}
            >
              <Img
                src={walletInfo.wallet.meta.iconURL}
                width={iconSize.lg}
                height={iconSize.lg}
                loading="eager"
              />
              <WalletName>{walletInfo.wallet.meta.name}</WalletName>
              {walletInfo.installed && <InstallBadge> Installed </InstallBadge>}
            </WalletButton>
          </li>
        );
      })}
    </WalletList>
  );
};

const WalletList = styled.ul`
  all: unset;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  box-sizing: border-box;
`;

const WalletButton = styled.button<{ theme?: Theme }>`
  all: unset;
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

const InstallBadge = styled.span<{ theme?: Theme }>`
  padding: ${spacing.xxs} ${spacing.xs};
  font-size: ${fontSize.xs};
  background-color: ${(p) => p.theme.badge.secondary};
  border-radius: ${radius.lg};
  margin-left: auto;
`;

const WalletName = styled.span`
  font-size: ${fontSize.md};
  font-weight: 500;
`;

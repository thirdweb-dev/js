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
import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { useConfiguredWallet } from "../hooks/useConfiguredWallet";

export const WalletSelector: React.FC<{
  configuredWallets: ConfiguredWallet[];
  selectWallet: (wallet: ConfiguredWallet) => void;
  onGetStarted: () => void;
}> = (props) => {
  const localWalletInfo = useConfiguredWallet("localWallet", false);

  const showGetStarted =
    !localWalletInfo && !!props.configuredWallets[0].meta.urls;

  return (
    <>
      <ModalTitle>Choose your wallet</ModalTitle>
      <Spacer y="xl" />

      <WalletSelection
        configuredWallets={props.configuredWallets}
        selectWallet={props.selectWallet}
      />

      {localWalletInfo && (
        <>
          <Spacer y="xl" />
          <Flex justifyContent="center">
            <Button
              variant="link"
              onClick={() => {
                props.selectWallet(localWalletInfo);
              }}
            >
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

export const WalletSelection: React.FC<{
  configuredWallets: ConfiguredWallet[];
  selectWallet: (wallet: ConfiguredWallet) => void;
}> = (props) => {
  // show the installed wallets first
  const configuredWallets = props.configuredWallets.sort((a, b) => {
    const aInstalled = a.isInstalled ? a.isInstalled() : false;
    const bInstalled = b.isInstalled ? b.isInstalled() : false;

    if (aInstalled && !bInstalled) {
      return -1;
    }
    if (!aInstalled && bInstalled) {
      return 1;
    }
    return 0;
  });

  return (
    <WalletList>
      {configuredWallets.map((configuredWallet) => {
        const isInstalled = configuredWallet.isInstalled
          ? configuredWallet.isInstalled()
          : false;
        return (
          <li key={configuredWallet.id}>
            <WalletButton
              type="button"
              onClick={() => {
                props.selectWallet(configuredWallet);
              }}
            >
              <Img
                src={configuredWallet.meta.iconURL}
                width={iconSize.lg}
                height={iconSize.lg}
                loading="eager"
              />
              <WalletName>{configuredWallet.meta.name}</WalletName>
              {isInstalled && <InstallBadge> Installed </InstallBadge>}
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

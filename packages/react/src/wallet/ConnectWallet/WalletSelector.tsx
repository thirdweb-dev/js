import { useContext } from "react";
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
import { WalletConfig } from "@thirdweb-dev/react-core";
import { walletIds } from "@thirdweb-dev/wallets";
import {
  ModalConfigCtx,
  SetModalConfigCtx,
} from "../../evm/providers/wallet-ui-states-provider";

export const WalletSelector: React.FC<{
  walletConfigs: WalletConfig[];
  selectWallet: (wallet: WalletConfig) => void;
  onGetStarted: () => void;
  title: string;
}> = (props) => {
  const localWalletInfo = props.walletConfigs.find(
    (w) => w.id === walletIds.localWallet,
  );
  const walletConfigs = props.walletConfigs.filter(
    (w) => w.id !== walletIds.localWallet,
  );

  const showGetStarted = !localWalletInfo && !!props.walletConfigs[0].meta.urls;

  return (
    <>
      <ModalTitle> {props.title} </ModalTitle>
      <Spacer y="xl" />

      <WalletSelection
        walletConfigs={walletConfigs}
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
              data-test="continue-as-guest-button"
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
  walletConfigs: WalletConfig[];
  selectWallet: (wallet: WalletConfig) => void;
}> = (props) => {
  const modalConfig = useContext(ModalConfigCtx);
  const setModalConfig = useContext(SetModalConfigCtx);
  const walletConfigs = props.walletConfigs
    // show the installed wallets first
    .sort((a, b) => {
      const aInstalled = a.isInstalled ? a.isInstalled() : false;
      const bInstalled = b.isInstalled ? b.isInstalled() : false;

      if (aInstalled && !bInstalled) {
        return -1;
      }
      if (!aInstalled && bInstalled) {
        return 1;
      }
      return 0;
    })
    // show the wallets with selectUI first before others
    .sort((a, b) => {
      if (a.selectUI && !b.selectUI) {
        return -1;
      }
      if (!a.selectUI && b.selectUI) {
        return 1;
      }
      return 0;
    });

  return (
    <WalletListContainer>
      {walletConfigs.map((walletConfig) => {
        const isInstalled = walletConfig.isInstalled
          ? walletConfig.isInstalled()
          : false;
        return (
          <li key={walletConfig.id}>
            {walletConfig.selectUI ? (
              <walletConfig.selectUI
                theme={modalConfig.theme}
                supportedWallets={props.walletConfigs}
                onSelect={(data) => {
                  props.selectWallet(walletConfig);
                  setModalConfig((config) => ({ ...config, data }));
                }}
                walletConfig={walletConfig}
              />
            ) : (
              <WalletButton
                type="button"
                onClick={() => {
                  props.selectWallet(walletConfig);
                }}
              >
                <Img
                  src={walletConfig.meta.iconURL}
                  width={iconSize.lg}
                  height={iconSize.lg}
                  loading="eager"
                />
                <WalletName>{walletConfig.meta.name}</WalletName>
                {isInstalled && <InstallBadge> Installed </InstallBadge>}
              </WalletButton>
            )}
          </li>
        );
      })}
    </WalletListContainer>
  );
};

const WalletListContainer = styled.ul`
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

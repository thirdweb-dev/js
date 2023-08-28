import { useContext } from "react";
import { Img } from "../../components/Img";
import { Spacer } from "../../components/Spacer";
import { Flex } from "../../components/basic";
import { Button, IconButton } from "../../components/buttons";
import { ModalTitle } from "../../components/modalElements";
import { fontSize, iconSize, media, spacing, Theme } from "../../design-system";
import styled from "@emotion/styled";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { walletIds } from "@thirdweb-dev/wallets";
import {
  ModalConfigCtx,
  SetModalConfigCtx,
} from "../../evm/providers/wallet-ui-states-provider";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { TWIcon } from "./icons/twIcon";

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

  return (
    <>
      <Flex gap="xs" alignItems="center">
        <TWIcon size={iconSize.md} />
        <ModalTitle> {props.title} </ModalTitle>
      </Flex>

      <Spacer y="xl" />

      <WalletSelection
        walletConfigs={walletConfigs}
        selectWallet={props.selectWallet}
      />

      <HelpIconContainer>
        <IconButton
          onClick={props.onGetStarted}
          variant="secondary"
          type="button"
          aria-label="Help"
        >
          <QuestionMarkCircledIcon
            style={{
              width: iconSize.md,
              height: iconSize.md,
              color: "inherit",
            }}
          />
        </IconButton>
      </HelpIconContainer>

      {localWalletInfo && (
        <>
          <Spacer y="xl" />
          <Flex justifyContent="center">
            <Button
              style={{
                width: "100%",
              }}
              variant="secondary"
              onClick={() => {
                props.selectWallet(localWalletInfo);
              }}
              data-test="continue-as-guest-button"
            >
              Continue as Guest
            </Button>
          </Flex>
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
    <WalletGrid>
      {walletConfigs.map((walletConfig) => {
        return (
          <li key={walletConfig.id} data-full-width={!!walletConfig.selectUI}>
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
                  width={"75"}
                  height={"75"}
                  loading="eager"
                />
                <WalletName>{walletConfig.meta.name}</WalletName>
              </WalletButton>
            )}
          </li>
        );
      })}
    </WalletGrid>
  );
};

const WalletGrid = styled.ul`
  all: unset;
  list-style-type: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: ${spacing.lg} ${spacing.sm};
  box-sizing: border-box;

  & [data-full-width="true"] {
    grid-column: 1/-1;
  }
`;

const WalletButton = styled.button<{ theme?: Theme }>`
  all: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm};
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  color: ${(p) => p.theme.text.secondary};

  &:hover {
    color: ${(p) => p.theme.text.neutral};
  }

  img {
    transition: transform 200ms ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const WalletName = styled.span<{ theme?: Theme }>`
  font-size: ${fontSize.xs};
  font-weight: 400;
  transition: color 200ms ease;
`;

const HelpIconContainer = styled.div`
  position: absolute;
  top: ${spacing.lg};
  right: 64px;
  ${media.mobile} {
    right: 60px;
  }
`;

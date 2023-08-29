import { useContext } from "react";
import { Img } from "../../components/Img";
import { Spacer } from "../../components/Spacer";
import {
  ScreenBottomContainer,
  Flex,
  ScreenContainer,
} from "../../components/basic";
import { Button } from "../../components/buttons";
import { ModalTitle } from "../../components/modalElements";
import { fontSize, iconSize, spacing, Theme } from "../../design-system";
import styled from "@emotion/styled";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { walletIds } from "@thirdweb-dev/wallets";
import {
  ModalConfigCtx,
  SetModalConfigCtx,
} from "../../evm/providers/wallet-ui-states-provider";
import { TWIcon } from "./icons/twIcon";
import { SecondaryText } from "../../components/text";

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
      <ScreenContainer
        style={{
          paddingBottom: 0,
        }}
      >
        <TitleContainer>
          <Flex gap="xxs" alignItems="center">
            <TWIcon size={iconSize.md} />

            <ModalTitle> {props.title} </ModalTitle>
          </Flex>
        </TitleContainer>

        <Spacer y="xl" />

        <WalletSelection
          walletConfigs={walletConfigs}
          selectWallet={props.selectWallet}
        />
      </ScreenContainer>

      <ScreenBottomContainer>
        <Flex justifyContent="space-between">
          <SecondaryText
            style={{
              fontSize: fontSize.sm,
            }}
          >
            {" "}
            New to wallets?
          </SecondaryText>
          <Button
            variant="link"
            onClick={props.onGetStarted}
            style={{
              fontSize: fontSize.sm,
            }}
          >
            Get started
          </Button>
        </Flex>

        {localWalletInfo && (
          <>
            <Spacer y="lg" />
            <Flex justifyContent="center">
              <Button
                fullWidth
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
      </ScreenBottomContainer>
    </>
  );
};

const TitleContainer = /* @__PURE__ */ styled.div<{ theme?: Theme }>`
  color: ${(p) => p.theme.text.neutral};
`;

export const WalletSelection: React.FC<{
  walletConfigs: WalletConfig[];
  selectWallet: (wallet: WalletConfig) => void;
  maxHeight?: string;
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
    <WalletGrid
      style={{
        maxHeight: props.maxHeight,
      }}
    >
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
                  width={"80"}
                  height={"80"}
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

const WalletGrid = styled.ul<{ theme?: Theme }>`
  all: unset;
  list-style-type: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: ${spacing.lg} ${spacing.sm};
  box-sizing: border-box;
  max-height: 400px;
  overflow: auto;
  scrollbar-width: none;
  /* to show the box-shadow of inputs that overflows  */
  padding: 2px;
  margin: -2px;
  padding-bottom: 0;
  margin-bottom: 0;
  padding-bottom: ${spacing.xl};

  &::-webkit-scrollbar {
    width: 0px;
    display: none;
  }

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
  font-size: ${fontSize.sm};
  font-weight: 500;
  transition: color 200ms ease;
`;

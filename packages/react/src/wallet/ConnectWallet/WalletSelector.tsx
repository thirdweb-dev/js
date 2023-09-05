import { useContext, useState } from "react";
import { Img } from "../../components/Img";
import {
  ScreenBottomContainer,
  Flex,
  ScreenContainer,
  noScrollBar,
} from "../../components/basic";
import { Button } from "../../components/buttons";
import { BackButton, ModalTitle } from "../../components/modalElements";
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
import { TWIcon } from "./icons/twIcon";
import { AccentText, SecondaryText } from "../../components/text";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Spacer } from "../../components/Spacer";
import { TextDivider } from "../../components/TextDivider";

export const WalletSelector: React.FC<{
  walletConfigs: WalletConfig[];
  selectWallet: (wallet: WalletConfig) => void;
  onGetStarted: () => void;
  title: string;
}> = (props) => {
  const modalConfig = useContext(ModalConfigCtx);

  const localWalletInfo = props.walletConfigs.find(
    (w) => w.id === walletIds.localWallet,
  );

  const walletConfigs = props.walletConfigs.filter(
    (w) => w.id !== walletIds.localWallet,
  );

  const socialLogins = props.walletConfigs.filter(
    (w) => w.category === "socialLogin",
  );

  const otherLogins = sortWalletConfigs(
    props.walletConfigs.filter((w) => w.category !== "socialLogin"),
  );

  const otherLoginCount = props.walletConfigs.length - socialLogins.length;
  const shouldGroupWallets = socialLogins.length >= 1 && otherLoginCount >= 2;

  // if there is a socialLogin category wallet and 2 or more of other wallet, do not show all the wallets in list directly

  const [isWalletGroupExpanded, setIsWalletGroupExpanded] = useState(false);

  const isCompact = modalConfig.modalSize === "compact";

  const hasBottomContainerContent =
    localWalletInfo || modalConfig.modalSize === "compact";

  let showBottomContainer = hasBottomContainerContent;

  if (isCompact && shouldGroupWallets && !isWalletGroupExpanded) {
    showBottomContainer = false;
  }

  return (
    <>
      <ScreenContainer>
        <TitleContainer>
          <Flex gap="xxs" alignItems="center">
            <TWIcon size={iconSize.md} />
            <ModalTitle> {props.title} </ModalTitle>
          </Flex>
        </TitleContainer>
      </ScreenContainer>

      <ScrollableContainer>
        {isCompact && shouldGroupWallets ? (
          <>
            {isWalletGroupExpanded && (
              <>
                <BackButton
                  onClick={() => {
                    setIsWalletGroupExpanded(false);
                  }}
                />
                <Spacer y="md" />
                <WalletSelection
                  walletConfigs={otherLogins.filter(
                    (w) => w.id !== walletIds.localWallet,
                  )}
                  selectWallet={props.selectWallet}
                />
              </>
            )}

            {!isWalletGroupExpanded && (
              <>
                <WalletSelection
                  walletConfigs={socialLogins}
                  selectWallet={props.selectWallet}
                />
                <TextDivider>
                  <span> OR </span>
                </TextDivider>
                <Spacer y="lg" />
                <Button
                  fullWidth
                  variant="secondary"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: spacing.sm,
                  }}
                  onClick={() => {
                    setIsWalletGroupExpanded(true);
                  }}
                >
                  <Flex gap="xxs">
                    {otherLogins.slice(0, 2).map((w) => (
                      <Img
                        key={w.id}
                        width={iconSize.sm}
                        height={iconSize.sm}
                        src={w.meta.iconURL}
                      />
                    ))}
                  </Flex>
                  Connect a wallet
                </Button>
                <Spacer y="xl" />
              </>
            )}
          </>
        ) : (
          <WalletSelection
            walletConfigs={walletConfigs}
            selectWallet={props.selectWallet}
          />
        )}
      </ScrollableContainer>

      {showBottomContainer && (
        <ScreenBottomContainer
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacing.lg,
          }}
        >
          {modalConfig.modalSize === "compact" && (
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
          )}

          {localWalletInfo && (
            <>
              <Flex justifyContent="center">
                <Button
                  fullWidth
                  variant={
                    modalConfig.modalSize === "wide" ? "link" : "secondary"
                  }
                  style={
                    modalConfig.modalSize === "wide"
                      ? {
                          textAlign: "left",
                          justifyContent: "flex-start",
                        }
                      : undefined
                  }
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
      )}
    </>
  );
};

const ScrollableContainer = /* @__PURE__ */ styled(ScreenContainer)`
  padding-bottom: 0;
  padding-top: 2px;
  /* flex: 1; */
  overflow: auto;
  ${noScrollBar};
`;

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
  const walletConfigs = sortWalletConfigs(props.walletConfigs);

  return (
    <WalletList>
      {walletConfigs.map((walletConfig) => {
        return (
          <li key={walletConfig.id} data-full-width={!!walletConfig.selectUI}>
            {walletConfig.selectUI ? (
              <walletConfig.selectUI
                modalSize={modalConfig.modalSize}
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
                  width={iconSize.xl}
                  height={iconSize.xl}
                  loading="eager"
                />
                <WalletNameContainer>
                  <Flex flexDirection="column" gap="xxs">
                    <WalletName>{walletConfig.meta.name}</WalletName>
                    {walletConfig.isInstalled && walletConfig.isInstalled() && (
                      <AccentText
                        style={{
                          fontSize: fontSize.sm,
                        }}
                      >
                        Installed
                      </AccentText>
                    )}
                  </Flex>
                  <ChevronRightIcon
                    data-chveron
                    width={iconSize.sm}
                    height={iconSize.sm}
                  />
                </WalletNameContainer>
              </WalletButton>
            )}
          </li>
        );
      })}
    </WalletList>
  );
};

const WalletNameContainer = styled.div<{ theme?: Theme }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const WalletList = styled.ul<{ theme?: Theme }>`
  all: unset;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  box-sizing: border-box;
  overflow-y: auto;
  ${noScrollBar}

  /* to show the box-shadow of inputs that overflows  */
  padding: 2px;
  margin: -2px;
  padding-bottom: 0;
  margin-bottom: 0;
  padding-bottom: ${spacing.xl};
`;

const WalletButton = styled.button<{ theme?: Theme }>`
  all: unset;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  color: ${(p) => p.theme.text.secondary};
  border-radius: ${radius.md};
  position: relative;

  & svg[data-chveron] {
    opacity: 0;
    transform: translateX(-10px);
    transition: all 200ms ease;
  }

  &:hover svg[data-chveron] {
    opacity: 1;
    transform: translateX(0px);
  }
`;

const WalletName = styled.span<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  font-weight: 500;
  color: ${(p) => p.theme.text.neutral};
`;

function sortWalletConfigs(walletConfigs: WalletConfig[]) {
  return (
    walletConfigs
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
      })
  );
}

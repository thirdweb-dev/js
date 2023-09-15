import { useContext, useState } from "react";
import { Img } from "../../components/Img";
import {
  noScrollBar,
  ModalHeader,
  Container,
  ScreenBottomContainer,
  Line,
} from "../../components/basic";
import { Button } from "../../components/buttons";
import { ModalTitle } from "../../components/modalElements";
import { iconSize, radius, spacing, Theme } from "../../design-system";
import styled from "@emotion/styled";
import {
  WalletConfig,
  useConnectionStatus,
  useDisconnect,
} from "@thirdweb-dev/react-core";
import { walletIds } from "@thirdweb-dev/wallets";
import {
  ModalConfigCtx,
  SetModalConfigCtx,
} from "../../evm/providers/wallet-ui-states-provider";
import { TWIcon } from "./icons/twIcon";
import { Link, Text } from "../../components/text";
import { Spacer } from "../../components/Spacer";
import { TextDivider } from "../../components/TextDivider";
import { TOS } from "./Modal/TOS";

export const WalletSelector: React.FC<{
  walletConfigs: WalletConfig[];
  selectWallet: (wallet: WalletConfig) => void;
  onGetStarted: () => void;
  title: string;
}> = (props) => {
  const modalConfig = useContext(ModalConfigCtx);
  const isCompact = modalConfig.modalSize === "compact";
  const { termsOfServiceUrl, privacyPolicyUrl } = modalConfig;
  const [isWalletGroupExpanded, setIsWalletGroupExpanded] = useState(false);
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();

  const localWalletConfig = props.walletConfigs.find(
    (w) => w.id === walletIds.localWallet,
  );

  const nonLocalWalletConfigs = props.walletConfigs.filter(
    (w) => w.id !== walletIds.localWallet,
  );

  const socialWallets = nonLocalWalletConfigs.filter(
    (w) => w.category === "socialLogin",
  );

  const eoaWallets = sortWalletConfigs(
    nonLocalWalletConfigs.filter((w) => w.category !== "socialLogin"),
  );

  const showNewToWallets =
    isCompact && (socialWallets.length === 0 || isWalletGroupExpanded);

  // groups UI is showing a social login + grouping all eoa wallets together in a group
  // do this if there is social login and more than 2 eoa wallets
  const showGroupsUI =
    isCompact && socialWallets.length >= 1 && eoaWallets.length >= 2;

  const showTOS = isCompact && (termsOfServiceUrl || privacyPolicyUrl);

  const showFooter = Boolean(
    (!showGroupsUI && localWalletConfig) || showNewToWallets,
  );

  const continueAsGuest = localWalletConfig && (
    <Button
      fullWidth
      variant={isCompact ? "outline" : "link"}
      style={
        !isCompact
          ? {
              textAlign: "left",
              justifyContent: "flex-start",
            }
          : undefined
      }
      onClick={() => {
        props.selectWallet(localWalletConfig);
      }}
      data-test="continue-as-guest-button"
    >
      Continue as Guest
    </Button>
  );

  const twTitle = (
    <Container gap="xxs" center="y" flex="row">
      <TWIcon size={iconSize.md} />
      <ModalTitle> {props.title} </ModalTitle>
    </Container>
  );

  const handleSelect = async (wallet: WalletConfig) => {
    if (connectionStatus !== "disconnected") {
      await disconnect();
    }
    props.selectWallet(wallet);
  };

  const showSeperatorLine = showNewToWallets && !continueAsGuest && showTOS;

  return (
    <Container scrollY flex="column" animate="fadein">
      {/* Header */}
      <Container p="lg">
        {isWalletGroupExpanded ? (
          <ModalHeader
            title={twTitle}
            onBack={() => {
              setIsWalletGroupExpanded(false);
            }}
          />
        ) : (
          twTitle
        )}
      </Container>

      {/* Body */}
      <Container
        expand
        scrollY
        px="md"
        style={{
          paddingTop: "2px",
        }}
      >
        {showGroupsUI ? (
          <>
            {isWalletGroupExpanded ? (
              <WalletSelection
                walletConfigs={eoaWallets}
                selectWallet={handleSelect}
              />
            ) : (
              <Container px="xs">
                <WalletSelection
                  walletConfigs={socialWallets}
                  selectWallet={handleSelect}
                />

                <TextDivider>
                  <span> OR </span>
                </TextDivider>

                <Spacer y="lg" />

                {/* connect a wallet */}
                <Button
                  fullWidth
                  variant="outline"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: spacing.sm,
                    padding: spacing.md,
                  }}
                  onClick={() => {
                    setIsWalletGroupExpanded(true);
                  }}
                >
                  <Container flex="row" gap="xxs">
                    {eoaWallets.slice(0, 2).map((w) => (
                      <Img
                        key={w.id}
                        width={iconSize.sm}
                        height={iconSize.sm}
                        src={w.meta.iconURL}
                      />
                    ))}
                  </Container>
                  Connect a wallet
                </Button>

                {continueAsGuest ? (
                  <>
                    <Spacer y="md" />
                    {continueAsGuest}
                    <Spacer y="xl" />
                  </>
                ) : (
                  <Spacer y="xl" />
                )}
              </Container>
            )}
          </>
        ) : (
          <WalletSelection
            walletConfigs={nonLocalWalletConfigs}
            selectWallet={handleSelect}
          />
        )}
      </Container>

      {/* Footer */}
      {showFooter && (
        <ScreenBottomContainer>
          {showNewToWallets && (
            <Container
              flex="row"
              style={{
                justifyContent: "space-between",
              }}
            >
              <Text color="secondaryText" size="sm" weight={500}>
                New to wallets?
              </Text>
              <Link
                weight={500}
                size="sm"
                target="_blank"
                href="https://ethereum.org/en/wallets/find-wallet/"
              >
                Get started
              </Link>
            </Container>
          )}

          {!showGroupsUI && continueAsGuest}
        </ScreenBottomContainer>
      )}

      {showTOS && !isWalletGroupExpanded && (
        <div>
          {showSeperatorLine && <Line />}

          <Container
            p="md"
            style={
              !showSeperatorLine
                ? {
                    paddingTop: 0,
                  }
                : undefined
            }
          >
            {isCompact && (
              <TOS
                termsOfServiceUrl={termsOfServiceUrl}
                privacyPolicyUrl={privacyPolicyUrl}
              />
            )}
          </Container>
        </div>
      )}
    </Container>
  );
};

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
                theme={
                  typeof modalConfig.theme === "string"
                    ? modalConfig.theme
                    : modalConfig.theme.type
                }
                supportedWallets={props.walletConfigs}
                onSelect={(data) => {
                  props.selectWallet(walletConfig);
                  setModalConfig((config) => ({ ...config, data }));
                }}
                walletConfig={walletConfig}
              />
            ) : (
              <WalletEntryButton
                walletConfig={walletConfig}
                selectWallet={() => {
                  props.selectWallet(walletConfig);
                }}
              />
            )}
          </li>
        );
      })}
    </WalletList>
  );
};

export function WalletEntryButton(props: {
  walletConfig: WalletConfig<any>;
  selectWallet: () => void;
}) {
  const { walletConfig, selectWallet } = props;
  const isRecommended = walletConfig.recommended;
  return (
    <WalletButton
      type="button"
      onClick={() => {
        selectWallet();
      }}
    >
      <Img
        src={walletConfig.meta.iconURL}
        width={iconSize.xl}
        height={iconSize.xl}
        loading="eager"
      />

      <Container flex="column" gap="xxs" expand>
        <Text color="primaryText" weight={500}>
          {walletConfig.meta.name}
        </Text>

        {isRecommended && (
          <Text size="sm" color="accentText" weight={500}>
            Recommended
          </Text>
        )}

        {!isRecommended &&
          walletConfig.isInstalled &&
          walletConfig.isInstalled() && (
            <Text size="sm" weight={500}>
              Installed
            </Text>
          )}
      </Container>
    </WalletButton>
  );
}

const WalletList = styled.ul<{ theme?: Theme }>`
  all: unset;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-sizing: border-box;
  overflow-y: auto;
  flex: 1;
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
  color: ${(p) => p.theme.colors.secondaryText};
  position: relative;
  border-radius: ${radius.md};
  padding: ${spacing.xs} ${spacing.xs};

  &:hover {
    background-color: ${(p) => p.theme.colors.walletSelectorButtonHoverBg};
  }

  transition:
    background-color 200ms ease,
    transform 200ms ease;

  &:hover {
    transform: scale(1.01);
  }
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
      // show the reccomended wallets even before that
      .sort((a, b) => {
        if (a.recommended && !b.recommended) {
          return -1;
        }
        if (!a.recommended && b.recommended) {
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

import { useContext, useState } from "react";
import { Img } from "../../components/Img";
import {
  Flex,
  noScrollBar,
  ModalHeader,
  Container,
  Separator,
} from "../../components/basic";
import { Button } from "../../components/buttons";
import { ModalTitle } from "../../components/modalElements";
import { iconSize, radius, spacing, Theme } from "../../design-system";
import styled from "@emotion/styled";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { walletIds } from "@thirdweb-dev/wallets";
import {
  ModalConfigCtx,
  SetModalConfigCtx,
} from "../../evm/providers/wallet-ui-states-provider";
import { TWIcon } from "./icons/twIcon";
import { Link, Text } from "../../components/text";
import { Spacer } from "../../components/Spacer";
import { TextDivider } from "../../components/TextDivider";

export const WalletSelector: React.FC<{
  walletConfigs: WalletConfig[];
  selectWallet: (wallet: WalletConfig) => void;
  onGetStarted: () => void;
  title: string;
}> = (props) => {
  const modalConfig = useContext(ModalConfigCtx);
  const isCompact = modalConfig.modalSize === "compact";
  const [isWalletGroupExpanded, setIsWalletGroupExpanded] = useState(false);

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

  const showFooter = (!showGroupsUI && localWalletConfig) || showNewToWallets;

  const continueAsGuest = localWalletConfig && (
    <Flex justifyContent="center">
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
    </Flex>
  );

  const twTitle = (
    <Flex gap="xxs" alignItems="center">
      <TWIcon size={iconSize.md} />
      <ModalTitle> {props.title} </ModalTitle>
    </Flex>
  );

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
      <Container expand scrollY px="md">
        {showGroupsUI ? (
          <>
            {isWalletGroupExpanded ? (
              <WalletSelection
                walletConfigs={eoaWallets}
                selectWallet={props.selectWallet}
              />
            ) : (
              <Container px="xs">
                <WalletSelection
                  walletConfigs={socialWallets}
                  selectWallet={props.selectWallet}
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
                  <Flex gap="xxs">
                    {eoaWallets.slice(0, 2).map((w) => (
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

                {continueAsGuest ? (
                  <>
                    <Spacer y="md" />
                    {continueAsGuest}
                    <Spacer y="lg" />
                  </>
                ) : (
                  <Spacer y="lg" />
                )}
              </Container>
            )}
          </>
        ) : (
          <WalletSelection
            walletConfigs={nonLocalWalletConfigs}
            selectWallet={props.selectWallet}
          />
        )}
      </Container>

      {/* Footer */}
      {showFooter && (
        <>
          <Separator />
          <Container flex="column" gap="lg" p="lg">
            {showNewToWallets && (
              <Flex justifyContent="space-between">
                <Text color="secondary" size="sm">
                  New to wallets?
                </Text>
                <Link
                  small
                  target="_blank"
                  href="https://ethereum.org/en/wallets/find-wallet/"
                >
                  Get started
                </Link>
              </Flex>
            )}

            {!showGroupsUI && continueAsGuest}
          </Container>
        </>
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
                theme={modalConfig.theme}
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
      <WalletNameContainer>
        <Flex flexDirection="column" gap="xxs">
          <Text color="neutral" weight={500}>
            {walletConfig.meta.name}
          </Text>
          {isRecommended && (
            <Text size="sm" color="accent">
              Recommended
            </Text>
          )}

          {!isRecommended &&
            walletConfig.isInstalled &&
            walletConfig.isInstalled() && <Text size="sm">Installed</Text>}
        </Flex>
      </WalletNameContainer>
    </WalletButton>
  );
}

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
  color: ${(p) => p.theme.text.secondary};
  position: relative;
  border-radius: ${radius.md};
  padding: ${spacing.xs} ${spacing.xs};
  transition: background 300ms ease;

  &:hover {
    background-color: ${(p) => p.theme.bg.elevated};
  }

  transition: transform 200ms ease;
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

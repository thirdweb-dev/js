import { useContext, useEffect, useRef, useState } from "react";
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

  // prevent accidental clicks on the TW icon when clicking on back icon from previous screen
  const enableTWIconLink = useRef(false);
  useEffect(() => {
    setTimeout(() => {
      enableTWIconLink.current = true;
    }, 1000);
  }, []);

  const twTitle = (
    <Container gap="xxs" center="y" flex="row">
      {modalConfig.titleIconUrl === undefined ? (
        <Link
          color="primaryText"
          hoverColor="accentText"
          target="_blank"
          href="https://thirdweb.com/connect?utm_source=cw"
          style={{
            display: "flex",
            alignItems: "center",
          }}
          onClick={(e) => {
            if (!enableTWIconLink.current) {
              e.preventDefault();
            }
          }}
        >
          <TWIcon size={iconSize.md} />
        </Link>
      ) : modalConfig.titleIconUrl === "" ? null : (
        <Img
          src={modalConfig.titleIconUrl}
          width={iconSize.md}
          height={iconSize.md}
        />
      )}

      <ModalTitle> {props.title} </ModalTitle>
    </Container>
  );

  const handleSelect = async (wallet: WalletConfig) => {
    if (connectionStatus !== "disconnected") {
      await disconnect();
    }
    props.selectWallet(wallet);
  };

  const connectAWallet = (
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
  );

  const newToWallets = (
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
        href="https://blog.thirdweb.com/web3-wallet/"
      >
        Get started
      </Link>
    </Container>
  );

  const tos =
    termsOfServiceUrl || privacyPolicyUrl ? (
      <TOS
        termsOfServiceUrl={termsOfServiceUrl}
        privacyPolicyUrl={privacyPolicyUrl}
      />
    ) : undefined;

  let topSection: React.ReactNode;
  let bottomSection: React.ReactNode;

  // wide modal
  if (!isCompact) {
    topSection = (
      <WalletSelection
        walletConfigs={nonLocalWalletConfigs}
        selectWallet={handleSelect}
      />
    );

    if (continueAsGuest) {
      bottomSection = (
        <ScreenBottomContainer>{continueAsGuest}</ScreenBottomContainer>
      );
    }
  }

  // compact
  else {
    // no social logins
    if (socialWallets.length === 0) {
      topSection = (
        <WalletSelection
          walletConfigs={nonLocalWalletConfigs}
          selectWallet={handleSelect}
        />
      );

      bottomSection = (
        <>
          <Line />
          <Container flex="column" p="lg" gap="lg">
            {newToWallets}
            {continueAsGuest}
          </Container>
          {!continueAsGuest && <Line />}
          {tos && (
            <Container
              px="md"
              style={{
                paddingBottom: spacing.md,
                paddingTop: continueAsGuest ? 0 : spacing.md,
              }}
            >
              {tos}
            </Container>
          )}
        </>
      );
    }

    // social logins
    else {
      // not expanded state
      if (!isWalletGroupExpanded) {
        topSection = (
          <Container px="xs">
            <WalletSelection
              walletConfigs={socialWallets}
              selectWallet={handleSelect}
            />
            {eoaWallets.length > 0 && (
              <>
                <TextDivider text="OR" />
                <Spacer y="lg" />
              </>
            )}
          </Container>
        );

        // only social login - no eoa wallets
        if (eoaWallets.length === 0) {
          bottomSection = tos ? (
            <>
              <Spacer y="md" />
              <Line />
              {continueAsGuest && (
                <Container p="lg"> {continueAsGuest}</Container>
              )}
              {tos && <Container p="md"> {tos} </Container>}
            </>
          ) : (
            <Spacer y="sm" />
          );
        }

        // social login + eoa wallets
        else {
          // social login + More than 1 eoa wallets
          if (eoaWallets.length > 1) {
            bottomSection = (
              <Container flex="column" gap="sm">
                <Container px="lg" flex="column" gap="md">
                  {connectAWallet}
                  {continueAsGuest}
                </Container>

                {tos ? (
                  <Container p="md"> {tos} </Container>
                ) : (
                  <Spacer y="md" />
                )}
              </Container>
            );
          }

          // social login + single eoa wallet
          else {
            bottomSection = (
              <>
                <Container px="lg">
                  <WalletSelection
                    walletConfigs={eoaWallets}
                    selectWallet={handleSelect}
                  />
                </Container>

                {continueAsGuest && (
                  <Container flex="column" px="lg" gap="lg">
                    {continueAsGuest}
                  </Container>
                )}

                {tos ? (
                  <>
                    {continueAsGuest ? <Spacer y="md" /> : <Line />}
                    <Container p="md"> {tos} </Container>
                  </>
                ) : (
                  <>{continueAsGuest && <Spacer y="xl" />}</>
                )}
              </>
            );
          }
        }
      }

      // expanded state
      else {
        topSection = (
          <WalletSelection
            walletConfigs={eoaWallets}
            selectWallet={handleSelect}
          />
        );

        bottomSection = (
          <ScreenBottomContainer>{newToWallets}</ScreenBottomContainer>
        );
      }
    }
  }

  return (
    <Container scrollY flex="column" animate="fadein" fullHeight>
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
        {topSection}
      </Container>

      {bottomSection}
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
        <Text color="primaryText" weight={600}>
          {walletConfig.meta.name}
        </Text>

        {isRecommended && <Text size="sm">Recommended</Text>}

        {!isRecommended &&
          walletConfig.isInstalled &&
          walletConfig.isInstalled() && <Text size="sm">Installed</Text>}
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
  padding-bottom: ${spacing.lg};
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
      // show the recommended wallets even before that
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

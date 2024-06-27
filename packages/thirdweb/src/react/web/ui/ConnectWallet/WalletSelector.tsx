"use client";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { InjectedSupportedWalletIds } from "../../../../wallets/__generated__/wallet-ids.js";
import { createWallet } from "../../../../wallets/create-wallet.js";
import { getInstalledWalletProviders } from "../../../../wallets/injected/mipdStore.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../wallets/smart/types.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { sortWallets } from "../../utils/sortWallets.js";
import { LoadingScreen } from "../../wallets/shared/LoadingScreen.js";
import { Img } from "../components/Img.js";
import { Spacer } from "../components/Spacer.js";
import { TextDivider } from "../components/TextDivider.js";
import {
  Container,
  Line,
  ModalHeader,
  ScreenBottomContainer,
  noScrollBar,
} from "../components/basic.js";
import { Button, IconButton } from "../components/buttons.js";
import { ModalTitle } from "../components/modalElements.js";
import { Link } from "../components/text.js";
import { Text } from "../components/text.js";
import { StyledDiv, StyledUl } from "../design-system/elements.js";
import type { LocaleId } from "../types.js";
import { SmartConnectUI } from "./Modal/SmartWalletConnectUI.js";
import { TOS } from "./Modal/TOS.js";
import { PoweredByThirdweb } from "./PoweredByTW.js";
import { WalletButton, WalletEntryButton } from "./WalletEntryButton.js";
import { WalletTypeRowButton } from "./WalletTypeRowButton.js";
import { compactModalMaxHeight } from "./constants.js";
import { genericWalletIcon } from "./icons/dataUris.js";
import type { ConnectLocale } from "./locale/types.js";

const InAppWalletSelectionUI = /* @__PURE__ */ lazy(
  () => import("../../wallets/in-app/InAppWalletSelectionUI.js"),
);

// const localWalletId = "local";
const inAppWalletId: WalletId = "inApp";

type WalletSelectorProps = {
  wallets: Wallet[];
  selectWallet: (wallet: Wallet) => void;
  onGetStarted: () => void;
  title: string;
  done: (wallet: Wallet) => void;
  goBack?: () => void;
  onShowAll: () => void;
  setModalVisibility: (value: boolean) => void;
  accountAbstraction?: SmartWalletOptions;
  size: "compact" | "wide";
  meta: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  recommendedWallets: Wallet[] | undefined;
  isEmbed: boolean;
  localeId: LocaleId;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  showAllWallets: boolean | undefined;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
};

/**
 * @internal
 */
export function WalletSelector(props: WalletSelectorProps) {
  const [personalWallet, setPersonalWallet] = useState<Wallet | null>(null);

  if (!props.accountAbstraction) {
    return <WalletSelectorInner {...props} />;
  }

  if (personalWallet) {
    return (
      <SmartConnectUI
        accountAbstraction={props.accountAbstraction}
        done={props.done}
        personalWallet={personalWallet}
        setModalVisibility={props.setModalVisibility}
        onBack={props.goBack}
        meta={props.meta}
        size={props.size}
        localeId={props.localeId}
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        walletConnect={props.walletConnect}
        connectLocale={props.connectLocale}
      />
    );
  }

  return (
    <WalletSelectorInner
      {...props}
      done={(w) => {
        setPersonalWallet(w);
      }}
    />
  );
}

/**
 * @internal
 */
const WalletSelectorInner: React.FC<WalletSelectorProps> = (props) => {
  const isCompact = props.size === "compact";
  const [isWalletGroupExpanded, setIsWalletGroupExpanded] = useState(false);

  const installedWallets = getInstalledWallets();
  const propsWallets = props.wallets;
  const _wallets: Wallet[] = [...propsWallets];

  for (const iW of installedWallets) {
    if (!propsWallets.find((w) => w.id === iW.id)) {
      _wallets.push(iW);
    }
  }

  const localWalletConfig = false; // _wallets.find((w) => w.id === localWalletId);

  const nonLocalWalletConfigs = _wallets; // _wallets.filter((w) => w.id !== localWalletId);

  const socialWallets = nonLocalWalletConfigs.filter(
    (w) => w.id === inAppWalletId,
  );

  const eoaWallets = sortWallets(
    nonLocalWalletConfigs.filter((w) => w.id !== inAppWalletId),
    props.recommendedWallets,
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
      {props.connectLocale.continueAsGuest}
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
      {!props.meta.titleIconUrl ? null : (
        <Img
          src={props.meta.titleIconUrl}
          width={iconSize.md}
          height={iconSize.md}
          client={props.client}
        />
      )}

      <ModalTitle> {props.title} </ModalTitle>
    </Container>
  );

  const handleSelect = async (wallet: Wallet) => {
    // if (connectionStatus !== "disconnected") {
    //   await disconnect();
    // }
    props.selectWallet(wallet);
  };

  const connectAWallet = (
    <WalletTypeRowButton
      client={props.client}
      icon={genericWalletIcon}
      onClick={() => {
        setIsWalletGroupExpanded(true);
      }}
      title={props.connectLocale.connectAWallet}
    />
  );

  const newToWallets = (
    <Container
      flex="row"
      style={{
        justifyContent: "space-between",
      }}
    >
      <Text color="secondaryText" size="sm" weight={500}>
        {props.connectLocale.newToWallets}
      </Text>
      <Link
        weight={500}
        size="sm"
        target="_blank"
        href="https://blog.thirdweb.com/web3-wallet/"
      >
        {props.connectLocale.getStarted}
      </Link>
    </Container>
  );

  const tos =
    props.meta.termsOfServiceUrl || props.meta.privacyPolicyUrl ? (
      <TOS
        termsOfServiceUrl={props.meta.termsOfServiceUrl}
        privacyPolicyUrl={props.meta.privacyPolicyUrl}
        locale={props.connectLocale.agreement}
      />
    ) : undefined;

  let topSection: React.ReactNode;
  let bottomSection: React.ReactNode;

  // wide modal
  if (!isCompact) {
    topSection = (
      <WalletSelection
        wallets={nonLocalWalletConfigs}
        selectWallet={handleSelect}
        done={props.done}
        goBack={props.goBack}
        onShowAll={props.onShowAll}
        client={props.client}
        connectLocale={props.connectLocale}
        size={props.size}
        recommendedWallets={props.recommendedWallets}
        chain={props.chain}
        showAllWallets={props.showAllWallets}
        localeId={props.localeId}
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
          wallets={nonLocalWalletConfigs}
          selectWallet={handleSelect}
          done={props.done}
          goBack={props.goBack}
          onShowAll={props.onShowAll}
          client={props.client}
          connectLocale={props.connectLocale}
          size={props.size}
          recommendedWallets={props.recommendedWallets}
          chain={props.chain}
          showAllWallets={props.showAllWallets}
          localeId={props.localeId}
        />
      );

      bottomSection = (
        <>
          <Line />
          <Container flex="column" p="md" gap="md">
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
              wallets={socialWallets}
              selectWallet={handleSelect}
              done={props.done}
              goBack={props.goBack}
              client={props.client}
              connectLocale={props.connectLocale}
              size={props.size}
              recommendedWallets={props.recommendedWallets}
              chain={props.chain}
              showAllWallets={props.showAllWallets}
              localeId={props.localeId}
            />
            {eoaWallets.length > 0 && (
              <>
                <TextDivider text={props.connectLocale.or} />
                <Spacer y="lg" />
              </>
            )}
          </Container>
        );

        // only social login - no eoa wallets
        if (eoaWallets.length === 0) {
          bottomSection =
            tos || continueAsGuest ? (
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
              <Container
                flex="column"
                style={{ position: "relative" }}
                gap="sm"
              >
                <GradientDiv />

                <Container px="lg" flex="column" gap="md">
                  {connectAWallet}
                  {continueAsGuest}
                </Container>

                {tos ? (
                  <Container p="md"> {tos} </Container>
                ) : (
                  <Spacer y="xxs" />
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
                    wallets={eoaWallets}
                    selectWallet={handleSelect}
                    done={props.done}
                    goBack={props.goBack}
                    onShowAll={props.onShowAll}
                    client={props.client}
                    connectLocale={props.connectLocale}
                    size={props.size}
                    recommendedWallets={props.recommendedWallets}
                    chain={props.chain}
                    showAllWallets={props.showAllWallets}
                    localeId={props.localeId}
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
            wallets={eoaWallets}
            selectWallet={handleSelect}
            done={props.done}
            goBack={props.goBack}
            onShowAll={props.onShowAll}
            client={props.client}
            connectLocale={props.connectLocale}
            size={props.size}
            recommendedWallets={props.recommendedWallets}
            chain={props.chain}
            showAllWallets={props.showAllWallets}
            localeId={props.localeId}
          />
        );

        bottomSection = (
          <ScreenBottomContainer>{newToWallets}</ScreenBottomContainer>
        );
      }
    }
  }

  return (
    <Container
      scrollY
      flex="column"
      animate="fadein"
      fullHeight
      style={{
        maxHeight: props.size === "compact" ? compactModalMaxHeight : undefined,
      }}
    >
      {/* Header */}
      {!props.isEmbed && (
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
      )}

      {/* Body */}
      <Container
        expand
        scrollY
        px="md"
        style={
          props.isEmbed
            ? {
                paddingTop: spacing.lg,
              }
            : {
                paddingTop: "2px",
              }
        }
      >
        {props.isEmbed && isWalletGroupExpanded && (
          <Container
            flex="row"
            center="y"
            style={{
              padding: spacing.sm,
              paddingTop: 0,
            }}
          >
            <IconButton
              onClick={() => {
                setIsWalletGroupExpanded(false);
              }}
              style={{
                gap: spacing.xxs,
                transform: `translateX(-${spacing.xs})`,
                paddingBlock: spacing.xxs,
                paddingRight: spacing.xs,
              }}
            >
              <ChevronLeftIcon width={iconSize.sm} height={iconSize.sm} />
              {props.connectLocale.goBackButton}
            </IconButton>
          </Container>
        )}

        {topSection}
      </Container>

      {bottomSection}
      {isCompact && props.meta.showThirdwebBranding !== false && (
        <Container py="md">
          <PoweredByThirdweb />
        </Container>
      )}
    </Container>
  );
};

let _installedWallets: Wallet[] = [];

function getInstalledWallets() {
  if (_installedWallets.length === 0) {
    const providers = getInstalledWalletProviders();
    const walletIds = providers.map((provider) => provider.info.rdns);
    _installedWallets = walletIds.map((w) =>
      createWallet(w as InjectedSupportedWalletIds),
    );
  }

  return _installedWallets;
}

/**
 * @internal
 */
const WalletSelection: React.FC<{
  wallets: Wallet[];
  selectWallet: (wallet: Wallet) => void;
  maxHeight?: string;
  done: (wallet: Wallet) => void;
  goBack?: () => void;
  onShowAll?: () => void;
  recommendedWallets: Wallet[] | undefined;
  showAllWallets: boolean | undefined;
  size: "compact" | "wide";
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  chain: Chain | undefined;
  localeId: LocaleId;
}> = (props) => {
  const wallets = sortWallets(props.wallets, props.recommendedWallets);

  return (
    <WalletList
      style={{
        minHeight: "100%",
      }}
    >
      {wallets.map((wallet) => {
        return (
          <li
            key={wallet.id}
            // data-full-width={!!walletConfig.selectUI}
          >
            {wallet.id === "inApp" && props.size === "compact" ? (
              <Suspense fallback={<LoadingScreen height="195px" />}>
                <InAppWalletSelectionUI
                  done={() => props.done(wallet)}
                  select={() => props.selectWallet(wallet)}
                  wallet={wallet as Wallet<"inApp">}
                  goBack={props.goBack}
                  client={props.client}
                  connectLocale={props.connectLocale}
                  size={props.size}
                  recommendedWallets={props.recommendedWallets}
                  chain={props.chain}
                  localeId={props.localeId}
                />
              </Suspense>
            ) : (
              <WalletEntryButton
                walletId={wallet.id}
                selectWallet={() => {
                  props.selectWallet(wallet);
                }}
                connectLocale={props.connectLocale}
                client={props.client}
                recommendedWallets={props.recommendedWallets}
              />
            )}
          </li>
        );
      })}

      {props.onShowAll && props.showAllWallets !== false && (
        <ButtonContainer>
          <WalletButton onClick={props.onShowAll}>
            <ShowAllWalletsIcon>
              <div data-dot />
              <div data-dot />
              <div data-dot />
              <div data-dot />
            </ShowAllWalletsIcon>
            <Container flex="row" gap="xs">
              <Text color="primaryText">All Wallets</Text>
              <BadgeText> 350+ </BadgeText>
            </Container>
          </WalletButton>
        </ButtonContainer>
      )}
    </WalletList>
  );
};

const BadgeText = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    backgroundColor: theme.colors.secondaryButtonBg,
    paddingBlock: "3px",
    paddingInline: spacing.xxs,
    fontSize: fontSize.xs,
    borderRadius: radius.sm,
    color: theme.colors.secondaryText,
  };
});

const ButtonContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    "&:hover [data-dot]": {
      background: theme.colors.primaryText,
    },
  };
});

const ShowAllWalletsIcon = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    width: `${iconSize.xl}px`,
    height: `${iconSize.xl}px`,
    backgroundColor: theme.colors.tertiaryBg,
    border: `2px solid ${theme.colors.borderColor}`,
    borderRadius: radius.md,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    justifyItems: "center",
    alignItems: "center",
    padding: spacing.xs,
    "& div": {
      transition: "background 200ms ease",
      background: theme.colors.secondaryText,
      borderRadius: "50%",
      width: "10px",
      height: "10px",
    },
  };
});

const WalletList = /* @__PURE__ */ StyledUl({
  all: "unset",
  listStyleType: "none",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  boxSizing: "border-box",
  overflowY: "auto",
  flex: 1,
  ...noScrollBar,
  // to show the box-shadow of inputs that overflows
  padding: "2px",
  margin: "-2px",
  marginBottom: 0,
  paddingBottom: spacing.lg,
});

const GradientDiv = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  theme.colors.modalBg;
  return {
    height: spacing.lg,
    position: "absolute",
    top: `-${spacing.lg}`,
    left: 0,
    width: "100%",
    background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.modalBg} 80%)`,
    pointerEvents: "none",
  };
});

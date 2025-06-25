"use client";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
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
import { useSetSelectionData } from "../../providers/wallet-ui-states-provider.js";
import { sortWallets } from "../../utils/sortWallets.js";
import { LoadingScreen } from "../../wallets/shared/LoadingScreen.js";
import {
  Container,
  Line,
  ModalHeader,
  noScrollBar,
  ScreenBottomContainer,
} from "../components/basic.js";
import { Button, IconButton } from "../components/buttons.js";
import { Img } from "../components/Img.js";
import { ModalTitle } from "../components/modalElements.js";
import { Spacer } from "../components/Spacer.js";
import { TextDivider } from "../components/TextDivider.js";
import { Link, Text } from "../components/text.js";
import { StyledDiv, StyledUl } from "../design-system/elements.js";
import { compactModalMaxHeight } from "./constants.js";
import { OutlineWalletIcon } from "./icons/OutlineWalletIcon.js";
import type { ConnectLocale } from "./locale/types.js";
import { SmartConnectUI } from "./Modal/SmartWalletConnectUI.js";
import { useScreenContext } from "./Modal/screen.js";
import { TOS } from "./Modal/TOS.js";
import { PoweredByThirdweb } from "./PoweredByTW.js";
import { WalletButtonEl, WalletEntryButton } from "./WalletEntryButton.js";
import { WalletTypeRowButton } from "./WalletTypeRowButton.js";

const InAppWalletSelectionUI = /* @__PURE__ */ lazy(
  () => import("../../wallets/in-app/InAppWalletSelectionUI.js"),
);

// const localWalletId = "local";
const inAppWalletId: WalletId = "inApp";

type WalletSelectorProps = {
  wallets: Wallet[];
  selectWallet: (wallet: Wallet) => void;
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
    requireApproval?: boolean;
  };
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  recommendedWallets: Wallet[] | undefined;
  hideHeader: boolean;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  showAllWallets: boolean | undefined;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
  modalHeader:
    | {
        title: string;
        onBack: () => void;
      }
    | undefined;
  walletIdsToHide: WalletId[] | undefined;
  disableSelectionDataReset?: boolean;
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
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        connectLocale={props.connectLocale}
        done={props.done}
        meta={props.meta}
        onBack={props.goBack}
        personalWallet={personalWallet}
        setModalVisibility={props.setModalVisibility}
        size={props.size}
        walletConnect={props.walletConnect}
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
  const { walletIdsToHide } = props;
  const isCompact = props.size === "compact";
  const [isWalletGroupExpanded, setIsWalletGroupExpanded] = useState(false);
  // This is only used if requireApproval is true
  const [approvedTOS, setApprovedTOS] = useState(false);

  const installedWallets = getInstalledWallets();
  const propsWallets = props.wallets;
  let _wallets: Wallet[] = [...propsWallets];

  for (const iW of installedWallets) {
    if (!propsWallets.find((w) => w.id === iW.id)) {
      _wallets.push(iW);
    }
  }

  if (walletIdsToHide) {
    _wallets = _wallets.filter((w) => !walletIdsToHide?.includes(w.id));
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
      data-test="continue-as-guest-button"
      disabled={props.meta.requireApproval && !approvedTOS}
      fullWidth
      onClick={() => {
        props.selectWallet(localWalletConfig);
      }}
      style={
        !isCompact
          ? {
              justifyContent: "flex-start",
              textAlign: "left",
            }
          : undefined
      }
      variant={isCompact ? "outline" : "link"}
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

  const twTitle = props.modalHeader ? (
    <ModalHeader
      onBack={props.modalHeader.onBack}
      title={props.modalHeader.title}
    />
  ) : (
    <Container center="y" flex="row" gap="xxs">
      {!props.meta.titleIconUrl ? null : (
        <Img
          client={props.client}
          height={iconSize.md}
          src={props.meta.titleIconUrl}
          width={iconSize.md}
        />
      )}

      <ModalTitle> {props.title} </ModalTitle>
    </Container>
  );

  const handleSelect = async (wallet: Wallet) => {
    props.selectWallet(wallet);
  };

  const connectAWallet = (
    <WalletTypeRowButton
      client={props.client}
      disabled={props.meta.requireApproval && !approvedTOS}
      icon={OutlineWalletIcon}
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
        href="https://blog.thirdweb.com/web3-wallet/"
        size="sm"
        target="_blank"
        weight={500}
      >
        {props.connectLocale.getStarted}
      </Link>
    </Container>
  );

  const tos =
    props.meta.requireApproval ||
    props.meta.termsOfServiceUrl ||
    props.meta.privacyPolicyUrl ? (
      <TOS
        isApproved={approvedTOS}
        locale={props.connectLocale.agreement}
        onApprove={() => setApprovedTOS(!approvedTOS)}
        privacyPolicyUrl={props.meta.privacyPolicyUrl}
        requireApproval={props.meta.requireApproval}
        termsOfServiceUrl={props.meta.termsOfServiceUrl}
      />
    ) : undefined;

  let topSection: React.ReactNode;
  let bottomSection: React.ReactNode;

  // wide modal
  if (!isCompact) {
    topSection = (
      <WalletSelection
        chain={props.chain}
        client={props.client}
        connectLocale={props.connectLocale}
        diableSelectionDataReset={props.disableSelectionDataReset}
        disabled={props.meta.requireApproval && !approvedTOS}
        done={props.done}
        goBack={props.goBack}
        onShowAll={props.onShowAll}
        recommendedWallets={props.recommendedWallets}
        selectWallet={handleSelect}
        showAllWallets={props.showAllWallets}
        size={props.size}
        wallets={nonLocalWalletConfigs}
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
          chain={props.chain}
          client={props.client}
          connectLocale={props.connectLocale}
          diableSelectionDataReset={props.disableSelectionDataReset}
          disabled={props.meta.requireApproval && !approvedTOS}
          done={props.done}
          goBack={props.goBack}
          onShowAll={props.onShowAll}
          recommendedWallets={props.recommendedWallets}
          selectWallet={handleSelect}
          showAllWallets={props.showAllWallets}
          size={props.size}
          wallets={nonLocalWalletConfigs}
        />
      );

      bottomSection = (
        <>
          <Line />
          <Container flex="column" gap="md" p="md">
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
              chain={props.chain}
              client={props.client}
              connectLocale={props.connectLocale}
              diableSelectionDataReset={props.disableSelectionDataReset}
              disabled={props.meta.requireApproval && !approvedTOS}
              done={props.done}
              goBack={props.goBack}
              recommendedWallets={props.recommendedWallets}
              selectWallet={handleSelect}
              showAllWallets={props.showAllWallets}
              size={props.size}
              wallets={socialWallets}
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
                gap="sm"
                style={{ position: "relative" }}
              >
                <GradientDiv />

                <Container flex="column" gap="md" px="lg">
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
                    chain={props.chain}
                    client={props.client}
                    connectLocale={props.connectLocale}
                    diableSelectionDataReset={props.disableSelectionDataReset}
                    disabled={props.meta.requireApproval && !approvedTOS}
                    done={props.done}
                    goBack={props.goBack}
                    onShowAll={props.onShowAll}
                    recommendedWallets={props.recommendedWallets}
                    selectWallet={handleSelect}
                    showAllWallets={props.showAllWallets}
                    size={props.size}
                    wallets={eoaWallets}
                  />
                </Container>

                {continueAsGuest && (
                  <Container flex="column" gap="lg" px="lg">
                    {continueAsGuest}
                  </Container>
                )}

                {tos ? (
                  <>
                    {continueAsGuest ? <Spacer y="md" /> : <Line />}
                    <Container p="md"> {tos} </Container>
                  </>
                ) : (
                  continueAsGuest && <Spacer y="xl" />
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
            chain={props.chain}
            client={props.client}
            connectLocale={props.connectLocale}
            diableSelectionDataReset={props.disableSelectionDataReset}
            disabled={props.meta.requireApproval && !approvedTOS}
            done={props.done}
            goBack={props.goBack}
            onShowAll={props.onShowAll}
            recommendedWallets={props.recommendedWallets}
            selectWallet={handleSelect}
            showAllWallets={props.showAllWallets}
            size={props.size}
            wallets={eoaWallets}
          />
        );

        bottomSection = (
          <ScreenBottomContainer>{newToWallets}</ScreenBottomContainer>
        );
      }
    }
  }

  // hide the header for embed - unless it's customized
  const showHeader = !props.hideHeader || props.modalHeader;

  return (
    <Container
      animate="fadein"
      flex="column"
      fullHeight
      scrollY
      style={{
        maxHeight: props.size === "compact" ? compactModalMaxHeight : undefined,
      }}
    >
      {/* Header */}
      {showHeader && (
        <Container p="lg">
          {isWalletGroupExpanded ? (
            <ModalHeader
              onBack={() => {
                setIsWalletGroupExpanded(false);
              }}
              title={twTitle}
            />
          ) : (
            twTitle
          )}
        </Container>
      )}

      {/* Body */}
      <Container
        expand
        px="md"
        scrollY
        style={
          !showHeader
            ? {
                paddingTop: spacing.lg,
              }
            : {
                paddingTop: "2px",
              }
        }
      >
        {!showHeader && isWalletGroupExpanded && (
          <Container
            center="y"
            flex="row"
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
                paddingBlock: spacing.xxs,
                paddingRight: spacing.xs,
                transform: `translateX(-${spacing.xs})`,
              }}
            >
              <ChevronLeftIcon height={iconSize.sm} width={iconSize.sm} />
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
  diableSelectionDataReset?: boolean;
  // If true, all options will be disabled. Used for things like requiring TOS approval.
  disabled?: boolean;
}> = (props) => {
  const wallets = sortWallets(props.wallets, props.recommendedWallets);
  const { screen } = useScreenContext();
  const setSelectionData = useSetSelectionData();
  return (
    <WalletList
      style={{
        maxHeight: "370px",
        minHeight: "100%",
      }}
    >
      {wallets.map((wallet) => {
        const isActive = screen
          ? typeof screen === "object" && screen.id === wallet.id
          : false;
        return (
          <li
            key={wallet.id}
            // data-full-width={!!walletConfig.selectUI}
          >
            {wallet.id === "inApp" && props.size === "compact" ? (
              <Suspense fallback={<LoadingScreen height="195px" />}>
                <InAppWalletSelectionUI
                  chain={props.chain}
                  client={props.client}
                  connectLocale={props.connectLocale}
                  disabled={props.disabled}
                  done={() => props.done(wallet)}
                  goBack={props.goBack}
                  recommendedWallets={props.recommendedWallets}
                  select={() => props.selectWallet(wallet)}
                  size={props.size}
                  wallet={wallet as Wallet<"inApp">}
                />
              </Suspense>
            ) : (
              <WalletEntryButton
                badge={undefined}
                client={props.client}
                connectLocale={props.connectLocale}
                isActive={isActive}
                recommendedWallets={props.recommendedWallets}
                selectWallet={() => {
                  if (!props.diableSelectionDataReset) {
                    setSelectionData({});
                  }
                  props.selectWallet(wallet);
                }}
                wallet={wallet}
              />
            )}
          </li>
        );
      })}

      {props.onShowAll && props.showAllWallets !== false && (
        <ButtonContainer>
          <WalletButtonEl onClick={props.onShowAll}>
            <ShowAllWalletsIcon>
              <div data-dot />
              <div data-dot />
              <div data-dot />
              <div data-dot />
            </ShowAllWalletsIcon>
            <Container flex="row" gap="xs">
              <Text color="primaryText">All Wallets</Text>
              <BadgeText> 500+ </BadgeText>
            </Container>
          </WalletButtonEl>
        </ButtonContainer>
      )}
    </WalletList>
  );
};

const BadgeText = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    backgroundColor: theme.colors.secondaryButtonBg,
    borderRadius: radius.sm,
    color: theme.colors.secondaryText,
    fontSize: fontSize.xs,
    paddingBlock: "3px",
    paddingInline: spacing.xxs,
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
    "& div": {
      background: theme.colors.secondaryText,
      borderRadius: "50%",
      height: "10px",
      transition: "background 200ms ease",
      width: "10px",
    },
    alignItems: "center",
    backgroundColor: theme.colors.tertiaryBg,
    border: `2px solid ${theme.colors.borderColor}`,
    borderRadius: radius.md,
    display: "grid",
    gap: spacing["4xs"],
    gridTemplateColumns: "1fr 1fr",
    height: `${iconSize.xl}px`,
    justifyItems: "center",
    padding: spacing.xs,
    width: `${iconSize.xl}px`,
  };
});

const WalletList = /* @__PURE__ */ StyledUl({
  all: "unset",
  boxSizing: "border-box",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "2px",
  listStyleType: "none",
  overflowY: "auto",
  ...noScrollBar,
  margin: "-2px",
  marginBottom: 0,
  // to show the box-shadow of inputs that overflows
  padding: "2px",
  paddingBottom: spacing.lg,
});

const GradientDiv = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  theme.colors.modalBg;
  return {
    background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.modalBg} 80%)`,
    height: spacing.lg,
    left: 0,
    pointerEvents: "none",
    position: "absolute",
    top: `-${spacing.lg}`,
    width: "100%",
  };
});

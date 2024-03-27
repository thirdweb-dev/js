import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useContext, useState, useRef, useEffect } from "react";
import {
  ModalConfigCtx,
  // SetModalConfigCtx,
} from "../../providers/wallet-ui-states-provider.js";
import type { SelectUIProps } from "../../../core/types/wallets.js";
import { Img } from "../components/Img.js";
import { Spacer } from "../components/Spacer.js";
import { TextDivider } from "../components/TextDivider.js";
import {
  Container,
  ScreenBottomContainer,
  Line,
  ModalHeader,
  noScrollBar,
} from "../components/basic.js";
import { Button, IconButton } from "../components/buttons.js";
import { ModalTitle } from "../components/modalElements.js";
import { Link } from "../components/text.js";
import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { StyledUl, StyledButton } from "../design-system/elements.js";
import { iconSize, spacing, radius, fontSize } from "../design-system/index.js";
import { TOS } from "./Modal/TOS.js";
import { TWIcon } from "./icons/twIcon.js";
import { Text } from "../components/text.js";
import { PoweredByThirdweb } from "./PoweredByTW.js";
import { useScreenContext } from "./Modal/screen.js";
// import { localWalletMetadata } from "../../../../wallets/local/index._ts";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useWalletInfo } from "../hooks/useWalletInfo.js";
import { Skeleton } from "../components/Skeleton.js";
import { WalletImage } from "../components/WalletImage.js";
import { getMIPDStore } from "../../../../wallets/injected/mipdStore.js";
import { createWallet } from "../../../../wallets/create-wallet.js";
import type { InjectedSupportedWalletIds } from "../../../../wallets/__generated__/wallet-ids.js";

const localWalletId = "local";
const embeddedWalletId = "embedded";

type WalletSelectUIProps = {
  screenConfig: SelectUIProps["screenConfig"];
  connection: Omit<SelectUIProps["connection"], "createInstance">;
};

/**
 * @internal
 */
export const WalletSelector: React.FC<{
  wallets: Wallet[];
  selectWallet: (wallet: Wallet) => void;
  onGetStarted: () => void;
  title: string;
  selectUIProps: WalletSelectUIProps;
}> = (props) => {
  const modalConfig = useContext(ModalConfigCtx);
  const isCompact = modalConfig.modalSize === "compact";
  const { termsOfServiceUrl, privacyPolicyUrl } = modalConfig;
  const [isWalletGroupExpanded, setIsWalletGroupExpanded] = useState(false);

  // const disconnect = useDisconnect();
  // const connectionStatus = useActiveWalletConnectionStatus();
  const locale = useWalletConnectionCtx().connectLocale;
  const recommendedWallets = useWalletConnectionCtx().recommendedWallets;

  const localWalletConfig = props.wallets.find((w) => w.id === localWalletId);

  const nonLocalWalletConfigs = props.wallets.filter(
    (w) => w.id !== localWalletId,
  );

  const socialWallets = nonLocalWalletConfigs.filter(
    (w) => w.id === embeddedWalletId,
  );

  const eoaWallets = sortWallets(
    nonLocalWalletConfigs.filter((w) => w.id !== embeddedWalletId),
    recommendedWallets,
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
      {locale.continueAsGuest}
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

  const handleSelect = async (wallet: Wallet) => {
    // if (connectionStatus !== "disconnected") {
    //   await disconnect();
    // }
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
          <WalletImage key={w.id} id={w.id} size={iconSize.sm} />
        ))}
      </Container>
      {locale.connectAWallet}
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
        {locale.newToWallets}
      </Text>
      <Link
        weight={500}
        size="sm"
        target="_blank"
        href="https://blog.thirdweb.com/web3-wallet/"
      >
        {locale.getStarted}
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
        wallets={nonLocalWalletConfigs}
        selectWallet={handleSelect}
        selectUIProps={props.selectUIProps}
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
          selectUIProps={props.selectUIProps}
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
              wallets={socialWallets}
              selectWallet={handleSelect}
              selectUIProps={props.selectUIProps}
            />
            {eoaWallets.length > 0 && (
              <>
                <TextDivider text={locale.or} />
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
                    wallets={eoaWallets}
                    selectWallet={handleSelect}
                    selectUIProps={props.selectUIProps}
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
            selectUIProps={props.selectUIProps}
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
      {!modalConfig.isEmbed && (
        <Container
          p="lg"
          style={{
            paddingBottom: spacing.md,
          }}
        >
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
          modalConfig.isEmbed
            ? {
                paddingTop: spacing.lg,
              }
            : {
                paddingTop: "2px",
              }
        }
      >
        {modalConfig.isEmbed && isWalletGroupExpanded && (
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
              {locale.goBackButton}
            </IconButton>
          </Container>
        )}

        {topSection}
      </Container>

      {bottomSection}
      {isCompact && modalConfig.showThirdwebBranding !== false && (
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
    const providers = getMIPDStore().getProviders();
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
  selectUIProps: WalletSelectUIProps;
}> = (props) => {
  const { recommendedWallets } = useWalletConnectionCtx();

  const installedWallets = getInstalledWallets();
  const propsWallets = props.wallets;
  const _wallets: Wallet[] = [...propsWallets];

  installedWallets.forEach((iW) => {
    if (!propsWallets.find((w) => w.id === iW.id)) {
      _wallets.push(iW);
    }
  });

  const wallets = sortWallets(_wallets, recommendedWallets);

  // const modalConfig = useContext(ModalConfigCtx);
  // const setModalConfig = useContext(SetModalConfigCtx);

  // const saveData = useCallback(
  //   (data: any) => {
  //     setModalConfig({
  //       ...modalConfig,
  //       data,
  //     });
  //   },
  //   [modalConfig, setModalConfig],
  // );

  return (
    <WalletList>
      {wallets.map((wallet) => {
        return (
          <li
            key={wallet.id}
            // data-full-width={!!walletConfig.selectUI}
          >
            {/* {walletConfig.selectUI ? (
              <walletConfig.selectUI
                screenConfig={props.selectUIProps.screenConfig}
                selection={{
                  select: () => {
                    props.selectWallet(walletConfig);
                  },
                  isSingularOption: wallets.length === 1,
                  data: modalConfig.data,
                  saveData: saveData,
                }}
                connection={{
                  ...props.selectUIProps.connection,
                  createInstance: () => {
                    return walletConfig.create({
                      client,
                      appMetadata,
                    });
                  },
                }}
                walletConfig={walletConfig}
              />
            ) : (

            )} */}

            <WalletEntryButton
              wallet={wallet}
              selectWallet={() => {
                props.selectWallet(wallet);
              }}
            />
          </li>
        );
      })}
    </WalletList>
  );
};

/**
 * @internal
 */
export function WalletEntryButton(props: {
  wallet: Wallet;
  selectWallet: () => void;
}) {
  const { wallet, selectWallet } = props;
  const { connectLocale, recommendedWallets } = useWalletConnectionCtx();
  const isRecommended = recommendedWallets?.find((w) => w === wallet);
  const { screen } = useScreenContext();
  const walletInfo = useWalletInfo(wallet.id);

  const walletName =
    getMIPDStore()
      .getProviders()
      .find((p) => p.info.rdns === wallet.id)?.info.name ||
    walletInfo.data?.name;

  const isInstalled = getMIPDStore()
    .getProviders()
    .find((p) => p.info.rdns === wallet.id);

  return (
    <WalletButton
      type="button"
      onClick={() => {
        selectWallet();
      }}
      data-active={screen === wallet}
    >
      <WalletImage id={wallet.id} size={iconSize.xl} />

      <Container flex="column" gap="xxs" expand>
        {walletName ? (
          <Text color="primaryText" weight={600}>
            {walletName}
          </Text>
        ) : (
          <Skeleton width="100px" height={fontSize.md} />
        )}

        {isRecommended && <Text size="sm">{connectLocale.recommended}</Text>}

        {!isRecommended && isInstalled && (
          <Text size="sm">{connectLocale.installed}</Text>
        )}
      </Container>
    </WalletButton>
  );
}

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

const WalletButton = /* @__PURE__ */ StyledButton(() => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    cursor: "pointer",
    boxSizing: "border-box",
    width: "100%",
    color: theme.colors.secondaryText,
    position: "relative",
    borderRadius: radius.md,
    padding: `${spacing.xs} ${spacing.xs}`,
    "&:hover": {
      backgroundColor: theme.colors.walletSelectorButtonHoverBg,
      transform: "scale(1.01)",
    },
    '&[data-active="true"]': {
      backgroundColor: theme.colors.walletSelectorButtonHoverBg,
    },
    transition: "background-color 200ms ease, transform 200ms ease",
  };
});

/**
 *
 * @internal
 */
function sortWallets(wallets: Wallet[], recommendedWallets?: Wallet[]) {
  const providers = getMIPDStore().getProviders();
  return (
    wallets
      // show the installed wallets first
      .sort((a, b) => {
        const aInstalled = providers.find((p) => p.info.rdns === a.id);
        const bInstalled = providers.find((p) => p.info.rdns === b.id);

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
        const aIsRecommended = recommendedWallets?.find((w) => w === a);
        const bIsRecommended = recommendedWallets?.find((w) => w === b);

        if (aIsRecommended && !bIsRecommended) {
          return -1;
        }
        if (!aIsRecommended && bIsRecommended) {
          return 1;
        }
        return 0;
      })
    // show the wallets with selectUI first before others
    // .sort((a, b) => {
    //   if (a.selectUI && !b.selectUI) {
    //     return -1;
    //   }
    //   if (!a.selectUI && b.selectUI) {
    //     return 1;
    //   }
    //   return 0;
    // })
  );
}

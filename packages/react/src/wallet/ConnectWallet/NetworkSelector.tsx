import { ChainIcon } from "../../components/ChainIcon";
import { Modal } from "../../components/Modal";
import { Spacer } from "../../components/Spacer";
import { Spinner } from "../../components/Spinner";
import { Input } from "../../components/formElements";
import {
  fontSize,
  iconSize,
  media,
  radius,
  spacing,
  Theme,
} from "../../design-system";
import styled from "@emotion/styled";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import {
  useChainId,
  useSupportedChains,
  useSwitchChain,
} from "@thirdweb-dev/react-core";
import { memo, useCallback, useDeferredValue, useMemo, useState } from "react";
import type { Chain } from "@thirdweb-dev/chains";
import Fuse from "fuse.js";
import { Button } from "../../components/buttons";
import { useEffect } from "react";
import { Container, Line } from "../../components/basic";
import { Text } from "../../components/text";
import { ModalTitle } from "../../components/modalElements";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../design-system/CustomThemeProvider";
import { useTWLocale } from "../../evm/providers/locale-provider";
import { StyledButton, StyledP, StyledUl } from "../../design-system/elements";

export type NetworkSelectorChainProps = {
  /**
   * `Chain` object for the chain to be displayed
   */
  chain: Chain;
  /**
   * function to be called for switching to the given chain
   */
  switchChain: () => void;
  /**
   * flag indicating whether the SDK is currently switching to the given chain
   */
  switching: boolean;
  /**
   * flag indicating whether the SDK failed to switch to the given chain
   */
  switchFailed: boolean;
  /**
   * function to close the modal
   */
  close?: () => void;
};

export type NetworkSelectorProps = {
  /**
   * Theme to use in Modal
   *
   * Either specify string "dark" or "light" to use the default themes, or provide a custom theme object.
   *
   * You can also use `darkTheme` or `lightTheme` functions to use the default themes as base and override it.
   *
   * @example
   * ```tsx
   * import { darkTheme } from "@thirdweb-dev/react";
   *
   * <NetworkSelector
   *  open={true}
   *  theme={darkTheme({
   *    colors: {
   *      modalBg: "#000000",
   *    }
   *  })}
   * />
   * ```
   */
  theme?: "dark" | "light" | Theme;
  /**
   * Callback to be called when modal is closed by the user
   */
  onClose?: () => void;
  /**
   * Specify whether the Modal should be open or closed
   */
  open: boolean;
  /**
   * Array of chains to be displayed in the modal
   */
  chains?: Chain[];
  /**
   * Array of chains to be displayed under "Popular" section
   */
  popularChains?: Chain[];
  /**
   * Array of chains to be displayed under "Recent" section
   */
  recentChains?: Chain[];
  /**
   * Override how the chain button is rendered in the Modal
   */
  renderChain?: React.FC<NetworkSelectorChainProps>;

  /**
   * Callback to be called when a chain is successfully switched
   * @param chain - The new chain that is switched to
   */
  onSwitch?: (chain: Chain) => void;
  /**
   * Callback to be called when the "Add Custom Network" button is clicked
   *
   * The "Add Custom Network" button is displayed at the bottom of the modal - only if this prop is provided
   */
  onCustomClick?: () => void;
};

const fuseConfig = {
  threshold: 0.4,
  keys: [
    {
      name: "name",
      weight: 1,
    },
    {
      name: "chainId",
      weight: 1,
    },
  ],
};

/**
 * Renders a Network Switcher Modal that allows users to switch their wallet to a different network.
 *
 * @example
 * ```tsx
 * import { NetworkSelector } from "@thirdweb-dev/react";
 *
 * function Example() {
 *  const [open, setOpen] = useState(false);
 *  return (
 *    <div>
 *      <button onClick={() => setOpen(true)}>Open Modal</button>
 *      <NetworkSelector open={open} onClose={() => setOpen(false)} />
 *    </div>
 *  )
 * }
 * ```
 */
export function NetworkSelector(props: NetworkSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const themeFromContext = useCustomTheme();
  const theme = props.theme || themeFromContext || "dark";
  const supportedChains = useSupportedChains();
  const chains = props.chains || supportedChains;
  const locale = useTWLocale().connectWallet.networkSelector;

  const _recentChains = props.recentChains;

  // remove recent chains from popular chains
  const cleanedPopularChains = !_recentChains
    ? props.popularChains
    : props.popularChains?.filter((chain) => {
        return !_recentChains.some(
          (recentChain) => recentChain.chainId === chain.chainId,
        );
      });

  // fuse instances
  const fuseAllChains = useMemo(() => {
    return new Fuse(chains, fuseConfig);
  }, [chains]);

  const fusePopularChains = useMemo(() => {
    return new Fuse(cleanedPopularChains || [], fuseConfig);
  }, [cleanedPopularChains]);

  const fuseRecentChains = useMemo(() => {
    return new Fuse(props.recentChains || [], fuseConfig);
  }, [props.recentChains]);

  // chains filtered by search term
  const allChains = useMemo(() => {
    if (deferredSearchTerm === "") {
      return chains;
    }
    return fuseAllChains.search(deferredSearchTerm).map((r) => r.item);
  }, [fuseAllChains, deferredSearchTerm, chains]);

  const popularChains = useMemo(() => {
    if (deferredSearchTerm === "") {
      return cleanedPopularChains || [];
    }
    return fusePopularChains.search(deferredSearchTerm).map((r) => r.item);
  }, [fusePopularChains, deferredSearchTerm, cleanedPopularChains]);

  const recentChains = useMemo(() => {
    if (deferredSearchTerm === "") {
      return props.recentChains || [];
    }
    return fuseRecentChains.search(deferredSearchTerm).map((r) => r.item);
  }, [fuseRecentChains, deferredSearchTerm, props.recentChains]);

  const { onClose, onSwitch, onCustomClick } = props;

  const handleSwitch = useCallback(
    (chain: Chain) => {
      if (onSwitch) {
        onSwitch(chain);
      }
      if (onClose) {
        onClose();
      }
    },
    [onSwitch, onClose],
  );

  return (
    <CustomThemeProvider theme={theme}>
      <Modal
        size={"compact"}
        open={props.open}
        setOpen={(value) => {
          if (!value && onClose) {
            onClose();
          }
        }}
        style={{
          paddingBottom: props.onCustomClick ? spacing.md : "0px",
        }}
      >
        <Container>
          <Container p="lg">
            <ModalTitle>{locale.title}</ModalTitle>
          </Container>

          <Tabs.Root className="TabsRoot" defaultValue="all">
            <Container px="lg">
              <Tabs.List
                className="TabsList"
                aria-label="Manage your account"
                style={{
                  display: "flex",
                  gap: spacing.xxs,
                }}
              >
                <TabButton className="TabsTrigger" value="all">
                  {locale.allNetworks}
                </TabButton>
                <TabButton className="TabsTrigger" value="mainnet">
                  {locale.mainnets}
                </TabButton>
                <TabButton className="TabsTrigger" value="testnet">
                  {locale.testnets}
                </TabButton>
              </Tabs.List>
            </Container>

            <Spacer y="lg" />

            {chains.length > 10 && (
              <>
                <Container px="lg">
                  {/* Search */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <StyledMagnifyingGlassIcon
                      width={iconSize.md}
                      height={iconSize.md}
                    />

                    <Input
                      style={{
                        padding: `${spacing.sm} ${spacing.md} ${spacing.sm} ${spacing.xxl}`,
                      }}
                      tabIndex={-1}
                      variant="outline"
                      placeholder={locale.inputPlaceholder}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                      }}
                    />
                    {/* Searching Spinner */}
                    {deferredSearchTerm !== searchTerm && (
                      <div
                        style={{
                          position: "absolute",
                          right: spacing.md,
                        }}
                      >
                        <Spinner size="md" color="accentText" />
                      </div>
                    )}
                  </div>
                </Container>
                <Spacer y="lg" />
              </>
            )}

            <Container px="md">
              <Tabs.Content
                className="TabsContent"
                value="all"
                style={{
                  outline: "none",
                }}
              >
                <NetworkTab
                  allChains={allChains}
                  type="all"
                  popularChains={popularChains}
                  recentChains={recentChains}
                  onSwitch={handleSwitch}
                  renderChain={props.renderChain}
                  close={props.onClose}
                />
              </Tabs.Content>

              <Tabs.Content
                className="TabsContent"
                value="mainnet"
                style={{
                  outline: "none",
                }}
              >
                <NetworkTab
                  allChains={allChains}
                  type="mainnet"
                  popularChains={popularChains}
                  recentChains={recentChains}
                  onSwitch={handleSwitch}
                  renderChain={props.renderChain}
                  close={props.onClose}
                />
              </Tabs.Content>

              <Tabs.Content
                className="TabsContent"
                value="testnet"
                style={{
                  outline: "none",
                }}
              >
                <NetworkTab
                  allChains={allChains}
                  type="testnet"
                  popularChains={popularChains}
                  recentChains={recentChains}
                  onSwitch={handleSwitch}
                  renderChain={props.renderChain}
                  close={props.onClose}
                />
              </Tabs.Content>
            </Container>

            {onCustomClick && (
              <>
                <Line />
                <Container p="lg">
                  <Button
                    fullWidth
                    variant="link"
                    onClick={() => {
                      onCustomClick();
                      if (onClose) {
                        onClose();
                      }
                    }}
                    style={{
                      display: "flex",
                      fontSize: fontSize.sm,
                      boxShadow: "none",
                    }}
                  >
                    {locale.addCustomNetwork}
                  </Button>
                </Container>
              </>
            )}
          </Tabs.Root>
        </Container>
      </Modal>
    </CustomThemeProvider>
  );
}

const filterChainByType = (
  chains: Chain[],
  type: "testnet" | "mainnet" | "all",
) => {
  if (type === "all") {
    return chains;
  }

  if (type === "testnet") {
    return chains.filter((c) => c.testnet);
  }

  return chains.filter((c) => !c.testnet);
};

const NetworkTab = (props: {
  allChains: Chain[];
  recentChains?: Chain[];
  popularChains?: Chain[];
  type: "testnet" | "mainnet" | "all";
  onSwitch: (chain: Chain) => void;
  renderChain?: React.FC<NetworkSelectorChainProps>;
  close?: () => void;
}) => {
  const allChains = useMemo(
    () => filterChainByType(props.allChains, props.type),
    [props.type, props.allChains],
  );
  const recentChains = useMemo(
    () => filterChainByType(props.recentChains || [], props.type),
    [props.type, props.recentChains],
  );
  const popularChains = useMemo(
    () => filterChainByType(props.popularChains || [], props.type),
    [props.type, props.popularChains],
  );
  const locale = useTWLocale().connectWallet.networkSelector.categoryLabel;

  return (
    <Container
      scrollY
      animate="fadein"
      style={{
        height: "330px",
        paddingBottom: spacing.lg,
      }}
    >
      {recentChains.length > 0 && (
        <div>
          <SectionLabel>{locale.recentlyUsed}</SectionLabel>
          <Spacer y="sm" />
          <NetworkList
            chains={recentChains}
            onSwitch={props.onSwitch}
            renderChain={props.renderChain}
            close={props.close}
          />
          <Spacer y="lg" />
        </div>
      )}

      {popularChains.length > 0 && (
        <div>
          <SectionLabel>{locale.popular}</SectionLabel>
          <Spacer y="sm" />
          <NetworkList
            chains={popularChains}
            onSwitch={props.onSwitch}
            renderChain={props.renderChain}
            close={props.close}
          />
          <Spacer y="lg" />
        </div>
      )}

      {/* separator  */}
      {(popularChains.length > 0 || recentChains.length > 0) && (
        <>
          <SectionLabel>{locale.others}</SectionLabel>
          <Spacer y="sm" />
        </>
      )}

      <NetworkList
        chains={allChains}
        onSwitch={props.onSwitch}
        renderChain={props.renderChain}
        close={props.close}
      />
    </Container>
  );
};

const NetworkList = /* @__PURE__ */ memo(function NetworkList(props: {
  chains: Chain[];
  onSwitch: (chain: Chain) => void;
  renderChain?: React.FC<NetworkSelectorChainProps>;
  close?: () => void;
}) {
  const switchChain = useSwitchChain();
  const activeChainId = useChainId();
  const [switchingChainId, setSwitchingChainId] = useState(-1);
  const [errorSwitchingChainId, setErrorSwitchingChainId] = useState(-1);
  const twLocale = useTWLocale();
  const locale = twLocale.connectWallet.networkSelector;

  const close = props.close;

  useEffect(() => {
    // if switching and switched successfully - close modal
    if (switchingChainId !== -1 && activeChainId === switchingChainId) {
      if (close) {
        close();
      }
    }
  }, [switchingChainId, close, activeChainId]);

  const handleSwitch = async (chain: Chain) => {
    setErrorSwitchingChainId(-1);
    setSwitchingChainId(chain.chainId);

    try {
      await switchChain(chain.chainId);
      props.onSwitch(chain);
    } catch (e: any) {
      setErrorSwitchingChainId(chain.chainId);
      console.error(e);
    } finally {
      setSwitchingChainId(-1);
    }
  };
  const RenderChain = props.renderChain;

  const [isLoading, setIsLoading] = useState(props.chains.length > 100);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Container
        flex="row"
        center="both"
        style={{
          height: "250px",
        }}
      >
        {/* Don't put a spinner here - it's gonna freeze */}
        <Text>{locale.loading}</Text>
      </Container>
    );
  }

  return (
    <NetworkListUl>
      {props.chains.map((chain) => {
        const confirming = switchingChainId === chain.chainId;
        const switchingFailed = errorSwitchingChainId === chain.chainId;

        const chainName = <span>{chain.name} </span>;

        if (RenderChain) {
          return (
            <li key={chain.chainId}>
              <RenderChain
                switchChain={() => {
                  handleSwitch(chain);
                }}
                chain={chain}
                switching={switchingChainId === chain.chainId}
                switchFailed={errorSwitchingChainId === chain.chainId}
                close={props.close}
              />
            </li>
          );
        }

        return (
          <li key={chain.chainId}>
            <NetworkButton
              data-active={activeChainId === chain.chainId}
              onClick={() => {
                handleSwitch(chain);
              }}
            >
              <ChainIcon
                chain={chain}
                size={iconSize.lg}
                active={activeChainId === chain.chainId}
                loading="lazy"
              />

              {confirming || switchingFailed ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: spacing.xs,
                  }}
                >
                  {chainName}
                  <Container animate="fadein" flex="row" gap="xs">
                    {confirming && (
                      <>
                        <Text size="xs" color="accentText">
                          {twLocale.connectWallet.confirmInWallet}
                        </Text>
                        <Spinner size="xs" color="accentText" />
                      </>
                    )}

                    {switchingFailed && (
                      <Container animate="fadein">
                        <Text size="xs" color="danger">
                          {locale.failedToSwitch}
                        </Text>
                      </Container>
                    )}
                  </Container>
                </div>
              ) : (
                chainName
              )}
            </NetworkButton>
          </li>
        );
      })}
    </NetworkListUl>
  );
});

const TabButton = /* @__PURE__ */ (() =>
  styled(Tabs.Trigger)(() => {
    const theme = useCustomTheme();
    return {
      all: "unset",
      fontSize: fontSize.sm,
      fontWeight: 500,
      color: theme.colors.secondaryText,
      cursor: "pointer",
      padding: `${spacing.sm} ${spacing.sm}`,
      WebkitTapHighlightColor: "transparent",
      borderRadius: radius.lg,
      transition: "background 0.2s ease, color 0.2s ease",

      "&[data-state='active']": {
        background: theme.colors.secondaryButtonBg,
        color: theme.colors.primaryText,
      },
    };
  }))();

const SectionLabel = /* @__PURE__ */ StyledP(() => {
  const theme = useCustomTheme();
  return {
    fontSize: fontSize.sm,
    color: theme.colors.secondaryText,
    margin: 0,
    display: "block",
    padding: `0 ${spacing.xs}`,
  };
});

const NetworkListUl = /* @__PURE__ */ StyledUl({
  padding: 0,
  margin: 0,
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: spacing.xs,
  boxSizing: "border-box",
});

const NetworkButton = /* @__PURE__ */ StyledButton(() => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    display: "flex",
    width: "100%",
    boxSizing: "border-box",
    alignItems: "center",
    gap: spacing.md,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: radius.md,
    cursor: "pointer",
    transition: "background 0.2s ease",
    color: theme.colors.primaryText,
    fontWeight: 500,
    fontSize: fontSize.md,
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
    },

    [media.mobile]: {
      fontSize: fontSize.sm,
    },
  };
});

const StyledMagnifyingGlassIcon = /* @__PURE__ */ styled(MagnifyingGlassIcon)(
  () => {
    const theme = useCustomTheme();
    return {
      color: theme.colors.secondaryText,
      position: "absolute",
      left: spacing.sm,
    };
  },
);

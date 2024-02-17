import styled from "@emotion/styled";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  useState,
  useDeferredValue,
  useMemo,
  useCallback,
  memo,
  useEffect,
} from "react";
import { ChainIcon } from "../components/ChainIcon.js";
import { Modal } from "../components/Modal.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Container, ModalHeader, Line } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Input } from "../components/formElements.js";
import { ModalTitle } from "../components/modalElements.js";
import {
  useCustomTheme,
  CustomThemeProvider,
} from "../design-system/CustomThemeProvider.js";
import { StyledP, StyledUl, StyledButton } from "../design-system/elements.js";
import {
  spacing,
  iconSize,
  fontSize,
  radius,
  media,
} from "../design-system/index.js";
import type { Theme } from "../design-system/index.js";
import Fuse from "fuse.js";
import * as Tabs from "@radix-ui/react-tabs";
import {
  useActiveWalletChainId,
  useSwitchActiveWalletChain,
} from "../../providers/wallet-provider.js";
import { Text } from "../components/text.js";
import { useChainsQuery } from "../../hooks/others/useChainQuery.js";
import { useTWLocale } from "../../providers/locale-provider.js";
import type React from "react";
import type { ApiChain } from "../../../chain/types.js";

type NetworkSelectorChainProps = {
  /**
   * `Chain` object for the chain to be displayed
   */
  chain: ApiChain;
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
   * @example
   * ```tsx
   * import { darkTheme } from "thirdweb/react";
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

  chains?: number[];

  /**
   * Array of chains to be displayed under "Popular" section
   */
  popularChains?: number[];
  /**
   * Array of chains to be displayed under "Recent" section
   */
  recentChains?: number[];
  /**
   * Override how the chain button is rendered in the Modal
   */
  renderChain?: React.FC<NetworkSelectorChainProps>;

  /**
   * Callback to be called when a chain is successfully switched
   * @param chain - The new chain that is switched to
   */
  onSwitch?: (chain: bigint) => void;
  /**
   * Callback to be called when the "Add Custom Network" button is clicked
   *
   * The "Add Custom Network" button is displayed at the bottom of the modal - only if this prop is provided
   */
  onCustomClick?: () => void;
};

type NetworkSelectorInnerProps = {
  /**
   * Theme to use in Modal
   *
   * Either specify string "dark" or "light" to use the default themes, or provide a custom theme object.
   *
   * You can also use `darkTheme` or `lightTheme` functions to use the default themes as base and override it.
   * @example
   * ```tsx
   * import { darkTheme } from "thirdweb/react";
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

  chains: ApiChain[];

  /**
   * Array of chains to be displayed under "Popular" section
   */
  popularChains?: ApiChain[];
  /**
   * Array of chains to be displayed under "Recent" section
   */
  recentChains?: ApiChain[];
  /**
   * Override how the chain button is rendered in the Modal
   */
  renderChain?: React.FC<NetworkSelectorChainProps>;

  /**
   * Callback to be called when a chain is successfully switched
   * @param chain - The new chain that is switched to
   */
  onSwitch?: (chain: ApiChain) => void;
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
 * @param props - NetworkSelectorProps
 * @example
 * ```tsx
 * import { NetworkSelector } from "thirdweb/react";
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
 * @returns A React component that renders a modal
 */
export function NetworkSelector(props: NetworkSelectorProps) {
  const themeFromContext = useCustomTheme();
  const theme = props.theme || themeFromContext || "dark";
  const { onClose } = props;

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
        <NetworkSelectorContent {...props} />
      </Modal>
    </CustomThemeProvider>
  );
}

/**
 * @internal
 */
export function NetworkSelectorContent(
  props: NetworkSelectorProps & {
    onBack?: () => void;
  },
) {
  const allChainIds = new Set([
    ...(props.chains || []),
    ...(props.popularChains || []),
    ...(props.recentChains || []),
  ]);

  // TODO: @manan - instead of doing this here and then passing the chains down we can consider the following approach:
  // 1. use the useChainsQuery hook wherever we need the search index
  // 2. pass only the chainIds through (for all, recent, popular)
  // 3. then in each Chain component, use the useChainQuery hook to get the chain data where we need it (can have local placeholder state while isLoading)
  // => things will render faster, all queries get re-used, and we don't have to pass the chains down everywhere
  const chainsQueries = useChainsQuery([...allChainIds]);

  const [allChains, isLoading] = useMemo(() => {
    let atLeastOneChainIsLoading = false;
    const chains = chainsQueries
      .map((chainQuery) => {
        if (chainQuery.isLoading) {
          atLeastOneChainIsLoading = true;
        }
        return chainQuery.data;
      })
      .filter((d) => !!d) as ApiChain[];
    return [chains, atLeastOneChainIsLoading];
  }, [chainsQueries]);

  const chainMap = useMemo(() => {
    const map = new Map<bigint, ApiChain>();
    if (!allChains) {
      return map;
    }

    for (const chain of allChains) {
      map.set(BigInt(chain.chainId), chain);
    }
    return map;
  }, [allChains]);

  if (isLoading || !allChains) {
    return (
      <Container
        flex="row"
        center="both"
        p="lg"
        style={{
          height: "330px",
        }}
      >
        <Spinner size="lg" color="accentText" />
      </Container>
    );
  }

  return (
    <NetworkSelectorContentInner
      {...props}
      chains={allChains}
      recentChains={
        props.recentChains?.map((chainId) => chainMap.get(BigInt(chainId))) as
          | ApiChain[]
          | undefined
      }
      popularChains={
        props.popularChains?.map((chainId) => chainMap.get(BigInt(chainId))) as
          | ApiChain[]
          | undefined
      }
      onSwitch={(chain) => {
        if (props.onSwitch) {
          props.onSwitch(BigInt(chain.chainId));
        }
      }}
    />
  );
}

/**
 *
 * @internal
 */
function NetworkSelectorContentInner(
  props: NetworkSelectorInnerProps & {
    onBack?: () => void;
  },
) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const supportedChains = props.chains;
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
    (chain: ApiChain) => {
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
    <Container>
      <Container p="lg">
        {props.onBack ? (
          <ModalHeader title={locale.title} onBack={props.onBack} />
        ) : (
          <ModalTitle>{locale.title}</ModalTitle>
        )}
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
  );
}

/**
 *
 * @internal
 */
const filterChainByType = (
  chains: ApiChain[],
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

/**
 *
 * @internal
 */
const NetworkTab = (props: {
  allChains: ApiChain[];
  recentChains?: ApiChain[];
  popularChains?: ApiChain[];
  type: "testnet" | "mainnet" | "all";
  onSwitch: (chain: ApiChain) => void;
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

type NetworkListProps = {
  chains: ApiChain[];
  onSwitch: (chain: ApiChain) => void;
  renderChain?: React.FC<NetworkSelectorChainProps>;
  close?: () => void;
};

const NetworkList = /* @__PURE__ */ memo(function NetworkList(
  props: NetworkListProps,
) {
  const switchChain = useSwitchActiveWalletChain();
  const activeChainId = useActiveWalletChainId();
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

  const handleSwitch = async (chain: ApiChain) => {
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
      setTimeout(() => {
        requestAnimationFrame(() => {
          setIsLoading(false);
        });
      }, 150);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Container px="xxs">
        <NetworkListUl>
          {new Array(10).fill(0).map((_, i) => (
            <Skeleton height="48px" key={i} />
          ))}
        </NetworkListUl>
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
} as React.FC<NetworkListProps>);

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

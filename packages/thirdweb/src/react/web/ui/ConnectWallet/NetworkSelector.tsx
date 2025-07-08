"use client";
import styled from "@emotion/styled";
import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Fuse from "fuse.js";
import type React from "react";
import {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Chain } from "../../../../chains/types.js";
import { convertApiChainToChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  media,
  radius,
  spacing,
  type Theme,
} from "../../../core/design-system/index.js";
import { useChainsQuery } from "../../../core/hooks/others/useChainQuery.js";
import { useActiveWalletChain } from "../../../core/hooks/wallets/useActiveWalletChain.js";
import { useSwitchActiveWalletChain } from "../../../core/hooks/wallets/useSwitchActiveWalletChain.js";
import { SetRootElementContext } from "../../../core/providers/RootElementContext.js";
import { Container, Line, ModalHeader } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { ChainActiveDot } from "../components/ChainActiveDot.js";
import { fallbackChainIcon } from "../components/fallbackChainIcon.js";
import { Input } from "../components/formElements.js";
import { Modal } from "../components/Modal.js";
import { ModalTitle } from "../components/modalElements.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Text } from "../components/text.js";
import { StyledButton, StyledP, StyledUl } from "../design-system/elements.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { useShowMore } from "../hooks/useShowMore.js";
import { ChainIcon } from "../prebuilt/Chain/icon.js";
import { ChainName } from "../prebuilt/Chain/name.js";
import { ChainProvider } from "../prebuilt/Chain/provider.js";
import type { LocaleId } from "../types.js";
import { getConnectLocale } from "./locale/getConnectLocale.js";
import type { ConnectLocale } from "./locale/types.js";

/**
 * @internal
 */
export type NetworkSelectorChainProps = {
  /**
   * `Chain` object to be displayed
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

type ChainSection = {
  label: string;
  chains: Chain[];
};

/**
 * @connectWallet
 */
export type NetworkSelectorProps = {
  /**
   * Chains to be displayed as "Popular"
   * @deprecated Use `sections` prop instead
   *
   * If `sections` prop is provided, this prop will be ignored
   */
  popularChainIds?: number[];

  /**
   * Chains to be displayed as "Recent"
   * @deprecated Use `sections` prop instead
   *
   * If `sections` prop is provided, this prop will be ignored
   */
  recentChainIds?: number[];

  /**
   * Specify sections of chains to be displayed in the Network Selector Modal
   *
   * @example
   * To display "Polygon", "Avalanche" chains under "Recently used" section and "Ethereum", "Arbitrum" chains under "Popular" section, you can set the prop with the following value
   * ```ts
   * import { arbitrum, base, ethereum, polygon } from "thirdweb/chains";
   *
   * const sections = [
   *  { label: 'Recently used', chains: [arbitrum, polygon] },
   *  { label: 'Popular', chains: [base, ethereum] },
   * ]
   * ```
   */
  sections?: Array<ChainSection>;

  /**
   * Override how the chain button is rendered in the Modal
   */
  renderChain?: React.FC<NetworkSelectorChainProps>;

  /**
   * Callback to be called when a chain is successfully switched
   * @param chain - The `Chain` of the chain that was switched to
   */
  onSwitch?: (chain: Chain) => void;

  /**
   * Callback to be called when the "Add Custom Network" button is clicked
   *
   * The "Add Custom Network" button is displayed at the bottom of the modal - only if this prop is provided
   */
  onCustomClick?: () => void;
};

type NetworkSelectorContentProps = {
  onBack?: () => void;
  closeModal: () => void;
  chains: Chain[];
  networkSelector?: NetworkSelectorProps;
  showTabs?: boolean;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
};

/**
 * @internal
 */

export function NetworkSelectorContent(props: NetworkSelectorContentProps) {
  const locale = props.connectLocale.networkSelector;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "mainnet" | "testnet">(
    "all",
  );
  const deferredSearchTerm = useDebouncedValue(searchTerm, 300);

  const { onSwitch, onCustomClick } = props.networkSelector || {};

  // labels
  const othersLabel = locale.categoryLabel.others;
  const popularLabel = locale.categoryLabel.popular;
  const recentLabel = locale.categoryLabel.recentlyUsed;

  // create sections, chainToSectionMap and allChains
  const { chainSections, allChains, allChainsToSectionMap } = useMemo(() => {
    const chainSectionsValue: ChainSection[] = [];
    const allChainsValue: Chain[] = [];
    const allChainsToSectionMapValue: Map<number, string> = new Map();

    function addChain(c: Chain, section: string) {
      allChainsToSectionMapValue.set(c.id, section);
      allChainsValue.push(c);
    }

    // if new API is used
    if (props.networkSelector?.sections) {
      for (const s of props.networkSelector.sections) {
        const chainsToAdd = s.chains.filter(
          (c) => !allChainsToSectionMapValue.has(c.id),
        );
        if (chainsToAdd.length > 0) {
          chainSectionsValue.push({
            chains: chainsToAdd,
            label: s.label,
          });
          for (const c of chainsToAdd) {
            addChain(c, s.label);
          }
        }
      }
    }

    // if old API is used
    else {
      const allChainsMap = new Map(props.chains.map((c) => [c.id, c]));
      // add all recent chains
      if (
        props.networkSelector?.recentChainIds &&
        props.networkSelector?.recentChainIds.length > 0
      ) {
        const recentChains = props.networkSelector.recentChainIds
          .map((id) => allChainsMap.get(id))
          .filter((c) => c !== undefined);

        chainSectionsValue.push({
          chains: recentChains,
          label: recentLabel,
        });
        for (const c of recentChains) {
          addChain(c, recentLabel);
        }
      }

      // then add all popular chains ( exclude already added chains )
      if (
        props.networkSelector?.popularChainIds &&
        props.networkSelector.popularChainIds.length > 0
      ) {
        const popularChains = props.networkSelector.popularChainIds
          .map((id) => allChainsMap.get(id))
          .filter((c) => c !== undefined);

        const chainsToAdd = popularChains.filter(
          (c) => !allChainsToSectionMapValue.has(c.id),
        );
        if (chainsToAdd.length > 0) {
          chainSectionsValue.push({
            chains: chainsToAdd,
            label: popularLabel,
          });
          for (const c of chainsToAdd) {
            addChain(c, popularLabel);
          }
        }
      }
    }

    // add all other chains ( exclude already added chains )
    const otherChainsToAdd = props.chains.filter(
      (c) => !allChainsToSectionMapValue.has(c.id),
    );
    if (otherChainsToAdd.length > 0) {
      chainSectionsValue.push({
        chains: otherChainsToAdd,
        label: othersLabel,
      });
      for (const c of otherChainsToAdd) {
        addChain(c, othersLabel);
      }
    }

    return {
      allChains: allChainsValue,
      allChainsToSectionMap: allChainsToSectionMapValue,
      chainSections: chainSectionsValue,
    };
  }, [
    props.networkSelector?.sections,
    props.networkSelector?.recentChainIds,
    props.networkSelector?.popularChainIds,
    props.chains,
    recentLabel,
    popularLabel,
    othersLabel,
  ]);

  // optimizing for dashboard - if we already have names - don't query - we already have the data we want
  const chainsHaveName = allChains.every((c) => !!c.name);

  const allChainsQuery = useChainsQuery(chainsHaveName ? [] : allChains, 10);
  const isAllChainsQueryLoading = chainsHaveName
    ? false
    : allChainsQuery.some((q) => q.isLoading);

  const allChainsMetadata: Chain[] = chainsHaveName
    ? allChains
    : !isAllChainsQueryLoading
      ? allChainsQuery
          .filter((x) => !!x.data)
          .map((q) => convertApiChainToChain(q.data))
      : [];

  // fuse instance for searching
  const fuse = useMemo(() => {
    return new Fuse(allChainsMetadata, {
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
      threshold: 0.4,
    });
  }, [allChainsMetadata]);

  // chains filtered by search term
  const searchedChainSections =
    useMemo(() => {
      if (deferredSearchTerm === "") {
        return undefined;
      }

      const filteredChainSectionsValue: ChainSection[] = [];

      const filteredAllChains = fuse
        .search(deferredSearchTerm)
        .map((r) => r.item);

      for (const c of filteredAllChains) {
        const label = allChainsToSectionMap.get(c.id);
        if (!label) {
          return; // just a type guard, this never happens
        }

        const section = filteredChainSectionsValue.find(
          (s) => s.label === label,
        );
        if (section) {
          section.chains.push(c);
        } else {
          filteredChainSectionsValue.push({
            chains: [c],
            label,
          });
        }
      }

      return filteredChainSectionsValue;
    }, [deferredSearchTerm, fuse, allChainsToSectionMap]) || chainSections;

  const filteredChainSections = useMemo(() => {
    if (selectedTab === "all") {
      return searchedChainSections;
    }

    return searchedChainSections.map((section) => ({
      chains: section.chains.filter(
        (c) =>
          (selectedTab === "mainnet" && !c.testnet) ||
          (selectedTab === "testnet" && c.testnet),
      ),
      label: section.label,
    }));
  }, [searchedChainSections, selectedTab]);

  const handleSwitch = useCallback(
    (chain: Chain) => {
      if (onSwitch) {
        onSwitch(chain);
      }
      props.closeModal();
    },
    [onSwitch, props],
  );

  return (
    <Container>
      <Container p="lg">
        {props.onBack ? (
          <ModalHeader onBack={props.onBack} title={locale.title} />
        ) : (
          <ModalTitle>{locale.title}</ModalTitle>
        )}
      </Container>

      {/* Tabs */}
      {props.showTabs !== false && (
        <>
          <Container px="lg">
            <Container flex="row" gap="xxs">
              <TabButton
                data-active={selectedTab === "all"}
                onClick={() => setSelectedTab("all")}
              >
                {locale.allNetworks}
              </TabButton>
              <TabButton
                data-active={selectedTab === "mainnet"}
                onClick={() => setSelectedTab("mainnet")}
              >
                {locale.mainnets}
              </TabButton>
              <TabButton
                data-active={selectedTab === "testnet"}
                onClick={() => setSelectedTab("testnet")}
              >
                {locale.testnets}
              </TabButton>
            </Container>
          </Container>
          <Spacer y="lg" />
        </>
      )}

      {props.showTabs === false && <Spacer y="xxs" />}

      <Container px="lg">
        {/* Search */}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            position: "relative",
          }}
        >
          <StyledMagnifyingGlassIcon height={iconSize.md} width={iconSize.md} />

          <Input
            disabled={isAllChainsQueryLoading}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            placeholder={
              isAllChainsQueryLoading
                ? "Loading chains..."
                : locale.inputPlaceholder
            }
            style={{
              padding: `${spacing.sm} ${spacing.md} ${spacing.sm} ${spacing.xxl}`,
            }}
            tabIndex={-1}
            value={searchTerm}
            variant="outline"
          />
          {/* Searching Spinner */}
          {(deferredSearchTerm !== searchTerm || isAllChainsQueryLoading) && (
            <div
              style={{
                position: "absolute",
                right: spacing.md,
              }}
            >
              <Spinner color="accentText" size="md" />
            </div>
          )}
        </div>
      </Container>
      <Spacer y="lg" />
      <Container px="md">
        <NetworkTabContent
          chainSections={filteredChainSections}
          client={props.client}
          close={props.closeModal}
          connectLocale={props.connectLocale}
          onSwitch={handleSwitch}
          renderChain={props.networkSelector?.renderChain}
        />
      </Container>
      {onCustomClick && (
        <>
          <Line />
          <Container p="lg">
            <Button
              fullWidth
              onClick={() => {
                onCustomClick();
                props.closeModal();
              }}
              style={{
                boxShadow: "none",
                display: "flex",
                fontSize: fontSize.sm,
              }}
              variant="link"
            >
              {locale.addCustomNetwork}
            </Button>
          </Container>
        </>
      )}
    </Container>
  );
}

/**
 *
 * @internal
 */
const NetworkTabContent = (props: {
  chainSections: Array<ChainSection>;
  onSwitch: (chain: Chain) => void;
  renderChain?: React.FC<NetworkSelectorChainProps>;
  close?: () => void;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
}) => {
  const { chainSections } = props;

  const noChainsToShow = chainSections.every(
    (section) => section.chains.length === 0,
  );

  return (
    <Container
      animate="fadein"
      scrollY
      style={{
        height: "330px",
        paddingBottom: spacing.lg,
      }}
    >
      {/* empty state */}
      {noChainsToShow ? (
        <Container center="both" color="secondaryText" flex="column" gap="md">
          <Spacer y="xl" />
          <CrossCircledIcon height={iconSize.xl} width={iconSize.xl} />
          <Text> No Results </Text>
        </Container>
      ) : (
        chainSections.map((section, idx) => {
          if (section.chains.length === 0) {
            return null;
          }
          return (
            <Fragment key={section.label}>
              {idx !== 0 && <Spacer y="lg" />}
              <SectionLabel>{section.label}</SectionLabel>
              <Spacer y="xs" />
              <NetworkList
                chains={section.chains}
                client={props.client}
                close={props.close}
                connectLocale={props.connectLocale}
                onSwitch={props.onSwitch}
                renderChain={props.renderChain}
              />
            </Fragment>
          );
        })
      )}
    </Container>
  );
};

type NetworkListProps = {
  chains: Chain[];
  onSwitch: (chain: Chain) => void;
  renderChain?: React.FC<NetworkSelectorChainProps>;
  close?: () => void;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
};

/**
 * @internal Exported for tests
 */
export const NetworkList = /* @__PURE__ */ memo(function NetworkList(
  props: NetworkListProps,
) {
  // show 10 items first, when reaching the last item, show 10 more
  const { itemsToShow, lastItemRef } = useShowMore<HTMLLIElement>(10, 10);
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const [switchingChainId, setSwitchingChainId] = useState(-1);
  const [errorSwitchingChainId, setErrorSwitchingChainId] = useState(-1);

  const close = props.close;

  useEffect(() => {
    // if switching and switched successfully - close modal
    if (switchingChainId !== -1 && activeChain?.id === switchingChainId) {
      if (close) {
        close();
      }
    }
  }, [switchingChainId, close, activeChain?.id]);

  const handleSwitch = async (chain: Chain) => {
    setErrorSwitchingChainId(-1);
    setSwitchingChainId(chain.id);

    try {
      await switchChain(chain);
      props.onSwitch(chain);
    } catch (e) {
      setErrorSwitchingChainId(chain.id);
      console.error(e);
    } finally {
      setSwitchingChainId(-1);
    }
  };

  const RenderChain = props.renderChain;
  const chainsToShow = props.chains.slice(0, itemsToShow);

  return (
    <NetworkListUl>
      {chainsToShow.map((chain, i) => {
        if (!chain) {
          return null;
        }
        const confirming = switchingChainId === chain.id;
        const switchingFailed = errorSwitchingChainId === chain.id;
        const isLast = i === chainsToShow.length - 1;

        return (
          <li key={chain.id} ref={isLast ? lastItemRef : undefined}>
            {RenderChain ? (
              <RenderChain
                chain={chain}
                close={props.close}
                switchChain={() => {
                  handleSwitch(chain);
                }}
                switchFailed={errorSwitchingChainId === chain.id}
                switching={switchingChainId === chain.id}
              />
            ) : (
              <ChainButton
                chain={chain}
                client={props.client}
                confirming={confirming}
                connectLocale={props.connectLocale}
                onClick={() => handleSwitch(chain)}
                switchingFailed={switchingFailed}
              />
            )}
          </li>
        );
      })}
    </NetworkListUl>
  );
} as React.FC<NetworkListProps>);

/**
 * @internal
 */
export const ChainButton = /* @__PURE__ */ memo(function ChainButton(props: {
  chain: Chain;
  onClick: () => void;
  confirming: boolean;
  switchingFailed: boolean;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
}) {
  const locale = props.connectLocale;
  const { chain, confirming, switchingFailed } = props;
  const activeChain = useActiveWalletChain();

  return (
    <ChainProvider chain={chain}>
      <NetworkButton
        data-active={activeChain?.id === chain.id}
        onClick={props.onClick}
      >
        <Container
          style={{
            alignItems: "center",
            display: "flex",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <ChainIcon
            client={props.client}
            fallbackComponent={
              <img
                alt=""
                src={fallbackChainIcon}
                style={{
                  height: `${iconSize.lg}px`,
                  width: `${iconSize.lg}px`,
                }}
              />
            }
            loading="lazy"
            loadingComponent={
              <Skeleton
                height={`${iconSize.lg}px`}
                width={`${iconSize.lg}px`}
              />
            }
            style={{
              height: `${iconSize.lg}px`,
              width: `${iconSize.lg}px`,
            }}
          />
          {activeChain?.id === chain.id && (
            <ChainActiveDot className="tw-chain-active-dot-button-network-selector" />
          )}
        </Container>
        {confirming || switchingFailed ? (
          <Container
            flex="column"
            gap="3xs"
            style={{ alignItems: "flex-start", width: "100%" }}
          >
            <ChainName
              loadingComponent={<Skeleton height="20px" width="150px" />}
            />
            <Container animate="fadein" center="y" flex="row" gap="xxs">
              {confirming && (
                <>
                  <Text color="accentText" size="xs">
                    {locale.switchingNetwork}
                  </Text>
                  <Spinner color="accentText" size="xs" />
                </>
              )}

              {switchingFailed && (
                <Container animate="fadein">
                  <Text color="danger" size="xs">
                    {locale.networkSelector.failedToSwitch}
                  </Text>
                </Container>
              )}
            </Container>
          </Container>
        ) : (
          <ChainName
            className="tw-chain-icon-none-confirming"
            loadingComponent={<Skeleton height="20px" width="150px" />}
          />
        )}
      </NetworkButton>
    </ChainProvider>
  );
});

/**
 * @internal Exported for tests
 */
export const TabButton = /* @__PURE__ */ (() =>
  styled.button((_) => {
    const theme = useCustomTheme();
    return {
      "&[data-active='true']": {
        background: theme.colors.secondaryButtonBg,
        color: theme.colors.primaryText,
      },
      all: "unset",
      borderRadius: radius.lg,
      color: theme.colors.secondaryText,
      cursor: "pointer",
      fontSize: fontSize.sm,
      fontWeight: 500,
      padding: `${spacing.sm} ${spacing.sm}`,
      transition: "background 0.2s ease, color 0.2s ease",
      WebkitTapHighlightColor: "transparent",
    };
  }))();

/**
 * @internal Exported for tests
 */
export const SectionLabel = /* @__PURE__ */ StyledP(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.secondaryText,
    display: "block",
    fontSize: fontSize.sm,
    margin: 0,
    padding: `0 ${spacing.xs}`,
  };
});

const NetworkListUl = /* @__PURE__ */ StyledUl({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: spacing.xs,
  listStyle: "none",
  margin: 0,
  padding: 0,
});

/**
 * @internal Exported for tests
 */
export const NetworkButton = /* @__PURE__ */ StyledButton((_) => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
    },
    alignItems: "center",
    all: "unset",
    borderRadius: radius.md,
    boxSizing: "border-box",
    color: theme.colors.primaryText,
    cursor: "pointer",
    display: "flex",
    fontSize: fontSize.md,
    fontWeight: 500,
    gap: spacing.md,
    padding: `${spacing.xs} ${spacing.sm}`,
    transition: "background 0.2s ease",
    width: "100%",

    [media.mobile]: {
      fontSize: fontSize.sm,
    },
  };
});

/**
 * @internal Exported for tests
 */
export const StyledMagnifyingGlassIcon = /* @__PURE__ */ styled(
  MagnifyingGlassIcon,
)((_) => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.secondaryText,
    left: spacing.sm,
    position: "absolute",
  };
});

/**
 * Options for the `useNetworkSwitcherModal` hook's returned `open` function
 * @connectWallet
 */
export type UseNetworkSwitcherModalOptions = {
  /**
   * Set the theme for the `NetworkSwitcher` Modal. By default it is set to `"dark"`
   *
   * theme can be set to either `"dark"`, `"light"` or a custom theme object.
   *
   * You can also import [`lightTheme`](https://portal.thirdweb.com/references/typescript/v5/lightTheme)
   * or [`darkTheme`](https://portal.thirdweb.com/references/typescript/v5/darkTheme)
   * functions from `thirdweb/react` to use the default themes as base and overrides parts of it.
   * @example
   * ```ts
   * import { lightTheme } from "thirdweb/react";
   *
   * const customTheme = lightTheme({
   *  colors: {
   *    modalBg: 'red'
   *  }
   * })
   * ```
   */
  theme?: Theme | "dark" | "light";

  /**
   * Specify sections of chains to be displayed in the Network Selector Modal
   *
   * @example
   * To display "Polygon", "Avalanche" chains under "Recently used" section and "Ethereum", "Arbitrum" chains under "Popular" section, you can set the prop with the following value
   * ```ts
   * import { arbitrum, base, ethereum, polygon } from "thirdweb/chains";
   *
   * const sections = [
   *  { label: 'Recently used', chains: [arbitrum, polygon] },
   *  { label: 'Popular', chains: [base, ethereum] },
   * ]
   * ```
   */
  sections?: Array<ChainSection>;

  /**
   * Override how the chain button is rendered in the Modal
   */
  renderChain?: React.FC<NetworkSelectorChainProps>;

  /**
   * Callback to be called when a chain is successfully switched
   * @param chain - The `Chain` of the chain that was switched to
   */
  onSwitch?: (chain: Chain) => void;

  /**
   * Callback to be called when the "Add Custom Network" button is clicked
   *
   * The "Add Custom Network" button is displayed at the bottom of the modal - only if this prop is provided
   */
  onCustomClick?: () => void;

  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;

  /**
   * By default - NetworkSwitcher UI uses the `en-US` locale for english language users.
   *
   * You can customize the language used in the ConnectButton UI by setting the `locale` prop.
   *
   * Refer to the [`LocaleId`](https://portal.thirdweb.com/references/typescript/v5/LocaleId) type for supported locales.
   */
  locale?: LocaleId;
};

/**
 * Hook to open the Wallet Network Switcher Modal that shows allows users to switch to different network.
 *
 * @example
 * ```tsx
 * import { createThirdwebClient } from "thirdweb";
 * import { useNetworkSwitcherModal } from "thirdweb/react";
 * import { base, ethereum, polygon, sepolia, arbitrum } from "thirdweb/chains";
 *
 * const client = createThirdwebClient({
 *  clientId: "<your_client_id>",
 * });
 *
 * function Example() {
 *   const networkSwitcher = useNetworkSwitcherModal();
 *
 *   function handleClick() {
 *      networkSwitcher.open({
 *        client,
 *        theme: 'light'
 *        sections: [
 *          { label: 'Recently used', chains: [arbitrum, polygon] },
 *          { label: 'Popular', chains: [base, ethereum, sepolia] },
 *        ]
 *     });
 *   }
 *
 *   return <button onClick={handleClick}> Switch Network </button>
 * }
 * ```
 * @wallet
 */
export function useNetworkSwitcherModal() {
  const activeChain = useActiveWalletChain();
  const setRootEl = useContext(SetRootElementContext);

  const closeModal = useCallback(() => {
    setRootEl(null);
  }, [setRootEl]);

  const openNetworkSwitcher = useCallback(
    async (props: UseNetworkSwitcherModalOptions) => {
      if (!activeChain) {
        throw new Error("No active wallet found");
      }
      const locale = await getConnectLocale(props.locale || "en_US");
      setRootEl(
        <CustomThemeProvider theme={props.theme}>
          <Modal
            open={true}
            setOpen={(value) => {
              if (!value) {
                closeModal();
              }
            }}
            size="compact"
            style={{
              paddingBottom: props.onCustomClick ? spacing.md : "0px",
            }}
          >
            <NetworkSelectorContent
              chains={[activeChain]}
              client={props.client}
              closeModal={closeModal}
              connectLocale={locale}
              networkSelector={{
                onCustomClick: props.onCustomClick,
                onSwitch: props.onSwitch,
                renderChain: props.renderChain,
                sections: props.sections,
              }}
            />
          </Modal>
        </CustomThemeProvider>,
      );
    },
    [setRootEl, closeModal, activeChain],
  );

  return {
    close: closeModal,
    open: openNetworkSwitcher,
  };
}

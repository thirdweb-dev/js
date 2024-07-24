"use client";
import styled from "@emotion/styled";
import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Fuse from "fuse.js";
import {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type React from "react";
import type { Chain } from "../../../../chains/types.js";
import { convertApiChainToChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../core/design-system/CustomThemeProvider.js";
import {
  type Theme,
  fontSize,
  iconSize,
  media,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import {
  useChainIconUrl,
  useChainName,
  useChainsQuery,
} from "../../../core/hooks/others/useChainQuery.js";
import { SetRootElementContext } from "../../../core/providers/RootElementContext.js";
import { useActiveWalletChain } from "../../hooks/wallets/useActiveWalletChain.js";
import { useSwitchActiveWalletChain } from "../../hooks/wallets/useSwitchActiveWalletChain.js";
import { ChainIcon } from "../components/ChainIcon.js";
import { Modal } from "../components/Modal.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Container, Line, ModalHeader } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Input } from "../components/formElements.js";
import { ModalTitle } from "../components/modalElements.js";
import { Text } from "../components/text.js";
import { StyledButton, StyledP, StyledUl } from "../design-system/elements.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { useShowMore } from "../hooks/useShowMore.js";
import type { LocaleId } from "../types.js";
import { getConnectLocale } from "./locale/getConnectLocale.js";
import type { ConnectLocale } from "./locale/types.js";

type NetworkSelectorChainProps = {
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
            label: s.label,
            chains: chainsToAdd,
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
          label: recentLabel,
          chains: recentChains,
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
            label: popularLabel,
            chains: chainsToAdd,
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
        label: othersLabel,
        chains: otherChainsToAdd,
      });
      for (const c of otherChainsToAdd) {
        addChain(c, othersLabel);
      }
    }

    return {
      chainSections: chainSectionsValue,
      allChains: allChainsValue,
      allChainsToSectionMap: allChainsToSectionMapValue,
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
            label,
            chains: [c],
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
      label: section.label,
      chains: section.chains.filter(
        (c) =>
          (selectedTab === "mainnet" && !c.testnet) ||
          (selectedTab === "testnet" && c.testnet),
      ),
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
          <ModalHeader title={locale.title} onBack={props.onBack} />
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
                onClick={() => setSelectedTab("all")}
                data-active={selectedTab === "all"}
              >
                {locale.allNetworks}
              </TabButton>
              <TabButton
                onClick={() => setSelectedTab("mainnet")}
                data-active={selectedTab === "mainnet"}
              >
                {locale.mainnets}
              </TabButton>
              <TabButton
                onClick={() => setSelectedTab("testnet")}
                data-active={selectedTab === "testnet"}
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
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <StyledMagnifyingGlassIcon width={iconSize.md} height={iconSize.md} />

          <Input
            style={{
              padding: `${spacing.sm} ${spacing.md} ${spacing.sm} ${spacing.xxl}`,
            }}
            tabIndex={-1}
            variant="outline"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            disabled={isAllChainsQueryLoading}
            placeholder={
              isAllChainsQueryLoading
                ? "Loading chains..."
                : locale.inputPlaceholder
            }
          />
          {/* Searching Spinner */}
          {(deferredSearchTerm !== searchTerm || isAllChainsQueryLoading) && (
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
      <Container px="md">
        <NetworkTabContent
          chainSections={filteredChainSections}
          onSwitch={handleSwitch}
          renderChain={props.networkSelector?.renderChain}
          connectLocale={props.connectLocale}
          client={props.client}
          close={props.closeModal}
        />
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
                props.closeModal();
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
      scrollY
      animate="fadein"
      style={{
        height: "330px",
        paddingBottom: spacing.lg,
      }}
    >
      {/* empty state */}
      {noChainsToShow ? (
        <Container flex="column" gap="md" center="both" color="secondaryText">
          <Spacer y="xl" />
          <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
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
                onSwitch={props.onSwitch}
                renderChain={props.renderChain}
                close={props.close}
                client={props.client}
                connectLocale={props.connectLocale}
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

const NetworkList = /* @__PURE__ */ memo(function NetworkList(
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
                switchChain={() => {
                  handleSwitch(chain);
                }}
                chain={chain}
                switching={switchingChainId === chain.id}
                switchFailed={errorSwitchingChainId === chain.id}
                close={props.close}
              />
            ) : (
              <ChainButton
                chain={chain}
                confirming={confirming}
                onClick={() => handleSwitch(chain)}
                switchingFailed={switchingFailed}
                client={props.client}
                connectLocale={props.connectLocale}
              />
            )}
          </li>
        );
      })}
    </NetworkListUl>
  );
} as React.FC<NetworkListProps>);

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

  const chainNameQuery = useChainName(chain);
  const chainIconQuery = useChainIconUrl(chain);

  let chainName: React.ReactNode;
  if (chainNameQuery.name) {
    chainName = <span>{chainNameQuery.name} </span>;
  } else {
    chainName = <Skeleton width="150px" height="20px" />;
  }

  return (
    <NetworkButton
      data-active={activeChain?.id === chain.id}
      onClick={props.onClick}
    >
      {!chainIconQuery.isLoading ? (
        <ChainIcon
          chainIconUrl={chainIconQuery.url}
          size={iconSize.lg}
          active={activeChain?.id === chain.id}
          loading="lazy"
          client={props.client}
        />
      ) : (
        <Skeleton width={`${iconSize.lg}px`} height={`${iconSize.lg}px`} />
      )}

      {confirming || switchingFailed ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacing.xs,
          }}
        >
          {chainName}
          <Container animate="fadein" flex="row" gap="xxs" center="y">
            {confirming && (
              <>
                <Text size="xs" color="accentText">
                  {locale.confirmInWallet}
                </Text>
                <Spinner size="xs" color="accentText" />
              </>
            )}

            {switchingFailed && (
              <Container animate="fadein">
                <Text size="xs" color="danger">
                  {locale.networkSelector.failedToSwitch}
                </Text>
              </Container>
            )}
          </Container>
        </div>
      ) : (
        chainName
      )}
    </NetworkButton>
  );
});

const TabButton = /* @__PURE__ */ (() =>
  styled.button((_) => {
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

      "&[data-active='true']": {
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

const NetworkButton = /* @__PURE__ */ StyledButton((_) => {
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
  (_) => {
    const theme = useCustomTheme();
    return {
      color: theme.colors.secondaryText,
      position: "absolute",
      left: spacing.sm,
    };
  },
);

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
            size={"compact"}
            open={true}
            setOpen={(value) => {
              if (!value) {
                closeModal();
              }
            }}
            style={{
              paddingBottom: props.onCustomClick ? spacing.md : "0px",
            }}
          >
            <NetworkSelectorContent
              client={props.client}
              closeModal={closeModal}
              chains={[activeChain]}
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
    open: openNetworkSwitcher,
    close: closeModal,
  };
}

"use client";
import styled from "@emotion/styled";
import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Fuse from "fuse.js";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type React from "react";
import type { Chain, ChainMetadata } from "../../../../chains/types.js";
import { convertApiChainToChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  media,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import {
  useChainQuery,
  useChainsQuery,
} from "../../../core/hooks/others/useChainQuery.js";
import { useActiveWalletChain } from "../../hooks/wallets/useActiveWalletChain.js";
import { useSwitchActiveWalletChain } from "../../hooks/wallets/useSwitchActiveWalletChain.js";
import { ChainIcon } from "../components/ChainIcon.js";
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
import type { ConnectLocale } from "./locale/types.js";

// Note: Must not use useConnectUI here, because this component is also used outside of Connect UI context

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

/**
 * @connectWallet
 */
export type NetworkSelectorProps = {
  /**
   * Chains to be displayed as "Popular"
   */
  popularChainIds?: number[];

  /**
   * Chains to be displayed as "Recent"
   */
  recentChainIds?: number[];

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

let fuseInstances:
  | {
      all: Fuse<ChainMetadata>;
      popular: Fuse<ChainMetadata>;
      recent: Fuse<ChainMetadata>;
    }
  | undefined = undefined;

let fuseInitializationStarted = false;

// initialize fuse instances if not already initialized
function initializeFuseInstances() {
  if (fuseInitializationStarted) {
    return;
  }

  fuseInitializationStarted = true;

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

  fuseInstances = {
    all: new Fuse([], fuseConfig),
    popular: new Fuse([], fuseConfig),
    recent: new Fuse([], fuseConfig),
  };
}

type ChainData = {
  allChains: ChainMetadata[];
  popularChains: ChainMetadata[];
  recentChains: ChainMetadata[];
  isLoading: boolean;
};

function useLoadChains(
  allChainsInput: Chain[],
  popularChainIds: number[],
  recentChainIds: number[],
): ChainData {
  // load all chains with react query
  const chainsQueries = useChainsQuery(allChainsInput, 50);

  const isLoading = chainsQueries.some((q) => q.isLoading);

  const { allChains, chainsMap } = useMemo(() => {
    const _chains: ChainMetadata[] = [];
    const _chainsMap = new Map<number, ChainMetadata>();

    if (isLoading) {
      return { allChains: [], chainsMap: _chainsMap };
    }

    for (const chainQuery of chainsQueries) {
      if (chainQuery.data) {
        _chains.push({
          ...chainQuery.data,
        } as ChainMetadata);
      }
    }

    for (const chain of _chains) {
      _chainsMap.set(chain.chainId, chain);
    }

    return { allChains: _chains, chainsMap: _chainsMap, isLoading: false };
  }, [chainsQueries, isLoading]);

  const recentChains = useMemo(() => {
    if (!recentChainIds) {
      return [];
    }
    const _recentChains: ChainMetadata[] = [];
    for (const chainId of recentChainIds) {
      const _chain = chainsMap.get(chainId);
      if (_chain) {
        _recentChains.push(_chain);
      }
    }
    return _recentChains;
  }, [recentChainIds, chainsMap]);

  const popularChains = useMemo(() => {
    if (!popularChainIds) {
      return [];
    }
    const _popularChains: ChainMetadata[] = [];
    for (const chainId of popularChainIds) {
      const _chain = chainsMap.get(chainId);
      if (_chain) {
        _popularChains.push(_chain);
      }
    }
    return _popularChains;
  }, [popularChainIds, chainsMap]);

  return {
    allChains,
    popularChains,
    recentChains,
    isLoading,
  };
}

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
  const chainsData = useLoadChains(
    props.chains,
    props.networkSelector?.popularChainIds || [],
    props.networkSelector?.recentChainIds || [],
  );

  initializeFuseInstances();

  return <NetworkSelectorContentInner {...props} chainsData={chainsData} />;
}

function NetworkSelectorContentInner(
  props: NetworkSelectorContentProps & {
    chainsData: ChainData;
    connectLocale: ConnectLocale;
    client: ThirdwebClient;
  },
) {
  const { chainsData, connectLocale } = props;

  const chainMap = useMemo(() => {
    const _chainMap = new Map<number, Chain>();
    for (const chain of props.chains) {
      _chainMap.set(chain.id, chain);
    }
    return _chainMap;
  }, [props.chains]);

  const locale = connectLocale.networkSelector;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "mainnet" | "testnet">(
    "all",
  );
  const deferredSearchTerm = useDebouncedValue(searchTerm, 300);

  const { onSwitch, onCustomClick } = props.networkSelector || {};

  const allChainsTab = useMemo(() => {
    return filterChainByType(chainsData.allChains, selectedTab);
  }, [chainsData.allChains, selectedTab]);

  const popularChainsTab = useMemo(() => {
    return filterChainByType(chainsData.popularChains, selectedTab);
  }, [chainsData.popularChains, selectedTab]);

  const recentChainsTab = useMemo(() => {
    return filterChainByType(chainsData.recentChains, selectedTab);
  }, [chainsData.recentChains, selectedTab]);

  // chains filtered by search term + type
  const allChainsFiltered = useMemo(() => {
    if (!fuseInstances) {
      return allChainsTab;
    }

    if (deferredSearchTerm === "") {
      return allChainsTab;
    }

    fuseInstances.all.setCollection(allChainsTab);
    return fuseInstances.all.search(deferredSearchTerm).map((r) => r.item);
  }, [allChainsTab, deferredSearchTerm]);

  const popularChainsFiltered = useMemo(() => {
    if (!fuseInstances) {
      return popularChainsTab;
    }

    if (deferredSearchTerm === "") {
      return popularChainsTab;
    }

    fuseInstances.popular.setCollection(popularChainsTab);
    return fuseInstances.popular.search(deferredSearchTerm).map((r) => r.item);
  }, [deferredSearchTerm, popularChainsTab]);

  const recentChainsFiltered = useMemo(() => {
    if (!fuseInstances) {
      return recentChainsTab;
    }

    if (deferredSearchTerm === "") {
      return recentChainsTab;
    }

    fuseInstances.recent.setCollection(recentChainsTab);
    return fuseInstances.recent.search(deferredSearchTerm).map((r) => r.item);
  }, [deferredSearchTerm, recentChainsTab]);

  const handleSwitch = useCallback(
    (chain: Chain) => {
      if (onSwitch) {
        onSwitch(chain);
      }
      props.closeModal();
    },
    [onSwitch, props],
  );

  const allChainsToShow = useMemo(() => {
    if (chainsData.isLoading) {
      return props.chains;
    }
    return allChainsFiltered.map(convertApiChainToChain);
  }, [allChainsFiltered, chainsData.isLoading, props.chains]);

  const popularChainsToShow = useMemo(() => {
    if (chainsData.isLoading) {
      return (
        props.networkSelector?.popularChainIds?.map(
          (id) => chainMap.get(id) as Chain,
        ) || []
      );
    }
    return popularChainsFiltered.map(convertApiChainToChain);
  }, [
    chainMap,
    chainsData.isLoading,
    popularChainsFiltered,
    props.networkSelector?.popularChainIds,
  ]);

  const recentChainsToShow = useMemo(() => {
    if (chainsData.isLoading) {
      return (
        props.networkSelector?.recentChainIds?.map(
          (id) => chainMap.get(id) as Chain,
        ) || []
      );
    }
    return recentChainsFiltered.map(convertApiChainToChain);
  }, [
    chainMap,
    chainsData.isLoading,
    props.networkSelector?.recentChainIds,
    recentChainsFiltered,
  ]);

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
            disabled={chainsData.isLoading}
            placeholder={
              chainsData.isLoading
                ? "Loading chains..."
                : locale.inputPlaceholder
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          {/* Searching Spinner */}
          {(deferredSearchTerm !== searchTerm || chainsData.isLoading) && (
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
          allChainIds={allChainsToShow}
          popularChainIds={popularChainsToShow}
          recentChainIds={recentChainsToShow}
          onSwitch={handleSwitch}
          renderChain={props.networkSelector?.renderChain}
          connectLocale={connectLocale}
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
const filterChainByType = (
  chains: ChainMetadata[],
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
const NetworkTabContent = (props: {
  allChainIds: Chain[];
  recentChainIds?: Chain[];
  popularChainIds?: Chain[];
  onSwitch: (chain: Chain) => void;
  renderChain?: React.FC<NetworkSelectorChainProps>;
  close?: () => void;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
}) => {
  const locale = props.connectLocale.networkSelector.categoryLabel;

  const { recentChainIds, popularChainIds, allChainIds } = props;

  const noChainsToShow =
    recentChainIds?.length === 0 &&
    popularChainIds?.length === 0 &&
    allChainIds.length === 0;

  return (
    <Container
      scrollY
      animate="fadein"
      style={{
        height: "330px",
        paddingBottom: spacing.lg,
      }}
    >
      {recentChainIds && recentChainIds.length > 0 && (
        <div>
          <SectionLabel>{locale.recentlyUsed}</SectionLabel>
          <Spacer y="sm" />
          <NetworkList
            chains={recentChainIds}
            onSwitch={props.onSwitch}
            renderChain={props.renderChain}
            close={props.close}
            client={props.client}
            connectLocale={props.connectLocale}
          />
          <Spacer y="lg" />
        </div>
      )}

      {popularChainIds && popularChainIds.length > 0 && (
        <div>
          <SectionLabel>{locale.popular}</SectionLabel>
          <Spacer y="sm" />
          <NetworkList
            chains={popularChainIds}
            onSwitch={props.onSwitch}
            renderChain={props.renderChain}
            close={props.close}
            client={props.client}
            connectLocale={props.connectLocale}
          />
          <Spacer y="lg" />
        </div>
      )}

      {/* separator  */}
      {((popularChainIds && popularChainIds.length > 0) ||
        (recentChainIds && recentChainIds.length > 0)) && (
        <>
          <SectionLabel>{locale.others}</SectionLabel>
          <Spacer y="sm" />
        </>
      )}

      <NetworkList
        chains={allChainIds}
        onSwitch={props.onSwitch}
        renderChain={props.renderChain}
        close={props.close}
        client={props.client}
        connectLocale={props.connectLocale}
      />

      {noChainsToShow && (
        <Container flex="column" gap="md" center="both" color="secondaryText">
          <Spacer y="xl" />
          <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
          <Text> No Results </Text>
        </Container>
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
  const { data: fetchedChain } = useChainQuery(chain);

  let chainName: React.ReactNode;
  if (fetchedChain) {
    chainName = <span>{fetchedChain.name} </span>;
  } else {
    chainName = <Skeleton width="150px" height="20px" />;
  }

  return (
    <NetworkButton
      data-active={activeChain?.id === chain.id}
      onClick={props.onClick}
    >
      {fetchedChain ? (
        <ChainIcon
          chainIcon={fetchedChain.icon}
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

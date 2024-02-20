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
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Container, ModalHeader, Line } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Input } from "../components/formElements.js";
import { ModalTitle } from "../components/modalElements.js";
import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { StyledP, StyledUl, StyledButton } from "../design-system/elements.js";
import {
  spacing,
  iconSize,
  fontSize,
  radius,
  media,
} from "../design-system/index.js";
import type Fuse from "fuse.js";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "../../providers/wallet-provider.js";
import { Text } from "../components/text.js";
import {
  useChainQuery,
  useChainsQuery,
} from "../../hooks/others/useChainQuery.js";
import { useTWLocale } from "../../providers/locale-provider.js";
import type React from "react";
import type { ApiChain, Chain } from "../../../chains/types.js";
import { defineChain } from "../../../chains/index.js";

type NetworkSelectorChainProps = {
  /**
   * Chain Id of the chain to be displayed
   */
  chainId: number;
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
   * function to call to close the modal
   */
  closeModal?: () => void;

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
   * @param chainId - The chainId of the chain that was switched to
   */
  onSwitch?: (chainId: number) => void;

  /**
   * Callback to be called when the "Add Custom Network" button is clicked
   *
   * The "Add Custom Network" button is displayed at the bottom of the modal - only if this prop is provided
   */
  onCustomClick?: () => void;
};

let fuseInstances:
  | {
      all: Fuse<ApiChain>;
      popular: Fuse<ApiChain>;
      recent: Fuse<ApiChain>;
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

  import("fuse.js").then((module) => {
    const Fuse = module.default;
    fuseInstances = {
      all: new Fuse([], fuseConfig),
      popular: new Fuse([], fuseConfig),
      recent: new Fuse([], fuseConfig),
    };
  });
}

function useLoadChains(
  allChainsInput: Chain[],
  popularChainsInput: Chain[],
  recentChainsInput: Chain[],
) {
  const allChainIds = new Set([
    ...allChainsInput.map((c) => c.id),
    ...popularChainsInput.map((c) => c.id),
    ...recentChainsInput.map((c) => c.id),
  ]);

  // load all chains with react query
  const chainsQueries = useChainsQuery([...allChainIds]);

  const { allChains, chainsMap, isLoading } = useMemo(() => {
    const _chains: ApiChain[] = [];
    const _chainsMap = new Map<number, ApiChain>();

    for (const chainQuery of chainsQueries) {
      // if not all chains are loaded, return empty array + loading: true
      if (chainQuery.isLoading) {
        return { allChains: [], chainsMap: _chainsMap, isLoading: true };
      } else {
        _chains.push(chainQuery.data as ApiChain);
      }
    }

    for (const chain of _chains) {
      _chainsMap.set(chain.chainId, chain);
    }

    return { allChains: _chains, chainsMap: _chainsMap, isLoading: false };
  }, [chainsQueries]);

  const popularChains = useMemo(() => {
    if (!popularChainsInput) {
      return [];
    }
    const _popularChains: ApiChain[] = [];
    for (const chain of popularChainsInput) {
      const _chain = chainsMap.get(chain.id);
      if (_chain) {
        _popularChains.push(_chain);
      }
    }
    return _popularChains;
  }, [popularChainsInput, chainsMap]);

  const recentChains = useMemo(() => {
    if (!recentChainsInput) {
      return [];
    }
    const _recentChains: ApiChain[] = [];
    for (const chain of recentChainsInput) {
      const _chain = chainsMap.get(chain.id);
      if (_chain) {
        _recentChains.push(_chain);
      }
    }
    return _recentChains;
  }, [recentChainsInput, chainsMap]);

  return {
    allChains,
    popularChains,
    recentChains,
    isLoading,
  };
}

/**
 *
 * @internal
 */
export function NetworkSelectorContent(
  props: NetworkSelectorProps & {
    onBack?: () => void;
    chains: Chain[];
  },
) {
  const chainsData = useLoadChains(
    props.chains || [],
    props.popularChains || [],
    props.recentChains || [],
  );

  const locale = useTWLocale().connectWallet.networkSelector;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "mainnet" | "testnet">(
    "all",
  );
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const { closeModal, onSwitch, onCustomClick } = props;

  initializeFuseInstances();

  // chains filtered by search term + type
  const allChainsFiltered = useMemo(() => {
    const _chains = filterChainByType(chainsData.allChains, selectedTab);
    if (!fuseInstances) {
      return _chains;
    }
    fuseInstances.all.setCollection(_chains);
    if (deferredSearchTerm === "") {
      return _chains;
    }
    return fuseInstances.all.search(deferredSearchTerm).map((r) => r.item);
  }, [chainsData.allChains, selectedTab, deferredSearchTerm]);

  const popularChainsFiltered = useMemo(() => {
    const _chains = filterChainByType(chainsData.popularChains, selectedTab);
    if (!fuseInstances) {
      return _chains;
    }
    fuseInstances.popular.setCollection(_chains);
    if (deferredSearchTerm === "") {
      return _chains;
    }
    return fuseInstances.popular.search(deferredSearchTerm).map((r) => r.item);
  }, [chainsData.popularChains, selectedTab, deferredSearchTerm]);

  const recentChainsFiltered = useMemo(() => {
    const _chains = filterChainByType(chainsData.recentChains, selectedTab);
    if (!fuseInstances) {
      return _chains;
    }
    fuseInstances.recent.setCollection(_chains);
    if (deferredSearchTerm === "") {
      return _chains;
    }
    return fuseInstances.recent.search(deferredSearchTerm).map((r) => r.item);
  }, [chainsData.recentChains, deferredSearchTerm, selectedTab]);

  const handleSwitch = useCallback(
    (chainId: number) => {
      if (onSwitch) {
        onSwitch(chainId);
      }
      if (closeModal) {
        closeModal();
      }
    },
    [onSwitch, closeModal],
  );

  const allChainsToShow = useMemo(() => {
    if (chainsData.isLoading) {
      return props.chains.map((x) => x.id);
    }
    return allChainsFiltered.map((x) => x.chainId);
  }, [allChainsFiltered, chainsData.isLoading, props.chains]);

  const popularChainsToShow = useMemo(() => {
    if (chainsData.isLoading) {
      return (props.popularChains || []).map((x) => x.id);
    }
    return popularChainsFiltered.map((x) => x.chainId);
  }, [chainsData.isLoading, popularChainsFiltered, props.popularChains]);

  const recentChainsToShow = useMemo(() => {
    if (chainsData.isLoading) {
      return (props.recentChains || []).map((x) => x.id);
    }
    return recentChainsFiltered.map((x) => x.chainId);
  }, [chainsData.isLoading, props.recentChains, recentChainsFiltered]);

  return (
    <Container>
      <Container p="lg">
        {props.onBack ? (
          <ModalHeader title={locale.title} onBack={props.onBack} />
        ) : (
          <ModalTitle>{locale.title}</ModalTitle>
        )}
      </Container>

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

      <Container px="md">
        <NetworkTabContent
          allChainIds={allChainsToShow}
          popularChainIds={popularChainsToShow}
          recentChainIds={recentChainsToShow}
          onSwitch={handleSwitch}
          renderChain={props.renderChain}
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
                if (closeModal) {
                  closeModal();
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
const NetworkTabContent = (props: {
  allChainIds: number[];
  recentChainIds?: number[];
  popularChainIds?: number[];
  onSwitch: (chainId: number) => void;
  renderChain?: React.FC<NetworkSelectorChainProps>;
  close?: () => void;
}) => {
  const locale = useTWLocale().connectWallet.networkSelector.categoryLabel;

  const { recentChainIds, popularChainIds, allChainIds } = props;
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
            chainIds={recentChainIds}
            onSwitch={props.onSwitch}
            renderChain={props.renderChain}
            close={props.close}
          />
          <Spacer y="lg" />
        </div>
      )}

      {popularChainIds && popularChainIds.length > 0 && (
        <div>
          <SectionLabel>{locale.popular}</SectionLabel>
          <Spacer y="sm" />
          <NetworkList
            chainIds={popularChainIds}
            onSwitch={props.onSwitch}
            renderChain={props.renderChain}
            close={props.close}
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
        chainIds={allChainIds}
        onSwitch={props.onSwitch}
        renderChain={props.renderChain}
        close={props.close}
      />
    </Container>
  );
};

type NetworkListProps = {
  chainIds: number[];
  onSwitch: (chainId: number) => void;
  renderChain?: React.FC<NetworkSelectorChainProps>;
  close?: () => void;
};

const NetworkList = /* @__PURE__ */ memo(function NetworkList(
  props: NetworkListProps,
) {
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

  const handleSwitch = async (chainId: number) => {
    setErrorSwitchingChainId(-1);
    setSwitchingChainId(chainId);

    try {
      await switchChain(defineChain(chainId));
      props.onSwitch(chainId);
    } catch (e: any) {
      setErrorSwitchingChainId(chainId);
      console.error(e);
    } finally {
      setSwitchingChainId(-1);
    }
  };
  const RenderChain = props.renderChain;

  const [isLoading, setIsLoading] = useState(props.chainIds.length > 100);

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
      {props.chainIds.map((chainId) => {
        const confirming = switchingChainId === chainId;
        const switchingFailed = errorSwitchingChainId === chainId;

        if (RenderChain) {
          return (
            <li key={chainId}>
              <RenderChain
                switchChain={() => {
                  handleSwitch(chainId);
                }}
                chainId={chainId}
                switching={switchingChainId === chainId}
                switchFailed={errorSwitchingChainId === chainId}
                close={props.close}
              />
            </li>
          );
        }

        return (
          <li key={chainId}>
            <ChainButton
              chainId={chainId}
              confirming={confirming}
              handleSwitch={handleSwitch}
              switchingFailed={switchingFailed}
            />
          </li>
        );
      })}
    </NetworkListUl>
  );
} as React.FC<NetworkListProps>);

function ChainButton(props: {
  chainId: number;
  handleSwitch: (chain: number) => void;
  confirming: boolean;
  switchingFailed: boolean;
}) {
  const twLocale = useTWLocale();
  const locale = twLocale.connectWallet.networkSelector;
  const { chainId, handleSwitch, confirming, switchingFailed } = props;
  const activeChain = useActiveWalletChain();
  const apiChainQuery = useChainQuery(chainId);

  const chainName = apiChainQuery.data ? (
    <span>{apiChainQuery.data.name} </span>
  ) : (
    <Skeleton width="150px" height="20px" />
  );
  return (
    <NetworkButton
      data-active={activeChain?.id === chainId}
      onClick={() => {
        handleSwitch(chainId);
      }}
    >
      {apiChainQuery.data ? (
        <ChainIcon
          chain={apiChainQuery.data}
          size={iconSize.lg}
          active={activeChain?.id === chainId}
          loading="lazy"
        />
      ) : (
        <Skeleton width={iconSize.lg + "px"} height={iconSize.lg + "px"} />
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
  );
}

const TabButton = /* @__PURE__ */ (() =>
  styled.button(() => {
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

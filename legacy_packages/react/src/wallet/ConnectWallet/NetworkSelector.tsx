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
import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
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
import { Container, Line, ModalHeader } from "../../components/basic";
import { Text } from "../../components/text";
import { ModalTitle } from "../../components/modalElements";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../design-system/CustomThemeProvider";
import { useTWLocale } from "../../evm/providers/locale-provider";
import { StyledButton, StyledP, StyledUl } from "../../design-system/elements";
import { Skeleton } from "../../components/Skeleton";

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
   * @deprecated Use `sections` prop instead
   *
   * If `sections` prop is provided, this prop will be ignored
   */
  popularChains?: Chain[];
  /**
   * Array of chains to be displayed under "Recent" section
   * @deprecated Use `sections` prop instead
   *
   * If `sections` prop is provided, this prop will be ignored
   */
  recentChains?: Chain[];

  /**
   * Specify sections of chains to be displayed in the Network Selector Modal
   *
   * @example
   * To display "Polygon", "Avalanche" chains under "Recently used" section and "Ethereum", "Arbitrum" chains under "Popular" section, you can set the prop with the following value
   * ```ts
   * import { Polygon, Avalanche, Ethereum, Arbitrum } from "@thirdweb-dev/chains";
   *
   * const sections = [
   *  { label: 'Recently used', chains: [Polygon, Avalanche] },
   *  { label: 'Popular', chains: [Ethereum, Arbitrum] },
   * ]
   * ```
   */
  sections?: Array<{
    label: string;
    chains: Chain[];
  }>;

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
 *
 * @internal
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

type ChainSection = {
  chains: Chain[];
  label: string;
};

export function NetworkSelectorContent(
  props: NetworkSelectorProps & {
    onBack?: () => void;
    showTabs?: boolean;
  },
) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const locale = useTWLocale().connectWallet.networkSelector;

  const supportedChains = useSupportedChains();
  const otherChains = props.chains || supportedChains;

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
      allChainsToSectionMapValue.set(c.chainId, section);
      allChainsValue.push(c);
    }

    // if new API is used
    if (props.sections) {
      props.sections.forEach((s) => {
        const chainsToAdd = s.chains.filter(
          (c) => !allChainsToSectionMapValue.has(c.chainId),
        );
        if (chainsToAdd.length > 0) {
          chainSectionsValue.push({
            label: s.label,
            chains: chainsToAdd,
          });
          chainsToAdd.forEach((c) => addChain(c, s.label));
        }
      });
    }

    // if old API is used
    else {
      // add all recent chains
      if (props.recentChains && props.recentChains.length > 0) {
        chainSectionsValue.push({
          label: recentLabel,
          chains: props.recentChains,
        });
        props.recentChains.forEach((c) => addChain(c, recentLabel));
      }

      // then add all popular chains ( exclude already added chains )
      if (props.popularChains && props.popularChains.length > 0) {
        const chainsToAdd = props.popularChains.filter(
          (c) => !allChainsToSectionMapValue.has(c.chainId),
        );
        if (chainsToAdd.length > 0) {
          chainSectionsValue.push({
            label: popularLabel,
            chains: chainsToAdd,
          });
          chainsToAdd.forEach((c) => addChain(c, popularLabel));
        }
      }
    }

    // add all other chains ( exclude already added chains )
    const otherChainsToAdd = otherChains.filter(
      (c) => !allChainsToSectionMapValue.has(c.chainId),
    );
    if (otherChainsToAdd.length > 0) {
      chainSectionsValue.push({
        label: othersLabel,
        chains: otherChainsToAdd,
      });
      otherChainsToAdd.forEach((c) => addChain(c, othersLabel));
    }

    return {
      chainSections: chainSectionsValue,
      allChains: allChainsValue,
      allChainsToSectionMap: allChainsToSectionMapValue,
    };
  }, [
    props.sections,
    props.recentChains,
    props.popularChains,
    otherChains,
    recentLabel,
    popularLabel,
    othersLabel,
  ]);

  // fuse instance for searching
  const fuse = useMemo(() => {
    return new Fuse(allChains, {
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
  }, [allChains]);

  // chains filtered by search term
  const filteredChainSections =
    useMemo(() => {
      if (deferredSearchTerm === "") {
        return undefined;
      }

      const filteredChainSectionsValue: ChainSection[] = [];

      const filteredAllChains = fuse
        .search(deferredSearchTerm)
        .map((r) => r.item);

      filteredAllChains.forEach((c) => {
        const label = allChainsToSectionMap.get(c.chainId);
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

        return filteredChainSectionsValue;
      });

      return filteredChainSectionsValue;
    }, [deferredSearchTerm, fuse, allChainsToSectionMap]) || chainSections;

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
    <Container>
      <Container p="lg">
        {props.onBack ? (
          <ModalHeader title={locale.title} onBack={props.onBack} />
        ) : (
          <ModalTitle>{locale.title}</ModalTitle>
        )}
      </Container>

      <Tabs.Root className="TabsRoot" defaultValue="all">
        {props.showTabs !== false && (
          <>
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
          </>
        )}

        {props.showTabs === false && <Spacer y="xxs" />}

        {allChains.length > 10 && (
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
              chainSections={filteredChainSections}
              type="all"
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
              chainSections={filteredChainSections}
              type="mainnet"
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
              chainSections={filteredChainSections}
              type="testnet"
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
  chainSections: ChainSection[];
  type: "testnet" | "mainnet" | "all";
  onSwitch: (chain: Chain) => void;
  renderChain?: React.FC<NetworkSelectorChainProps>;
  close?: () => void;
}) => {
  const filteredChainSections = useMemo(() => {
    return props.chainSections
      .map((section) => {
        return {
          label: section.label,
          chains: filterChainByType(section.chains, props.type),
        };
      })
      .filter((section) => section.chains.length > 0);
  }, [props.chainSections, props.type]);

  const showSectionLabel = filteredChainSections.length > 1;

  return (
    <Container
      scrollY
      animate="fadein"
      style={{
        height: "330px",
        paddingBottom: spacing.lg,
      }}
    >
      {filteredChainSections.length > 0 ? (
        <Container flex="column" gap="lg">
          {filteredChainSections.map((section) => {
            return (
              <div key={section.label}>
                {showSectionLabel && (
                  <>
                    <SectionLabel>{section.label}</SectionLabel>
                    <Spacer y="sm" />
                  </>
                )}

                <NetworkList
                  chains={section.chains}
                  onSwitch={props.onSwitch}
                  renderChain={props.renderChain}
                  close={props.close}
                />
              </div>
            );
          })}
        </Container>
      ) : (
        <Container flex="column" gap="md" center="both" color="secondaryText">
          <Spacer y="xl" />
          <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
          <Text> {"No Results"} </Text>
        </Container>
      )}
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

        return (
          <li key={chain.chainId}>
            {RenderChain ? (
              <RenderChain
                switchChain={() => {
                  handleSwitch(chain);
                }}
                chain={chain}
                switching={switchingChainId === chain.chainId}
                switchFailed={errorSwitchingChainId === chain.chainId}
                close={props.close}
              />
            ) : (
              <ChainButton
                chain={chain}
                confirming={confirming}
                onClick={() => handleSwitch(chain)}
                switchingFailed={switchingFailed}
              />
            )}
          </li>
        );
      })}
    </NetworkListUl>
  );
});

export const ChainButton = /* @__PURE__ */ memo(function ChainButton(props: {
  confirming: boolean;
  switchingFailed: boolean;
  onClick: () => void;
  chain: Chain;
}) {
  const twLocale = useTWLocale();
  const { confirming, onClick, switchingFailed, chain } = props;
  const locale = twLocale.connectWallet.networkSelector;
  const activeChainId = useChainId();
  const chainName = <span>{chain.name} </span>;

  return (
    <NetworkButton
      data-active={activeChainId === chain.chainId}
      onClick={onClick}
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
  );
});

const TabButton = /* @__PURE__ */ (() =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  styled(Tabs.Trigger)((_) => {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_) => {
    const theme = useCustomTheme();
    return {
      color: theme.colors.secondaryText,
      position: "absolute",
      left: spacing.sm,
    };
  },
);

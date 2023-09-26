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
  ThemeObjectOrType,
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
import { Container, Line, noScrollBar } from "../../components/basic";
import { Text } from "../../components/text";
import { ModalTitle } from "../../components/modalElements";
import { CustomThemeProvider } from "../../design-system/CustomThemeProvider";
import { useTheme } from "@emotion/react";

type RenderChain = React.FC<{
  chain: Chain;
  switchChain: () => void;
  switching: boolean;
  switchFailed: boolean;
  close?: () => void;
}>;

export type NetworkSelectorProps = {
  theme: "dark" | "light" | Theme;
  onClose?: () => void;
  chains?: Chain[];
  popularChains?: Chain[];
  recentChains?: Chain[];
  renderChain?: RenderChain;
  onSwitch?: (chain: Chain) => void;
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

export const NetworkSelector: React.FC<NetworkSelectorProps> = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const themeFromContext = useTheme() as ThemeObjectOrType;
  const theme = props.theme || themeFromContext || "dark";
  const supportedChains = useSupportedChains();
  const chains = props.chains || supportedChains;

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
        open={true}
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
            <ModalTitle>Select Network</ModalTitle>
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
                  All
                </TabButton>
                <TabButton className="TabsTrigger" value="mainnet">
                  Mainnets
                </TabButton>
                <TabButton className="TabsTrigger" value="testnet">
                  Testnets
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
                      placeholder="Search Network or Chain ID"
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
              <Tabs.Content className="TabsContent" value="all">
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

              <Tabs.Content className="TabsContent" value="mainnet">
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

              <Tabs.Content className="TabsContent" value="testnet">
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
                    Add Custom Network
                  </Button>
                </Container>
              </>
            )}
          </Tabs.Root>
        </Container>
      </Modal>
    </CustomThemeProvider>
  );
};

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
  renderChain?: RenderChain;
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

  return (
    <ScrollContainer
      style={{
        height: "330px",
      }}
    >
      {recentChains.length > 0 && (
        <div>
          <SectionLabel>Recently Used</SectionLabel>
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
          <SectionLabel>Popular</SectionLabel>
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
          <SectionLabel>All Networks</SectionLabel>
          <Spacer y="sm" />
        </>
      )}

      <NetworkList
        chains={allChains}
        onSwitch={props.onSwitch}
        renderChain={props.renderChain}
        close={props.close}
      />
    </ScrollContainer>
  );
};

const NetworkList = /* @__PURE__ */ memo(function NetworkList(props: {
  chains: Chain[];
  onSwitch: (chain: Chain) => void;
  renderChain?: RenderChain;
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
        <Text>Loading</Text>
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
                          Confirm in Wallet
                        </Text>
                        <Spinner size="xs" color="accentText" />
                      </>
                    )}

                    {switchingFailed && (
                      <Text size="xs" color="danger">
                        Failed to Switch Network
                      </Text>
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

const TabButton = /* @__PURE__ */ styled(/* @__PURE__ */ Tabs.Trigger)<{
  theme?: Theme;
}>`
  all: unset;
  font-size: ${fontSize.sm};
  font-weight: 500;
  color: ${(p) => p.theme.colors.secondaryText};
  cursor: pointer;
  padding: ${spacing.sm} ${spacing.sm};
  -webkit-tap-highlight-color: transparent;
  border-radius: ${radius.lg};
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &[data-state="active"] {
    background: ${(p) => p.theme.colors.secondaryButtonBg};
    color: ${(p) => p.theme.colors.primaryText};
  }
`;

const SectionLabel = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  color: ${(p) => p.theme.colors.secondaryText};
  margin: 0;
  display: block;
  padding: 0 ${spacing.xs};
`;

const ScrollContainer = styled.div<{ theme?: Theme }>`
  box-sizing: border-box;
  overflow: auto;
  padding-bottom: ${spacing.lg};
  ${noScrollBar};
`;

const NetworkListUl = styled.ul<{ theme?: Theme }>`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  box-sizing: border-box;
`;

const NetworkButton = styled.button<{ theme?: Theme }>`
  all: unset;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${radius.md};
  cursor: pointer;
  transition: background 0.2s ease;
  color: ${(p) => p.theme.colors.primaryText};
  font-weight: 500;
  font-size: ${fontSize.md};
  &:hover {
    background: ${(p) => p.theme.colors.secondaryButtonBg};
  }

  ${media.mobile} {
    font-size: ${fontSize.sm};
  }
`;

const StyledMagnifyingGlassIcon = /* @__PURE__ */ styled(MagnifyingGlassIcon)<{
  theme?: Theme;
}>`
  color: ${(p) => p.theme.colors.secondaryText};
  position: absolute;
  left: ${spacing.sm};
`;

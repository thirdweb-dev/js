import { ThemeProvider } from "@emotion/react";
import { ChainIcon } from "../../components/ChainIcon";
import { Modal } from "../../components/Modal";
import { Spacer } from "../../components/Spacer";
import { Spinner } from "../../components/Spinner";
import { Input } from "../../components/formElements";
import {
  darkTheme,
  fontSize,
  iconSize,
  lightTheme,
  media,
  radius,
  spacing,
  Theme,
} from "../../design-system";
import { scrollbar } from "../../design-system/styles";
import styled from "@emotion/styled";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import {
  ThirdwebThemeContext,
  useChainId,
  useSupportedChains,
  useSwitchChain,
} from "@thirdweb-dev/react-core";
import {
  memo,
  useCallback,
  useContext,
  useDeferredValue,
  useMemo,
  useState,
} from "react";
import type { Chain } from "@thirdweb-dev/chains";
import Fuse from "fuse.js";
import { Button } from "../../components/buttons";
import { isMobile } from "../../evm/utils/isMobile";

type RenderChain = React.FC<{
  chain: Chain;
  switchChain: () => void;
  switching: boolean;
  switchFailed: boolean;
  close?: () => void;
}>;

export type NetworkSelectorProps = {
  theme?: "dark" | "light";
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
  const themeFromProvider = useContext(ThirdwebThemeContext);
  const theme = props.theme || themeFromProvider || "dark";
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
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <Modal
        open={true}
        setOpen={(value) => {
          if (!value && onClose) {
            onClose();
          }
        }}
        title="Select Network"
        style={{
          maxWidth: "480px",
          paddingBottom: props.onCustomClick ? spacing.md : "0px",
        }}
      >
        <Spacer y="xl" />

        <Tabs.Root className="TabsRoot" defaultValue="all">
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

          <Spacer y="lg" />

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

            <SearchInput
              style={{
                boxShadow: "none",
              }}
              tabIndex={isMobile() ? -1 : 0}
              variant="secondary"
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
                <Spinner size="md" color="link" />
              </div>
            )}
          </div>

          <Spacer y="lg" />

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

          {onCustomClick && (
            <>
              <Spacer y="sm" />
              <Button
                variant="link"
                onClick={() => {
                  onCustomClick();
                  if (onClose) {
                    onClose();
                  }
                }}
                style={{
                  display: "flex",
                  width: "100%",
                  fontSize: fontSize.sm,
                  boxShadow: "none",
                }}
              >
                Add Custom Network
              </Button>
            </>
          )}
        </Tabs.Root>
      </Modal>
    </ThemeProvider>
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

const NetworkList = memo(function NetworkList(props: {
  chains: Chain[];
  onSwitch: (chain: Chain) => void;
  renderChain?: RenderChain;
  close?: () => void;
}) {
  const switchChain = useSwitchChain();
  const activeChainId = useChainId();
  const [switchingChainId, setSwitchingChainId] = useState(-1);
  const [errorSwitchingChainId, setErrorSwitchingChainId] = useState(-1);

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
                  <div
                    style={{
                      display: "flex",
                      gap: spacing.xs,
                    }}
                  >
                    {confirming && (
                      <>
                        <ConfirmMessage>Confirm in Wallet</ConfirmMessage>
                        <Spinner size="sm" color="link" />
                      </>
                    )}

                    {switchingFailed && (
                      <ErrorMessage>
                        Error: Could not Switch Network
                      </ErrorMessage>
                    )}
                  </div>
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

const TabButton = styled(Tabs.Trigger)<{ theme?: Theme }>`
  all: unset;
  font-size: ${fontSize.md};
  font-weight: 500;
  color: ${(p) => p.theme.text.secondary};
  cursor: pointer;
  padding: ${spacing.sm} ${spacing.sm};
  -webkit-tap-highlight-color: transparent;
  border-radius: ${radius.lg};
  transition: background 0.2s ease, color 0.2s ease;
  &[data-state="active"] {
    background: ${(p) => p.theme.bg.elevated};
    color: ${(p) => p.theme.text.neutral};
  }
`;

const SectionLabel = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  color: ${(p) => p.theme.text.secondary};
  margin: 0;
`;

const ScrollContainer = styled.div<{ theme?: Theme }>`
  box-sizing: border-box;
  overflow: auto;
  padding-right: 10px;
  padding-bottom: ${spacing.lg};
  width: calc(100% + 16px);
  -webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
  ${(p) =>
    scrollbar({
      track: "transparent",
      thumb: p.theme.bg.elevated,
      hover: p.theme.bg.highlighted,
    })}
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
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.md};
  cursor: pointer;
  transition: background 0.2s ease;
  background: ${(p) => p.theme.bg.elevated};
  color: ${(p) => p.theme.text.neutral};
  font-weight: 600;
  font-size: ${fontSize.md};
  &:hover {
    background: ${(p) => p.theme.bg.highlighted};
  }

  ${media.mobile} {
    font-size: ${fontSize.sm};
  }
`;

const StyledMagnifyingGlassIcon = styled(MagnifyingGlassIcon)<{
  theme?: Theme;
}>`
  color: ${(p) => p.theme.text.secondary};
  position: absolute;
  left: 18px;
`;

const SearchInput = styled(Input)<{ theme?: Theme }>`
  padding: ${spacing.sm} ${spacing.md} ${spacing.sm} 60px;
`;

const ConfirmMessage = styled.div<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  color: ${(p) => p.theme.link.primary};
`;

const ErrorMessage = styled.div<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  color: ${(p) => p.theme.text.danger};
`;

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
import { scrollbar } from "../../design-system/styles";
import { useWalletRequiresConfirmation } from "../hooks/useCanSwitchNetwork";
import styled from "@emotion/styled";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import { Chain } from "@thirdweb-dev/chains";
import {
  useChainId,
  useSupportedChains,
  useSwitchChain,
} from "@thirdweb-dev/react-core";
import { useMemo, useState } from "react";

export const NetworkSelector: React.FC<{
  open: boolean;
  setOpen: (show: boolean) => void;
}> = (props) => {
  const chains = useSupportedChains();
  const [searchTerm, setSearchTerm] = useState("");

  const { testnets, mainnets, all } = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    const info = {
      testnets: [] as Chain[],
      mainnets: [] as Chain[],
      all: [] as Chain[],
    };

    for (const chain of chains) {
      if (chain.name.toLowerCase().includes(searchTermLower)) {
        if (chain.testnet) {
          info.testnets.push(chain);
        } else {
          info.mainnets.push(chain);
        }
        info.all.push(chain);
      }
    }

    return info;
  }, [chains, searchTerm]);

  const closeModal = () => {
    props.setOpen(false);
  };

  return (
    <Modal
      open={props.open}
      setOpen={props.setOpen}
      title="Select Network"
      style={{
        maxWidth: "480px",
        paddingBottom: "0px",
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <StyledMagnifyingGlassIcon width={iconSize.md} height={iconSize.md} />
          <SearchInput
            style={{
              boxShadow: "none",
            }}
            variant="secondary"
            placeholder="Search Networks"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        <Spacer y="lg" />

        <Tabs.Content className="TabsContent" value="all">
          <NetworkList chains={all} closeModal={closeModal} />
        </Tabs.Content>

        <Tabs.Content className="TabsContent" value="mainnet">
          <NetworkList chains={mainnets} closeModal={closeModal} />
        </Tabs.Content>

        <Tabs.Content className="TabsContent" value="testnet">
          <NetworkList chains={testnets} closeModal={closeModal} />
        </Tabs.Content>
      </Tabs.Root>
    </Modal>
  );
};

const NetworkList: React.FC<{
  chains: Chain[];
  closeModal: () => void;
}> = (props) => {
  const switchChain = useSwitchChain();
  const activeChainId = useChainId();
  const [confirmingChainId, setConfirmingChainId] = useState(-1);
  const [errorSwitchingChainId, setErrorSwitchingChainId] = useState(-1);
  const requiresConfirmation = useWalletRequiresConfirmation();

  return (
    <NetworkListUl>
      {props.chains.map((chain) => {
        const confirming = confirmingChainId === chain.chainId;
        const switchingFailed = errorSwitchingChainId === chain.chainId;

        const chainName = <span>{chain.name} </span>;

        return (
          <li key={chain.chainId}>
            <NetworkButton
              data-active={activeChainId === chain.chainId}
              onClick={async () => {
                setErrorSwitchingChainId(-1);

                if (requiresConfirmation) {
                  setConfirmingChainId(chain.chainId);
                }

                try {
                  await switchChain(chain.chainId);
                  props.closeModal();
                } catch (e: any) {
                  setErrorSwitchingChainId(chain.chainId);
                  console.error(e);
                } finally {
                  if (requiresConfirmation) {
                    setConfirmingChainId(-1);
                  }
                }
              }}
            >
              <ChainIcon
                chain={chain}
                size={iconSize.lg}
                active={activeChainId === chain.chainId}
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
};

const TabButton = styled(Tabs.Trigger)<{ theme?: Theme }>`
  all: unset;
  font-size: ${fontSize.md};
  font-weight: 500;
  color: ${(p) => p.theme.text.secondary};
  cursor: pointer;
  padding: ${spacing.sm} ${spacing.md};
  -webkit-tap-highlight-color: transparent;
  border-radius: ${radius.lg};
  transition: background 0.2s ease, color 0.2s ease;
  &[data-state="active"] {
    background: ${(p) => p.theme.bg.elevated};
    color: ${(p) => p.theme.text.neutral};
  }
`;

const NetworkListUl = styled.ul<{ theme?: Theme }>`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  max-height: 340px;
  min-height: 200px;
  overflow: auto;
  padding-right: 10px;
  padding-bottom: ${spacing.lg};
  width: calc(100% + 16px);
  box-sizing: border-box;
  -webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
  ${(p) =>
    scrollbar({
      track: "transparent",
      thumb: p.theme.bg.elevated,
      hover: p.theme.bg.highlighted,
    })}
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
  font-weight: 500;
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

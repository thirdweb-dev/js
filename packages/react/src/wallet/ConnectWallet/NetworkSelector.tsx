import { ChainIcon } from "../../components/ChainIcon";
import { Modal } from "../../components/Modal";
import { Spacer } from "../../components/Spacer";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  Theme,
} from "../../design-system";
import { scrollbar } from "../../design-system/styles";
import styled from "@emotion/styled";
import * as Tabs from "@radix-ui/react-tabs";
import { Chain } from "@thirdweb-dev/chains";
import {
  useActiveChainId,
  useSupportedChains,
  useSwitchChain,
} from "@thirdweb-dev/react-core";
import React, { useMemo } from "react";

export const NetworkSelector: React.FC<{
  open: boolean;
  setOpen: (show: boolean) => void;
}> = (props) => {
  const chains = useSupportedChains();

  const { testnets, mainnets, all } = useMemo(() => {
    return {
      testnets: chains.filter((c) => c.testnet),
      mainnets: chains.filter((c) => !c.testnet),
      all: chains,
    };
  }, [chains]);

  const closeModal = () => {
    props.setOpen(false);
  };

  return (
    <Modal
      open={props.open}
      setOpen={props.setOpen}
      title="Select Network"
      style={{
        maxWidth: "500px",
        paddingBottom: "0px",
      }}
    >
      <Spacer y="lg" />
      <Description>Choose a network to connect to</Description>
      <Spacer y="lg" />

      <Tabs.Root className="TabsRoot" defaultValue="all">
        <Tabs.List
          className="TabsList"
          aria-label="Manage your account"
          style={{
            display: "flex",
            gap: spacing.xs,
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

        <Tabs.Content className="TabsContent" value="all">
          <NetworkList chains={all} onNetworkSelect={closeModal} />
        </Tabs.Content>

        <Tabs.Content className="TabsContent" value="mainnet">
          <NetworkList chains={mainnets} onNetworkSelect={closeModal} />
        </Tabs.Content>

        <Tabs.Content className="TabsContent" value="testnet">
          <NetworkList chains={testnets} onNetworkSelect={closeModal} />
        </Tabs.Content>
      </Tabs.Root>
    </Modal>
  );
};

const NetworkList: React.FC<{
  chains: Chain[];
  onNetworkSelect: () => void;
}> = (props) => {
  const switchChain = useSwitchChain();
  const activeChainId = useActiveChainId();
  return (
    <NetworkListUl>
      {props.chains.map((chain) => (
        <li key={chain.chainId}>
          <NetworkButton
            onClick={() => {
              switchChain(chain.chainId);
              props.onNetworkSelect();
            }}
          >
            <div
              style={{
                position: "relative",
              }}
            >
              <ChainIcon
                chain={chain}
                size={iconSize.md}
                active={activeChainId === chain.chainId}
              />
              {/* active dot */}
            </div>
            <span>
              {chain.name}{" "}
              <NetworkShortName>
                ({chain.shortName.toUpperCase()})
              </NetworkShortName>
            </span>
          </NetworkButton>
        </li>
      ))}
    </NetworkListUl>
  );
};

const Description = styled.p<{ theme?: Theme }>`
  margin: 0;
  font-size: ${fontSize.md};
  color: ${(p) => p.theme.text.secondary};
`;

const TabButton = styled(Tabs.Trigger)<{ theme?: Theme }>`
  all: unset;
  font-size: ${fontSize.md};
  color: ${(p) => p.theme.text.secondary};
  cursor: pointer;
  padding: ${spacing.xs} ${spacing.sm};
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
  gap: ${spacing.sm};
  max-height: 330px;
  overflow: auto;
  padding-right: ${spacing.xs};
  padding-bottom: ${spacing.lg};
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
`;

const NetworkShortName = styled.span<{ theme?: Theme }>`
  color: ${(p) => p.theme.text.secondary};
  display: inline-block;
  font-size: ${fontSize.sm};
  font-weight: 500;
`;

import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Button } from "../../../components/buttons";
import { ErrorMessage, Label } from "../../../components/formElements";
import { FormField } from "../../../components/formFields";
import { ModalDescription } from "../../../components/modalElements";
import { iconSize, spacing, Theme, fontSize } from "../../../design-system";
import { useIsHeadlessWallet } from "../../hooks/useIsHeadlessWallet";
// import { Steps } from "../../../components/Steps";
import styled from "@emotion/styled";
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import {
  useChain,
  useChainId,
  useConnect,
  useConnectionStatus,
  useSupportedChains,
  useSwitchChain,
  useWallet,
} from "@thirdweb-dev/react-core";
import { SafeSupportedChainsSet } from "@thirdweb-dev/wallets";
import { utils } from "ethers";
import { useContext, useState } from "react";
import { SafeWalletConfig } from "./types";
import {
  Container,
  ModalHeader,
  ScreenBottomContainer,
} from "../../../components/basic";
import { Link, Text } from "../../../components/text";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";

export const gnosisAddressPrefixToChainId = {
  eth: 1,
  matic: 137,
  avax: 43114,
  bnb: 56,
  oeth: 10,
  gor: 5,
  "base-gor": 84531,
} as const;

export const SelectAccount: React.FC<{
  onBack: () => void;
  onConnect: () => void;
  safeWalletConfig: SafeWalletConfig;
  renderBackButton?: boolean;
}> = (props) => {
  const activeWallet = useWallet();
  const connect = useConnect();
  const activeChain = useChain();
  const connectedChainId = useChainId();

  const [safeAddress, setSafeAddress] = useState("");
  const [safeChainId, setSafeChainId] = useState(-1);

  const [safeConnectError, setSafeConnectError] = useState(false);
  const [switchError, setSwitchError] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  const connectionStatus = useConnectionStatus();
  const requiresConfirmation = !useIsHeadlessWallet();
  const chains = useSupportedChains();

  // put supported chains first
  const supportedChains = chains.filter((c) =>
    SafeSupportedChainsSet.has(c.chainId),
  );

  const selectedSafeChain = supportedChains.find(
    (c) => c.chainId === safeChainId,
  );

  const testnets = supportedChains.filter((c) => c.testnet);
  const mainnets = supportedChains.filter((c) => !c.testnet);

  // if there are more than one mainnet and testnet, group them
  const useOptGroup = mainnets.length > 0 && testnets.length > 0;

  const handleSubmit = async () => {
    if (!selectedSafeChain || !activeWallet || !activeChain) {
      return;
    }
    setSafeConnectError(false);

    try {
      await connect(props.safeWalletConfig, {
        chain: selectedSafeChain,
        personalWallet: activeWallet,
        safeAddress,
      });
      props.onConnect();
    } catch (e) {
      console.error(e);
      setSafeConnectError(true);
    }
  };

  const mismatch = safeChainId !== -1 && connectedChainId !== safeChainId;

  const isValidAddress = utils.isAddress(safeAddress);
  const disableNetworkSelection = supportedChains.length === 1;

  const switchChain = useSwitchChain();
  const modalConfig = useContext(ModalConfigCtx);

  return (
    <Container fullHeight flex="column" scrollY>
      <form
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Container p="lg">
          <ModalHeader
            title={props.safeWalletConfig.meta.name}
            onBack={props.renderBackButton ? props.onBack : undefined}
            imgSrc={props.safeWalletConfig.meta.iconURL}
          />
        </Container>

        <Container
          expand
          flex="column"
          p="lg"
          scrollY
          style={{
            paddingTop: 0,
          }}
        >
          <Spacer y="md" />

          <Text color="primaryText" size="lg" weight={500}>
            Enter your safe details
          </Text>
          <Spacer y="sm" />

          <ModalDescription>
            You can find your safe address in{" "}
            <Link
              inline
              target="_blank"
              href="https://app.safe.global/home"
              style={{
                display: "inline",
                whiteSpace: "nowrap",
              }}
            >
              Safe Dashboard
            </Link>
          </ModalDescription>

          <Spacer y="xl" />

          {/* Select Safe Address */}
          <FormField
            name="safeAddress"
            id="safeAddress"
            errorMessage={
              safeAddress && !isValidAddress
                ? "Invalid Safe Address"
                : undefined
            }
            autocomplete="on"
            onChange={(value) => {
              setSafeConnectError(false);
              if (value.length > 4) {
                const prefix = value.split(":")[0];

                if (prefix && prefix in gnosisAddressPrefixToChainId) {
                  setSafeChainId(
                    gnosisAddressPrefixToChainId[
                      prefix as keyof typeof gnosisAddressPrefixToChainId
                    ],
                  );
                  setSafeAddress(value.slice(prefix.length + 1));
                } else {
                  setSafeAddress(value);
                }
              } else {
                setSafeAddress(value);
              }
            }}
            label="Safe Address"
            type="text"
            value={safeAddress}
            required
            placeholder="0x123..."
          />

          <Spacer y="lg" />

          {/* Select Safe Netowrk */}
          <Label htmlFor="safeNetwork">Safe Network</Label>
          <Spacer y="sm" />
          <div
            style={{
              position: "relative",
            }}
          >
            <NetworkSelect
              data-error={supportedChains.length === 0}
              required
              name="safeNetwork"
              id="safeNetwork"
              value={safeChainId}
              disabled={disableNetworkSelection}
              placeholder="Network your safe is deployed to"
              onChange={(e) => {
                setSafeConnectError(false);
                setSwitchError(false);
                setSafeChainId(Number(e.target.value));
              }}
            >
              {!disableNetworkSelection && (
                <option value="" hidden>
                  Network your safe is deployed to
                </option>
              )}

              {useOptGroup ? (
                <>
                  <optgroup label="Mainnets">
                    {mainnets.map((chain) => {
                      return (
                        <option value={chain.chainId} key={chain.chainId}>
                          {chain.name}
                        </option>
                      );
                    })}
                  </optgroup>

                  <optgroup label="Testnets">
                    {testnets.map((chain) => {
                      return (
                        <option value={chain.chainId} key={chain.chainId}>
                          {chain.name}
                        </option>
                      );
                    })}
                  </optgroup>
                </>
              ) : (
                supportedChains.map((chain) => {
                  return (
                    <option value={chain.chainId} key={chain.chainId}>
                      {chain.name}
                    </option>
                  );
                })
              )}
            </NetworkSelect>

            {!disableNetworkSelection && (
              <StyledChevronDownIcon
                width={iconSize.sm}
                height={iconSize.sm}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: spacing.sm,
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>

          <Spacer y="sm" />

          {supportedChains.length === 0 && (
            <>
              <Spacer y="sm" />
              <ErrorMessage>
                {" "}
                Can not use Safe: No Safe supported chains are configured in App
              </ErrorMessage>
              <Spacer y="sm" />
            </>
          )}

          {safeConnectError && (
            <Text
              size="xs"
              multiline
              color="danger"
              style={{
                display: "flex",
                gap: spacing.sm,
                alignItems: "center",
              }}
            >
              <ExclamationTriangleIcon
                width={iconSize.sm}
                height={iconSize.sm}
              />
              <span>
                Could not connect to Safe. <br />
                Make sure safe address and network are correct.
              </span>
            </Text>
          )}

          {switchError && (
            <Text color="danger" size="sm">
              <Container flex="row" gap="sm" center="y">
                <ExclamationTriangleIcon
                  width={iconSize.sm}
                  height={iconSize.sm}
                />
                Failed to switch network
              </Container>
            </Text>
          )}
        </Container>

        <ScreenBottomContainer
          style={{
            borderTop: modalConfig.modalSize === "wide" ? "none" : undefined,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {mismatch ? (
                <Button
                  type="button"
                  variant="inverted"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.sm,
                    width:
                      modalConfig.modalSize === "compact" ? "100%" : undefined,
                  }}
                  onClick={async () => {
                    if (!activeWallet) {
                      throw new Error("No active wallet");
                    }
                    setSafeConnectError(false);
                    setSwitchError(false);
                    setSwitchingNetwork(true);
                    try {
                      await switchChain(safeChainId);
                    } catch (e) {
                      setSwitchError(true);
                    } finally {
                      setSwitchingNetwork(false);
                    }
                  }}
                >
                  {" "}
                  {switchingNetwork ? "Switching" : "Switch Network"}
                  {switchingNetwork && <Spinner size="sm" color="base1" />}
                </Button>
              ) : (
                <Button
                  variant="accent"
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.sm,
                    width:
                      modalConfig.modalSize === "compact" ? "100%" : undefined,
                  }}
                >
                  {connectionStatus === "connecting"
                    ? "Connecting"
                    : "Connect to Safe"}
                  {connectionStatus === "connecting" && (
                    <Spinner size="sm" color="primaryText" />
                  )}
                </Button>
              )}
            </div>

            {switchingNetwork && requiresConfirmation && (
              <>
                <Spacer y="md" />
                <Container
                  flex="row"
                  style={
                    modalConfig.modalSize === "compact"
                      ? {
                          justifyContent: "center",
                        }
                      : {
                          justifyContent: "flex-end",
                        }
                  }
                >
                  <Text size="sm" color="accentText">
                    {" "}
                    Confirm in your wallet{" "}
                  </Text>
                </Container>
              </>
            )}
          </div>
        </ScreenBottomContainer>
      </form>
    </Container>
  );
};

const NetworkSelect = styled.select<{ theme?: Theme }>`
  width: 100%;
  padding: ${spacing.sm};
  box-sizing: border-box;
  outline: none;
  border: none;
  border-radius: 6px;
  color: ${(p) => p.theme.colors.primaryText};
  background: none;
  font-size: ${fontSize.md};
  box-shadow: 0 0 0 1.5px ${(p) => p.theme.colors.base3};
  appearance: none;

  &:focus {
    box-shadow: 0 0 0 2px ${(p) => p.theme.colors.accentText};
  }

  &:invalid {
    color: ${(p) => p.theme.colors.secondaryText};
  }
  &[data-error="true"] {
    box-shadow: 0 0 0 1.5px ${(p) => p.theme.colors.danger};
  }

  &[disabled] {
    opacity: 1;
    cursor: not-allowed;
  }
`;

const StyledChevronDownIcon = /* @__PURE__ */ styled(ChevronDownIcon)<{
  theme?: Theme;
}>`
  color: ${(p) => p.theme.colors.secondaryText};
`;

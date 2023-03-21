import styled from "@emotion/styled";
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import {
  useActiveChain,
  useChainId,
  useConnect,
  useConnectionStatus,
  useSupportedChains,
  useWallet,
} from "@thirdweb-dev/react-core";
import { SafeSupportedChainsSet } from "@thirdweb-dev/wallets";
import { useState } from "react";
import { Button } from "../../../../components/buttons";
import { ErrorMessage, Label } from "../../../../components/formElements";
import { FormField } from "../../../../components/formFields";
import { Img } from "../../../../components/Img";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
  HelperLink,
} from "../../../../components/modalElements";
import { Spacer } from "../../../../components/Spacer";
import { Spinner } from "../../../../components/Spinner";
import {
  iconSize,
  spacing,
  media,
  Theme,
  fontSize,
} from "../../../../design-system";
import { useWalletRequiresConfirmation } from "../../../hooks/useCanSwitchNetwork";
import { SafeWallet } from "../../../wallets";
import { Steps } from "./Steps";

export const SafeForm: React.FC<{
  onBack: () => void;
}> = (props) => {
  const activeWallet = useWallet();
  const connect = useConnect();
  const activeChain = useActiveChain();
  const connectedChainId = useChainId();

  const [safeAddress, setSafeAddress] = useState("");
  const [safeChainId, setSafeChainId] = useState(-1);

  const [safeConnectError, setSafeConnectError] = useState(false);
  const [switchError, setSwitchError] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  const connectionStatus = useConnectionStatus();
  const requiresConfirmation = useWalletRequiresConfirmation();
  const _supportedChains = useSupportedChains();

  // put supported chains first
  const supportedChains = _supportedChains.sort((a, b) => {
    if (SafeSupportedChainsSet.has(a.chainId)) {
      return -1;
    }
    if (SafeSupportedChainsSet.has(b.chainId)) {
      return 1;
    }
    return 0;
  });

  const selectedSafeChain = supportedChains.find(
    (c) => c.chainId === safeChainId,
  );

  const handleSubmit = async () => {
    if (!selectedSafeChain || !activeWallet || !activeChain) {
      return;
    }
    setSafeConnectError(false);

    try {
      await connect(SafeWallet, {
        chain: selectedSafeChain,
        personalWallet: activeWallet,
        safeAddress,
      });
    } catch (e) {
      console.error(e);
      setSafeConnectError(true);
    }
  };

  const mismatch = safeChainId !== -1 && connectedChainId !== safeChainId;

  return (
    <>
      <BackButton onClick={props.onBack} />
      <IconContainer>
        <Img
          src={SafeWallet.meta.iconURL}
          width={iconSize.xl}
          height={iconSize.xl}
        />
      </IconContainer>
      <Spacer y="lg" />

      <ModalTitle>Enter your Safe Address & Network </ModalTitle>
      <Spacer y="md" />

      <Desc>
        You can find your safe address through your{" "}
        <HelperLink
          target="_blank"
          href="https://app.safe.global/home"
          style={{
            fontSize: "inherit",
            display: "inline",
          }}
        >
          Safe Dashboard
        </HelperLink>
      </Desc>

      <Spacer y="lg" />
      <Steps step={2} />

      <Spacer y="xl" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Select Safe Address */}
        <FormField
          name="safeAddress"
          id="safeAddress"
          autocomplete="on"
          onChange={(value) => {
            setSafeConnectError(false);
            setSafeAddress(value);
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
        <Spacer y="xs" />
        <div
          style={{
            position: "relative",
          }}
        >
          <NetworkSelect
            required
            name="safeNetwork"
            id="safeNetwork"
            value={safeChainId}
            placeholder="Select Network your safe is deployed to"
            onChange={(e) => {
              setSafeConnectError(false);
              setSwitchError(false);
              setSafeChainId(Number(e.target.value));
            }}
          >
            <option value="" hidden>
              Select network your safe is deployed on
            </option>
            {supportedChains.map((chain) => {
              const isSupported = SafeSupportedChainsSet.has(chain.chainId);
              return (
                <option
                  value={chain.chainId}
                  disabled={!isSupported}
                  key={chain.chainId}
                >
                  {chain.name}
                </option>
              );
            })}
          </NetworkSelect>
          {
            <ChevronDownIcon
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
          }
        </div>

        <Spacer y="sm" />

        {safeConnectError && (
          <ErrorMessage
            style={{
              display: "flex",
              gap: spacing.sm,
              alignItems: "center",
              fontSize: fontSize.sm,
            }}
          >
            <ExclamationTriangleIcon width={iconSize.sm} height={iconSize.sm} />
            <span>
              Could not connect to Safe. <br />
              Make sure safe address and network are correct.
            </span>
          </ErrorMessage>
        )}

        {switchError && (
          <ErrorMessage
            style={{
              display: "flex",
              gap: spacing.sm,
              alignItems: "center",
              fontSize: fontSize.sm,
            }}
          >
            <ExclamationTriangleIcon width={iconSize.sm} height={iconSize.sm} />
            <span>Failed to switch network.</span>
          </ErrorMessage>
        )}

        <Spacer y="xl" />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {mismatch ? (
            <Button
              type="button"
              variant="secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
              }}
              onClick={async () => {
                if (!activeWallet) {
                  throw new Error("No active wallet");
                }
                setSafeConnectError(false);
                setSwitchError(false);
                setSwitchingNetwork(true);
                try {
                  await activeWallet.switchChain(safeChainId);
                } catch (e) {
                  setSwitchError(true);
                } finally {
                  setSwitchingNetwork(false);
                }
              }}
            >
              {" "}
              {switchingNetwork ? "Switching" : "Switch Network"}
              {switchingNetwork && <Spinner size="sm" color="primary" />}
            </Button>
          ) : (
            <Button
              variant="inverted"
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              {connectionStatus === "connecting"
                ? "Connecting"
                : "Connect to Safe"}
              {connectionStatus === "connecting" && (
                <Spinner size="sm" color="inverted" />
              )}
            </Button>
          )}
        </div>
        {switchingNetwork && requiresConfirmation && (
          <ConfirmMessage> Confirm in your wallet </ConfirmMessage>
        )}
      </form>
    </>
  );
};

const ConfirmMessage = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  color: ${(p) => p.theme.link.primary};
  text-align: right;
`;

const NetworkSelect = styled.select<{ theme?: Theme }>`
  width: 100%;
  padding: ${spacing.sm};
  box-sizing: border-box;
  outline: none;
  border: none;
  border-radius: 6px;
  color: ${(p) => p.theme.text.neutral};
  background: transparent;
  font-size: ${fontSize.md};
  box-shadow: 0 0 0 1.5px ${(p) => p.theme.input.outline};
  appearance: none;

  &:focus {
    box-shadow: 0 0 0 2px ${(p) => p.theme.input.focusRing};
  }

  &:invalid {
    color: ${(p) => p.theme.text.secondary};
  }
`;

const IconContainer = styled.div`
  display: flex;
  margin-top: ${spacing.lg};
  ${media.mobile} {
    justify-content: center;
    margin-top: 0;
  }
`;

const Desc = styled(ModalDescription)`
  ${media.mobile} {
    padding: 0 ${spacing.lg};
  }
`;

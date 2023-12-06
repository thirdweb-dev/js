import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Button } from "../../../components/buttons";
import { Label } from "../../../components/formElements";
import { FormField } from "../../../components/formFields";
import { ModalDescription } from "../../../components/modalElements";
import { iconSize, spacing, fontSize } from "../../../design-system";
import styled from "@emotion/styled";
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import {
  ConnectUIProps,
  WalletConfig,
  useSupportedChains,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { SafeSupportedChainsSet, SafeWallet } from "@thirdweb-dev/wallets";
import { utils } from "ethers";
import { useContext, useState } from "react";
import { Container, Line, ModalHeader } from "../../../components/basic";
import { Link, Text } from "../../../components/text";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { safeSlugToChainId } from "./safeChainSlug";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { StyledSelect } from "../../../design-system/elements";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";

export const SelectAccount: React.FC<{
  onBack: () => void;
  onConnect: () => void;
  renderBackButton?: boolean;
  connect: ConnectUIProps<SafeWallet>["connect"];
  connectionStatus: ConnectUIProps<SafeWallet>["connectionStatus"];
  meta: WalletConfig["meta"];
}> = (props) => {
  const locale = useTWLocale().wallets.safeWallet.accountDetailsScreen;
  const { personalWalletConnection } = useWalletContext();
  const { activeWallet, connectedChainId, switchChain } =
    personalWalletConnection;
  const { connect, connectionStatus } = props;

  const [safeAddress, setSafeAddress] = useState("");
  const [safeChainId, setSafeChainId] = useState(-1);

  const [safeConnectError, setSafeConnectError] = useState(false);
  const [switchError, setSwitchError] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

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
    if (!selectedSafeChain || !activeWallet) {
      return;
    }
    setSafeConnectError(false);

    try {
      await connect({
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
            title={props.meta.name}
            onBack={props.renderBackButton ? props.onBack : undefined}
            imgSrc={props.meta.iconURL}
          />
        </Container>

        <Line />

        <Container
          expand
          flex="column"
          p="lg"
          scrollY
          style={{
            paddingTop: 0,
          }}
        >
          <Spacer y="xl" />

          <Text color="primaryText" size="lg" weight={500}>
            {locale.title}
          </Text>
          <Spacer y="sm" />

          <ModalDescription>
            {locale.findSafeAddressIn}{" "}
            <Link
              inline
              target="_blank"
              href="https://app.safe.global/home"
              style={{
                display: "inline",
                whiteSpace: "nowrap",
              }}
            >
              {locale.dashboardLink}
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

                if (prefix && prefix in safeSlugToChainId) {
                  setSafeChainId(
                    safeSlugToChainId[prefix as keyof typeof safeSlugToChainId],
                  );
                  setSafeAddress(value.slice(prefix.length + 1));
                } else {
                  setSafeAddress(value);
                }
              } else {
                setSafeAddress(value);
              }
            }}
            label={locale.safeAddress}
            type="text"
            value={safeAddress}
            required
            placeholder="0x123..."
          />

          <Spacer y="lg" />

          {/* Select Safe Network */}
          <Label htmlFor="safeNetwork">{locale.network}</Label>
          <Spacer y="sm" />
          <div
            style={{
              position: "relative",
            }}
          >
            <NetworkSelect
              data-error={supportedChains.length === 0 || safeConnectError}
              required
              name="safeNetwork"
              id="safeNetwork"
              value={safeChainId}
              disabled={disableNetworkSelection}
              placeholder={locale.selectNetworkPlaceholder}
              onChange={(e) => {
                setSafeConnectError(false);
                setSwitchError(false);
                setSafeChainId(Number(e.target.value));
              }}
            >
              {!disableNetworkSelection && (
                <option value="" hidden>
                  {locale.selectNetworkPlaceholder}
                </option>
              )}

              {useOptGroup ? (
                <>
                  <optgroup label={locale.mainnets}>
                    {mainnets.map((chain) => {
                      return (
                        <option value={chain.chainId} key={chain.chainId}>
                          {chain.name}
                        </option>
                      );
                    })}
                  </optgroup>

                  <optgroup label={locale.testnets}>
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
              <Text color="danger" multiline size="xs">
                {" "}
                {locale.invalidChainConfig}
              </Text>
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
              <span>{locale.failedToConnect}</span>
            </Text>
          )}

          {switchError && (
            <Text color="danger" size="sm">
              <Container flex="row" gap="sm" center="y">
                <ExclamationTriangleIcon
                  width={iconSize.sm}
                  height={iconSize.sm}
                />
                {locale.failedToSwitch}
              </Container>
            </Text>
          )}
        </Container>

        <Container
          p="lg"
          flex="row"
          style={{
            paddingTop: 0,
            justifyContent: "flex-end",
          }}
        >
          {mismatch ? (
            <Button
              type="button"
              variant="primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
                width: modalConfig.modalSize === "compact" ? "100%" : undefined,
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
              {switchingNetwork
                ? locale.switchingNetwork
                : locale.switchNetwork}
              {switchingNetwork && (
                <Spinner size="sm" color="primaryButtonText" />
              )}
            </Button>
          ) : (
            <Button
              variant="accent"
              type="submit"
              disabled={connectionStatus === "connecting"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
                width: modalConfig.modalSize === "compact" ? "100%" : undefined,
              }}
            >
              {connectionStatus === "connecting"
                ? locale.connecting
                : locale.connectToSafe}
              {connectionStatus === "connecting" && (
                <Spinner size="sm" color="accentButtonText" />
              )}
            </Button>
          )}
        </Container>
      </form>
    </Container>
  );
};

const NetworkSelect = /* @__PURE__ */ StyledSelect(() => {
  const theme = useCustomTheme();
  return {
    width: "100%",
    padding: spacing.sm,
    boxSizing: "border-box",
    outline: "none",
    border: "none",
    borderRadius: "6px",
    color: theme.colors.primaryText,
    background: "none",
    fontSize: fontSize.md,
    boxShadow: `0 0 0 1.5px ${theme.colors.secondaryButtonBg}`,
    appearance: "none",
    "&:focus": {
      boxShadow: `0 0 0 2px ${theme.colors.accentText}`,
    },
    "&:invalid": {
      color: theme.colors.secondaryText,
    },
    "&[data-error='true']": {
      boxShadow: `0 0 0 1.5px ${theme.colors.danger}`,
    },
    "&[disabled]": {
      opacity: 1,
      cursor: "not-allowed",
    },
  };
});

const StyledChevronDownIcon = /* @__PURE__ */ styled(ChevronDownIcon)(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.secondaryText,
  };
});

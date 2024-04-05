/* eslint-disable i18next/no-literal-string */
import { ChevronDownIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import styled from "@emotion/styled";
import {
  NATIVE_TOKEN,
  type ERC20OrNativeToken,
  isNativeToken,
} from "./nativeToken";
import type { TokenInfo } from "../defaultTokens";
import { NetworkSelectorContent, ChainButton } from "../NetworkSelector";
import { ChainIcon, fallbackChainIcon } from "../../../components/ChainIcon";
import { Skeleton } from "../../../components/Skeleton";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { TokenIcon } from "../../../components/TokenIcon";
import { Container, ModalHeader, Line } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Input } from "../../../components/formElements";
import { iconSize, fontSize, spacing } from "../../../design-system";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import type { Chain } from "@thirdweb-dev/chains";
import { Text } from "../../../components/text";
import { formatTokenBalance } from "../../utils/formatTokenBalance";
import { useChainQuery } from "../../hooks/useChainQuery";
import { useMultiChainBalance } from "../../hooks/useMultiChainBalance";

/**
 *
 * @internal
 */
export function TokenSelector(props: {
  onTokenSelect: (token: ERC20OrNativeToken) => void;
  onBack: () => void;
  tokenList: TokenInfo[];
  chainId: number;
  chainSelection?: {
    chains: Chain[];
    select: (chain: Chain) => void;
  };
}) {
  const [screen, setScreen] = useState<"base" | "select-chain">("base");
  const [input, setInput] = useState("");
  const chainQuery = useChainQuery(props.chainId);

  // if input is undefined, it loads the native token
  // otherwise it loads the token with given address
  const tokenQuery = useMultiChainBalance({
    tokenAddress: input,
    chainId: props.chainId,
  });

  const locale = useTWLocale().connectWallet.sendFundsScreen;

  let tokenList = props.tokenList;

  if (tokenQuery.data && input) {
    tokenList = [
      {
        ...tokenQuery.data,
        icon: "",
        address: input,
      },
      ...tokenList,
    ];
  }

  const filteredList = input
    ? tokenList.filter((t) => {
        const inputStr = input.toLowerCase();
        return (
          t.name.toLowerCase().includes(inputStr) ||
          t.symbol.toLowerCase().includes(inputStr) ||
          t.address.includes(input)
        );
      })
    : tokenList;

  const { chainSelection } = props;

  if (screen === "select-chain" && chainSelection) {
    return (
      <NetworkSelectorContent
        showTabs={false}
        onBack={() => setScreen("base")}
        // pass swap supported chains
        open={true}
        chains={chainSelection.chains}
        // closeModal={() => setScreen("base")}
        renderChain={(renderChainProps) => {
          return (
            <ChainButton
              chain={renderChainProps.chain}
              confirming={false}
              switchingFailed={false}
              onClick={() => {
                chainSelection.select(renderChainProps.chain);
                setScreen("base");
              }}
            />
          );
        }}
      />
    );
  }

  return (
    <Container
      animate="fadein"
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={locale.selectTokenTitle} />
      </Container>

      <Line />

      <Container
        scrollY
        style={{
          maxHeight: "450px",
        }}
      >
        <Spacer y="md" />

        {props.chainSelection && (
          <>
            <Container px="lg">
              <Text size="sm">Select Network</Text>
              <Spacer y="xxs" />
              <SelectTokenBtn
                fullWidth
                variant="secondary"
                onClick={() => {
                  setScreen("select-chain");
                }}
              >
                <ChainIcon
                  chain={chainQuery.data}
                  size={iconSize.lg}
                  fallbackImage={fallbackChainIcon}
                />

                {chainQuery.data ? (
                  <Text color="primaryText" size="sm">
                    {" "}
                    {chainQuery.data.name}
                  </Text>
                ) : (
                  <Skeleton height={fontSize.md} />
                )}

                <ChevronDownIcon
                  width={iconSize.sm}
                  height={iconSize.sm}
                  style={{
                    marginLeft: "auto",
                  }}
                />
              </SelectTokenBtn>
              <Spacer y="xl" />
              <Text size="sm">Select Token</Text>
            </Container>
          </>
        )}

        <Container px="lg">
          <Spacer y="xs" />
          <Input
            placeholder={locale.searchToken}
            variant="outline"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </Container>

        <Spacer y="md" />

        {(filteredList.length > 0 || !input) && (
          <Container
            flex="column"
            gap="xs"
            px="lg"
            scrollY
            style={{
              paddingTop: 0,
              paddingBottom: spacing.lg,
              // maxHeight: props.chainSelection ? "300px" : "400px",
            }}
          >
            {!input && (
              <SelectTokenButton
                onClick={() => {
                  props.onTokenSelect(NATIVE_TOKEN);
                }}
                chainId={props.chainId}
                token={NATIVE_TOKEN}
              />
            )}

            {filteredList.map((token) => {
              return (
                <SelectTokenButton
                  onClick={() => props.onTokenSelect(token)}
                  token={token}
                  key={token.address}
                  chainId={props.chainId}
                />
              );
            })}
          </Container>
        )}

        {filteredList.length === 0 && tokenQuery.isLoading && (
          <Container
            animate="fadein"
            p="lg"
            flex="column"
            gap="md"
            center="both"
            style={{
              minHeight: "200px",
              paddingTop: 0,
            }}
            color="secondaryText"
          >
            <Spinner size="lg" color="accentText" />
          </Container>
        )}

        {filteredList.length === 0 && !tokenQuery.isLoading && input && (
          <Container
            animate="fadein"
            p="lg"
            flex="column"
            gap="md"
            center="both"
            style={{
              minHeight: "200px",
              paddingTop: 0,
            }}
            color="secondaryText"
          >
            <CrossCircledIcon width={iconSize.lg} height={iconSize.lg} />
            {locale.noTokensFound}
          </Container>
        )}

        <Spacer y="md" />
      </Container>
    </Container>
  );
}

function SelectTokenButton(props: {
  // token?: TokenInfo;
  token: ERC20OrNativeToken;
  chainId: number;
  onClick: () => void;
}) {
  const tokenBalanceQuery = useMultiChainBalance({
    tokenAddress: isNativeToken(props.token) ? undefined : props.token.address,
    chainId: props.chainId,
  });

  const tokenName = isNativeToken(props.token)
    ? tokenBalanceQuery.data?.name
    : props.token.name;

  return (
    <SelectTokenBtn fullWidth variant="secondary" onClick={props.onClick}>
      <TokenIcon token={props.token} chainId={props.chainId} size="lg" />

      <Container flex="column" gap="xxs">
        {tokenName ? (
          <Text size="sm" color="primaryText">
            {tokenName}
          </Text>
        ) : (
          <Skeleton height={fontSize.md} width="150px" />
        )}

        {tokenBalanceQuery.data ? (
          <Text size="xs"> {formatTokenBalance(tokenBalanceQuery.data)}</Text>
        ) : (
          <Skeleton height={fontSize.xs} width="100px" />
        )}
      </Container>
    </SelectTokenBtn>
  );
}

const SelectTokenBtn = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.walletSelectorButtonHoverBg,
    justifyContent: "flex-start",
    gap: spacing.sm,
    padding: spacing.sm,
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
      transform: "scale(1.01)",
    },
    transition: "background 200ms ease, transform 150ms ease",
  };
});

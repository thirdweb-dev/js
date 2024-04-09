import styled from "@emotion/styled";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { Chain } from "../../../../../chains/types.js";
import { useWalletBalance } from "../../../../core/hooks/others/useWalletBalance.js";
import { useWalletConnectionCtx } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/wallet-hooks.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { TokenIcon } from "../../components/TokenIcon.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Input } from "../../components/formElements.js";
import { Text } from "../../components/text.js";
import { useCustomTheme } from "../../design-system/CustomThemeProvider.js";
import { fontSize, iconSize, spacing } from "../../design-system/index.js";
import type { TokenInfo } from "../defaultTokens.js";
import {
  type ERC20OrNativeToken,
  NATIVE_TOKEN,
  isNativeToken,
} from "./nativeToken.js";

/**
 *
 * @internal
 */
export function TokenSelector(props: {
  onTokenSelect: (token: ERC20OrNativeToken) => void;
  onBack: () => void;
  tokenList: TokenInfo[];
  chain: Chain;
}) {
  const [input, setInput] = useState("");
  const activeAccount = useActiveAccount();
  const chain = props.chain;

  // if input is undefined, it loads the native token
  // otherwise it loads the token with given address
  const tokenQuery = useWalletBalance({
    address: activeAccount?.address,
    chain: chain,
    tokenAddress: input,
  });

  const locale = useWalletConnectionCtx().connectLocale.sendFundsScreen;

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

  return (
    <Container
      animate="fadein"
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={locale.selectTokenTitle} />
        <Spacer y="xl" />
        <Input
          placeholder={locale.searchToken}
          variant="outline"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
      </Container>

      {(filteredList.length > 0 || !input) && (
        <Container
          flex="column"
          gap="xs"
          p="md"
          scrollY
          style={{
            paddingTop: 0,
            paddingBottom: spacing.lg,
            maxHeight: "400px",
          }}
        >
          {!input && (
            <SelectTokenButton
              onClick={() => {
                props.onTokenSelect(NATIVE_TOKEN);
              }}
              chain={props.chain}
              token={NATIVE_TOKEN}
            />
          )}

          {filteredList.map((token) => {
            return (
              <SelectTokenButton
                onClick={() => props.onTokenSelect(token)}
                token={token}
                key={token.address}
                chain={props.chain}
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
    </Container>
  );
}

function SelectTokenButton(props: {
  // token?: TokenInfo;
  token: ERC20OrNativeToken;
  chain: Chain;
  onClick: () => void;
}) {
  const account = useActiveAccount();
  const tokenBalanceQuery = useWalletBalance({
    address: account?.address,
    chain: props.chain,
    tokenAddress: isNativeToken(props.token) ? undefined : props.token.address,
  });

  const tokenName = isNativeToken(props.token)
    ? tokenBalanceQuery.data?.name
    : props.token.name;

  return (
    <SelectTokenBtn fullWidth variant="secondary" onClick={props.onClick}>
      <TokenIcon token={props.token} chain={props.chain} size="lg" />

      <Container flex="column" gap="xs">
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
    background: "transparent",
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

/**
 * @internal
 * @param balanceData
 * @returns
 */
export function formatTokenBalance(
  balanceData: {
    symbol: string;
    name: string;
    decimals: number;
    displayValue: string;
  },
  showSymbol = true,
) {
  return (
    Number(balanceData.displayValue).toFixed(3) +
    (showSymbol ? ` ${balanceData.symbol}` : "")
  );
}

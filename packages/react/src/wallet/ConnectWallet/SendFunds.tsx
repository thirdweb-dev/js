import { useMemo, useState } from "react";
import { Spacer } from "../../components/Spacer";
import { Container, ModalHeader } from "../../components/basic";
import { Button } from "../../components/buttons";
import { Input, Label } from "../../components/formElements";
import {
  useBalance,
  useChain,
  useChainId,
  useWallet,
} from "@thirdweb-dev/react-core";
import { ChainIcon } from "../../components/ChainIcon";
import { fontSize, iconSize, spacing } from "../../design-system";
import { Text } from "../../components/text";
import { Skeleton } from "../../components/Skeleton";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "../../components/Spinner";
import { TransactionResult } from "@thirdweb-dev/sdk";
import { ModalTitle } from "../../components/modalElements";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { utils } from "ethers";
import { SupportedTokens, TokenInfo, defaultTokens } from "./defaultTokens";
import { Img } from "../../components/Img";
import styled from "@emotion/styled";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useTWLocale } from "../../evm/providers/locale-provider";
import { StyledDiv } from "../../design-system/elements";
import { useCustomTheme } from "../../design-system/CustomThemeProvider";

// TODO - use a better way to fetch token Info instead of useBalance

type TXError = Error & { data?: { message?: string } };

export function SendFunds(props: { supportedTokens: SupportedTokens }) {
  const [screen, setScreen] = useState<"base" | "tokenSelector">("base");

  const chainId = useChainId();
  let defaultToken: TokenInfo | undefined = undefined;
  if (
    // if we know chainId
    chainId &&
    // if there is a list of tokens for this chain
    props.supportedTokens[chainId] &&
    // if the list of tokens is not the default list
    props.supportedTokens[chainId] !== defaultTokens[chainId]
  ) {
    // use the first token in the list as default selected
    const tokensForChain = props.supportedTokens[chainId];
    const firstToken = tokensForChain && tokensForChain[0];
    if (firstToken) {
      defaultToken = firstToken;
    }
  }

  const [token, setToken] = useState<TokenInfo | undefined>(defaultToken);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("0");

  if (screen === "tokenSelector") {
    return (
      <TokenSelector
        supportedTokens={props.supportedTokens}
        onBack={() => {
          setScreen("base");
        }}
        onTokenSelect={(_token) => {
          setToken(_token);
          setScreen("base");
        }}
      />
    );
  }

  return (
    <SendFundsForm
      token={token}
      onTokenSelect={() => {
        setScreen("tokenSelector");
      }}
      receiverAddress={receiverAddress}
      setReceiverAddress={setReceiverAddress}
      amount={amount}
      setAmount={setAmount}
    />
  );
}

export function SendFundsForm(props: {
  onTokenSelect: () => void;
  token?: TokenInfo;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
}) {
  const locale = useTWLocale().connectWallet.sendFundsScreen;
  const tokenAddress = props.token?.address;
  const balanceQuery = useBalance(tokenAddress);

  const { receiverAddress, setReceiverAddress, amount, setAmount } = props;

  const chain = useChain();
  const chainId = useChainId();
  const wallet = useWallet();

  // Ethereum or Rinkeby or Goerli
  const isENSSupported = chainId === 1 || chainId === 5 || chainId === 4;

  const isValidReceiverAddress = useMemo(() => {
    const isENS = receiverAddress.endsWith(".eth");

    if (!isENSSupported && isENS) {
      return false;
    }

    return isENS || utils.isAddress(receiverAddress);
  }, [receiverAddress, isENSSupported]);

  const showInvalidAddressError = receiverAddress && !isValidReceiverAddress;

  const sendTokenMutation = useMutation<TransactionResult | undefined, TXError>(
    async () => {
      if (!wallet) {
        return;
      }

      return wallet.transfer(receiverAddress, amount, tokenAddress);
    },
  );

  function getErrorMessage(error?: TXError) {
    const message = error?.data?.message || error?.message;

    if (!message) {
      return locale.transactionFailed;
    }

    if (message.includes("user rejected")) {
      return locale.transactionRejected;
    }

    if (message.includes("insufficient funds")) {
      return locale.insufficientFunds;
    }

    return locale.transactionFailed;
  }

  if (sendTokenMutation.isError) {
    return (
      <Container p="lg" animate="fadein">
        <ModalHeader
          title={locale.title}
          onBack={() => {
            sendTokenMutation.reset();
          }}
        />
        <Spacer y="xl" />
        <Container
          flex="column"
          gap="lg"
          animate="fadein"
          center="both"
          style={{
            minHeight: "200px",
          }}
          color="danger"
        >
          <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
          <Text color="danger">{getErrorMessage(sendTokenMutation.error)}</Text>
        </Container>
      </Container>
    );
  }

  if (sendTokenMutation.isSuccess) {
    return (
      <Container p="lg" animate="fadein">
        <ModalHeader
          title={locale.title}
          onBack={() => {
            sendTokenMutation.reset();
          }}
        />
        <Container
          flex="column"
          gap="lg"
          animate="fadein"
          center="both"
          style={{
            minHeight: "250px",
          }}
          color="success"
        >
          <CheckCircledIcon width={iconSize.xl} height={iconSize.xl} />
          <Text color="success"> {locale.successMessage} </Text>
        </Container>
      </Container>
    );
  }

  const tokenName = props.token?.name || balanceQuery?.data?.name;
  const tokenSymbol = props.token?.symbol || balanceQuery.data?.symbol;

  return (
    <Container p="lg" animate="fadein">
      <ModalTitle>{locale.title}</ModalTitle>
      <Spacer y="xl" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Token  */}
        <Label htmlFor="token" color="secondaryText">
          {locale.token}
        </Label>
        <Spacer y="sm" />
        <Button
          id="token"
          variant="outline"
          fullWidth
          style={{
            justifyContent: "flex-start",
            gap: spacing.sm,
            padding: spacing.sm,
          }}
          onClick={props.onTokenSelect}
        >
          {props.token ? (
            <Img
              src={props.token.icon}
              width={iconSize.lg}
              height={iconSize.lg}
            />
          ) : (
            <ChainIcon chain={chain} size={iconSize.lg} />
          )}

          <Container flex="column" gap="xs">
            {tokenName ? (
              <Text size="sm" color="primaryText">
                {tokenName}
              </Text>
            ) : (
              <Skeleton height={fontSize.xs} width="150px" />
            )}

            {balanceQuery.data ? (
              <Text size="xs">{formatBalance(balanceQuery.data)}</Text>
            ) : (
              <Skeleton height={fontSize.xs} width="100px" />
            )}
          </Container>
        </Button>

        <Spacer y="lg" />

        {/* Send to  */}
        <Label htmlFor="receiever" color="secondaryText">
          {locale.sendTo}
        </Label>
        <Spacer y="sm" />
        <Input
          data-error={showInvalidAddressError}
          required
          id="receiever"
          placeholder={isENSSupported ? `0x... / ENS name` : "0x..."}
          variant="outline"
          value={receiverAddress}
          onChange={(e) => {
            setReceiverAddress(e.target.value);
          }}
        />

        {showInvalidAddressError && (
          <>
            <Spacer y="xs" />
            <Text color="danger" size="sm">
              {locale.invalidAddress}
            </Text>
          </>
        )}

        <Spacer y="lg" />

        {/* Amount  */}
        <Label htmlFor="amount" color="secondaryText">
          {locale.amount}
        </Label>
        <Spacer y="sm" />
        <Container relative>
          <Input
            required
            type="number"
            id="amount"
            variant="outline"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          <CurrencyBadge>
            <Text size="xs"> {tokenSymbol} </Text>
          </CurrencyBadge>
        </Container>

        <Spacer y="xxl" />

        {/* Submit */}
        <Button
          fullWidth
          variant="accent"
          type="submit"
          onClick={async () => {
            if (!receiverAddress || !wallet || !amount) {
              return;
            }

            await sendTokenMutation.mutateAsync();
          }}
          style={{
            alignItems: "center",
            gap: spacing.sm,
            padding: spacing.md,
          }}
        >
          {sendTokenMutation.isLoading ? locale.sending : locale.submitButton}
          {sendTokenMutation.isLoading && (
            <Spinner size="sm" color="accentButtonText" />
          )}
        </Button>
      </form>
    </Container>
  );
}

function useNativeToken(): TokenInfo | undefined {
  const balanceQuery = useBalance();
  const chain = useChain();

  if (balanceQuery.data) {
    return {
      name: balanceQuery.data.name,
      symbol: balanceQuery.data.symbol,
      address: NATIVE_TOKEN_ADDRESS,
      icon: chain?.icon?.url || "",
    };
  }
}

function useToken(tokenAddress: string): {
  isLoading: boolean;
  data: TokenInfo | undefined;
} {
  const balanceQuery = useBalance(tokenAddress);
  const chain = useChain();

  if (!utils.isAddress(tokenAddress)) {
    return {
      isLoading: false,
      data: undefined,
    };
  }

  if (balanceQuery.isLoading) {
    return {
      isLoading: true,
      data: undefined,
    };
  }

  if (balanceQuery.data) {
    return {
      isLoading: false,
      data: {
        name: balanceQuery.data.name,
        symbol: balanceQuery.data.symbol,
        address: tokenAddress,
        icon: chain?.icon?.url || "",
      },
    };
  }

  return {
    isLoading: false,
    data: undefined,
  };
}

export function TokenSelector(props: {
  onTokenSelect: (token?: TokenInfo) => void;
  onBack: () => void;
  supportedTokens: SupportedTokens;
}) {
  const [input, setInput] = useState("");
  const chainId = useChainId();
  const nativeTokenInfo = useNativeToken();
  const { data: foundToken, isLoading: findingToken } = useToken(input);
  const locale = useTWLocale().connectWallet.sendFundsScreen;

  let tokenList = (chainId ? props.supportedTokens[chainId] : undefined) || [];

  if (nativeTokenInfo) {
    tokenList = [nativeTokenInfo, ...tokenList];
  }

  if (foundToken) {
    tokenList = [foundToken, ...tokenList];
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
    <Container animate="fadein">
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

      {filteredList.length > 0 && (
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
          {filteredList.map((token) => {
            return (
              <SelectTokenButton
                onClick={() => props.onTokenSelect(token)}
                token={token}
                key={token.address}
              />
            );
          })}
        </Container>
      )}

      {findingToken && (
        <Container
          animate="fadein"
          p="lg"
          flex="column"
          gap="md"
          center="both"
          style={{
            minHeight: "150px",
            paddingTop: 0,
          }}
          color="secondaryText"
        >
          <Spinner size="lg" color="accentText" />
        </Container>
      )}

      {filteredList.length === 0 && !findingToken && (
        <Container
          animate="fadein"
          p="lg"
          flex="column"
          gap="md"
          center="both"
          style={{
            minHeight: "150px",
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

function SelectTokenButton(props: { token?: TokenInfo; onClick: () => void }) {
  const balanceQuery = useBalance(props.token?.address);
  const chain = useChain();
  const tokenName = props.token?.name || balanceQuery.data?.name;

  return (
    <SelectTokenBtn fullWidth variant="secondary" onClick={props.onClick}>
      {/* icon */}
      {props.token?.icon ? (
        <Img width={iconSize.lg} height={iconSize.lg} src={props.token.icon} />
      ) : (
        <ChainIcon chain={chain} size={iconSize.lg} />
      )}

      <Container flex="column" gap="xs">
        {tokenName ? (
          <Text size="sm" color="primaryText">
            {tokenName}
          </Text>
        ) : (
          <Skeleton height={fontSize.md} width="150px" />
        )}

        {balanceQuery.data ? (
          <Text size="xs"> {formatBalance(balanceQuery.data)}</Text>
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

function formatBalance(balanceData: {
  symbol: string;
  name: string;
  decimals: number;
  displayValue: string;
}) {
  return Number(balanceData.displayValue).toFixed(3) + " " + balanceData.symbol;
}

const CurrencyBadge = /* @__PURE__ */ StyledDiv({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  right: spacing.sm,
});

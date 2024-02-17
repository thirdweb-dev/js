import { CrossCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { useState, useMemo } from "react";
import { useTWLocale } from "../../../providers/locale-provider.js";
import { ChainIcon } from "../../components/ChainIcon.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Label, Input } from "../../components/formElements.js";
import { useCustomTheme } from "../../design-system/CustomThemeProvider.js";
import { StyledDiv } from "../../design-system/elements.js";
import { iconSize, spacing, fontSize } from "../../design-system/index.js";
import {
  type SupportedTokens,
  defaultTokens,
  type TokenInfo,
} from "../defaultTokens.js";
import {
  useActiveAccount,
  useActiveWalletChainId,
} from "../../../providers/wallet-provider.js";
import { useWalletBalance } from "../../../hooks/others/useWalletBalance.js";
import { isAddress } from "viem";
import { Text } from "../../components/text.js";
import { useChainQuery } from "../../../hooks/others/useChainQuery.js";
import styled from "@emotion/styled";
import { useSendToken } from "../../hooks/useSendToken.js";

type TXError = Error & { data?: { message?: string } };

/**
 * @internal
 */
export function SendFunds(props: {
  supportedTokens: SupportedTokens;
  onBack: () => void;
}) {
  const [screen, setScreen] = useState<"base" | "tokenSelector">("base");
  const chainIdBigNum = useActiveWalletChainId();
  const chainId = chainIdBigNum ? Number(chainIdBigNum) : undefined;

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
      onBack={props.onBack}
    />
  );
}

/**
 * @internal
 */
export function SendFundsForm(props: {
  onTokenSelect: () => void;
  token?: TokenInfo;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  onBack: () => void;
}) {
  const locale = useTWLocale().connectWallet.sendFundsScreen;
  const tokenAddress = props.token?.address;
  const chainId = useActiveWalletChainId();
  const activeAccount = useActiveAccount();

  const balanceQuery = useWalletBalance({
    chain: chainId,
    tokenAddress,
    account: activeAccount,
  });

  const chainQuery = useChainQuery(chainId);

  const { receiverAddress, setReceiverAddress, amount, setAmount } = props;

  // Ethereum or Rinkeby or Goerli
  // TODO support ens
  const isENSSupported = false;

  const isValidReceiverAddress = useMemo(() => {
    const isENS = receiverAddress.endsWith(".eth");

    if (!isENSSupported && isENS) {
      return false;
    }

    return isENS || isAddress(receiverAddress);
  }, [receiverAddress, isENSSupported]);

  const showInvalidAddressError = receiverAddress && !isValidReceiverAddress;

  const sendTokenMutation = useSendToken();

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
      <ModalHeader title={locale.title} onBack={props.onBack} />
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
          ) : !chainQuery.data ? (
            <Skeleton height={iconSize.lg} width={iconSize.lg} />
          ) : (
            <ChainIcon chain={chainQuery.data} size={iconSize.lg} />
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
            if (!receiverAddress || !amount) {
              return;
            }

            await sendTokenMutation.mutateAsync({
              receiverAddress,
              amount,
              tokenAddress: props.token?.address,
            });
          }}
          style={{
            alignItems: "center",
            gap: spacing.sm,
            padding: spacing.md,
          }}
        >
          {sendTokenMutation.isPending ? locale.sending : locale.submitButton}
          {sendTokenMutation.isPending && (
            <Spinner size="sm" color="accentButtonText" />
          )}
        </Button>
      </form>
    </Container>
  );
}

/**
 *
 * @internal
 */
export function TokenSelector(props: {
  onTokenSelect: (token?: TokenInfo) => void;
  onBack: () => void;
  supportedTokens: SupportedTokens;
}) {
  const [input, setInput] = useState("");
  const chainIdBigNum = useActiveWalletChainId();
  const chainId = chainIdBigNum ? Number(chainIdBigNum) : undefined;

  // if input is undefined, it loads the native token
  // otherwise it loads the token with given address
  const tokenQuery = useActiveWalletBalance(input);

  const locale = useTWLocale().connectWallet.sendFundsScreen;
  const chainQuery = useChainQuery(chainIdBigNum);

  let tokenList = (chainId ? props.supportedTokens[chainId] : undefined) || [];

  if (tokenQuery.data) {
    tokenList = [
      // native or found token
      {
        ...tokenQuery.data,
        icon: chainQuery.data?.icon?.url || "",
        address: input,
      },
      ...tokenList,
    ];
  }

  const findingToken = input && tokenQuery.isLoading;

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

      {(findingToken ||
        (filteredList.length === 0 && tokenQuery.isLoading)) && (
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

      {filteredList.length === 0 && !tokenQuery.isLoading && (
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
  const balanceQuery = useActiveWalletBalance(props.token?.address);
  const chainId = useActiveWalletChainId();
  const chainQuery = useChainQuery(chainId);
  const tokenName = props.token?.name || balanceQuery.data?.name;

  return (
    <SelectTokenBtn fullWidth variant="secondary" onClick={props.onClick}>
      {/* icon */}
      {props.token?.icon ? (
        <Img width={iconSize.lg} height={iconSize.lg} src={props.token.icon} />
      ) : chainQuery.data ? (
        <ChainIcon chain={chainQuery.data} size={iconSize.lg} />
      ) : (
        <Skeleton height={iconSize.lg} width={iconSize.lg} />
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

function useActiveWalletBalance(tokenAddress?: string) {
  const chainId = useActiveWalletChainId();
  const activeAccount = useActiveAccount();
  return useWalletBalance({
    chain: chainId,
    tokenAddress,
    account: activeAccount,
  });
}

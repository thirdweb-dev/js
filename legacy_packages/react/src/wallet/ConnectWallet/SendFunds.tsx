import { useMemo, useState } from "react";
import { Spacer } from "../../components/Spacer";
import { Container, ModalHeader } from "../../components/basic";
import { Button } from "../../components/buttons";
import { Input, Label } from "../../components/formElements";
import { Spinner } from "../../components/Spinner";
import { CrossCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { Skeleton } from "../../components/Skeleton";
import { useMutation } from "@tanstack/react-query";
import { StyledDiv } from "../../design-system/elements";
import { iconSize, spacing, fontSize } from "../../design-system";
import { type SupportedTokens, defaultTokens } from "./defaultTokens";
import { Text } from "../../components/text";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "./nativeToken";
import { useTWLocale } from "../../evm/providers/locale-provider";
import { useWallet, type TransactionResult } from "@thirdweb-dev/react-core";
import { utils } from "ethers";
import { TokenIcon } from "../../components/TokenIcon";
import { formatTokenBalance } from "../utils/formatTokenBalance";
import { TokenSelector } from "./screens/TokenSelector";
import { useMultiChainBalance } from "../hooks/useMultiChainBalance";

type TXError = Error & { data?: { message?: string } };

/**
 * @internal
 */
export function SendFunds(props: {
  supportedTokens: SupportedTokens;
  onBack: () => void;
  chainId: number;
}) {
  const [screen, setScreen] = useState<"base" | "tokenSelector">("base");
  const chainId = props.chainId;

  let defaultToken: ERC20OrNativeToken = NATIVE_TOKEN;
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

  const [token, setToken] = useState<ERC20OrNativeToken>(defaultToken);

  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("0");

  const tokenList = props.supportedTokens[chainId] || [];

  if (screen === "tokenSelector") {
    return (
      <TokenSelector
        tokenList={tokenList}
        onBack={() => {
          setScreen("base");
        }}
        onTokenSelect={(_token) => {
          setToken(_token);
          setScreen("base");
        }}
        chainId={chainId}
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
      chainId={chainId}
    />
  );
}

/**
 * @internal
 */
function SendFundsForm(props: {
  onTokenSelect: () => void;
  token: ERC20OrNativeToken;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  onBack: () => void;
  chainId: number;
}) {
  const locale = useTWLocale().connectWallet.sendFundsScreen;
  const wallet = useWallet();

  const tokenAddress =
    props.token && "address" in props.token ? props.token.address : undefined;

  const balanceQuery = useMultiChainBalance({
    tokenAddress,
    chainId: props.chainId,
  });

  const { receiverAddress, setReceiverAddress, amount, setAmount } = props;

  // Ethereum or Rinkeby or Goerli
  // TODO support ens

  const isValidReceiverAddress = useMemo(() => {
    return utils.isAddress(receiverAddress);
  }, [receiverAddress]);

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

  const tokenName =
    (props.token && "name" in props.token ? props.token.name : undefined) ||
    balanceQuery?.data?.name;

  const tokenSymbol =
    (props.token && "symbol" in props.token ? props.token.symbol : undefined) ||
    balanceQuery?.data?.symbol;

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
          <TokenIcon token={props.token} chainId={props.chainId} size="lg" />

          <Container flex="column" gap="xs">
            {tokenName ? (
              <Text size="sm" color="primaryText">
                {tokenName}
              </Text>
            ) : (
              <Skeleton height={fontSize.xs} width="150px" />
            )}

            {balanceQuery.data ? (
              <Text size="xs">{formatTokenBalance(balanceQuery.data)}</Text>
            ) : (
              <Skeleton height={fontSize.xs} width="100px" />
            )}
          </Container>
        </Button>

        <Spacer y="lg" />

        {/* Send to  */}
        <Label htmlFor="receiver" color="secondaryText">
          {locale.sendTo}
        </Label>
        <Spacer y="sm" />
        <Input
          data-error={showInvalidAddressError}
          required
          id="receiver"
          placeholder={"0x..."}
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

const CurrencyBadge = /* @__PURE__ */ StyledDiv({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  right: spacing.sm,
});

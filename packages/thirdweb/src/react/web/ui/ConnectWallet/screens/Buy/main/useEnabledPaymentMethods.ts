import type { Chain } from "../../../../../../../chains/types.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import type { PayUIOptions } from "../../../ConnectButtonProps.js";
import { type ERC20OrNativeToken, isNativeToken } from "../../nativeToken.js";
import type { SupportedChainAndTokens } from "../swap/useSwapSupportedChains.js";

// Based on what toToken, toChain, and supportedDestinations are, determine which payment methods should be enabled
// change the current method if it should be disabled
// return whether the payment selection should be shown or not ( if only one payment method is enabled, don't show the selection )

export function useEnabledPaymentMethods(options: {
  payOptions: PayUIOptions;
  supportedDestinations: SupportedChainAndTokens;
  toChain: Chain;
  toToken: ERC20OrNativeToken;
}) {
  const { payOptions, supportedDestinations, toChain, toToken } = options;

  function getEnabledPayMethodsForSelectedToken(): {
    fiat: boolean;
    swap: boolean;
  } {
    const chain = supportedDestinations.find((c) => c.chain.id === toChain.id);
    if (!chain) {
      return {
        fiat: true,
        swap: true,
      };
    }

    const toTokenAddress = isNativeToken(toToken)
      ? NATIVE_TOKEN_ADDRESS
      : toToken.address;

    const tokenInfo = chain.tokens.find(
      (t) => t.address.toLowerCase() === toTokenAddress.toLowerCase(),
    );

    if (!tokenInfo) {
      return {
        fiat: true,
        swap: true,
      };
    }

    return {
      fiat: tokenInfo.buyWithFiatEnabled,
      swap: tokenInfo.buyWithCryptoEnabled,
    };
  }

  const { fiat, swap } = getEnabledPayMethodsForSelectedToken();

  const buyWithFiatEnabled = payOptions.buyWithFiat !== false && fiat;
  const buyWithCryptoEnabled = payOptions.buyWithCrypto !== false && swap;

  const showPaymentSelection = buyWithFiatEnabled && buyWithCryptoEnabled;

  return {
    buyWithFiatEnabled,
    buyWithCryptoEnabled,
    showPaymentSelection,
  };
}

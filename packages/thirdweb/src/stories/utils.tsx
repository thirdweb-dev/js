import { generatePrivateKey } from "viem/accounts";
import { createWalletAdapter } from "../adapters/wallet-adapter.js";
import { ethereum } from "../chains/chain-definitions/ethereum.js";
import { createThirdwebClient } from "../client/client.js";
import type { ERC20OrNativeToken } from "../react/web/ui/ConnectWallet/screens/nativeToken.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import { privateKeyToAccount } from "../wallets/private-key.js";

export const storyClient = createThirdwebClient({
  clientId: "cebdc2fa8aaa0170af42dc92b0ca34d8", // can only be used on localhost:6006
});

export const storyAccount: Account = privateKeyToAccount({
  client: storyClient,
  privateKey: generatePrivateKey(),
});

export const storyWallet = createWalletAdapter({
  adaptedAccount: storyAccount,
  client: storyClient,
  chain: ethereum,
  onDisconnect: () => {},
  switchChain: () => {},
});

export function StoryScreenTitle(props: {
  label: string;
  large?: boolean;
}) {
  return (
    <p
      style={{
        marginTop: "40px",
        marginBottom: "14px",
        background: "#222",
        color: "white",
        borderRadius: "8px",
        display: "inline-block",
        padding: "8px 12px",
        fontSize: props.large ? "18px" : "14px",
      }}
    >
      {" "}
      {props.label}{" "}
    </p>
  );
}

export const noop = () => {};

export function Row(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
      }}
    >
      {props.children}
    </div>
  );
}

export const usdcPolygon: ERC20OrNativeToken = {
  name: "USD Coin",
  symbol: "USDC",
  address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  icon: "https://pay.thirdweb.com/public/tokens/usdc.svg",
};

export const usdcBase: ERC20OrNativeToken = {
  name: "USD Coin",
  symbol: "USDC",
  address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  icon: "https://pay.thirdweb.com/public/tokens/usdc.svg",
};

export const usdtPolygon: ERC20OrNativeToken = {
  name: "Tether USD (PoS)",
  address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  symbol: "USDT",
  icon: "	https://polygonscan.com/token/images/tether_32.png",
};

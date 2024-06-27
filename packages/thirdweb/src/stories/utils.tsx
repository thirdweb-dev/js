import { generatePrivateKey } from "viem/accounts";
import { createThirdwebClient } from "../client/client.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import { privateKeyToAccount } from "../wallets/private-key.js";

export const storyClient = createThirdwebClient({
  clientId: "cebdc2fa8aaa0170af42dc92b0ca34d8", // can only be used on localhost:6006
});

export const storyAccount: Account = privateKeyToAccount({
  client: storyClient,
  privateKey: generatePrivateKey(),
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

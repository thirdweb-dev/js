import { LoginPayload, ThirdwebAuth, VerifyOptions } from "../core";
import { ThirdwebProviderConfig } from "./types";
import CredentialsProvider from "next-auth/providers/credentials";

export function ThirdwebProvider(cfg: ThirdwebProviderConfig) {
  const auth = new ThirdwebAuth(cfg.wallet, cfg.domain);

  return CredentialsProvider({
    name: "ThirdwebAuth",
    credentials: {
      payload: {
        label: "Payload",
        type: "text",
        placeholder: "",
      },
    },
    async authorize({ payload }: any) {
      try {
        const parsedPayload: LoginPayload = JSON.parse(payload);
        const verifyOptions: VerifyOptions = {
          statement: cfg.authOptions?.statement,
          uri: cfg.authOptions?.uri,
          version: cfg.authOptions?.version,
          chainId: cfg.authOptions?.chainId,
          resources: cfg.authOptions?.resources,
          validateNonce: async (nonce: string) => {
            if (cfg.authOptions?.validateNonce) {
              await cfg.authOptions?.validateNonce(nonce);
            }
          },
        };

        const address = await auth.verify(parsedPayload, verifyOptions);

        return { id: address, address: address };
      } catch (err) {
        return null;
      }
    },
  });
}

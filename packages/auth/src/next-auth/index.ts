import { LoginPayload, ThirdwebAuth, VerifyOptions } from "../core";
import { ThirdwebProviderConfig } from "./types";
import { EthersWallet } from "@thirdweb-dev/wallets/evm/wallets/ethers";
import { ethers } from "ethers";
import { Awaitable, Session } from "next-auth/core/types";
import { JWT } from "next-auth/jwt/types";
import CredentialsProvider from "next-auth/providers/credentials";

export function ThirdwebAuthProvider(cfg: ThirdwebProviderConfig) {
  const wallet = new EthersWallet(ethers.Wallet.createRandom());
  const auth = new ThirdwebAuth(wallet, cfg.domain);

  return CredentialsProvider({
    name: "Credentials",
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

        return { id: address };
      } catch (err) {
        return null;
      }
    },
  });
}

export function authSession(params: {
  session: Session;
  token: JWT;
}): Awaitable<Session> {
  if (params.token.sub && ethers.utils.isAddress(params.token.sub)) {
    params.session.user = {
      ...params.session.user,
      address: params.token.sub,
    };
  }

  return params.session;
}

import { ThirdwebAuthConfig } from "./types";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export function ThirdwebAuth(cfg: ThirdwebAuthConfig) {
  const sdk = ThirdwebSDK.fromPrivateKey(cfg.privateKey, "mainnet");

  const ThirdwebProvider = (req: NextApiRequest, res: NextApiResponse) =>
    CredentialsProvider({
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
          const parsed = JSON.parse(payload);
          const token = await sdk.auth.generateAuthToken(
            "thirdweb.com",
            parsed
          );
          const address = await sdk.auth.authenticate("thirdweb.com", token);

          // Securely set httpOnly cookie on request to prevent XSS on frontend
          // And set path to / to enable thirdweb_auth_token usage on all endpoints
          res.setHeader(
            "Set-Cookie",
            serialize("thirdweb_auth_token", token, {
              path: "/",
              httpOnly: true,
              secure: true,
              sameSite: "strict",
            })
          );

          return { address };
        } catch (err) {
          return null;
        }
      },
    });

  const authOptions = (req: NextApiRequest, res: NextApiResponse) =>
    ({
      callbacks: {
        async session({ session }) {
          const token = req.cookies.thirdweb_auth_token || "";
          try {
            const address = await sdk.auth.authenticate("thirdweb.com", token);
            session.user = { ...session.user, address } as Session["user"];
            return session;
          } catch {
            return session;
          }
        },
      },
      events: {
        signOut() {
          res.setHeader(
            "Set-Cookie",
            serialize("thirdweb_auth_token", "", {
              path: "/",
              expires: new Date(Date.now() + 5 * 1000),
            })
          );
        },
      },
    } as Omit<NextAuthOptions, "providers">);

  return {
    ThirdwebProvider,
    authOptions,
  };
}

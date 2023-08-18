import { AuthProvider } from "@paperxyz/embedded-wallet-service-sdk";

export async function prePaperAuth(args: {
  authenticationMethod: AuthProvider;
  email: string;
}) {
  // TODO: Add tracking here
  Promise.resolve(args);
}

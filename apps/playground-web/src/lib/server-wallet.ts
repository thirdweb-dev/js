import "server-only";
import { Engine } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { THIRDWEB_CLIENT } from "./client";

const BACKEND_WALLET_ADDRESS = process.env.ENGINE_BACKEND_WALLET as string;
const ENGINE_VAULT_ACCESS_TOKEN = process.env
  .ENGINE_VAULT_ACCESS_TOKEN as string;

export const SERVER_WALLET = Engine.serverWallet({
  address: BACKEND_WALLET_ADDRESS,
  client: THIRDWEB_CLIENT,
  vaultAccessToken: ENGINE_VAULT_ACCESS_TOKEN,
  chain: sepolia,
});

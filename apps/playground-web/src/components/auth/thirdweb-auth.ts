import { THIRDWEB_CLIENT } from "@/lib/client";
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY || "";

// if (!privateKey) {
//   throw new Error(
//     "Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file. " + typeof window,
//   );
// }

export const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  adminAccount: privateKeyToAccount({ client: THIRDWEB_CLIENT, privateKey }),
});

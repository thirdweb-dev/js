import { THIRDWEB_CLIENT } from "@/lib/client";
import { getDomain } from "@/lib/constants";
import { SERVER_WALLET } from "@/lib/server-wallet";

import { Login } from "thirdweb";

export const { GET, POST } = Login.Server.toNextJsHandler(
  Login.Server.createAuthHandler({
    client: THIRDWEB_CLIENT,
    domain: getDomain() ?? "",
    serverWallet: SERVER_WALLET,
  }),
);

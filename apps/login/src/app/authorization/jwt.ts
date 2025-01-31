"server only";

import "server-only";
import { createThirdwebClient } from "thirdweb";
import { verifyEOASignature } from "thirdweb/auth";
import { decodeJWT, encodeJWT, stringify } from "thirdweb/utils";
import { privateKeyToAccount, randomPrivateKey } from "thirdweb/wallets";

const client = createThirdwebClient({
  clientId: "e9ba48c289e0cc3d06a23bfd370cc111",
});
const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY || randomPrivateKey();

if (!privateKey) {
  throw new Error("Missing THIRDWEB_ADMIN_PRIVATE_KEY");
}

const serverAccount = privateKeyToAccount({
  client,
  privateKey: privateKey,
});

export async function signJWT(data: {
  address: string;
  sessionKeySignerAddress: string;
  code: string;
}) {
  "use server";
  return await encodeJWT({
    account: serverAccount,
    payload: {
      iss: serverAccount.address,
      sub: data.address,
      aud: data.sessionKeySignerAddress,
      exp: new Date(Date.now() + 1000 * 60 * 60),
      nbf: new Date(),
      iat: new Date(),
      jti: data.code,
    },
  });
}

export async function verifyJWT(jwt: string) {
  const { payload, signature } = decodeJWT(jwt);

  console.log("payload", payload);
  console.log("signature", signature);
  // verify the signature
  const verified = await verifyEOASignature({
    message: stringify(payload),
    signature,
    address: serverAccount.address,
  });
  if (!verified) {
    throw new Error("Invalid JWT signature");
  }
  return payload;
}

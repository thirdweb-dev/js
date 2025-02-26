import { exportJWK } from "jose";
import { NextResponse } from "next/server";
import { getKeyInfo } from "../../../lib/keys";

export async function GET() {
  const { publicKey, kid } = await getKeyInfo();

  // Convert to JWK
  const jwk = await exportJWK(publicKey);

  // Add the kid to the JWK
  jwk.kid = kid;

  return NextResponse.json({
    // Return the JWK as array of keys (today only the one key exists)
    keys: [jwk],
  });
}

import type { OpenAPIV3 } from "openapi-types";
import { isProd } from "../../../../lib/env";

export async function getBridgePaths() {
  const thirdwebDomain = !isProd ? "thirdweb-dev" : "thirdweb";
  const res = await fetch(`https://bridge.${thirdwebDomain}.com/openapi.json`);
  const openapiJson = (await res.json()) as OpenAPIV3.Document;
  return Object.entries(openapiJson.paths).filter(
    ([, pathObj]) =>
      pathObj?.get?.deprecated === undefined ||
      pathObj?.get?.deprecated === false,
  );
}

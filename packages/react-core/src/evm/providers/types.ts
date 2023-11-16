import type { QueryClientProviderProps } from "../../core/providers/query-client";
import type { ThirdwebAuthConfig } from "../contexts/thirdweb-auth";
import type { Chain } from "@thirdweb-dev/chains";
import type { SDKOptions } from "@thirdweb-dev/sdk/internal/react-core";
import type { IThirdwebStorage } from "@thirdweb-dev/storage";
import type { Signer } from "ethers";

export interface ThirdwebSDKProviderProps<TChains extends Chain[]>
  extends QueryClientProviderProps {
  /**
   * Chains to support. If not provided, will default to the chains supported by the SDK.
   */
  supportedChains?: TChains;
  // a possible signer - optional, defaults to undefined
  signer?: Signer;

  /**
   * The {@link SDKOptions | Thirdweb SDK Options} to pass to the thirdweb SDK
   * comes with sensible defaults
   */
  sdkOptions?: Omit<SDKOptions, "chains">;
  /**
   * The storage interface to use with the sdk.
   */
  storageInterface?: IThirdwebStorage;
  /**
   * The configuration used for thirdweb auth usage. Enables users to login
   * to backends with their wallet.
   */
  authConfig?: ThirdwebAuthConfig;

  /**
   * The network to use for the SDK.
   */
  activeChain?:
    | TChains[number]["chainId"]
    // allow number as well but autocomplete will only show chainId
    // eslint-disable-next-line @typescript-eslint/ban-types
    | (number & {})
    | TChains[number]["slug"]
    // allow string as well but autocomplete will only show chain slug
    // eslint-disable-next-line @typescript-eslint/ban-types
    | (string & {})
    | Chain;

  // client Id for thirdweb services
  clientId?: string;

  // pass in a secret key when doing server side rendering
  secretKey?: string;
}

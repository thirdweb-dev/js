import { type providers } from "ethers";
import { fetchAbiFromAddress } from "../common/metadata-resolver";
import { Address } from "../schema/shared/Address";
import { NFT_BASE_CONTRACT_ROLES } from "./contractRoles";
import { type ThirdwebStorage } from "@thirdweb-dev/storage";
import { TokenErc20ContractSchema } from "../schema/contracts/token-erc20";
import { getSignerAndProvider } from "../constants/urls";
import { prebuiltContractTypes } from "./prebuiltContractTypes";
import { InitializeParams } from "./InitializeParams";

export const TokenInitializer = {
  name: "TokenERC20" as const,
  contractType: prebuiltContractTypes.token,
  schema: TokenErc20ContractSchema,
  roles: NFT_BASE_CONTRACT_ROLES,
  initialize: async (
    ...[network, address, storage, options]: InitializeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      TokenInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/token"),
      provider.getNetwork(),
    ]);

    return new contract.Token(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    return (
      await import("@thirdweb-dev/contracts-js/dist/abis/TokenERC20.json")
    ).default;
  },
};

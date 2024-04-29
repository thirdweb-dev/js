import type { Abi } from "abitype";
import type { RegisteredSubscription } from "node_modules/web3/lib/types/eth.exports.js";
import type { Chain } from "src/chains/types.js";
import { getRpcUrlForChain } from "src/chains/utils.js";
import type { ThirdwebClient } from "src/client/client.js";
import { getContract, type ThirdwebContract } from "src/contract/contract.js";
// import type { Account } from "src/wallets/interfaces/wallet.js";
import { Contract, Web3, type ContractAbi } from "web3";

export const web3JsAdapter = /* @__PURE__ */ () => {
  return {
    provider: {
      toWeb3Js: (options: {
        client: ThirdwebClient;
        chain: Chain;
      }): Web3<RegisteredSubscription> => {
        return toWeb3JsProvider(options.client, options.chain);
      },
    },

    contract: {
      toWeb3Js: (options: { thirdwebContract: ThirdwebContract }) => {
        const { chain, client } = options.thirdwebContract;
        const web3Provider = toWeb3JsProvider(client, chain);
        return toWeb3JsContract(web3Provider, options.thirdwebContract);
      },

      fromWeb3Js: (options: FromWeb3JsContractOptions) => {
        return fromWeb3JsContract(options);
      },
    },


  };
};

function toWeb3JsProvider(
  client: ThirdwebClient,
  chain: Chain,
): Web3<RegisteredSubscription> {
  const url = getRpcUrlForChain({ chain, client });
  const web3Provider = new Web3(url);
  return web3Provider;
}

async function toWeb3JsContract<abi extends Abi = []>(
  web3Provider: Web3<RegisteredSubscription>,
  twContract: ThirdwebContract<abi>,
): Promise<Contract<ContractAbi>> {
  const { address } = twContract;
  if (twContract.abi) {
    const web3Contract = new web3Provider.eth.Contract(
      twContract.abi as ContractAbi,
      address,
    );
    return web3Contract;
  }

  const { resolveContractAbi } = await import(
    "../contract/actions/resolve-abi.js"
  );

  const abi = await resolveContractAbi(twContract);
  const web3Contract = new web3Provider.eth.Contract(
    abi as ContractAbi,
    address,
  );
  return web3Contract;
}

type FromWeb3JsContractOptions = {
  client: ThirdwebClient;
  web3Contract: Contract<ContractAbi>;
  chain: Chain;
};

function fromWeb3JsContract<abi extends Abi>(
  options: FromWeb3JsContractOptions,
): ThirdwebContract<abi> {
  const { client, chain, web3Contract } = options;
  const address = web3Contract.options.address;
  if (!address) throw new Error("Failed to get contract address");
  return getContract({
    client,
    chain,
    address,
  });
}

// type ToWeb3JsWalletClientOptions = {
//   web3Provider: Web3<RegisteredSubscription>;
//   account: Account;
//   client: ThirdwebClient;
//   chain: Chain;
// };

// function toWeb3JsWalletClient(options: ToWeb3JsWalletClientOptions) {
//   const { web3Provider, account, client, chain } = options;
//   web3Provider.eth.accounts.create()
// }
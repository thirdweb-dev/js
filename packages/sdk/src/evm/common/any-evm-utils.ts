import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BytesLike, ethers, providers, Signer } from "ethers";
import invariant from "tiny-invariant";
import { bytecode as WETHBytecode } from "./WETH9";
import { getNativeTokenByChainId } from "../constants";
import { ThirdwebSDK } from "../core";
import { PreDeployMetadataFetched } from "../schema";
import {
  DeployedContractType,
  KeylessDeploymentInfo,
  KeylessTransaction,
  PrecomputedDeploymentTransaction,
} from "../types/any-evm/deploy-data";
import {
  ConstructorParamMap,
  ContractOptions,
  DeploymentPreset,
} from "../types/any-evm/deploy-data";
import { toWei } from "./currency";
import {
  extractConstructorParamsFromAbi,
  fetchExtendedReleaseMetadata,
  fetchPreDeployMetadata,
} from "./feature-detection";
import { generatePluginFunctions, getMetadataForPlugins } from "./plugin";
import { Plugin } from "../types/plugins";
import { DeployMetadata, DeployOptions } from "../types";
import { matchError } from "./any-evm-constants";

//
// =============================
// ======== CONSTANTS ==========
// =============================
//

const THIRDWEB_DEPLOYER = "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024";

export const CREATE2_FACTORY_BYTECODE =
  "0x604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3";
export const SIGNATURE = {
  v: 27,
  r: "0x2222222222222222222222222222222222222222222222222222222222222222",
  s: "0x2222222222222222222222222222222222222222222222222222222222222222",
};
export const COMMON_FACTORY = "0x4e59b44847b379578588920cA78FbF26c0B4956C"; // for pre-eip-155 supporting chains

export const GAS_LIMIT_FOR_DEPLOYER = 5_000_000;
export const DEPLOYER_BYTECODE =
  "0x60806040526040516107f33803806107f383398101604081905261002291610359565b805160005b818110156100c157828181518110610041576100416104c9565b6020026020010151600001516001600160a01b03163b600014156100af576100ad838281518110610074576100746104c9565b602002602001015160200151848381518110610092576100926104c9565b6020026020010151604001516100c960201b6100091760201c565b505b806100b9816104df565b915050610027565b505050610557565b606061011183836040518060400160405280601e81526020017f416464726573733a206c6f772d6c6576656c2063616c6c206661696c6564000081525061011860201b60201c565b9392505050565b6060610127848460008561012f565b949350505050565b6060824710156101955760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084015b60405180910390fd5b6001600160a01b0385163b6101ec5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161018c565b600080866001600160a01b031685876040516102089190610508565b60006040518083038185875af1925050503d8060008114610245576040519150601f19603f3d011682016040523d82523d6000602084013e61024a565b606091505b50909250905061025b828286610266565b979650505050505050565b60608315610275575081610111565b8251156102855782518084602001fd5b8160405162461bcd60e51b815260040161018c9190610524565b634e487b7160e01b600052604160045260246000fd5b604051606081016001600160401b03811182821017156102d7576102d761029f565b60405290565b604051601f8201601f191681016001600160401b03811182821017156103055761030561029f565b604052919050565b80516001600160a01b038116811461032457600080fd5b919050565b60005b8381101561034457818101518382015260200161032c565b83811115610353576000848401525b50505050565b6000602080838503121561036c57600080fd5b82516001600160401b038082111561038357600080fd5b818501915085601f83011261039757600080fd5b8151818111156103a9576103a961029f565b8060051b6103b88582016102dd565b91825283810185019185810190898411156103d257600080fd5b86860192505b838310156104bc578251858111156103f05760008081fd5b86016060601f19828d0381018213156104095760008081fd5b6104116102b5565b61041c8b850161030d565b8152604061042b81860161030d565b828d01529284015192898411156104425760008081fd5b83850194508e603f86011261045957600093508384fd5b8b85015193508984111561046f5761046f61029f565b61047f8c84601f870116016102dd565b92508383528e818587010111156104965760008081fd5b6104a5848d8501838801610329565b8101919091528452505091860191908601906103d8565b9998505050505050505050565b634e487b7160e01b600052603260045260246000fd5b600060001982141561050157634e487b7160e01b600052601160045260246000fd5b5060010190565b6000825161051a818460208701610329565b9190910192915050565b6020815260008251806020840152610543816040850160208701610329565b601f01601f19169190910160400192915050565b61028d806105666000396000f3fe6080604052600080fd5b606061004b83836040518060400160405280601e81526020017f416464726573733a206c6f772d6c6576656c2063616c6c206661696c65640000815250610052565b9392505050565b60606100618484600085610069565b949350505050565b6060824710156100cf5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084015b60405180910390fd5b6001600160a01b0385163b6101265760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016100c6565b600080866001600160a01b031685876040516101429190610208565b60006040518083038185875af1925050503d806000811461017f576040519150601f19603f3d011682016040523d82523d6000602084013e610184565b606091505b509150915061019482828661019f565b979650505050505050565b606083156101ae57508161004b565b8251156101be5782518084602001fd5b8160405162461bcd60e51b81526004016100c69190610224565b60005b838110156101f35781810151838201526020016101db565b83811115610202576000848401525b50505050565b6000825161021a8184602087016101d8565b9190910192915050565b60208152600082518060208401526102438160408501602087016101d8565b601f01601f1916919091016040019291505056fea26469706673582212200b524eb8ceaafe6c603273ee859fddbc2d6f1b7860c3d853dcf6f129f9d9371364736f6c634300080c0033";
export const DEPLOYER_ABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "predictedAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct IDeployer.Transaction[]",
        name: "transactions",
        type: "tuple[]",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
];

// Caches
let deploymentPresets: Record<string, DeploymentPreset> = {};
const deployMetadataCache: Record<string, any> = {};
const uriCache: Record<string, string> = {};

//
// ==================================
// ======== View Functions ==========
// ==================================
//

/**
 * Check if a contract exists at the given address
 *
 * @internal
 * @param address
 * @param provider
 */
export async function isContractDeployed(
  address: string,
  provider: providers.Provider,
): Promise<boolean> {
  const code = await provider.getCode(address);

  return code !== "0x";
}

/**
 * Check if a chain enforces EIP-155 transactions
 * Ref: https://eips.ethereum.org/EIPS/eip-155
 *
 * @internal
 * @param provider
 */
export async function isEIP155Enforced(
  provider: providers.Provider,
): Promise<boolean> {
  try {
    // TODO: Find a better way to check this.

    // Send a random transaction of legacy type (pre-eip-155).
    // It will fail. Parse the error message to check whether eip-155 is enforced.
    await provider.sendTransaction(
      "0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffafffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222",
    );
  } catch (e: any) {
    const errorMsg = e.toString().toLowerCase();
    const errorJson = JSON.stringify(e).toLowerCase();

    if (matchError(errorMsg) || matchError(errorJson)) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * Get the CREATE2 Factory address for a network
 * Source code of the factory:
 * https://github.com/Arachnid/deterministic-deployment-proxy/blob/master/source/deterministic-deployment-proxy.yul
 *
 * @internal
 * @param provider
 */
export async function getCreate2FactoryAddress(
  provider: providers.Provider,
): Promise<string> {
  const commonFactoryExists = await isContractDeployed(
    COMMON_FACTORY,
    provider,
  );
  if (commonFactoryExists) {
    return COMMON_FACTORY;
  }

  const enforceEip155 = await isEIP155Enforced(provider);
  const chainId = enforceEip155 ? (await provider.getNetwork()).chainId : 0;
  const gasPrice = (await provider.getFeeData()).gasPrice;
  const deploymentInfo =
    gasPrice &&
    (gasPrice.gt(ethers.utils.parseUnits("500", "gwei")) ||
      gasPrice.lt(ethers.utils.parseUnits("0.002", "gwei")))
      ? getCreate2FactoryDeploymentInfo(chainId, gasPrice.toNumber())
      : getCreate2FactoryDeploymentInfo(chainId);

  return deploymentInfo.deployment;
}

/**
 * Generate salt for deployment with Create2
 * Note: Salt component is generated by appending `tw` (thirdweb) to the bytecode
 *
 * @internal
 * @param bytecode: Creation bytecode of the contract to deploy
 */
export function getSaltHash(bytecode: string): string {
  const bytecodeHash = ethers.utils.id(bytecode);
  const salt = `tw.${bytecodeHash}`;
  const saltHash = ethers.utils.id(salt);

  return saltHash;
}

/**
 *
 * Construct init-bytecode, packed with salthash.
 * This hex data is intended to be sent to the CREATE2 factory address
 *
 * @internal
 * @param bytecode: Creation bytecode of the contract to deploy
 * @param encodedArgs: Abi-encoded constructor params
 */
export function getInitBytecodeWithSalt(
  bytecode: string,
  encodedArgs: BytesLike,
): string {
  const saltHash = getSaltHash(bytecode);

  const initBytecodeWithSalt = ethers.utils.solidityPack(
    ["bytes32", "bytes", "bytes"],
    [saltHash, bytecode, encodedArgs],
  );

  return initBytecodeWithSalt;
}

/**
 
 * Pre-compute a contract's deployment address for a CREATE2 deployment.
 *
 * @public
 * @param bytecode: Creation bytecode of the contract to deploy
 * @param encodedArgs: Abi-encoded constructor params
 * @param create2FactoryAddress
 */
export function computeDeploymentAddress(
  bytecode: string,
  encodedArgs: BytesLike,
  create2FactoryAddress: string,
): string {
  const saltHash = getSaltHash(bytecode);

  // 1. create init bytecode hash with contract's bytecode and encoded args
  const initBytecode = ethers.utils.solidityPack(
    ["bytes", "bytes"],
    [bytecode, encodedArgs],
  );

  // 2. abi-encode pack the deployer address, salt, and bytecode hash
  const deployInfoPacked = ethers.utils.solidityPack(
    ["bytes1", "address", "bytes32", "bytes32"],
    [
      "0xff",
      create2FactoryAddress,
      saltHash,
      ethers.utils.solidityKeccak256(["bytes"], [initBytecode]),
    ],
  );

  // 3. hash the packed deploy info
  const hashedDeployInfo = ethers.utils.solidityKeccak256(
    ["bytes"],
    [deployInfoPacked],
  );

  // 4. return last 20 bytes (40 characters) of the hash -- this is the predicted address
  return `0x${hashedDeployInfo.slice(26)}`;
}

/**
 *
 * @internal
 * @param provider
 * @param storage
 * @param create2Factory
 */
export async function computeEOAForwarderAddress(
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory?: string,
): Promise<string> {
  if (!create2Factory) {
    create2Factory = await getCreate2FactoryAddress(provider);
  }
  return (
    await computeDeploymentInfo("infra", provider, storage, create2Factory, {
      contractName: "ForwarderEOAOnly",
    })
  ).transaction.predictedAddress;
}

/**
 *
 * @internal
 * @param provider
 * @param storage
 * @param create2Factory
 */
export async function computeForwarderAddress(
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory?: string,
): Promise<string> {
  if (!create2Factory) {
    create2Factory = await getCreate2FactoryAddress(provider);
  }
  return (
    await computeDeploymentInfo("infra", provider, storage, create2Factory, {
      contractName: "Forwarder",
    })
  ).transaction.predictedAddress;
}

/**
 *
 * @internal
 * @param provider
 * @param storage
 * @param create2Factory
 */
export async function computeCloneFactoryAddress(
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory?: string,
): Promise<string> {
  if (!create2Factory) {
    create2Factory = await getCreate2FactoryAddress(provider);
  }
  return (
    await computeDeploymentInfo("infra", provider, storage, create2Factory, {
      contractName: "TWCloneFactory",
    })
  ).transaction.predictedAddress;
}

/**
 *
 * @internal
 * @param provider
 * @param storage
 * @param create2Factory
 */
export async function computeNativeTokenAddress(
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory?: string,
): Promise<string> {
  if (!create2Factory) {
    create2Factory = await getCreate2FactoryAddress(provider);
  }
  return (
    await computeDeploymentInfo("infra", provider, storage, create2Factory, {
      contractName: "WETH9",
    })
  ).transaction.predictedAddress;
}

//
// ==============================================
// ======== Create / Send Transactions ==========
// ==============================================
//

/**
 * Generate a transaction to be sent with a keyless signer.
 *
 * @public
 * @param transaction: Unsigned transaction object
 * @param signature: Signature bytes
 */
export function getKeylessTxn(
  transaction: ethers.UnsignedTransaction,
  signature: string,
): KeylessTransaction {
  // 1. Create serialized txn string
  const digest = ethers.utils.arrayify(
    ethers.utils.keccak256(ethers.utils.serializeTransaction(transaction)),
  );

  // 2. Determine signer address from custom signature + txn
  const signer = ethers.utils.recoverAddress(digest, signature);

  // 3. Create the signed serialized txn string.
  // To be sent directly to the chain using a provider.
  const signedSerializedTx = ethers.utils.serializeTransaction(
    transaction,
    signature,
  );

  return {
    signer: signer,
    transaction: signedSerializedTx,
  };
}

/**
 * Deploy Nick's Create2 factory on a given network.
 * Deployment is keyless. Signer is needed to fund the keyless signer address.
 * Ref: https://github.com/Arachnid/deterministic-deployment-proxy
 *
 * @public
 * @param signer
 */
export async function deployCreate2Factory(
  signer: Signer,
  options?: DeployOptions,
): Promise<string> {
  invariant(signer.provider, "No provider");
  const commonFactoryExists = await isContractDeployed(
    COMMON_FACTORY,
    signer.provider,
  );
  if (commonFactoryExists) {
    return COMMON_FACTORY;
  }

  const enforceEip155 = await isEIP155Enforced(signer.provider);
  const networkId = (await signer.provider.getNetwork()).chainId;
  const chainId = enforceEip155 ? networkId : 0;
  console.debug(`ChainId ${networkId} enforces EIP155: ${enforceEip155}`);
  const gasPrice = (await signer.provider.getFeeData()).gasPrice;
  const deploymentInfo =
    gasPrice &&
    (gasPrice.gt(ethers.utils.parseUnits("500", "gwei")) ||
      gasPrice.lt(ethers.utils.parseUnits("0.002", "gwei")))
      ? getCreate2FactoryDeploymentInfo(chainId, gasPrice.toNumber())
      : getCreate2FactoryDeploymentInfo(chainId);

  const factoryExists = await isContractDeployed(
    deploymentInfo.deployment,
    signer.provider,
  );

  // deploy community factory if not already deployed
  if (!factoryExists) {
    // send balance to the keyless signer
    if (
      (await signer.provider.getBalance(deploymentInfo.signer)).lt(
        toWei("0.01"),
      )
    ) {
      await signer.sendTransaction({
        to: deploymentInfo.signer,
        value: toWei("0.01"),
      });
    }

    // deploy
    try {
      console.debug(
        `deploying CREATE2 factory at: ${deploymentInfo.deployment}`,
      );

      options?.notifier?.("deploying", "create2Factory");
      await signer.provider.sendTransaction(deploymentInfo.transaction);
      options?.notifier?.("deployed", "create2Factory");
    } catch (err: any) {
      throw new Error(
        `Couldn't deploy CREATE2 factory: ${JSON.stringify(err)}`,
      );
    }
  }

  return deploymentInfo.deployment;
}

/**
 * Deploy a contract at a deterministic address, using Create2 method
 * Address depends on the Create2 factory address.
 *
 * @public
 *
 * @param singer
 * @param bytecode
 * @param encodedArgs
 * @param create2FactoryAddress
 */
export async function deployContractDeterministicRaw(
  signer: Signer,
  bytecode: string,
  encodedArgs: BytesLike,
  create2FactoryAddress: string,
  options?: DeployOptions,
  predictedAddress?: string,
  gasLimit: number = 7000000,
) {
  // Check if the implementation contract is already deployed
  const code = predictedAddress
    ? await signer.provider?.getCode(predictedAddress)
    : "0x";

  if (code === "0x") {
    console.debug(
      `deploying contract via create2 factory at: ${predictedAddress}`,
    );
    const initBytecodeWithSalt = getInitBytecodeWithSalt(bytecode, encodedArgs);

    let tx: ethers.PopulatedTransaction = {
      to: create2FactoryAddress,
      data: initBytecodeWithSalt,
    };

    try {
      await signer.estimateGas(tx);
    } catch (e) {
      console.debug("error estimating gas while deploying prebuilt: ", e);
      tx.gasLimit = BigNumber.from(gasLimit);
    }
    await (await signer.sendTransaction(tx)).wait();
  }
}

/**
 * Deploy a contract at a deterministic address, using Create2 method
 * Address depends on the Create2 factory address.
 *
 * @public
 *
 * @param singer
 * @param bytecode
 * @param encodedArgs
 * @param create2FactoryAddress
 */
export async function deployContractDeterministic(
  signer: Signer,
  transaction: PrecomputedDeploymentTransaction,
  options?: DeployOptions,
  gasLimit: number = 7000000,
) {
  // Check if the implementation contract is already deployed
  const code = await signer.provider?.getCode(transaction.predictedAddress);

  if (code === "0x") {
    console.debug(
      `deploying contract via create2 factory at: ${transaction.predictedAddress}`,
    );

    let tx: ethers.PopulatedTransaction = {
      to: transaction.to,
      data: transaction.data,
    };

    try {
      await signer.estimateGas(tx);
    } catch (e) {
      console.debug("error estimating gas while deploying prebuilt: ", e);
      tx.gasLimit = BigNumber.from(gasLimit);
    }
    options?.notifier?.("deploying", "preset");
    await (await signer.sendTransaction(tx)).wait();
    options?.notifier?.("deployed", "preset");
  }
}

/**
 *
 * Returns txn data for keyless deploys as well as signer deploys.
 * Also provides a list of infra contracts to deploy.
 *
 * @internal
 *
 * @param metadataUri
 * @param storage
 * @param provider
 * @param create2Factory
 */
export async function getDeploymentInfo(
  metadataUri: string,
  storage: ThirdwebStorage,
  provider: providers.Provider,
  create2Factory?: string,
): Promise<DeploymentPreset[]> {
  deploymentPresets = {};

  const create2FactoryAddress = create2Factory
    ? create2Factory
    : await getCreate2FactoryAddress(provider);

  const customParams: ConstructorParamMap = {};
  const finalDeploymentInfo: DeploymentPreset[] = [];
  const { compilerMetadata } = await fetchAndCacheDeployMetadata(
    metadataUri,
    storage,
  );
  const pluginMetadata = await getMetadataForPlugins(metadataUri, storage);

  // if pluginMetadata is not empty, then it's a plugin-pattern router contract
  if (pluginMetadata.length > 0) {
    // get deployment info for all plugins
    const pluginDeploymentInfo = await Promise.all(
      pluginMetadata.map(async (metadata) => {
        const info = await computeDeploymentInfo(
          "plugin",
          provider,
          storage,
          create2FactoryAddress,
          { metadata: metadata },
        );
        return info;
      }),
    );

    // create constructor param input for PluginMap
    const mapInput: Plugin[] = [];
    pluginMetadata.forEach((metadata, index) => {
      const input = generatePluginFunctions(
        pluginDeploymentInfo[index].transaction.predictedAddress,
        metadata.abi,
      );
      mapInput.push(...input);
    });

    // get PluginMap deployment transaction
    const pluginMapTransaction = await computeDeploymentInfo(
      "plugin",
      provider,
      storage,
      create2FactoryAddress,
      {
        contractName: "PluginMap",
        constructorParams: { _pluginsToAdd: { value: mapInput } },
      },
    );

    // address of PluginMap is input for MarketplaceV3's constructor
    customParams["_pluginMap"] = {
      value: pluginMapTransaction.transaction.predictedAddress,
    };

    finalDeploymentInfo.push(...pluginDeploymentInfo, pluginMapTransaction);
  }

  const implementationDeployInfo = await computeDeploymentInfo(
    "implementation",
    provider,
    storage,
    create2FactoryAddress,
    {
      metadata: compilerMetadata,
      constructorParams: customParams,
    },
  );

  // get clone factory
  const factoryInfo = await computeDeploymentInfo(
    "infra",
    provider,
    storage,
    create2FactoryAddress,
    { contractName: "TWCloneFactory" },
  );

  finalDeploymentInfo.push(factoryInfo);
  finalDeploymentInfo.push(...Object.values(deploymentPresets));
  finalDeploymentInfo.push(implementationDeployInfo);

  return finalDeploymentInfo;
}

export async function deployWithThrowawayDeployer(
  signer: Signer,
  transactions: PrecomputedDeploymentTransaction[],
  options?: DeployOptions,
) {
  let transactionBatches = createTransactionBatches(transactions);
  if (transactionBatches.length === 0) {
    return;
  }

  options?.notifier?.("deploying", "infra");
  const deployTxns = await Promise.all(
    transactionBatches.map((txBatch) => {
      // Using the deployer contract, send the deploy transactions to common factory with a signer
      const deployer = new ethers.ContractFactory(
        DEPLOYER_ABI,
        DEPLOYER_BYTECODE,
      )
        .connect(signer)
        .deploy(txBatch);

      return deployer;
    }),
  );

  await Promise.all(
    deployTxns.map((tx) => {
      return tx.deployed();
    }),
  );
  options?.notifier?.("deployed", "infra");
}

//
// ==============================================
// ======== Other helper functions ==============
// ==============================================
//

export async function computeDeploymentInfo(
  contractType: DeployedContractType,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory: string,
  contractOptions?: ContractOptions,
): Promise<DeploymentPreset> {
  let contractName = contractOptions && contractOptions.contractName;
  let metadata = contractOptions && contractOptions.metadata;
  invariant(contractName || metadata, "Require contract name or metadata");

  if (contractName && deploymentPresets[contractName]) {
    return deploymentPresets[contractName];
  }

  // Different treatment for WETH contract
  if (contractName === "WETH9") {
    const address = computeDeploymentAddress(WETHBytecode, [], create2Factory);
    const code = await provider.getCode(address);
    let initBytecodeWithSalt = "";
    if (code === "0x") {
      initBytecodeWithSalt = getInitBytecodeWithSalt(WETHBytecode, []);
    }
    return {
      name: contractName,
      type: contractType,
      transaction: {
        predictedAddress: address,
        to: create2Factory,
        data: initBytecodeWithSalt,
      },
    };
  }

  if (!metadata) {
    invariant(contractName, "Require contract name");
    const uri = await fetchAndCachePublishedContractURI(contractName);
    metadata = (await fetchAndCacheDeployMetadata(uri, storage))
      .compilerMetadata;
  }

  const encodedArgs = await encodeConstructorParamsForImplementation(
    metadata,
    provider,
    storage,
    create2Factory,
    contractOptions?.constructorParams,
  );
  const address = computeDeploymentAddress(
    metadata.bytecode,
    encodedArgs,
    create2Factory,
  );
  const code = await provider.getCode(address);

  let initBytecodeWithSalt = "";
  if (code === "0x") {
    initBytecodeWithSalt = getInitBytecodeWithSalt(
      metadata.bytecode,
      encodedArgs,
    );
  }

  return {
    name: contractName,
    type: contractType,
    transaction: {
      predictedAddress: address,
      to: create2Factory,
      data: initBytecodeWithSalt,
    },
  };
}

/**
 * @internal
 *
 * Determine constructor params required by an implementation contract.
 * Return abi-encoded params.
 */
async function encodeConstructorParamsForImplementation(
  compilerMetadata: PreDeployMetadataFetched,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory: string,
  constructorParamMap?: ConstructorParamMap,
): Promise<BytesLike> {
  const constructorParams = extractConstructorParamsFromAbi(
    compilerMetadata.abi,
  );
  let constructorParamTypes = constructorParams.map((p) => {
    if (p.type === "tuple[]") {
      return ethers.utils.ParamType.from(p);
    } else {
      return p.type;
    }
  });

  const constructorParamValues = await Promise.all(
    constructorParams.map(async (p) => {
      if (constructorParamMap && constructorParamMap[p.name]) {
        if (constructorParamMap[p.name].type) {
          invariant(
            constructorParamMap[p.name].type === p.type,
            `Provided type ${
              constructorParamMap[p.name].type
            } doesn't match the actual type ${p.type} from Abi`,
          );
        }
        return constructorParamMap[p.name].value;
      }
      if (p.name && p.name.includes("nativeTokenWrapper")) {
        const chainId = (await provider.getNetwork()).chainId;
        let nativeTokenWrapperAddress =
          getNativeTokenByChainId(chainId).wrapped.address;

        if (nativeTokenWrapperAddress === ethers.constants.AddressZero) {
          const deploymentInfo = await computeDeploymentInfo(
            "infra",
            provider,
            storage,
            create2Factory,
            {
              contractName: "WETH9",
            },
          );
          if (!deploymentPresets["WETH9"]) {
            deploymentPresets["WETH9"] = deploymentInfo;
          }

          nativeTokenWrapperAddress =
            deploymentInfo.transaction.predictedAddress;
        }

        return nativeTokenWrapperAddress;
      } else if (p.name && p.name.includes("trustedForwarder")) {
        if (
          compilerMetadata.analytics?.contract_name &&
          compilerMetadata.analytics.contract_name === "Pack"
        ) {
          // EOAForwarder for Pack
          const deploymentInfo = await computeDeploymentInfo(
            "infra",
            provider,
            storage,
            create2Factory,
            {
              contractName: "ForwarderEOAOnly",
            },
          );
          if (!deploymentPresets["ForwarderEOAOnly"]) {
            deploymentPresets["ForwarderEOAOnly"] = deploymentInfo;
          }
          return deploymentInfo.transaction.predictedAddress;
        }

        const deploymentInfo = await computeDeploymentInfo(
          "infra",
          provider,
          storage,
          create2Factory,
          {
            contractName: "Forwarder",
          },
        );
        if (!deploymentPresets["Forwarder"]) {
          deploymentPresets["Forwarder"] = deploymentInfo;
        }

        return deploymentInfo.transaction.predictedAddress;
      } else {
        throw new Error("Can't resolve constructor arguments");
      }
    }),
  );

  const encodedArgs = ethers.utils.defaultAbiCoder.encode(
    constructorParamTypes,
    constructorParamValues,
  );
  return encodedArgs;
}

/**
 *
 * @public
 * @param transaction: Unsigned transaction object
 * @param signature: Signature bytes
 */
export function getCreate2FactoryDeploymentInfo(
  chainId: number,
  gasPrice?: number,
): KeylessDeploymentInfo {
  const signature = ethers.utils.joinSignature(SIGNATURE);
  const deploymentTransaction = getKeylessTxn(
    {
      gasPrice: gasPrice ? gasPrice : 100 * 10 ** 9,
      gasLimit: 100000,
      nonce: 0,
      data: CREATE2_FACTORY_BYTECODE,
      chainId: chainId,
    },
    signature,
  );
  const create2FactoryAddress = ethers.utils.getContractAddress({
    from: deploymentTransaction.signer,
    nonce: 0,
  });

  return {
    ...deploymentTransaction,
    deployment: create2FactoryAddress,
  };
}

export async function fetchAndCachePublishedContractURI(
  contractName: string,
): Promise<string> {
  if (uriCache[contractName]) {
    return uriCache[contractName];
  }
  // fetch the publish URI from the ContractPublisher contract
  const publishedContract = await new ThirdwebSDK("polygon")
    .getPublisher()
    .getVersion(THIRDWEB_DEPLOYER, contractName);
  if (!publishedContract) {
    throw new Error(
      `No published contract found for ${contractName} at version by '${THIRDWEB_DEPLOYER}'`,
    );
  }
  const uri = publishedContract.metadataUri;
  uriCache[contractName] = uri;

  return uri;
}

export async function fetchAndCacheDeployMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<DeployMetadata> {
  if (deployMetadataCache[publishMetadataUri]) {
    return deployMetadataCache[publishMetadataUri];
  }
  const compilerMetadata = await fetchPreDeployMetadata(
    publishMetadataUri,
    storage,
  );
  let extendedMetadata;
  try {
    extendedMetadata = await fetchExtendedReleaseMetadata(
      publishMetadataUri,
      storage,
    );
  } catch (e) {
    // not a factory deployment, ignore
  }
  const data = {
    compilerMetadata,
    extendedMetadata,
  };
  deployMetadataCache[publishMetadataUri] = data;
  return data;
}

export function estimateGasForDeploy(initCode: string) {
  let gasLimit =
    ethers.utils
      .arrayify(initCode)
      .map((x) => (x === 0 ? 4 : 16))
      .reduce((sum, x) => sum + x) +
    (200 * initCode.length) / 2 +
    6 * Math.ceil(initCode.length / 64) +
    32000 +
    21000;

  gasLimit = Math.floor((gasLimit * 64) / 63);

  return gasLimit;
}

export function createTransactionBatches(
  transactions: PrecomputedDeploymentTransaction[],
  upperGasLimit: number = GAS_LIMIT_FOR_DEPLOYER,
): PrecomputedDeploymentTransaction[][] {
  transactions = transactions.filter((tx) => {
    return tx.data.length > 0;
  });
  if (transactions.length === 0) {
    return [];
  }

  let transactionBatches: PrecomputedDeploymentTransaction[][] = [];
  let sum = 0;
  let batch: PrecomputedDeploymentTransaction[] = [];
  transactions.forEach((tx) => {
    const gas = estimateGasForDeploy(tx.data);
    if (sum + gas > upperGasLimit) {
      if (batch.length === 0) {
        transactionBatches.push([tx]);
      } else {
        transactionBatches.push(batch);
        sum = gas;
        batch = [tx];
      }
    } else {
      sum += gas;
      batch.push(tx);
    }
  });
  if (batch.length > 0) {
    transactionBatches.push(batch);
  }

  return transactionBatches;
}

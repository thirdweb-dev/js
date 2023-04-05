import invariant from "tiny-invariant";
import { BigNumber, BytesLike, ethers, providers, Signer } from "ethers";
import { bytecode as WETHBytecode } from "./WETH9";
import {
  DeploymentInfo,
  KeylessDeploymentInfo,
  KeylessTransaction,
} from "../types/any-evm/deploy-data";
import {
  CloneFactory,
  EOAForwarder,
  Forwarder,
  INFRA_CONTRACTS_MAP,
  NativeTokenWrapper,
} from "./infra-data";
import { ThirdwebSDK } from "../core/sdk";
import { InfraContractType } from "../core";
import {
  extractConstructorParamsFromAbi,
  fetchPreDeployMetadata,
} from "./feature-detection";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { getNativeTokenByChainId } from "../constants";
import { PreDeployMetadataFetched } from "../schema";
import { toWei } from "./currency";

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
    if (
      e.toString().toLowerCase().includes("eip-155") ||
      e.message?.toString().toLowerCase().includes("eip-155") ||
      e.data?.message?.toString().toLowerCase().includes("eip-155")
    ) {
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
  const deploymentInfo = getCreate2FactoryDeploymentInfo(chainId);

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
  return await computeAddressInfra(
    EOAForwarder.contractType,
    provider,
    storage,
    create2Factory,
  );
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
  return await computeAddressInfra(
    Forwarder.contractType,
    provider,
    storage,
    create2Factory,
  );
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
  return await computeAddressInfra(
    CloneFactory.contractType,
    provider,
    storage,
    create2Factory,
  );
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
  return await computeAddressInfra(
    NativeTokenWrapper.contractType,
    provider,
    storage,
    create2Factory,
  );
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
export async function deployCreate2Factory(signer: Signer): Promise<string> {
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
  const deploymentInfo = getCreate2FactoryDeploymentInfo(chainId);

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
      await signer.provider.sendTransaction(deploymentInfo.transaction);
    } catch (err) {
      throw new Error(`Couldn't deploy CREATE2 factory: ${err}`);
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
export async function deployContractDeterministic(
  signer: Signer,
  bytecode: string,
  encodedArgs: BytesLike,
  create2FactoryAddress: string,
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
): Promise<DeploymentInfo> {
  const compilerMetadata = await fetchPreDeployMetadata(metadataUri, storage);
  if (!create2Factory) {
    create2Factory = await getCreate2FactoryAddress(provider);
  }

  // 1.  Get abi-encoded args and list of infra contracts required based on constructor params
  const { encodedArgs, infraContracts } =
    await encodeConstructorParamsForImplementation(
      compilerMetadata,
      provider,
      storage,
      create2Factory,
    );

  // 2. Compute the CREATE2 address
  const predictedAddress = computeDeploymentAddress(
    compilerMetadata.bytecode,
    encodedArgs,
    create2Factory,
  );

  // 3. Add TWStatelessFactory and Forwarder to the list of infra contracts --
  // these must be deployed regardless of constructor params of implementation contract
  infraContracts.push(CloneFactory.contractType);
  infraContracts.push(Forwarder.contractType);

  return {
    bytecode: compilerMetadata.bytecode,
    encodedArgs: encodedArgs,
    predictedAddress: predictedAddress,
    infraContractsToDeploy: infraContracts,
  };
}

/**
 * Deploy Infra contracts with a signer.
 * The serialized txn data and addresses are precomputed for infra contracts.
 *
 * @internal
 *
 * @param signer: Signer of infra deployment txns
 * @param provider
 * @param storage
 * @param create2Factory
 * @param contractTypes: List of infra contracts to deploy
 */
export async function deployInfraWithSigner(
  signer: Signer,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory: string,
  contractTypes: InfraContractType[],
) {
  const txns = [];

  for (let contractType of contractTypes as InfraContractType[]) {
    const infraContractAddress = await computeAddressInfra(
      contractType,
      provider,
      storage,
      create2Factory,
    );

    if (contractType === NativeTokenWrapper.contractType) {
      const code = await provider.getCode(infraContractAddress);
      if (code === "0x") {
        const initCode = getInitBytecodeWithSalt(WETHBytecode, []);

        txns.push({
          predictedAddress: infraContractAddress,
          to: create2Factory,
          data: initCode,
        });
      }
      continue;
    }

    const uri = await fetchPublishedContractURI(
      INFRA_CONTRACTS_MAP[contractType].name,
    );
    const infraContractMetadata = await fetchPreDeployMetadata(uri, storage);
    const code = await provider.getCode(infraContractAddress);

    if (code === "0x") {
      const encodedArgs = (
        await encodeConstructorParamsForImplementation(
          infraContractMetadata,
          provider,
          storage,
          create2Factory,
        )
      ).encodedArgs;
      // get init bytecode
      const initBytecodeWithSalt = getInitBytecodeWithSalt(
        infraContractMetadata.bytecode,
        encodedArgs,
      );

      txns.push({
        predictedAddress: infraContractAddress,
        to: create2Factory,
        data: initBytecodeWithSalt,
      });
    }
  }

  // Call/deploy the throaway-deployer only if there are any contracts to deploy
  if (txns.length > 0) {
    txns.forEach((tx) =>
      console.debug(`deploying infra contract at: ${tx.predictedAddress}`),
    );
    // Using the deployer contract, send the deploy transactions to common factory with a signer
    const deployer = new ethers.ContractFactory(DEPLOYER_ABI, DEPLOYER_BYTECODE)
      .connect(signer)
      .deploy(txns);
    await (await deployer).deployed();
  }
}

//
// ==============================================
// ======== Other helper functions ==============
// ==============================================
//

/**
 *
 * @public
 * @param transaction: Unsigned transaction object
 * @param signature: Signature bytes
 */
export function getCreate2FactoryDeploymentInfo(
  chainId: number,
): KeylessDeploymentInfo {
  const signature = ethers.utils.joinSignature(SIGNATURE);
  const deploymentTransaction = getKeylessTxn(
    {
      gasPrice: 100 * 10 ** 9,
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

async function fetchPublishedContractURI(
  contractName: string,
): Promise<string> {
  // fetch the publish URI from the ContractPublisher contract
  const publishedContract = await new ThirdwebSDK("polygon")
    .getPublisher()
    .getVersion(THIRDWEB_DEPLOYER, contractName);
  if (!publishedContract) {
    throw new Error(
      `No published contract found for ${contractName} at version by '${THIRDWEB_DEPLOYER}'`,
    );
  }
  return publishedContract?.metadataUri;
}

async function computeAddressInfra(
  contractType: InfraContractType,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory: string,
): Promise<string> {
  const contract = INFRA_CONTRACTS_MAP[contractType];

  if (contract.contractType === NativeTokenWrapper.contractType) {
    const address = computeDeploymentAddress(WETHBytecode, [], create2Factory);

    return address;
  } else {
    let uri = await fetchPublishedContractURI(contract.name);

    const metadata = await fetchPreDeployMetadata(uri, storage);
    const encodedArgs = (
      await encodeConstructorParamsForImplementation(
        metadata,
        provider,
        storage,
        create2Factory,
      )
    ).encodedArgs;
    const address = computeDeploymentAddress(
      metadata.bytecode,
      encodedArgs,
      create2Factory,
    );

    return address;
  }
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
) {
  const chainId = (await provider.getNetwork()).chainId;
  const infraContracts: InfraContractType[] = [];
  const constructorParams = extractConstructorParamsFromAbi(
    compilerMetadata.abi,
  );

  const constructorParamTypes = constructorParams.map((p) => p.type);
  const constructorParamValues = await Promise.all(
    constructorParams.map(async (p) => {
      if (p.name && p.name.includes("nativeTokenWrapper")) {
        let nativeTokenWrapperAddress =
          getNativeTokenByChainId(chainId).wrapped.address;

        if (nativeTokenWrapperAddress === ethers.constants.AddressZero) {
          nativeTokenWrapperAddress = await computeNativeTokenAddress(
            provider,
            storage,
            create2Factory,
          );
          infraContracts.push(NativeTokenWrapper.contractType);
        }

        return nativeTokenWrapperAddress;
      } else if (p.name && p.name.includes("trustedForwarder")) {
        if (
          compilerMetadata.analytics?.contract_name &&
          compilerMetadata.analytics.contract_name === "Pack"
        ) {
          infraContracts.push(EOAForwarder.contractType);
          const eoaForwarderAddress = await computeEOAForwarderAddress(
            provider,
            storage,
            create2Factory,
          );
          return eoaForwarderAddress;
        }
        infraContracts.push(Forwarder.contractType);
        const forwarderAddress = await computeForwarderAddress(
          provider,
          storage,
          create2Factory,
        );
        return forwarderAddress;
      } else {
        return "";
      }
    }),
  );

  const encodedArgs = ethers.utils.defaultAbiCoder.encode(
    constructorParamTypes,
    constructorParamValues,
  );
  return { encodedArgs, infraContracts };
}

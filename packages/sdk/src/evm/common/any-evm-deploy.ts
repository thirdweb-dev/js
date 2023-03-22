// import { BigNumber } from "ethers";
import { getNativeTokenByChainId } from "../constants";
import { InfraContractType } from "../core/types";
import { PreDeployMetadataFetched } from "../schema";
import {
  DeployDataWithSigner,
  DeploymentInfo,
} from "../types/any-evm/deploy-data";
import {
  extractConstructorParamsFromAbi,
  fetchPreDeployMetadata,
} from "./feature-detection";
import {
  CloneFactory,
  EOAForwarder,
  Forwarder,
  INFRA_CONTRACTS_MAP,
  NativeTokenWrapper,
} from "./infra-data";
import DeployerAbi from "@thirdweb-dev/contracts-js/dist/abis/Deployer.json";
import SplitAbi from "@thirdweb-dev/contracts-js/dist/abis/ThrowawaySplit.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, ethers } from "ethers";
import type { Signer, providers } from "ethers";

export const customSigInfo = {
  v: 27,
  r: "0x2222222222222222222222222222222222222222222222222222222222222222",
  s: "0x2222222222222222222222222222222222222222222222222222222222222222",
};
export const commonFactory = "0x4e59b44847b379578588920cA78FbF26c0B4956C";

const splitBytecode =
  "0x60806040526040516102e33803806102e383398101604081905261002291610175565b805160005b818110156100ff5782818151811061004157610041610257565b6020026020010151600001516001600160a01b031631600014156100ed5782818151811061007157610071610257565b6020026020010151600001516001600160a01b031683828151811061009857610098610257565b60200260200101516020015160405160006040518083038185875af1925050503d80600081146100e4576040519150601f19603f3d011682016040523d82523d6000602084013e6100e9565b606091505b5050505b806100f78161026d565b915050610027565b505050610296565b634e487b7160e01b600052604160045260246000fd5b604080519081016001600160401b038111828210171561013f5761013f610107565b60405290565b604051601f8201601f191681016001600160401b038111828210171561016d5761016d610107565b604052919050565b6000602080838503121561018857600080fd5b82516001600160401b038082111561019f57600080fd5b818501915085601f8301126101b357600080fd5b8151818111156101c5576101c5610107565b6101d3848260051b01610145565b818152848101925060069190911b8301840190878211156101f357600080fd5b928401925b8184101561024c57604084890312156102115760008081fd5b61021961011d565b84516001600160a01b03811681146102315760008081fd5b815284860151868201528352604090930192918401916101f8565b979650505050505050565b634e487b7160e01b600052603260045260246000fd5b600060001982141561028f57634e487b7160e01b600052601160045260246000fd5b5060010190565b603f806102a46000396000f3fe6080604052600080fdfea264697066735822122030dd45db3d5ce1a163d84f01654c2b81a5eb00c067c6269fb987900dc7b1586864736f6c634300080c0033";

const deployerBytecode =
  "0x60806040526040516103e53803806103e5833981016040819052610022916101cb565b805160005b81811015610109578281815181106100415761004161033d565b6020026020010151600001516001600160a01b03163b600014156100f7578281815181106100715761007161033d565b6020026020010151602001516001600160a01b03168382815181106100985761009861033d565b6020026020010151604001516040516100b19190610353565b6000604051808303816000865af19150503d80600081146100ee576040519150601f19603f3d011682016040523d82523d6000602084013e6100f3565b606091505b5050505b806101018161036f565b915050610027565b505050610398565b634e487b7160e01b600052604160045260246000fd5b604051606081016001600160401b038111828210171561014957610149610111565b60405290565b604051601f8201601f191681016001600160401b038111828210171561017757610177610111565b604052919050565b80516001600160a01b038116811461019657600080fd5b919050565b60005b838110156101b657818101518382015260200161019e565b838111156101c5576000848401525b50505050565b600060208083850312156101de57600080fd5b82516001600160401b03808211156101f557600080fd5b818501915085601f83011261020957600080fd5b81518181111561021b5761021b610111565b8060051b61022a85820161014f565b918252838101850191858101908984111561024457600080fd5b86860192505b83831015610330578251858111156102625760008081fd5b86016060601f19828d03810182131561027b5760008081fd5b610283610127565b61028e8b850161017f565b8152604061029d81860161017f565b828d01529284015192898411156102b45760008081fd5b83850194508e603f8601126102cb57600093508384fd5b8b8501519350898411156102e1576102e1610111565b6102f18c84601f8701160161014f565b92508383528e8c8d8688010101111561030a5760008081fd5b610319848d850183880161019b565b81019190915284525050918601919086019061024a565b9998505050505050505050565b634e487b7160e01b600052603260045260246000fd5b6000825161036581846020870161019b565b9190910192915050565b600060001982141561039157634e487b7160e01b600052601160045260246000fd5b5060010190565b603f806103a66000396000f3fe6080604052600080fdfea2646970667358221220d3a28fa921e7892332429b9bc53573ee470554691975c14675e6c59dcf2716e664736f6c634300080c0033";

/**
 * @internal
 *
 * Deploys a CREATE2 factory at a predetermined address: 0x4e59b44847b379578588920cA78FbF26c0B4956C
 *
 * This factory is used for deploying all thirdweb infra and implementation contracts.
 * This allows deployments at predictable addresses on all chains.
 */
export async function deployCommonFactory(
  signer: Signer,
  provider: providers.Provider,
) {
  let factoryCode = await provider.getCode(commonFactory);
  // deploy community factory if not already deployed
  if (factoryCode === "0x") {
    // send balance
    let refundTx = {
      to: "3fab184622dc19b6109349b94811493bf2a45362",
      value: ethers.utils.parseEther("0.01"), // TODO: estimate gas/value
    };
    await signer.sendTransaction(refundTx);

    // deploy
    try {
      await provider.sendTransaction(
        "0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222",
      );
    } catch (err) {
      console.log("Couldn't deploy factory");
      console.log(err);
      process.exit(1);
    }
  }
}

/**
 * @internal
 *
 * @param bytecode: Creation bytecode of the contract to deploy
 */
export function getSaltHash(bytecode: string) {
  const bytecodeHash = ethers.utils.id(bytecode);
  const salt = `tw.${bytecodeHash}`;
  const saltHash = ethers.utils.id(salt);

  return saltHash;
}

/**
 * @internal
 *
 * Construct init-bytecode, packed with salthash.
 * This hex data is intended to be sent to the common CREATE2 factory address: 0x4e59b44847b379578588920cA78FbF26c0B4956C
 *
 * @param bytecode: Creation bytecode of the contract to deploy
 * @param encodedArgs: Abi-encoded constructor params
 */
export function getInitBytecodeWithSalt(
  bytecode: string,
  encodedArgs: string,
): DeployDataWithSigner {
  const saltHash = getSaltHash(bytecode);
  const deployData = ethers.utils.solidityPack(
    ["bytes32", "bytes", "bytes"],
    [saltHash, bytecode, encodedArgs],
  );

  return { initBytecodeWithSalt: deployData };
}

/**
 * @internal
 *
 * Pre-compute a contract's deployment address for a CREATE2 deployment.
 *
 * @param bytecode: Creation bytecode of the contract to deploy
 * @param encodedArgs: Abi-encoded constructor params
 */
export function computeDeploymentAddress(
  bytecode: string,
  encodedArgs: string,
) {
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
      commonFactory,
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
 * @internal
 *
 * Deploy Infra contracts with a keyless flow.
 * The serialized txn data and addresses are precomputed for infra contracts.
 *
 * @param signer: This signer is required to fund the wallets derived from custom signature
 * @param provider: Provider to send the txn
 * @param contractTypes: List of infra contracts to deploy
 */
export async function deployInfraKeyless(
  signer: Signer,
  provider: providers.Provider,
  contractTypes?: InfraContractType[],
) {
  // if (!contractTypes) {
  //   contractTypes = Object.keys(INFRA_CONTRACTS_MAP);
  // }

  // create2 factory
  await deployCommonFactory(signer, provider);

  const deployers = [];
  const txns = [];
  let totalValueToSplit: BigNumber = BigNumber.from(0);

  const feeData = await provider.getFeeData();
  for (let contractType of contractTypes as InfraContractType[]) {
    const txInfo = INFRA_CONTRACTS_MAP[contractType].txInfo;

    // Check if the infra contract is already deployed
    const code = await provider.getCode(txInfo.predictedAddress);

    if (code === "0x") {
      // If contract doesn't exist, then fund the derived signer (derived from custom signature)

      const gasRequired = await signer.estimateGas({
        to: commonFactory,
        data: txInfo.deployData,
      });

      // ===
      const tx = {
        gasPrice: feeData.maxFeePerGas?.toNumber(),
        gasLimit: gasRequired.toNumber(),
        to: commonFactory,
        value: 0,
        nonce: 0,
        data: txInfo.deployData,
      };

      const customSignature = ethers.utils.joinSignature(customSigInfo);

      const serializedTx = ethers.utils.serializeTransaction(tx);

      const addr = ethers.utils.recoverAddress(
        ethers.utils.arrayify(ethers.utils.keccak256(serializedTx)),
        customSignature,
      );

      const signedSerializedTx = ethers.utils.serializeTransaction(
        tx,
        customSigInfo,
      );
      // ===

      let fundAddr = {
        deployer: addr,
        value: gasRequired
          .mul(feeData.maxFeePerGas || 1)
          .mul(105)
          .div(100),
      };
      // await signer.sendTransaction(fundAddr);
      totalValueToSplit = totalValueToSplit.add(fundAddr.value);
      deployers.push(fundAddr);

      txns.push({
        predictedAddress: txInfo.predictedAddress,
        txn: signedSerializedTx,
      });

      // Send the serialzed txn (evm will find out signer and target from this txn string)
      // await (await provider.sendTransaction(signedSerializedTx)).wait();
    }
  }

  // send funds to deployer wallets
  // for (const txn of deployers) {
  //   await signer.sendTransaction(txn);
  // }
  const splitDeployer = new ethers.ContractFactory(SplitAbi, splitBytecode)
    .connect(signer)
    .deploy(deployers, { value: totalValueToSplit });
  await (await splitDeployer).deployed();

  // send deployment txns
  for (const txn of txns) {
    await (await provider.sendTransaction(txn.txn)).wait();
  }
}

/**
 * @internal
 *
 * Deploy Infra contracts with a signer.
 * The serialized txn data and addresses are precomputed for infra contracts.
 *
 * @param signer: Signer of infra deployment txns
 * @param contractTypes: List of infra contracts to deploy
 */
export async function deployInfraWithSigner(
  signer: Signer,
  provider: providers.Provider,
  contractTypes?: InfraContractType[],
) {
  // if (!contractTypes) {
  //   contractTypes = Object.keys(INFRA_CONTRACTS_MAP);
  // }

  // create2 factory
  await deployCommonFactory(signer, provider);
  const txns = [];

  for (let contractType of contractTypes as InfraContractType[]) {
    const txInfo = INFRA_CONTRACTS_MAP[contractType].txInfo;

    // Check if the infra contract is already deployed
    const code = await provider.getCode(txInfo.predictedAddress);

    console.log("contract types, code ", contractType, code.length);

    if (code === "0x") {
      // get init bytecode
      const deployData = txInfo.deployData;

      // const tx = {
      //   from: signer.getAddress(),
      //   to: commonFactory,
      //   value: 0,
      //   nonce: await signer.getTransactionCount("latest"),
      //   data: deployData,
      // };
      txns.push({
        predictedAddress: txInfo.predictedAddress,
        to: commonFactory,
        data: deployData,
      });

      // Send the deploy transaction to common factory with a signer
      // await (await signer.sendTransaction(tx)).wait();
    }
  }

  if (txns.length > 0) {
    const deployer = new ethers.ContractFactory(DeployerAbi, deployerBytecode)
      .connect(signer)
      .deploy(txns, { gasLimit: 5000000 });
    await (await deployer).deployed();
  }
}

/**
 * @internal
 *
 * Deploy thirdweb's prebuilt implementation contracts with a keyless flow.
 * The serialized txn data is precomputed.
 *
 * @param provider: Provider to send the txn
 * @param keylessTxn: Precomputed serialized txn
 */
export async function deployImplementationKeyless(
  provider: providers.Provider,
  keylessTxn: string,
  predictedAddress: string,
) {
  // Check if the implementation contract is already deployed
  const code = await provider.getCode(predictedAddress);

  if (code === "0x") {
    await (await provider.sendTransaction(keylessTxn)).wait();
  }
}

/**
 * @internal
 *
 * Deploy thirdweb's prebuilt implementation contracts with a signer.
 * The serialized txn data is precomputed.
 *
 * @param singer: Signer of the deployment txn
 * @param initBytecodeWithSalt: init-bytecode packed with salt-hash, to be sent to common factory
 */
export async function deployImplementationWithSigner(
  signer: Signer,
  initBytecodeWithSalt: string,
  predictedAddress: string,
) {
  // Check if the implementation contract is already deployed
  const code = await signer.provider?.getCode(predictedAddress);

  if (code === "0x") {
    const tx = {
      from: signer.getAddress(),
      to: commonFactory,
      value: 0,
      nonce: await signer.getTransactionCount("latest"),
      data: initBytecodeWithSalt,
    };

    await (await signer.sendTransaction(tx)).wait();
  }
}

/**
 * @internal
 *
 * Returns txn data for keyless deploys as well as signer deploys.
 * Also provides a list of infra contracts to deploy.
 *
 * @param metadataUri
 * @param activeChainId
 * @param storage
 */
export async function getDeploymentInfo(
  metadataUri: string,
  activeChainId: number,
  storage: ThirdwebStorage,
): Promise<DeploymentInfo> {
  const compilerMetadata = await fetchPreDeployMetadata(metadataUri, storage);

  // 1.  Get abi-encoded args and list of infra contracts required based on constructor params
  const { encodedArgs, infraContracts } =
    encodeConstructorParamsForImplementation(compilerMetadata, activeChainId);

  // 2. Compute the CREATE2 address
  const predictedAddress = computeDeploymentAddress(
    compilerMetadata.bytecode,
    encodedArgs,
  );

  // 3. Get init-bytecode packed with salt -- to be used if deploying with a signer
  const signerDeployData = getInitBytecodeWithSalt(
    compilerMetadata.bytecode,
    encodedArgs,
  );

  // 5. Add TWStatelessFactory and Forwarder to the list of infra contracts --
  // these must be deployed regardless of constructor params of implementation contract
  infraContracts.push(Forwarder.contractType);
  infraContracts.push(CloneFactory.contractType);

  return {
    signerDeployData,
    predictedAddress: predictedAddress,
    infraContractsToDeploy: infraContracts,
  };
}

/**
 * @internal
 *
 * Determine constructor params required by an implementation contract.
 * Return abi-encoded params.
 */
function encodeConstructorParamsForImplementation(
  compilerMetadata: PreDeployMetadataFetched,
  chainId: number,
) {
  const infraContracts: InfraContractType[] = [];
  const constructorParams = extractConstructorParamsFromAbi(
    compilerMetadata.abi,
  );
  const constructorParamTypes = constructorParams.map((p) => p.type);
  const constructorParamValues = constructorParams.map(async (p) => {
    if (p.name && p.name.includes("nativeTokenWrapper")) {
      let nativeTokenWrapperAddress =
        getNativeTokenByChainId(chainId).wrapped.address;

      if (nativeTokenWrapperAddress === ethers.constants.AddressZero) {
        nativeTokenWrapperAddress = NativeTokenWrapper.txInfo.predictedAddress;
        infraContracts.push(NativeTokenWrapper.contractType);
      }

      return nativeTokenWrapperAddress;
    } else if (p.name && p.name.includes("trustedForwarder")) {
      infraContracts.push(EOAForwarder.contractType);
      return EOAForwarder.txInfo.predictedAddress;
    } else {
      return "";
    }
  });
  const encodedArgs = ethers.utils.defaultAbiCoder.encode(
    constructorParamTypes,
    constructorParamValues,
  );
  return { encodedArgs, infraContracts };
}

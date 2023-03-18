// import { BigNumber } from "ethers";
import { getNativeTokenByChainId } from "../constants";
import { InfraContractType } from "../core/types";
import { PreDeployMetadataFetched } from "../schema";
import {
  DeployDataKeyless,
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
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";
import type { Signer, providers } from "ethers";
import { ethers as hardhatEthers } from "hardhat";

export const customSigInfo = {
  v: 27,
  r: "0x2222222222222222222222222222222222222222222222222222222222222222",
  s: "0x2222222222222222222222222222222222222222222222222222222222222222",
};
export const commonFactory = "0x4e59b44847b379578588920cA78FbF26c0B4956C";

/**
 * @internal
 *
 * Deploys a CREATE2 factory at a predetermined address: 0x4e59b44847b379578588920cA78FbF26c0B4956C
 *
 * This factory is used for deploying all thirdweb infra and implementation contracts.
 * This allows deployments at predictable addresses on all chains.
 */
export async function deployCommonFactory(signer: Signer) {
  let factoryCode = await hardhatEthers.provider.getCode(commonFactory);
  // deploy community factory if not already deployed
  if (factoryCode == "0x") {
    console.log("zero code");
    // send balance
    let refundTx = {
      to: "3fab184622dc19b6109349b94811493bf2a45362",
      value: hardhatEthers.utils.parseEther("0.01"), // TODO: estimate gas/value
    };
    await signer.sendTransaction(refundTx);

    // deploy
    try {
      const tx = await hardhatEthers.provider.sendTransaction(
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
  const bytecodeHash = hardhatEthers.utils.id(bytecode);
  const salt = `tw.${bytecodeHash}`;
  const saltHash = hardhatEthers.utils.id(salt);

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
  const deployData = hardhatEthers.utils.solidityPack(
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
  const initBytecode = hardhatEthers.utils.solidityPack(
    ["bytes", "bytes"],
    [bytecode, encodedArgs],
  );

  // 2. abi-encode pack the deployer address, salt, and bytecode hash
  const deployInfoPacked = hardhatEthers.utils.solidityPack(
    ["bytes1", "address", "bytes32", "bytes32"],
    [
      "0xff",
      commonFactory,
      saltHash,
      hardhatEthers.utils.solidityKeccak256(["bytes"], [initBytecode]),
    ],
  );

  // 3. hash the packed deploy info
  const hashedDeployInfo = hardhatEthers.utils.solidityKeccak256(
    ["bytes"],
    [deployInfoPacked],
  );

  // 4. return last 20 bytes (40 characters) of the hash -- this is the predicted address
  return `0x${hashedDeployInfo.slice(26)}`;
}

/**
 * @internal
 *
 * Constructs a serialized transaction string (hex) using a custom signature.
 * This method doesn't require a signer/private-key. The signer is derived from txn data and custom signature.
 *
 * @param bytecode: Creation bytecode of the contract to deploy
 * @param encodedArgs: Abi-encoded constructor params
 */
export function constructKeylessDeployTx(
  bytecode: string,
  encodedArgs: string,
): DeployDataKeyless {
  // 1. Generate salt-hash using the bytecode
  const saltHash = getSaltHash(bytecode);

  // 2. This packed data is required by the common CREATE2 factory.
  // The factory will unpack salt and bytecode, to be passed as params to create2 opcode
  const data = hardhatEthers.utils.solidityPack(
    ["bytes32", "bytes", "bytes"],
    [saltHash, bytecode, encodedArgs],
  );

  // 3. Create txn object
  const tx = {
    gasPrice: 100 * 10 ** 9, // TODO: dynamic gas estimation
    gasLimit: 5000000, // TODO: dynamic gas estimation
    to: commonFactory,
    value: 0,
    nonce: 0,
    data: data,
  };

  // 4. Create signature by joining r & s values of custom signature above
  const customSignature = ethers.utils.joinSignature(customSigInfo);

  // 5. Create serialized txn string
  const serializedTx = ethers.utils.serializeTransaction(tx);

  // 6. Determine signer address from custom signature + txn
  const addr = ethers.utils.recoverAddress(
    ethers.utils.arrayify(ethers.utils.keccak256(serializedTx)),
    customSignature,
  );

  // 7. Create the signed serialized txn string.
  // To be sent directly to the chain using a provider.
  const signedSerializedTx = ethers.utils.serializeTransaction(
    tx,
    customSigInfo,
  );

  return {
    keylessSigner: addr,
    keylessTxnString: signedSerializedTx,
  };
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
  await deployCommonFactory(signer);

  for (let contractType of contractTypes as InfraContractType[]) {
    const txInfo = INFRA_CONTRACTS_MAP[contractType].txInfo;

    // Check if the infra contract is already deployed
    const code = await hardhatEthers.provider.getCode(txInfo.predictedAddress);

    if (code === "0x") {
      // If contract doesn't exist, then fund the derived signer (derived from custom signature)
      let fundAddr = {
        to: txInfo.from,
        value: hardhatEthers.utils.parseEther("1"),
      };
      await signer.sendTransaction(fundAddr);

      // Send the serialzed txn (evm will find out signer and target from this txn string)
      await (await provider.sendTransaction(txInfo.tx)).wait();
    }
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
  contractTypes?: InfraContractType[],
) {
  // if (!contractTypes) {
  //   contractTypes = Object.keys(INFRA_CONTRACTS_MAP);
  // }

  // create2 factory
  await deployCommonFactory(signer);

  for (let contractType of contractTypes as InfraContractType[]) {
    const txInfo = INFRA_CONTRACTS_MAP[contractType].txInfo;

    // Check if the infra contract is already deployed
    const code = await hardhatEthers.provider.getCode(txInfo.predictedAddress);

    if (code === "0x") {
      // get init bytecode
      const deployData = txInfo.deployData;

      const tx = {
        from: signer.getAddress(),
        to: commonFactory,
        value: 0,
        nonce: await signer.getTransactionCount("latest"),
        data: deployData,
      };

      // Send the deploy transaction to common factory with a signer
      await (await signer.sendTransaction(tx)).wait();
    }
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
) {
  await (await provider.sendTransaction(keylessTxn)).wait();
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
) {
  const tx = {
    from: signer.getAddress(),
    to: commonFactory,
    value: 0,
    nonce: await signer.getTransactionCount("latest"),
    data: initBytecodeWithSalt,
  };

  await (await signer.sendTransaction(tx)).wait();
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

  // 3. Construct keyless txn
  const keylessData = constructKeylessDeployTx(
    compilerMetadata.bytecode,
    encodedArgs,
  );

  // 4. Get init-bytecode packed with salt -- to be used if deploying with a signer
  const signerDeployData = getInitBytecodeWithSalt(
    compilerMetadata.bytecode,
    encodedArgs,
  );

  // 5. Add TWStatelessFactory and Forwarder to the list of infra contracts --
  // these must be deployed regardless of constructor params of implementation contract
  infraContracts.push(CloneFactory.contractType);
  infraContracts.push(Forwarder.contractType);

  return {
    keylessData,
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
    if (p.name.includes("nativeTokenWrapper")) {
      let nativeTokenWrapperAddress =
        getNativeTokenByChainId(chainId).wrapped.address;

      if (nativeTokenWrapperAddress === ethers.constants.AddressZero) {
        nativeTokenWrapperAddress = NativeTokenWrapper.txInfo.predictedAddress;
        infraContracts.push(NativeTokenWrapper.contractType);
      }

      return nativeTokenWrapperAddress;
    } else if (p.name.includes("trustedForwarder")) {
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

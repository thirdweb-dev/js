// import { BigNumber } from "ethers";
import { getNativeTokenByChainId } from "../constants";
import { InfraContractType } from "../core/types";
import { PreDeployMetadataFetched } from "../schema";
import {
  DeployDataKeyless,
  DeployDataWithSigner,
  DeploymentInfo,
} from "../types/any-evm/deploy-data";
import { getCreate2Factory } from "./any-evm-utils";
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
// import DeployerAbi from "@thirdweb-dev/contracts-js/dist/abis/Deployer.json";
// import SplitAbi from "@thirdweb-dev/contracts-js/dist/abis/ThrowawaySplit.json";
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
  "0x60806040526040516107f33803806107f383398101604081905261002291610359565b805160005b818110156100c157828181518110610041576100416104c9565b6020026020010151600001516001600160a01b03163b600014156100af576100ad838281518110610074576100746104c9565b602002602001015160200151848381518110610092576100926104c9565b6020026020010151604001516100c960201b6100091760201c565b505b806100b9816104df565b915050610027565b505050610557565b606061011183836040518060400160405280601e81526020017f416464726573733a206c6f772d6c6576656c2063616c6c206661696c6564000081525061011860201b60201c565b9392505050565b6060610127848460008561012f565b949350505050565b6060824710156101955760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084015b60405180910390fd5b6001600160a01b0385163b6101ec5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161018c565b600080866001600160a01b031685876040516102089190610508565b60006040518083038185875af1925050503d8060008114610245576040519150601f19603f3d011682016040523d82523d6000602084013e61024a565b606091505b50909250905061025b828286610266565b979650505050505050565b60608315610275575081610111565b8251156102855782518084602001fd5b8160405162461bcd60e51b815260040161018c9190610524565b634e487b7160e01b600052604160045260246000fd5b604051606081016001600160401b03811182821017156102d7576102d761029f565b60405290565b604051601f8201601f191681016001600160401b03811182821017156103055761030561029f565b604052919050565b80516001600160a01b038116811461032457600080fd5b919050565b60005b8381101561034457818101518382015260200161032c565b83811115610353576000848401525b50505050565b6000602080838503121561036c57600080fd5b82516001600160401b038082111561038357600080fd5b818501915085601f83011261039757600080fd5b8151818111156103a9576103a961029f565b8060051b6103b88582016102dd565b91825283810185019185810190898411156103d257600080fd5b86860192505b838310156104bc578251858111156103f05760008081fd5b86016060601f19828d0381018213156104095760008081fd5b6104116102b5565b61041c8b850161030d565b8152604061042b81860161030d565b828d01529284015192898411156104425760008081fd5b83850194508e603f86011261045957600093508384fd5b8b85015193508984111561046f5761046f61029f565b61047f8c84601f870116016102dd565b92508383528e818587010111156104965760008081fd5b6104a5848d8501838801610329565b8101919091528452505091860191908601906103d8565b9998505050505050505050565b634e487b7160e01b600052603260045260246000fd5b600060001982141561050157634e487b7160e01b600052601160045260246000fd5b5060010190565b6000825161051a818460208701610329565b9190910192915050565b6020815260008251806020840152610543816040850160208701610329565b601f01601f19169190910160400192915050565b61028d806105666000396000f3fe6080604052600080fd5b606061004b83836040518060400160405280601e81526020017f416464726573733a206c6f772d6c6576656c2063616c6c206661696c65640000815250610052565b9392505050565b60606100618484600085610069565b949350505050565b6060824710156100cf5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084015b60405180910390fd5b6001600160a01b0385163b6101265760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016100c6565b600080866001600160a01b031685876040516101429190610208565b60006040518083038185875af1925050503d806000811461017f576040519150601f19603f3d011682016040523d82523d6000602084013e610184565b606091505b509150915061019482828661019f565b979650505050505050565b606083156101ae57508161004b565b8251156101be5782518084602001fd5b8160405162461bcd60e51b81526004016100c69190610224565b60005b838110156101f35781810151838201526020016101db565b83811115610202576000848401525b50505050565b6000825161021a8184602087016101d8565b9190910192915050565b60208152600082518060208401526102438160408501602087016101d8565b601f01601f1916919091016040019291505056fea26469706673582212200b524eb8ceaafe6c603273ee859fddbc2d6f1b7860c3d853dcf6f129f9d9371364736f6c634300080c0033";

const deployerAbi = [
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
export async function computeDeploymentAddress(
  bytecode: string,
  encodedArgs: string,
  create2FactoryAddress: string,
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
 * @internal
 *
 * Constructs a serialized transaction string (hex) using a custom signature.
 * This method doesn't require a signer/private-key. The signer is derived from txn data and custom signature.
 *
 * @param bytecode: Creation bytecode of the contract to deploy
 * @param encodedArgs: Abi-encoded constructor params
 */
export async function constructKeylessDeployTx(
  bytecode: string,
  encodedArgs: string,
  provider: providers.Provider,
): Promise<DeployDataKeyless> {
  // 1. Generate salt-hash using the bytecode
  const saltHash = getSaltHash(bytecode);

  // 2. This packed data is required by the common CREATE2 factory.
  // The factory will unpack salt and bytecode, to be passed as params to create2 opcode
  const data = ethers.utils.solidityPack(
    ["bytes32", "bytes", "bytes"],
    [saltHash, bytecode, encodedArgs],
  );

  // 3. estimate gas
  let gasRequired: BigNumber;
  try {
    gasRequired = await provider.estimateGas({
      to: commonFactory,
      data: data,
    });
  } catch (e) {
    gasRequired = BigNumber.from(6_000_000);
  }

  // 3. Create txn object
  const tx = {
    gasPrice: 100 * 10 ** 9, // TODO: find a reasonable value
    gasLimit: gasRequired.toNumber(),
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
    gasPrice: tx.gasPrice,
    gasLimit: tx.gasLimit,
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
  await deployCommonFactory(signer, provider);

  const deployers = [];
  const txns = [];
  let totalValueToSplit: BigNumber = BigNumber.from(0);

  for (let contractType of contractTypes as InfraContractType[]) {
    const txInfo = INFRA_CONTRACTS_MAP[contractType].txInfo;

    // Check if the infra contract is already deployed
    const code = await provider.getCode(txInfo.predictedAddress);

    if (code === "0x") {
      // If contract doesn't exist, then fund the derived signer (derived from custom signature)
      let fundAddr = {
        deployer: txInfo.keylessData.keylessSigner,
        value: txInfo.keylessData.gasLimit * txInfo.keylessData.gasPrice,
      };

      totalValueToSplit = totalValueToSplit.add(fundAddr.value);
      deployers.push(fundAddr);

      txns.push({
        predictedAddress: txInfo.predictedAddress,
        txn: txInfo.keylessData.keylessTxnString,
      });
    }
  }

  // send funds to deployer wallets
  const splitDeployer = new ethers.ContractFactory([], splitBytecode)
    .connect(signer)
    .deploy(deployers, { value: totalValueToSplit });
  await (await splitDeployer).deployed();

  // Send the serialzed txns (evm will find out signer and target from this txn string)
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
  create2FactoryAddress: string,
  contractTypes?: InfraContractType[],
): Promise<string> {
  // if (!contractTypes) {
  //   contractTypes = Object.keys(INFRA_CONTRACTS_MAP);
  // }

  const txns = [];
  let cloneFactory = "";

  for (let contractType of contractTypes as InfraContractType[]) {
    const txInfo = INFRA_CONTRACTS_MAP[contractType].txInfo;

    // Check if the infra contract is already deployed
    const computedAddress = await computeDeploymentAddress(
      txInfo.bytecode,
      txInfo.encodedArgs,
      create2FactoryAddress,
    );
    const code = await provider.getCode(computedAddress);

    console.log("computed address: ", computedAddress);
    if (contractType === "cloneFactory") {
      cloneFactory = computedAddress;
    }
    if (code === "0x") {
      // get init bytecode
      const deployData = txInfo.signerDeployData.initBytecodeWithSalt;

      txns.push({
        predictedAddress: computedAddress,
        to: create2FactoryAddress,
        data: deployData,
      });
    }
  }

  // Call/deploy the throaway-deployer only if there are any contracts to deploy
  if (txns.length > 0) {
    // Using the deployer contract, send the deploy transactions to common factory with a signer
    const deployer = new ethers.ContractFactory(deployerAbi, deployerBytecode)
      .connect(signer)
      .deploy(txns);
    await (await deployer).deployed();
  }

  return cloneFactory;
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
  create2FactoryAddress: string,
) {
  // Check if the implementation contract is already deployed
  const code = await signer.provider?.getCode(predictedAddress);

  if (code === "0x") {
    const tx = {
      from: signer.getAddress(),
      to: create2FactoryAddress,
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
  provider: providers.Provider,
  create2FactoryAddress: string,
): Promise<DeploymentInfo> {
  const compilerMetadata = await fetchPreDeployMetadata(metadataUri, storage);

  // 1.  Get abi-encoded args and list of infra contracts required based on constructor params
  const { encodedArgs, infraContracts } =
    encodeConstructorParamsForImplementation(compilerMetadata, activeChainId);

  // 2. Compute the CREATE2 address
  const predictedAddress = await computeDeploymentAddress(
    compilerMetadata.bytecode,
    encodedArgs,
    create2FactoryAddress,
  );

  // 3. Construct keyless txn
  const keylessData = await constructKeylessDeployTx(
    compilerMetadata.bytecode,
    encodedArgs,
    provider,
  );

  // 4. Get init-bytecode packed with salt -- to be used if deploying with a signer
  const signerDeployData = getInitBytecodeWithSalt(
    compilerMetadata.bytecode,
    encodedArgs,
  );

  // 5. Add TWStatelessFactory and Forwarder to the list of infra contracts --
  // these must be deployed regardless of constructor params of implementation contract
  infraContracts.push(Forwarder.contractType);
  infraContracts.push(CloneFactory.contractType);

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
  const constructorParamValues = constructorParams.map((p) => {
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

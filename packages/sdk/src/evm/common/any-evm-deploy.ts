import { getNativeTokenByChainId } from "../constants";
import { InfraContractType } from "../core/types";
import { PreDeployMetadataFetched } from "../schema";
import {
  extractConstructorParamsFromAbi,
  fetchPreDeployMetadata,
} from "./feature-detection";
import {
  CloneFactory,
  EOAForwarder,
  Forwarder,
  // INFRA_CONTRACTS_MAP,
  NativeTokenWrapper,
} from "./infra-data";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { utils, constants } from "ethers";
// @yash you can *never* use hardhat ethers anywhere outside of tests
// import { ethers as hardhatEthers } from "hardhat";

// type InfraTxInfo = {
//   predictedAddress: string;
//   tx: string;
//   from: string;
//   deployData: string;
// };

const customSigInfo = {
  v: 27,
  r: "0x2222222222222222222222222222222222222222222222222222222222222222",
  s: "0x2222222222222222222222222222222222222222222222222222222222222222",
};
export const commonFactory = "0x4e59b44847b379578588920cA78FbF26c0B4956C";

// export async function deployCommonFactory(signer: Signer) {
//   let factoryCode = await hardhatEthers.provider.getCode(commonFactory);
//   // deploy community factory if not already deployed
//   if (factoryCode == "0x") {
//     console.log("zero code");
//     // send balance
//     let refundTx = {
//       to: "3fab184622dc19b6109349b94811493bf2a45362",
//       value: hardhatEthers.utils.parseEther("0.01"), // TODO: estimate gas/value
//     };
//     await signer.sendTransaction(refundTx);

//     // deploy
//     try {
//       const tx = await hardhatEthers.provider.sendTransaction(
//         "0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222",
//       );
//     } catch (err) {
//       console.log("Couldn't deploy factory");
//       console.log(err);
//       process.exit(1);
//     }

//     // check
//     factoryCode = await hardhatEthers.provider.getCode(commonFactory);
//     console.log("deployed code: ", factoryCode);
//   }
// }

export async function constructKeylessTx(bytecode: string, args: string) {
  const bytecodeHash = utils.id(bytecode);
  const salt = `tw.${bytecodeHash}`;
  const saltHash = utils.id(salt);

  const data = utils.solidityPack(
    ["bytes32", "bytes", "bytes"],
    [saltHash, bytecode, args],
  );

  const tx = {
    gasPrice: 100 * 10 ** 9, // TODO: dynamic gas estimation
    gasLimit: 5000000, // TODO: dynamic gas estimation
    to: commonFactory,
    value: 0,
    nonce: 0,
    data: data,
  };
  const customSignature = utils.joinSignature(customSigInfo);
  const serializedTestTx = utils.serializeTransaction(tx);

  const addr = utils.recoverAddress(
    utils.arrayify(utils.keccak256(serializedTestTx)),
    customSignature,
  );

  const signedSerializedTx = utils.serializeTransaction(tx, customSigInfo);

  return {
    addr,
    signedSerializedTx,
  };
}

export async function computeDeploymentAddress(bytecode: string, args: string) {
  const bytecodeHash = utils.id(bytecode);
  const salt = `tw.${bytecodeHash}`;
  const saltHash = utils.id(salt);

  const deployData = utils.solidityPack(
    ["bytes32", "bytes", "bytes"],
    [saltHash, bytecode, args],
  );

  const initBytecode = utils.solidityPack(["bytes", "bytes"], [bytecode, args]);
  const deployInfoPacked = utils.solidityPack(
    ["bytes1", "address", "bytes32", "bytes32"],
    [
      "0xff",
      commonFactory,
      saltHash,
      utils.solidityKeccak256(["bytes"], [initBytecode]),
    ],
  );
  const addr = utils.solidityKeccak256(["bytes"], [deployInfoPacked]);

  return { predictedAddress: `0x${addr.slice(26)}`, deployData };
}

// async function deployInfraKeyless(
//   signer: Signer,
//   provider: providers.Provider,
//   contractTypes?: InfraContractType[],
// ) {
//   // if (!contractTypes) {
//   //   contractTypes = Object.keys(INFRA_CONTRACTS_MAP);
//   // }
//   // create2 factory
//   await deployCommonFactory(signer);

//   for (let contractType of contractTypes as InfraContractType[]) {
//     const txInfo = INFRA_CONTRACTS_MAP[contractType].txInfo;

//     const code = await hardhatEthers.provider.getCode(txInfo.predictedAddress);
//     if (code === "0x") {
//       let fundAddr = {
//         to: txInfo.from,
//         value: hardhatEthers.utils.parseEther("1"),
//       };
//       await signer.sendTransaction(fundAddr);

//       await (await provider.sendTransaction(txInfo.tx)).wait();
//     }
//   }
// }

// async function deployInfraWithSigner(
//   signer: Signer,
//   contractTypes?: InfraContractType[],
// ) {
//   // if (!contractTypes) {
//   //   contractTypes = Object.keys(INFRA_CONTRACTS_MAP);
//   // }
//   // create2 factory
//   await deployCommonFactory(signer);

//   for (let contractType of contractTypes as InfraContractType[]) {
//     const txInfo = INFRA_CONTRACTS_MAP[contractType].txInfo;

//     const code = await hardhatEthers.provider.getCode(txInfo.predictedAddress);
//     if (code === "0x") {
//       // get init bytecode
//       const deployData = txInfo.deployData;

//       const tx = {
//         from: signer.getAddress(),
//         to: commonFactory,
//         value: 0,
//         nonce: await signer.getTransactionCount("latest"),
//         data: deployData,
//       };

//       await (await signer.sendTransaction(tx)).wait();
//     }
//   }
// }

export async function getDeploymentInfo(
  metadataUri: string,
  activeChainId: number,
  storage: ThirdwebStorage,
): Promise<{
  predictedAddress: string;
  deployData: any;
  addr: string;
  signedSerializedTx: string;
  infraContractTypes: InfraContractType[];
}> {
  // await deployInfraKeyless();
  // await deployInfraWithSigner();

  const compilerMetadata = await fetchPreDeployMetadata(metadataUri, storage);

  const { encodedArgs, contractTypes } =
    encodeConstructorParamsForImplementation(compilerMetadata, activeChainId);

  const deployment = await computeDeploymentAddress(
    compilerMetadata.bytecode,
    encodedArgs,
  );

  const keyless = await constructKeylessTx(
    compilerMetadata.bytecode,
    encodedArgs,
  );

  contractTypes.push(CloneFactory.contractType);
  contractTypes.push(Forwarder.contractType);

  return { ...deployment, ...keyless, infraContractTypes: contractTypes };
}

function encodeConstructorParamsForImplementation(
  compilerMetadata: PreDeployMetadataFetched,
  chainId: number,
) {
  const contractTypes: InfraContractType[] = [];
  const constructorParams = extractConstructorParamsFromAbi(
    compilerMetadata.abi,
  );
  const constructorParamTypes = constructorParams.map((p) => p.type);
  const constructorParamValues = constructorParams.map(async (p) => {
    if (p.name.includes("nativeTokenWrapper")) {
      let nativeTokenWrapperAddress =
        getNativeTokenByChainId(chainId).wrapped.address;

      if (nativeTokenWrapperAddress === constants.AddressZero) {
        nativeTokenWrapperAddress = NativeTokenWrapper.txInfo.predictedAddress;
        contractTypes.push(NativeTokenWrapper.contractType);
      }

      return nativeTokenWrapperAddress;
    } else if (p.name.includes("trustedForwarder")) {
      contractTypes.push(EOAForwarder.contractType);
      return EOAForwarder.txInfo.predictedAddress;
    } else {
      return "";
    }
  });
  const encodedArgs = utils.defaultAbiCoder.encode(
    constructorParamTypes,
    constructorParamValues,
  );
  return { encodedArgs, contractTypes };
}

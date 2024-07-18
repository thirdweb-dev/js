import { utils } from "ethers";
import invariant from "tiny-invariant";

import { isZkContractDeployed } from "./isZkContractDeployed";
import {
  Contract,
  Signer,
  Wallet,
  ContractFactory as ZkContractFactory,
} from "zksync-ethers";
import { DeployOptions } from "../types/deploy/deploy-options";
import {
  KNOWN_CODES_STORAGE,
  getMarkerAbi,
  singletonDeployAbi,
} from "./constants";
import { PrecomputedDeploymentTransaction } from "./types/deploy-data";
import { zkVerify } from "./zksync-verification";
import { blockExplorerApiMap } from "./constants/addresses";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ThirdwebSDK } from "../core/sdk";

/**
 * Deploy a contract at a deterministic address, using Create2 method
 * Address depends on the Create2 factory address.
 *
 * @public
 *
 * @param signer - The signer to use
 * @param bytecode - The bytecode to deploy
 * @param encodedArgs - The encoded constructor args to use
 * @param create2FactoryAddress - The create2 factory address to use
 */
export async function zkDeployContractDeterministic(
  signer: Signer,
  transaction: PrecomputedDeploymentTransaction,
  storage?: ThirdwebStorage,
  metadataUri?: string,
  options?: DeployOptions,
  gasLimit: number = 5_000_000,
) {
  // Check if the implementation contract is already deployed
  invariant(signer.provider, "Provider required");
  const contractDeployed = await isZkContractDeployed(
    transaction.predictedAddress,
    signer.provider,
  );

  if (!contractDeployed) {
    // check if bytecodehash is known
    const kcs = new Contract(KNOWN_CODES_STORAGE, getMarkerAbi, signer);
    const marker = await kcs.getMarker(transaction.bytecodeHash);
    const parsedMarker = marker.toString();

    // if not known, deploy once directly (create, not create2)
    if (parsedMarker !== "1") {
      try {
        const implFactory = new ZkContractFactory(
          transaction.abi,
          transaction.bytecode,
          signer,
          "create",
        );
        console.debug(`Bytecodehash not known. Deploying contract directly.`);
        const impl = await implFactory.deploy(...transaction.params);
        await impl.deployed();
      } catch (e) {
        throw new Error("Error deploying directly.");
      }
    }

    // deploy again with create2
    console.debug(
      `deploying contract via create2 factory at: ${transaction.predictedAddress}`,
    );

    const singleton = new Contract(
      transaction.to || "0xa51baf6a9c0ef5Db8C1898d5aDD92Bf3227d6088",
      singletonDeployAbi,
      signer,
    );

    const salt = options?.saltForProxyDeploy
      ? utils.id(options.saltForProxyDeploy)
      : utils.id("thirdweb");

    options?.notifier?.("deploying", "preset");
    try {
      const deployTx = await singleton.deploy(
        salt,
        transaction.bytecodeHash,
        transaction.constructorCalldata,
      );
      await deployTx.wait();
      options?.notifier?.("deployed", "preset");
    } catch (e: any) {
      if (e.toString().includes(`method="estimateGas"`)) {
        const deployTx = await singleton.deploy(
          salt,
          transaction.bytecodeHash,
          transaction.constructorCalldata,
          {
            gasLimit,
          },
        );
        await deployTx.wait();
        options?.notifier?.("deployed", "preset");
      } else {
        console.debug("error estimating gas while deploying prebuilt: ", e);
      }
    }

    // register on multichain registry, and verify -- no await
    if (metadataUri && storage) {
      const chainId = await signer.getChainId();
      try {
        registerContractOnMultiChainRegistry(
          transaction.predictedAddress,
          chainId,
          metadataUri,
        );
      } catch (error) {}

      zkVerify(
        transaction.predictedAddress,
        chainId,
        blockExplorerApiMap[chainId],
        "",
        storage,
        metadataUri,
      ).catch((error) => {
        console.warn("Error verifying contract", error);
      });
    }
  }
}

export async function registerContractOnMultiChainRegistry(
  address: string,
  chainId: number,
  metadataURI: string,
) {
  try {
    // random wallet is fine here, we're doing gasless calls
    const wallet = Wallet.createRandom();
    const sdk = ThirdwebSDK.fromPrivateKey(wallet.privateKey, "polygon", {
      gasless: {
        openzeppelin: {
          relayerUrl:
            "https://api.defender.openzeppelin.com/autotasks/dad61716-3624-46c9-874f-0e73f15f04d5/runs/webhook/7d6a1834-dd33-4b7b-8af4-b6b4719a0b97/FdHMqyF3p6MGHw6K2nkLsv",
          relayerForwarderAddress: "0x409d530a6961297ece29121dbee2c917c3398659",
        },
        experimentalChainlessSupport: true,
      },
    });
    const existingMeta = await sdk.multiChainRegistry.getContractMetadataURI(
      chainId,
      address,
    );
    if (existingMeta && existingMeta !== "") {
      return true;
    }
    // add to multichain registry with metadata uri unlocks the contract on SDK/dashboard for everyone
    await sdk.multiChainRegistry.addContract({
      address,
      chainId,
      metadataURI,
    });
    return true;
  } catch (e) {
    console.debug("Error registering contract on multi chain registry", e);
    return false;
  }
}

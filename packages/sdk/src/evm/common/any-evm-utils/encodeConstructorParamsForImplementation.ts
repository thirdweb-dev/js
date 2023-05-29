import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BytesLike, ethers, providers } from "ethers";
import invariant from "tiny-invariant";
import { getNativeTokenByChainId } from "../../constants/currency";
import { PreDeployMetadataFetched } from "../../schema/contracts/custom";
import { ConstructorParamMap } from "../../types/any-evm/deploy-data";
import { extractConstructorParamsFromAbi } from "../feature-detection/extractConstructorParamsFromAbi";
import { caches } from "./caches";
import { computeDeploymentInfo } from "./computeDeploymentInfo";

/**
 * @internal
 *
 * Determine constructor params required by an implementation contract.
 * Return abi-encoded params.
 */
export async function encodeConstructorParamsForImplementation(
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
          if (!caches.deploymentPresets["WETH9"]) {
            caches.deploymentPresets["WETH9"] = deploymentInfo;
          }

          nativeTokenWrapperAddress =
            deploymentInfo.transaction.predictedAddress;
        }

        return nativeTokenWrapperAddress;
      } else if (p.name && p.name.includes("trustedForwarder")) {
        if (compilerMetadata.name === "Pack") {
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
          if (!caches.deploymentPresets["ForwarderEOAOnly"]) {
            caches.deploymentPresets["ForwarderEOAOnly"] = deploymentInfo;
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
        if (!caches.deploymentPresets["Forwarder"]) {
          caches.deploymentPresets["Forwarder"] = deploymentInfo;
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

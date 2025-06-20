import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { encodeAbiParameters } from "../../utils/abi/encodeAbiParameters.js";
import { computePublishedContractAddress } from "../../utils/any-evm/compute-published-contract-address.js";
import type { ImplementationConstructorParam } from "./process-ref-deployments.js";

type ComputeRefDeploymentsOptions = {
  client: ThirdwebClient;
  chain: Chain;
  paramValue: string | ImplementationConstructorParam;
};

/**
 * Computes addresses for published contract references in constructor params.
 * @returns Param value after processing references.
 * @internal
 */
export async function computeRefDeployments(
  options: ComputeRefDeploymentsOptions,
): Promise<string | string[]> {
  const { client, chain, paramValue } = options;

  if (typeof paramValue === "object") {
    if (
      "defaultValue" in paramValue &&
      paramValue.defaultValue &&
      paramValue.defaultValue.length > 0
    ) {
      return paramValue.defaultValue;
    }

    if ("dynamicValue" in paramValue && paramValue.dynamicValue) {
      const dynamicValue = paramValue.dynamicValue;
      const contracts = dynamicValue.refContracts;

      if (dynamicValue.type === "address") {
        if (!contracts || contracts.length === 0 || !contracts[0]?.contractId) {
          throw new Error("Invalid or empty param value");
        }
        const salt =
          contracts[0]?.salt && contracts[0]?.salt.length > 0
            ? contracts[0]?.salt
            : "";

        const addr = await computePublishedContractAddress({
          chain,
          client,
          contractId: contracts[0]?.contractId,
          publisher: contracts[0]?.publisherAddress,
          salt,
          version: contracts[0]?.version,
        });

        return addr;
      }

      if (dynamicValue.type === "address[]") {
        if (!contracts || contracts.length === 0) {
          throw new Error("Invalid or empty param value");
        }
        const addressArray: string[] = [];

        for (const c of contracts) {
          const salt = c?.salt && c?.salt.length > 0 ? c?.salt : "";

          addressArray.push(
            await computePublishedContractAddress({
              chain,
              client,
              contractId: c.contractId,
              publisher: c.publisherAddress,
              salt,
              version: c.version,
            }),
          );
        }

        return addressArray;
      }

      if (dynamicValue.type === "bytes") {
        if (!dynamicValue.paramsToEncode) {
          throw new Error("Invalid or empty param value");
        }
        const paramsToEncode = dynamicValue.paramsToEncode[0];

        if (paramsToEncode) {
          const types: string[] = [];
          const values: (string | string[])[] = [];
          for (const v of paramsToEncode) {
            types.push(v.type);

            if (v.defaultValue) {
              values.push(v.defaultValue);
            } else if (v.dynamicValue) {
              values.push(
                await computeRefDeployments({
                  chain,
                  client,
                  paramValue: v,
                }),
              );
            }
          }

          return encodeAbiParameters(
            types.map((t) => {
              return { type: t };
            }),
            values,
          );
        }
      }

      if (dynamicValue.type === "bytes[]") {
        if (!dynamicValue.paramsToEncode) {
          throw new Error("Invalid or empty param value");
        }
        const bytesArray: string[] = [];
        const paramArray = dynamicValue.paramsToEncode;

        for (const a of paramArray) {
          const paramsToEncode = a;

          if (paramsToEncode) {
            const types: string[] = [];
            const values: (string | string[])[] = [];
            for (const v of paramsToEncode) {
              types.push(v.type);

              if (v.defaultValue) {
                values.push(v.defaultValue);
              } else if (v.dynamicValue) {
                values.push(
                  await computeRefDeployments({
                    chain,
                    client,
                    paramValue: v,
                  }),
                );
              }
            }

            bytesArray.push(
              encodeAbiParameters(
                types.map((t) => {
                  return { type: t };
                }),
                values,
              ),
            );
          }
        }

        return bytesArray;
      }
    }
  }

  return paramValue as string;
}

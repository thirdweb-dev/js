import { BigNumber, ethers } from "ethers";
import invariant from "tiny-invariant";

export function convertParamValues(
  constructorParamTypes: string[],
  constructorParamValues: any[],
) {
  // check that both arrays are same length
  if (constructorParamTypes.length !== constructorParamValues.length) {
    throw Error(
      `Passed the wrong number of constructor arguments: ${constructorParamValues.length}, expected ${constructorParamTypes.length}`,
    );
  }
  return constructorParamTypes.map((p, index) => {
    if (p === "tuple" || p.endsWith("[]")) {
      if (typeof constructorParamValues[index] === "string") {
        return JSON.parse(constructorParamValues[index]);
      } else {
        return constructorParamValues[index];
      }
    }
    if (p === "bytes32") {
      invariant(
        ethers.utils.isHexString(constructorParamValues[index]),
        `Could not parse bytes32 value. Expected valid hex string but got "${constructorParamValues[index]}".`,
      );
      return ethers.utils.hexZeroPad(constructorParamValues[index], 32);
    }
    if (p.startsWith("bytes")) {
      invariant(
        ethers.utils.isHexString(constructorParamValues[index]),
        `Could not parse bytes value. Expected valid hex string but got "${constructorParamValues[index]}".`,
      );
      return constructorParamValues[index];
    }
    if (p.startsWith("uint") || p.startsWith("int")) {
      return BigNumber.from(constructorParamValues[index].toString());
    }
    return constructorParamValues[index];
  });
}

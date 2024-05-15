import { AbiTypeSchema } from "../../schema/contracts/custom";
import { z } from "zod";

/**
 * @internal
 */
export function toJSType(
  contractType: z.input<typeof AbiTypeSchema>,
  isReturnType = false,
  withName = false,
): string {
  let jsType = contractType.type;
  let isArray = false;
  if (jsType.endsWith("[]")) {
    isArray = true;
    jsType = jsType.slice(0, -2);
  }
  if (jsType.startsWith("bytes")) {
    jsType = "BytesLike";
  }
  if (jsType.startsWith("uint") || jsType.startsWith("int")) {
    jsType = isReturnType ? "BigNumber" : "BigNumberish";
  }
  if (jsType.startsWith("bool")) {
    jsType = "boolean";
  }
  if (jsType === "address") {
    jsType = "string";
  }
  if (jsType === "tuple") {
    if (contractType.components) {
      jsType = `{ ${contractType.components
        .map((a) => toJSType(a, false, true))
        .join(", ")} }`;
    }
  }
  if (isArray) {
    jsType += "[]";
  }
  if (withName) {
    jsType = `${contractType.name}: ${jsType}`;
  }
  return jsType;
}

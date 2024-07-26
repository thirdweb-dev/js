import { BigNumber } from "ethers";
import { isBytesLike } from "ethers/lib/utils";
import { isAddress } from "thirdweb/utils";

// int and uint
const calculateIntMinValues = (solidityType: string) => {
  const isIntType = solidityType.startsWith("int");
  const isUintType = solidityType.startsWith("uint");

  const bitLength = Number.parseInt(
    solidityType.replace(/int|uint/g, "") || "256",
    10,
  );

  const min = BigNumber.from(2).pow(bitLength);

  if (isIntType) {
    return min.div(2).mul(-1);
  }
  if (isUintType) {
    return BigNumber.from(0);
  }
  return BigNumber.from(0);
};

const calculateIntMaxValues = (solidityType: string) => {
  const isIntType = solidityType.startsWith("int");
  const isUintType = solidityType.startsWith("uint");

  const bitLength = Number.parseInt(
    solidityType.replace(/int|uint/g, "") || "256",
    10,
  );

  const max = BigNumber.from(2).pow(bitLength);

  if (isIntType) {
    return max.div(2).sub(1);
  }
  if (isUintType) {
    return max.sub(1);
  }
  return BigNumber.from(0);
};

// biome-ignore lint/suspicious/noExplicitAny: FIXME
export const validateInt = (value: any, solidityType: string) => {
  const min = calculateIntMinValues(solidityType);
  const max = calculateIntMaxValues(solidityType);

  // biome-ignore lint/style/noParameterAssign: FIXME
  value = value.toString();

  // biome-ignore lint/style/noParameterAssign: FIXME
  value = value.replace(/,/g, ".");

  if (!value.match(new RegExp(/^(?!-0(\.0+)?$)-?(0|[1-9]\d*)(\.\d+)?$/))) {
    return {
      type: "pattern",
      message: "Input is not a valid number.",
    };
  }
  if (value.includes(".") || value.includes(",")) {
    return {
      type: "pattern",
      message:
        "Can't use decimals, you need to convert your input to Wei first.",
    };
  }
  try {
    const bigNumber = BigNumber.from(value || 0);
    if (bigNumber.lt(min)) {
      return {
        type: "minValue",
        message: solidityType.startsWith("uint")
          ? "Value must be a positive number for uint types."
          : `Value is lower than what ${solidityType} can store.}`,
      };
    }
    if (bigNumber.gt(max)) {
      return {
        type: "maxValue",
        message: `Value is higher than what ${solidityType} can store.`,
      };
    }
  } catch (error) {
    return {
      type: "pattern",
      message: "Input is not a valid number.",
    };
  }

  return null;
};

// bytes
const isValidBytes = (value: string, solidityType: string) => {
  const isBytesType = solidityType === "bytes";

  if (isBytesType && value === "[]") {
    return true;
  }

  const maxLength =
    solidityType === "byte"
      ? 1
      : Number.parseInt(solidityType.replace("bytes", "") || "0", 10);

  if (solidityType === "bytes32" && (value === "[]" || value === "0x00")) {
    return true;
  }

  if (value?.startsWith("[") && value?.endsWith("]")) {
    try {
      const arrayify = JSON.parse(value);
      return isBytesType ? !!arrayify.length : arrayify.length === maxLength;
    } catch (error) {
      return false;
    }
  }

  if (isBytesType) {
    return isBytesLike(value);
  }
  if (value.length !== maxLength * 2 + 2) {
    return false;
  }

  return true;
};

export const validateBytes = (value: string, solidityType: string) => {
  if (!value?.startsWith("0x") && !value?.startsWith("[")) {
    return {
      type: "pattern",
      message:
        "Invalid input. Accepted formats are hex strings (0x...) or array of numbers ([...]).",
    };
  }
  if (!isValidBytes(value, solidityType)) {
    return {
      type: "pattern",
      message: `Value is not a valid ${solidityType}. Please check the length.`,
    };
  }

  return null;
};

// address
export const validateAddress = (value: string) => {
  if (!isAddress(value) && !value.endsWith(".eth")) {
    return {
      type: "pattern",
      message: "Input is not a valid address or ENS name.",
    };
  }

  return null;
};

// all
export const validateSolidityInput = (value: string, solidityType: string) => {
  if (solidityType.startsWith("int") || solidityType.startsWith("uint")) {
    return validateInt(value, solidityType);
  }
  // TODO: bytes array not working right now
  /* else if (solidityType.startsWith("byte")) {
    return validateBytes(value, solidityType);
  } */
  if (solidityType === "address") {
    return validateAddress(value);
  }

  return null;
};

// other stuff
export const camelToTitle = (string: string): string => {
  if (string[0] === "_") {
    // biome-ignore lint/style/noParameterAssign: FIXME
    string = string.slice(1);
  }
  return string
    .replace(/^[a-z]/, (match) => match.toUpperCase())
    .replace(/([A-Z]{1}[a-z]*|_[a-z])/g, (m) =>
      m.length > 1
        ? ` ${m
            .replace(/^_/, "")
            .replace(/^[a-z]/, (match) => match.toUpperCase())}`
        : m.replace(/^_/, "").replace(/^[a-z]/, (match) => match.toUpperCase()),
    );
};

type FunctionComponents = {
  name: string;
  type: string;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  [key: string]: any;
}[];

// biome-ignore lint/suspicious/noExplicitAny: FIXME
function formatInputType(type: string, components?: FunctionComponents): any {
  if (type?.includes("[]")) {
    const obj = [];
    obj.push(formatInputType(type.replace("[]", ""), components));
    return obj;
  }
  if (type?.includes("tuple")) {
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    const obj: any = {};
    // biome-ignore lint/complexity/noForEach: FIXME
    components?.forEach((component) => {
      obj[component.name] = formatInputType(
        component.type,
        component.components,
      );
    });
    return obj;
  }
  if (type?.includes("string")) {
    return "...";
  }
  if (type?.includes("int")) {
    return "0";
  }
  if (type?.includes("bool")) {
    return true;
  }
  if (type?.includes("address")) {
    return "0x...";
  }
  return "0";
}

export function formatHint(
  type: string,
  components?: FunctionComponents,
): string {
  const placeholder = formatInputType(type, components);
  return JSON.stringify(placeholder)
    ?.replaceAll(",", ", ")
    .replaceAll(":", ": ")
    .replaceAll("{", "{ ")
    .replaceAll("}", " }");
}

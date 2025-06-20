import { isAddress, isBytes, isHex, isValidENSName } from "thirdweb/utils";

// int and uint
function calculateIntMinValues(solidityType: string) {
  const isIntType = solidityType.startsWith("int");
  const isUintType = solidityType.startsWith("uint");

  const bitLength = Number.parseInt(
    solidityType.replace(/int|uint/g, "") || "256",
    10,
  );

  const min = 2n ** BigInt(bitLength);

  if (isIntType) {
    return min / -2n;
  }
  if (isUintType) {
    return 0n;
  }
  return 0n;
}

const calculateIntMaxValues = (solidityType: string) => {
  const isIntType = solidityType.startsWith("int");
  const isUintType = solidityType.startsWith("uint");

  const bitLength = Number.parseInt(
    solidityType.replace(/int|uint/g, "") || "256",
    10,
  );

  const max = 2n ** BigInt(bitLength);

  if (isIntType) {
    return max / 2n - 1n;
  }
  if (isUintType) {
    return max - 1n;
  }
  return 0n;
};

// biome-ignore lint/suspicious/noExplicitAny: FIXME
export const validateInt = (value: any, solidityType: string) => {
  const min = calculateIntMinValues(solidityType);
  const max = calculateIntMaxValues(solidityType);

  value = value.toString();

  value = value.replace(/,/g, ".");

  if (!value.match(new RegExp(/^(?!-0(\.0+)?$)-?(0|[1-9]\d*)(\.\d+)?$/))) {
    return {
      message: "Input is not a valid number.",
      type: "pattern",
    };
  }
  if (value.includes(".") || value.includes(",")) {
    return {
      message:
        "Can't use decimals, you need to convert your input to Wei first.",
      type: "pattern",
    };
  }
  try {
    const bigNumber = value || 0n;
    if (bigNumber < min) {
      return {
        message: solidityType.startsWith("uint")
          ? "Value must be a positive number for uint types."
          : `Value is lower than what ${solidityType} can store.}`,
        type: "minValue",
      };
    }
    if (bigNumber > max) {
      return {
        message: `Value is higher than what ${solidityType} can store.`,
        type: "maxValue",
      };
    }
  } catch {
    return {
      message: "Input is not a valid number.",
      type: "pattern",
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
    } catch {
      return false;
    }
  }

  if (isBytesType) {
    return isHex(value) || isBytes(value);
  }
  if (value.length !== maxLength * 2 + 2) {
    return false;
  }

  return true;
};

export const validateBytes = (value: string, solidityType: string) => {
  if (!value?.startsWith("0x") && !value?.startsWith("[")) {
    return {
      message:
        "Invalid input. Accepted formats are hex strings (0x...) or array of numbers ([...]).",
      type: "pattern",
    };
  }
  if (!isValidBytes(value, solidityType)) {
    return {
      message: `Value is not a valid ${solidityType}. Please check the length.`,
      type: "pattern",
    };
  }

  return null;
};

// address
export const validateAddress = (value: string) => {
  if (!isAddress(value) && !isValidENSName(value)) {
    return {
      message: "Input is not a valid address or ENS name.",
      type: "pattern",
    };
  }

  return null;
};

// all
export const validateSolidityInput = (value: string, solidityType: string) => {
  if (
    (solidityType.startsWith("int") || solidityType.startsWith("uint")) &&
    !solidityType.endsWith("]")
  ) {
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

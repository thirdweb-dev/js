import { BigNumber, constants, utils } from "ethers";
import { isBytesLike } from "ethers/lib/utils";

// int and uint
const intMinValues: Record<string, BigNumber> = {
  int8: BigNumber.from("-128"),
  int16: BigNumber.from("-32768"),
  int32: BigNumber.from("-2147483648"),
  int64: BigNumber.from("-9223372036854775808"),
  int128: BigNumber.from("-170141183460469231731687303715884105728"),
  int256: BigNumber.from(constants.MinInt256),
  int: BigNumber.from(constants.MinInt256),
  uint8: BigNumber.from(0),
  uint16: BigNumber.from(0),
  uint32: BigNumber.from(0),
  uint64: BigNumber.from(0),
  uint128: BigNumber.from(0),
  uint256: BigNumber.from(0),
  uint: BigNumber.from(0),
};

const intMaxValues: Record<string, BigNumber> = {
  int8: BigNumber.from("127"),
  int16: BigNumber.from("32767"),
  int32: BigNumber.from("2147483647"),
  int64: BigNumber.from("9223372036854775807"),
  int128: BigNumber.from("170141183460469231731687303715884105727"),
  int256: constants.MaxInt256,
  int: constants.MaxInt256,
  uint8: BigNumber.from("255"),
  uint16: BigNumber.from("65535"),
  uint32: BigNumber.from("4294967295"),
  uint64: BigNumber.from("18446744073709551615"),
  uint128: BigNumber.from("340282366920938463463374607431768211455"),
  uint256: constants.MaxUint256,
  uint: constants.MaxUint256,
};

export const validateInt = (value = "", solidityType: string) => {
  const min = intMinValues[solidityType];
  const max = intMaxValues[solidityType];

  value = value.toString();

  value = value.replace(/,/g, ".");

  if (!value.match(new RegExp(/^(?!-0(\.0+)?$)-?(0|[1-9]\d*)(\.\d+)?$/))) {
    return {
      type: "pattern",
      message: "Input is not a valid number.",
    };
  } else if (value.includes(".") || value.includes(",")) {
    return {
      type: "pattern",
      message:
        "Can't use decimals, you need to convert your input to Wei first.",
    };
  } else {
    try {
      const bigNumber = BigNumber.from(value || 0);
      if (bigNumber.lt(min)) {
        return {
          type: "minValue",
          message: solidityType.startsWith("uint")
            ? `Value must be a positive number for uint types.`
            : `Value is lower than what ${solidityType} can store.}`,
        };
      } else if (bigNumber.gt(max)) {
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
      : parseInt(solidityType.replace("bytes", "") || "0", 10);

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
      message: `Invalid input. Accepted formats are hex strings (0x...) or array of numbers ([...]).`,
    };
  } else if (!isValidBytes(value, solidityType)) {
    return {
      type: "pattern",
      message: `Value is not a valid ${solidityType}. Please check the length.`,
    };
  }

  return null;
};

// address
export const validateAddress = (value: string) => {
  if (!utils.isAddress(value) && !value.endsWith(".eth")) {
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
  else if (solidityType === "address") {
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
    .replace(/([A-Z]{1}[a-z]*|_[a-z])/g, function (m) {
      return m.length > 1
        ? ` ${m
            .replace(/^_/, "")
            .replace(/^[a-z]/, (match) => match.toUpperCase())}`
        : m.replace(/^_/, "").replace(/^[a-z]/, (match) => match.toUpperCase());
    });
};

type FunctionComponents = {
  name: string;
  type: string;
  [key: string]: any;
}[];

function formatInputType(type: string, components?: FunctionComponents): any {
  if (type?.includes("[]")) {
    const obj = [];
    obj.push(formatInputType(type.replace("[]", ""), components));
    return obj;
  } else if (type?.includes("tuple")) {
    const obj: any = {};
    components?.forEach((component) => {
      obj[component.name] = formatInputType(
        component.type,
        component.components,
      );
    });
    return obj;
  } else if (type?.includes("string")) {
    return "...";
  } else if (type?.includes("int")) {
    return "0";
  } else if (type?.includes("bool")) {
    return true;
  } else if (type?.includes("address")) {
    return "0x...";
  } else {
    return "0";
  }
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

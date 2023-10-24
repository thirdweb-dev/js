import { JSONOutput } from "typedoc";

export function getReadableType(typeObj: JSONOutput.SomeType): string {
  switch (typeObj.type) {
    // string, number, boolean, etc
    case "intrinsic": {
      return typeObj.name;
    }

    // { key: value }
    case "reflection": {
      if (typeObj.declaration.children) {
        return `{ ${typeObj.declaration.children
          ?.map((child) => {
            if (child.type) {
              return `${child.name}: ${getReadableType(child.type)}`;
            }
            return "";
          })
          .join(", \n")} }`;
      }
      return `{}`;
    }

    case "reference": {
      // SomeGeneric<T>
      if (typeObj.typeArguments) {
        return `${typeObj.name}<${typeObj.typeArguments
          .map(getReadableType)
          .join(", ")}>`;
      }
      return typeObj.name;
    }

    // T | U | V ...
    case "union": {
      return typeObj.types.map(getReadableType).join(" | ");
    }

    // null, undefined, literal string, literal number, etc
    case "literal": {
      if (typeof typeObj.value === "string") {
        return `"${typeObj.value}"`;
      }

      return typeObj.value + "";
    }

    // T[]
    case "array": {
      const type = getReadableType(typeObj.elementType);

      // larger types should be Array<SomeType> so that the type it is more readable
      if (type.length > 50) {
        return `Array<${type}>`;
      }
      return `${type}[]`;
    }

    case "conditional": {
      return `${getReadableType(typeObj.checkType)} extends ${getReadableType(
        typeObj.extendsType,
      )} ? ${getReadableType(typeObj.trueType)} : ${getReadableType(
        typeObj.falseType,
      )}`;
    }

    case "indexedAccess": {
      return `${getReadableType(typeObj.objectType)}[${getReadableType(
        typeObj.indexType,
      )}]`;
    }

    case "intersection": {
      return typeObj.types.map(getReadableType).join(" & ");
    }

    // { [Foo in Bar]: Baz }
    case "mapped": {
      return `{[${typeObj.parameter} in ${getReadableType(
        typeObj.parameterType,
      )}] : ${getReadableType(typeObj.templateType)}}`;
    }

    case "tuple": {
      if (typeObj.elements) {
        return `[${typeObj.elements.map(getReadableType).join(", ")}]`;
      }
      return `[]`;
    }

    default:
      throw new Error(
        `Failed to create a readable type for type "${typeObj.type}" }`,
      );
  }
}

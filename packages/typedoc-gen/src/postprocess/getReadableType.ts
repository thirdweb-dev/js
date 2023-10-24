import { JSONOutput, ReflectionKind } from "typedoc";

export function getReadableType(typeObj: JSONOutput.SomeType): string {
  switch (typeObj.type) {
    // string, number, boolean, etc
    case "intrinsic": {
      return typeObj.name;
    }

    // { key: value } or { key: () => Bar  }
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
      } else if (typeObj.declaration.signatures) {
        return typeObj.declaration.signatures
          .map(readableFunctionSignature)
          .join(" | ");
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

    // null, undefined, "hello", 12 etc
    case "literal": {
      if (typeof typeObj.value === "string") {
        return `"${typeObj.value}"`;
      }

      return typeObj.value + "";
    }

    // Foo[]
    case "array": {
      const type = getReadableType(typeObj.elementType);

      // larger types should be Array<SomeType> so that the type it is more readable
      if (type.length > 50) {
        return `Array<${type}>`;
      }
      return `${type}[]`;
    }

    // Foo extends Bar ? Baz : Qux
    case "conditional": {
      return `${getReadableType(typeObj.checkType)} extends ${getReadableType(
        typeObj.extendsType,
      )} ? ${getReadableType(typeObj.trueType)} : ${getReadableType(
        typeObj.falseType,
      )}`;
    }

    // Foo[Bar]
    case "indexedAccess": {
      return `${getReadableType(typeObj.objectType)}[${getReadableType(
        typeObj.indexType,
      )}]`;
    }

    // T & U & V ...
    case "intersection": {
      return typeObj.types.map(getReadableType).join(" & ");
    }

    // { [Foo in Bar]: Baz }
    case "mapped": {
      return `{[${typeObj.parameter} in ${getReadableType(
        typeObj.parameterType,
      )}] : ${getReadableType(typeObj.templateType)}}`;
    }

    // [A, B, C, ..]
    case "tuple": {
      if (typeObj.elements) {
        return `[${typeObj.elements.map(getReadableType).join(", ")}]`;
      }
      return `[]`;
    }

    // typeof Foo
    case "query": {
      return `typeof ${getReadableType(typeObj.queryType)}`;
    }

    // (keyof" | "unique" | "readonly") Foo
    case "typeOperator": {
      return `${typeObj.operator} ${getReadableType(typeObj.target)}`;
    }

    // `xxx${Foo}yyy`
    case "templateLiteral": {
      return (
        "`" +
        typeObj.head +
        typeObj.tail
          .map((t) => `\${${getReadableType(t[0])}}` + t[1])
          .join("") +
        "`"
      );
    }

    // infer Foo
    case "inferred": {
      return `infer ${typeObj.name}`;
    }

    // ...(Foo)
    case "rest": {
      return `...(${getReadableType(typeObj.elementType)})`;
    }

    case "unknown": {
      return typeObj.name;
    }

    case "predicate": {
      if (typeObj.targetType) {
        return `${typeObj.name} is ${getReadableType(typeObj.targetType)}`;
      }
      throw new Error("Failed to get readable type of type 'predicate' ");
    }

    default:
      throw new Error(
        `Failed to create a readable type for type "${typeObj.type}" }`,
      );
  }
}

// ( (arg1: type1, arg2: type2 ) => ReturnType )
function readableFunctionSignature(
  signature: JSONOutput.SignatureReflection,
): string {
  const args =
    signature.parameters
      ?.map((p) => (p.type ? `${p.name} : ${getReadableType(p.type)}` : p.name))
      .join(", ") || "";

  const returnType = signature.type
    ? ` => ${getReadableType(signature.type)}`
    : "";

  return `((${args})${returnType})`;
}

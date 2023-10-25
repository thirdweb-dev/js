import { JSONOutput } from "typedoc";
import {
  TypeDeclarationDoc,
  VariableDoc,
  VariableTypeDeclaration,
} from "../types";
import { getReadableType } from "../utils/getReadableType";
import { getFunctionDoc } from "./function";

export function getVariableDoc(
  data: JSONOutput.DeclarationReflection,
): VariableDoc {
  return {
    name: data.name,
    summary: data.comment?.summary,
    source: data.sources?.[0]?.url,
    type: data.type ? getReadableType(data.type) : undefined,
    typeDeclaration: data.type ? getDeclaration(data.type) : undefined,
    flags: Object.keys(data.flags).length > 0 ? data.flags : undefined,
  };
}

function getDeclaration(
  typeObj: JSONOutput.SomeType,
): VariableTypeDeclaration[] | undefined {
  if (typeObj.type === "reflection") {
    return typeObj.declaration.children?.map((child) => {
      if (child.signatures) {
        const output: VariableTypeDeclaration = getFunctionDoc(child);
        return output;
      }

      // when property is a assigned arrow function
      // Example: { bar: (a: number) => a + 2 }
      if (
        child.type?.type === "reflection" &&
        child.type.declaration.signatures
      ) {
        const output: VariableTypeDeclaration = getFunctionDoc(
          child.type.declaration,
        );
        // fix wrong name ( this is kinda hacky )
        output.name = child.name;
        return output;
      }

      if (child.type) {
        const output: VariableTypeDeclaration = {
          name: child.name,
          type: getReadableType(child.type),
          summary: child.comment?.summary,
        };

        return output;
      }

      throw new Error(`Unknown type declaration node ${child.name}`);
    });
  }

  if (typeObj.type === "array") {
    return getDeclaration(typeObj.elementType);
  }
}

import { JSONOutput } from "typedoc";
import { EnumDoc, InterfaceDoc, TypeDeclarationDoc } from "../types";
import { getReadableType } from "../utils/getReadableType";

export function getEnumDoc(data: JSONOutput.DeclarationReflection): EnumDoc {
  return {
    name: data.name,
    summary: data.comment?.summary,
    source: data.sources?.[0]?.url,
    members: getMembers(data),
  };
}

function getMembers(data: JSONOutput.DeclarationReflection) {
  if (!data.children) {
    throw new Error(`Failed to get members for enum ${data.name}`);
  }

  const output: EnumDoc["members"] = data.children.map((child) => {
    if (!child.type) {
      throw new Error(`No type found for enum member ${child.name}`);
    }
    return {
      name: child.name,
      value: getReadableType(child.type),
      summary: child.comment?.summary,
    };
  });

  return output;
}

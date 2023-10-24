import { ProcessedDoc } from "./types";
import { JSONOutput, ReflectionKind } from "typedoc";
import { getFunctionDoc } from "./processFunction";
import { isComponentType } from "./isComponentType";
import { getInterfaceDoc } from "./processInterface";
import { getEnumDoc } from "./processEnum";
import { getVariableDoc } from "./processVariable";

const groupNameMap = {
  Interfaces: "interfaces",
  "Type Aliases": "types",
  Variables: "variables",
  Functions: "functions",
  Classes: "classes",
  Enumerations: "enums",
} as const;

export function postprocess(inputData: JSONOutput.ProjectReflection) {
  const output: ProcessedDoc = {
    groups: {
      functions: [],
      hooks: [],
      variables: [],
      types: [],
      interfaces: [],
      components: [],
      enums: [],
      classes: [],
    },
  };

  // create a mapping from child id to data for lookup
  const childrenMap: Record<string, JSONOutput.DeclarationReflection> = {};
  inputData.children?.forEach((child) => {
    childrenMap[child.id] = child;
  });

  // create a groups structure
  inputData.groups?.forEach((group) => {
    if (group.title in groupNameMap) {
      const mappedTitle =
        groupNameMap[group.title as keyof typeof groupNameMap];

      group.children?.map(async (childId) => {
        const childData = childrenMap[childId];
        if (!childData) {
          throw new Error(`Failed to resolve child id ${childId}`);
        }

        switch (mappedTitle) {
          case "functions": {
            if (childData.name.startsWith("use")) {
              output.groups.hooks!.push(getFunctionDoc(childData));
            } else if (isComponentType(childData)) {
              output.groups.components!.push(getFunctionDoc(childData));
            } else {
              output.groups[mappedTitle]!.push(getFunctionDoc(childData));
            }
            break;
          }
          case "interfaces":
          case "types": {
            output.groups[mappedTitle]?.push(getInterfaceDoc(childData));
            break;
          }

          case "variables": {
            output.groups.variables.push(getVariableDoc(childData));
            break;
          }

          case "classes": {
            // TODO
            break;
          }

          case "enums": {
            output.groups.enums.push(getEnumDoc(childData));
          }
        }
      });
    }
  });

  return output;
}

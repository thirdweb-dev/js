import { ProcessedDoc } from "./types";
import { JSONOutput, ReflectionKind } from "typedoc";
import { getFunctionDoc } from "./nodes/function";
import { isComponentType } from "./utils/isComponentType";
import { getInterfaceDoc } from "./nodes/interface";
import { getEnumDoc } from "./nodes/enum";
import { getVariableDoc } from "./nodes/variable";
import { getClassDoc } from "./nodes/class";

const groupNameMap = {
  Interfaces: "types",
  "Type Aliases": "types",
  Variables: "variables",
  Functions: "functions",
  Classes: "classes",
  Enumerations: "enums",
} as const;

export function postprocess(inputData: JSONOutput.ProjectReflection) {
  const functions: ProcessedDoc["functions"] = [];
  const hooks: ProcessedDoc["hooks"] = [];
  const components: ProcessedDoc["components"] = [];
  const types: ProcessedDoc["types"] = [];
  const interfaces: ProcessedDoc["interfaces"] = [];
  const variables: ProcessedDoc["variables"] = [];
  const enums: ProcessedDoc["enums"] = [];
  const classes: ProcessedDoc["classes"] = [];

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
              hooks!.push(getFunctionDoc(childData));
            } else if (isComponentType(childData)) {
              components!.push(getFunctionDoc(childData));
            } else {
              functions.push(getFunctionDoc(childData));
            }
            break;
          }

          case "types": {
            types.push(getInterfaceDoc(childData));
            break;
          }

          case "variables": {
            variables.push(getVariableDoc(childData));
            break;
          }

          case "classes": {
            classes.push(getClassDoc(childData));
            break;
          }

          case "enums": {
            enums.push(getEnumDoc(childData));
          }
        }
      });
    }
  });

  const output: ProcessedDoc = {
    functions: functions.length > 0 ? functions : undefined,
    hooks: hooks.length > 0 ? hooks : undefined,
    variables: variables.length > 0 ? variables : undefined,
    types: types.length > 0 ? types : undefined,
    interfaces: interfaces.length > 0 ? interfaces : undefined,
    components: components.length > 0 ? components : undefined,
    enums: enums.length > 0 ? enums : undefined,
    classes: classes.length > 0 ? classes : undefined,
  };

  return output;
}

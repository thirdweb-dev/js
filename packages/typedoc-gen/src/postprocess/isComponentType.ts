import { JSONOutput } from "typedoc";

export function isComponentType(data: JSONOutput.DeclarationReflection) {
  return (
    data.signatures &&
    data.signatures[0] &&
    data.signatures[0].type?.type === "reference" &&
    data.signatures[0].type.name &&
    isComponentName(data.signatures[0].type.name) &&
    (data.signatures[0].type.name === "ReactNode" ||
      data.signatures[0].type.name === "Element")
  );
}
function isComponentName(str: string) {
  const firstChar = str[0];
  if (!firstChar) {
    return false;
  }
  if (firstChar === firstChar.toLowerCase()) {
    return true;
  }
}

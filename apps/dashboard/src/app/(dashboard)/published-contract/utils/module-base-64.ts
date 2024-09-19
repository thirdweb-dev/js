type Module = {
  publisher: string;
  moduleId: string;
  version?: string;
};

function assertModule(val: unknown): asserts val is Module {
  if (
    typeof val !== "object" ||
    val === null ||
    typeof (val as Module).publisher !== "string" ||
    typeof (val as Module).moduleId !== "string" ||
    ((val as Module).version !== undefined &&
      typeof (val as Module).version !== "string")
  ) {
    throw new Error("Invalid module");
  }
}

export function moduleFromBase64(base64: string) {
  try {
    const mod = JSON.parse(atob(base64));
    assertModule(mod);
    return {
      ...mod,
      version: mod.version || "latest",
      displayName: mod.moduleId.split("ERC")[0],
    };
  } catch {
    return null;
  }
}

export function moduleToBase64(mod: Module) {
  return btoa(JSON.stringify(mod));
}

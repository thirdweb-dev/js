export function stringifyProps(
  props: Record<string, string | undefined | boolean>,
) {
  const _props: Record<string, string | undefined | boolean> = {};

  for (const key in props) {
    if (props[key] !== undefined && props[key] !== "") {
      _props[key] = props[key];
    }
  }

  return Object.entries(_props)
    .map(([key, value]) => `${key}={${value}}`)
    .join("\n");
}

export function quotes(value: string) {
  return `"${value}"`;
}

export function stringifyImports(imports: Record<string, string[]>) {
  let code = "";
  for (const key in imports) {
    if (imports[key].length > 0) {
      code += `import { ${imports[key].join(", ")} } from "${key}";\n`;
    }
  }
  return code;
}

export function stringifyIgnoreFalsy(
  value: Record<string, string | undefined | boolean>,
) {
  const _value: Record<string, string | boolean> = {};

  for (const key in value) {
    if (value[key] !== undefined && value[key] !== "") {
      _value[key] = value[key];
    }
  }

  return JSON.stringify(_value);
}

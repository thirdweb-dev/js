import * as parserBabel from "prettier/plugins/babel";
import { format } from "prettier/standalone";
import { type BundledLanguage, codeToHtml } from "shiki";

function isPrettierSupportedLang(lang: BundledLanguage) {
  return (
    lang === "js" ||
    lang === "jsx" ||
    lang === "ts" ||
    lang === "tsx" ||
    lang === "javascript" ||
    lang === "typescript"
  );
}

export async function getCodeHtml(
  code: string,
  lang: BundledLanguage,
  options?: {
    ignoreFormattingErrors?: boolean;
  },
) {
  const estreePlugin = await import("prettier/plugins/estree");
  const formattedCode = isPrettierSupportedLang(lang)
    ? await format(code, {
        parser: "babel-ts",
        plugins: [parserBabel, estreePlugin.default],
        printWidth: 60,
      }).catch((e) => {
        if (!options?.ignoreFormattingErrors) {
          console.error(e);
          console.error("Failed to format code");
          console.log({
            code,
            lang,
          });
        }

        return code;
      })
    : code;

  const html = await codeToHtml(formattedCode, {
    lang: lang,
    themes: {
      light: "github-light",
      dark: "github-dark-default",
    },
  });

  return { html, formattedCode };
}

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

export async function getCodeHtml(code: string, lang: BundledLanguage) {
  const estreePlugin = await import("prettier/plugins/estree");

  const formattedCode = isPrettierSupportedLang(lang)
    ? await format(code, {
        parser: "babel-ts",
        plugins: [parserBabel, estreePlugin.default],
        printWidth: 80,
      }).catch(() => {
        return code;
      })
    : code;

  const html = await codeToHtml(formattedCode, {
    lang: lang,
    themes: {
      dark: "github-dark-default",
      light: "github-light",
    },
  });

  return { formattedCode, html };
}

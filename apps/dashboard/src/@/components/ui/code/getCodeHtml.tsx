import * as parserBabel from "prettier/plugins/babel";
import * as estree from "prettier/plugins/estree";
import { format } from "prettier/standalone";
import { type BundledLanguage, codeToHtml } from "shiki";

function isPrettierSupportedLang(lang: BundledLanguage) {
  return (
    lang === "js" ||
    lang === "jsx" ||
    lang === "ts" ||
    lang === "tsx" ||
    lang === "javascript" ||
    lang === "typescript" ||
    lang === "css" ||
    lang === "json"
  );
}

export async function getCodeHtml(code: string, lang: BundledLanguage) {
  const formattedCode = isPrettierSupportedLang(lang)
    ? await format(code, {
        parser: "babel-ts",
        plugins: [parserBabel, estree],
        printWidth: 60,
      }).catch((e) => {
        console.error(e);
        console.error("Failed to format code");
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

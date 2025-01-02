import * as parserBabel from "prettier/plugins/babel";
import * as estree from "prettier/plugins/estree";
import { format } from "prettier/standalone";
import { codeToHtml } from "shiki";

export async function getCodeHtml(code: string, lang: string) {
  const formattedCode = await format(code, {
    parser: "babel-ts",
    plugins: [parserBabel, estree],
    printWidth: 60,
  });

  const html = await codeToHtml(formattedCode, {
    lang: lang,
    themes: {
      light: "github-light",
      dark: "github-dark-default",
    },
  });

  return { html, formattedCode };
}

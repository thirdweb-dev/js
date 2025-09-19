import estreePlugin from "prettier/plugins/estree";
import typescriptPlugin from "prettier/plugins/typescript";
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
  const formattedCode = isPrettierSupportedLang(lang)
    ? await format(code, {
        parser: "typescript",
        plugins: [estreePlugin, typescriptPlugin],
        printWidth: 80,
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
      dark: "github-dark-default",
      light: "github-light",
    },
  });

  return { formattedCode, html };
}

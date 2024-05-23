// enforces this only gets rendered on the server
import "server-only";

import * as parserBabel from "prettier/plugins/babel";
import * as estree from "prettier/plugins/estree";
import { format } from "prettier/standalone";
import { type BundledLanguage, codeToHtml } from "shiki";

export type CodeProps = {
  code: string;
  lang: BundledLanguage;
};

export const Code: React.FC<CodeProps> = async ({ code, lang }) => {
  const formattedCode = await format(code, {
    parser: "babel-ts",
    plugins: [parserBabel, estree],
    printWidth: 80,
  });
  const html = await codeToHtml(formattedCode, {
    lang: lang,
    themes: {
      light: "github-light",
      dark: "github-dark-default",
    },
  });

  return (
    <div
      className="*:p-8 *:overflow-auto *:h-full h-full text-xs md:text-sm"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: we know what we're doing here
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

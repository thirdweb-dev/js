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
    printWidth: 50,
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
      className="*:pointer-events-none *:md:pointer-events-auto *:w-full *:p-4 *:md:p-8 *:h-full h-full text-xs md:text-sm *:rounded-3xl *:max-md:rounded-b-none *:md:rounded-r-none *:overflow-clip *:md:overflow-visible"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: we know what we're doing here
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

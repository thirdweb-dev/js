import "server-only";

// others
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as parserBabel from "prettier/plugins/babel";
import * as estree from "prettier/plugins/estree";
// prettier
import { format } from "prettier/standalone";
import {
  type BuiltinLanguage,
  type SpecialLanguage,
  type ThemedToken,
  codeToTokens,
  stringifyTokenStyle,
} from "shiki";

import { CopyButton } from "../others/CopyButton";
import { ScrollShadow } from "../others/ScrollShadow/ScrollShadow";

const jsOrTsLangs = new Set([
  "js",
  "jsx",
  "ts",
  "tsx",
  "javascript",
  "typescript",
]);

export async function CodeBlock(props: {
  code: string;
  lang: BuiltinLanguage | SpecialLanguage;
  tokenLinks?: Map<string, string>;
  className?: string;
  containerClassName?: string;
  scrollContainerClassName?: string;
}) {
  let code = props.code;
  let lang = props.lang;
  const tokenLinks = props.tokenLinks;

  if (lang === "shell" || lang === "sh") {
    lang = "bash";
  }

  if (lang === "json") {
    try {
      code = JSON.stringify(JSON.parse(code), null, 2);
    } catch {
      // ignore
    }
  }

  // format code
  if (jsOrTsLangs.has(lang)) {
    try {
      code = await format(code, {
        parser: "babel-ts",
        plugins: [parserBabel, estree],
        printWidth: 70,
      });
    } catch (_e) {
      // ignore
    }
  }

  return (
    <div className={cn("group/code relative mb-5", props.containerClassName)}>
      <code
        className={cn(
          "relative block rounded-lg border bg-card font-mono text-sm leading-relaxed",
          props.className,
        )}
        lang={lang}
      >
        <ScrollShadow
          scrollableClassName={cn("p-4", props.scrollContainerClassName)}
          className=""
        >
          <RenderCode code={code} lang={lang} tokenLinks={tokenLinks} />
        </ScrollShadow>
      </code>

      <div className="absolute top-4 right-4 z-copyCodeButton opacity-0 transition-opacity duration-300 group-hover/code:opacity-100">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

async function RenderCode(props: {
  code: string;
  lang: BuiltinLanguage | SpecialLanguage;
  tokenLinks?: Map<string, string>;
}) {
  const { tokens } = await codeToTokens(props.code, {
    // theme: "github-dark",
    lang: props.lang,
    themes: {
      light: "github-light",
      dark: "github-dark-dimmed",
    },
  });

  const getThemeColors = (token: ThemedToken) => {
    if (!token.htmlStyle) {
      return {
        lightColor: undefined,
        darkColor: undefined,
      };
    }
    const styleStr = stringifyTokenStyle(token.htmlStyle);
    const [lightStyle, darkStyle] = styleStr?.split(";") || [];
    const lightColor = lightStyle?.split(":")[1];
    const darkColor = darkStyle?.split(":")[1];
    return {
      lightColor,
      darkColor,
    };
  };

  return (
    <div>
      <pre>
        {tokens.map((line, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: index is the identity here
            <div key={i}>
              {line.map((token, i) => {
                const { lightColor, darkColor } = getThemeColors(token);

                const style = {
                  "--code-light-color": lightColor,
                  "--code-dark-color": darkColor,
                } as React.CSSProperties;

                const href = props.tokenLinks?.has(token.content)
                  ? props.tokenLinks.get(token.content)
                  : undefined;

                if (href) {
                  return (
                    <Link
                      // biome-ignore lint/suspicious/noArrayIndexKey: index is the identity here
                      key={i}
                      href={href || "#"}
                      className="group/codelink relative py-0.5"
                      style={style}
                    >
                      {/* Token */}
                      <span className="relative z-codeToken transition-colors duration-200 group-hover/codelink:text-background">
                        {token.content}
                      </span>
                      {/* Line */}
                      <span
                        className={cn(
                          "absolute right-0 bottom-0 left-0 z-codeTokenHighlight inline-block h-[3px] translate-y-[2px] scale-105",
                          "rounded-sm bg-current opacity-20",
                          "transition-all duration-200 group-hover/codelink:h-full group-hover/codelink:translate-y-0 group-hover/codelink:opacity-100",
                        )}
                      />
                    </Link>
                  );
                }

                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is the identity here
                  <span key={i} style={style} data-token={token.content}>
                    {token.content}
                  </span>
                );
              })}
              {line.length === 0 && i !== tokens.length - 1 && " "}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

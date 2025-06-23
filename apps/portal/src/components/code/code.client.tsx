import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { BundledLanguage } from "shiki";
import { LoadingDots } from "../ui/LoadingDots";
import { getCodeHtml } from "./getCodeHtml";
import { RenderCode } from "./RenderCode";

// Use CodeClient where the code changes based user input
// Using RSC in that scenario feels too slow and unnecessary keep hitting the server

type CodeProps = {
  code: string;
  lang: BundledLanguage | string | undefined | null;
  loader: React.ReactNode;
  className?: string;
  scrollableClassName?: string;
  scrollableContainerClassName?: string;
};

export function CodeLoading() {
  return (
    <div className="flex min-h-[300px] grow items-center justify-center">
      <LoadingDots />
    </div>
  );
}

export const CodeClient: React.FC<CodeProps> = ({
  code,
  lang,
  loader,
  className,
  scrollableClassName,
  scrollableContainerClassName,
}) => {
  const codeQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getCodeHtml(code, lang),
    queryKey: ["html", code],
  });

  if (!codeQuery.data) {
    return loader;
  }

  return (
    <RenderCode
      className={className}
      code={codeQuery.data.formattedCode}
      html={codeQuery.data.html}
      scrollableClassName={scrollableClassName}
      scrollableContainerClassName={scrollableContainerClassName}
    />
  );
};

/** @alias */
export default CodeClient;

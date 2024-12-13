import { cn } from "@/lib/utils";
import { CodeBlockContainer } from "./CodeBlockContainer";

export function PlainTextCodeBlock(props: {
  code: string;
  copyButtonClassName?: string;
  className?: string;
  scrollableClassName?: string;
  codeClassName?: string;
  scrollableContainerClassName?: string;
  shadowColor?: string;
  onCopy?: (code: string) => void;
}) {
  return (
    <CodeBlockContainer
      codeToCopy={props.code}
      className={props.className}
      copyButtonClassName={props.copyButtonClassName}
      scrollableClassName={props.scrollableClassName}
      scrollableContainerClassName={props.scrollableContainerClassName}
      shadowColor={props.shadowColor}
      onCopy={props.onCopy}
    >
      <code className={cn("block whitespace-pre", props.codeClassName)}>
        {props.code}
      </code>
    </CodeBlockContainer>
  );
}

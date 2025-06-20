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
      className={props.className}
      codeToCopy={props.code}
      copyButtonClassName={props.copyButtonClassName}
      onCopy={props.onCopy}
      scrollableClassName={props.scrollableClassName}
      scrollableContainerClassName={props.scrollableContainerClassName}
      shadowColor={props.shadowColor}
    >
      <code className={cn("block whitespace-pre", props.codeClassName)}>
        {props.code}
      </code>
    </CodeBlockContainer>
  );
}

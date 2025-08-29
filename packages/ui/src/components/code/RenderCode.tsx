import { CodeBlockContainer } from "./CodeBlockContainer";

export function RenderCode(props: {
  code: string;
  html: string;
  className?: string;
  scrollableClassName?: string;
  copyButtonClassName?: string;
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
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: we know what we're doing here
        dangerouslySetInnerHTML={{ __html: props.html }}
      />
    </CodeBlockContainer>
  );
}

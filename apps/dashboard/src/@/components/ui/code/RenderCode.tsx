import { CodeBlockContainer } from "./CodeBlockContainer";

export function RenderCode(props: {
  code: string;
  html: string;
  className?: string;
  scrollableClassName?: string;
  copyButtonClassName?: string;
}) {
  return (
    <CodeBlockContainer
      codeToCopy={props.code}
      className={props.className}
      copyButtonClassName={props.copyButtonClassName}
      scrollableClassName={props.scrollableClassName}
    >
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: we know what we're doing here
        dangerouslySetInnerHTML={{ __html: props.html }}
      />
    </CodeBlockContainer>
  );
}

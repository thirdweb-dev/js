import { sluggerContext } from "@/contexts/slugger";
import invariant from "tiny-invariant";
import type { FunctionSignature } from "typedoc-better-json";
import { CodeBlock } from "../../../../components/Document/Code";
import { DocLink } from "../../../../components/Document/DocLink";
import { Heading } from "../../../../components/Document/Heading";
import { InlineCode } from "../../../../components/Document/InlineCode";
import {
  OrderedList,
  UnorderedList,
} from "../../../../components/Document/List";
import { Paragraph } from "../../../../components/Document/Paragraph";

export function TypedocSummary(props: {
  summary: NonNullable<FunctionSignature["summary"]>;
  className?: string;
}) {
  const slugger = sluggerContext.get();
  invariant(slugger, "slugger context not set");

  return (
    <>
      {props.summary.map((s) => {
        switch (s.type) {
          case "code": {
            return (
              <CodeBlock lang={s.lang} code={s.value} key={Math.random()} />
            );
          }

          case "html":
          case "inlineCode": {
            return <InlineCode code={s.value} key={Math.random()} />;
          }

          case "link": {
            const isUrlNum = s.url.match(/^[0-9]+$/);

            // TODO - link to doc
            return (
              <DocLink href={isUrlNum ? "" : s.url} key={s.url}>
                <TypedocSummary summary={s.children} />
              </DocLink>
            );
          }

          case "paragraph": {
            return (
              <Paragraph className={props.className} key={Math.random()}>
                <TypedocSummary summary={s.children} />
              </Paragraph>
            );
          }

          case "text": {
            return <span key={Math.random()}>{s.value}</span>;
          }

          case "list": {
            if (s.ordered) {
              return (
                <OrderedList key={Math.random()}>
                  <TypedocSummary summary={s.children} />
                </OrderedList>
              );
            }

            return (
              <UnorderedList key={Math.random()}>
                <TypedocSummary summary={s.children} />
              </UnorderedList>
            );
          }

          case "listItem": {
            return (
              <li key={Math.random()}>
                <TypedocSummary summary={s.children} className="mb-0" />
              </li>
            );
          }

          case "heading": {
            return (
              <Heading
                key={Math.random()}
                level={s.depth}
                // biome-ignore lint/suspicious/noExplicitAny: complex type
                id={slugger.slug((s.children[0] as any)?.value ?? "", false)}
              >
                <TypedocSummary summary={s.children} />
              </Heading>
            );
          }

          case "strong":
          case "emphasis": {
            return (
              <em key={Math.random()}>
                <TypedocSummary summary={s.children} />
              </em>
            );
          }

          case "thematicBreak": {
            return <hr />;
          }

          default: {
            // when this happens, we need to add a new case to the switch
            console.warn(`Unknown summary type: ${s.type}`);
          }
        }
      })}
    </>
  );
}

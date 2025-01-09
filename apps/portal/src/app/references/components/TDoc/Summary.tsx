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
            return <CodeBlock lang={s.lang} code={s.value} />;
          }

          case "html":
          case "inlineCode": {
            return <InlineCode code={s.value} />;
          }

          case "link": {
            const isUrlNum = s.url.match(/^[0-9]+$/);

            // TODO - link to doc
            return (
              <DocLink href={isUrlNum ? "" : s.url}>
                <TypedocSummary summary={s.children} />
              </DocLink>
            );
          }

          case "paragraph": {
            return (
              <Paragraph className={props.className}>
                <TypedocSummary summary={s.children} />
              </Paragraph>
            );
          }

          case "text": {
            return <span> {s.value}</span>;
          }

          case "list": {
            if (s.ordered) {
              return (
                <OrderedList>
                  <TypedocSummary summary={s.children} />
                </OrderedList>
              );
            }

            return (
              <UnorderedList>
                <TypedocSummary summary={s.children} />
              </UnorderedList>
            );
          }

          case "listItem": {
            return (
              <li>
                <TypedocSummary summary={s.children} className="mb-0" />
              </li>
            );
          }

          case "heading": {
            return (
              <Heading
                level={s.depth}
                id={slugger.slug(s.children[0]?.value, false)}
              >
                <TypedocSummary summary={s.children} />
              </Heading>
            );
          }

          case "strong":
          case "emphasis": {
            return (
              <em>
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

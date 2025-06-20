import invariant from "tiny-invariant";
import type {
  SubTypeDeclarationDoc,
  TypeDeclarationDoc,
} from "typedoc-better-json";
import { Callout } from "@/components/Document";
import { sluggerContext } from "@/contexts/slugger";
import { CodeBlock } from "../../../../components/Document/Code";
import { Heading } from "../../../../components/Document/Heading";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import { FunctionTDoc } from "./Function";
import { TypedocSummary } from "./Summary";
import { getTags } from "./utils/getTags";
import { getTokenLinks } from "./utils/getTokenLinks";

export function TypeDeclarationTDoc(props: {
  doc: TypeDeclarationDoc;
  level: number;
  showHeading?: boolean;
}) {
  const { doc } = props;

  return (
    <>
      {doc.kind === "subtype" && (
        <SubtypeDeclarationTDoc
          doc={doc}
          level={props.level}
          showHeading={props.showHeading}
        />
      )}

      {doc.kind === "function" && (
        <FunctionTDoc
          doc={doc}
          level={props.level + 1}
          showHeading={props.showHeading}
        />
      )}
    </>
  );
}

async function SubtypeDeclarationTDoc(props: {
  doc: SubTypeDeclarationDoc;
  showHeading?: boolean;
  level: number;
}) {
  const { doc, showHeading, level } = props;
  const { exampleTag, deprecatedTag, remarksTag, seeTag } = getTags(
    doc.blockTags,
  );
  const subLevel = showHeading === false ? level : level + 1;

  const slugger = sluggerContext.get();
  invariant(slugger, "slugger context not set");

  return (
    <>
      {showHeading !== false && (
        <Heading anchorId={doc.name} level={level}>
          {doc.name}
        </Heading>
      )}

      {deprecatedTag && <DeprecatedCalloutTDoc tag={deprecatedTag} />}
      {doc.summary && <TypedocSummary summary={doc.summary} />}
      {remarksTag?.summary && <TypedocSummary summary={remarksTag.summary} />}

      {seeTag?.summary && (
        <Callout variant="info">
          <TypedocSummary summary={seeTag.summary} />
        </Callout>
      )}

      <CodeBlock
        code={`type ${doc.name} = ${doc.type.code}`}
        lang="ts"
        tokenLinks={
          doc.type.tokens ? await getTokenLinks(doc.type.tokens) : undefined
        }
      />

      {exampleTag?.summary && (
        <>
          <Heading anchorId={slugger.slug("example")} level={subLevel} noIndex>
            Example
          </Heading>
          <TypedocSummary summary={exampleTag.summary} />
        </>
      )}
    </>
  );
}

import invariant from "tiny-invariant";
import { type AccessorDoc, getAccessorSignature } from "typedoc-better-json";
import { Callout, Details } from "@/components/Document";
import { sluggerContext } from "@/contexts/slugger";
import { CodeBlock } from "../../../../components/Document/Code";
import { Heading } from "../../../../components/Document/Heading";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import { SourceLinkTypeDoc } from "./SourceLink";
import { TypedocSummary } from "./Summary";
import { getTags } from "./utils/getTags";
import { getTokenLinks } from "./utils/getTokenLinks";

export async function AccessorTDoc(props: {
  doc: AccessorDoc;
  level: number;
  hideHeading?: boolean;
}) {
  const { doc } = props;
  const { deprecatedTag, exampleTag, remarksTag, seeTag } = getTags(
    doc.blockTags,
  );
  const subLevel = props.level + 1;

  const slugger = sluggerContext.get();
  invariant(slugger, "slugger context not set");

  const { code: signatureCode, tokens } = getAccessorSignature(doc);

  return (
    <>
      {props.hideHeading !== true && (
        <Heading anchorId={doc.name} level={props.level}>
          {doc.name}
        </Heading>
      )}

      {doc.source && <SourceLinkTypeDoc href={doc.source} />}

      {deprecatedTag && <DeprecatedCalloutTDoc tag={deprecatedTag} />}
      {doc.summary && <TypedocSummary summary={doc.summary} />}
      {remarksTag?.summary && <TypedocSummary summary={remarksTag.summary} />}

      {seeTag?.summary && (
        <Callout variant="info">
          <TypedocSummary summary={seeTag.summary} />
        </Callout>
      )}

      <Details anchorId="signature" noIndex summary="Signature">
        <CodeBlock
          code={signatureCode}
          lang="ts"
          tokenLinks={tokens ? await getTokenLinks(tokens) : undefined}
        />
      </Details>

      {exampleTag?.summary && (
        <>
          <Heading anchorId={slugger.slug("example")} level={subLevel} noIndex>
            Example
          </Heading>
          <TypedocSummary summary={exampleTag.summary} />
        </>
      )}

      {doc.returns?.summary && (
        <>
          <Heading anchorId="returns" level={props.level + 1} noIndex>
            Returns
          </Heading>
          {doc.returns?.summary && (
            <TypedocSummary summary={doc.returns?.summary} />
          )}
        </>
      )}
    </>
  );
}

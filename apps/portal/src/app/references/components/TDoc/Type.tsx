import { Callout } from "@/components/Document";
import { sluggerContext } from "@/contexts/slugger";
import invariant from "tiny-invariant";
import { type InterfaceDoc, getInterfaceSignature } from "typedoc-better-json";
import { CodeBlock } from "../../../../components/Document/Code";
import { Details } from "../../../../components/Document/Details";
import { Heading } from "../../../../components/Document/Heading";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import { SourceLinkTypeDoc } from "./SourceLink";
import { TypedocSummary } from "./Summary";
import { TypeDeclarationTDoc } from "./TypeDeclaration";
import { getTags } from "./utils/getTags";
import { getTokenLinks } from "./utils/getTokenLinks";

export async function TypeTDoc(props: { doc: InterfaceDoc; level: number }) {
  const { doc } = props;
  const { deprecatedTag, exampleTag, remarksTag, seeTag } = getTags(
    doc.blockTags,
  );

  const subLevel = props.level + 1;

  const slugger = sluggerContext.get();
  invariant(slugger, "slugger context not set");

  const { code, tokens } = getInterfaceSignature(doc);

  return (
    <>
      <Heading level={props.level} id={doc.name}>
        {doc.name}
      </Heading>

      {doc.source && <SourceLinkTypeDoc href={doc.source} />}

      {deprecatedTag && <DeprecatedCalloutTDoc tag={deprecatedTag} />}
      {doc.summary && <TypedocSummary summary={doc.summary} />}
      {remarksTag?.summary && <TypedocSummary summary={remarksTag.summary} />}

      <CodeBlock
        lang="ts"
        code={code}
        tokenLinks={tokens ? await getTokenLinks(tokens) : undefined}
      />

      {exampleTag?.summary && (
        <>
          <Heading level={subLevel} id={slugger.slug("example")} noIndex>
            Example
          </Heading>
          <TypedocSummary summary={exampleTag.summary} />
        </>
      )}

      {seeTag?.summary && (
        <Callout variant="info">
          <TypedocSummary summary={seeTag.summary} />
        </Callout>
      )}

      {doc.typeDeclaration?.map((declaration) => {
        return (
          <Details
            key={declaration.name}
            summary={declaration.name}
            id={declaration.name}
          >
            <TypeDeclarationTDoc
              showHeading={false}
              doc={declaration}
              level={props.level + 1}
            />
          </Details>
        );
      })}
    </>
  );
}

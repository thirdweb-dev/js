import invariant from "tiny-invariant";
import { type EnumDoc, getEnumSignature } from "typedoc-better-json";
import { Callout } from "@/components/Document";
import { sluggerContext } from "@/contexts/slugger";
import { CodeBlock } from "../../../../components/Document/Code";
import { Heading } from "../../../../components/Document/Heading";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import { SourceLinkTypeDoc } from "./SourceLink";
import { TypedocSummary } from "./Summary";
import { getTags } from "./utils/getTags";

export function EnumTDoc(props: { doc: EnumDoc; level: number }) {
  const { doc } = props;
  const { exampleTag, deprecatedTag, remarksTag, seeTag } = getTags(
    doc.blockTags,
  );

  const subLevel = props.level + 1;

  const slugger = sluggerContext.get();
  invariant(slugger, "slugger context not set");

  const { code } = getEnumSignature(doc);

  return (
    <>
      <Heading anchorId={doc.name} level={props.level}>
        {doc.name}
      </Heading>

      {doc.source && <SourceLinkTypeDoc href={doc.source} />}

      {deprecatedTag && <DeprecatedCalloutTDoc tag={deprecatedTag} />}
      {doc.summary && <TypedocSummary summary={doc.summary} />}
      {remarksTag?.summary && <TypedocSummary summary={remarksTag.summary} />}

      {exampleTag?.summary && (
        <>
          <Heading anchorId={slugger.slug("example")} level={subLevel} noIndex>
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

      <CodeBlock code={code} lang="ts" />

      {doc.members?.map((member) => {
        return (
          <MemberTDoc
            doc={member}
            enumName={doc.name}
            key={member.name}
            level={props.level + 1}
          />
        );
      })}
    </>
  );
}

function MemberTDoc(props: {
  doc: EnumDoc["members"][number];
  level: number;
  enumName: string;
}) {
  const member = props.doc;

  return (
    <div key={member.name}>
      <Heading anchorId={member.name} level={props.level + 1}>
        {member.name}
      </Heading>
      {member.summary && <TypedocSummary summary={member.summary} />}
      <CodeBlock code={`${member.value.code}`} lang="ts" />
    </div>
  );
}

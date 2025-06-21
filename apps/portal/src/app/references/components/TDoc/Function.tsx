import invariant from "tiny-invariant";
import {
  type FunctionDoc,
  type FunctionParameter,
  type FunctionSignature,
  getFunctionSignature,
  type InterfaceDoc,
  type Summary,
  type TypeInfo,
} from "typedoc-better-json";
import { DocLink, Paragraph } from "@/components/Document";
import { InlineCode } from "@/components/Document/InlineCode";
import { sluggerContext } from "@/contexts/slugger";
import { Callout } from "../../../../components/Document/Callout";
import { CodeBlock } from "../../../../components/Document/Code";
import { Details } from "../../../../components/Document/Details";
import { Heading } from "../../../../components/Document/Heading";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import fetchDocBySlug from "./fetchDocs/fetchDocBySlug";
import { SourceLinkTypeDoc } from "./SourceLink";
import { TypedocSummary } from "./Summary";
import { getExtensionName } from "./utils/getSidebarLinkgroups";
import { getTags } from "./utils/getTags";
import { getTokenLinks } from "./utils/getTokenLinks";

export function FunctionTDoc(props: {
  doc: FunctionDoc;
  level: number;
  showHeading?: boolean;
}) {
  const slugger = sluggerContext.get();
  invariant(slugger, "slugger context not set");

  const { doc } = props;
  const multipleSignatures = doc.signatures
    ? doc.signatures?.length > 1
    : false;

  const blockTag = doc.signatures?.[0]?.blockTags?.find(
    (b) =>
      b.tag === "@extension" || b.tag === "@modules" || b.tag === "@bridge",
  );
  const extensionName = blockTag ? getExtensionName(blockTag) : undefined;

  return (
    <>
      {props.showHeading !== false && (
        <Heading anchorId={slugger.slug(doc.name)} level={props.level}>
          {extensionName && extensionName !== "Common"
            ? `${extensionName}.${doc.name}`
            : doc.name}
        </Heading>
      )}

      {doc.source && <SourceLinkTypeDoc href={doc.source} />}
      {doc.signatures?.map((signature, i) => (
        <RenderFunctionSignature
          // biome-ignore lint/suspicious/noArrayIndexKey: nothing better available
          key={i}
          level={props.level + 1}
          name={doc.name}
          signature={signature}
          signatureId={multipleSignatures ? i + 1 : undefined}
        />
      ))}
    </>
  );
}

async function RenderFunctionSignature(props: {
  signature: FunctionSignature;
  signatureId?: number;
  name: string;
  level: number;
}) {
  const { signature, name } = props;
  const slugger = sluggerContext.get();
  invariant(slugger, "slugger context not set");

  const { deprecatedTag, remarksTag, seeTag, exampleTag, prepareTag } = getTags(
    signature.blockTags,
  );

  const subLevel = props.signatureId ? props.level + 1 : props.level;

  const signatureCode = getFunctionSignature(name, signature);

  const tokenLinks = signatureCode.tokens
    ? await getTokenLinks(signatureCode.tokens)
    : undefined;

  return (
    <>
      {props.signatureId && (
        <Heading
          anchorId={slugger.slug(
            `${props.name}-signature-${props.signatureId}`,
            false,
          )}
          className="text-foreground"
          level={props.level}
          noIndex
        >
          Signature
          <span className="font-normal text-muted-foreground">
            #{props.signatureId}
          </span>
        </Heading>
      )}

      {signature.inheritedFrom && (
        <div className="mb-5 text-muted-foreground" data-noindex>
          Inherited from <InlineCode code={signature.inheritedFrom.name} />
        </div>
      )}

      {deprecatedTag && <DeprecatedCalloutTDoc tag={deprecatedTag} />}
      {signature.summary && <TypedocSummary summary={signature.summary} />}
      {remarksTag?.summary && <TypedocSummary summary={remarksTag.summary} />}

      {seeTag?.summary && (
        <Callout variant="info">
          <TypedocSummary summary={seeTag.summary} />
        </Callout>
      )}

      {exampleTag?.summary && (
        <>
          <Heading anchorId={slugger.slug("example")} level={subLevel} noIndex>
            Example
          </Heading>
          <TypedocSummary summary={exampleTag.summary} />
        </>
      )}

      <Details
        anchorId={slugger.slug("signature")}
        noIndex
        startExpanded
        summary="Signature"
      >
        <CodeBlock
          code={signatureCode.code}
          lang="ts"
          tokenLinks={tokenLinks}
        />
      </Details>

      {signature.parameters && (
        <div className="mt-5">
          <Heading
            anchorId={slugger.slug(
              `${props.name}--param--${props.name}`,
              false,
            )}
            level={subLevel}
            noIndex
          >
            Parameters
          </Heading>
          {props.signature.parameters?.map(async (param) => {
            return (
              <Details
                anchorId={slugger.slug(param.name)}
                key={param.name}
                level={props.level + 1}
                startExpanded
                summary={param.name}
                tags={[
                  param.flags?.isOptional ? "optional" : "",
                  param.flags?.isPrivate ? "private" : "",
                  param.flags?.isProtected ? "protected" : "",
                  param.flags?.isStatic ? "static" : "",
                ].filter((w) => w)}
              >
                <ParameterTDoc level={subLevel} param={param} />
              </Details>
            );
          })}
        </div>
      )}

      {signature.returns && (
        <div className="mt-5">
          <Heading
            anchorId={slugger.slug(`${props.name}-returns`)}
            level={subLevel}
            noIndex
          >
            Returns
          </Heading>
          <div>
            {signature.returns.type && (
              <Details
                anchorId={slugger.slug(`${props.name}-return-type`)}
                noIndex
                startExpanded
                summary="Return Type"
              >
                <ReturnsTDoc returns={signature.returns} />
              </Details>
            )}

            {signature.returns.summary && (
              <TypedocSummary summary={signature.returns.summary} />
            )}
          </div>
        </div>
      )}

      {prepareTag && (
        <div className="mt-8" data-noindex>
          <Callout title="Preparable" variant="info">
            <Paragraph>
              You can also prepare the transaction without executing it by
              calling <InlineCode code={`${name}.prepare()`} /> with same
              arguments.
              <DocLink href="/typescript/v4/extensions#preparing-transactions">
                Learn more
              </DocLink>
            </Paragraph>
          </Callout>
        </div>
      )}

      {props.signatureId && <div className="h-10" />}
    </>
  );
}

async function ReturnsTDoc({
  returns,
}: {
  returns: { type?: TypeInfo; summary?: Summary };
}) {
  const fullTypeDoc = await (async () => {
    if (returns.type === undefined) return;
    const maybeDoc = await fetchDocBySlug(returns.type.code);
    if (!maybeDoc) {
      if (returns.type.tokens?.[0]?.name === "Promise") {
        const promisedTypeDoc = await fetchDocBySlug(
          returns.type.tokens[1]?.name || "",
        );
        return promisedTypeDoc ? (promisedTypeDoc as InterfaceDoc) : undefined;
      }
      return;
    }
    return maybeDoc as InterfaceDoc;
  })();

  return (
    <CodeBlock
      code={`let returnType: ${fullTypeDoc?.type?.code || returns.type?.code}`}
      lang="ts"
      tokenLinks={
        returns.type?.tokens
          ? await getTokenLinks([
              ...returns.type.tokens,
              ...(fullTypeDoc?.type?.tokens || []),
            ])
          : undefined
      }
    />
  );
}

async function ParameterTDoc(props: {
  param: FunctionParameter;
  level: number;
}) {
  const { param } = props;

  const slugger = sluggerContext.get();
  invariant(slugger, "slugger context not set");

  const fullTypeDoc = await (async () => {
    if (param.type === undefined) return;
    const maybeDoc = await fetchDocBySlug(param.type?.code);
    if (!maybeDoc) {
      return;
    }
    return maybeDoc as InterfaceDoc;
  })();

  const { deprecatedTag, remarksTag, seeTag, exampleTag } = getTags(
    param.blockTags,
  );

  const showType = param.type?.code !== "{  }";
  return (
    <div>
      {param.type && (
        <div>
          {deprecatedTag && <DeprecatedCalloutTDoc tag={deprecatedTag} />}
          {param.summary && <TypedocSummary summary={param.summary} />}
          {remarksTag?.summary && (
            <TypedocSummary summary={remarksTag.summary} />
          )}

          {seeTag?.summary && (
            <Callout variant="info">
              <TypedocSummary summary={seeTag.summary} />
            </Callout>
          )}

          {showType && (
            <>
              <Heading
                anchorClassName={!param.summary ? "mt-0" : ""}
                anchorId={slugger.slug(`${param.name}type`)}
                level={props.level + 1}
                noIndex
              >
                Type
              </Heading>

              <CodeBlock
                // Prioritize the unrolled type when showing the parameter codeblock
                code={`let ${param.name}: ${fullTypeDoc?.type?.code ?? param.type.code}`}
                lang="ts"
                tokenLinks={
                  param.type.tokens
                    ? await getTokenLinks([
                        ...param.type.tokens,
                        ...(fullTypeDoc?.type?.tokens || []),
                      ])
                    : undefined
                }
              />
            </>
          )}

          {exampleTag?.summary && (
            <>
              <Heading
                anchorId={slugger.slug(`${param.name}example`)}
                level={props.level + 1}
                noIndex
              >
                Example
              </Heading>
              <TypedocSummary summary={exampleTag.summary} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

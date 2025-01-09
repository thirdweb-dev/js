import { DocLink, Paragraph } from "@/components/Document";
import { InlineCode } from "@/components/Document/InlineCode";
import { sluggerContext } from "@/contexts/slugger";
import invariant from "tiny-invariant";
import {
  type FunctionDoc,
  type FunctionParameter,
  type FunctionSignature,
  type InterfaceDoc,
  type Summary,
  type TypeInfo,
  getFunctionSignature,
} from "typedoc-better-json";
import { Callout } from "../../../../components/Document/Callout";
import { CodeBlock } from "../../../../components/Document/Code";
import { Details } from "../../../../components/Document/Details";
import { Heading } from "../../../../components/Document/Heading";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import { SourceLinkTypeDoc } from "./SourceLink";
import { TypedocSummary } from "./Summary";
import fetchDocBySlug from "./fetchDocs/fetchDocBySlug";
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

  return (
    <>
      {props.showHeading !== false && (
        <Heading level={props.level} id={slugger.slug(doc.name)}>
          {doc.name}
        </Heading>
      )}

      {doc.source && <SourceLinkTypeDoc href={doc.source} />}
      {doc.signatures?.map((signature, i) => (
        <RenderFunctionSignature
          signatureId={multipleSignatures ? i + 1 : undefined}
          signature={signature}
          name={doc.name}
          level={props.level + 1}
          // biome-ignore lint/suspicious/noArrayIndexKey: nothing better available
          key={i}
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
          level={props.level}
          id={slugger.slug(
            `${props.name}-signature-${props.signatureId}`,
            false,
          )}
          className="text-f-100"
          noIndex
        >
          Signature
          <span className="font-normal text-f-300">#{props.signatureId}</span>
        </Heading>
      )}

      {signature.inheritedFrom && (
        <div className="mb-5 text-f-300" data-noindex>
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
          <Heading level={subLevel} id={slugger.slug("example")} noIndex>
            Example
          </Heading>
          <TypedocSummary summary={exampleTag.summary} />
        </>
      )}

      <Details
        startExpanded
        id={slugger.slug("signature")}
        summary="Signature"
        noIndex
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
            level={subLevel}
            id={slugger.slug(`${props.name}--param--${props.name}`, false)}
            noIndex
          >
            Parameters
          </Heading>
          {props.signature.parameters?.map(async (param) => {
            return (
              <Details
                id={slugger.slug(param.name)}
                key={param.name}
                level={props.level + 1}
                summary={param.name}
                startExpanded
                tags={[
                  param.flags?.isOptional ? "optional" : "",
                  param.flags?.isPrivate ? "private" : "",
                  param.flags?.isProtected ? "protected" : "",
                  param.flags?.isStatic ? "static" : "",
                ].filter((w) => w)}
              >
                <ParameterTDoc param={param} level={subLevel} />
              </Details>
            );
          })}
        </div>
      )}

      {signature.returns && (
        <div className="mt-5">
          <Heading
            level={subLevel}
            id={slugger.slug(`${props.name}-returns`)}
            noIndex
          >
            Returns
          </Heading>
          <div>
            {signature.returns.type && (
              <Details
                startExpanded
                id={slugger.slug(`${props.name}-return-type`)}
                summary="Return Type"
                noIndex
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
          <Callout variant="info" title="Preparable">
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
                level={props.level + 1}
                id={slugger.slug(`${param.name}type`)}
                noIndex
                anchorClassName={!param.summary ? "mt-0" : ""}
              >
                Type
              </Heading>

              <CodeBlock
                // Prioritize the unrolled type when showing the parameter codeblock
                code={`let ${param.name}: ${fullTypeDoc?.type?.code ?? param.type.code}`}
                tokenLinks={
                  param.type.tokens
                    ? await getTokenLinks([
                        ...param.type.tokens,
                        ...(fullTypeDoc?.type?.tokens || []),
                      ])
                    : undefined
                }
                lang="ts"
              />
            </>
          )}

          {exampleTag?.summary && (
            <>
              <Heading
                level={props.level + 1}
                id={slugger.slug(`${param.name}example`)}
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

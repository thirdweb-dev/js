import invariant from "tiny-invariant";
import {
  type ClassDoc,
  type FunctionDoc,
  getClassSignature,
  type VariableDoc,
} from "typedoc-better-json";
import { Callout } from "@/components/Document";
import { sluggerContext } from "@/contexts/slugger";
import { CodeBlock } from "../../../../components/Document/Code";
import { Details } from "../../../../components/Document/Details";
import { Heading } from "../../../../components/Document/Heading";
import { AccessorTDoc } from "./Accessor";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import { FunctionTDoc } from "./Function";
import { SourceLinkTypeDoc } from "./SourceLink";
import { TypedocSummary } from "./Summary";
import { getTags } from "./utils/getTags";
import { getTokenLinks } from "./utils/getTokenLinks";
import { VariableTDoc } from "./Variable";

export async function ClassTDoc(props: { doc: ClassDoc }) {
  const { doc } = props;

  const { deprecatedTag, remarksTag, seeTag, exampleTag } = getTags(
    doc.blockTags,
  );

  const slugger = sluggerContext.get();
  invariant(slugger, "slugger context not set");

  const methods = doc.methods?.filter((method) => {
    const { flags } = method;
    return (
      !flags?.isPrivate && !flags?.isProtected && !method.name.startsWith("#")
    );
  });

  const properties: VariableDoc[] = [];

  if (doc.properties) {
    for (const property of doc.properties) {
      if (property.flags) {
        if (property.flags.isPrivate || property.flags.isProtected) {
          continue;
        }
      }

      // if property is a function - show it as a method
      if (property.typeDeclaration && property.typeDeclaration.length === 1) {
        const method = property.typeDeclaration[0];
        if (method && method.kind === "function") {
          methods?.push(method);
          continue;
        }
      }

      // handling "preparable" methods - add a @prepare tag to them
      if (
        property.typeDeclaration &&
        property.typeDeclaration.length === 2 &&
        property.typeDeclaration.find((t) => t.name === "prepare")
      ) {
        let isMethod = false;
        for (const m of property.typeDeclaration) {
          if (m.kind === "function") {
            if (!m.signatures) continue;
            for (const s of m.signatures) {
              if (!s.blockTags) {
                s.blockTags = [];
              }
              s.blockTags.push({
                tag: "@prepare",
              });
            }
            m.source = property.source;
            methods?.push(m);
            isMethod = true;
            break;
          }
        }

        if (!isMethod) {
          properties.push(property);
        }
      } else {
        properties.push(property);
      }
    }
  }

  const regularMethods = methods?.filter((m) => {
    if (m.signatures?.[0]?.inheritedFrom) {
      return false;
    }
    return true;
  });

  const inheritedMethods = methods?.filter((m) => {
    if (m.signatures?.[0]?.inheritedFrom) {
      return true;
    }
    return false;
  });

  const accessors = doc.accessors?.filter((accessor) => {
    return !accessor.flags?.isPrivate && !accessor.flags?.isProtected;
  });

  const { code: signatureCode, tokens } = getClassSignature(doc);

  const renderMethods = (_methods: FunctionDoc[]) =>
    _methods.map((method) => {
      const flags = method.signatures?.[0]?.flags;
      return (
        <Details
          anchorId={method.name}
          key={method.name}
          summary={method.name}
          tags={[
            flags?.isOptional ? "optional" : "",
            flags?.isStatic ? "static" : "",
          ].filter((w) => w)}
        >
          <FunctionTDoc
            doc={method}
            key={method.name}
            level={3}
            showHeading={false}
          />
        </Details>
      );
    });

  return (
    <div>
      <Heading anchorId={doc.name} level={1}>
        {doc.name}
      </Heading>

      {doc.source && <SourceLinkTypeDoc href={doc.source} />}

      {deprecatedTag && <DeprecatedCalloutTDoc tag={deprecatedTag} />}
      {doc.summary && <TypedocSummary summary={doc.summary} />}
      {remarksTag?.summary && <TypedocSummary summary={remarksTag.summary} />}

      {seeTag?.summary && (
        <Callout variant="info">
          <TypedocSummary summary={seeTag.summary} />
        </Callout>
      )}

      {exampleTag?.summary && (
        <>
          <Heading anchorId={slugger.slug("example")} level={3} noIndex>
            Example
          </Heading>
          <TypedocSummary summary={exampleTag.summary} />
        </>
      )}

      <Details anchorId={slugger.slug("signature")} noIndex summary="Signature">
        <CodeBlock
          code={signatureCode}
          lang="ts"
          tokenLinks={tokens ? await getTokenLinks(tokens) : undefined}
        />
      </Details>

      {/* Constructor */}
      {doc.constructor && (
        <Details anchorId="constructor" level={2} noIndex summary="Constructor">
          <FunctionTDoc doc={doc.constructor} level={2} showHeading={false} />
        </Details>
      )}

      {/* Methods */}
      {regularMethods && regularMethods.length > 0 && (
        <div>
          <Heading anchorId="methods" level={2} noIndex>
            Methods
          </Heading>
          <div>{renderMethods(regularMethods)}</div>
        </div>
      )}

      {/* Inherited methods */}
      {inheritedMethods && inheritedMethods.length > 0 && (
        <div>
          <Heading anchorId="methods" level={2} noIndex>
            Inherited Methods
          </Heading>
          <div>{renderMethods(inheritedMethods)}</div>
        </div>
      )}

      {/* Properties */}
      {properties && properties.length > 0 && (
        <div>
          <Heading anchorId="properties" level={2} noIndex>
            Properties
          </Heading>
          <div>
            {properties.map((property) => {
              return (
                <Details
                  anchorId={property.name}
                  key={property.name}
                  summary={property.name}
                >
                  <VariableTDoc
                    doc={property}
                    key={property.name}
                    level={3}
                    showHeading={false}
                  />
                </Details>
              );
            })}
          </div>
        </div>
      )}

      {/* Accessor */}
      {accessors && accessors.length > 0 && (
        <div>
          <Heading anchorId="properties" className="text-5xl" level={2} noIndex>
            Accessors
          </Heading>
          <div>
            {accessors.map((accessor) => {
              return (
                <Details
                  anchorId={accessor.name}
                  key={accessor.name}
                  summary={accessor.name}
                >
                  <AccessorTDoc
                    doc={accessor}
                    hideHeading={true}
                    key={accessor.name}
                    level={3}
                  />
                </Details>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

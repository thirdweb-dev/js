import { TypeDeclarationDoc, TypeInfo, VariableDoc } from "typedoc-better-json";
import { CodeBlock } from "../../../../components/Document/Code";
import { TypedocSummary } from "./Summary";
import { Heading } from "../../../../components/Document/Heading";
import { SourceLinkTypeDoc } from "./SourceLink";
import { TypeDeclarationTDoc } from "./TypeDeclaration";
import { FunctionTDoc } from "./Function";
import { Details } from "../../../../components/Document/Details";
import { getTags } from "./utils/getTags";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import { sluggerContext } from "@/contexts/slugger";
import invariant from "tiny-invariant";
import { Callout } from "@/components/Document";
import { getTokenLinks } from "./utils/getTokenLinks";

export async function VariableTDoc(props: {
	doc: VariableDoc;
	level: number;
	showHeading?: boolean;
}) {
	const { doc } = props;
	const { exampleTag, deprecatedTag, remarksTag, seeTag } = getTags(
		doc.blockTags,
	);

	const subLevel = props.showHeading === false ? props.level : props.level + 1;

	const slugger = sluggerContext.get();
	invariant(slugger, "slugger context not set");

	const { code: signatureCode, tokens } = getVariableSignatureCode(doc);

	return (
		<>
			{props.showHeading !== false && (
				<Heading level={props.level} id={doc.name}>
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

			<CodeBlock
				lang="ts"
				code={`let ${doc.name}: ${signatureCode}`}
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

			{doc.typeDeclaration?.map((declaration, i) => {
				return (
					<Details key={i} summary={declaration.name} id={declaration.name}>
						{"kind" in declaration && declaration.kind === "function" ? (
							<FunctionTDoc
								doc={declaration}
								level={props.level + 1}
								showHeading={false}
							/>
						) : (
							<TypeDeclarationTDoc
								doc={declaration as TypeDeclarationDoc}
								level={props.level + 1}
								showHeading={false}
							/>
						)}
					</Details>
				);
			})}
		</>
	);
}

export function getVariableSignatureCode(doc: VariableDoc): TypeInfo {
	return {
		code: doc.type?.code || "",
		tokens: doc.type?.tokens,
	};
}

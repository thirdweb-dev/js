import { AccessorDoc, getAccessorSignature } from "typedoc-better-json";
import { CodeBlock } from "../../../../components/Document/Code";
import { TypedocSummary } from "./Summary";
import { Heading } from "../../../../components/Document/Heading";
import { SourceLinkTypeDoc } from "./SourceLink";
import { getTags } from "./utils/getTags";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import { sluggerContext } from "@/contexts/slugger";
import invariant from "tiny-invariant";
import { Callout, Details } from "@/components/Document";
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

			<Details id="signature" summary="Signature" noIndex>
				<CodeBlock
					lang="ts"
					code={signatureCode}
					tokenLinks={tokens ? await getTokenLinks(tokens) : undefined}
				/>
			</Details>

			{exampleTag?.summary && (
				<>
					<Heading level={subLevel} id={slugger.slug("example")} noIndex>
						Example
					</Heading>
					<TypedocSummary summary={exampleTag.summary} />
				</>
			)}

			{doc.returns?.summary && (
				<>
					<Heading id="returns" level={props.level + 1} noIndex>
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

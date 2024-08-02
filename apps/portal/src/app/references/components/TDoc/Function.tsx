import {
	FunctionDoc,
	FunctionParameter,
	FunctionSignature,
	getFunctionSignature,
} from "typedoc-better-json";
import { CodeBlock, InlineCode } from "../../../../components/Document/Code";
import { TypedocSummary } from "./Summary";
import { Heading } from "../../../../components/Document/Heading";
import { Callout } from "../../../../components/Document/Callout";
import { SourceLinkTypeDoc } from "./SourceLink";
import { Details } from "../../../../components/Document/Details";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import { sluggerContext } from "@/contexts/slugger";
import invariant from "tiny-invariant";
import { getTags } from "./utils/getTags";
import { getTokenLinks } from "./utils/getTokenLinks";
import { DocLink, Paragraph } from "@/components/Document";

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
				<>
					<Heading level={props.level} id={slugger.slug(doc.name)}>
						{doc.name}
					</Heading>
				</>
			)}

			{doc.source && <SourceLinkTypeDoc href={doc.source} />}
			{doc.signatures &&
				doc.signatures.map((signature, i) => (
					<RenderFunctionSignature
						signatureId={multipleSignatures ? i + 1 : undefined}
						signature={signature}
						name={doc.name}
						level={props.level + 1}
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
				<>
					<Heading
						level={props.level}
						id={slugger.slug(
							props.name + "-signature-" + props.signatureId,
							false,
						)}
						className="text-f-100"
						noIndex
					>
						Signature
						<span className="font-normal text-f-300">
							{" "}
							#{props.signatureId}
						</span>
					</Heading>
				</>
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

			<Details id={slugger.slug("signature")} summary="Signature" noIndex>
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
						id={slugger.slug(props.name + "--param--" + props.name, false)}
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
						id={slugger.slug(props.name + "-returns")}
						noIndex
					>
						Returns
					</Heading>
					<div>
						{signature.returns.type && (
							<Details
								id={slugger.slug(props.name + "-return-type")}
								summary="Return Type"
								noIndex
							>
								<CodeBlock
									code={`let returnType: ${signature.returns.type.code}`}
									lang="ts"
									tokenLinks={
										signature.returns.type.tokens
											? await getTokenLinks(signature.returns.type.tokens)
											: undefined
									}
								/>
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
							arguments.{" "}
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

async function ParameterTDoc(props: {
	param: FunctionParameter;
	level: number;
}) {
	const { param } = props;

	const slugger = sluggerContext.get();
	invariant(slugger, "slugger context not set");

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
								id={slugger.slug(param.name + "type")}
								noIndex
								anchorClassName={!param.summary ? "mt-0" : ""}
							>
								Type
							</Heading>

							<CodeBlock
								code={`let ${param.name}: ${param.type.code}`}
								tokenLinks={
									param.type.tokens
										? await getTokenLinks(param.type.tokens)
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
								id={slugger.slug(param.name + "example")}
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

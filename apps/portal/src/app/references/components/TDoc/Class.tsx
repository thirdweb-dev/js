import {
	ClassDoc,
	FunctionDoc,
	VariableDoc,
	getClassSignature,
} from "typedoc-better-json";
import { Heading } from "../../../../components/Document/Heading";
import { SourceLinkTypeDoc } from "./SourceLink";
import { FunctionTDoc } from "./Function";
import { CodeBlock } from "../../../../components/Document/Code";
import { VariableTDoc } from "./Variable";
import { AccessorTDoc } from "./Accessor";
import { Details } from "../../../../components/Document/Details";
import { getTokenLinks } from "./utils/getTokenLinks";
import { getTags } from "./utils/getTags";
import { Callout } from "@/components/Document";
import { DeprecatedCalloutTDoc } from "./Deprecated";
import { TypedocSummary } from "./Summary";
import { sluggerContext } from "@/contexts/slugger";
import invariant from "tiny-invariant";

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

	doc.properties?.forEach((property) => {
		if (property.flags) {
			if (property.flags.isPrivate || property.flags.isProtected) {
				return;
			}
		}

		// if property is a function - show it as a method
		if (property.typeDeclaration && property.typeDeclaration.length === 1) {
			const method = property.typeDeclaration[0];
			if (method && method.kind === "function") {
				methods?.push(method);
				return;
			}
		}

		// handling "preparable" methods - add a @prepare tag to them
		if (
			property.typeDeclaration &&
			property.typeDeclaration.length === 2 &&
			property.typeDeclaration.find((t) => t.name === "prepare")
		) {
			let isMethod = false;
			property.typeDeclaration?.find((m) => {
				if (m.kind === "function") {
					m.signatures?.forEach((s) => {
						if (!s.blockTags) {
							s.blockTags = [];
						}
						s.blockTags.push({
							tag: "@prepare",
						});
					});
					m.source = property.source;
					methods?.push(m);
					isMethod = true;
					return true;
				}
			});

			if (!isMethod) {
				properties.push(property);
			}
		} else {
			properties.push(property);
		}
	});

	const regularMethods = methods?.filter((m) => {
		if (m.signatures && m.signatures[0] && m.signatures[0]?.inheritedFrom) {
			return false;
		}
		return true;
	});

	const inheritedMethods = methods?.filter((m) => {
		if (m.signatures && m.signatures[0] && m.signatures[0]?.inheritedFrom) {
			return true;
		}
		return false;
	});

	const accessors = doc.accessors?.filter((accessor) => {
		return !accessor.flags?.isPrivate && !accessor.flags?.isProtected;
	});

	const { code: signatureCode, tokens } = getClassSignature(doc);

	const renderMethods = (_methods: FunctionDoc[]) =>
		_methods.map((method, i) => {
			const flags = method.signatures && method.signatures[0]?.flags;
			return (
				<Details
					key={i}
					summary={method.name}
					id={method.name}
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
			<Heading level={1} id={doc.name}>
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
					<Heading level={3} id={slugger.slug("example")} noIndex>
						Example
					</Heading>
					<TypedocSummary summary={exampleTag.summary} />
				</>
			)}

			<Details summary="Signature" id={slugger.slug("signature")} noIndex>
				<CodeBlock
					lang="ts"
					code={signatureCode}
					tokenLinks={tokens ? await getTokenLinks(tokens) : undefined}
				/>
			</Details>

			{/* Constructor */}
			{doc.constructor && (
				<Details id="constructor" level={2} summary="Constructor" noIndex>
					<FunctionTDoc doc={doc.constructor} level={2} showHeading={false} />
				</Details>
			)}

			{/* Methods */}
			{regularMethods && regularMethods.length > 0 && (
				<div>
					<Heading level={2} id="methods" noIndex>
						Methods
					</Heading>
					<div>{renderMethods(regularMethods)}</div>
				</div>
			)}

			{/* Inherited methods */}
			{inheritedMethods && inheritedMethods.length > 0 && (
				<div>
					<Heading level={2} id="methods" noIndex>
						Inherited Methods
					</Heading>
					<div>{renderMethods(inheritedMethods)}</div>
				</div>
			)}

			{/* Properties */}
			{properties && properties.length > 0 && (
				<div>
					<Heading level={2} id="properties" noIndex>
						Properties
					</Heading>
					<div>
						{properties.map((property, i) => {
							return (
								<Details key={i} summary={property.name} id={property.name}>
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
					<Heading level={2} id="properties" className="text-5xl" noIndex>
						Accessors
					</Heading>
					<div>
						{accessors.map((accessor, i) => {
							return (
								<Details key={i} id={accessor.name} summary={accessor.name}>
									<AccessorTDoc
										doc={accessor}
										key={accessor.name}
										level={3}
										hideHeading={true}
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

import { DocLink } from "../../../../components/Document/DocLink";

export function SourceLinkTypeDoc(props: { href: string }) {
	return (
		<div className="mb-6" data-noindex>
			<DocLink href={props.href} className="text-sm">
				<span className="text-sm text-f-300"> Defined in </span>
				{props.href.split("/packages/")[1]}
			</DocLink>
		</div>
	);
}

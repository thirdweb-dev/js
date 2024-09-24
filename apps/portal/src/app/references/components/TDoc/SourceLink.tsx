import { DocLink } from "../../../../components/Document/DocLink";

export function SourceLinkTypeDoc(props: { href: string }) {
  return (
    <div className="mb-6" data-noindex>
      <DocLink href={props.href} className="text-sm">
        <span className="text-f-300 text-sm"> Defined in </span>
        {props.href.split("/packages/")[1]}
      </DocLink>
    </div>
  );
}

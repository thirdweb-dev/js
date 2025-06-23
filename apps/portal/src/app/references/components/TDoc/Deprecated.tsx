import type { BlockTag } from "typedoc-better-json";
import { Callout } from "../../../../components/Document/Callout";
import { TypedocSummary } from "./Summary";

export function DeprecatedCalloutTDoc(props: { tag: BlockTag }) {
  return (
    <Callout disableIcon variant="warning">
      <div className="flex w-full flex-col gap-2 ">
        <div className="font-semibold text-lg">Deprecated</div>
        <div>
          {props.tag.summary && <TypedocSummary summary={props.tag.summary} />}
        </div>
      </div>
    </Callout>
  );
}

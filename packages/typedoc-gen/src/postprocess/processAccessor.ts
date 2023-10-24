import { JSONOutput, SomeType, Reflection } from "typedoc";
import {
  AccessorDoc,
  FunctionDoc,
  FunctionSignature,
  FunctionSignatureArg,
} from "./types";
import { getReadableType } from "./getReadableType";

export function getAccessorDoc(
  data: JSONOutput.DeclarationReflection,
): AccessorDoc {
  return {
    name: data.name,
    source: data.sources?.[0]?.url,
    summary: data.comment?.summary,
    returns: data.getSignature
      ? {
          type: data.getSignature.type
            ? getReadableType(data.getSignature.type)
            : undefined,
          summary: data.getSignature.comment?.blockTags?.find(
            (tag) => tag.tag === "@returns",
          )?.content,
        }
      : undefined,
    blockTags: data.comment?.blockTags?.filter((w) => w.tag !== "@returns"),
  };
}

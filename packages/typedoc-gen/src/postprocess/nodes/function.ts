import { JSONOutput, SomeType, Reflection } from "typedoc";
import {
  FunctionDoc,
  FunctionSignature,
  FunctionSignatureArg,
  TypeParameter,
} from "../types";
import { getReadableType } from "../utils/getReadableType";

export function getFunctionDoc(
  data: JSONOutput.DeclarationReflection,
): FunctionDoc {
  return {
    name: data.name,
    signatures: data.signatures?.map(getFunctionSignatureDoc),
    source: data.sources?.[0]?.url,
  };
}

function getFunctionSignatureDoc(signature: JSONOutput.SignatureReflection) {
  const output: FunctionSignature = {
    summary: signature.comment?.summary,
    args: signature.parameters?.map((param) => {
      const arg: FunctionSignatureArg = {
        name: param.name,
        type: param.type ? getReadableType(param.type) : undefined,
        summary: param.comment?.summary,
        flags: Object.keys(param.flags).length > 0 ? param.flags : undefined,
      };
      return arg;
    }),
    typeParameters: signature.typeParameter?.map((param) => {
      const typeParam: TypeParameter = {
        name: param.name,
        extendsType: param.type ? getReadableType(param.type) : undefined,
      };
      return typeParam;
    }),
    blockTags: signature.comment?.blockTags?.filter(
      (w) => w.tag !== "@returns",
    ),
    returns: {
      type: signature.type ? getReadableType(signature.type) : undefined,
      summary: signature.comment?.blockTags?.find(
        (tag) => tag.tag === "@returns",
      )?.content,
    },
  };

  return output;
}

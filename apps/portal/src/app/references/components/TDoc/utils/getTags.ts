import type { BlockTag } from "typedoc-better-json";

export function getTags(blockTags?: BlockTag[]) {
  const exampleTag = blockTags?.find((tag) => tag.tag === "@example");
  const deprecatedTag = blockTags?.find((tag) => tag.tag === "@deprecated");
  const remarksTag = blockTags?.find((t) => t.tag === "@remarks");
  const seeTag = blockTags?.find((t) => t.tag === "@see");

  // this is add manually by us in docs repo
  const prepareTag = blockTags?.find((t) => t.tag === "@prepare");

  return {
    deprecatedTag,
    exampleTag,
    prepareTag,
    remarksTag,
    seeTag,
  };
}

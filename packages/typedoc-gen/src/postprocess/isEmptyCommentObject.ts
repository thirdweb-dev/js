import { CommentJSON } from "../typedoc-parser/typedoc-parser";

export function isEmptyCommentObject(comment: CommentJSON) {
  if (
    comment &&
    !comment.description &&
    comment.blockTags.length === 0 &&
    comment.modifierTags.length === 0
  ) {
    return true;
  }
}

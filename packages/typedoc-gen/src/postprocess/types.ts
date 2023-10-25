import { JSONOutput } from "typedoc";

export type ProcessedDoc = {
  functions?: FunctionDoc[];
  hooks?: FunctionDoc[];
  components?: FunctionDoc[];
  types?: InterfaceDoc[];
  interfaces?: InterfaceDoc[];
  variables?: VariableDoc[];
  enums?: EnumDoc[];
  classes?: ClassDoc[];
};

export type FunctionDoc = {
  name: string;
  source?: string;
  signatures?: FunctionSignature[];
};

export type AccessorDoc = {
  name: string;
  source?: string;
  summary?: JSONOutput.CommentDisplayPart[];
  blockTags?: JSONOutput.CommentTag[];
  returns?: {
    type?: string;
    summary?: JSONOutput.CommentDisplayPart[];
  };
};

export type FunctionSignature = {
  summary?: JSONOutput.CommentDisplayPart[];
  args?: FunctionSignatureArg[];
  typeParameters?: TypeParameter[];
  returns?: {
    type?: string;
    summary?: JSONOutput.CommentDisplayPart[];
  };
  blockTags?: JSONOutput.CommentTag[];
};

export type TypeParameter = {
  name: string;
  extendsType?: string;
};

export type FunctionSignatureArg = {
  name: string;
  type?: string;
  summary?: JSONOutput.CommentDisplayPart[];
  isOptional?: boolean;
  isRest?: boolean;
};

export type InterfaceDoc = {
  name: string;
  source?: string;
  summary?: JSONOutput.CommentDisplayPart[];
  type?: string;
  typeDeclaration?: TypeDeclarationDoc[];
};

export type VariableDoc = {
  name: string;
  source?: string;
  summary?: JSONOutput.CommentDisplayPart[];
  type?: string;
  typeDeclaration?: VariableTypeDeclaration[];
};

export type VariableTypeDeclaration = TypeDeclarationDoc | FunctionDoc;

export type TypeDeclarationDoc = {
  name: string;
  type: string;
  summary?: JSONOutput.CommentDisplayPart[];
};

export type EnumDoc = {
  name: string;
  source?: string;
  summary?: JSONOutput.CommentDisplayPart[];
  members: Array<{
    name: string;
    value: string;
    summary?: JSONOutput.CommentDisplayPart[];
  }>;
};

export type ClassDoc = {
  name: string;
  source?: string;
  constructor: FunctionDoc;
  properties?: VariableDoc[];
  methods?: FunctionDoc[];
  accessors?: AccessorDoc[];
  summary?: JSONOutput.CommentDisplayPart[];
  blockTags?: JSONOutput.CommentTag[];
  implements?: string[];
};

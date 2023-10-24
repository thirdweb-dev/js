import { JSONOutput } from "typedoc";

export type ProcessedDoc = {
  groups: {
    functions: FunctionDoc[];
    hooks: FunctionDoc[];
    components: FunctionDoc[];
    types: InterfaceDoc[];
    interfaces: InterfaceDoc[];
    variables: VariableDoc[];
    enums: EnumDoc[];
    classes: any[]; // TODO
  };
};

export type FunctionDoc = {
  name: string;
  source?: string;
  signatures?: FunctionSignature[];
};

export type FunctionSignature = {
  summary?: JSONOutput.CommentDisplayPart[];
  args?: FunctionSignatureArg[];
  returns?: {
    type?: string;
    summary?: JSONOutput.CommentDisplayPart[];
  };
  blockTags?: JSONOutput.CommentTag[];
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

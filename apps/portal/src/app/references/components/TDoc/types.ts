import type {
	AccessorDoc,
	ClassDoc,
	EnumDoc,
	FunctionDoc,
	InterfaceDoc,
	VariableDoc,
} from "typedoc-better-json";

export type SomeDoc =
	| FunctionDoc
	| ClassDoc
	| AccessorDoc
	| VariableDoc
	| InterfaceDoc
	| EnumDoc;

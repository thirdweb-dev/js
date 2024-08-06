import { sluggerContext } from "@/contexts/slugger";
import { ClassTDoc } from "./Class";
import { EnumTDoc } from "./Enum";
import { FunctionTDoc } from "./Function";
import { TypeTDoc } from "./Type";
import { VariableTDoc } from "./Variable";
import { SomeDoc } from "./types";
import GithubSlugger from "github-slugger";

export function RootTDoc(props: { doc: SomeDoc }) {
	sluggerContext.set(new GithubSlugger());

	switch (props.doc.kind) {
		case "function": {
			return <FunctionTDoc doc={props.doc} level={1} />;
		}
		case "class": {
			return <ClassTDoc doc={props.doc} />;
		}

		case "variable": {
			return <VariableTDoc doc={props.doc} level={1} />;
		}

		case "type": {
			return <TypeTDoc doc={props.doc} level={1} />;
		}

		case "enum": {
			return <EnumTDoc doc={props.doc} level={1} />;
		}

		default: {
			return null;
		}
	}
}

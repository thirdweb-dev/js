import type { TransformedDoc } from "typedoc-better-json";

export function mergeDocs(doc1: TransformedDoc, doc2: TransformedDoc) {
	const mergedDoc: TransformedDoc = {
		meta: doc1.meta,
		functions: mergeArrays(doc1.functions, doc2.functions),
		classes: mergeArrays(doc1.classes, doc2.classes),
		components: mergeArrays(doc1.components, doc2.components),
		enums: mergeArrays(doc1.enums, doc2.enums),
		hooks: mergeArrays(doc1.hooks, doc2.hooks),
		types: mergeArrays(doc1.types, doc2.types),
		variables: mergeArrays(doc1.variables, doc2.variables),
	};

	return mergedDoc;
}

function mergeArrays<T>(arr1?: T[], arr2?: T[]) {
	const arr = [...(arr1 || []), ...(arr2 || [])];
	if (arr.length === 0) {
		return undefined;
	}
	return arr;
}

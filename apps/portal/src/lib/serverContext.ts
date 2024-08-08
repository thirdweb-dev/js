import "server-only";
import { cache } from "react";

export function serverContext<T>(defaultValue?: T): {
	get: () => T | undefined;
	set: (v: T) => void;
} {
	const getRef = cache(() => ({ current: defaultValue }));
	return {
		get: () => getRef().current,
		set: (value: T) => {
			getRef().current = value;
		},
	};
}

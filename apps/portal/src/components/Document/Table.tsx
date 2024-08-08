import { ScrollShadow } from "../others/ScrollShadow/ScrollShadow";

export function Table(props: { children: React.ReactNode }) {
	return (
		<ScrollShadow className="my-7 rounded-lg border">
			<div className="w-full">
				<table className="min-w-full border-collapse text-sm [&_tr:last-of-type]:border-none">
					{props.children}
				</table>
			</div>
		</ScrollShadow>
	);
}

export function Tr(props: { children: React.ReactNode }) {
	return (
		<tr className="border-b p-4 pb-3 pl-8 pt-0 text-left font-medium text-f-200">
			{props.children}
		</tr>
	);
}

export function TBody(props: { children: React.ReactNode }) {
	return <tbody className="w-full rounded-lg ">{props.children}</tbody>;
}

export function Th(props: { children: React.ReactNode }) {
	return (
		<th className="border-b bg-b-700 p-4 pb-3 pl-8 text-left text-base font-semibold text-f-100">
			{props.children}
		</th>
	);
}

export function Td(props: { children: React.ReactNode }) {
	return (
		<td className="w-min p-4 pl-8 text-base leading-relaxed text-f-200">
			{props.children}
		</td>
	);
}

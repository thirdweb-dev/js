import Link from "next/link";
import Image from "next/image";

export function ConnectCard(props: {
	title: string;
	href: string;
	iconUrl: string;
}) {
	return (
		<Link href={props.href} target="_blank" className="flex cursor-default">
			<article className="group/article flex w-full items-center overflow-hidden rounded-lg border bg-b-800 transition-colors duration-300 hover:border-accent-500 hover:bg-accent-900">
				<div className="flex w-full items-center gap-4 p-4">
					<Image src={props.iconUrl} width={40} height={40} alt="" />
					<h3 className="text-base font-medium">{props.title}</h3>
				</div>
			</article>
		</Link>
	);
}

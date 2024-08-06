import Link from "next/link";
import { BsGithub } from "react-icons/bs";

export function GithubButtonLink(props: { href: string }) {
	return (
		<Link
			href={props.href}
			target="_blank"
			className="inline-flex items-center rounded-lg border text-sm duration-200 hover:border-f-300"
		>
			<div className="p-2.5">
				<BsGithub className="size-5" />
			</div>
			<div className="border-l-2 p-2.5 font-semibold">View on GitHub</div>
		</Link>
	);
}

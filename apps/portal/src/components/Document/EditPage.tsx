import Link from "next/link";
import { BsGithub } from "react-icons/bs";

const prefix = `https://github.com/thirdweb-dev/docs-v2/edit/main/src/app`;

export function EditPage(props: { path: string }) {
	return (
		<Link
			href={prefix + props.path}
			target="_blank"
			className="inline-flex items-center rounded-lg border text-sm duration-200 hover:border-f-300"
		>
			<div className="p-2.5">
				<BsGithub className="size-5" />
			</div>
			<div className="border-l-2 p-2.5 font-semibold">Edit this page</div>
		</Link>
	);
}

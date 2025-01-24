import Link from "next/link";
import { GithubIcon } from "./GithubButtonLink";

const prefix =
  "https://github.com/thirdweb-dev/js/edit/main/apps/portal/src/app";

export function EditPage(props: { path: string }) {
  return (
    <Link
      href={prefix + props.path}
      target="_blank"
      className="inline-flex items-center rounded-lg border text-sm duration-200 hover:border-active-border"
    >
      <div className="p-2.5">
        <GithubIcon className="size-5" />
      </div>
      <div className="border-l-2 p-2.5 font-semibold">Edit this page</div>
    </Link>
  );
}

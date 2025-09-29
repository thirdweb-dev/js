import Link from "next/link";
import { Button } from "../ui/button";
import { GithubIcon } from "./GithubButtonLink";

const prefix =
  "https://github.com/thirdweb-dev/js/edit/main/apps/portal/src/app";

export function EditPage(props: { path: string }) {
  return (
    <Button variant="outline" className="gap-2 rounded-xl bg-card" asChild>
      <Link href={prefix + props.path} target="_blank">
        <GithubIcon className="size-4 text-muted-foreground" />
        Edit this page
      </Link>
    </Button>
  );
}

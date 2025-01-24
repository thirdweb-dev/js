import { GithubButtonLink } from "./GithubButtonLink";
import { Paragraph } from "./Paragraph";

export function OpenSourceCard(props: {
  description?: string;
  title: string;
  href: string;
}) {
  return (
    <div className="my-4 rounded-lg border bg-card p-4">
      <div className="mb-2 font-semibold text-lg ">
        {props.title || "Open Source"}
      </div>
      <Paragraph className="mb-5 text-base text-muted-foreground">
        {props.description ||
          `${props.title} is open-source. View and contribute to its source code on GitHub.`}
      </Paragraph>
      <div className="flex">
        <GithubButtonLink href={props.href} />
      </div>
    </div>
  );
}

import { getProject } from "@/api/projects";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProjectSelector(props: {
  params: { team_slug: string; project_slug: string };
}) {
  const project = await getProject(
    props.params.team_slug,
    props.params.project_slug,
  );

  if (!project) {
    // not a valid project, redirect back to team page
    redirect(`/team/${props.params.team_slug}`);
  }

  return (
    <>
      <div aria-hidden className="text-xl opacity-20 font-light">
        /
      </div>
      {/* TODO: likely want project switcher here (similar to team) */}
      <Link
        href={`/team/${props.params.team_slug}/${project.slug}`}
        className="font-normal text-sm flex flex-row gap-1 items-center"
      >
        {project.name}
      </Link>
    </>
  );
}

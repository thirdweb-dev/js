import { redirect } from "next/navigation";

export default function Page({
  params,
}: { params: { team_slug: string; project_slug: string; slug: string } }) {
  redirect(
    `/team/${params.team_slug}/${params.project_slug}/connect/ecosystem/${params.slug}/analytics`,
  );
}

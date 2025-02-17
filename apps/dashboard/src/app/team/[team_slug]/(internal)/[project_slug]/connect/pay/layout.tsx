import { getProject } from "@/api/projects";
import { TabPathLinks } from "@/components/ui/tabs";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    notFound();
  }

  const payLayoutPath = `/team/${params.team_slug}/${params.project_slug}/connect/pay`;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
        <div className="max-w-[700px]">
          <h1 className="mb-3 font-bold text-3xl tracking-tight md:text-4xl">
            Pay
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Pay allows your users to purchase cryptocurrencies and execute
            transactions with their credit card or debit card, or with any token
            via cross-chain routing.{" "}
            <Link
              target="_blank"
              href="https://portal.thirdweb.com/connect/pay/overview"
              className="!text-link-foreground"
            >
              Learn more
            </Link>
          </p>
        </div>
      </div>

      <TabPathLinks
        className="w-full"
        links={[
          {
            name: "Analytics",
            path: payLayoutPath,
            exactMatch: true,
          },
          {
            name: "Webhooks",
            path: `${payLayoutPath}/webhooks`,
          },
          {
            name: "Settings",
            path: `${payLayoutPath}/settings`,
          },
        ]}
      />

      {props.children}
    </div>
  );
}

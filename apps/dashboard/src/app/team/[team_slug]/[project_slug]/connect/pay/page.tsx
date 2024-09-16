import { getProject } from "@/api/projects";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PayPageUI } from "./PayPageUI";

export default async function Page(props: {
  params: {
    team_slug: string;
    project_slug: string;
  };
}) {
  const project = await getProject(
    props.params.team_slug,
    props.params.project_slug,
  );

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
        <div className="max-w-[700px]">
          <h1 className="text-3xl md:text-4xl tracking-tight font-bold mb-3">
            Pay
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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

      <PayPageUI
        apiKey={{
          ...project,
          key: project.publishableKey, // clientId
        }}
      />
    </div>
  );
}

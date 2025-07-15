import Link from "next/link";
import { getTeams } from "@/api/team";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { loginRedirect } from "@/utils/redirects";
import { CreateTicket } from "./components/create-ticket.client";

export default async function Page() {
  const teams = await getTeams();

  const pagePath = "/support/create-ticket";

  if (!teams || teams.length === 0) {
    loginRedirect(pagePath);
  }

  return (
    <div>
      <Breadcrumb className="border-border border-b px-6 py-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/support">Support</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Get Support</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container max-w-[750px] py-10">
        <CreateTicket
          teams={teams.map((t) => ({
            id: t.id,
            name: t.name,
          }))}
        />
      </div>
    </div>
  );
}

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../api/lib/getAuthToken";
import { CreateTicket } from "./components/create-ticket.client";

export default async function Page() {
  const authToken = await getAuthToken();

  if (!authToken) {
    return redirect(
      `/login?next=${encodeURIComponent("/support/create-ticket")}`,
    );
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
        <CreateTicket />
      </div>
    </div>
  );
}

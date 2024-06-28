import { redirect } from "next/navigation";

export default function Page({ params }: { params: { ecosystemId: string } }) {
  // For now, we only have the permissions page (we'll have more tabs later)
  redirect(`/dashboard/connect/ecosystem/${params.ecosystemId}/permissions`);
}

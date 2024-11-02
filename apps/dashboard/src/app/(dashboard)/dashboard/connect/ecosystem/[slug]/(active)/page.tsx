import { redirect } from "next/navigation";

export default function Page({ params }: { params: { slug: string } }) {
  redirect(`/dashboard/connect/ecosystem/${params.slug}/analytics`);
}

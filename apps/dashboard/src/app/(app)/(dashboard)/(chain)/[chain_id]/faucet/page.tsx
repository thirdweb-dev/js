// handle deprecated route
// redirect /<chain_id>/faucet to /<chain_id>

import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ chain_id: string }>;
}) {
  redirect(`/${(await props.params).chain_id}`);
}

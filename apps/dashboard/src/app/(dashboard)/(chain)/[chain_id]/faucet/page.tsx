// handle deprecated route
// redirect /<chain_id>/faucet to /<chain_id>

import { redirect } from "next/navigation";

export default function Page(props: { params: { chain_id: string } }) {
  redirect(`/${props.params.chain_id}`);
}

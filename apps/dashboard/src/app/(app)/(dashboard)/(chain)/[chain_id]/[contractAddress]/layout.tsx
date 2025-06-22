import type { Metadata } from "next";
import { getAuthToken } from "@/api/auth-token";
import {
  generateContractLayoutMetadata,
  SharedContractLayout,
} from "./shared-layout";

export default async function Layout(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
  children: React.ReactNode;
}) {
  const [params, authToken] = await Promise.all([props.params, getAuthToken()]);
  return (
    <SharedContractLayout
      authToken={authToken}
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      projectMeta={undefined}
    >
      {props.children}
    </SharedContractLayout>
  );
}

export async function generateMetadata(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}): Promise<Metadata> {
  const params = await props.params;
  return generateContractLayoutMetadata({
    chainIdOrSlug: params.chain_id,
    contractAddress: params.contractAddress,
  });
}

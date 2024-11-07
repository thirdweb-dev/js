import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";

export default async function RootTeamLayout(props: {
  children: React.ReactNode;
}) {
  return <ChakraProviderSetup>{props.children}</ChakraProviderSetup>;
}

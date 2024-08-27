import { AppFooter } from "../../../@/components/blocks/app-footer";
import { TWAutoConnect } from "./components/autoconnect";

export default async function RootTeamLayout(props: {
  children: React.ReactNode;
  params: { team_slug: string };
}) {
  return (
    <div className="h-full flex flex-col ">
      <div className="grow">{props.children}</div>
      <TWAutoConnect />
      <AppFooter />
    </div>
  );
}

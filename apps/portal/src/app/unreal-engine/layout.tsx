import { createMetadata } from "@/components/Document";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { PlatformSelector } from "@/components/others/PlatformSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      editPageButton={true}
      sideBar={sidebar}
      sidebarHeader={
        <div className="flex-col items-center gap-1">
          <p className="py-5 font-semibold text-foreground text-lg">Connect</p>
          <PlatformSelector selected="Unreal Engine" />
        </div>
      }
    >
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  description:
    "Seamlessly create In-App Wallets, sign in with email or socials, unlock Account Abstraction features and more.",
  image: {
    icon: "unreal-engine",
    title: "Thirdweb Unreal Engine SDK",
  },
  title: "Thirdweb Unreal Engine SDK",
});

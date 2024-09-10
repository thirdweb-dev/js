import { CodeExample } from "@/components/code/code-example";
import { SocialProfiles } from "@/components/social/social-profiles";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { APIHeader } from "../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  metadataBase,
  title: "Social APIs | thirdweb Connect",
  description:
    "Retrieve any user's onchain identity from popular protocols like ENS, Lens, Farcaster, and more.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="pb-20 container px-0">
        <APIHeader
          title="Get any user's onchain identity"
          description={
            <>
              Gain context about your users and their profiles across other apps
              as soon as they sign into your app.
            </>
          }
          docsLink="https://portal.thirdweb.com/connect" // TODO: update this once we have Social API docs
          heroLink="/in-app-wallet.png"
        />

        <section className="space-y-8">
          <UserProfiles />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function UserProfiles() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Social Profiles
        </h2>
        <p className="max-w-[600px]">
          Get users&apos; profiles across apps like ENS, Lens, Farcaster, and
          more.
        </p>
      </div>

      <CodeExample
        preview={<SocialProfiles />}
        code={`import { useSocialProfiles, useActiveAccount } from "thirdweb/react";

        function App(){
        const account = useActiveAccount();
        const { data: profiles } = useSocialProfiles({
          client,
          address: account?.address,
        });

          return (
    <div className="flex flex-col gap-4">
      {profiles?.map((profile) => (
    <div className="flex gap-4 w-[300px] bg-background border rounded-lg p-4 shadow-md">
      {profile.avatar ? (
        <img
          src={resolveScheme({ client: THIRDWEB_CLIENT, uri: profile.avatar })}
          alt={profile.name}
          className="size-10 rounded-full"
        />
      ) : (
        <div className="size-10 rounded-full bg-muted-foreground" />
      )}
      <div className="flex gap-2 items-center justify-between flex-1">
        <div className="text-base font-semibold">{profile.name}</div>
        <Badge variant="secondary">{profile.type.toUpperCase()}</Badge>
      </div>
    </div >
      ))
}
    </div >);
}; `}
        lang="tsx"
      />
    </>
  );
}

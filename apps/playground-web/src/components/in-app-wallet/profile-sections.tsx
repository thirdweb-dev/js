import { CodeExample } from "@/components/code/code-example";
import { LinkAccount, LinkedAccounts } from "./profiles";

export function Profiles() {
  return (
    <div>
      <CodeExample
        header={{
          title: "View Linked Profiles",
          description:
            "View all web2 and web3 linked profiles for a user along with specific details for each profile type, including name, email, profile picture and more.",
        }}
        preview={<LinkedAccounts />}
        code={`\
import { useProfiles, useActiveAccount, ConnectButton } from "thirdweb/react";

function App() {
  const account = useActiveAccount();
  const { data: profiles } = useProfiles({
    client,
  });

  if (!account) {
    return <ConnectButton client={client} />;
  }

  return <code> {JSON.stringify(profiles || [], null, 2)}</code>;
}`}
        lang="tsx"
      />

      <div className="h-14" />

      <CodeExample
        header={{
          title: "Link a Profile",
          description: (
            <>
              Link a web2 or web3 profile to the connected account.
              <br />
              You can do this with hooks like shown here or from the prebuilt
              connect UI.
            </>
          ),
        }}
        preview={<LinkAccount />}
        code={`\
import { useLinkProfile, useActiveAccount, ConnectButton } from "thirdweb/react";

function App() {
  const { mutate: linkProfile, isPending, error } = useLinkProfile();

  const linkMetamask = () => {
    // link any external wallet
    linkProfile({
      client: THIRDWEB_CLIENT,
      strategy: "wallet",
      wallet: createWallet("io.metamask"), // or any other wallet
      chain: baseSepolia,
    });
  };

  const linkPasskey = () => {
    // link any web2 identity provider
    linkProfile({
      client: THIRDWEB_CLIENT,
      strategy: "passkey", // or "email", "phone", etc.
      type: "sign-up",
    });
  };

  if (!account) {
    return <ConnectButton client={client} />;
  }

  return (
    <div>
      <button onClick={linkMetamask}>Link Metamask</button>
      <button onClick={linkPasskey}>Link Passkey</button>
    </div>
  );
}`}
        lang="tsx"
      />
    </div>
  );
}

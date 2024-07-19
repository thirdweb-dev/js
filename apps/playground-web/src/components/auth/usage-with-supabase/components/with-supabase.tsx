import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { shortenAddress } from "thirdweb/utils";
import { createClient } from "../utils/server";
import { LinkWalletButton } from "./link-button";
import { LogoutButton } from "./logout-button";
import { SubmitButton } from "./submit-button";
import { UnlinkButton } from "./unlink-button";

export async function WithSupabase({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <SupabaseAuthUI searchParams={searchParams} />;
  }

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-3 flex flex-col">
      <div className="flex justify-center mt-6">
        <Image
          className="rounded-full"
          src="/auth-images/user.svg"
          width={96}
          height={96}
          alt="User"
        />
      </div>
      <div className="text-center px-6 py-4">
        <p className="text-gray-700 text-base">{user.email}</p>
      </div>

      {user.user_metadata.wallet_address ? (
        <div className="flex flex-col text-black mx-auto">
          <div>Associated address</div>
          <div className="text-center">
            {shortenAddress(user.user_metadata.wallet_address)}
          </div>
          <UnlinkButton />
        </div>
      ) : (
        <LinkWalletButton />
      )}

      <LogoutButton />
    </div>
  );
}

function SupabaseAuthUI({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();
    console.log({ email, password });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(`/connect/auth?message=${error.message}`);
    }
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/connect/auth?message=Could not authenticate user");
    }

    return redirect(
      "/connect/auth?message=Check email to continue sign in process",
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <SubmitButton
          formAction={signUp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-1 px-3 py-1 text-yellow-400 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}

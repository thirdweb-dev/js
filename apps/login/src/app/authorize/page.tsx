/* eslint-disable @next/next/no-img-element */
import { getLoginConfig } from "@/api/login/config";
import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/theme-toggle";
import { notFound, redirect } from "next/navigation";
import type { Oauth2AuthorizeParams } from "../../lib/oauth";

function validateParams(searchParams: Oauth2AuthorizeParams) {
  if (!searchParams.redirect_uri) {
    // can't redirect so I guess it's 404
    // TODO: show an error message
    notFound();
  }
  if (searchParams.response_type !== "code") {
    redirect(
      `${searchParams.redirect_uri}?error=invalid_request&error_description=Invalid response type`,
    );
  }
  if (!searchParams.client_id) {
    redirect(
      `${searchParams.redirect_uri}?error=invalid_request&error_description=Missing client_id`,
    );
  }

  if (!searchParams.code_challenge) {
    redirect(
      `${searchParams.redirect_uri}?error=invalid_request&error_description=Missing code_challenge`,
    );
  }

  if (
    searchParams.code_challenge_method !== "S256" &&
    searchParams.code_challenge_method !== "plain"
  ) {
    redirect(
      `${searchParams.redirect_uri}?error=invalid_request&error_description=Invalid code challenge method`,
    );
  }
}

export default async function LoginPage(props: {
  searchParams: Promise<Oauth2AuthorizeParams>;
}) {
  const searchParams = await props.searchParams;
  // validate params
  validateParams(searchParams);

  // get the config
  const config = await getLoginConfig(searchParams.client_id);

  // if no config -> invalid client_id
  if (!config) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <p className="text-center font-medium text-lg">Invalid Client Id</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="brand content"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between gap-2">
          <a
            href={config.logoLink}
            className="flex items-center gap-2 font-medium"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <img src={config.logo} alt={config.name} className="size-4" />
            </div>
            {config.name}
          </a>
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-md">
            <LoginForm config={config} oauthParams={searchParams} />
          </div>
        </div>
      </div>
    </div>
  );
}

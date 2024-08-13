// pages router friendly version of auth-actions
// once we move everything to app router, we can remove this and just use auth-actions

import type { SiweAuthOptions } from "thirdweb/react";

export const getLoginPayloadClient: SiweAuthOptions["getLoginPayload"] = async (
  params,
) => {
  const res = await fetch(
    `/api/auth/get-login-payload?address=${params.address}&chainId=${params.chainId}`,
  );
  const data = await res.json();
  console.log("payload", data);
  return data;
};

// for some reason this is not working
export const isLoggedInClient: SiweAuthOptions["isLoggedIn"] = async (
  address,
) => {
  const res = await fetch(`/api/auth/is-logged-in?address=${address}`);
  const data = await res.json();
  return data.isLoggedIn;
};

export const doLogoutClient: SiweAuthOptions["doLogout"] = async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
};

export const doLoginClient: SiweAuthOptions["doLogin"] = async (params) => {
  await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(params),
  });
};

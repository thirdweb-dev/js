const LOGGED_IN_ONLY_PATHS = [
  // must be logged in to go through onboarding
  "/onboarding",
  // anything that _starts_ with /dashboard is logged in only
  "/dashboard",
  // team pages are logged in only
  "/team",
  // anything that _starts_ with /cli is logged in only
  "/cli",
  // publish page
  "/contracts/publish",
];

export function isLoginRequired(pathname: string) {
  return LOGGED_IN_ONLY_PATHS.some((path) => pathname.startsWith(path));
}

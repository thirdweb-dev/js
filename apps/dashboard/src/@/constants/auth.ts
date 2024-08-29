const LOGGED_IN_ONLY_PATHS = [
  // anything that _starts_ with /dashboard is logged in only
  "/dashboard",
  // team pages are logged in only
  "/team",
  // anything that _starts_ with /cli is logged in only
  "/cli",
  "/support",

  // TODO: add any other logged in only paths here
];

export function isLoginRequired(pathname: string) {
  return LOGGED_IN_ONLY_PATHS.some((path) => pathname.startsWith(path));
}

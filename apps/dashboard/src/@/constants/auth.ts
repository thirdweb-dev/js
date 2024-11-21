export function isLoginRequired(pathname: string) {
  // remove '/' in front and then split by '/'
  const paths = pathname.slice(1).split("/");

  // /team, /cli
  if (paths[0] === "team" || paths[0] === "cli") {
    return true;
  }

  // /contracts/publish
  if (paths[0] === "contracts" && paths[1] === "publish") {
    return true;
  }

  return false;
}

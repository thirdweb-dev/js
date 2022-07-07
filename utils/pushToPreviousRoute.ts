import { NextRouter } from "next/router";

export const pushToPreviousRoute = (router: NextRouter) => {
  const splittedRoute = router.asPath.split("/");
  const previousRoute = splittedRoute
    .slice(0, splittedRoute.length - 1)
    .join("/");

  return router.push(previousRoute);
};

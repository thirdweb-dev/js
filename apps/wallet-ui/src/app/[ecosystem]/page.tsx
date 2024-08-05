import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";

export default function Page() {
  const userAddress = getCurrentUser();

  if (!userAddress) {
    redirect("/login"); // This will route to /[ecosystem]/login based on the subdomain routing
  } else {
    redirect(`/${userAddress}/`);
  }

  return null;
}

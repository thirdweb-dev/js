import "server-only";
import { headers } from "next/headers";

export const getIpAddress = () => {
  const headersList = headers();
  const xForwardedFor = headersList.get("x-forwarded-for");
  return xForwardedFor || headersList.get("x-real-ip") || null;
};

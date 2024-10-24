import { THIRDWEB_ANALYTICS_API_HOST } from "constants/urls";

export async function getAccountPreferences(args: {
  accountId: string;
}) {
  const { accountId } = args;

  const res = await fetch(
    `${THIRDWEB_ANALYTICS_API_HOST}/v1/preferences/account/${accountId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const json = await res.json();

  if (res.status !== 200) {
    if (res.status === 404) {
      return null;
    }
    throw new Error(json.message);
  }

  return json.data;
}

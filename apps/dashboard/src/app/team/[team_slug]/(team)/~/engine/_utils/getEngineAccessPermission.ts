"use client";

// can not fetch engine permission on server - instance url can be localhost url

export async function getEngineAccessPermission(params: {
  authToken: string;
  instanceUrl: string;
}) {
  try {
    const instanceUrl = params.instanceUrl.endsWith("/")
      ? params.instanceUrl
      : `${params.instanceUrl}/`;

    const res = await fetch(`${instanceUrl}auth/permissions/get-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.authToken}`,
      },
    });

    return {
      ok: res.ok, // has access if this is true
      status: res.status,
    };
  } catch {
    return {
      ok: false,
      status: 500,
      fetchFailed: true,
    };
  }
}

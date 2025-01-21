export async function getEngineAccessPermission(params: {
  authToken: string;
  instanceUrl: string;
}) {
  try {
    const res = await fetch(`${params.instanceUrl}auth/permissions/get-all`, {
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
    };
  }
}

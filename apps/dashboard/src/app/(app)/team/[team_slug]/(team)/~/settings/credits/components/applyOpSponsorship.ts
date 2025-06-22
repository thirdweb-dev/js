"use server";

export async function applyOpSponsorship(params: {
  fields: {
    name: string;
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    value: any;
  }[];
}) {
  const { fields } = params;

  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    return {
      error: "missing HUBSPOT_ACCESS_TOKEN",
      ok: false,
    };
  }

  const response = await fetch(
    "https://api.hsforms.com/submissions/v3/integration/secure/submit/23987964/2fbf6a3b-d4cc-4a23-a4f5-42674e8487b9",
    {
      body: JSON.stringify({ fields }),
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    const errorMessage = await response.text();
    return {
      error: errorMessage,
      ok: response.ok,
    };
  }

  return {
    ok: response.ok,
  };
}

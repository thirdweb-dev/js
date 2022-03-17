const URL = "https://api.convertkit.com/v3/forms/2840699/subscribe";

export async function sendEmailToConvertkit(email: string) {
  const data = {
    email,
    api_key: process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY,
  };
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return await response.json();
}

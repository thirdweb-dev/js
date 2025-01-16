"use server";

type EmailSignupParams = {
  email: string;
  send_welcome_email?: boolean;
};

export async function emailSignup(payLoad: EmailSignupParams) {
  const response = await fetch(
    "https://api.beehiiv.com/v2/publications/pub_9f54090a-6d14-406b-adfd-dbb30574f664/subscriptions",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        email: payLoad.email,
        send_welcome_email: payLoad.send_welcome_email || false,
        utm_source: "thirdweb.com",
      }),
    },
  );

  return {
    status: response.status,
  };
}

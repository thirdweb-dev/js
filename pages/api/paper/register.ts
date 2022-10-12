import { withSentry } from "@sentry/nextjs";
import { PAPER_API_URL } from "@thirdweb-dev/sdk/evm";
import { NextApiRequest, NextApiResponse } from "next";

const POSSIBLE_METHODS = ["GET", "POST"];

const registerUrl = `${PAPER_API_URL}/register-contract`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.method || !POSSIBLE_METHODS.includes(req.method)) {
    return res.status(400).json({ error: "invalid method" });
  }

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: authorizationHeader,
  };

  // handle GET request
  if (req.method === "GET") {
    const { contractAddress, chain } = req.query;
    if (!contractAddress || !chain) {
      return res.status(400).json({ error: "invalid query" });
    }
    const url = new URL(registerUrl);
    url.searchParams.append("contractAddress", contractAddress as string);
    url.searchParams.append("chain", chain as string);

    try {
      const response = await fetch(url, {
        headers,
      });
      if (response.status >= 400) {
        console.error("error", response.status, response.statusText);
        return res.status(response.status).json({ error: response.statusText });
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      console.error("failed to proxy request", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  // handle POST request
  if (req.method === "POST") {
    const proxyBody = req.body;

    if (!proxyBody) {
      return res.status(400).json({ error: "invalid request" });
    }

    try {
      const response = await fetch(registerUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(proxyBody),
      });
      if (response.status >= 400) {
        console.error("error", response.status, response.statusText);
        return res.status(response.status).json({ error: response.statusText });
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      console.error("failed to proxy request", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export default withSentry(handler);

import { getThirdwebClient } from "@/constants/thirdweb.server";
import {
  getFarcasterAccountAddress,
  validateFrameMessage,
} from "lib/farcaster-frames";
import type { NextApiRequest, NextApiResponse } from "next";
import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { errorResponse } from "utils/api";
import { getErc721PreparedEncodedData } from "utils/tx-frame";
import { abi } from "./abi";

// https://thirdweb.com/base/0x352810fF1c51a42B568662D46570A30B590a715a
const contractAddress = "0x352810fF1c51a42B568662D46570A30B590a715a";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Return error response if method is not POST
  if (req.method !== "POST") {
    return errorResponse("Invalid method", 400);
  }

  // Validate message with @coinbase/onchainkit
  const { isValid, message } = await validateFrameMessage(req.body);

  // Validate if message is valid
  if (!isValid || !message) {
    return errorResponse("Invalid message", 400);
  }

  // Get the first verified account address or custody address
  const accountAddress = getFarcasterAccountAddress(message.interactor);

  // Get encoded data
  const data = await getErc721PreparedEncodedData(
    accountAddress,
    getContract({
      chain: base,
      address: contractAddress,
      client: getThirdwebClient(),
    }),
  );

  // Return transaction details response to farcaster
  return res.status(200).json({
    chainId: "eip155:8453",
    method: "eth_sendTransaction",
    params: {
      abi,
      to: contractAddress,
      data,
      value: "0",
    },
  });
}

import {
  getContractForErc721OpenEdition,
  getErc721PreparedEncodedData,
  getFarcasterAccountAddress,
} from "utils/tx-frame";
import { CoinbaseKit } from "classes/CoinbaseKit";
import { errorResponse } from "utils/api";
import { abi } from "./abi";
import { FrameRequest } from "@coinbase/onchainkit";
import { NextApiRequest, NextApiResponse } from "next";

// https://thirdweb.com/base/0xB6606041437BCBD727373ffF037dDa0247771184
const contractAddress = "0xB6606041437BCBD727373ffF037dDa0247771184";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Return error response if method is not POST
  if (req.method !== "POST") {
    return errorResponse("Invalid method", 400);
  }

  // Validate message with @coinbase/onchainkit
  const { isValid, message } = await CoinbaseKit.validateMessage(
    req.body as FrameRequest,
  );

  // Validate if message is valid
  if (!isValid || !message) {
    return errorResponse("Invalid message", 400);
  }

  // Get the first verified account address or custody address
  const accountAddress = getFarcasterAccountAddress(message.interactor);

  // Get the contract instnace
  const contract = await getContractForErc721OpenEdition(contractAddress);

  // Get encoded data
  const data = await getErc721PreparedEncodedData(accountAddress, contract);

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

import {
  type FrameRequest,
  type FrameValidationData,
  getFrameMessage,
} from "@coinbase/onchainkit";

export function validateFrameMessage(body: FrameRequest) {
  return getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });
}

export function getFarcasterAccountAddress(
  interactor: FrameValidationData["interactor"],
) {
  // Get the first verified account or custody account if first verified account doesn't exist
  return interactor.verified_accounts[0] ?? interactor.custody_address;
}

import type { Chain } from "../src/types";
export default {
  "chainId": 91002,
  "chain": "ETH",
  "name": "Nautilus Trition Chain",
  "rpc": [
    "https://nautilus-trition-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://triton.api.nautchain.xyz"
  ],
  "slug": "nautilus-trition-chain",
  "icon": {
    "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [
    "https://faucet.eclipse.builders"
  ],
  "nativeCurrency": {
    "name": "Nautilus Zebec Testnet Tokens",
    "symbol": "tZBC",
    "decimals": 18
  },
  "infoURL": "https://docs.nautchain.xyz",
  "shortName": "NAUT",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Nautscan",
      "url": "https://triton.nautscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;
import type { Chain } from "../src/types";
export default {
  "name": "Nautilus Trition Chain",
  "title": "Nautilus Trition Testnet",
  "chain": "ETH",
  "icon": {
    "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "rpc": [
    "https://nautilus-trition-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://triton.api.nautchain.xyz"
  ],
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
  "chainId": 91002,
  "networkId": 91002,
  "explorers": [
    {
      "name": "Nautscan",
      "url": "https://triton.nautscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "nautilus-trition-chain"
} as const satisfies Chain;
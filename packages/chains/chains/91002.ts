import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 91002,
  "explorers": [
    {
      "name": "Nautscan",
      "url": "https://triton.nautscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.eclipse.builders"
  ],
  "icon": {
    "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://docs.nautchain.xyz",
  "name": "Nautilus Trition Chain",
  "nativeCurrency": {
    "name": "Nautilus Zebec Testnet Tokens",
    "symbol": "tZBC",
    "decimals": 18
  },
  "networkId": 91002,
  "rpc": [
    "https://nautilus-trition-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://91002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://triton.api.nautchain.xyz"
  ],
  "shortName": "NAUT",
  "slug": "nautilus-trition-chain",
  "testnet": true,
  "title": "Nautilus Trition Testnet"
} as const satisfies Chain;
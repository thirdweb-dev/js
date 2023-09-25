import type { Chain } from "../src/types";
export default {
  "chainId": 6626,
  "chain": "PixieChain",
  "name": "Pixie Chain Mainnet",
  "rpc": [
    "https://pixie-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-mainnet.chain.pixie.xyz",
    "wss://ws-mainnet.chain.pixie.xyz"
  ],
  "slug": "pixie-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Pixie Chain Native Token",
    "symbol": "PIX",
    "decimals": 18
  },
  "infoURL": "https://chain.pixie.xyz",
  "shortName": "pixie-chain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.chain.pixie.xyz",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;
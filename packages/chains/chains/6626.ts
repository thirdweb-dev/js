import type { Chain } from "../src/types";
export default {
  "chain": "PixieChain",
  "chainId": 6626,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.chain.pixie.xyz",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://chain.pixie.xyz",
  "name": "Pixie Chain Mainnet",
  "nativeCurrency": {
    "name": "Pixie Chain Native Token",
    "symbol": "PIX",
    "decimals": 18
  },
  "networkId": 6626,
  "rpc": [
    "https://6626.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-mainnet.chain.pixie.xyz",
    "wss://ws-mainnet.chain.pixie.xyz"
  ],
  "shortName": "pixie-chain",
  "slug": "pixie-chain",
  "testnet": false
} as const satisfies Chain;
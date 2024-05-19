import type { Chain } from "../src/types";
export default {
  "chain": "HashKey",
  "chainId": 230315,
  "explorers": [
    {
      "name": "HashKey Chain Testnet Explorer",
      "url": "https://testnet.hashkeyscan.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://testnet.hashkeychain/faucet"
  ],
  "infoURL": "https://www.hashkey.com",
  "name": "HashKey Chain Testnet(discard)",
  "nativeCurrency": {
    "name": "HashKey Token",
    "symbol": "tHSK",
    "decimals": 18
  },
  "networkId": 230315,
  "rpc": [
    "https://230315.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.hashkeychain/rpc"
  ],
  "shortName": "hsktest",
  "slip44": 1,
  "slug": "hashkey-chain-testnet-discard",
  "testnet": true
} as const satisfies Chain;
import type { Chain } from "../src/types";
export default {
  "chain": "Ecrox Chain",
  "chainId": 988207,
  "explorers": [
    {
      "name": "Ecrox Chain Explorer",
      "url": "https://ecroxscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ecroxcoin.io/",
  "name": "Ecrox Chain Mainnet",
  "nativeCurrency": {
    "name": "ECROX COIN",
    "symbol": "ECROX",
    "decimals": 18
  },
  "networkId": 988207,
  "rpc": [
    "https://988207.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.ecroxscan.com/"
  ],
  "shortName": "ecrox",
  "slug": "ecrox-chain",
  "testnet": false
} as const satisfies Chain;
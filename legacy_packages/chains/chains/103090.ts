import type { Chain } from "../src/types";
export default {
  "chain": "crystal",
  "chainId": 103090,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.crystaleum.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://crystaleum.org",
  "name": "Crystaleum",
  "nativeCurrency": {
    "name": "CRFI",
    "symbol": "◈",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://103090.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.cryptocurrencydevs.org",
    "https://rpc.crystaleum.org"
  ],
  "shortName": "CRFI",
  "slug": "crystaleum",
  "testnet": false
} as const satisfies Chain;
import type { Chain } from "../src/types";
export default {
  "chain": "BLG",
  "chainId": 12321,
  "explorers": [],
  "faucets": [
    "https://faucet.blgchain.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmUN5j2cre8GHKv52JE8ag88aAnRmuHMGFxePPvKMogisC",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://blgchain.com",
  "name": "BLG Testnet",
  "nativeCurrency": {
    "name": "Blg",
    "symbol": "BLG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://blg-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blgchain.com"
  ],
  "shortName": "blgchain",
  "slug": "blg-testnet",
  "testnet": true
} as const satisfies Chain;
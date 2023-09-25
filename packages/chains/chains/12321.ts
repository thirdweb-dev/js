import type { Chain } from "../src/types";
export default {
  "chainId": 12321,
  "chain": "BLG",
  "name": "BLG Testnet",
  "rpc": [
    "https://blg-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blgchain.com"
  ],
  "slug": "blg-testnet",
  "icon": {
    "url": "ipfs://QmUN5j2cre8GHKv52JE8ag88aAnRmuHMGFxePPvKMogisC",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [
    "https://faucet.blgchain.com"
  ],
  "nativeCurrency": {
    "name": "Blg",
    "symbol": "BLG",
    "decimals": 18
  },
  "infoURL": "https://blgchain.com",
  "shortName": "blgchain",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;
import type { Chain } from "../src/types";
export default {
  "chainId": 7027,
  "chain": "ella",
  "name": "Ella the heart",
  "rpc": [
    "https://ella-the-heart.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ella.network"
  ],
  "slug": "ella-the-heart",
  "icon": {
    "url": "ipfs://QmVkAhSaHhH3wKoLT56Aq8dNyEH4RySPEpqPcLwsptGBDm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ella",
    "symbol": "ELLA",
    "decimals": 18
  },
  "infoURL": "https://ella.network",
  "shortName": "ELLA",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Ella",
      "url": "https://ella.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;
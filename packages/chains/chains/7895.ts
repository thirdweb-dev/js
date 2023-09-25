import type { Chain } from "../src/types";
export default {
  "chainId": 7895,
  "chain": "ATHENA",
  "name": "ARDENIUM Athena",
  "rpc": [
    "https://ardenium-athena.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-athena.ardescan.com/"
  ],
  "slug": "ardenium-athena",
  "icon": {
    "url": "ipfs://QmdwifhejRfF8QfyzYrNdFVhfhCR6iuzWMmppK4eL7kttG",
    "width": 120,
    "height": 120,
    "format": "png"
  },
  "faucets": [
    "https://faucet-athena.ardescan.com/"
  ],
  "nativeCurrency": {
    "name": "ARD",
    "symbol": "tARD",
    "decimals": 18
  },
  "infoURL": "https://ardenium.org",
  "shortName": "ard",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "ARDENIUM Athena Explorer",
      "url": "https://testnet.ardscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;
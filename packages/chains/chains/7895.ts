import type { Chain } from "../src/types";
export default {
  "chain": "ATHENA",
  "chainId": 7895,
  "explorers": [
    {
      "name": "ARDENIUM Athena Explorer",
      "url": "https://testnet.ardscan.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmdwifhejRfF8QfyzYrNdFVhfhCR6iuzWMmppK4eL7kttG",
        "width": 120,
        "height": 120,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet-athena.ardescan.com/"
  ],
  "icon": {
    "url": "ipfs://QmdwifhejRfF8QfyzYrNdFVhfhCR6iuzWMmppK4eL7kttG",
    "width": 120,
    "height": 120,
    "format": "png"
  },
  "infoURL": "https://ardenium.org",
  "name": "ARDENIUM Athena",
  "nativeCurrency": {
    "name": "ARD",
    "symbol": "tARD",
    "decimals": 18
  },
  "networkId": 7895,
  "rpc": [
    "https://7895.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-athena.ardescan.com/"
  ],
  "shortName": "ard",
  "slug": "ardenium-athena",
  "testnet": true
} as const satisfies Chain;
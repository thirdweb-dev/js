import type { Chain } from "../src/types";
export default {
  "name": "ARDENIUM Athena",
  "chain": "ATHENA",
  "rpc": [
    "https://ardenium-athena.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-athena.ardescan.com/"
  ],
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
  "chainId": 7895,
  "networkId": 7895,
  "icon": {
    "url": "ipfs://QmdwifhejRfF8QfyzYrNdFVhfhCR6iuzWMmppK4eL7kttG",
    "width": 120,
    "height": 120,
    "format": "png"
  },
  "explorers": [
    {
      "name": "ARDENIUM Athena Explorer",
      "icon": {
        "url": "ipfs://QmdwifhejRfF8QfyzYrNdFVhfhCR6iuzWMmppK4eL7kttG",
        "width": 120,
        "height": 120,
        "format": "png"
      },
      "url": "https://testnet.ardscan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "ardenium-athena"
} as const satisfies Chain;
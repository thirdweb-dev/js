import type { Chain } from "../src/types";
export default {
  "chain": "VANAR",
  "chainId": 78600,
  "explorers": [
    {
      "name": "Vanguard Explorer",
      "url": "https://explorer-vanguard.vanarchain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmeERjnmdZ6v1tfCyfKfy2Rzh1vPCsU7x2sLJcLqQ6E3Fd",
        "width": 1000,
        "height": 1628,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.vanarchain.com"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmeERjnmdZ6v1tfCyfKfy2Rzh1vPCsU7x2sLJcLqQ6E3Fd",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "infoURL": "https://vanarchain.com",
  "name": "Vanguard",
  "nativeCurrency": {
    "name": "Vanguard Vanry",
    "symbol": "VG",
    "decimals": 18
  },
  "networkId": 78600,
  "rpc": [
    "https://78600.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-vanguard.vanarchain.com",
    "wss://ws-vanguard.vanarchain.com"
  ],
  "shortName": "vanguard",
  "slug": "vanguard",
  "testnet": true,
  "title": "Vanar Testnet Vanguard"
} as const satisfies Chain;
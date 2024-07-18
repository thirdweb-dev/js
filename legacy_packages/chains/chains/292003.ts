import type { Chain } from "../src/types";
export default {
  "chain": "Cipherem",
  "chainId": 292003,
  "explorers": [
    {
      "name": "Cipherscan Testnet Explorer",
      "url": "https://cipherscan.net",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmUrWn3VG9Jmg2GToV1dqwZUYwLZHU8daZSXEURs5o6xwt",
        "width": 118,
        "height": 118,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmP8oHKtqUiSxmNcZMFMy5DSFCZQm17uF32FEHojx8HQ5z",
    "width": 118,
    "height": 118,
    "format": "svg"
  },
  "infoURL": "https://www.cipherem.com",
  "name": "Cipherem Testnet",
  "nativeCurrency": {
    "name": "CIP",
    "symbol": "CIP",
    "decimals": 18
  },
  "networkId": 292003,
  "rpc": [
    "https://292003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.cipherem.com"
  ],
  "shortName": "CIP",
  "slip44": 1,
  "slug": "cipherem-testnet",
  "testnet": true
} as const satisfies Chain;
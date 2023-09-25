import type { Chain } from "../src/types";
export default {
  "chainId": 622277,
  "chain": "RTH",
  "name": "Rethereum Mainnet",
  "rpc": [
    "https://rethereum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rethereum.org",
    "https://rethereum.rpc.restratagem.com",
    "https://rpc.rthcentral.org"
  ],
  "slug": "rethereum",
  "icon": {
    "url": "ipfs://bafkreiawlhc2trzyxgnz24vowdymxme2m446uk4vmrplgxsdd74ecpfloq",
    "width": 830,
    "height": 830,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Rethereum",
    "symbol": "RTH",
    "decimals": 18
  },
  "infoURL": "https://www.rethereum.org",
  "shortName": "rth",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "rethereum",
      "url": "https://explorer.rethereum.org",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;
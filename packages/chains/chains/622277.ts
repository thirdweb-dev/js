import type { Chain } from "../src/types";
export default {
  "chain": "RTH",
  "chainId": 622277,
  "explorers": [
    {
      "name": "rethereum",
      "url": "https://explorer.rethereum.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreiawlhc2trzyxgnz24vowdymxme2m446uk4vmrplgxsdd74ecpfloq",
    "width": 830,
    "height": 830,
    "format": "png"
  },
  "infoURL": "https://www.rethereum.org",
  "name": "Rethereum Mainnet",
  "nativeCurrency": {
    "name": "Rethereum",
    "symbol": "RTH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://rethereum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rethereum.org",
    "https://rethereum.rpc.restratagem.com",
    "https://rpc.rthcentral.org"
  ],
  "shortName": "rth",
  "slug": "rethereum",
  "testnet": false
} as const satisfies Chain;